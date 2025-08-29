import { Component, inject } from '@angular/core';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import "primeicons/primeicons.css";
import { SelectModule } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { PrimeNG } from 'primeng/config';
import { FileUpload } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { HttpClientModule } from '@angular/common/http';
import { ProgressBar } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { Textarea } from "primeng/textarea";
import { RequestedService } from '../../core/services/requested.service';

@Component({
  selector: 'app-requested-product-form.page',
  standalone: true,
  imports: [
    InputTextModule,
    FloatLabelModule,
    FormsModule,
    PasswordModule,
    ReactiveFormsModule,
    SelectModule,
    FileUpload,
    ButtonModule,
    CommonModule,
    BadgeModule,
    HttpClientModule,
    ProgressBar,
    ToastModule,
    Textarea
  ],
  templateUrl: './requested-product-form.page.html',
  styleUrl: './requested-product-form.page.css',
  providers: [MessageService]
})
export class RequestedProductFormPage {

  fb = inject(FormBuilder);
  registerForm!: FormGroup;
  requestProduct = inject(RequestedService);

  constructor(private config: PrimeNG, private messageService: MessageService) { }

  category = ["Container", "Crafting", "Fabrics & Clothing", "Packaging"];
  subCategory = ["Bottles", "Jars", "Bags", "Strings", "Boxes", "Accessories"];
  material = ["Glass", "Plastic", "Wood", "Cardboard", "Metal"];

  files: File[] = [];
  totalSize: number = 0;
  totalSizePercent: number = 0;
  base64Images: string[] = [];

  ngOnInit() {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      category: ['', [Validators.required]],
      subCategory: ['', [Validators.required]],
      material: ['', [Validators.required]],
      productHeight: ['', [Validators.required]],
      productLength: ['', [Validators.required]],
      productWidth: ['', [Validators.required]],
      productWeight: ['', [Validators.required]],
      extraInfo: [''],
      images: [[]]   // store base64 images here
    });
  }

  // --------- SUBMIT ----------
async submit() {
  if (!this.registerForm.valid) {
    this.registerForm.markAllAsTouched();
    return;
  }

  try {
    // 🔹 Make sure files exist before converting
    console.log("Files before converting:", this.files);

    let imagesBase64: string[] = [];
    if (this.files ) {
      imagesBase64 = await this.convertAllFilesToBase64(this.files);
      console.log("Converted base64 images:", imagesBase64);
    }

    // 🔹 Build formData with images included
    const formData = {
      ...this.registerForm.value,
      images: imagesBase64,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log("Submitting to Firebase:", formData);

    // 🔹 Send to Firestore
    await this.requestProduct.create(formData);

    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Product request submitted!',
      life: 3000
    });

    // 🔹 Reset everything
    this.registerForm.reset();
    this.files = [];
    this.base64Images = [];
    this.totalSize = 0;
    this.totalSizePercent = 0;

  } catch (err) {
    console.error("Submit error:", err);
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to submit request',
      life: 3000
    });
  }
}


  // --------- FILE UPLOAD METHODS ----------
  choose(event: any, callback: () => void) {
    callback();
  }

  onRemoveTemplatingFile(event: any) {
const removedFile = event.file;
  this.files = this.files.filter(f => f !== removedFile);
  this.totalSize = this.files.reduce((acc, file) => acc + file.size, 0);
  this.totalSizePercent = this.totalSize / 10;
  console.log("Removed file:", removedFile);
  }

  onClearTemplatingUpload() {
   this.files = [];
  this.totalSize = 0;
  this.totalSizePercent = 0;
  this.registerForm.patchValue({ images: [] });
  console.log("Cleared all files");
  }

  onTemplatedUpload() {
    this.messageService.add({
      severity: 'info',
      summary: 'Success',
      detail: 'File Uploaded',
      life: 3000
    });
  }

  onSelectedFiles(event: any) {
    // PrimeNG gives FileList → convert to array
    this.files = Array.from(event.files ||[]);
    this.totalSize = this.files.reduce((acc, file) => acc + file.size, 0);
    this.totalSizePercent = this.totalSize / 10;
    console.log("Selected files:", this.files);
  }

  uploadEvent(callback: () => void) {
    callback();
  }

  formatSize(bytes: number) {
    const k = 1024;
    const dm = 3;
    const sizes = this.config.translation?.fileSizeTypes ?? ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return `0 ${sizes[0]}`;

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  }

  // --------- HELPERS ----------
  private convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file); // ✅ File is a Blob
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  private convertAllFilesToBase64(files: File[]): Promise<string[]> {
    return Promise.all(files.map(file => this.convertFileToBase64(file)));
  }
}


// import { Component, inject } from '@angular/core';
// import { FloatLabelModule } from 'primeng/floatlabel';
// import { InputTextModule } from 'primeng/inputtext';
// import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
// import { PasswordModule } from 'primeng/password';
// import "primeicons/primeicons.css";
// import { SelectModule } from 'primeng/select';
// import { MessageService } from 'primeng/api';
// import { PrimeNG } from 'primeng/config';
// import { FileUpload } from 'primeng/fileupload';
// import { ButtonModule } from 'primeng/button';
// import { CommonModule } from '@angular/common';
// import { BadgeModule } from 'primeng/badge';
// import { HttpClientModule } from '@angular/common/http';
// import { ProgressBar } from 'primeng/progressbar';
// import { ToastModule } from 'primeng/toast';
// import { Textarea } from "primeng/textarea";
// import { RequestedService } from '../../core/services/requested.service';
// import { IRequestedProduct } from '../../core/models/requestedProduct';

