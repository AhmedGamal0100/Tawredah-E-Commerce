import { Component, Input, OnInit, OnDestroy, HostListener } from '@angular/core';

import { NewRequestedCard } from "../new-requested-card/new-requested-card";

@Component({
  selector: 'app-similar-product-slider',
  imports: [ NewRequestedCard],
  templateUrl: './similar-product-slider.html',
  styleUrl: './similar-product-slider.scss'
})
export class SimilarProductSlider implements OnInit, OnDestroy {
 @Input() items: any[] = [];
  currentIndex = 0;
  intervalId: any;
  autoPlay = true;

  ngOnInit() {
    this.startAutoSlide();
  }

  ngOnDestroy() {
    this.stopAutoSlide();
  }

  startAutoSlide() {
    this.stopAutoSlide();
    if (this.autoPlay) {
      this.intervalId = setInterval(() => this.next(), 3000);
    }
  }

  stopAutoSlide() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  next() {
    this.currentIndex++;
    if (this.currentIndex >= this.items.length) {
      this.currentIndex = 0; // loop
    }
  }

  prev() {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.items.length - 1; // loop back
    }
  }

  // Pause auto when mouse is inside container
  onMouseEnter() {
    this.stopAutoSlide();
  }

  onMouseLeave() {
    this.startAutoSlide();
  }

  // Pause only when hovering on arrows
  onArrowEnter() {
    this.stopAutoSlide();
  }

  onArrowLeave() {
    this.startAutoSlide();
  }
}