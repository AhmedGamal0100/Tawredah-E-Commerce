
import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { FileUploadModule } from 'primeng/fileupload';
import { GalleriaModule } from 'primeng/galleria';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { SelectModule } from 'primeng/select';
import { RatingModule } from 'primeng/rating';
import { CarouselModule } from 'primeng/carousel';
import { TextareaModule } from 'primeng/textarea';
import { InputText } from "primeng/inputtext";
import { InputNumber } from "primeng/inputnumber";
import { IProduct } from '../../../core/models/product';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsStore } from '../../../core/store/products.store';
import { ProductsService } from '../../../core/services/products.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { LoginStore } from '../../../core/store/login.store';
import { take } from 'rxjs';
import { UsersService } from '../../../core/services/user.service';
import { NotificationService } from '../../../core/services/notification.service';
import { SliderSimilarDetails } from "../../../shared/components/slider-similar-details/slider-similar-details";

interface Review {
  img: any;
  name: string;
  rating: string;
  totalReviews: string;
  comment: string;
}

interface PriceOption {
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

@Component({
  selector: 'app-product-details-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FileUploadModule,
    GalleriaModule,
    ButtonModule,
    TagModule,
    CardModule,
    DividerModule,
    SelectModule,
    CurrencyPipe,
    RatingModule,
    CarouselModule,
    TextareaModule,
    InputText,
    InputNumber,
    ToastModule,
    SliderSimilarDetails
],
  templateUrl: './product-details-page.html',
  styleUrl: './product-details-page.css',
  providers: [MessageService]
})
export class ProductDetailsPage {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private productsStore = inject(ProductsStore);
  private ProductsService = inject(ProductsService);
  private messageService = inject(MessageService);
  private loginStore = inject(LoginStore)
  public userRole: string | null = null;
  private _messageService = inject(MessageService)
  private router = inject(Router);
  productId: string | null = null;
  product = signal<IProduct | null>(null);

  similarProducts = signal<IProduct [] >([]);

  form!: FormGroup;
  isEditing = false;
  loading = false;
  private token = localStorage.getItem("token");
  private email = localStorage.getItem("email")
  private userStore = inject(LoginStore)
  private userService = inject(UsersService)
  private notificationService = inject(NotificationService)
  isWished = false;

  productStore=inject(ProductsStore);

  selectedTier: any = null;
  selectedCurrency: string = 'EGP';
  currencyOptions = [
    { name: 'US Dollar', code: 'USD' },
    { name: 'Euro', code: 'EUR' },
    { name: 'British Pound', code: 'GBP' },
    { name: 'Egyptian Pound', code: 'EGP' }
  ];

  colors = [{ label: 'Brown' }, { label: 'White' }];
  sizes = [{ label: 'Small (10cm*15cm*25cm)' }, { label: 'Medium (15cm*20cm*30cm)' }, { label: 'Large (20cm*25cm*40cm)' }];
  extra = [{ label: 'Gift Wrap' }, { label: 'Custom Print' }];
  extras = [
    '- A high-quality glass bottle designed specifically for cologne and perfume storage. Manufactured by MEG Sadat, one of the leading glass producers in the Middle East, this product combines durability with elegance.',
  ,'- A premium ceramic jar crafted for luxury skincare and cosmetic creams. Produced by MEG Sadat, a trusted name in high-end packaging across the Middle East, this jar blends functionality with sophistication, ensuring both product safety and an elegant presentation.'
  ];


getSimilarProducts() {
  const products = this.productsStore.products();
  const currentProduct = this.product();

  if (products && currentProduct) {
    const related = products
      .filter(
        (p: IProduct) =>
          p.category.main === currentProduct.category.main && p.id !== currentProduct.id
      )
      .slice(0, 4); // only 4 items

    // fallback: if not enough related, fill with randoms from all products
    if (related.length < 4) {
      const others = products.filter((p: IProduct) => p.id !== currentProduct.id);
      while (related.length < 4 && others.length > 0) {
        const randomIndex = Math.floor(Math.random() * others.length);
        related.push(others.splice(randomIndex, 1)[0]);
      }
    }

    this.similarProducts.set(related);
  }
}
  
