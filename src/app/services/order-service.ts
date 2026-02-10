import { inject, Injectable, signal } from '@angular/core';
import { OrderHttp } from './order-http';
import { OrderResponse } from '../model/response/order/OrderResponse';
import { AlertService } from './alert-service';
import { AuthService } from './auth-service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private orderHttp = inject(OrderHttp);
  private alertService = inject(AlertService);
  private authService = inject(AuthService);

  private readonly _orders = signal<OrderResponse[]>([]);
  private readonly _isLoading = signal<boolean>(false);
  private readonly _selectedOrder = signal<OrderResponse | null>(null);

  readonly orders$ = this._orders.asReadonly();
  readonly isLoading$ = this._isLoading.asReadonly();
  readonly selectedOrder$ = this._selectedOrder.asReadonly();

  loadOrders(): void {
    const user = this.authService.user$();
    if (!user) {
      this.alertService.error({
        title: 'Error',
        text: 'Debes iniciar sesión para ver tus pedidos',
      });
      return;
    }

    this._isLoading.set(true);
    this.orderHttp.getOrdersByUserId(user.id).subscribe({
      next: (orders) => {
        this._orders.set(orders);
        console.log(orders);
        
        this._isLoading.set(false);
      },
      error: (error) => {
        this._isLoading.set(false);
        this.alertService.error({
          title: 'Error',
          text: 'No se pudieron cargar los pedidos',
        });
      },
    });
  }

  getOrderById(orderId: number): void {
    this._isLoading.set(true);
    this.orderHttp.getOrderById(orderId).subscribe({
      next: (order) => {
        this._selectedOrder.set(order);
        this._isLoading.set(false);
      },
      error: (error) => {
        this._isLoading.set(false);
        this.alertService.error({
          title: 'Error',
          text: 'No se pudo cargar el pedido',
        });
      },
    });
  }

  toggleOrderDetails(orderId: number): void {
    const currentSelected = this._selectedOrder();
    if (currentSelected?.id === orderId) {
      this._selectedOrder.set(null);
    } else {
      const order = this._orders().find((o) => o.id === orderId);
      if (order) {
        this._selectedOrder.set(order);
      }
    }
  }
}
