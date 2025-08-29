import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { LoginCardAuthComponent } from "../login-card-auth-component/login-card-auth-component.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome-auth-comp',
  imports: [ButtonModule, LoginCardAuthComponent],
  templateUrl: './welcome-auth-comp.html',
  styleUrl: './welcome-auth-comp.scss'
})
export class WelcomeAuthComp {
  private _router = inject(Router);
  public isLoginPage: boolean = true;

  pageSelect(route: string): void {
    if (route === 'login') {
      this.isLoginPage = true;
      this._router.navigate(['/login']);
    } else if (route === 'register') {
      this.isLoginPage = false;
      this._router.navigate(['/register']);
    }
  }

  addLoginAccountLoginList() {
    // Open new login account and save it to the login list
  }
}
