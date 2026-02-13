import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { AlertService } from './alert-service';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {
  router = inject(Router);
  alertService = inject(AlertService);

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('authToken');

    const authReq = token
      ? req.clone({
          headers: req.headers.set('Authorization', `Bearer ${token}`),
        })
      : req;

    return next.handle(authReq).pipe(
      catchError((error) => {
        const isLoginRequest =
          req.url.includes('/login') || req.url.includes('/auth/login');

        if ((error.status === 401 || error.status === 403) && !isLoginRequest) {
          this.alertService.close();
          this.alertService.setSessionExpiredAlertActive(true);

          this.alertService
            .error({
              title: 'Sesión expirada',
              text: 'Tu sesión ha expirado. Por favor, inicia sesión de nuevo.',
              allowOutsideClick: false,
              allowEscapeKey: false,
            })
            .then(() => {
              localStorage.removeItem('authToken');
              this.router.navigate(['/']);
              this.alertService.setSessionExpiredAlertActive(false);
            });
        }
        return throwError(() => error);
      }),
    );
  }
}
