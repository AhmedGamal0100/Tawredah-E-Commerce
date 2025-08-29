import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CartService } from '../../shared/services/cart-service';
import { ToastModule } from 'primeng/toast';
import { OrderService } from '../../core/services/order.service';
import { MessageService } from 'primeng/api';
import { LoginStore } from '../../core/store/login.store';
import { UsersService } from '../../core/services/user.service';
import { IUser } from '../../core/models/user';
import { IOrder } from '../../core/models/order';
import { Router } from '@angular/router';
import { INotification } from '../../core/models/notification';
// import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-checkout.page',
  imports: [CommonModule, FormsModule, ButtonModule, ToastModule],
  templateUrl: './checkout.page.html',
  styleUrl: './checkout.page.scss',
  providers: [MessageService]
})
export class CheckoutPage {
  private orderService = inject(OrderService);
  private messageService = inject(MessageService);
  private userService = inject(UsersService)
  private loginStore = inject(LoginStore);
  private loggedAccount: IUser | null = null;
  private router = inject(Router)
  cartItems: any[] = [];
  shippingPrice: number = 0;
  subtotalPrice: number = 0;
  totalPrice: number = 0;

  ngOnInit() {
    const order = this.orderService.getOrder();
    if (order) {
      this.shippingPrice = order.price.shipping;
      this.totalPrice = order.price.total;
      this.subtotalPrice = order.price.subtotal;
    }

    this.loggedAccount = this.loginStore.loggedAccount() ?? null;
  }
  // Shipping details
  shippingDetails = {
    name: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
  };

  // Payment details
  paymentMethod = 'cod';
  paymentDetails = {
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  };

  // constructor(
  //   private cartService: CartService // private messageService: MessageService
  // ) { }

  // ngOnInit(): void {
  //   // Subscribe to cart items
  //   this.cartService.cartItems$.subscribe((items) => {
  //     this.cartItems = items;
  //     this.calculateTotal();
  //   });

  //   // Subscribe to shipping price
  //   this.cartService.shippingPrice$.subscribe((price) => {
  //     this.shippingPrice = price;
  //     this.calculateTotal();
  //   });
  // }

  /** Calculate discounted unit price */
  // private getDiscountedUnitPrice(item: any): number {
  //   const selectedTier = item.price.discountTiers[item.selectedTierIndex];
  //   const unitPrice = item.price.unit;
  //   return unitPrice - (unitPrice * selectedTier.percent) / 100;
  // }

  /** Calculate subtotal using discount tiers */
  // getSubtotal(): number {
  //   return this.cartItems.reduce((sum, item) => {
  //     const selectedTier = item.price.discountTiers[item.selectedTierIndex];
  //     const discountedUnitPrice = this.getDiscountedUnitPrice(item);
  //     return sum + selectedTier.minQty * discountedUnitPrice;
  //   }, 0);
  // }

  /** Total = subtotal + shipping */
  // getTotal(): number {
  //   return this.getSubtotal() + this.shippingPrice;
  // }

  // private calculateTotal() {
  //   this.totalPrice = this.getTotal();
  // }
  async placeOrder() {
    // Validate shipping details
    if (!this.shippingDetails.name || !this.shippingDetails.address || !this.shippingDetails.city || !this.shippingDetails.postalCode || !this.shippingDetails.phone) {
      this.messageService.add({
        severity: 'error',
        summary: 'Missing Shipping Info',
        detail: 'Please fill in all shipping details before placing the order.',
        life: 4000
      });
      return;
    }

    // Validate payment details if Credit Card
    if (this.paymentMethod === 'card') {
      if (!this.paymentDetails.cardNumber || !this.paymentDetails.cardName || !this.paymentDetails.expiry || !this.paymentDetails.cvv) {
        this.messageService.add({
          severity: 'error',
          summary: 'Missing Payment Info',
          detail: 'Please complete all credit card details before placing the order.',
          life: 4000
        });
        return;
      }
    }

    // Update OrderService
    this.orderService.updatePaymentMethod(
      this.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Credit Card'
    );
    this.orderService.updateShippingDetails(this.shippingDetails);
    if (this.paymentMethod === 'card') {
      this.orderService.updatePaymentDetails(this.paymentDetails);
    }
    this.orderService.updateStatus('Review');
    this.orderService.updateOrderDate(new Date(
      new Date().getTime() - new Date().getTimezoneOffset() * 60000
    ));

    const updatedOrder = this.orderService.getOrder();
    if (!updatedOrder) return;

    try {
      // Add order to the logged-in user's ordersList
      const existingOrders = this.loggedAccount?.ordersList || [];
      existingOrders.push(updatedOrder);
      await this.userService.update(this.loggedAccount!.id, { ordersList: existingOrders });
      this.loggedAccount!.ordersList = existingOrders;

      // Group products by supplier
      const products = updatedOrder.orderProducts || [];
      const factoryOrders: Record<string, any[]> = {};

      for (const product of products) {
        const supplierBusinessName = product.supplier.name; // Use businessName
        if (!factoryOrders[supplierBusinessName]) {
          factoryOrders[supplierBusinessName] = [];
        }
        factoryOrders[supplierBusinessName].push(product);
      }

      // Update each supplier (factory) by businessName
      for (const [businessName, factoryProducts] of Object.entries(factoryOrders)) {
        const factoryUser = await this.userService.getUserByBusinessName(businessName);
        if (factoryUser) {
          const factoryOrdersList = factoryUser.ordersList || [];
          const factoryOrder: IOrder = {
            ...updatedOrder,
            id: updatedOrder.id ?? '',
            orderProducts: factoryProducts,
            to: [factoryUser.id]
          };
          factoryOrdersList.push(factoryOrder);

          // Create notification object with ID based on timestamp
          const newNotification: INotification = {
            id: Date.now().toString(), // ID from timestamp
            message: `You have a new order (#${updatedOrder.id}), from ${this.loggedAccount?.businessName} containing ${factoryProducts.length} item(s).`,
            type: 'info', // Notification type
            createdAt: new Date().toISOString(), // ISO date
            read: false,
            sourceType: 'order',
            sourceId: updatedOrder.id ?? '',
            route: `/orders/${updatedOrder.id}`
          };

          // Merge notifications
          const updatedNotifications = factoryUser.notifications || [];
          updatedNotifications.push(newNotification);

          // Update supplier with orders and notifications
          await this.userService.update(factoryUser.id, {
            ordersList: factoryOrdersList,
            notifications: updatedNotifications
          });
        }
      }



      this.userService.update(this.loggedAccount!.id, { cartProducts: [] })

      this.messageService.add({
        severity: 'success',
        summary: 'Order Placed!',
        detail: 'Your order has been successfully placed and sent to suppliers.',
        life: 4000
      });

      setTimeout(() => {
        this.router.navigateByUrl('/pastorders')
      }, 3000)

    } catch (error) {
      console.error('Error placing order:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Something went wrong while saving your order.',
        life: 4000
      });
    }
  }


}
