import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KpiCardsComponent } from '../../../shared/components/supplier/kpi-cards/kpi-cards';
import { SalesChartComponent } from '../../../shared/components/supplier/sales-chart/sales-chart';
import { TopProductsComponent } from '../../../shared/components/supplier/top-products/top-products';
import { LoginStore } from '../../../core/store/login.store';
import { ProfilePage } from "../../profile.page/profile-page/profile-page";

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    KpiCardsComponent,
    SalesChartComponent,
    TopProductsComponent,
],
  templateUrl: './dashboard-page.html',
  styleUrls: ['./dashboard-page.css'],
})
export class DashboardPageComponent {
  loginStore =inject(LoginStore)
  sidebarCollapsed = false;
  mobileDrawerVisible = false;
  userName = 'ABC Manufacturing';
  darkMode = false;

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  ngOnInit(){
    console.log(    this.loginStore.loggedAccount());

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
