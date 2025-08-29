import { Component, input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { RippleModule } from 'primeng/ripple';
import { IProduct } from '../../../core/models/product';

@Component({
  selector: 'app-product-card',
  imports: [
    CardModule,
    ButtonModule,
    ButtonModule,
    ProgressBarModule,
    RippleModule,
  ],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
})
export class ProductCardComponent {
  product = input<IProduct | null | undefined>();


}
