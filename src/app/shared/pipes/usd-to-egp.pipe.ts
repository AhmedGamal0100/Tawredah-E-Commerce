import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'usdToEgp'
})
export class UsdToEgpPipe implements PipeTransform {

  private exchangeRate = 50;
  transform(value: number, customRate?: number): string {
    if (!value && value !== 0) return '';
    const rate = customRate || this.exchangeRate;
    const egpValue = value * rate;
  return `${egpValue.toFixed(1)} EGP`;
  }
}
