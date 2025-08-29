import { Component, ElementRef, inject, Input, OnInit, signal, SimpleChanges } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'app-loading',
  imports: [],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.css'
})
export class LoadingComponent implements OnInit {
  private router = inject(Router)
  private loadingService = inject(LoadingService)

  loading = signal(false);
  private loadingStartTime = 0;
  private minDuration = 1500;


  /**
   * Overall size of the loader (width & height), e.g. '64px' | '5rem'
   */
  @Input() size: string = '64px';
  /**
   * Color of the squares
   */
  @Input() color: string = '#4f46e5'; // indigo-600
  /**
   * Gap between squares
   */
  @Input() gap: string = '6px';
  /**
   * Animation duration for the squares
   */
  @Input() duration: string = '1.2s';
  /**
   * Loading message (screen-reader friendly)
   */
  @Input() message: string = 'Loading';

  constructor(private host: ElementRef<HTMLElement>) { }

  ngOnChanges(_: SimpleChanges): void {
    const el = this.host.nativeElement;
    el.style.setProperty('--size', this.size);
    el.style.setProperty('--color', this.color);
    el.style.setProperty('--gap', this.gap);
    el.style.setProperty('--duration', this.duration);
  }

  ngOnInit(): void {
    this.loadingService.loading$.subscribe(value => this.loading.set(value));

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.scrollToTop();
      }
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loadingStartTime = Date.now();
        this.loadingService.show();
      }
      if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        const elapsed = Date.now() - this.loadingStartTime;
        const remaining = this.minDuration - elapsed;

        if (remaining > 0) {
          setTimeout(() => this.loadingService.hide(), remaining);
        } else {
          this.loadingService.hide();
        }
      }
    });
  }


  private scrollToTop(): void {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth' // optional for smooth scrolling
    });
  }
}
