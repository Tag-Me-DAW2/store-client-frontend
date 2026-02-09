import { inject, Injectable, signal } from '@angular/core';
import { PaymentHttp } from './payment-http';
import { AlertService } from './alert-service';
import { CartService } from './cart-service';
import { CreditCardPaymentRequest } from '../model/request/orderProcess/PaymentRequest';
import { ShippingInfoRequest } from '../model/request/ShippingInfoRequest';
import { Router } from '@angular/router';

export type PaymentMethod = 'credit-card' | 'transfer';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private paymentHttp = inject(PaymentHttp);
  private alertService = inject(AlertService);
  private cartService = inject(CartService);
  private router = inject(Router);

  private readonly _isProcessing = signal<boolean>(false);
  readonly isProcessing$ = this._isProcessing.asReadonly();

  processCreditCardPayment(request: {
    orderInfo: { shippingCost: number; subtotal: number; total: number };
    paymentInfo: CreditCardPaymentRequest;
    shippingInfo: ShippingInfoRequest;
  }): void {
    const cart = this.cartService.cart$();
    if (!cart) {
      this.alertService.error({
        title: 'Error',
        text: 'No hay carrito activo',
      });
      return;
    }

    console.log(request);

    this._isProcessing.set(true);

    this.paymentHttp.processCreditCardPayment(request).subscribe({
      next: () => {
        this._isProcessing.set(false);
        this.alertService.success({
          title: 'Pago completado',
          text: 'Tu pedido ha sido procesado correctamente',
        });
        this.cartService.loadCart();
        this.cartService.closeCart();
        this.router.navigate(['/']);
      },
      error: (error) => {
        this._isProcessing.set(false);
        let errMsg =
          error.error.message || 'Ocurrió un error al procesar el pago';
        this.alertService.error({
          title: 'Error al procesar el pago',
          text: errMsg,
        });
      },
    });
  }
}
