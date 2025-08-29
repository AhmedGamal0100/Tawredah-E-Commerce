import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { INotification } from '../../core/models/notification';
import { LoginStore } from '../../core/store/login.store';
import { UsersService } from '../../core/services/user.service';
import { RouterLink, RouterModule } from '@angular/router';

// interface Notification {
//   id: number;
//   title: string;
//   message: string;
//   time: string;
//   read: boolean;
// }
@Component({
  selector: 'app-notifications.page',
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './notifications.page.html',
  styleUrl: './notifications.page.scss',
})
export class NotificationsPage {
  // notifications: Notification[] = [
  //   {
  //     id: 1,
  //     title: 'Order Shipped',
  //     message: 'Your order #12345 has been shipped.',
  //     time: '2 hours ago',
  //     read: false,
  //   },
  //   {
  //     id: 2,
  //     title: 'New Discount',
  //     message: 'Get 20% off your next purchase.',
  //     time: 'Yesterday',
  //     read: false,
  //   },
  //   {
  //     id: 3,
  //     title: 'Welcome!',
  //     message: 'Thanks for joining Tawredah!',
  //     time: '2 days ago',
  //     read: true,
  //   },
  //   {
  //     id: 4,
  //     title: 'Order Delivered',
  //     message: 'Your order #12345 has been delivered successfully.',
  //     time: '3 days ago',
  //     read: true,
  //   },
  //   {
  //     id: 5,
  //     title: 'Password Changed',
  //     message: 'Your account password was updated recently.',
  //     time: '5 days ago',
  //     read: true,
  //   },
  //   {
  //     id: 6,
  //     title: 'New Product Alert',
  //     message: 'Check out our latest arrivals in electronics.',
  //     time: '1 week ago',
  //     read: true,
  //   },
  // ];
  private loginStore = inject(LoginStore);
  private userService = inject(UsersService);
  notifications: INotification[] = [];

  constructor() {
    effect(() => {
      this.notifications = this.loginStore.loggedAccount()?.notifications?.slice().reverse() || [];
    })
  }

  toggleRead(notification: INotification) {
    const userId = this.loginStore.loggedAccount()?.id;
    if (!userId) return;

    // Toggle the read status
    notification.read = !notification.read;

    // Update the notifications array in the user document
    const updatedNotifications = this.loginStore.loggedAccount()?.notifications?.map(n =>
      n.createdAt === notification.createdAt ? notification : n
    ) || [];

    this.userService.update(userId, { notifications: updatedNotifications })
      .then(() => console.log('Notification status updated'))
      .catch(error => console.error('Error updating notification status', error));
  }

  clearNotifications(){
    const userId = this.loginStore.loggedAccount()?.id;
    if (!userId) return;

    this.userService.update(userId, { notifications: [] })
      .then(() => console.log('All notifications cleared'))
      .catch(error => console.error('Error clearing notifications', error));
  }
}
