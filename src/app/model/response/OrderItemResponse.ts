import { ProductSummaryModel } from '../ProductSummaryModel';

export interface OrderItemResponse {
  id: number;
  product: ProductSummaryModel;
  quantity: number;
  basePrice: number;
  discountPercentage: number;
  total: number;
}
