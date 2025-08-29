import { Component,Input  } from '@angular/core';

@Component({
  selector: 'app-logo-slider-component',
  imports: [],
  templateUrl: './logo-slider-component.html',
  styleUrl: './logo-slider-component.scss'
})
export class LogoSliderComponent {
    @Input() logos: string[] = [];
  @Input() speed: number = 30; 

}
