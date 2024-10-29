// auth.guard.ts
import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from './services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (authService.isLoggedIn()) {
    return true;
  }

  // Stocker l'URL tentée pour redirection après login (optionnel)
  // router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
  
  // Redirection simple vers login
  router.navigate(['/login']);
  return false;
};
