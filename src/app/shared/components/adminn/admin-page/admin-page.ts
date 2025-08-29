import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ProductsManagementComponent } from '../products-management/products-management';
import { SuppliersManagement } from '../suppliers-management/suppliers-management';
import { CustomersManagement } from '../customers-management/customers-management';
import { CustomizationRequests } from '../customization-requests/customization-requests';
import { ReportsDashboard } from '../reports-dashboard/reports-dashboard';
import { CategoriesManagement } from '../categories-management/categories-management';

interface Tab {
  id: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
        ProductsManagementComponent,
    SuppliersManagement,
    CustomersManagement,
    CustomizationRequests,
    ReportsDashboard,
    CategoriesManagement,
  ],
  templateUrl: './admin-page.html',
  styleUrls: ['./admin-page.css'],
})
export class AdminPageComponent {
  sidebarCollapsed = false;
  mobileDrawerVisible = false;
  darkMode = false;
  activeTab = 'products';

  // تعريف التبويبات
  tabs: Tab[] = [
    { id: 'products', label: 'Products', icon: 'pi pi-box' },
    { id: 'suppliers', label: 'Suppliers', icon: 'pi pi-users' },
    // { id: 'categories', label: 'Categories', icon: 'pi pi-tags' },
    { id: 'customers', label: 'Customers', icon: 'pi pi-user' },
    { id: 'customization', label: 'Customization', icon: 'pi pi-cog' },
    { id: 'reports', label: 'Reports', icon: 'pi pi-chart-bar' },
  ];

  // إحصائيات
  totalProducts = 156;
  activeSuppliers = 42;
  totalCustomers = 1250;
  customRequests = 28;

  setActiveTab(tabId: string) {
    this.activeTab = tabId;
  }

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
