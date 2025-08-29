import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-sales-chart',
  standalone: true,
  imports: [CommonModule, ChartModule, CardModule],
  templateUrl: './sales-chart.html',
  styleUrls: ['./sales-chart.css'],
})
export class SalesChartComponent {
  salesChartOptions = {
    plugins: { legend: { display: false } },
    scales: {
      y: {
        ticks: {
          callback: (value: any) => 'EGP' + value.toLocaleString(),
        },
      },
    },
  };

  salesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Revenue',
        data: [65000, 59000, 80000, 81000, 56000, 55000, 40000],
        fill: true,
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
        borderColor: '#4CAF50',
        tension: 0.4,
        borderWidth: 2,
        pointBackgroundColor: '#4CAF50',
        pointRadius: 4,
      },
    ],
  };
}
