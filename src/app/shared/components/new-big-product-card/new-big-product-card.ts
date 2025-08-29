import { Component, effect, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsdToEgpPipe } from '../../pipes/usd-to-egp.pipe';
import { UsersService } from '../../../core/services/user.service';
import { LoginStore } from '../../../core/store/login.store';
import { take } from 'rxjs';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { Router } from '@angular/router';
import { IProduct } from '../../../core/models/product';
import { NotificationService } from '../../../core/services/notification.service';




@Component({
  selector: 'app-new-big-product-card',
  imports: [CommonModule, Toast],
  templateUrl: './new-big-product-card.html',
  styleUrl: './new-big-product-card.scss',
  providers: [MessageService]
})
export class NewBigProductCard {
  @Input() product!: IProduct;
  private userService = inject(UsersService)
  private userStore = inject(LoginStore)
  private token = localStorage.getItem("token");
  private email = localStorage.getItem("email")
  private _messageService = inject(MessageService)
  private notificationService = inject(NotificationService)
  isWished = false;
  role = '';

  constructor() {
    effect(() => {
      if (this.token && this.email) {
        const userId = this.userStore.loggedAccount()?.id;
        const productId = this.product?.id;


        if (!userId || !productId) return;
        this.role = this.userStore.loggedAccount()!.role;
        this.userService.get$(userId).pipe(take(1)).subscribe(user => {
          const existingWishlist: string[] = user?.wishListProducts || [];
          this.isWished = existingWishlist.includes(productId);
        });
      }
    })
  }

  addToWishList() {
    if (this.token && this.email) {
      const userId = this.userStore.loggedAccount()?.id;
      const productId = this.product?.id;

      if (!userId || !productId) return;

      this.userService.get$(userId).pipe(take(1)).subscribe(user => {
        const existingWishlist: string[] = user?.wishListProducts || [];
        let updatedWishlist: string[];

        if (existingWishlist.includes(productId)) {
          updatedWishlist = existingWishlist.filter(id => id !== productId);
          this.showContrast("Info", `${this.product.name} is removed from your wishlist`);
          this.notificationService.info(`${this.product.name} is removed from your wishlist`);
          this.isWished = false;
        } else {
          updatedWishlist = [...existingWishlist, productId];
          this.showContrast("Info", `${this.product.name} is added to your wishlist`);
          this.notificationService.success(`${this.product.name} is added to your wishlist`, { sourceType: 'product', sourceId: productId, route: `/wishlist` });
          this.isWished = true;
        }

        this.userService.update(userId, { wishListProducts: updatedWishlist })
          .then(() => console.log('Wishlist updated successfully'))
          .catch(error => console.error('Error updating wishlist', error));
      });
    } else {
      this.showContrast("Error", "You're not logged in!");
    }
  }

  private router = inject(Router);

  goToDetails(product: IProduct) {
    this.router.navigate(['/productDetails', product.id]);
    console.log(product);
  }

  price(index: number = 0): string {
    const moq = this.product.price.discountTiers[index].minQty
    const percent = this.product.price.discountTiers[index].percent
    const priceAfterDiscount = moq * (1 - percent / 100);
    return (priceAfterDiscount * this.product.price.unit).toFixed(1);
  }

  showContrast(summary: string, detail: string) {
    this._messageService.add({ severity: 'secondary', summary, detail });
  }
}
