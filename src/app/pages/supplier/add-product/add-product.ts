import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputText } from "primeng/inputtext";
import { InputNumber } from "primeng/inputnumber";
import { DividerModule } from 'primeng/divider';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProductsService } from '../../../core/services/products.service'; 
import { IProduct } from '../../../core/models/product'; 
import { LoginStore } from '../../../core/store/login.store';
import { IUser } from '../../../core/models/user'; // Make sure this is your custom interface
import { UsersService } from '../../../core/services/user.service';

interface PriceTier {
  minQty: number;
  percent: number;
}

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FileUploadModule,
    ButtonModule,
    SelectModule,
    InputText,
    InputNumber,
    DividerModule,
    TextareaModule,
    ToastModule,
  ],
  templateUrl: './add-product.html',
  styleUrl: './add-product.css'
})
export class AddProductComponent {
  private fb = inject(FormBuilder);
  private productsService = inject(ProductsService);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private loginStore = inject(LoginStore);
  private usersService = inject(UsersService);

  // Explicitly type the signal
  currentUser = this.loginStore.loggedAccount as () => IUser | null;
  hasFactoryRole = false;
  form!: FormGroup;
  loading = false;

  selectedCurrency: string = 'USD';
  currencyOptions = [
    { name: 'US Dollar', code: 'USD' },
    { name: 'Euro', code: 'EUR' },
    { name: 'British Pound', code: 'GBP' },
    { name: 'Egyptian Pound', code: 'EGP' }
  ];

  colors = [{ label: 'Brown' }, { label: 'White' }];
  sizes = [{ label: 'Small (10cm*15cm*25cm)' }, { label: 'Medium (15cm*20cm*30cm)' }, { label: 'Large (20cm*25cm*40cm)' }];
  extra = [{ label: 'Gift Wrap' }, { label: 'Custom Print' }];

  selectedColor: any;
  selectedSize: any;
  selectedExtra: any;
  newColor = '';
  newSize = '';
  newExtra = '';

  imageFiles: File[] = [];
  imagePreviews: string[] = [];

  discountTiers: PriceTier[] = [
    { minQty: 1, percent: 0 },
    { minQty: 100, percent: 5 }
  ];

  constructor() {
    this.initForm();
  }

  // ngOnInit() {
  //   this.checkUserRole();
  // }

  // private checkUserRole() {
  //   const user = this.currentUser();
    
  //   if (user && user.role === 'factory') {
  //     this.hasFactoryRole = true;
  //   } else {
  //     this.messageService.add({ 
  //       severity: 'error', 
  //       summary: 'Access Denied', 
  //       detail: 'Only factory users can add products' 
  //     });
  //     this.router.navigate(['/']);
  //   }
  // }

