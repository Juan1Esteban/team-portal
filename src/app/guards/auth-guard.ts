import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.currentUserValue && authService.currentUserValue.isActive) {
    return true; // Pasa el usuario
  }

  router.navigate(['/login']); // Si no está logueado o está inactivo, va al login
  return false;
};
