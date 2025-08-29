import { Component, effect, inject, input, OnInit } from '@angular/core';
import { Counter } from "../../core/services/counter";
import { CommonModule } from '@angular/common';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ButtonModule } from 'primeng/button';

import { RequestedCardComponent } from "../../shared/components/requested-card-component/requested-card-component";
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { defineInjectable } from '@angular/core/primitives/di';
import { Router } from '@angular/router';
import { ProductsStore } from '../../core/store/products.store';
import { IProduct } from '../../core/models/product';
import { NewRequestedCard } from '../../shared/components/new-requested-card/new-requested-card';
import { Tooltip } from "primeng/tooltip";
import { RequestedService } from '../../core/services/requested.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { NewBigProductCard } from "../../shared/components/new-big-product-card/new-big-product-card";
import { ExtraNewRequestedCard } from "../../shared/components/extra-new-requested-card/extra-new-requested-card";
import { LoginStore } from '../../core/store/login.store';
@Component({
  selector: 'app-requested-products.page',
  imports: [
    CommonModule,
    MultiSelectModule,
    FormsModule,
    InputGroupModule,
    InputGroupAddonModule,
    ButtonModule,
    RequestedCardComponent,
    PaginatorModule,
    NewRequestedCard,
    Tooltip,
    NewBigProductCard,
    ExtraNewRequestedCard
  ],

  templateUrl: './requested-product.page.html',
  styleUrl: './requested-product.page.scss',
})
export class RequestedProductsPage implements OnInit {
  private router = inject(Router)
  private loginStore = inject(LoginStore)
  role = ""
  requestedService = inject(RequestedService)
  requestedProducts = toSignal(this.requestedService.getRequestedProducts(), { initialValue: [] as any[] });

  applySearch() {
    throw new Error('Method not implemented.');
  }
  onSearchChange($event: any) {
    throw new Error('Method not implemented.');
  }
  private _productsStore = inject(ProductsStore);


  // counter
  productsMade = 0;
  productsWaiting = 0;
  factoriesHelping = 0;


  // Products card
  private numberCounter = inject(Counter);
  searchInput: any;

  constructor() {
    effect(() => {
      let prod = this._productsStore.products()
      if (prod) {
        this.productsByCategory = {
          'Packaging': prod.filter(p => p.category.main === 'Packaging'),
          'Fabrics & Clothing': prod.filter(p => p.category.main === 'Fabrics & Clothing'),
          'Container': prod.filter(p => p.category.main === 'Container'),
          'Crafting': prod.filter(p => p.category.main === 'Crafting')
        };
        console.log(this.productsByCategory);
      }

      if (this.loginStore.loggedAccount()!.role) {
        this.role = this.loginStore.loggedAccount()!.role
      }
    })
  }

  get products() {
    return (this.productsByCategory[this.selectedCategory] || []);
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
  }

  ngOnInit() {
    // Initialize the counter values with animation
    this.numberCounter.animateNumberSmooth(
      (value) => (this.productsMade = value),
      100,
      3000
    );
    this.numberCounter.animateNumberSmooth(
      (value) => (this.productsWaiting = value),
      500,
      3500
    );
    this.numberCounter.animateNumberSmooth(
      (value) => (this.factoriesHelping = value),
      20,
      4000
    );
  }

  categories = ['Container', 'Fabrics & Clothing', 'Packaging', 'Crafting'];

  selectedCategory = this.categories[0]; // default

  productsByCategory: Record<string, IProduct[]> = {
    'Container': [
    ],
    'Fabrics & Clothing': [
    ],
    'Packaging': [
    ],
    'Crafting': [
    ]
  };




  get filteredRequestedProducts() {
    const all = this.requestedProducts() || [];
    return all.filter(p => p.category === this.selectedCategory);
  }




  toForm() {
    this.router.navigateByUrl("/requested-products-form")
  }
}
