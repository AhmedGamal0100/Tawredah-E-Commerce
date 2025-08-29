import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { MenuModule } from 'primeng/menu';
import { ConfirmationService, MessageService, MenuItem } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RequestedService } from '../../../../core/services/requested.service';
import { IProduct } from '../../../../core/models/product';
import { Router } from '@angular/router';

interface CustomizationRequest {
  id: string;
  product: string;
  details: string;
  status: string;
  customer: string;
  requestedDate: Date;
}

@Component({
  selector: 'app-customization-requests',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    TableModule,
    TagModule,
    ButtonModule,
    TooltipModule,
    MenuModule,
    ConfirmDialogModule,
  ],
  templateUrl: './customization-requests.html',
  styleUrls: ['./customization-requests.css'],
  providers: [ConfirmationService, MessageService],
})
export class CustomizationRequestsComponent {
  // customizationRequests: CustomizationRequest[] = [
  //   {
  //     id: 'CUST-2001',
  //     product: 'Steel Plates',
  //     details: '5mm thickness, custom cuts for construction project',
  //     status: 'Under Review',
  //     customer: 'Construction Co.',
  //     requestedDate: new Date('2024-01-15'),
  //   },
  //   {
  //     id: 'CUST-2002',
  //     product: 'Plastic Pipes',
  //     details: 'Non-standard diameters for irrigation system',
  //     status: 'Approved',
  //     customer: 'Agricultural Solutions',
  //     requestedDate: new Date('2024-01-10'),
  //   },
  //   {
  //     id: 'CUST-2003',
  //     product: 'Aluminum Bars',
  //     details: '3.5m lengths for window frames manufacturing',
  //     status: 'Rejected',
  //     customer: 'Window Masters',
  //     requestedDate: new Date('2024-01-08'),
  //   },
  //   {
  //     id: 'CUST-2004',
  //     product: 'Copper Wires',
  //     details: 'Special insulation for high-temperature environments',
  //     status: 'Under Review',
  //     customer: 'ElectroTech',
  //     requestedDate: new Date('2024-01-18'),
  //   },
  //   {
  //     id: 'CUST-2005',
  //     product: 'Glass Panels',
  //     details: 'Tempered glass with custom tinting for office building',
  //     status: 'Approved',
  //     customer: 'Office Builders Ltd.',
  //     requestedDate: new Date('2024-01-05'),
  //   },
  //   {
  //     id: 'CUST-2006',
  //     product: 'Wood Planks',
  //     details: 'Custom treated for outdoor furniture resistance',
  //     status: 'Under Review',
  //     customer: 'Furniture World',
  //     requestedDate: new Date('2024-01-20'),
  //   },
  //   {
  //     id: 'CUST-2007',
  //     product: 'PVC Sheets',
  //     details: 'Extra thickness for chemical storage containers',
  //     status: 'Approved',
  //     customer: 'Chemical Storage Inc.',
  //     requestedDate: new Date('2024-01-12'),
  //   },
  //   {
  //     id: 'CUST-2008',
  //     product: 'Brass Fittings',
  //     details: 'Special threading for marine applications',
  //     status: 'Rejected',
  //     customer: 'Marine Equipment Co.',
  //     requestedDate: new Date('2024-01-07'),
  //   },
  //   {
  //     id: 'CUST-2009',
  //     product: 'Stainless Steel Tubes',
  //     details: 'Medical grade for hospital equipment',
  //     status: 'Under Review',
  //     customer: 'MediTech Solutions',
  //     requestedDate: new Date('2024-01-22'),
  //   },
  //   {
  //     id: 'CUST-2010',
  //     product: 'Ceramic Tiles',
  //     details: 'Custom patterns for hotel renovation project',
  //     status: 'Approved',
  //     customer: 'Luxury Hotels Group',
  //     requestedDate: new Date('2024-01-03'),
  //   },
  // ];
  customizationRequests!: CustomizationRequest[]
  private requestedService = inject(RequestedService);
  private router = inject(Router)
  filteredRequests: CustomizationRequest[] = [];
  searchInput: string = '';
  selectedStatus: string | null = null;
  statusMenuItems: MenuItem[] = [];

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    // this.filteredRequests = [...this.customizationRequests];
    this.initMenuItems();

