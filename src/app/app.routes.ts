import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { UsersComponent } from './components/users/users';
import { NotesBoardComponent } from './components/notes-board/notes-board';
import { LoginComponent } from './components/login/login';
import { authGuard } from './guards/auth-guard';
import { adminGuard } from './guards/admin-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  // Rutas protegidas para todos los usuarios logueados
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'notes', component: NotesBoardComponent, canActivate: [authGuard] },
  // Ruta protegida SOLO para administradores
  { path: 'users', component: UsersComponent, canActivate: [authGuard, adminGuard] },
  { path: '**', redirectTo: 'login' }
];
