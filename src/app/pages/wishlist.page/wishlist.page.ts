import { CommonModule } from '@angular/common';

import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { LoginStore } from '../../core/store/login.store';
import { ProductsService } from '../../core/services/products';
import { IProduct } from '../../core/models/product';
import { ProductsStore } from '../../core/store/products.store';
import { UsdToEgpPipe } from "../../shared/pipes/usd-to-egp.pipe";
import { take } from 'rxjs';
import { MessageService } from 'primeng/api';
import { UsersService } from '../../core/services/user.service';
import { ToastModule } from 'primeng/toast';


@Component({
  selector: 'app-wishlist.page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ButtonModule,
    UsdToEgpPipe,
    ToastModule
  ],

  templateUrl: './wishlist.page.html',
  styleUrl: './wishlist.page.scss',

  providers: [MessageService]
})
export class WishlistPage {
  private loginStore = inject(LoginStore);
  private productService = inject(ProductsService);
  private token = localStorage.getItem("token");
  private _messageService = inject(MessageService)
  private email = localStorage.getItem("email")
  private userService = inject(UsersService)
  isWished = false;
  removingItems: Set<string> = new Set();
  wishlistItems: IProduct[] = [];

  async ngOnInit(): Promise<void> {
    const wishList = this.loginStore.loggedAccount()?.wishListProducts;
    console.log('Wish List IDs:', wishList);

    if (wishList && wishList.length > 0) {
      const promises = wishList.map(id => this.productService.getProductsByIds(id));
      const items = await Promise.all(promises);
      console.log(items);

      this.wishlistItems = items.filter(item => item !== null) as IProduct[];
      console.log('Wishlist Items:', this.wishlistItems);
    }
  }

  private _productsStore = inject(ProductsStore);

  products = signal<IProduct[]>([]);


  constructor() {
    effect(() => {
      let storeProduct = this._productsStore.products();
      if (storeProduct) {
        this.products.set(storeProduct);
      }
      console.log(this.products());
    });
  }

  getPriceRange(item: any): { min: number; max: number } {
    const unitPrice = item.price.unit;

    const prices = item.price.discountTiers.map((tier: any) => {
      const discountedUnitPrice = unitPrice - (unitPrice * tier.percent) / 100;
      return tier.minQty * discountedUnitPrice;
    });

    const min = Math.min(...prices);
    const max = Math.max(...prices);

    return { min, max };
  }

  // navigate to product details page
  private router = inject(Router);

  goToDetails(product: IProduct) {
    this.router.navigate(['/productDetails', product.id]);
    console.log(product);
  }

  removeFromWishList(product: IProduct) {
    if (this.token && this.email) {
      const userId = this.loginStore.loggedAccount()?.id;
      const productId = product?.id;

      if (!userId || !productId) return;

      this.userService.get$(userId).pipe(take(1)).subscribe(user => {
        const existingWishlist: string[] = user?.wishListProducts || [];

        if (existingWishlist.includes(productId)) {
          const updatedWishlist = existingWishlist.filter(id => id !== productId);

          this.userService.update(userId, { wishListProducts: updatedWishlist })
            .then(() => {
              this.removingItems.add(productId); // Add to removing set

              setTimeout(() => {
                this.wishlistItems = this.wishlistItems.filter(item => item.id !== productId);
                this.removingItems.delete(productId); // Cleanup
              }, 300);

              this.showContrast("Info", `${product.name} is removed from your wishlist`);
              this.isWished = false;
            })
            .catch(error => {
              console.error('Error removing from wishlist', error);
              this.showContrast("Error", "Could not update wishlist");
            });
        } else {
          this.showContrast("Info", `${product.name} is not in your wishlist`);
        }
      });
    } else {
      this.showContrast("Error", "You're not logged in!");
    }
  }

  showContrast(summary: string, detail: string) {
    this._messageService.add({ severity: 'secondary', summary, detail });

  }
}
