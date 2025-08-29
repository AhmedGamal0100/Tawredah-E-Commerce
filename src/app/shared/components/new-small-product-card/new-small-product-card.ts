import { Component, effect, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsdToEgpPipe } from '../../pipes/usd-to-egp.pipe';
import { UsersService } from '../../../core/services/user.service';
import { LoginStore } from '../../../core/store/login.store';
import { take } from 'rxjs';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'app-new-small-product-card',
  imports: [CommonModule, UsdToEgpPipe, Toast],
  templateUrl: './new-small-product-card.html',
  styleUrl: './new-small-product-card.scss',
  providers: [MessageService]
})
export class NewSmallProductCard {
  @Input() product: any;
  private userService = inject(UsersService)
  private userStore = inject(LoginStore)
  private token = localStorage.getItem("token");
  private email = localStorage.getItem("email")
  private _messageService = inject(MessageService)
  isWished = false;

  constructor() {
    effect(() => {
      if (this.token && this.email) {
        const userId = this.userStore.loggedAccount()?.id;
        const productId = this.product?.id;

        if (!userId || !productId) return;

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
          this.isWished = false;
        } else {
          updatedWishlist = [...existingWishlist, productId];
          this.showContrast("Info", `${this.product.name} is added to your wishlist`);
          this.isWished = true;
        }

        this.userService.update(userId, { wishListProducts: updatedWishlist })
          .then(() => console.log('Wishlist updated successfully'))
          .catch(error => console.error('Error updating wishlist', error));

        console.log(updatedWishlist);
      });
    } else {
      this.showContrast("Error", "You're not logged in!");
    }
  }


  showContrast(summary: string, detail: string) {
    this._messageService.add({ severity: 'secondary', summary, detail });
  }
}
