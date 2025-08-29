import { Component, inject, OnInit, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { IFilter } from '../../../core/models/filter';

@Component({
  selector: 'app-sidebar-filter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule],
  templateUrl: './sidebar-filter.html',
  styleUrls: ['./sidebar-filter.css']
})
export class SidebarFilterComponent implements OnInit {
  filtersForm!: FormGroup;
  private fb = inject(FormBuilder)
  filtersToParent = output<IFilter>();

  suppliers = [
    // Fabrics
    { value: 'Giza Spinning and Weaving Company', label: 'Giza Cotton' },
    { value: 'Al-Nasr Textile Factory', label: 'Al-Nasr Textile Factory' },
    { value: 'Butterfly Tex', label: 'Butterfly Tex' },
    // Packaging
    { value: 'CairoPac', label: 'CairoPac' },
    { value: 'Associated Industries for Paper & Packaging S.A.E.', label: 'Galal Paper' },
    { value: 'Taghleef Industries S.A.E.', label: 'Taghleef Industries S.A.E.' },
    // Container
    { value: 'Max Plast', label: 'Max Plast' },
    { value: 'Janoub Elsaeed Egypt Company', label: 'Janoub Elsaeed Company' },
    { value: 'Middle East Glass Manufacturing Co. (MEG Sadat)', label: 'MEG Sadat' },
    // Crafting
    { value: 'Beads & Sequin Supplies', label: 'Beads & Sequin Supplies' },
    { value: 'Khayamiya Artisans', label: 'Khayamiya Artisans' },
  ];

  categories = [
    { value: 'Fabrics & Clothing', label: 'Fabrics & Clothing' },
    { value: 'Packaging', label: 'Packaging' },
    { value: 'Crafting', label: 'Crafting' },
    { value: 'Container', label: 'Container' },
  ];

  state = [
    { value: 'new', label: 'New' },
    { value: 'popular', label: 'Popular' },
    { value: 'best-seller', label: 'Best-seller' },
  ];

  moqs = [
    { value: 'first', label: '1 ~ 100' },
    { value: 'second', label: '100 ~ 500' },
    { value: 'third', label: '500 ~ 1000' },
    { value: 'last', label: '1000 ~ Upper' },
  ];

  isMobile = false;
  isMobileOpen = false;

  checkScreen() {
    this.isMobile = window.innerWidth <= 576;
    if (!this.isMobile) {
      this.isMobileOpen = false; // reset when desktop
    }
  }

  toggleMobileFilter() {
    this.isMobileOpen = !this.isMobileOpen;
  }


  ngOnInit(): void {
    this.checkScreen();
    window.addEventListener('resize', () => this.checkScreen());

    this.filtersForm = this.fb.group({
      suppliers: this.fb.array([]),
      categories: this.fb.array([]),
      state: this.fb.array([]),
      moqs: this.fb.array([]),
    });
  }

  onCheckboxChange(event: any, controlName: string) {
    const formArray: FormArray = this.filtersForm.get(controlName) as FormArray;

    if (event.target.checked) {
      formArray.push(this.fb.control(event.target.value));
    } else {
      const index = formArray.controls.findIndex(x => x.value === event.target.value);
      if (index !== -1) {
        formArray.removeAt(index);
      }
    }
  }

  applyFilters() {
    // console.log(this.filtersForm.value);
    this.filtersToParent.emit(this.filtersForm.value)
  }

  resetFilters() {
    this.filtersForm.reset();
    Object.keys(this.filtersForm.controls).forEach(key => {
      (this.filtersForm.get(key) as FormArray).clear();
    });
    document.querySelectorAll<HTMLInputElement>('input[type="checkbox"]').forEach(cb => cb.checked = false);
    this.filtersToParent.emit(this.filtersForm.value)
  }

  ngOnDestroy() {
    this.resetFilters();
    window.removeEventListener('resize', () => this.checkScreen());
  }
}
