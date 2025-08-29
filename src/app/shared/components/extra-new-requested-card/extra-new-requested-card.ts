import { Component, inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IProduct } from '../../../core/models/product';

@Component({
  selector: 'app-extra-new-requested-card',
  standalone: true,
  imports: [],
  templateUrl: './extra-new-requested-card.html',
  styleUrl: './extra-new-requested-card.scss'
})
export class ExtraNewRequestedCard implements OnInit {

  @Input() product!: IProduct;

  upvotes!: number;
  upvoteClicked = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Generate random upvotes between 20 and 500 (you can adjust the range)
    this.upvotes = Math.floor(Math.random() * (500 - 20 + 1)) + 20;
  }

  goToDetails(product: IProduct) {
    this.router.navigate(['/requested-products-details', product.id]);
  }

  upvoteProduct(product: IProduct) {
    this.upvoteClicked = !this.upvoteClicked;
    this.upvotes += this.upvoteClicked ? 1 : -1;
  }
}
