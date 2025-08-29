import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  orders: number;
  status: string;
  tier: string;
  joinDate: Date;
  lastOrder: Date;
}

interface SelectOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-customers-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    TagModule,
    ButtonModule,
    TooltipModule,
  ],
  templateUrl: './customers-management.html',
  styleUrls: ['./customers-management.css'],
})
export class CustomersManagement {
  customers: Customer[] = [];
  filteredCustomers: Customer[] = [];
  searchInput: string = '';
  selectedStatus: string = '';
  selectedTier: string = '';
  statusDropdownOpen = false;
  tierDropdownOpen = false;

  statusOptions: SelectOption[] = [
    { label: 'All Status', value: '' },
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' },
    { label: 'Suspended', value: 'Suspended' },
  ];

  tierOptions: SelectOption[] = [
    { label: 'All Tiers', value: '' },
    { label: 'Premium', value: 'Premium' },
    { label: 'Gold', value: 'Gold' },
    { label: 'Silver', value: 'Silver' },
    { label: 'Bronze', value: 'Bronze' },
  ];

  constructor() {
    this.loadCustomers();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (!target.closest('.custom-selector')) {
      this.statusDropdownOpen = false;
      this.tierDropdownOpen = false;
    }
  }

  get totalCustomers(): number {
    return this.customers.length;
  }

  get activeCustomers(): number {
    return this.customers.filter((c) => c.status === 'Active').length;
  }

  get averageRating(): number {
    // Simulated average rating
    return 4.7;
  }

  get totalOrders(): number {
    return this.customers.reduce((sum, customer) => sum + customer.orders, 0);
  }

  loadCustomers() {
    // Simulated data
    this.customers = [
      {
        id: '1',
        name: 'John Smith',
        email: 'john.smith@example.com',
        phone: '+1 (555) 123-4567',
        company: 'TechCorp Inc.',
        orders: 15,
        status: 'Active',
        tier: 'Premium',
        joinDate: new Date('2022-03-15'),
        lastOrder: new Date(),
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        email: 'sarah.j@example.com',
        phone: '+1 (555) 987-6543',
        company: 'Design Studios',
        orders: 8,
        status: 'Active',
        tier: 'Gold',
        joinDate: new Date('2022-05-20'),
        lastOrder: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        id: '3',
        name: 'Mike Wilson',
        email: 'mike.wilson@example.com',
        phone: '+1 (555) 456-7890',
        company: 'Builders Ltd.',
        orders: 23,
        status: 'Active',
        tier: 'Premium',
        joinDate: new Date('2021-11-30'),
        lastOrder: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        id: '4',
        name: 'Emily Davis',
        email: 'emily.d@example.com',
        phone: '+1 (555) 234-5678',
        company: 'Creative Solutions',
        orders: 4,
        status: 'Inactive',
        tier: 'Silver',
        joinDate: new Date('2023-01-10'),
        lastOrder: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      },
      {
        id: '5',
        name: 'David Brown',
        email: 'david.b@example.com',
        phone: '+1 (555) 876-5432',
        company: 'Manufacturing Co.',
        orders: 31,
        status: 'Active',
        tier: 'Premium',
        joinDate: new Date('2021-08-05'),
        lastOrder: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        id: '6',
        name: 'Jennifer Lee',
        email: 'jennifer.lee@example.com',
        phone: '+1 (555) 345-6789',
        company: 'Retail Group',
        orders: 12,
        status: 'Active',
        tier: 'Gold',
        joinDate: new Date('2022-12-15'),
        lastOrder: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      },
    ];
    this.filteredCustomers = [...this.customers];
  }

  toggleStatusDropdown() {
    this.statusDropdownOpen = !this.statusDropdownOpen;
    if (this.statusDropdownOpen) {
      this.tierDropdownOpen = false;
    }
  }

  toggleTierDropdown() {
    this.tierDropdownOpen = !this.tierDropdownOpen;
    if (this.tierDropdownOpen) {
      this.statusDropdownOpen = false;
    }
  }

  selectStatus(value: string) {
    this.selectedStatus = value;
    this.statusDropdownOpen = false;
    this.applyFilters();
  }

  selectTier(value: string) {
    this.selectedTier = value;
    this.tierDropdownOpen = false;
    this.applyFilters();
  }

  getStatusLabel(value: string): string {
    const option = this.statusOptions.find((opt) => opt.value === value);
    return option ? option.label : 'All Status';
  }

  getTierLabel(value: string): string {
    const option = this.tierOptions.find((opt) => opt.value === value);
    return option ? option.label : 'All Tiers';
  }

  applyFilters() {
    this.filteredCustomers = this.customers.filter((customer) => {
      let matches = true;

      // Search filter
      if (this.searchInput) {
        const searchTerm = this.searchInput.toLowerCase();
        matches =
          matches &&
          (customer.name.toLowerCase().includes(searchTerm) ||
            customer.email.toLowerCase().includes(searchTerm) ||
            customer.phone.toLowerCase().includes(searchTerm) ||
            customer.company.toLowerCase().includes(searchTerm));
      }

      // Status filter
      if (this.selectedStatus) {
        matches = matches && customer.status === this.selectedStatus;
      }

      // Tier filter
      if (this.selectedTier) {
        matches = matches && customer.tier === this.selectedTier;
      }

      return matches;
    });
  }

  viewCustomer(customer: Customer) {
    console.log('View customer:', customer);
  }

  editCustomer(customer: Customer) {
    console.log('Edit customer:', customer);
  }

  deleteCustomer(customer: Customer) {
    console.log('Delete customer:', customer);
  }

  addCustomer() {
    console.log('Add new customer');
  }
}
