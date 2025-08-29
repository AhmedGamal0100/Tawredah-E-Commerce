import { inject, Injectable } from '@angular/core';
import { INotification } from '../models/notification';
import { UsersService } from './user.service';
import { LoginStore } from '../store/login.store';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private usersService = inject(UsersService);
  private loginStore = inject(LoginStore);

  /** Local copy of notifications */
  private localNotifications: INotification[] = [];

  constructor() {
    // Initialize localNotifications from loggedAccount (if exists)
    const loggedUser = this.loginStore.loggedAccount();
    this.localNotifications = loggedUser?.notifications || [];
  }

  /** Add a notification and sync with Firestore */
  private async addNotification(
    message: string,
    type: 'error' | 'success' | 'info' | 'warning',
    meta?: { sourceType?: string; sourceId?: string; route?: string }
  ) {
    const loggedUser = this.loginStore.loggedAccount();
    if (!loggedUser?.id) return;

    const newNotification: INotification = {
      id: crypto.randomUUID(),
      message,
      type,
      createdAt: new Date().toISOString(),
      read: false,
      ...meta
    };

    // Fetch current notifications from Firestore before pushing
    const user = await this.usersService.getOnce(loggedUser.id);
    const firestoreNotifications = user?.notifications || [];

    // Merge with existing Firestore notifications
    const updatedNotifications = [...firestoreNotifications, newNotification];

    // Update Firestore
    await this.usersService.update(loggedUser.id, { notifications: updatedNotifications });

    // Update local array too
    this.localNotifications = updatedNotifications;
  }


  success(message: string, meta: any = {}) {
    this.addNotification(message, 'success', meta);
  }
  error(message: string, meta: any = {}) {
    this.addNotification(message, 'error', meta);
  }
  info(message: string, meta: any = {}) {
    this.addNotification(message, 'info', meta);
  }
  warning(message: string, meta: any = {}) {
    this.addNotification(message, 'warning', meta);
  }

  /** Push the local notifications array to Firestore */
  private async syncNotifications() {
    const loggedUser = this.loginStore.loggedAccount();
    if (loggedUser?.id) {
      await this.usersService.update(loggedUser.id, { notifications: this.localNotifications });
    }
  }
}
