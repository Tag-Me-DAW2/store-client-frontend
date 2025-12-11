import {CategoryModel} from './CategoryModel';

export interface ProductSummaryModel {
  id: number,
  name: string,
  category: CategoryModel
}
