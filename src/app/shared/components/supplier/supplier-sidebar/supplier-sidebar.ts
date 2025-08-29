import {
  Component,
  EventEmitter,
  Input,
  Output,
  HostListener,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

interface MenuItem {
  label: string;
  icon: string;
  routerLink: string;
}

@Component({
  selector: 'app-supplier-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule],
  templateUrl: './supplier-sidebar.html',
  styleUrls: ['./supplier-sidebar.css'],
})
export class SupplierSidebarComponent implements OnChanges {
  @Input() collapsed: boolean = false;
  @Output() collapsedToggled = new EventEmitter<boolean>();
  @Input() mobileDrawerVisible: boolean = false;
  @Output() mobileDrawerVisibleChange = new EventEmitter<boolean>();

  activeRoute: string = '/supplier';
  screenWidth: number = 0;

  menuItems: MenuItem[] = [
    { label: 'Dashboard', icon: 'pi-chart-bar', routerLink: '/supplier' },
    { label: 'My Products', icon: 'pi-box', routerLink: '/supplier/myproducts' },
    { label: 'Recent Orders', icon: 'pi-clipboard', routerLink: '/supplier/pastorders' },
    // { label: 'Inventory', icon: 'pi-warehouse', routerLink: '/supplier/inventory' },
    { label: 'Customization Requests', icon: 'pi-users', routerLink: '/supplier/custom-requests' },
  ];

  constructor() {
    this.checkScreenWidth();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['mobileDrawerVisible']) {
      this.syncMobileDrawerState();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenWidth();
  }

  checkScreenWidth() {
    this.screenWidth = window.innerWidth;

    if (this.screenWidth > 768 && this.mobileDrawerVisible) {
      this.closeMobileDrawer();
    }

    if (this.screenWidth < 412 && !this.collapsed) {
      this.toggleCollapse();
    }
  }

  toggleCollapse() {
    this.collapsed = !this.collapsed;
    this.collapsedToggled.emit(this.collapsed);
  }

  toggleMobileDrawer() {
    const newState = !this.mobileDrawerVisible;
    this.mobileDrawerVisible = newState;
    this.mobileDrawerVisibleChange.emit(newState);
  }

  closeMobileDrawer() {
    this.mobileDrawerVisible = false;
    this.mobileDrawerVisibleChange.emit(false);
  }

  syncMobileDrawerState() {
    if (this.mobileDrawerVisible) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }
  upgradeToPro() {
    console.log('Upgrading to Pro version...');
  }
}
