import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ProductSummaryModel} from '../model/ProductSummaryModel';
import {Observable} from 'rxjs';
import {ProductDetailModel} from '../model/ProductDetailModel';
import {PageInterface} from '../model/PageInterface';
import {ProductFilterParams, ProductSort} from '../model/ProductFilterModel';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: "root"
})
export class ProductService {
  url: string = environment.apiUrl + '/products';

  constructor(private httpClient: HttpClient) {
  }

  getAll(): Observable<ProductSummaryModel[]> {
    return this.httpClient.get<ProductSummaryModel[]>(this.url);
  }

  getById(id: number): Observable<ProductDetailModel> {
    return this.httpClient.get<ProductDetailModel>(`${this.url}/${id}`);
  }

  getFilteredProducts(filters: ProductFilterParams): Observable<PageInterface<ProductSummaryModel>> {
    let params = new HttpParams();

    if (filters.page !== undefined) {
      params = params.set('page', filters.page.toString());
    }
    if (filters.size !== undefined) {
      params = params.set('size', filters.size.toString());
    }
    if (filters.name) {
      params = params.set('name', filters.name);
    }
    if (filters.categoryId !== undefined) {
      params = params.set('categoryId', filters.categoryId.toString());
    }
    if (filters.material) {
      params = params.set('material', filters.material);
    }
    if (filters.minPrice !== undefined) {
      params = params.set('minPrice', filters.minPrice.toString());
    }
    if (filters.maxPrice !== undefined) {
      params = params.set('maxPrice', filters.maxPrice.toString());
    }
    if (filters.sort) {
      params = params.set('sort', filters.sort);
    }

    return this.httpClient.get<PageInterface<ProductSummaryModel>>(`${this.url}/filter`, { params });
  }
}