  private initForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: this.fb.group({
        unit: [0, [Validators.required, Validators.min(0)]],
        currency: ['USD', Validators.required]
      }),
      category: this.fb.group({
        main: ['', Validators.required],
        sub: ['', Validators.required],
        type: ['', Validators.required]
      }),
      specs: this.fb.group({
        material: ['', Validators.required],
        weight: ['', Validators.required],
        dimensions: this.fb.group({
          length: ['', Validators.required],
          width: ['', Validators.required],
          height: ['', Validators.required]
        })
      })
    });
  }

  // Function to convert File to Base64
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        resolve(base64String);
      };
      reader.onerror = error => reject(error);
    });
  }

  // Price calculation methods
  calculateDiscountedUnitPrice(tier: PriceTier): number {
    const basePrice = this.form.get('price.unit')?.value || 0;
    const discountPercent = tier.percent || 0;
    return basePrice * (1 - discountPercent / 100);
  }

  calculateTotalPrice(tier: PriceTier): number {
    return this.calculateDiscountedUnitPrice(tier) * tier.minQty;
  }

  // Discount tier methods
  updateDiscountTier(index: number, field: 'minQty' | 'percent', value: number) {
    this.discountTiers[index] = { ...this.discountTiers[index], [field]: value };
  }

  removeDiscountTier(index: number) {
    if (this.discountTiers.length > 1) {
      this.discountTiers.splice(index, 1);
    }
  }

  addDiscountTier() {
    const lastTier = this.discountTiers[this.discountTiers.length - 1];
    const newTier = {
      minQty: lastTier.minQty + 100,
      percent: lastTier.percent + 5
    };
    this.discountTiers.push(newTier);
  }

  // Image handling methods
  onImageSelect(event: any) {
    const files: File[] = event.files;
    for (let file of files) {
      if (this.imagePreviews.length < 4) {
        this.imageFiles.push(file);
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagePreviews.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  removeImage(index: number) {
    if (this.imagePreviews.length > 1) {
      this.imagePreviews.splice(index, 1);
      this.imageFiles.splice(index, 1);
    }
  }

  // Option management methods
  addOption(type: 'colors' | 'sizes' | 'extra', value: string) {
    if (!value.trim()) return;
    
    if (type === 'colors') {
      this.colors.push({ label: value });
      this.newColor = '';
    } else if (type === 'sizes') {
      this.sizes.push({ label: value });
      this.newSize = '';
    } else if (type === 'extra') {
      this.extra.push({ label: value });
      this.newExtra = '';
    }
  }

  removeOption(type: 'colors' | 'sizes' | 'extra', index: number) {
    if (type === 'colors' && this.colors.length > 1) {
      this.colors.splice(index, 1);
    } else if (type === 'sizes' && this.sizes.length > 1) {
      this.sizes.splice(index, 1);
    } else if (type === 'extra' && this.extra.length > 1) {
      this.extra.splice(index, 1);
    }
  }

  // Form submission
  async onSubmit() {
    // if (!this.hasFactoryRole) {
    //   this.messageService.add({ 
    //     severity: 'error', 
    //     summary: 'Access Denied', 
    //     detail: 'Only factory users can add products' 
    //   });
    //   return;
    // }
    
    if (!this.form.valid || this.imagePreviews.length === 0) {
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'Please fill all required fields and add at least one image' 
      });
      return;
    }

    this.loading = true;
    try {
      // Process images to base64
      const processedImages: string[] = [];
      for (let file of this.imageFiles) {
        const base64Image = await this.fileToBase64(file);
        processedImages.push(base64Image);
      }

      // Prepare product data
      const formValue = this.form.value;
      const user = this.currentUser();
      
      const newProduct: IProduct = {
        id: '', // Will be generated by Firestore
        name: formValue.name,
        description: formValue.description,
        imageUrl: processedImages,
        price: {
          unit: formValue.price.unit,
          currency: formValue.price.currency,
          discountTiers: this.discountTiers
        },
        category: formValue.category,
        specs: formValue.specs,
        supplier: {
          id: user?.id || '', 
          name: user?.businessName || 'Unknown Supplier',
          rating: 4.9
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        sku: '',
        inventory: {
          stock: 0,
          moq: 0,
          unitType: ''
        },
        groupBuy: {
          isActive: false,
          currentQty: 0,
          targetQty: 0
        },
        logistics: {
          shippingClass: '',
          temperatureControl: ''
        },
        status: {
          isVerified: false,
          isActive: false,
          tags: []
        }
      };

      // Save to Firestore
      const productId = await this.productsService.create(newProduct);
      
      if (user) {
        await this.usersService.addProductToUser(user.id, productId);
      }
      
      this.messageService.add({ 
        severity: 'success', 
        summary: 'Success', 
        detail: 'Product added successfully' 
      });
      
      // Navigate to product details
      this.router.navigate(['/products', productId]);
    } catch (error) {
      console.error('Error adding product:', error);
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'Failed to add product' 
      });
    } finally {
      this.loading = false;
    }
  }

  onCancel() {
    this.router.navigate(['/products']);
  }
}