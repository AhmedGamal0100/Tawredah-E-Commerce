import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { BadgeModule } from 'primeng/badge';

@Component({
  selector: 'app-kpi-cards',
  standalone: true,
  imports: [CommonModule, CardModule, BadgeModule],
  templateUrl: './kpi-cards.html',
  styleUrls: ['./kpi-cards.css'],
})
export class KpiCardsComponent {
  @Input() userName: string = 'ABC Manufacturing';

  kpis = [
    { title: 'Total Sales', value: '$148,700', change: '+12%', trend: 'up' },
    { title: 'New Orders', value: '24', change: '+5%', trend: 'up' },
    { title: 'Custom Requests', value: '8', change: '-2%', trend: 'down' },
    { title: 'Completion Rate', value: '92%', change: '+3%', trend: 'up' },
  ];
}
