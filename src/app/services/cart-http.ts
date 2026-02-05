import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderResponse } from '../model/response/OrderResponse';
import { OrderUpdateRequest } from '../model/request/OrderUpdateRequest';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CartHttp {
  private httpClient = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/cart';

  getActiveCart(userId: number): Observable<OrderResponse> {
    return this.httpClient.get<OrderResponse>(`${this.apiUrl}/active/${userId}`);
  }

  updateCart(cart: OrderUpdateRequest): Observable<void> {
    return this.httpClient.put<void>(`${this.apiUrl}`, cart);
  }
}
