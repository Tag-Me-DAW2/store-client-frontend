import { OrderItemResponse } from './OrderItemResponse';

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  PAYED = 'PAYED',
}

export interface OrderResponse {
  id: number;
  userId: number;
  orderStatus: OrderStatus;
  orderItems: OrderItemResponse[];
  totalPrice: number;
  paidDate: string;
}