  selectedColor: any;
  selectedSize: any;
  selectedExtra: any;
  newColor = '';
  newSize = '';
  newExtra = '';
  showAll = false;
  reviews: Review[] = [
    {
      img: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Brian',
      name: 'Mohamed Attia, Supermarket Owner',
      rating: '5.0',
      totalReviews: '(1000+)',
      comment: 'Tawredah\'s variety and reliability have made a huge difference for my business. I can restock quickly and focus more on my customers.',
    },
    {
      img: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Avery',
      name: 'Neamat A., Grocery Store Owner',
      rating: '5.0',
      totalReviews: '(1000+)',
      comment: 'Tawredah has completely changed how we stock our store. The prices are great, delivery is always on time, and the ordering process is super easy. Highly recommend it for any business owner.',
    },
    {
      img: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Felix',
      name: 'Dareen D., Café Owner',
      rating: '4.8',
      totalReviews: '(1000+)',
      comment: 'Ordering through Tawredah is so convenient. I can find all my supplies in one place, and the delivery team is always professional and on time.',
    },
  ];

  responsiveOptions: any[] = [];

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productId = id;
      const foundProduct = this.productsStore.products()?.find(p => p.id === id) ?? null;
      this.product.set(foundProduct);

      if (foundProduct?.price?.currency) {
        this.selectedCurrency = foundProduct.price.currency;
      }

