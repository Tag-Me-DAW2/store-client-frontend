import { ProductSummaryModel } from '../product/ProductSummaryModel';

export interface OrderItemResponse {
  id: number;
  product: ProductSummaryModel;
  productName: string;
  productImage: string;
  productImageName: string;
  quantity: number;
  basePrice: number;
  discountPercentage: number;
  total: number;
}
