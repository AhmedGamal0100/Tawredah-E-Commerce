import { Component, inject, OnInit, signal } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
// import { ProductsService } from './core/services/products.service';
import AOS from 'aos';
import { LoadingService } from './core/services/loading.service';
import { LoadingComponent } from "./shared/components/loading/loading.component";
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { LoginStore } from './core/store/login.store';


@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, LoadingComponent, ToastModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
  providers: [MessageService]
})
export class App implements OnInit {
  private loginStore = inject(LoginStore)


  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');

    if (token && email) {
      this.loginStore.setEmail(email);
      this.loginStore.setLogIn();
    }


    AOS.init({
      duration: 1000, // animation duration (in ms)
      once: true, // whether animation should happen only once
      easing: 'ease-in-out',
    });
  }
}
