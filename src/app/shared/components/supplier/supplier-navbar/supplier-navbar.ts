import {
  Component,
  EventEmitter,
  Input,
  Output,
  HostListener,
  OnInit,
  ElementRef,
  inject,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { RouterModule, Router } from '@angular/router';
import { LoginStore } from '../../../../core/store/login.store';
import { AuthService } from '../../../../core/services/auth.service';
import { IUser } from '../../../../core/models/user';
import { INotification } from '../../../../core/models/notification';

@Component({
  selector: 'app-supplier-navbar',
  standalone: true,
  imports: [
    CommonModule,
    AvatarModule,
    BadgeModule,
    ButtonModule,
    RouterModule,
  ],
  templateUrl: './supplier-navbar.html',
  styleUrls: ['./supplier-navbar.css'],
})
export class SupplierNavbarComponent implements OnInit {
  @Input() sidebarCollapsed: boolean = false;
  @Input() userName: string = 'Supplier';
  @Input() userEmail: string = 'supplier@company.com';
  @Input() darkMode: boolean = false;
  @Input() mobileDrawerVisible: boolean = false;
  @Output() sidebarToggled = new EventEmitter<void>();
  @Output() mobileSidebarToggled = new EventEmitter<boolean>();
  @Output() darkModeToggled = new EventEmitter<void>();
  @Output() themeChanged = new EventEmitter<string>();
  @Output() mobileDrawerVisibleChange = new EventEmitter<boolean>();
  private loginStore = inject(LoginStore);
  private authService = inject(AuthService);
  isLoggedIn!: boolean;
  company!: IUser;
  // companyName = '';
  isCompanyDropdownOpen = false;
  isNotificationsMenuOpen = false;
  currentSubmenu: string | null = null;
  currentTheme = 'light';

  // notifications = [
  //   {
  //     title: 'New Order',
  //     message: 'You have received a new order #12345',
  //     time: '2 hours ago',
  //     icon: 'pi-shopping-cart',
  //     severity: 'info',
  //   },
  //   {
  //     title: 'Inventory Alert',
  //     message: 'Product XYZ is running low on stock',
  //     time: '1 day ago',
  //     icon: 'pi-exclamation-triangle',
  //     severity: 'warning',
  //   },
  //   {
  //     title: 'Payment Received',
  //     message: 'Payment for order #12345 has been received',
  //     time: '3 days ago',
  //     icon: 'pi-credit-card',
  //     severity: 'success',
  //   },
  // ];
  notifications!: INotification[];


  constructor(private router: Router, private elementRef: ElementRef) {
    effect(() => {
      const logAcc = this.loginStore.loggedAccount()
      if (logAcc) {
        this.company = logAcc;
        this.notifications = logAcc.notifications?.reverse() ?? [];
      }
    })
  }

  ngOnInit() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.applyDarkMode(true);
    } else if (savedTheme === 'light') {
      this.applyDarkMode(false);
    } else {
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      this.applyDarkMode(prefersDark);
    }
  }

  get unreadNotifications(): number {
    return this.notifications.length;
  }

  toggleSidebar() {
    this.sidebarToggled.emit();
  }

  toggleMobileSidebar() {
    const newState = !this.mobileDrawerVisible;
    this.mobileDrawerVisibleChange.emit(newState);
    this.mobileSidebarToggled.emit(newState);
  }

  toggleNotificationsMenu(event: Event) {
    event.stopPropagation();
    this.isNotificationsMenuOpen = !this.isNotificationsMenuOpen;
  }

  viewAllNotifications() {
    this.router.navigate(['/notifications']);
    this.isNotificationsMenuOpen = false;
  }

  toggleTheme() {
    this.darkMode = !this.darkMode;
    this.applyDarkMode(this.darkMode);
    this.darkModeToggled.emit();
    localStorage.setItem('theme', this.darkMode ? 'dark' : 'light');
  }

  applyDarkMode(isDark: boolean) {
    this.darkMode = isDark;
    const element = document.documentElement;

    if (isDark) {
      element.classList.add('my-add-dark');
      element.setAttribute('data-theme', 'dark');
    } else {
      element.classList.remove('my-add-dark');
      element.setAttribute('data-theme', 'light');
    }
  }

  toggleCompanyDropdown(event: Event) {
    event.stopPropagation();
    this.isCompanyDropdownOpen = !this.isCompanyDropdownOpen;
    if (!this.isCompanyDropdownOpen) {
      this.currentSubmenu = null;
    }
  }

  logout() {
    this.loginStore.setLogOut();
    this.loginStore.setEmail("")
    this.authService.logout().then(() => {
      const currentUrl = this.router.url;
      localStorage.removeItem('token');
      localStorage.removeItem('email');
      this.router.navigate(['']);
      // window.location.reload();
    });

    this.isLoggedIn = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    const notificationMenu =
      this.elementRef.nativeElement.querySelector('.notification-menu');
    const notificationBtn =
      this.elementRef.nativeElement.querySelector('.notification-btn');
    const companyDropdown = this.elementRef.nativeElement.querySelector(
      '.company-dropdown-container'
    );

    // إغلاق قائمة الشركة عند النقر خارجها
    if (
      this.isCompanyDropdownOpen &&
      companyDropdown &&
      !companyDropdown.contains(target)
    ) {
      this.isCompanyDropdownOpen = false;
      this.currentSubmenu = null;
    }

    // إغلاق قائمة الإشعارات عند النقر خارجها
    if (
      this.isNotificationsMenuOpen &&
      notificationMenu &&
      notificationBtn &&
      !notificationBtn.contains(target) &&
      !notificationMenu.contains(target)
    ) {
      this.isNotificationsMenuOpen = false;
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey() {
    if (this.isNotificationsMenuOpen) {
      this.isNotificationsMenuOpen = false;
    }

    if (this.isCompanyDropdownOpen) {
      this.isCompanyDropdownOpen = false;
      this.currentSubmenu = null;
    }
  }
}
