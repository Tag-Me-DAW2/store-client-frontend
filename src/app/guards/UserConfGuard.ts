import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const UserConfGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (localStorage.getItem('authToken')) {
    return true;
  } else {
    router.navigate(['/']);
    return false;
  }
};
