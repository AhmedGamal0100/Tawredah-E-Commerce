import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { CustomizationRequestsComponent } from '../../../shared/components/supplier/customization-requests/customization-requests';

@Component({
  selector: 'app-customization-requests-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    CustomizationRequestsComponent,
  ],
  templateUrl: './customization-requests-page.html',
  styleUrls: ['./customization-requests-page.css'],
})
export class CustomizationRequestsPageComponent {
  sidebarCollapsed = false;
  mobileDrawerVisible = false;
  userName = 'ABC Manufacturing';
  darkMode = false;
  searchInput: string = '';

  // إحصائيات
  totalRequests = 20;
  underReviewCount = 8;
  approvedCount = 9;
  rejectedCount = 3;

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

  // وظائف Search Bar
  applySearch() {
    if (this.searchInput.trim()) {
      console.log('Searching for:', this.searchInput.trim());
      // هنا يمكنك تنفيذ البحث الفعلي
      // this.performSearch(this.searchInput.trim());
    }
  }

  onSearchChange(value: string): void {
    console.log('Search changed:', value);
    // بحث فوري أثناء الكتابة
    // this.performSearch(value);
  }

  // دالة البحث الفعلية (يمكنك تعديلها حسب احتياجاتك)
  private performSearch(query: string) {
    // قم بتنفيذ منطق البحث هنا
    // يمكنك تصفية البيانات أو إرسال طلب للخادم
  }
}
