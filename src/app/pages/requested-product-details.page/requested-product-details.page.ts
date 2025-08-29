import { Component, inject, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleriaModule } from 'primeng/galleria';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { DividerModule } from 'primeng/divider';
import { SelectModule } from 'primeng/select';
import { CurrencyPipe } from '@angular/common'
import { RatingModule } from 'primeng/rating';
import { CarouselModule } from 'primeng/carousel';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { FooterComponent } from '../../shared/components/footer-component/footer-component';
import { NavbarGeneralComponent } from '../../shared/components/navbar-general-component/navbar-general-component';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsStore } from '../../core/store/products.store';
import { IProduct } from '../../core/models/product';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { SimilarProductSlider } from "../../shared/components/similar-product-slider/similar-product-slider";
import { RequestedService } from '../../core/services/requested.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

interface Review {
  img: any;
  name: string;
  rating: string;
  totalReviews: string;
  comment: string;
}
interface Product {
  name: string;
  description: string;
  upvotes: number;
  id: string;
  image: string;
}

@Component({
  selector: 'app-requested-product-details.page',
  imports: [CommonModule,
    GalleriaModule,
    ButtonModule,
    TagModule,
    CardModule,
    FormsModule,
    NavbarGeneralComponent,
    DividerModule,
    FooterComponent,
    SelectModule,
    RatingModule,
    CarouselModule,
    ProductCardComponent, SimilarProductSlider],
  templateUrl: './requested-product-details.page.html',
  styleUrl: './requested-product-details.page.css'
})
export class RequestedProductDetailsPage {
  private route = inject(ActivatedRoute);
  private firestore = inject(Firestore);

  product: WritableSignal<any | null> = signal(null);

 upvotes!: number;
  upvoteClicked = false;
isAuthenticated = false;



private router = inject(Router)



requestedService = inject(RequestedService)
requestedProducts = toSignal(
  this.requestedService.getRequestedProducts().pipe(
    map((products: string[] | any[]) => products.slice(0, 4))
  ),
  { initialValue: [] as any[] }
);

get filteredRequestedProducts() {
  return  this.requestedProducts() || [];
}




  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const docRef = doc(this.firestore, `requestedProducts/${id}`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        this.product.set({ id, ...docSnap.data() } as IProduct);
      }
    }
            const email = localStorage.getItem('email');
  const token = localStorage.getItem('token');
  this.isAuthenticated = !!(email && token);
        this.upvotes = Math.floor(Math.random() * (1500 - 20 + 1)) + 20;

  }

  upvoteProduct(product: any) {
    if (!product) return;
    if (!this.isAuthenticated) return; // extra safety
    this.upvoteClicked = !this.upvoteClicked;
    this.upvotes += this.upvoteClicked ? 1 : -1;
  }
}
