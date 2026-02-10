import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { OrderResponse } from '../model/response/order/OrderResponse';

@Injectable({
  providedIn: 'root',
})
export class OrderHttp {
  private httpClient = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/orders';

  getOrdersByUserId(userId: number): Observable<OrderResponse[]> {
    return this.httpClient.get<OrderResponse[]>(`${this.apiUrl}/user/${userId}`);
  }

  getOrderById(orderId: number): Observable<OrderResponse> {
    return this.httpClient.get<OrderResponse>(`${this.apiUrl}/${orderId}`);
  }
}
