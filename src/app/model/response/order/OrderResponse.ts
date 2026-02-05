import { OrderItemResponse } from './OrderItemResponse';
import { ShippingInfoResponse } from '../ShippingInfoResponse';

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
  shippingCost: number;
  shippingInfo: ShippingInfoResponse | null;
  paidDate: string;
}
