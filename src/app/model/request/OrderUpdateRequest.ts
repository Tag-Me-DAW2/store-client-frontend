import { OrderItemRequest } from './OrderItemRequest';

export interface OrderUpdateRequest {
  userId: number;
  orderItems: OrderItemRequest[];
}
