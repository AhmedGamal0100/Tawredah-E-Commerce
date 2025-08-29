import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-promo-banner',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './promo-banner.html',
  styleUrls: ['./promo-banner.css'],
})
export class PromoBannerComponent {}
