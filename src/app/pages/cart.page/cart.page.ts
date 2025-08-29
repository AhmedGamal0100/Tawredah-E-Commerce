import { IProduct } from './../../core/models/product';
import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../shared/services/cart-service';
import { ProductsStore } from '../../core/store/products.store';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { LoginStore } from '../../core/store/login.store';
import { UsersService } from '../../core/services/user.service';
import { take } from 'rxjs';
import { ToastModule } from 'primeng/toast';
import { UsdToEgpPipe } from '../../shared/pipes/usd-to-egp.pipe';
import { OrderService } from '../../core/services/order.service';
// import { cartService } from '../../core/services/cart.service';
@Component({
  selector: 'app-cart.page',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    ConfirmDialogModule,
    ToastModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './cart.page.html',
  styleUrl: './cart.page.scss',
})
export class CartPage {
  private _productsStore = inject(ProductsStore);
  private _loginStore = inject(LoginStore);
  products = signal<IProduct[]>([]);
  cartItems!: IProduct[];
  private token = localStorage.getItem("token");
  private _messageService = inject(MessageService)
  private email = localStorage.getItem("email")
  private userService = inject(UsersService)
  private router = inject(Router)
  private orderService = inject(OrderService);
  constructor(
    private cartService: CartService,
    private confirmationService: ConfirmationService
  ) {
    effect(() => {
      let storeProduct = this._productsStore.products();
      if (storeProduct) {
        this.products.set(storeProduct);
      }
    });
    effect(() => {
      let LoginStore = this._loginStore.loggedAccount()?.cartProducts;
      if (LoginStore !== undefined && LoginStore.length > 0) {
        this.cartItems = LoginStore;
      }
    });
  }

  // shipping = 150;

  // Shipping options data
  shippingOptions = [
    {
      id: 'ShipFast',
      name: 'ShipFast Couriers',
      price: 1000,
      rating: 4.0,
      time: '1–2 days',
      badge: 'Fastest',
    },
    {
      id: 'EcoShip',
      name: 'EcoShip Logistics',
      price: 700,
      rating: 4.5,
      time: '3–5 days',
      badge: 'Cheapest',
    },
    {
      id: 'SwiftPost',
      name: 'SwiftPost',
      price: 850,
      rating: 3.0,
      time: '2–4 days',
      badge: '',
    },
  ];

  selectedShipping = this.shippingOptions[1];
  ngOnInit(): void {
    // Push initial data to service
    this.cartService.setCartItems(this.cartItems);
    this.cartService.setShippingPrice(this.selectedShipping.price);
  }

  removeFromCart(itemId: string, itemName: string): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to remove "${itemName}" from your cart?`,
      header: 'Confirm Removal',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary p-button-outlined',
      accept: () => {
        const element = document.getElementById(`cart-item-${itemId}`);
        if (element) {
          this.removeFromCartFireBase(itemId, itemName);
          element.classList.add('removing');
          setTimeout(() => {
            this.cartItems = this.cartItems.filter(
              (item) => item.id !== itemId
            );
            // this.cartService.setCartItems(this.cartItems);
          }, 300);
        } else {
          this.cartItems = this.cartItems.filter((item) => item.id !== itemId);
          // this.cartService.setCartItems(this.cartItems);
        }
      },
    });
  }


  removeFromCartFireBase(productId: string, productName?: string): void {
    const userId = this._loginStore.loggedAccount()?.id;
    if (!userId) {
      this.showContrast("Error", "You're not logged in!");
      return;
    }

    this.userService.get$(userId).pipe(take(1)).subscribe(user => {
      const existingCart: IProduct[] = user?.cartProducts || [];
      const updatedCart = existingCart.filter(p => p.id !== productId);

      // Update Firestore
      this.userService.update(userId, { cartProducts: updatedCart })
        .then(() => {
          this.showContrast("Success", `${productName} removed from cart`);
        })
        .catch(error => console.error('Error removing item from cart', error));
    });
  }


  get shippingCost(): number {
    return this.cartItems.length > 0 ? this.selectedShipping.price : 0;
  }

  getSubtotal(): number {
    let totalPrice = 0
    this.cartItems.forEach(item => {
      totalPrice += this.getItemPrice(item)
    })
    return totalPrice
  }

  getTotal(): number {
    return this.getSubtotal() + this.shippingCost;
  }

  onShippingChange(option: any) {
    this.selectedShipping = option;
    this.cartService.setShippingPrice(option.price);
  }

  // updateQuantity(product: any, newQuantity: number) {
  //   product.quantity = newQuantity;
  //   this.cartService.setCartItems(this.cartItems); // updates observable
  // }

  // updateShipping(price: number) {
  //   this.cartService.setShippingPrice(price);
  // }

  // for product prices
  getItemPrice(item: any): number {
    const selectedTier = item.selectedOptions?.tier;
    const unitPrice = item.price.unit;
    const discountedUnitPrice =
      unitPrice - (unitPrice * selectedTier.percent) / 100;

    // Total price = discounted unit price * chosen minQty
    return selectedTier.minQty * discountedUnitPrice;
  }

  onTierChange(item: IProduct, tierIndex: number): void {
    const selectedTier = item.price.discountTiers[tierIndex];
    if (!selectedTier) return;

    // ✅ Update local object immediately for instant UI feedback
    item.selectedOptions = {
      ...item.selectedOptions,
      tier: selectedTier
    };

    const userId = this._loginStore.loggedAccount()?.id;
    if (!userId) {
      this.showContrast("Error", "You're not logged in!");
      return;
    }

    // ✅ Fetch user's current cart and update it
    this.userService.get$(userId).pipe(take(1)).subscribe(user => {
      const existingCart: IProduct[] = user?.cartProducts || [];

      const index = existingCart.findIndex(p => p.id === item.id);
      if (index !== -1) {
        existingCart[index] = {
          ...existingCart[index],
          selectedOptions: item.selectedOptions
        };

        // ✅ Update Firestore with the new cart array
        this.userService.update(userId, { cartProducts: existingCart })
          .then(() => {
            this.showContrast("Success", "Tier updated successfully");
          })
          .catch(error => console.error('Error updating cart', error));
      }
    });
  }

  showContrast(summary: string, detail: string) {
    this._messageService.add({ severity: 'secondary', summary, detail });
  }

  goToCheckout() {
    if (this.cartItems.length === 0) {
      this.showContrast("Info", "Your cart is empty!");
      return;
    }
    if (!this.token) {
      this.showContrast("Error", "You're not logged in!");
      return;
    }
    const factories: string[] = []
    this.cartItems.forEach(item => factories.push(item.supplier.name))
    this.orderService.initializeOrder(
      this._loginStore.loggedAccount()?.id || '',
      factories,
      this.cartItems,
      this.getSubtotal(),
      this.shippingCost,
      this.getTotal(),
    )

    setTimeout(() => {
      this.router.navigate(['/checkout']);
    }, 500);
  }
}
