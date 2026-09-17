import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar'; // Importa Navbar

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent], // Declara Navbar aquí
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('team-portal');
}

