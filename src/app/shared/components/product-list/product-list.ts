import { Component, signal, Input, effect, inject, input, output } from '@angular/core';
import { ProductCardList } from '../product-card-list/product-card-list';
import { PaginatorModule } from 'primeng/paginator';
import { CommonModule } from '@angular/common';
import { PromoBannerComponent } from '../promo-banner/promo-banner';
import { ProductsStore } from '../../../core/store/products.store';
import { IProduct } from '../../../core/models/product';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css'],
  imports: [
    ProductCardList,
    PaginatorModule,
    CommonModule,
    PromoBannerComponent],
})
export class ProductListComponent {
  // @Input() showHeader = true;
  // @Input() showPromoBanner = true;
  products = input<IProduct[] | null>([]);
  countToParent = output<string>();

  constructor() {
    effect(() => {
      // this.productsCount.set();
      this.countToParent.emit(this.products()?.length.toString() || "0");
    })
  }

  totalCards = 10;
  rowsPerPage = 16;
  currentPage = signal(0);
  first = signal(0);

  get visibleCards() {
    const start = this.currentPage() * this.rowsPerPage;
    const end = start + this.rowsPerPage;
    return Array.from({ length: this.totalCards }).slice(start, end);
  }

  onPageChange(event: any) {
    this.currentPage.set(event.page);
    this.first.set(event.first);
  }
}
