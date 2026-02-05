import { CategoryResponse } from '../CategoryResponse';

export interface ProductSummaryModel {
  id: number;
  name: string;
  discountPercentage: number;
  basePrice: number;
  price: number;
  image: string;
  category: CategoryResponse;
}
