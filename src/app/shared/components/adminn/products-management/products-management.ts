import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { CardModule } from 'primeng/card';
import { IProduct } from '../../../../core/models/product';

interface SelectOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-products-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    TagModule,
    ButtonModule,
    TooltipModule,
    CardModule,
  ],
  templateUrl: './products-management.html',
  styleUrls: ['./products-management.css'],
})
export class ProductsManagementComponent {
  products: IProduct[] = [];
  filteredProducts: IProduct[] = [];
  searchInput: string = '';
  selectedCategory: string = '';
  selectedStatus: string = '';
  categoryDropdownOpen = false;
  statusDropdownOpen = false;

  categoryOptions: SelectOption[] = [
    { label: 'All Categories', value: '' },
    { label: 'Raw Materials', value: 'Raw Materials' },
    { label: 'Components', value: 'Components' },
    { label: 'Finished Goods', value: 'Finished Goods' },
  ];

  statusOptions: SelectOption[] = [
    { label: 'All Status', value: '' },
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'Verified', value: 'verified' },
  ];

  constructor() {
    this.loadProducts();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (!target.closest('.custom-selector')) {
      this.categoryDropdownOpen = false;
      this.statusDropdownOpen = false;
    }
  }

  // إحصائيات المنتجات
  get totalProducts(): number {
    return this.products.length;
  }

  get activeProducts(): number {
    return this.products.filter((p) => p.status.isActive).length;
  }

  get verifiedProducts(): number {
    return this.products.filter((p) => p.status.isVerified).length;
  }

  get lowStockProducts(): number {
    return this.products.filter((p) => p.inventory.stock <= 20).length;
  }

  loadProducts() {
    // محاكاة بيانات المنتجات
    this.products = [
      {
        id: '1',
        sku: 'PROD-001',
        supplier: { id: '1', name: 'SteelCo', rating: 4.5 },
        name: 'Stainless Steel Sheets',
        description: 'High-quality stainless steel sheets for industrial use',
        category: { main: 'Raw Materials', sub: 'Metals', type: 'Sheets' },
        price: {
          unit: 150,
          currency: 'USD',
          discountTiers: [{ minQty: 100, percent: 0.1 }],
        },
        inventory: { stock: 1250, moq: 50, unitType: 'units' },
        groupBuy: { isActive: true, currentQty: 75, targetQty: 100 },
        imageUrl: ['https://via.placeholder.com/40x40?text=Steel'],
        specs: {
          weight: 2.5,
          dimensions: { length: 200, width: 100, height: 0.5 },
          material: 'Stainless Steel',
        },
        logistics: { shippingClass: 'Heavy', temperatureControl: 'None' },
        status: { isVerified: true, isActive: true, tags: ['Premium'] },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        sku: 'PROD-002',
        supplier: { id: '2', name: 'TechParts', rating: 4.2 },
        name: 'Electronic Components Kit',
        description: 'Assorted electronic components for prototyping',
        category: { main: 'Components', sub: 'Electronics', type: 'Kits' },
        price: {
          unit: 45,
          currency: 'USD',
          discountTiers: [{ minQty: 50, percent: 0.15 }],
        },
        inventory: { stock: 15, moq: 10, unitType: 'kits' },
        groupBuy: { isActive: false, currentQty: 0, targetQty: 0 },
        imageUrl: ['https://via.placeholder.com/40x40?text=Electronics'],
        specs: {
          weight: 0.5,
          dimensions: { length: 15, width: 10, height: 3 },
          material: 'Various',
        },
        logistics: { shippingClass: 'Standard', temperatureControl: 'None' },
        status: { isVerified: true, isActive: true, tags: ['Standard'] },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '3',
        sku: 'PROD-003',
        supplier: { id: '3', name: 'WoodWorks', rating: 4.7 },
        name: 'Oak Wood Planks',
        description: 'Premium quality oak wood planks for furniture',
        category: { main: 'Raw Materials', sub: 'Wood', type: 'Planks' },
        price: {
          unit: 85,
          currency: 'USD',
          discountTiers: [{ minQty: 20, percent: 0.12 }],
        },
        inventory: { stock: 5, moq: 5, unitType: 'units' },
        groupBuy: { isActive: true, currentQty: 15, targetQty: 20 },
        imageUrl: ['https://via.placeholder.com/40x40?text=Wood'],
        specs: {
          weight: 8,
          dimensions: { length: 240, width: 20, height: 5 },
          material: 'Oak Wood',
        },
        logistics: { shippingClass: 'Heavy', temperatureControl: 'None' },
        status: { isVerified: false, isActive: true, tags: ['New'] },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '4',
        sku: 'PROD-004',
        supplier: { id: '4', name: 'PlasticWorld', rating: 4.3 },
        name: 'ABS Plastic Sheets',
        description: 'High-quality ABS plastic sheets for various applications',
        category: { main: 'Raw Materials', sub: 'Plastics', type: 'Sheets' },
        price: {
          unit: 75,
          currency: 'USD',
          discountTiers: [{ minQty: 50, percent: 0.1 }],
        },
        inventory: { stock: 18, moq: 10, unitType: 'units' },
        groupBuy: { isActive: false, currentQty: 0, targetQty: 0 },
        imageUrl: ['https://via.placeholder.com/40x40?text=Plastic'],
        specs: {
          weight: 1.2,
          dimensions: { length: 100, width: 50, height: 0.3 },
          material: 'ABS Plastic',
        },
        logistics: { shippingClass: 'Standard', temperatureControl: 'None' },
        status: { isVerified: true, isActive: false, tags: [] },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    this.filteredProducts = [...this.products];
  }

  toggleCategoryDropdown() {
    this.categoryDropdownOpen = !this.categoryDropdownOpen;
    if (this.categoryDropdownOpen) {
      this.statusDropdownOpen = false;
    }
  }

  toggleStatusDropdown() {
    this.statusDropdownOpen = !this.statusDropdownOpen;
    if (this.statusDropdownOpen) {
      this.categoryDropdownOpen = false;
    }
  }

  selectCategory(value: string) {
    this.selectedCategory = value;
    this.categoryDropdownOpen = false;
    this.applyFilters();
  }

  selectStatus(value: string) {
    this.selectedStatus = value;
    this.statusDropdownOpen = false;
    this.applyFilters();
  }

  getStatusLabel(value: string): string {
    const option = this.statusOptions.find((opt) => opt.value === value);
    return option ? option.label : 'All Status';
  }

  applySearch() {
    this.applyFilters();
  }

  onSearchChange(value: string) {
    this.applyFilters();
  }

  applyFilters() {
    this.filteredProducts = this.products.filter((product) => {
      let matches = true;

      if (this.searchInput) {
        const searchTerm = this.searchInput.toLowerCase();
        matches =
          matches &&
          (product.name.toLowerCase().includes(searchTerm) ||
            product.sku.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.supplier.name.toLowerCase().includes(searchTerm));
      }

      if (this.selectedCategory) {
        matches = matches && product.category.main === this.selectedCategory;
      }

      if (this.selectedStatus === 'active') {
        matches = matches && product.status.isActive;
      } else if (this.selectedStatus === 'inactive') {
        matches = matches && !product.status.isActive;
      } else if (this.selectedStatus === 'verified') {
        matches = matches && product.status.isVerified;
      }

      return matches;
    });
  }

  getStockClass(stock: number): string {
    if (stock > 100) return 'stock-high';
    if (stock > 20) return 'stock-medium';
    return 'stock-low';
  }

  editProduct(product: IProduct) {
    console.log('Edit product:', product);
  }

  deleteProduct(product: IProduct) {
    console.log('Delete product:', product);
  }

  viewProduct(product: IProduct) {
    console.log('View product:', product);
  }

  addProduct() {
    console.log('Add new product');
  }
}
