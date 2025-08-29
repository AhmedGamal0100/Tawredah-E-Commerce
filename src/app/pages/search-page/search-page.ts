import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SearchBar } from '../../shared/components/search-bar/search-bar';
import { ProductListComponent } from '../../shared/components/product-list/product-list';
import { SidebarFilterComponent } from '../../shared/components/sidebar-filter/sidebar-filter';
import { ProductsStore } from '../../core/store/products.store';
import { IProduct } from '../../core/models/product';
import { IFilter } from '../../core/models/filter';
import { ProductsService } from '../../core/services/products.service';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SearchBar,
    ProductListComponent,
    SidebarFilterComponent
  ],
  templateUrl: './search-page.html',
  styleUrls: ['./search-page.css'],
})
export class SearchPageComponent {
  private productsStore = inject(ProductsStore)
  private productsService = inject(ProductsService)
  products!: IProduct[] | null
  productCount = signal(0);
  filters = signal<IFilter>({ categories: [], moqs: [], state: [], suppliers: [] })
  constructor() {
    effect(() => {
      let prodExist = this.productsStore.filteredProducts()
      if (prodExist) {
        this.products = prodExist;
      }
    })
  }

  handleFilterFromChild(filter: any): void {
    this.filters.set(filter);
    this.productsStore.updateFilters(filter);
  }

  handleSearchFromChild(data: any): void {
    this.productsStore.setSearch(data);
  }

  handleCountFromChild(count: any): void {
    this.productCount.set(+count);
    console.log("Product count updated to:", this.productCount());
  }

  private setRandomTagsOnce(): void {
    const products = this.productsStore.products();
    if (!products) return;

    products.forEach(product => {
      const tags = product.status?.tags ? [...product.status.tags] : [];

      // Randomly add best-seller
      if (Math.random() < 0.3 && !tags.includes('best-seller')) {
        tags.push('best-seller');
      }

      // Randomly add new
      if (Math.random() < 0.3 && !tags.includes('new')) {
        tags.push('new');
      }

      if (tags.length !== (product.status?.tags?.length || 0)) {
        this.productsService.update(product.id, {
          ...product,
          status: { ...product.status, tags }
        })
      }
    });
  }
}
