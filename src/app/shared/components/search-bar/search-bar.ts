import { Component, OnDestroy, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-search-bar',
  imports: [
    FormsModule,
    InputGroupAddonModule,
    InputTextModule,
    ButtonModule,
    MenuModule,
    CommonModule
  ],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css',
})
export class SearchBar implements OnDestroy {
  images: string[] = [
    "https://images.unsplash.com/photo-1732928729959-2e8fdb5a5cd7?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.1.0",
    "https://images.unsplash.com/photo-1660033572119-8ba516bda64b?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.1.0",
    "https://images.unsplash.com/photo-1635925281107-2c731eec4a75?q=80&w=560&auto=format&fit=crop&ixlib=rb-4.1.0"
  ];
  searchInput: string = "";
  searchToParent = output<string>();

  currentIndex = 0;
  private intervalId: any;

  ngOnInit() {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 10000);
  }

  ngOnDestroy() {
    this.searchInput = '';
    this.searchToParent.emit('');

    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  getPositionClass(i: number): string {
    if (i === this.currentIndex) return 'active';
    if (i === (this.currentIndex + 1) % this.images.length) return 'next';
    if (i === (this.currentIndex - 1 + this.images.length) % this.images.length) return 'prev';
    return 'hidden';
  }

  applySearch() {
    if (this.searchInput) {
      this.searchToParent.emit(this.searchInput);
    }
    this.searchInput = '';
  }

  onSearchChange(value: string): void {
    this.searchToParent.emit(this.searchInput);
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.applySearch();
    }
  }
}
