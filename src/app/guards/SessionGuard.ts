import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const SessionGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  if (localStorage.getItem('authToken')) {
    return true;
  } else {
    router.navigate(['/']);
    return false;
  }
};
