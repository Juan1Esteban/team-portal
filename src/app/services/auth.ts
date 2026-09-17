import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../models/team.models';
import { TeamDataService } from './team-data.service'; // Importamos el servicio de datos

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private teamDataService = inject(TeamDataService); // Lo inyectamos para validar usuarios

  private currentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor() {
    // Restaurar sesión al recargar la página
    if (isPlatformBrowser(this.platformId)) {
      const storedUser = localStorage.getItem('teamPortalUser');
      if (storedUser) {
        this.currentUserSource.next(JSON.parse(storedUser));
      }
    }
  }

  // Soluciona el error 3: Restauramos la propiedad para que el admin-guard funcione
  get currentUserValue(): User | null {
    return this.currentUserSource.value;
  }

  // Soluciona los errores 1 y 2: Volvemos a pedir email/password y devolver boolean
  login(email: string, password: string): boolean {
    const users = this.teamDataService.getUsersValue();
    // Buscamos si existe un usuario con esas credenciales y que esté activo
    const user = users.find(u => u.email === email && u.password === password && u.isActive);

    if (user) {
      this.currentUserSource.next(user);
      // Guardamos en el navegador
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('teamPortalUser', JSON.stringify(user));
      }
      this.router.navigate(['/dashboard']);
      return true; // Login exitoso
    }

    return false; // Credenciales incorrectas
  }

  logout() {
    this.currentUserSource.next(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('teamPortalUser');
    }
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.currentUserSource.value !== null;
  }
}
