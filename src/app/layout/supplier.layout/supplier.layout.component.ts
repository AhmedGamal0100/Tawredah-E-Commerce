import { Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { SupplierSidebarComponent } from '../../shared/components/supplier/supplier-sidebar/supplier-sidebar';
import { SupplierNavbarComponent } from '../../shared/components/supplier/supplier-navbar/supplier-navbar';

@Component({
  selector: 'app-supplier.layout',
  imports: [ SupplierSidebarComponent, SupplierNavbarComponent, RouterOutlet, CommonModule,
    DividerModule,
    BadgeModule,
    ButtonModule,
    SupplierNavbarComponent,
    SupplierSidebarComponent,],
  templateUrl: './supplier.layout.component.html',
  styleUrl: './supplier.layout.component.css'
})
export class SupplierLayoutComponent {
  sidebarCollapsed = false;
  mobileDrawerVisible = false;
  userName = 'ABC Manufacturing';
  darkMode = false;

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  toggleMobileDrawer(newState: boolean) {
    this.mobileDrawerVisible = newState;

    if (newState) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    if (this.darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }
}
