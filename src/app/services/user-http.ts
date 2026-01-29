import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserResponse } from '../model/response/userResponse';
import { UserInsertRequest } from '../model/request/UserInsertRequest';
import { Observable } from 'rxjs';
import { UserUpdateRequest } from '../model/request/UserUpdateRequest';
import { PasswordRequest } from '../model/request/PasswordRequest';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserHttp {
  httpClient = inject(HttpClient);
  apiUrl = environment.apiUrl + '/users';

  createUser(user: UserInsertRequest): Observable<UserResponse> {
    return this.httpClient.post<UserResponse>(`${this.apiUrl}/customer`, user);
  }

  updateUser(user: UserUpdateRequest): Observable<UserResponse> {
    return this.httpClient.put<UserResponse>(`${this.apiUrl}/${user.id}`, user);
  }

  updateUserPassword(
    passwordRequest: PasswordRequest,
    userId: number,
  ): Observable<void> {
    return this.httpClient.put<void>(
      `${this.apiUrl}/password/${userId}`,
      passwordRequest,
    );
  }
}
