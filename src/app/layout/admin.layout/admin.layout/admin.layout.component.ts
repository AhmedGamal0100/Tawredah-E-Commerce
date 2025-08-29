import { Component } from '@angular/core';
import { SupplierNavbarComponent } from "../../../shared/components/supplier/supplier-navbar/supplier-navbar";
import { SupplierSidebarComponent } from "../../../shared/components/supplier/supplier-sidebar/supplier-sidebar";
import { AdminPageComponent } from "../../../shared/components/adminn/admin-page/admin-page";

@Component({
  selector: 'app-admin.layout',
  imports: [SupplierNavbarComponent, SupplierSidebarComponent, AdminPageComponent],
  templateUrl: './admin.layout.component.html',
  styleUrl: './admin.layout.component.css'
})
export class AdminLayoutComponent {
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
