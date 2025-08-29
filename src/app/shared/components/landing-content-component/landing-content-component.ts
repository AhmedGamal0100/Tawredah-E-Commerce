import { Component, effect, inject, Inject, OnInit } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { CardModule } from 'primeng/card';
import { TestimoinalsComponent } from './testimoinals-component/testimoinals-component';
import AOS from 'aos';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { RouterModule } from '@angular/router';

import { LogosSliderComponentComponent } from "../logos-slider-component/logos-slider-component.component";
import { NewBigProductCard } from "../new-big-product-card/new-big-product-card";
import { ProductsStore } from '../../../core/store/products.store';
import { IProduct } from '../../../core/models/product';
import { LoginStore } from '../../../core/store/login.store';

@Component({
  selector: 'app-landing-content-component',
  imports: [DividerModule, CardModule,
    TestimoinalsComponent, RouterModule, LogosSliderComponentComponent, ReactiveFormsModule, NewBigProductCard],
  templateUrl: './landing-content-component.html',
  styleUrl: './landing-content-component.scss',
})

export class LandingContentComponent implements OnInit {
  private _productsStore = inject(ProductsStore);
  private _loginStore = inject(LoginStore);
  form!: FormGroup;
  categories = ['Container', 'Fabrics & Clothing', 'Packaging' , 'Crafting'];

  selectedCategory = this.categories[0]; // default

  productsByCategory: Record<string, IProduct[]> = {
    'Container':[
    ],
    'Fabrics & Clothing': [
    ],
    'Packaging': [
    ],
    'Crafting': [
    ]
  };

  categoryImages: { [key: string]: string } = {
  Packaging: 'landing/packaging.jpg',
  Fabrics: 'assets/images/categories/fabrics.jpg',
  Containers: 'assets/images/categories/container.jpg',
  Crafting: 'assets/images/categories/craft.jpg'
};


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
        // console.log(this.productsByCategory);
        console.log(this._loginStore.loggedAccount());

      }
    })
  }

get products() {
  return (this.productsByCategory[this.selectedCategory] || []).slice(0, 4);
}

  selectCategory(category: string) {
    this.selectedCategory = category;
  }


  private fb = inject(FormBuilder)
  ngOnInit() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      desc: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log(this.form.value);
    }
  }
}
