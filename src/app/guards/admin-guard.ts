import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.currentUserValue;

  if (user && user.isActive && user.role === 'Administrador') {
    return true; // Solo entra si es Admin
  }

  alert('No tienes permisos de Administrador para ver esta sección.');
  router.navigate(['/dashboard']);
  return false;
};
