import { effect, inject, Injectable } from '@angular/core';
import { IProduct } from '../models/product';
import { IOrder } from '../models/order';
import { IUser } from '../models/user';
import { LoginStore } from '../store/login.store';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private order: IOrder | null = null;
  // private userStore = inject(LoginStore)
  // cartProducts: IProduct[] = [];
  // subtotal: number = 0;
  // shipping: number = 0;
  // total: number = 0;

  /**
   * Step 1: Initialize order when entering checkout
   */
  initializeOrder(from: string, to: string[], products: IProduct[], subtotal: number, shipping: number, total: number): void {
    this.order = {
      id: 'order-' + new Date().getTime(),
      from,
      to: [...to],
      price: {
        subtotal: subtotal,
        shipping: shipping,
        total: total,
      },
      dueDate: null,
      items: products.length,
      status: 'Pending',
      orderProducts: products,
      paymentMethod: 'Cash on Delivery'
    };
  }

  /**
   * Step 2: Update payment method during checkout
   */
  updatePaymentMethod(paymentMethod: 'Cash on Delivery' | 'Credit Card'): void {
    if (this.order) {
      this.order.paymentMethod = paymentMethod;
    }

    console.log(this.order);

  }

  updateShippingDetails(details: { name: string; address: string; city: string; postalCode: string; phone: string }): void {
    if (this.order) {
      this.order.shippingDetails = { ...details };
    }
  }

  updatePaymentDetails(details: { cardNumber: string; cardName: string; expiry: string; cvv: string }): void {
    if (this.order) {
      this.order.paymentDetails = { ...details };
    }
  }

  /**
   * Step 3: Update due date or shipping details if needed
   */
  updateDueDate(date: Date): void {
    if (this.order) {
      this.order.dueDate = date;
    }
  }

  /**
   * Step 4: Update order status (e.g., after successful payment)
   */
  updateStatus(status: IOrder['status']): void {
    if (this.order) {
      this.order.status = status;
    }
  }

  /**
   * Get current order
   */
  getOrder(): IOrder | null {
    return this.order;
  }

  /**
   * Clear order after checkout completion
   */
  clearOrder(): void {
    this.order = null;
  }


  updateOrderDate(date: Date): void {
    if (this.order) {
      this.order.dueDate = date;
    }
  }
}