// @Component({
//   selector: 'app-requested-product-form.page',
//   standalone: true,
//   imports: [
//     InputTextModule,
//     FloatLabelModule,
//     FormsModule,
//     PasswordModule,
//     ReactiveFormsModule,
//     SelectModule,
//     FileUpload,
//     ButtonModule,
//     CommonModule,
//     BadgeModule,
//     HttpClientModule,
//     ProgressBar,
//     ToastModule,
//     Textarea
//   ],
//   templateUrl: './requested-product-form.page.html',
//   styleUrl: './requested-product-form.page.css',
//   providers: [MessageService]
// })
// export class RequestedProductFormPage {
//   fb = inject(FormBuilder);
//   registerForm!: FormGroup;
//   requestProduct = inject(RequestedService);

//   constructor(private config: PrimeNG, private messageService: MessageService) {}

//   category = ["Packaging", "Raw Material", "Plastic", "Glass", "Other"];
//   subCategory = ["Sub Category 1", "Sub Category 2", "Sub Category 3"];
//   material = ["Material 1", "Material 2", "Material 3"];

//   files: File[] = [];
//   totalSize: number = 0;
//   totalSizePercent: number = 0;

//   ngOnInit() {
//     this.registerForm = this.fb.group({name: ['', [Validators.required]],
//       description: ['', [Validators.required]],
//       category: ['', [Validators.required]],
//       subCategory: ['', [Validators.required]],
//       material: ['', [Validators.required]],
//       packageSize: ['', [Validators.required]],   // text in UI, we’ll keep it but not used in IRequestedProduct
//       productHeight: ['', [Validators.required]],
//       productLength: ['', [Validators.required]],
//       productWidth: ['', [Validators.required]],
//       productWeight: ['', [Validators.required]],
//       extraInfo: [''],                            // optional; we’ll drop into tags if you want
//     });
//   }

//   // --------- SUBMIT ----------
//   async submit() {
//     if (!this.registerForm.valid) {
//       this.registerForm.markAllAsTouched();
//       return;
//     }

//     try {
//       const v = this.registerForm.value;

//       // map simple form to your IRequestedProduct shape (without id/createdAt/updatedAt/imageUrl)
//       const payload: Omit<IRequestedProduct, 'id' | 'createdAt' | 'updatedAt' | 'imageUrl'> = {
//         sku: '',
//         supplier: {
//           id: '',
//           name: '',
//           rating: 0,
//         },
//       name,
//         description: v.description,
//         category: {
//           main: v.category,
//           sub: v.subCategory,
//           type: v.material,
//         },
//         price: {
//           unit: 0,
//           currency: 'EGP',
//           discountTiers: [],
//         },
//         inventory: {
//           stock: 0,
//           moq: 1,
//           unitType: 'unit',
//         },
//         groupBuy: {
//           isActive: false,
//           currentQty: 0,
//           targetQty: 0,
//         },
//         // imageUrl will be written by service after upload
//         specs: {
//           weight: Number(v.productWeight) || 0,
//           dimensions: {
//             length: Number(v.productLength) || 0,
//             width: Number(v.productWidth) || 0,
//             height: Number(v.productHeight) || 0,
//           },
//           material: v.material,
//         },
//         logistics: {
//           shippingClass: 'standard',
//           temperatureControl: 'none',
//         },
//         status: {
//           isVerified: false,
//           isActive: true,
//           tags: v.extraInfo ? [String(v.extraInfo)] : [],
//         },
//         vote: 0,
//       };

//       // let the service upload files to Storage and write Firestore doc with imageUrl[]
//       await this.requestProduct.create(payload, this.files);

//       this.messageService.add({
//         severity: 'success',
//         summary: 'Success',
//         detail: 'Product request submitted!',
//         life: 3000
//       });

//       // reset
//       this.registerForm.reset();
//       this.files = [];
//       this.totalSize = 0;
//       this.totalSizePercent = 0;
//     } catch (err) {
//       console.error('Submit error:', err);
//       this.messageService.add({
//         severity: 'error',
//         summary: 'Error',
//         detail: 'Failed to submit request',
//         life: 3000
//       });
//     }
//   }

//   // --------- FILE UPLOAD METHODS ----------
//   choose(event: any, callback: () => void) {
//     callback();
//   }

//   onRemoveTemplatingFile(event: any, file: File, removeFileCallback: (arg0: any, arg1: any) => void, index: number) {
//     removeFileCallback(event, index);
//     this.totalSize -= file.size;
//     this.totalSizePercent = this.totalSize / 10;
//     this.files.splice(index, 1);
//   }

//   onClearTemplatingUpload(clear: () => void) {
//     clear();
//     this.totalSize = 0;
//     this.totalSizePercent = 0;
//     this.files = [];
//   }

//   onSelectedFiles(event: any) {
//     // PrimeNG 17 emits `event.files` (File[]). Some older examples use `currentFiles`.
//     const picked: File[] =
//       (event?.files && Array.isArray(event.files) ? event.files :
//       (event?.currentFiles && Array.isArray(event.currentFiles) ? event.currentFiles : [])) as File[];

//     this.files = picked;
//     this.totalSize = this.files.reduce((acc, file) => acc + (file?.size || 0), 0);
//     this.totalSizePercent = this.totalSize / 10;
//     console.log('Selected files:', this.files);
//   }

//   uploadEvent(callback: () => void) {
//     callback();
//   }

//   formatSize(bytes: number) {
//     const k = 1024;
//     const dm = 3;
//     const sizes = this.config.translation?.fileSizeTypes ?? ['Bytes', 'KB', 'MB', 'GB', 'TB'];
//     if (bytes === 0) return `0 ${sizes[0]}`;
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
//   }
// }
