import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { LoginStore } from '../../../core/store/login.store';
import { IUser } from '../../../core/models/user';
import { UsersService } from '../../../core/services/user.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../../core/services/auth.service';
import { FileUploadModule } from 'primeng/fileupload';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, ToastModule, FileUploadModule],
  providers: [MessageService],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.css'
})
export class ProfilePage {
  private loginStore = inject(LoginStore);
  profileForm!: FormGroup;
  isEditing = false;
  fb = inject(FormBuilder);
  loggedAccount = signal<IUser | null>(null);
  isLoading = true;
  userService = inject(UsersService);
  private _messageService = inject(MessageService)
  authService = inject(AuthService)
  
  // Track if user is changing avatar
  isChangingAvatar = false;
  avatarPreview: string | null = null;

  constructor() {
    effect(() => {
      const account = this.loginStore.loggedAccount();
      this.loggedAccount.set(account);

      if (account && this.profileForm) {
        this.populateForm(account);
      }
    })
    
  }

  ngOnInit() {
    this.initializeForm();

    console.log(this.loginStore.email());
    console.log(this.loginStore.loggedAccount());
    
  }

  initializeForm() {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      personalPhoneNumber: ['', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
      avatarUrl: [''],
      businessName: ['', [Validators.required]],
      businessPhoneNumber: ['', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
      paymentMethods: this.fb.array([]),
      addresses: this.fb.array([])
    });
    this.profileForm.disable();
    this.isLoading = false;
  }

  populateForm(account: IUser) {
    this.profileForm.patchValue({
      firstName: account.firstName,
      lastName: account.lastName,
      email: account.email,
      personalPhoneNumber: account.personalPhoneNumber,
      avatarUrl: account.avatarUrl || 'https://i.pravatar.cc/150?u=avatar2',
      businessName: account.businessName,
      businessPhoneNumber: account.businessPhoneNumber,
    });

    // Reset avatar preview when populating form
    this.avatarPreview = null;
    this.isChangingAvatar = false;

    this.paymentMethods.clear();
    account.paymentMethods?.forEach((pm) => {
      this.paymentMethods.push(this.createPaymentMethodGroup(pm));
    });

    this.addresses.clear();
    account.addresses?.forEach((addr) => {
      this.addresses.push(this.createAddressGroup(addr));
    })
  }

  get paymentMethods(): FormArray {
    return this.profileForm.get('paymentMethods') as FormArray;
  }

  get addresses(): FormArray {
    return this.profileForm.get('addresses') as FormArray;
  }

  createPaymentMethodGroup(pm?: any): FormGroup {
    return this.fb.group({
      id: [pm?.id || crypto.randomUUID()],
      cardNumber: [pm?.cardNumber || '', [Validators.required, Validators.pattern(/^(?:\d[ -]?){12,18}\d$/)]],
      securityCode: [pm?.securityCode || '', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
      expiryDate: [pm?.expiryDate || '', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]]
    });
  }

  createAddressGroup(addr?: any): FormGroup {
    return this.fb.group({
      id: [addr?.id || crypto.randomUUID()],
      government: [addr?.government || '', [Validators.required]],
      city: [addr?.city || '', [Validators.required]],
      street: [addr?.street || '', [Validators.required]],
      building: [addr?.building || '', [Validators.required]]
    })
  }

  addPaymentMethod() {
    if (this.paymentMethods.length < 3) {
      this.paymentMethods.push(this.createPaymentMethodGroup());
    }
  }

  removePaymentMethod(index: number) {
    if (this.paymentMethods.length > 1) {
      this.paymentMethods.removeAt(index);
    }
  }

  // Addresses
  addAddress() {
    if (this.addresses.length < 3) {
      this.addresses.push(this.createAddressGroup());
    }
  }

  removeAddress(index: number) {
    if (this.addresses.length > 1) {
      this.addresses.removeAt(index);
    }
  }

  // Avatar handling methods
  startAvatarChange() {
    this.isChangingAvatar = true;
  }

  cancelAvatarChange() {
    this.isChangingAvatar = false;
    this.avatarPreview = null;
    
    // Reset to original avatar
    if (this.loggedAccount()) {
      this.profileForm.patchValue({
        avatarUrl: this.loggedAccount()?.avatarUrl || 'https://i.pravatar.cc/150?u=avatar2'
      });
    }
  }

  removeAvatar() {
    this.avatarPreview = null;
    this.profileForm.patchValue({
      avatarUrl: 'https://i.pravatar.cc/150?u=avatar2'
    });
    this.isChangingAvatar = false;
  }

  // Convert file to base64
  async onAvatarUpload(event: any) {
    const file = event.files[0];
    if (!file) return;

    try {
      const base64Image = await this.fileToBase64(file);
      this.avatarPreview = base64Image;
      this.profileForm.patchValue({
        avatarUrl: base64Image
      });
    } catch (error) {
      console.error('Error converting image to base64:', error);
      this._messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to process image'
      });
    }
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.profileForm.enable();
      // Reset avatar state when entering edit mode
      this.isChangingAvatar = false;
      this.avatarPreview = null;
    } else {
      this.profileForm.disable();
      if (this.loggedAccount()) {
        this.populateForm(this.loggedAccount()!);
            console.log(this.loggedAccount());

      }
    }
  }

  async saveChanges() {
  if (this.profileForm.invalid) {
    this.profileForm.markAllAsTouched();
    return;
  }
  
  const updatedData = this.profileForm.value;
  
  try {
    // Update user in Firebase
    await this.userService.update(this.loggedAccount()!.id, updatedData);
    
    // Update local state
    const newAccount = { ...this.loggedAccount()!, ...updatedData };
    this.loginStore.setLoggedAccount(newAccount);
    this.loggedAccount.set(newAccount);
    
    this.showContrast('Profile Updated', 'Your changes have been saved successfully.');
    this.toggleEdit();
  } catch (error) {
    console.error('Error updating profile in Firebase:', error);
    this._messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to update profile in Firebase'
    });
  }
}

  showContrast(summary: string, detail: string) {
    this._messageService.add({ severity: 'secondary', summary, detail });
  }

  // Get the current avatar URL for display
  getAvatarUrl(): string {
    if (this.avatarPreview) {
      return this.avatarPreview;
    }
    return this.profileForm.get('avatarUrl')?.value || 'https://i.pravatar.cc/150?u=avatar2';
  }
}