import { ButtonModule } from 'primeng/button';
import { Component } from '@angular/core';
import { NavbarGeneralComponent } from '../../shared/components/navbar-general-component/navbar-general-component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found.page',
  imports: [NavbarGeneralComponent,ButtonModule,RouterModule],
  templateUrl: './not-found.page.html',
  styleUrl: './not-found.page.scss'
})
export class NotFoundPage {

}