      if (foundProduct?.price?.discountTiers?.length) {
        this.selectedTier = foundProduct.price.discountTiers[0];
      }

    }

    effect(() => {
      let loggedAcc = this.loginStore.loggedAccount()
      if (loggedAcc) {
        this.userRole = loggedAcc.role;
      }

      // effect(() => {
      // const loggedAcc = this.loginStore.loggedAccount();
      const productId = this.productId;

      if (loggedAcc && productId) {
        const wishList = loggedAcc.wishListProducts || [];
        this.isWished = wishList.includes(productId);
      }
      // });
    })
  }

  // Function to convert File to Base64
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Remove the data:image/...;base64, prefix if you want only the base64 string
        const base64String = reader.result as string;
        resolve(base64String);
      };
      reader.onerror = error => reject(error);
    });
  }

  // Function to check if a string is a base64 image
  private isBase64Image(str: string): boolean {
    return str.startsWith('data:image/') && str.includes(';base64,');
  }

  // Function to process all images and convert to base64 if needed
  private async processImagesForFirebase(images: string[]): Promise<string[]> {
    const processedImages: string[] = [];

    for (const image of images) {
      // If it's already a base64 string, use it as is
      if (this.isBase64Image(image)) {
        processedImages.push(image);
      } else {
        // If it's a URL, we need to fetch and convert it to base64
        try {
          const base64Image = await this.urlToBase64(image);
          processedImages.push(base64Image);
        } catch (error) {
          console.error('Error converting URL to base64:', error);
          // If conversion fails, keep the original URL
          processedImages.push(image);
        }
      }
    }

    return processedImages;
  }

  // Function to convert image URL to base64
  private async urlToBase64(url: string): Promise<string> {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  // Price calculation methods
  calculateDiscountedUnitPrice(tier: any): number {
    const basePrice = this.product()?.price?.unit || 0;
    const discountPercent = tier.percent || 0;
    return basePrice * (1 - discountPercent / 100);
  }

  calculateTotalPrice(tier: any): number {
    return this.calculateDiscountedUnitPrice(tier) * tier.minQty;
  }

  // Editing methods
  updateDiscountTier(index: number, field: 'minQty' | 'percent', value: number) {
    const updatedTiers = [...(this.product()?.price?.discountTiers || [])];
    updatedTiers[index] = { ...updatedTiers[index], [field]: value };

    this.updateProductPrice('discountTiers', updatedTiers);
  }

  removeDiscountTier(index: number) {
    const updatedTiers = [...(this.product()?.price?.discountTiers || [])];
    updatedTiers.splice(index, 1);

    this.updateProductPrice('discountTiers', updatedTiers);
  }

  addDiscountTier() {
    const currentTiers = this.product()?.price?.discountTiers || [];
    const newTier = {
      minQty: currentTiers.length > 0 ? currentTiers[currentTiers.length - 1].minQty + 100 : 100,
      percent: currentTiers.length > 0 ? currentTiers[currentTiers.length - 1].percent + 5 : 5
    };

    const updatedTiers = [...currentTiers, newTier];
    this.updateProductPrice('discountTiers', updatedTiers);
  }

  updateBasePrice(value: number) {
    this.updateProductPrice('unit', value);
  }

  updateCurrency() {
    this.updateProductPrice('currency', this.selectedCurrency);
  }

  private updateProductPrice(field: string, value: any) {
    const currentProduct = this.product();
    if (!currentProduct) return;

    const updatedPrice = {
      ...currentProduct.price,
      [field]: value
    };

    this.product.set({
      ...currentProduct,
      price: updatedPrice
    });
  }

  removeImage(index: number) {
    const currentProduct = this.product();
    if (!currentProduct) return;

    const updatedImages = [...currentProduct.imageUrl];
    updatedImages.splice(index, 1);

    this.product.set({
      ...currentProduct,
      imageUrl: updatedImages
    });
  }

  async onAddImages(event: any) {
    const files: File[] = event.files;
    const currentProduct = this.product();
    if (!currentProduct) return;

    const updatedImages = [...currentProduct.imageUrl];

    for (let file of files) {
      try {
        const base64Image = await this.fileToBase64(file);
        updatedImages.push(base64Image);
        this.product.set({
          ...currentProduct,
          imageUrl: [...updatedImages]
        });
      } catch (error) {
        console.error('Error converting file to base64:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to process image'
        });
      }
    }
  }

  addOption(type: 'colors' | 'sizes' | 'extra', value: string) {
    if (!value.trim()) return;
    this[type].push({ label: value });
    if (type === 'colors') this.newColor = '';
    if (type === 'sizes') this.newSize = '';
    if (type === 'extra') this.newExtra = '';
  }

  removeOption(type: 'colors' | 'sizes' | 'extra', index: number) {
    this[type].splice(index, 1);
  }

  get displayedReviews() {
    return this.showAll ? this.reviews : this.reviews.slice(0, 2);
  }

  toggleShowAll() {
    this.showAll = !this.showAll;
  }

  ngOnInit() {
    const productData = this.product();
    if (productData?.price?.discountTiers?.length) {
      this.selectedTier = productData.price.discountTiers[0];
    }
    this.responsiveOptions = [
      { breakpoint: '1199px', numVisible: 3, numScroll: 1 },
      { breakpoint: '991px', numVisible: 2, numScroll: 1 },
      { breakpoint: '767px', numVisible: 1, numScroll: 1 },
    ];
    this.getSimilarProducts();
  }


  // ---------- Reactive form helpers ----------
  private createFormFromState(): FormGroup {
    const product = this.product();
    return this.fb.group({
      name: [product?.name || '', Validators.required],
      description: [product?.description || '', Validators.required],
      category: this.fb.group({
        main: [product?.category?.main || '', Validators.required],
        sub: [product?.category?.sub || '', Validators.required],
        type: [product?.category?.type || '', Validators.required]
      }),
      specs: this.fb.group({
        material: [product?.specs?.material || '', Validators.required],
        weight: [product?.specs?.weight || '', Validators.required],
        dimensions: this.fb.group({
          length: [product?.specs?.dimensions?.length || '', Validators.required],
          width: [product?.specs?.dimensions?.width || '', Validators.required],
          height: [product?.specs?.dimensions?.height || '', Validators.required]
        })
      })
    });
  }

  enableEdit() {
    this.form = this.createFormFromState();
    this.isEditing = true;
  }

  async saveEdit() {
    if (!this.form.valid || !this.productId) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all required fields' });
      return;
    }

    this.loading = true;
    try {
      const formValue = this.form.value;

      // Process images to ensure they're in base64 format
      const processedImages = await this.processImagesForFirebase(this.product()?.imageUrl || []);

      const updatedProduct = {
        ...this.product(),
        ...formValue,
        imageUrl: processedImages, // Use the processed base64 images
        id: this.productId
      };

      await this.ProductsService.update(this.productId, updatedProduct);

      // Update local state
      this.product.set(updatedProduct);
      // this.ProductsService.update(this.productId,updatedProduct);

      this.isEditing = false;
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product updated successfully' });
    } catch (error) {
      console.error('Error updating product:', error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update product' });
    } finally {
      this.loading = false;
    }
  }

  cancelEdit() {
    this.isEditing = false;
  }

  addToWishList() {
    if (this.token && this.email) {
      const userId = this.userStore.loggedAccount()?.id;
      const productId = this.productId;

      if (!userId || !productId) return;

      this.userService.get$(userId).pipe(take(1)).subscribe(user => {
        const existingWishlist: string[] = user?.wishListProducts || [];
        let updatedWishlist: string[];

        if (existingWishlist.includes(productId)) {
          updatedWishlist = existingWishlist.filter(id => id !== productId);
          this.showContrast("Info", `${this.product.name} is removed from your wishlist`);
          this.isWished = false;
        } else {
          updatedWishlist = [...existingWishlist, productId];
          this.showContrast("Info", `${this.product.name} is added to your wishlist`);
          this.isWished = true;
        }

        this.userService.update(userId, { wishListProducts: updatedWishlist })
          .then(() => console.log('Wishlist updated successfully'))
          .catch(error => console.error('Error updating wishlist', error));
      });
    } else {
      this.showContrast("Error", "You're not logged in!");
    }
  }


  addToCart(productData: any) {
    if (this.token && this.email) {
      const userId = this.userStore.loggedAccount()?.id;

      if (!userId || !productData) return;

      this.userService.get$(userId).pipe(take(1)).subscribe(user => {
        const existingCart: any[] = user?.cartProducts || [];
        let updatedCart: any[];

        // Check if the product (with same ID) already exists in cart
        const existingIndex = existingCart.findIndex(item => item.id === productData.id);

        if (existingIndex !== -1) {
          // Update the existing product with new data
          updatedCart = [...existingCart];
          updatedCart[existingIndex] = productData;
          this.showContrast("Success", `${productData.name} in your cart was updated`);
          this.notificationService.success(`${productData.name} in your cart was updated`);

        } else {
          // Add new product with options
          updatedCart = [...existingCart, productData];
          this.showContrast("Success", `${productData.name} is added to your cart`);
          this.notificationService.success(`${productData.name} is added to your cart`, { sourceType: 'product', sourceId: productData.id, route: `/cart` });
        }

        this.userService.update(userId, { cartProducts: updatedCart })
          .then(() => console.log('Cart updated successfully', updatedCart))
          .catch(error => console.error('Error updating cart', error));
      });
    } else {
      this.showContrast("Error", "You're not logged in!");
    }
  }

  price(index: number = 0): string {
    const moq = this.product()!.price.discountTiers[index].minQty
    const percent = this.product()!.price.discountTiers[index].percent
    const priceAfterDiscount = moq * (1 - percent / 100);
    return (priceAfterDiscount * this.product()!.price.unit).toFixed(1);
  }

  showContrast(summary: string, detail: string) {
    this._messageService.add({ severity: 'secondary', summary, detail });
  }

  submit() {
    const data = {
      ...this.product(),
      selectedOptions: {
        color: this.selectedColor,
        size: this.selectedSize,
        tier: this.selectedTier,
        extra: this.selectedExtra
      }
    }

    if (this.selectedColor && this.selectedSize && this.selectedTier && this.selectedExtra) {
      this.addToCart(data);
      this.router.navigate(['/cart']);
    } else {
      this.showContrast("Error", "Please select all options before adding to cart");
    }
  }
}