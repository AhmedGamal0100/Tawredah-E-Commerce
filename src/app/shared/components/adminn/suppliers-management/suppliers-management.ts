import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { RouterModule } from '@angular/router';

interface Supplier {
  id: string;
  name: string;
  contactEmail: string;
  phone: string;
  address: string;
  rating: number;
  totalProducts: number;
  status: string;
  joinDate: Date;
}

interface SelectOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-suppliers-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    TagModule,
    ButtonModule,
    TooltipModule,
    RouterModule,
  ],
  templateUrl: './suppliers-management.html',
  styleUrls: ['./suppliers-management.css'],
})
export class SuppliersManagement {
  suppliers: Supplier[] = [];
  filteredSuppliers: Supplier[] = [];
  searchInput: string = '';
  selectedStatus: string = '';
  selectedRating: string = '';
  statusDropdownOpen = false;
  ratingDropdownOpen = false;

  statusOptions: SelectOption[] = [
    { label: 'All Status', value: '' },
    { label: 'Active', value: 'Active' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Suspended', value: 'Suspended' },
  ];

  ratingOptions: SelectOption[] = [
    { label: 'All Ratings', value: '' },
    { label: '5 Stars', value: '5' },
    { label: '4+ Stars', value: '4' },
    { label: '3+ Stars', value: '3' },
    { label: '2+ Stars', value: '2' },
    { label: '1+ Stars', value: '1' },
  ];

  constructor() {
    this.loadSuppliers();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (!target.closest('.custom-selector')) {
      this.statusDropdownOpen = false;
      this.ratingDropdownOpen = false;
    }
  }

  get activeSuppliersCount(): number {
    return this.suppliers.filter((s) => s.status === 'Active').length;
  }

  get averageRating(): number {
    if (this.suppliers.length === 0) return 0;
    const total = this.suppliers.reduce(
      (sum, supplier) => sum + supplier.rating,
      0
    );
    return total / this.suppliers.length;
  }

  get totalProducts(): number {
    return this.suppliers.reduce(
      (sum, supplier) => sum + supplier.totalProducts,
      0
    );
  }

  loadSuppliers() {
    // Simulated data - in real application, this would come from a service
    this.suppliers = [
      {
        id: '1',
        name: 'SteelCo Inc.',
        contactEmail: 'contact@steelco.com',
        phone: '+1 (555) 123-4567',
        address: '123 Industry Ave, Detroit, MI',
        rating: 4.5,
        totalProducts: 45,
        status: 'Active',
        joinDate: new Date('2022-03-15'),
      },
      {
        id: '2',
        name: 'TechParts Ltd.',
        contactEmail: 'info@techparts.com',
        phone: '+1 (555) 987-6543',
        address: '456 Tech Park, San Jose, CA',
        rating: 4.2,
        totalProducts: 32,
        status: 'Active',
        joinDate: new Date('2022-05-20'),
      },
      {
        id: '3',
        name: 'WoodWorks International',
        contactEmail: 'sales@woodworks.com',
        phone: '+1 (555) 456-7890',
        address: '789 Timber Rd, Portland, OR',
        rating: 4.7,
        totalProducts: 28,
        status: 'Pending',
        joinDate: new Date('2023-01-10'),
      },
      {
        id: '4',
        name: 'PlasticMold Corp.',
        contactEmail: 'support@plasticmold.com',
        phone: '+1 (555) 234-5678',
        address: '321 Polymer St, Houston, TX',
        rating: 3.8,
        totalProducts: 19,
        status: 'Active',
        joinDate: new Date('2022-08-05'),
      },
      {
        id: '5',
        name: 'Global Electronics',
        contactEmail: 'orders@globalelectronics.com',
        phone: '+1 (555) 876-5432',
        address: '654 Circuit Blvd, Austin, TX',
        rating: 4.9,
        totalProducts: 67,
        status: 'Active',
        joinDate: new Date('2021-11-30'),
      },
      {
        id: '6',
        name: 'Textile Manufacturers',
        contactEmail: 'info@textilemfg.com',
        phone: '+1 (555) 345-6789',
        address: '987 Fabric Ave, Charlotte, NC',
        rating: 4.0,
        totalProducts: 23,
        status: 'Suspended',
        joinDate: new Date('2022-12-15'),
      },
    ];
    this.filteredSuppliers = [...this.suppliers];
  }

  toggleStatusDropdown() {
    this.statusDropdownOpen = !this.statusDropdownOpen;
    if (this.statusDropdownOpen) {
      this.ratingDropdownOpen = false;
    }
  }

  toggleRatingDropdown() {
    this.ratingDropdownOpen = !this.ratingDropdownOpen;
    if (this.ratingDropdownOpen) {
      this.statusDropdownOpen = false;
    }
  }

  selectStatus(value: string) {
    this.selectedStatus = value;
    this.statusDropdownOpen = false;
    this.applyFilters();
  }

  selectRating(value: string) {
    this.selectedRating = value;
    this.ratingDropdownOpen = false;
    this.applyFilters();
  }

  getStatusLabel(value: string): string {
    const option = this.statusOptions.find((opt) => opt.value === value);
    return option ? option.label : 'All Status';
  }

  getRatingLabel(value: string): string {
    const option = this.ratingOptions.find((opt) => opt.value === value);
    return option ? option.label : 'All Ratings';
  }

  applyFilters() {
    this.filteredSuppliers = this.suppliers.filter((supplier) => {
      let matches = true;

      // Search filter
      if (this.searchInput) {
        const searchTerm = this.searchInput.toLowerCase();
        matches =
          matches &&
          (supplier.name.toLowerCase().includes(searchTerm) ||
            supplier.contactEmail.toLowerCase().includes(searchTerm) ||
            supplier.phone.toLowerCase().includes(searchTerm) ||
            supplier.address.toLowerCase().includes(searchTerm));
      }

      // Status filter
      if (this.selectedStatus) {
        matches = matches && supplier.status === this.selectedStatus;
      }

      // Rating filter
      if (this.selectedRating) {
        const minRating = parseInt(this.selectedRating);
        matches = matches && supplier.rating >= minRating;
      }

      return matches;
    });
  }

  viewSupplier(supplier: Supplier) {
    console.log('View supplier:', supplier);
    // Navigate to supplier details page
  }

  editSupplier(supplier: Supplier) {
    console.log('Edit supplier:', supplier);
    // Open edit dialog
  }

  deleteSupplier(supplier: Supplier) {
    console.log('Delete supplier:', supplier);
    // Confirm and delete
  }

  addSupplier() {
    console.log('Add new supplier');
    // Open add supplier dialog
  }
}
