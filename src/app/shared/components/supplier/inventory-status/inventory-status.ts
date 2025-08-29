import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { IProduct } from '../../../../core/models/product';
import { LoginStore } from '../../../../core/store/login.store';
import { ProductsService } from '../../../../core/services/products.service';

@Component({
  selector: 'app-inventory-status',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    TableModule,
    TagModule,
    ProgressBarModule,
  ],
  templateUrl: './inventory-status.html',
  styleUrls: ['./inventory-status.css'],
})
export class InventoryStatusComponent {
  products!: string[];
  factoryProducts!: IProduct[];
  private loginStore = inject(LoginStore)
  private prodService = inject(ProductsService)
  inventoryStatus!: Array<{
    product: string,
    stock: number,
    // threshold: number,
    status: string,
  }>;
  // totalProducts = 0;
  // inStockCount = 0;
  // lowStockCount = 0;
  // outOfStockCount = 0

  constructor() {
    effect(() => {
      const logAcc = this.loginStore.loggedAccount();
      if (logAcc) {
        this.products = logAcc.products ?? [];
        this.factoryProducts = [];
        this.inventoryStatus = [];

        const productPromises = this.products.map(prodId => this.prodService.getOnce(prodId));

        Promise.all(productPromises).then(results => {
          this.factoryProducts = results.filter((p): p is IProduct => p !== null);

          this.inventoryStatus = this.factoryProducts.map(prod => {
            let state = '';
            if (prod.inventory.stock > 7000) {
              state = 'In Stock';
            } else if (prod.inventory.stock > 0) {
              state = 'Low Stock';
            } else {
              state = 'Out of Stock';
            }

            return {
              product: prod.name,
              stock: prod.inventory.stock,
              status: state,
            };
          });
        });
      }
    });
  }

  // inventoryStatus = [
  //   {
  //     product: 'Steel Sheets',
  //     stock: 1250,
  //     threshold: 500,
  //     status: 'In Stock',
  //   },
  //   {
  //     product: 'Aluminum Bars',
  //     stock: 780,
  //     threshold: 400,
  //     status: 'In Stock',
  //   },
  //   {
  //     product: 'PVC Pipes',
  //     stock: 320,
  //     threshold: 300,
  //     status: 'Low Stock',
  //   },
  //   {
  //     product: 'Wood Planks',
  //     stock: 150,
  //     threshold: 200,
  //     status: 'Reorder',
  //   },
  //   {
  //     product: 'Copper Wires',
  //     stock: 450,
  //     threshold: 200,
  //     status: 'In Stock',
  //   },
  //   {
  //     product: 'Brass Rods',
  //     stock: 320,
  //     threshold: 150,
  //     status: 'In Stock',
  //   },
  //   {
  //     product: 'Glass Panels',
  //     stock: 420,
  //     threshold: 250,
  //     status: 'In Stock',
  //   },
  //   {
  //     product: 'Ceramic Tiles',
  //     stock: 280,
  //     threshold: 180,
  //     status: 'In Stock',
  //   },
  //   {
  //     product: 'Plastic Containers',
  //     stock: 650,
  //     threshold: 400,
  //     status: 'In Stock',
  //   },
  //   {
  //     product: 'Electrical Components',
  //     stock: 1200,
  //     threshold: 600,
  //     status: 'In Stock',
  //   },
  //   {
  //     product: 'Mechanical Parts',
  //     stock: 850,
  //     threshold: 400,
  //     status: 'In Stock',
  //   },
  //   {
  //     product: 'Hydraulic Fittings',
  //     stock: 320,
  //     threshold: 200,
  //     status: 'In Stock',
  //   },
  //   {
  //     product: 'Pneumatic Valves',
  //     stock: 180,
  //     threshold: 100,
  //     status: 'Low Stock',
  //   },
  //   {
  //     product: 'Bearings',
  //     stock: 950,
  //     threshold: 500,
  //     status: 'In Stock',
  //   },
  //   {
  //     product: 'Cardboard Boxes',
  //     stock: 2200,
  //     threshold: 1000,
  //     status: 'In Stock',
  //   },
  //   {
  //     product: 'Plastic Wraps',
  //     stock: 1500,
  //     threshold: 800,
  //     status: 'In Stock',
  //   },
  //   {
  //     product: 'Wooden Crates',
  //     stock: 420,
  //     threshold: 250,
  //     status: 'In Stock',
  //   },
  //   {
  //     product: 'Metal Containers',
  //     stock: 280,
  //     threshold: 150,
  //     status: 'Low Stock',
  //   },
  //   {
  //     product: 'Protective Foam',
  //     stock: 850,
  //     threshold: 400,
  //     status: 'In Stock',
  //   },
  //   {
  //     product: 'Hand Tools',
  //     stock: 320,
  //     threshold: 200,
  //     status: 'In Stock',
  //   },
  //   {
  //     product: 'Power Tools',
  //     stock: 180,
  //     threshold: 100,
  //     status: 'Low Stock',
  //   },
  //   {
  //     product: 'Measuring Instruments',
  //     stock: 95,
  //     threshold: 80,
  //     status: 'Reorder',
  //   },
  //   {
  //     product: 'Safety Equipment',
  //     stock: 420,
  //     threshold: 250,
  //     status: 'In Stock',
  //   },
  //   {
  //     product: 'Maintenance Kits',
  //     stock: 150,
  //     threshold: 100,
  //     status: 'Reorder',
  //   },
  //   {
  //     product: 'Stainless Steel Plates',
  //     stock: 890,
  //     threshold: 300,
  //     status: 'In Stock',
  //   },
  //   {
  //     product: 'Rubber Seals',
  //     stock: 210,
  //     threshold: 150,
  //     status: 'Low Stock',
  //   },
  //   {
  //     product: 'Adhesives',
  //     stock: 380,
  //     threshold: 250,
  //     status: 'In Stock',
  //   },
  //   {
  //     product: 'Lubricants',
  //     stock: 290,
  //     threshold: 200,
  //     status: 'In Stock',
  //   },
  //   {
  //     product: 'Cleaning Supplies',
  //     stock: 170,
  //     threshold: 120,
  //     status: 'Low Stock',
  //   },
  //   {
  //     product: 'Fasteners',
  //     stock: 1250,
  //     threshold: 600,
  //     status: 'In Stock',
  //   },
  // ];

  getSeverity(status: string) {
    switch (status) {
      case 'In Stock':
        return 'success';
      case 'Low Stock':
        return 'warning';
      case 'Out of Stock':
        return 'danger';
      default:
        return 'info';
    }
  }

  getInventoryPercentage(stock: number) {
    return (stock / stock * 2) * 100;
  }

  getProgressBarClass(status: string) {
    switch (status) {
      case 'In Stock':
        return 'progressbar-success';
      case 'Low Stock':
        return 'progressbar-warning';
      case 'Out of Stock':
        return 'progressbar-danger';
      default:
        return '';
    }
  }

  // calculateRows(): number {
  //   const len = this.factoryProducts.length
  //   return Math.ceil(len/5);
  // }
}
