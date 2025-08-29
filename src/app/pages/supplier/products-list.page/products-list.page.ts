import { CommonModule } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { UsersService } from '../../../core/services/user.service';
import { LoginStore } from '../../../core/store/login.store';
import { ProductsService } from '../../../core/services/products.service';
import { IProduct } from '../../../core/models/product';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-products-list.page',
  imports: [CommonModule, CardModule, TableModule, TagModule, RouterLink],
  templateUrl: './products-list.page.html',
  styleUrl: './products-list.page.css',
})
export class ProductsListPage {
  sidebarCollapsed = false;
  userName = 'Butterfly';
  darkMode = false;
  private router = inject(Router)
  userService=inject(UsersService);
  productService=inject(ProductsService)
  loginStore=inject(LoginStore);
  products: any[] = [];

  getProductById(id:string){
    this.userService.getOnce(id);
  }
async ngOnInit() {
  const account = this.loginStore.loggedAccount();
  console.log('Logged account:', account);

  if (account && account.products?.length) {
    // account.productsList is an array of product IDs (strings)
    const products = await Promise.all(
      account.products.map(id => this.productService.getOnce(id))
    );

    // Filter out nulls
    this.products = products.filter((p): p is IProduct => p !== null);
  }
}

async loadProducts() {
  try {
    const account = await this.loginStore.loggedAccount();
    console.log('Logged account:', account);

    if (account && account.products?.length) {
      for (const id of account.products) {
        const product = await this.userService.getOnce(id);
        if (product) {
          this.products.push(product);
          console.log(product);
          
        }
      }
    }
  } catch (error) {
    console.error('Error loading products', error);
  }
}


  steps = ['Review', 'Production', 'Shipping', 'Pending', 'Done'];
  selectedOrder: any = null;

  selectOrder(order: any) {
    if (this.selectedOrder && this.selectedOrder.id === order.id) {
      // Clicked the same row → close it
      this.selectedOrder = null;
    } else {
      // Clicked a different row → open it
      this.selectedOrder = order;
    }
  }

  getStepIndex(status: string): number {
    return this.steps.indexOf(status);
  }

  getSeverity(status: string) {
    switch (status) {
      case 'Done':
        return 'success';
      case 'Shipping':
        return 'info';
      case 'Production':
        return 'warning';
      case 'Pending':
        return 'secondary';
      case 'Review':
        return 'contrast';
      default:
        return 'contrast';
    }
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    if (this.darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  // Close order details when clicking outside
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (target.closest('.clickable-row') || target.closest('.order-details')) {
      return;
    }

    this.selectedOrder = null;
  }

  toProductId(id: string){
    this.router.navigateByUrl(`productDetails/${id}`)
  }
}
