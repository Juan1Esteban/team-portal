import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule, CdkDragEnd } from '@angular/cdk/drag-drop';
import { TeamDataService } from '../../services/team-data.service';
import { Note } from '../../models/team.models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-notes-board',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
  templateUrl: './notes-board.html',
  styleUrl: './notes-board.scss' // Nota: Si tu archivo termina en .css, cámbialo a .css
})
export class NotesBoardComponent implements OnInit {
  private dataService = inject(TeamDataService);

  notes$: Observable<Note[]> = this.dataService.notes$;
  newNote: Partial<Note> = { title: '', content: '', status: 'Pendiente' };

  ngOnInit() {}

  onDragEnded(event: CdkDragEnd, note: Note) {
    const newPosition = event.source.getFreeDragPosition();

    const updatedNote: Note = {
      ...note,
      positionX: Math.round(newPosition.x),
      positionY: Math.round(newPosition.y)
    };

    this.dataService.updateNote(note.id, updatedNote);
  }

  createNote() {
    if (!this.newNote.title || !this.newNote.content) return;

    const noteToCreate: Note = {
      id: '',
      title: this.newNote.title,
      content: this.newNote.content,
      status: this.newNote.status as 'Pendiente' | 'En curso' | 'Hecho',
      positionX: 50,
      positionY: 50
    };

    this.dataService.addNote(noteToCreate);
    this.newNote = { title: '', content: '', status: 'Pendiente' };
  }

  updateNoteContent(note: Note) {
    this.dataService.updateNote(note.id, note);
  }

  deleteNote(noteId: string) {
    if (confirm('¿Seguro que deseas eliminar esta nota?')) {
      this.dataService.deleteNote(noteId);
    }
  }

  // Rescata todas las notas y las apila ordenadamente en la esquina superior izquierda
  rescueNotes() {
    if (confirm('¿Deseas devolver todas las notas a la posición inicial?')) {
      // Nos suscribimos un momento para leer las notas actuales
      this.notes$.subscribe(notes => {
        notes.forEach((note, index) => {
          const updatedNote: Note = {
            ...note,
            positionX: 50 + (index * 20), // Las escalona un poco para que no queden exactamente una encima de la otra
            positionY: 50 + (index * 20)
          };
          this.dataService.updateNote(note.id, updatedNote);
        });
      }).unsubscribe(); // Nos desuscribimos inmediatamente para evitar bucles
    }
  }
}
