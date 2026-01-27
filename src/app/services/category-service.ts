import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PageInterface } from '../model/PageInterface';
import { CategoryResponse } from '../model/CategoryResponse';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  httpClient = inject(HttpClient);
  url = 'http://localhost:8080/categories';

  getAll() {
    return this.httpClient.get<PageInterface<CategoryResponse>>(this.url);
  }
}
