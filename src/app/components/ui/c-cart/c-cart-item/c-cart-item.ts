import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { OrderItemResponse } from '../../../../model/response/order/OrderItemResponse';
import { ProductService } from '../../../../services/productService';

@Component({
  selector: 'c-cart-item',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './c-cart-item.html',
  styleUrl: './c-cart-item.scss',
})
export class CCartItem {
  @Input({ required: true }) item!: OrderItemResponse;
  @Output() quantityChange = new EventEmitter<{ productId: number; quantity: number }>();
  @Output() remove = new EventEmitter<number>();

  productService = inject(ProductService);

  onIncrement(): void {
    this.quantityChange.emit({
      productId: this.item.product.id,
      quantity: this.item.quantity + 1,
    });
  }

  onDecrement(): void {
    if (this.item.quantity > 1) {
      this.quantityChange.emit({
        productId: this.item.product.id,
        quantity: this.item.quantity - 1,
      });
    }
  }

  onRemove(): void {
    this.remove.emit(this.item.product.id);
  }
}
