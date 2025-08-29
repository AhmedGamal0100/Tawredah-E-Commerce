import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Counter {
  animateNumberSmooth(
    updateCallback: (value: number) => void,
    end: number,
    duration: number
  ) {
    let start = 0;
    const startTime = performance.now();

    const updateNumber = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easedProgress = 1 - Math.pow(1 - progress, 2);

      updateCallback(Math.floor(start + (end - start) * easedProgress));

      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      }
    };

    requestAnimationFrame(updateNumber);
  }
}