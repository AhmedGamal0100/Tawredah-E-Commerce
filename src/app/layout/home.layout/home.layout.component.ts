import { Component } from '@angular/core';
import { NavbarGeneralComponent } from "../../shared/components/navbar-general-component/navbar-general-component";
import { FooterComponent } from "../../shared/components/footer-component/footer-component";
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-home.layout',
  imports: [NavbarGeneralComponent, FooterComponent, RouterOutlet, ToastModule],
  templateUrl: './home.layout.component.html',
  styleUrl: './home.layout.component.css',

})
export class HomeLayoutComponent {
  
}
