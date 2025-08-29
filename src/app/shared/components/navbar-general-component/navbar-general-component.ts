import { CommonModule } from '@angular/common';
import { Component, effect, HostListener, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LoginStore } from '../../../core/store/login.store';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar-general-component',
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar-general-component.html',
  styleUrl: './navbar-general-component.scss',
})
export class NavbarGeneralComponent {
  isDarkMode = false;
  isMobile = false;
  isTablet = false;
  menuOpen = false;
  private loginStore = inject(LoginStore);
  private router = inject(Router);
  private authService = inject(AuthService);
  role!: string;
  isLoggedIn!: boolean;
  userName: string = '';
  allNavItems = [
    { name: 'Home', menuName: 'Home', link: '', icon: 'pi pi-home' },
    {
      name: 'Products',
      menuName: 'Products',
      link: '/products',
      icon: 'pi pi-shopping-bag',
    },
    {
      name: 'Requests',
      menuName: 'Requests',
      link: '/requested-products',
      icon: 'pi pi-box',
    },
    // {
    //   name: 'Orders',
    //   menuName: 'Orders',
    //   link: '/pastorders',
    //   icon: 'pi pi-clone',
    // },
    { name: 'Login', menuName: 'Login', link: '/login', icon: 'pi pi-sign-in' },
    {
      name: 'Register',
      menuName: 'Register',
      link: '/register',
      icon: 'pi pi-user-plus',
    },
  ];
  wishListCount = 0;
  cartCount = 0
  notificationCount = 0

  constructor() {
    effect(() => {
      if (this.loginStore.email()) {
        this.isLoggedIn = this.loginStore.isLogin();
        this.userName = this.loginStore.loggedAccount()?.businessName ?? '';
        this.wishListCount = this.loginStore.loggedAccount()?.wishListProducts?.length ?? 0;
        this.cartCount = this.loginStore.loggedAccount()?.cartProducts?.length ?? 0;
        this.notificationCount = this.loginStore.loggedAccount()?.notifications?.length ?? 0;
        this.role = this.loginStore.loggedAccount()?.role ?? '';
      }
    });
  }

  onInit() {
    const token = localStorage.getItem('token');
    if (token) {
      if (token === 'true') {
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    }
  }

  get mainNavItems() {
    return this.allNavItems.filter(
      (item) => !['Login', 'Register'].includes(item.name)
    );
  }

  get isTabletOrMobile(): boolean {
    return this.isTablet || this.isMobile;
  }

  get filteredMobileNavItems() {
    if (this.isTabletOrMobile) {
      if (this.isLoggedIn) {
        return [
          { name: 'Home', link: '', icon: 'pi pi-home' },
          { name: 'Products', link: '/products', icon: 'pi pi-shopping-bag' },
          {
            name: 'Requests',
            link: '/requested-products',
            icon: 'pi pi-box',
          },
          // {
          //   name: 'Orders',
          //   link: '/pastorders',
          //   icon: 'pi pi-clone',
          // },
          { name: 'Profile', link: '/profile', icon: 'pi pi-user' },
          { name: 'Logout', link: '', icon: 'pi pi-sign-out' },
        ];
      } else {
        return [
          { name: 'Home', link: '', icon: 'pi pi-home' },
          { name: 'Products', link: '/products', icon: 'pi pi-shopping-bag' },
          {
            name: 'Requests',
            link: '/requested-products',
            icon: 'pi pi-box',
          },
          { name: 'Login', link: '/login', icon: 'pi pi-sign-in' },
          { name: 'Register', link: '/register', icon: 'pi pi-user-plus' },
        ];
      }
    }
    return this.mainNavItems;
  }

  toggleTheme() {
    const element = document.querySelector('html');
    if (element) {
      element.classList.toggle('my-add-dark');
    }
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  @HostListener('window:resize')
  onResize() {
    const width = window.innerWidth;
    this.isMobile = width <= 412;
    this.isTablet = width > 412 && width <= 768;
    if (!this.isTabletOrMobile) {
      this.menuOpen = false;
    }
  }

  ngOnInit() {
    this.onResize();
  }

  //Login and logout toggle
  isDropdownOpen = false;

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout() {
    // AuthService logout logic
    this.loginStore.setLogOut();
    this.loginStore.setEmail("")
    this.authService.logout().then(() => {
      const currentUrl = this.router.url;
      localStorage.removeItem('token');
      localStorage.removeItem('email');
      this.router.navigate(['']);
      setTimeout(() => {
        window.location.reload();
      }, 1000)
    });

    this.isLoggedIn = false;
    this.isDropdownOpen = false;
  }

  // Close dropdown on outside click
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;

    // Always close dropdown on outside click
    this.isDropdownOpen = false;
    // Close mobile menu if open and click is outside it and outside the menu button
    if (this.menuOpen && this.isTabletOrMobile) {
      const menuElement = document.querySelector('.dropdown-menu'); // Mobile menu container
      const toggleButton = document.querySelector('.menu-btn'); // Mobile menu button

      if (
        menuElement &&
        !menuElement.contains(target) &&
        toggleButton &&
        !toggleButton.contains(target)
      ) {
        this.menuOpen = false;
      }
    }
  }
}
