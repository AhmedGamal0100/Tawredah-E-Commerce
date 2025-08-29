import { CommonModule } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { LoginStore } from '../../../core/store/login.store';
import { IOrder } from '../../../core/models/order';

@Component({
  selector: 'app-recent-orders.page',
  imports: [
    CommonModule,
    CardModule,
    TableModule,
    TagModule,
  ],
  templateUrl: './recent-orders.page.html',
  styleUrl: './recent-orders.page.css',
})
export class RecentOrdersPage {
  loginStore = inject(LoginStore);

  orders: any[] = [];
  selectedOrder: any | null = null;

  ngOnInit() {
    const account = this.loginStore.loggedAccount();

    if (account?.ordersList?.length) {
      this.orders = account.ordersList.map((order: IOrder) => ({
        id: order.id,
        customer: order.paymentDetails?.cardName ?? 'Unknown',
        date: order.dueDate?.seconds
          ? new Date(order.dueDate.seconds * 1000).toLocaleDateString()
          : '',
        amount: order.price?.total ?? 0,
        status: order.status,
        productName:order.orderProducts[0].name,
        fullOrder: order
      }));
    }
  }

  selectOrder(order: any) {
    this.selectedOrder = this.selectedOrder?.id === order.id ? null : order;
  }

  getSeverity(status: string) {
    switch (status) {
      case 'Delivered':
        return 'success';
      case 'Shipped':
        return 'info';
      case 'Pending':
        return 'warning';
      case 'Cancelled':
        return 'danger';
      default:
        return '';
    }
  }
}
