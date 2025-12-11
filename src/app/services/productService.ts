import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ProductSummaryModel} from '../model/ProductSummaryModel';
import {Observable} from 'rxjs';
import {ProductDetailModel} from '../model/ProductDetailModel';

@Injectable({
  providedIn: "root"
})
export class ProductService {
  url: string = 'localhost:8080/products';

  constructor(private httpClient: HttpClient) {
  }

  getAll(): Observable<ProductSummaryModel[]> {
    return this.httpClient.get<ProductSummaryModel[]>(this.url);
  }

  getById(id: number): Observable<ProductDetailModel> {
    return this.httpClient.get<ProductDetailModel>(`${this.url}/${id}`);
  }
}
