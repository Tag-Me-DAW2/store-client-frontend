import { Component, Input, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ProductSummaryModel } from '../../../model/response/product/ProductSummaryModel';
import { CartService } from '../../../services/cart-service';
import { MotionDirective } from '../../../directives/motion.directive';
import { ProductService } from '../../../services/productService';

@Component({
  selector: 'c-product-card',
  standalone: true,
  imports: [CurrencyPipe, MotionDirective],
  templateUrl: './c-product-card.html',
  styleUrl: './c-product-card.scss',
})
export class CProductCard {
  @Input({ required: true }) product!: ProductSummaryModel;
  @Input() showPopularLabel: boolean = false;
  @Input() animationDelay: number = 0;

  private cartService = inject(CartService);
  productService = inject(ProductService);

  onAddToCart(): void {
    this.cartService.addToCart(this.product);
  }
}
