import {CategoryModel} from './CategoryModel';

export interface ProductDetailModel {
  id: number,
  name: string,
  description: string,
  basePrice: number,
  discountPercentage: number,
  price: number,
  image: string,
  category: CategoryModel
}
