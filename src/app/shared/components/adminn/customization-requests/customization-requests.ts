import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';

interface CustomizationRequest {
  requestId: string;
  customerName: string;
  customerEmail: string;
  customerCompany?: string;
  productName: string;
  productSku: string;
  description: string;
  requestDate: Date;
  dueDate: Date;
  priority: string;
  status: string;
  quantity: number;
  specifications?: string[];
  attachments?: { name: string; url: string }[];
}

interface SelectOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-customization-requests',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    TagModule,
    ButtonModule,
    TooltipModule,
    DialogModule,
  ],
  templateUrl: './customization-requests.html',
  styleUrls: ['./customization-requests.css'],
})
export class CustomizationRequests {
  requests: CustomizationRequest[] = [];
  filteredRequests: CustomizationRequest[] = [];
  searchInput: string = '';
  selectedStatus: string = '';
  selectedPriority: string = '';
  statusDropdownOpen = false;
  priorityDropdownOpen = false;
  displayDialog = false;
  selectedRequest: CustomizationRequest | null = null;

  statusOptions: SelectOption[] = [
    { label: 'All Status', value: '' },
    { label: 'Pending', value: 'Pending' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Approved', value: 'Approved' },
    { label: 'Rejected', value: 'Rejected' },
  ];

  priorityOptions: SelectOption[] = [
    { label: 'All Priorities', value: '' },
    { label: 'High', value: 'High' },
    { label: 'Medium', value: 'Medium' },
    { label: 'Low', value: 'Low' },
  ];

  constructor() {
    this.loadRequests();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (!target.closest('.custom-selector')) {
      this.statusDropdownOpen = false;
      this.priorityDropdownOpen = false;
    }
  }

  get totalRequests(): number {
    return this.requests.length;
  }

  get pendingRequests(): number {
    return this.requests.filter((r) => r.status === 'Pending').length;
  }

  get approvedRequests(): number {
    return this.requests.filter((r) => r.status === 'Approved').length;
  }

  get rejectedRequests(): number {
    return this.requests.filter((r) => r.status === 'Rejected').length;
  }

  loadRequests() {
    // Simulated data
    this.requests = [
      {
        requestId: 'CR-001',
        customerName: 'John Smith',
        customerEmail: 'john.smith@example.com',
        customerCompany: 'TechCorp Inc.',
        productName: 'Stainless Steel Sheets',
        productSku: 'PROD-001',
        description:
          'Need custom cut sheets with specific dimensions for our production line.',
        requestDate: new Date('2023-10-15'),
        dueDate: new Date('2023-11-15'),
        priority: 'High',
        status: 'Pending',
        quantity: 500,
        specifications: [
          'Thickness: 2mm',
          'Cut to 200x100mm dimensions',
          'Polished finish on both sides',
        ],
        attachments: [
          { name: 'technical_drawing.pdf', url: '#' },
          { name: 'specifications.docx', url: '#' },
        ],
      },
      {
        requestId: 'CR-002',
        customerName: 'Sarah Johnson',
        customerEmail: 'sarah.j@example.com',
        productName: 'Electronic Components Kit',
        productSku: 'PROD-002',
        description:
          'Custom kit with specific resistor and capacitor values for our prototyping needs.',
        requestDate: new Date('2023-10-10'),
        dueDate: new Date('2023-10-30'),
        priority: 'Medium',
        status: 'In Progress',
        quantity: 100,
        specifications: [
          'Resistors: 10kΩ, 100 pieces',
          'Capacitors: 100μF, 50 pieces',
          'LEDs: red and green, 25 each',
        ],
      },
      {
        requestId: 'CR-003',
        customerName: 'Mike Wilson',
        customerEmail: 'mike.wilson@example.com',
        customerCompany: 'Builders Ltd.',
        productName: 'Oak Wood Planks',
        productSku: 'PROD-003',
        description:
          'Custom treated oak wood planks for outdoor furniture with specific weather resistance requirements.',
        requestDate: new Date('2023-10-05'),
        dueDate: new Date('2023-11-20'),
        priority: 'High',
        status: 'Approved',
        quantity: 200,
        specifications: [
          'Weather-resistant treatment',
          'Pre-cut to 240x20x5cm',
          'Smooth sanded finish',
        ],
      },
      {
        requestId: 'CR-004',
        customerName: 'Emily Davis',
        customerEmail: 'emily.d@example.com',
        productName: 'ABS Plastic Sheets',
        productSku: 'PROD-004',
        description: 'Custom colored ABS sheets for product packaging.',
        requestDate: new Date('2023-10-18'),
        dueDate: new Date('2023-11-05'),
        priority: 'Low',
        status: 'Rejected',
        quantity: 300,
        specifications: [
          'Colors: red, blue, and green',
          'Thickness: 3mm',
          'Matte finish',
        ],
      },
      {
        requestId: 'CR-005',
        customerName: 'David Brown',
        customerEmail: 'david.b@example.com',
        customerCompany: 'Manufacturing Co.',
        productName: 'Aluminum Rods',
        productSku: 'PROD-005',
        description: 'Custom length aluminum rods for mechanical components.',
        requestDate: new Date('2023-10-20'),
        dueDate: new Date('2023-11-10'),
        priority: 'Medium',
        status: 'Pending',
        quantity: 150,
        specifications: [
          'Diameter: 10mm',
          'Length: 1m segments',
          'Anodized finish',
        ],
      },
    ];
    this.filteredRequests = [...this.requests];
  }

  toggleStatusDropdown() {
    this.statusDropdownOpen = !this.statusDropdownOpen;
    if (this.statusDropdownOpen) {
      this.priorityDropdownOpen = false;
    }
  }

  togglePriorityDropdown() {
    this.priorityDropdownOpen = !this.priorityDropdownOpen;
    if (this.priorityDropdownOpen) {
      this.statusDropdownOpen = false;
    }
  }

  selectStatus(value: string) {
    this.selectedStatus = value;
    this.statusDropdownOpen = false;
    this.applyFilters();
  }

  selectPriority(value: string) {
    this.selectedPriority = value;
    this.priorityDropdownOpen = false;
    this.applyFilters();
  }

  getStatusLabel(value: string): string {
    const option = this.statusOptions.find((opt) => opt.value === value);
    return option ? option.label : 'All Status';
  }

  getPriorityLabel(value: string): string {
    const option = this.priorityOptions.find((opt) => opt.value === value);
    return option ? option.label : 'All Priorities';
  }

  applyFilters() {
    this.filteredRequests = this.requests.filter((request) => {
      let matches = true;

      // Search filter
      if (this.searchInput) {
        const searchTerm = this.searchInput.toLowerCase();
        matches =
          matches &&
          (request.customerName.toLowerCase().includes(searchTerm) ||
            request.productName.toLowerCase().includes(searchTerm) ||
            request.description.toLowerCase().includes(searchTerm) ||
            request.requestId.toLowerCase().includes(searchTerm));
      }

      // Status filter
      if (this.selectedStatus) {
        matches = matches && request.status === this.selectedStatus;
      }

      // Priority filter
      if (this.selectedPriority) {
        matches = matches && request.priority === this.selectedPriority;
      }

      return matches;
    });
  }

  isDueSoon(dueDate: Date): boolean {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays > 0;
  }

  isOverdue(dueDate: Date): boolean {
    const today = new Date();
    const due = new Date(dueDate);
    return due < today;
  }

  viewRequest(request: CustomizationRequest) {
    this.selectedRequest = request;
    this.displayDialog = true;
  }

  approveRequest(request: CustomizationRequest) {
    request.status = 'Approved';
    this.applyFilters();
  }

  rejectRequest(request: CustomizationRequest) {
    request.status = 'Rejected';
    this.applyFilters();
  }

  showFilterDialog() {
    // يمكن تنفيذ dialog للتصفية المتقدمة هنا
    console.log('Show advanced filter dialog');
  }
}
