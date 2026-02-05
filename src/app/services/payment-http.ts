import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreditCardPaymentRequest, TransferPaymentRequest } from '../model/request/PaymentRequest';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PaymentHttp {
  private httpClient = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/payments';

  processCreditCardPayment(request: CreditCardPaymentRequest): Observable<void> {
    return this.httpClient.post<void>(`${this.apiUrl}/credit-card`, request);
  }

  processTransferPayment(request: TransferPaymentRequest): Observable<void> {
    return this.httpClient.post<void>(`${this.apiUrl}/transfer`, request);
  }
}
