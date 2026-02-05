import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthHttp } from './auth-http';
import { AlertService } from './alert-service';
import { Observable, tap } from 'rxjs';
import { UserResponse } from '../model/response/user/userResponse';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authHttp = inject(AuthHttp);
  router = inject(Router);
  alertService = inject(AlertService);

  private readonly _user = signal<UserResponse | null>(null);
  readonly user$ = this._user.asReadonly();

  login(email: string, password: string): Observable<{ token: string }> {
    let loginRequest = { email, password };

    return this.authHttp.login(loginRequest).pipe(
      tap((response: { token: string }) => {
        localStorage.setItem('authToken', response.token);
        this.getUser();
      }),
    );
  }

  logout(): void {
    this.authHttp.logout().subscribe({
      next: () => {
        localStorage.removeItem('authToken');
        this.router.navigate(['/']);
        this._user.set(null);
      },
      error: (error) => {
        this.alertService.error({
          title: 'Logout Failed',
          text: 'An error occurred while logging out. Please try again.',
        });
      },
    });
  }

  getUser(): void {
    if (!localStorage.getItem('authToken')) {
      this._user.set(null);
      return;
    }

    this.authHttp.loadUser().subscribe({
      next: (user) => this._user.set(user),
      error: () => {
        this._user.set(null);
      },
    });
  }

  verifyPassword(password: string): Observable<boolean> {
    return this.authHttp.verifyPassword(password);
  }
}
