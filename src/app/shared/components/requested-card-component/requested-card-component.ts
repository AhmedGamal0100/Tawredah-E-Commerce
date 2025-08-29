import { Component } from '@angular/core';
import { ButtonModule } from "primeng/button";
import { TagModule } from 'primeng/tag';


interface Product {
  name: string;
  description: string;
  upvotes: number;
  id: string;
  image: string;
}

@Component({
  selector: 'app-requested-card-component',
  imports: [ButtonModule, TagModule],
  templateUrl: './requested-card-component.html',
  styleUrl: './requested-card-component.css'
})
export class RequestedCardComponent {
  product: Product = {
    name: 'Product Name',
    description: 'This is a sample product description that provides details.',
    upvotes: 120,
    id: '12345',
    image: 'https://example.com/product-image.jpg',
  }
  upvoteClicked = false;
  upvoteProduct(product: Product) {
    if (this.upvoteClicked) {
      product.upvotes -= 1;
      this.upvoteClicked = false;
      return;
    }
    product.upvotes += 1;
    this.upvoteClicked = true;
  }

}
