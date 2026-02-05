import { Component, inject, HostListener } from '@angular/core';
import { NgClass } from '@angular/common';
import { CartService } from '../../../services/cart-service';
import { PaymentService } from '../../../services/payment-service';
import { CCartItem } from './c-cart-item/c-cart-item';
import { CCartSummary } from './c-cart-summary/c-cart-summary';
import { Router } from '@angular/router';

@Component({
  selector: 'c-cart',
  standalone: true,
  imports: [NgClass, CCartItem, CCartSummary],
  templateUrl: './c-cart.html',
  styleUrl: './c-cart.scss',
})
export class CCart {
  cartService = inject(CartService);
  paymentService = inject(PaymentService);
  router = inject(Router);

  cart = this.cartService.cart$;
  isCartOpen = this.cartService.isCartOpen$;
  isLoading = this.cartService.isLoading$;
  subtotal = this.cartService.cartSubtotal;
  shipping = this.cartService.shippingCost;
  total = this.cartService.cartTotal;
  isProcessing = this.paymentService.isProcessing$;

  @HostListener('document:keydown.escape')
  onEscapePress(): void {
    if (this.isCartOpen()) {
      this.closeCart();
    }
  }

  closeCart(): void {
    this.cartService.closeCart();
  }

  onOverlayClick(event: Event): void {
    if ((event.target as HTMLElement).classList.contains('cart-overlay')) {
      this.closeCart();
    }
  }

  onQuantityChange(event: { productId: number; quantity: number }): void {
    this.cartService.updateItemQuantity(event.productId, event.quantity);
  }

  onRemoveItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  onCheckout(): void {
    // Aquí se podría abrir un modal de pago o navegar a una página de checkout
    // Por ahora, procesamos directamente con tarjeta de crédito de prueba
    //   this.paymentService.processCreditCardPayment(
    //     '4111111111111111',
    //     'Test User',
    //     '12/25',
    //     '123'
    //   );
    this.router.navigate(['/payment']);
    this.closeCart();
  }
}
