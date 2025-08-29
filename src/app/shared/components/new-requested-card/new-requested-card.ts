import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IProduct } from '../../../core/models/product';

@Component({
  selector: 'app-new-requested-card',
  imports: [],
  templateUrl: './new-requested-card.html',
  styleUrl: './new-requested-card.scss'
})
export class NewRequestedCard {
  @Input() product!: any;

  upvotes!: number;
  upvoteClicked = false;
  isAuthenticated = false;


  constructor(private router: Router) {}

    ngOnInit(): void {
        const email = localStorage.getItem('email');
  const token = localStorage.getItem('token');
  this.isAuthenticated = !!(email && token);
    // Random between 20 and 500 (adjust range as needed)
    this.upvotes = Math.floor(Math.random() * (1500 - 20 + 1)) + 20;
  }

  goToDetails(product: IProduct) {
    this.router.navigate(['/requested-products-details', product.id]);
  }

upvoteProduct(product: IProduct) {
  if (!this.isAuthenticated) return; // extra safety
  this.upvoteClicked = !this.upvoteClicked;
  this.upvotes += this.upvoteClicked ? 1 : -1;
}

}