    effect(() => {
      this.requestedService.list().then(res => {
        console.log(res);

        const products = res.map(p => ({
          id: p.id,
          product: p.name ?? 'Unnamed Product',
          details: p.description ?? 'No details provided',
          image: p.imageUrl, // ✅ Ensure array exists
          status: typeof p.status === 'string'
            ? p.status
            : (Array.isArray(p.status?.tags) && p.status.tags.length > 0
              ? p.status.tags[0]
              : 'Under Review'),
          customer: p.supplier?.id ?? 'Unknown',
          requestedDate: new Date(p.createdAt ?? Date.now()),
          votes: this.getRandomVotes(250, 1000)
        }));


        this.customizationRequests = products;
        this.filteredRequests = [...products];
      });
    });


  }

  private getRandomVotes(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private initMenuItems() {
    this.statusMenuItems = [
      {
        label: 'All Statuses',
        icon: 'pi pi-list',
        command: () => this.filterByStatus(null),
      },
      {
        separator: true,
      },
      {
        label: 'Under Review',
        icon: 'pi pi-clock',
        command: () => this.filterByStatus('Under Review'),
      },
      {
        label: 'Approved',
        icon: 'pi pi-check',
        command: () => this.filterByStatus('Approved'),
      },
      {
        label: 'Rejected',
        icon: 'pi pi-times',
        command: () => this.filterByStatus('Rejected'),
      },
    ];
  }

  getSelectedStatusLabel(): string {
    if (!this.selectedStatus) return 'All Statuses';
    return this.selectedStatus;
  }

  getSeverity(status: string) {
    switch (status) {
      case 'Approved':
        return 'success';
      case 'Under Review':
        return 'warning';
      case 'Rejected':
        return 'danger';
      default:
        return 'info';
    }
  }

  // وظائف Search Bar
  applySearch() {
    this.applyFilters();
  }

  onSearchChange(value: string): void {
    this.applyFilters();
  }

  filterByStatus(status: string | null) {
    this.selectedStatus = status;
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.customizationRequests];

    // Apply status filter
    if (this.selectedStatus) {
      filtered = filtered.filter(req => req.status === this.selectedStatus);
    }

    // Apply search filter
    if (this.searchInput) {
      const term = this.searchInput.toLowerCase();
      filtered = filtered.filter(req =>
        req.id.toLowerCase().includes(term) ||
        req.product.toLowerCase().includes(term) ||
        req.details.toLowerCase().includes(term) ||
        req.customer.toLowerCase().includes(term) ||
        req.status.toLowerCase().includes(term)
      );
    }

    this.filteredRequests = filtered;
  }


  clearStatusFilter() {
    this.selectedStatus = null;
    this.applyFilters();
  }

  clearSearch() {
    this.searchInput = '';
    this.applyFilters();
  }

  clearAllFilters() {
    this.selectedStatus = null;
    this.searchInput = '';
    this.filteredRequests = [...this.customizationRequests];
  }

  approveRequest(request: CustomizationRequest) {
    this.confirmationService.confirm({
      message: `Are you sure you want to approve request ${request.id}?`,
      header: 'Confirm Approval',
      icon: 'pi pi-check-circle',
      accept: () => {
        request.status = 'Approved';
        this.applyFilters();
        this.messageService.add({
          severity: 'success',
          summary: 'Approved',
          detail: `Request ${request.id} has been approved successfully`,
        });
      },
    });
  }

  rejectRequest(request: CustomizationRequest) {
    this.confirmationService.confirm({
      message: `Are you sure you want to reject request ${request.id}?`,
      header: 'Confirm Rejection',
      icon: 'pi pi-times-circle',
      accept: () => {
        request.status = 'Rejected';
        // this.applyFilters();
        this.messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: `Request ${request.id} has been rejected`,
        });
      },
    });
  }

  toDetails(id: string) {
    this.router.navigateByUrl(`/requested-products-details/${id}`)
  }
}
