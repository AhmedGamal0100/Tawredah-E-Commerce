import { Component, inject, signal } from '@angular/core';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { confirmPasswordValidator } from './validators';
import { ButtonModule } from 'primeng/button';
import { Router, RouterModule } from '@angular/router';
import { Tooltip } from 'primeng/tooltip';
import { AuthService } from '../../core/services/auth.service';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { AuthErrorCodes } from '@angular/fire/auth';
// import { UserStore } from '../../core/store/user.store';
import { IUser } from '../../core/models/user';
import { UsersService } from '../../core/services/user.service';
import { LoadingService } from '../../core/services/loading.service';

@Component({
  selector: 'app-register.page',
  standalone: true,
  templateUrl: './register.page.html',
  styleUrl: './register.page.css',
  imports: [
    InputTextModule,
    FloatLabelModule,
    FormsModule,
    PasswordModule,
    ReactiveFormsModule,
    ButtonModule,
    Tooltip,
    Toast,
    RouterModule,
  ],
  providers: [MessageService]
})
export class RegisterPage {
  fb = inject(FormBuilder);
  isRoleChosen = signal(false);
  isLoading = signal(false);
  private _router = inject(Router);
  private _authService = inject(AuthService);
  private _messageService = inject(MessageService);
  private _loadingService = inject(LoadingService)
  private userService = inject(UsersService)
  registerForm!: FormGroup;
  visible: boolean = false;
  canDeActivate = signal<boolean>(false);

  onUserConfirmed: () => void = () => { };
  onUserCancelled: () => void = () => { };

  ngOnInit() {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      personalPhoneNumber: ['', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
      confirmPassword: ['', [Validators.required]],
      businessName: ['', [Validators.required]],
      businessPhoneNumber: ['', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
      address: this.fb.group({
        government: ['', [Validators.required]],
        city: ['', [Validators.required]],
        street: ['', [Validators.required]],
        building: ['', [Validators.required]]
      }),
    },
      { validators: confirmPasswordValidator('password', 'confirmPassword') }
    );
  }

  ngDoCheck() {
    if (this.registerForm.touched && !this.registerForm.valid) {
      this.canDeActivate.set(true)
    }
  }

  goToHome() {
    this._router.navigate(['/']);
  }

  goToLogin() {
    this._router.navigate(['/login']);
  }

  async goToRolePage() {
    this.registerForm.reset();
    this.canDeActivate.set(false);
    this.isRoleChosen.set(false);
  }

  // submit() {
  //   if (this.registerForm.valid) {
  //     this._authService.register(this.registerForm.value.email, this.registerForm.value.password)
  //       .then(res => {
  //         this.canDeActivate.set(false)
  //         this.showContrast('Success', "Registration Successfully");
  //         this._authService.sendEmailForVerification(res.user)
  //         this._userStore.createItem(userData)
  //           .then(() => {
  //             this.showContrast('Info', "Verification email sent.");
  //             setTimeout(() => {
  //               this.registerForm.reset();
  //               this._router.navigate(['/login']);
  //             }, 1500);
  //           })
  //           .catch(err => {
  //             this.showContrast('Error', "Something went wrong. Not able to send email to you.");
  //             this.isLoading.set(false);
  //           });
  //       })
  //       .catch(err => {
  //         this.isLoading.set(false);
  //         if (err.message.includes(AuthErrorCodes.EMAIL_EXISTS)) {
  //           this.showContrast('Error', "Email already exists.");
  //         } else {
  //           this.showContrast('Error', err.message);
  //         }
  //       });

  //   } else {
  //     this.showContrast('Error', 'Form is invalid');
  //   }
  // }

  async submit() {
    if (this.registerForm.invalid) {
      this.showContrast('Error', 'Form is invalid');
      this.registerForm.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);
    const formValue = this.registerForm.value;

    const newUser = {
      ...formValue,
      avatarUrl: '/favicon_io-icon/android-chrome-512x512.png',
      addresses: [this.registerForm.controls['address'].value],
      subscribe: false,
      products: [{}],
      password: '',
      createdAt: new Date(),
    };
    this._authService.register(this.registerForm.value.email, this.registerForm.value.password)
      .then(res => {
        this.canDeActivate.set(false)
        this.showContrast('Success', "Registration Successfully");
        this._authService.sendEmailForVerification(res.user)
        this.userService.create(newUser)
          .then(() => {
            this.showContrast('Info', "Verification email sent.");
            setTimeout(() => {
              this.registerForm.reset();
              this._router.navigate(['/login']);
            }, 1500);
          })
          .catch(err => {
            this.showContrast('Error', "Something went wrong. Not able to send email to you.");
            this.isLoading.set(false);
          });
      })
      .catch(err => {
        this.isLoading.set(false);
        if (err.message.includes(AuthErrorCodes.EMAIL_EXISTS)) {
          this.showContrast('Error', "Email already exists.");
        } else {
          this.showContrast('Error', err.message);
        }
      })
  }

  userRole(role: string) {
    this.isRoleChosen.set(true);
    this.registerForm.addControl('role', this.fb.control(role, Validators.required));
    this.registerForm.get('role')?.setValue(role);
  }

  showContrast(summary: string, detail: string) {
    this._messageService.add({ severity: 'secondary', summary, detail });
  }

  showConfirm(resolve: (result: boolean) => boolean) {
    if (!this.visible) {
      this._messageService.add({
        key: 'confirm',
        sticky: true,
        severity: 'secondary',
        styleClass: 'backdrop-blur-lg rounded-2xl',
      });
      this.visible = true;
      this._loadingService.hide()

      this.onUserConfirmed = () => {
        this.onClose();
        this._loadingService.show()
        resolve(true);
      };

      this.onUserCancelled = () => {
        this.onClose();
        resolve(false);
      };
    }
  }

  onClose() {
    this.visible = false;
    this._messageService.clear('confirm');
  }
}

