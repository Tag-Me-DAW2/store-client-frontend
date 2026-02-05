import { ProductMaterial } from './ProductMaterial';

export enum ProductSort {
  MOST_POPULAR = 'MOST_POPULAR',
  NAME_ASC = 'NAME_ASC',
  NAME_DESC = 'NAME_DESC',
  PRICE_ASC = 'PRICE_ASC',
  PRICE_DESC = 'PRICE_DESC'
}

export const ProductSortLabels: Record<ProductSort, string> = {
  [ProductSort.MOST_POPULAR]: 'Más Popular',
  [ProductSort.NAME_ASC]: 'Nombre: A a Z',
  [ProductSort.NAME_DESC]: 'Nombre: Z a A',
  [ProductSort.PRICE_ASC]: 'Precio: Menor a Mayor',
  [ProductSort.PRICE_DESC]: 'Precio: Mayor a Menor'
};

export interface ProductFilterParams {
  page?: number;
  size?: number;
  name?: string;
  categoryId?: number;
  material?: ProductMaterial;
  minPrice?: number;
  maxPrice?: number;
  sort?: ProductSort;
}
