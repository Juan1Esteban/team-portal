import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../models/team.models';
import { TeamDataService } from './team-data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  private teamData = inject(TeamDataService); // Para validar contra la base de usuarios

  private currentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor() {}

  // Obtener el valor actual sin suscribirse
  get currentUserValue(): User | null {
    return this.currentUserSource.getValue();
  }

  login(email: string, password?: string): boolean {
    const users = this.teamData.getUsersValue(); // Obtiene todos los usuarios
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      if (!user.isActive) {
        alert('Este usuario está inactivo y no puede acceder.');
        return false;
      }
      this.currentUserSource.next(user);
      this.router.navigate(['/dashboard']);
      return true;
    }
    return false;
  }

  logout() {
    this.currentUserSource.next(null);
    this.router.navigate(['/login']);
  }
}
