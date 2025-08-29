import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItemsSource = new BehaviorSubject<any[]>([]);
  cartItems$ = this.cartItemsSource.asObservable();

  private shippingPriceSource = new BehaviorSubject<number>(0);
  shippingPrice$ = this.shippingPriceSource.asObservable();

  constructor() {}

  setCartItems(items: any[]) {
    this.cartItemsSource.next(items);
  }

  setShippingPrice(price: number) {
    this.shippingPriceSource.next(price);
  }

  getCartItemsValue() {
    return this.cartItemsSource.value;
  }

  getShippingPriceValue() {
    return this.shippingPriceSource.value;
  }

  // 🆕 Clear cart after checkout
  clearCart() {
    this.cartItemsSource.next([]);
    this.shippingPriceSource.next(0);
  }
}
