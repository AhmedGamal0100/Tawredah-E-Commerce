import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-top-products',
  standalone: true,
  imports: [CommonModule, ChartModule, CardModule],
  templateUrl: './top-products.html',
  styleUrls: ['./top-products.css'],
})
export class TopProductsComponent {
  chartData: any;
  chartOptions: any;

  constructor() {
    this.initChart();
  }

  ngOnInit() {
    this.initChart();
  }

  initChart() {
    this.chartData = {
      labels: [
        'Steel Sheets',
        'Aluminum Bars',
        'PVC Pipes',
        'Wood Planks',
        'Glass Panels',
      ],
      datasets: [
        {
          data: [42300, 35600, 26100, 18900, 13700],
          backgroundColor: [
            '#42A5F5', // أزرق
            '#66BB6A', // أخضر
            '#FFA726', // برتقالي
            '#26C6DA', // تركواز
            '#7E57C2', // بنفسجي
          ],
          hoverBackgroundColor: [
            '#64B5F6',
            '#81C784',
            '#FFB74D',
            '#4DD0E1',
            '#9575CD',
          ],
        },
      ],
    };

    this.chartOptions = {
      cutout: '60%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#495057',
            font: {
              size: 12,
            },
            padding: 20,
          },
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const label = context.label || '';
              const value = context.raw || 0;
              const total = context.dataset.data.reduce(
                (a: number, b: number) => a + b,
                0
              );
              const percentage = ((value / total) * 100).toFixed(1);
              return `${label}: $${value.toLocaleString(
                'en-US'
              )} (${percentage}%)`;
            },
          },
        },
      },
      maintainAspectRatio: false,
      responsive: true,
    };
  }

  // دالة للحصول على إجمالي الإيرادات (اختياري)
  getTotalRevenue(): number {
    return this.chartData.datasets[0].data.reduce(
      (a: number, b: number) => a + b,
      0
    );
  }
}
