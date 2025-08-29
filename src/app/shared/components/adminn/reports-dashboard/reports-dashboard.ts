import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { AbsolutePipe } from '../../../pipes/absolute.pipe';

interface Activity {
  status: string;
  date: Date;
  description: string;
  user: string;
}

interface Supplier {
  name: string;
  rating: number;
  deliveryTime: number;
  quality: number;
  communication: number;
}

@Component({
  selector: 'app-reports-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ChartModule,
    CardModule,
    ButtonModule,
    TooltipModule,
    AbsolutePipe,
  ],
  templateUrl: './reports-dashboard.html',
  styleUrls: ['./reports-dashboard.css'],
})
export class ReportsDashboard implements OnInit {
  // Date filter - using string format for native date input
  startDate: string;
  endDate: string;

  // Summary data
  totalRevenue: number = 125430.75;
  totalOrders: number = 1245;
  productsSold: number = 5678;
  newCustomers: number = 234;
  revenueChange: number = 12.5;
  ordersChange: number = 8.3;
  productsChange: number = 15.2;
  customersChange: number = 5.7;

  // Inventory stats
  inStockCount: number = 1567;
  lowStockCount: number = 234;
  outOfStockCount: number = 89;

  // Performance metrics
  conversionRate: number = 3.2;
  averageOrderValue: number = 102.75;
  customerRetention: number = 78.5;
  satisfactionRate: number = 4.7;

  // Chart data
  salesData: any;
  inventoryData: any;
  topProductsData: any;
  supplierData: any;

  // Chart options
  chartOptions: any;
  doughnutOptions: any;
  barOptions: any;
  radarOptions: any;

  // Activities timeline
  activities: Activity[] = [];

  // Supplier data
  topSuppliers: Supplier[] = [];
  supplierColors: string[] = [
    '#FF6384',
    '#36A2EB',
    '#FFCE56',
    '#4BC0C0',
    '#9966FF',
  ];

  constructor() {
    // Set default date range (last 30 days)
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    this.startDate = this.formatDate(thirtyDaysAgo);
    this.endDate = this.formatDate(today);
  }

  ngOnInit() {
    this.initializeCharts();
    this.loadActivities();
    this.loadSuppliers();
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  initializeCharts() {
    // Sales chart data
    this.salesData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      datasets: [
        {
          label: 'Total Sales',
          data: [12000, 15000, 18000, 22000, 25000, 28000, 32000],
          fill: false,
          borderColor: '#42A5F5',
          tension: 0.4,
        },
        {
          label: 'Orders',
          data: [80, 95, 110, 125, 140, 160, 180],
          fill: false,
          borderColor: '#FFA726',
          tension: 0.4,
        },
      ],
    };

    // Inventory chart data
    this.inventoryData = {
      labels: ['In Stock', 'Low Stock', 'Out of Stock'],
      datasets: [
        {
          data: [this.inStockCount, this.lowStockCount, this.outOfStockCount],
          backgroundColor: ['#4CAF50', '#FF9800', '#F44336'],
          hoverBackgroundColor: ['#66BB6A', '#FFA726', '#EF5350'],
        },
      ],
    };

    // Top products chart data
    this.topProductsData = {
      labels: ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'],
      datasets: [
        {
          label: 'Units Sold',
          backgroundColor: '#42A5F5',
          data: [540, 325, 702, 420, 380],
        },
      ],
    };

    // Chart options
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };

    this.doughnutOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
    };

    this.barOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
    };

    this.radarOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        r: {
          angleLines: {
            display: true,
          },
          suggestedMin: 0,
          suggestedMax: 100,
        },
      },
    };
  }

  loadActivities() {
    this.activities = [
      {
        status: 'New Order',
        date: new Date(),
        description: 'Order #1234 placed by Customer A',
        user: 'John Doe',
      },
      {
        status: 'Payment Received',
        date: new Date(Date.now() - 2 * 60 * 60 * 1000),
        description: 'Payment confirmed for Order #1234',
        user: 'System',
      },
      {
        status: 'Product Restocked',
        date: new Date(Date.now() - 4 * 60 * 60 * 1000),
        description: 'Product XYZ restocked (500 units)',
        user: 'Inventory Manager',
      },
      {
        status: 'New Supplier',
        date: new Date(Date.now() - 24 * 60 * 60 * 1000),
        description: 'New supplier "TechParts Ltd." added',
        user: 'Procurement Team',
      },
    ].sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  getActivityIcon(status: string): string {
    switch (status) {
      case 'New Order':
        return 'pi-shopping-cart';
      case 'Payment Received':
        return 'pi-dollar';
      case 'Product Restocked':
        return 'pi-box';
      case 'New Supplier':
        return 'pi-user-plus';
      default:
        return 'pi-info-circle';
    }
  }

  loadSuppliers() {
    this.topSuppliers = [
      {
        name: 'SteelCo Inc.',
        rating: 92,
        deliveryTime: 85,
        quality: 95,
        communication: 88,
      },
      {
        name: 'TechParts Ltd.',
        rating: 88,
        deliveryTime: 90,
        quality: 82,
        communication: 92,
      },
      {
        name: 'WoodWorks Int.',
        rating: 95,
        deliveryTime: 78,
        quality: 98,
        communication: 85,
      },
    ];

    this.supplierData = {
      labels: ['Rating', 'Delivery Time', 'Quality', 'Communication'],
      datasets: this.topSuppliers.map((supplier, index) => ({
        label: supplier.name,
        backgroundColor: this.supplierColors[index] + '40',
        borderColor: this.supplierColors[index],
        pointBackgroundColor: this.supplierColors[index],
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: this.supplierColors[index],
        data: [
          supplier.rating,
          supplier.deliveryTime,
          supplier.quality,
          supplier.communication,
        ],
      })),
    };
  }

  applyDateFilter() {
    console.log('Applying date filter:', this.startDate, this.endDate);
    // In a real application, you would fetch filtered data from your API
    this.refreshData();
  }

  resetFilter() {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    this.startDate = this.formatDate(thirtyDaysAgo);
    this.endDate = this.formatDate(today);
    this.refreshData();
  }

  setDateRange(days: number) {
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - days);

    this.startDate = this.formatDate(startDate);
    this.endDate = this.formatDate(today);
    this.applyDateFilter();
  }

  refreshData() {
    console.log('Refreshing data...');
    // Simulate data refresh
    this.initializeCharts();
    this.loadActivities();
    this.loadSuppliers();
  }

  exportReport() {
    console.log('Exporting report...');
    // In a real application, this would generate and download a report
  }
}
