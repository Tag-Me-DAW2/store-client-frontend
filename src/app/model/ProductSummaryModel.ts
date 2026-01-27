import {CategoryResponse} from './CategoryResponse';

export interface ProductSummaryModel {
  id: number;
  name: string;
  discountPercentage: number;
  price: number;
  image: string;
  category: CategoryResponse;
}
