import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.html'
})
export class NavbarComponent {
  private authService = inject(AuthService);

  // Exponemos el usuario actual a la vista HTML
  currentUser$ = this.authService.currentUser$;

  // Método que ejecutará el botón
  logout() {
    this.authService.logout();
  }
}
