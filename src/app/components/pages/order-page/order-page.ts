import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MotionDirective } from '../../../directives/motion.directive';
import { OrderService } from '../../../services/order-service';
import { OrderStatus } from '../../../model/response/order/OrderResponse';
import { CBadge } from '../../ui/c-badge/c-badge';

@Component({
  selector: 'app-order-page',
  imports: [
    CommonModule,
    RouterLink,
    MotionDirective,
    CurrencyPipe,
    DatePipe,
    CBadge,
  ],
  templateUrl: './order-page.html',
  styleUrl: './order-page.scss',
})
export class OrderPage implements OnInit {
  private orderService = inject(OrderService);

  orders$ = this.orderService.orders$;
  isLoading$ = this.orderService.isLoading$;

  expandedOrderId: number | null = null;

  ngOnInit(): void {
    this.orderService.loadOrders();
  }

  toggleOrderDetails(orderId: number): void {
    if (this.expandedOrderId === orderId) {
      this.expandedOrderId = null;
    } else {
      this.expandedOrderId = orderId;
    }
  }

  getStatusLabel(status: OrderStatus): string {
    const labels: Record<OrderStatus, string> = {
      [OrderStatus.PENDING]: 'Pendiente',
      [OrderStatus.PROCESSING]: 'En Proceso',
      [OrderStatus.PAYED]: 'Completado',
    };
    return labels[status] || status;
  }

  getStatusVariant(status: OrderStatus): 'primary' | 'success' | 'warning' | 'danger' {
    const variants: Record<OrderStatus, 'primary' | 'success' | 'warning' | 'danger'> = {
      [OrderStatus.PENDING]: 'warning',
      [OrderStatus.PROCESSING]: 'primary',
      [OrderStatus.PAYED]: 'success',
    };
    return variants[status] || 'primary';
  }

  getDiscountedPrice(basePrice: number, discountPercentage: number): number {
    if (discountPercentage <= 0) {
      return basePrice;
    }
    return basePrice * (1 - discountPercentage / 100);
  }
}
