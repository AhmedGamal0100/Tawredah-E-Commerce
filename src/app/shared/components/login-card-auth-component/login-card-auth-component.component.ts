import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-login-card-auth-component',
  imports: [CardModule, AvatarModule],
  templateUrl: './login-card-auth-component.component.html',
  styleUrl: './login-card-auth-component.component.scss'
})
export class LoginCardAuthComponent {

}
