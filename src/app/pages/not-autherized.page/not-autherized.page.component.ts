import { ButtonModule } from 'primeng/button';
import { Component } from '@angular/core';
import { NavbarGeneralComponent } from '../../shared/components/navbar-general-component/navbar-general-component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-autherized.page',
  imports: [NavbarGeneralComponent, ButtonModule, RouterModule],
  templateUrl: './not-autherized.page.component.html',
  styleUrl: './not-autherized.page.component.scss'
})
export class NotAutherizedPageComponent {

}
