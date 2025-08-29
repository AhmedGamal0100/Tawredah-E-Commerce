import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { InventoryStatusComponent } from '../../../shared/components/supplier/inventory-status/inventory-status';
import { IProduct } from '../../../core/models/product';
import { LoginStore } from '../../../core/store/login.store';
import { ProductsService } from '../../../core/services/products.service';

@Component({
  selector: 'app-inventory-page',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    InventoryStatusComponent,
  ],
  templateUrl: './inventory-page.html',
  styleUrls: ['./inventory-page.css'],
})
export class InventoryPageComponent {
  sidebarCollapsed = false;
  mobileDrawerVisible = false;
  userName = 'ABC Manufacturing';
  darkMode = false;
  products: string[] = [];
  factoryProducts!: IProduct[];
  private loginStore = inject(LoginStore)
  private prodService = inject(ProductsService)

  totalProducts = 0;
  inStockCount = 0;
  lowStockCount = 0;
  outOfStockCount = 0

  constructor() {
    effect(() => {
      const logAcc = this.loginStore.loggedAccount();
      if (logAcc) {
        this.products = logAcc.products ?? [];
        this.factoryProducts = []; // Reset before loading
        this.totalProducts = 0; // Reset stats

        const productPromises = this.products.map(prodId => this.prodService.getOnce(prodId));

        Promise.all(productPromises).then(results => {
          this.factoryProducts = results.filter((p): p is IProduct => p !== null);
          this.factoryProducts.forEach(prod => {
            if (prod.inventory.stock > 7000) {
              this.inStockCount++;
            }
            else if (prod.inventory.stock < 7000 && prod.inventory.stock > 0) {
              this.lowStockCount++;
            }
            else {
              this.outOfStockCount++;
            }
          })
        });
      }
    });
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
