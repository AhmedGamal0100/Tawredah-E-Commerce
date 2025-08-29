import { Component } from '@angular/core';
import { LandingContentComponent } from '../../shared/components/landing-content-component/landing-content-component';

@Component({
  selector: 'app-landing.page',
  imports: [LandingContentComponent],
  templateUrl: './landing.page.html',
  styleUrl: './landing.page.css'
})
export class LandingPage {
}
