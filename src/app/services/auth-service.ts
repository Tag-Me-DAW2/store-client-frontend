import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserResponse } from '../model/userResponse';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  httpClient = inject(HttpClient);
  route = inject(Router);
  url = '/auth';

  getUserByCurrentToken(): Observable<UserResponse> {
    return this.httpClient.get<UserResponse>(`${this.url}`);
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.route.navigate(['/login']);
  }
}