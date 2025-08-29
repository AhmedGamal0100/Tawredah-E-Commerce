import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-testimoinals-component',
  imports: [CommonModule],
  templateUrl: './testimoinals-component.html',
  styleUrl: './testimoinals-component.scss',
})
export class TestimoinalsComponent {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  testimonials = [
    {
      img: 'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png',
      name: 'Neamat A.,',
      role: 'Grocery Store Owner',
      rate: 5,
      review:
        'Tawredah has completely changed how we stock our store. The prices are great, delivery is always on time, and the ordering process is super easy. Highly recommend it for any business owner.',
    },
    {
      img: 'https://primefaces.org/cdn/primeng/images/demo/avatar/asiyajavayant.png',
      name: 'Dareen D.,',
      role: 'Café Owner',
      rate: 4,
      review:
        'Ordering through Tawredah is so convenient. I can find all my supplies in one place, and the delivery team is always professional and on time.',
    },
    {
      img: 'https://primefaces.org/cdn/primeng/images/demo/avatar/onyamalimba.png',
      name: 'Moustafa Kh.,',
      role: 'Restaurant Manager',
      rate: 5,
      review:
        'We’ve been using Tawredah for months now. Prices are competitive, and the bulk deals help us cut costs without compromising quality.',
    },
    {
      img: 'https://primefaces.org/cdn/primeng/images/demo/avatar/xuxuefeng.png',
      name: 'Ahmed G.,',
      role: 'Boutique Owner',
      rate: 5,
      review:
        'Even though my store is small, Tawredah treats me like a priority. The platform is easy to use and the support team is always responsive.',
    },
    {
      img: 'https://i.pravatar.cc/150?u=avatar2',
      name: 'Mohamed A.,',
      role: "Supermarket Owner",
      rate: 5,
      review:
        'Tawredah’s variety and reliability have made a huge difference for my business. I can restock quickly and focus more on my customers.',
    },
    {
      img: 'https://primefaces.org/cdn/primeng/images/demo/avatar/ionibowcher.png',
      name: 'Eiman H.,',
      role: 'Bakery Owner',
      rate: 4,
      review:
        'The freshness of the products is outstanding. I trust Tawredah to deliver exactly what I need for my daily baking schedule.',
    },
  ];

  activeIndex = Math.floor(this.testimonials.length / 2); // start from middle card
  autoScrollInterval: any;
  scrollSpeed = 2; // px per frame

  ngAfterViewInit() {
    setTimeout(() => this.scrollToMiddle(), 100);
    this.startAutoScroll();
  }

  ngOnDestroy() {
    this.stopAutoScroll(); // cleanup when component destroyed
  }

  /** Center middle card on load */
  scrollToMiddle() {
    const container = this.scrollContainer.nativeElement;
    const middleIndex = Math.floor(this.testimonials.length / 2);
    const card = container.children[middleIndex];
    const offset = card.offsetLeft - (container.clientWidth / 2 - card.clientWidth / 2);
    container.scrollTo({ left: offset, behavior: 'smooth' });
  }

  /** Infinite auto scroll */
  startAutoScroll() {
    const container = this.scrollContainer.nativeElement;
    this.autoScrollInterval = setInterval(() => {
      container.scrollLeft += this.scrollSpeed;
      if (container.scrollLeft + container.clientWidth >= container.scrollWidth) {
        container.scrollLeft = 0; // loop back to start
      }
    }, 20);
  }

  stopAutoScroll() {
    clearInterval(this.autoScrollInterval);
  }

  /** Center hovered card */
  focusCard(i: number) {
    this.stopAutoScroll();
    this.activeIndex = i;
    const container = this.scrollContainer.nativeElement;
    const card = container.children[i];
    const offset = card.offsetLeft - (container.clientWidth / 2 - card.clientWidth / 2);
    container.scrollTo({ left: offset, behavior: 'smooth' });
  }

  /** Resume auto scroll */
  unFocusCard() {
    this.startAutoScroll();
  }
}
