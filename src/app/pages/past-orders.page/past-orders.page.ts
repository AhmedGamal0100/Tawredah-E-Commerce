import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { IOrder } from '../../core/models/order';
import { LoginStore } from '../../core/store/login.store';

interface Order {
  id: string;
  date: Date;
  status: 'Delivered' | 'Cancelled' | 'Pending';
  itemsCount: number;
  total: number;
}
@Component({
  selector: 'app-past-orders.page',
  imports: [CommonModule],
  templateUrl: './past-orders.page.html',
  styleUrl: './past-orders.page.scss',
})
export class PastOrdersPage implements OnInit {
  orders: IOrder[] = [];
  private userStore = inject(LoginStore)
  ngOnInit() {
    const ordersList = this.userStore.loggedAccount()?.ordersList ?? [];

    this.orders = ordersList.map(order => ({
      ...order,
      dueDate: order.dueDate?.toDate ? order.dueDate.toDate() : new Date(order.dueDate)
    })).reverse();
  }

}
