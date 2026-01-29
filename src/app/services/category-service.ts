import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PageInterface } from '../model/PageInterface';
import { CategoryResponse } from '../model/CategoryResponse';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  httpClient = inject(HttpClient);
  url = environment.apiUrl + '/categories';

  getAll() {
    return this.httpClient.get<PageInterface<CategoryResponse>>(this.url);
  }
}
