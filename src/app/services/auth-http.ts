import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { UserResponse } from '../model/response/user/userResponse';
import { Router } from '@angular/router';
import { LoginRequest } from '../model/request/auth/LoginRequest';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthHttp {
  HttpClient = inject(HttpClient);
  route = inject(Router);
  apiUrl = environment.apiUrl + '/auth';

  // Borrar
  getUserByCurrentToken(): Observable<UserResponse> {
    return void 0 as any;
  }

  login(loginRequest: LoginRequest): Observable<{ token: string }> {
    return this.HttpClient.post<{ token: string }>(
      `${this.apiUrl}/login`,
      loginRequest,
    );
  }

  logout(): Observable<void> {
    return this.HttpClient.post<void>(`${this.apiUrl}/logout`, {});
  }

  loadUser(): Observable<UserResponse> {
    return this.HttpClient.get<UserResponse>(`${this.apiUrl}`);
  }

  verifyPassword(password: string): Observable<boolean> {
    return this.HttpClient.post<boolean>(`${this.apiUrl}/verify-password`, {
      password: password,
    });
  }
}
