import { AfterViewChecked, Component, effect, inject, signal } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { AuthService } from '../../core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Tooltip } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
// import { UserStore } from '../../core/store/user.store';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { AuthErrorCodes } from '@angular/fire/auth';
import { IUser } from '../../core/models/user';
import { LoginStore } from '../../core/store/login.store';
import { ProductsStore } from '../../core/store/products.store';
import { ProductsService } from '../../core/services/products.service';
import { IProduct } from '../../core/models/product';
@Component({
  selector: 'app-login.page',
  imports: [InputTextModule, FloatLabelModule, CommonModule, ToastModule, ReactiveFormsModule, FormsModule, Tooltip, PasswordModule, ButtonModule, DividerModule, AnimateOnScrollModule, Toast],
  templateUrl: './login.page.html',
  styleUrl: './login.page.css',
  providers: [MessageService]
})

export class LoginPage {
  fb = inject(FormBuilder);
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);
  private _authService = inject(AuthService);
  // private _userStore = inject(UserStore);
  private _messageService = inject(MessageService)
  private _loginStore = inject(LoginStore)
  isForgetPass = signal(false)
  // emailForgetPass = signal<string>('');
  private _productsStore = inject(ProductsStore)
  private _productsService = inject(ProductsService)

  loginForm!: FormGroup;

  constructor() {
    // this._productsStore.filterByCategories("Crafting");

    effect(() => {
      // this._productsStore.filterByCategories("Packaging");
      // this._productsStore.filterByCategories("Fabrics & Clothing");
      // this._productsStore.filterByCategories("Crafting");
      // this._productsStore.filterByCategories("Container");
      // let prods = this._productsStore.products()
      // if (prods)
      //   prods?.forEach(prd => {
      //     // console.log(prd.);
      //     // console.log(prd.specs.material);
      //   })

      // let filtered = this._productsStore.filteredProducts()
      // if (filtered) {

      // } else {
      //   console.log("no");

      // }
    })
  }

  ngAfterViewInit() {
    this._route.queryParams.subscribe(params => {
      if (params['message']) {
        this.showContrast('Info', "You must be logged in to access that page.");
      }
    });
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      forgetPass: [''],
      password: ['', [Validators.required]],
    })
  }

  goToHome() {
    this._router.navigate(['/']);
  }

  goToRegister() {
    this._router.navigate(['/register']);
  }

  forgetPassReveal() {
    this.isForgetPass.set(true)
  }

  backToLogin() {
    this.isForgetPass.set(false)
  }

  forgetPass() {
    this._authService.forgotPassword(this.loginForm.value.forgetPass).then(res => {
      this.showContrast('Info', 'If this email is correct, check your inbox!');
      console.log(this.loginForm.get("forgetPass"));
      this.loginForm.get("forgetPass")?.setValue("");
      this.isForgetPass.set(false)
    }).catch(err => {
      this.showContrast('Error', 'Something went wrong!')
    });
  }

  signInWithGoogle() {
    this._authService.signInWithGoogle().then(() => {
      this.showContrast("Success", "Login Successfully")
      localStorage.setItem("token", "true")
      this._loginStore.setLogIn()
      this._router.navigateByUrl('');
    })
  }

  signInWithFacebook() {
    this._authService.signInWithFacebook()
  }

  submit() {
    if (this.loginForm.valid) {
      this._authService.login(this.loginForm.value.email, this.loginForm.value.password)
        .then(res => {
          this._loginStore.setEmail(this.loginForm.value.email)
          console.log(this._loginStore.loggedAccount());
          this.showContrast("Success", "Login Successfully")
          localStorage.setItem("token", "true")
          localStorage.setItem("email", this.loginForm.value.email)
          this._loginStore.setLogIn()
          setTimeout(() => {
            if(this._loginStore.loggedAccount()?.role == 'factory'){
              this._router.navigate(['/supplier']);
            }else{
            this._router.navigateByUrl('');
            }
          }, 1000);
        })
        .catch(err => {
          if (err instanceof Error) {
            if (err.message.includes(AuthErrorCodes.INVALID_EMAIL)) {
              this.showContrast("Error", 'Invalid email address.');
            }
            else if (err.message.includes('Auth/invalid-credential')) {
              this.showContrast("Error", 'Invalid Email or Password.');
            }
            else if (err.message.includes(AuthErrorCodes.WEAK_PASSWORD)) {
              this.showContrast("Error", 'Password is too weak.');
            }
            else if (err.message.includes(AuthErrorCodes.EMAIL_EXISTS)) {
              this.showContrast("Error", 'Email already exists.');
            }
            else {
              this.showContrast("Error", 'An unexpected error occurred. Please try again.');
            }
          }
          this.showContrast("Error", 'Error signing in');
        });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  showContrast(summary: string, detail: string) {
    this._messageService.add({ severity: 'secondary', summary, detail });
  }
}
