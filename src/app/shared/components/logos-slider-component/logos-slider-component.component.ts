import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-logos-slider-component',
  imports: [CommonModule],
  templateUrl: './logos-slider-component.component.html',
  styleUrl: './logos-slider-component.component.css'
})
export class LogosSliderComponentComponent {
  @Input() logos: string[] = [];
  @Input() speed: number = 10;
}
