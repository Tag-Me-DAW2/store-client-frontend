import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserResponse } from '../model/response/userResponse';
import { UserInsertRequest } from '../model/request/UserInsertRequest';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserHttp {
  httpClient = inject(HttpClient);
  apiUrl = 'http://localhost:8080/users';

  createUser(user: UserInsertRequest): Observable<UserResponse> {
    return this.httpClient.post<UserResponse>(`${this.apiUrl}/customer`, user);
  }
}
