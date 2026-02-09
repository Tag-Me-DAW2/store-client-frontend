import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreditCardPaymentRequest } from '../model/request/orderProcess/PaymentRequest';
import { environment } from '../../environments/environment';
import { ShippingInfoRequest } from '../model/request/ShippingInfoRequest';

@Injectable({
  providedIn: 'root',
})
export class PaymentHttp {
  private httpClient = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/cart';

  processCreditCardPayment(
    request: {
      orderInfo: { shippingCost: number; subtotal: number; total: number }
      paymentInfo: CreditCardPaymentRequest,
      shippingInfo: ShippingInfoRequest,
    }
  ): Observable<void> {
    return this.httpClient.post<void>(`${this.apiUrl}/pay/credit-card`, request);
  }
}
