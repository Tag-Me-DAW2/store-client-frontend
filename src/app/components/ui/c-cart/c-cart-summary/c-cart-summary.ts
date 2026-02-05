import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'c-cart-summary',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './c-cart-summary.html',
  styleUrl: './c-cart-summary.scss',
})
export class CCartSummary {
  @Input() subtotal: number = 0;
  @Input() shipping: number = 0;
  @Input() total: number = 0;
  @Input() isProcessing: boolean = false;
  @Input() hasItems: boolean = false;
  @Output() checkout = new EventEmitter<void>();

  onCheckout(): void {
    this.checkout.emit();
  }
}
