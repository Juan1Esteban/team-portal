import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive], // Importamos las herramientas de ruteo
  templateUrl: './navbar.html'
})
export class NavbarComponent { }
