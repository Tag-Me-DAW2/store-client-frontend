import { inject, Injectable, signal } from '@angular/core';
import { PaymentHttp } from './payment-http';
import { AlertService } from './alert-service';
import { CartService } from './cart-service';
import { CreditCardPaymentRequest } from '../model/request/orderProcess/PaymentRequest';

export type PaymentMethod = 'credit-card' | 'transfer';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private paymentHttp = inject(PaymentHttp);
  private alertService = inject(AlertService);
  private cartService = inject(CartService);

  private readonly _isProcessing = signal<boolean>(false);
  readonly isProcessing$ = this._isProcessing.asReadonly();

  processCreditCardPayment(
    cardNumber: string,
    cardHolderName: string,
    expirationDate: string,
    cvv: string,
  ): void {
    const cart = this.cartService.cart$();
    if (!cart) {
      this.alertService.error({
        title: 'Error',
        text: 'No hay carrito activo',
      });
      return;
    }

    this._isProcessing.set(true);

    const request: CreditCardPaymentRequest = {
      cardNumber: cardNumber.replace(/\s/g, ''),
      cardHolderName,
      expirationDate,
      cvv,
    };

    this.paymentHttp.processCreditCardPayment(request).subscribe({
      next: () => {
        this._isProcessing.set(false);
        this.alertService.success({
          title: 'Pago completado',
          text: 'Tu pedido ha sido procesado correctamente',
        });
        this.cartService.loadCart();
        this.cartService.closeCart();
      },
      error: (error) => {
        this._isProcessing.set(false);
        this.alertService.error({
          title: 'Error en el pago',
          text: 'No se pudo procesar el pago. Verifica los datos de tu tarjeta.',
        });
      },
    });
  }
}
