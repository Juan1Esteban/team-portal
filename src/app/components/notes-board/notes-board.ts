import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamDataService } from '../../services/team-data.service';

@Component({
  selector: 'app-notes-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notes-board.html'
})
export class NotesBoardComponent {
  // Inyección moderna de dependencias (Angular 14+)
  private teamData = inject(TeamDataService);
  notes$ = this.teamData.notes$;
}
