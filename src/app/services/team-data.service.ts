import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // <-- Importación nueva
import { BehaviorSubject } from 'rxjs';
import { User, Note, Activity } from '../models/team.models';

@Injectable({
  providedIn: 'root'
})
export class TeamDataService {
  // Inyectamos el cliente para hacer peticiones a la API
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api';

  // Ahora empezamos con un arreglo vacío, porque los datos vendrán de la BD
  private usersSource = new BehaviorSubject<User[]>([]);
  users$ = this.usersSource.asObservable();

  // (Deja tus notas y actividades igual que antes por ahora)
  private notesSource = new BehaviorSubject<Note[]>([]);
  notes$ = this.notesSource.asObservable();

  private activitySource = new BehaviorSubject<Activity[]>([]);
  activities$ = this.activitySource.asObservable();

  constructor() {
    // Apenas el servicio arranca, va a la API, trae los usuarios y actualiza el sistema
    this.fetchUsers();
    this.fetchNotes();
  }

  // ==========================================
  // MÉTODOS PARA USUARIOS
  // ==========================================

  private fetchUsers() {
    this.http.get<User[]>(`${this.apiUrl}/users`).subscribe({
      next: (data) => {
        this.usersSource.next(data);
      },
      error: (err) => console.error('Error cargando usuarios desde la API', err)
    });
  }

  getUsersValue(): User[] {
    return this.usersSource.getValue();
  }

  addUser(user: User) {
    this.http.post(`${this.apiUrl}/users`, user).subscribe({
      next: () => {
        this.fetchUsers(); // Recargamos la lista desde la BD
        this.logActivity(`Usuario ${user.name} registrado en el sistema.`);
      },
      error: (err) => alert('Error al crear usuario: ' + err.message)
    });
  }

  updateUser(userId: string, updatedData: Partial<User>) {
    this.http.put(`${this.apiUrl}/users/${userId}`, updatedData).subscribe({
      next: () => {
        this.fetchUsers();
        this.logActivity(`Usuario actualizado exitosamente.`);
      },
      error: (err) => alert('Error al actualizar usuario')
    });
  }

  toggleUserStatus(userId: string) {
    const currentUsers = this.getUsersValue();
    const user = currentUsers.find(u => u.id === userId);
    if (!user) return;

    // Validación de negocio local: siempre debe quedar un Admin
    if (user.isActive && user.role === 'Administrador') {
      const activeAdmins = currentUsers.filter(u => u.role === 'Administrador' && u.isActive).length;
      if (activeAdmins <= 1) {
        alert('Error: Debe conservarse siempre al menos un administrador activo.');
        return;
      }
    }

    // Petición PATCH a la API
    const newStatus = !user.isActive;
    this.http.patch(`${this.apiUrl}/users/${userId}/status`, { isActive: newStatus }).subscribe({
      next: () => {
        this.fetchUsers();
        this.logActivity(`Estado del usuario modificado.`);
      },
      error: (err) => alert('Error al cambiar estado')
    });
  }

  // ==========================================
  // MÉTODOS PARA NOTAS
  // ==========================================

  private fetchNotes() {
    this.http.get<Note[]>(`${this.apiUrl}/notes`).subscribe({
      next: (data) => this.notesSource.next(data),
      error: (err) => console.error('Error cargando notas', err)
    });
  }

  addNote(note: Note) {
    this.http.post(`${this.apiUrl}/notes`, note).subscribe({
      next: () => {
        this.fetchNotes();
        this.logActivity(`Nueva nota creada: "${note.title}".`);
      },
      error: (err) => alert('Error al crear nota')
    });
  }

  updateNote(noteId: string, updatedNote: Note) {
    this.http.put(`${this.apiUrl}/notes/${noteId}`, updatedNote).subscribe({
      next: () => this.fetchNotes(), // Recarga silenciosa al moverla
      error: (err) => console.error('Error al actualizar nota', err)
    });
  }

  deleteNote(noteId: string) {
    this.http.delete(`${this.apiUrl}/notes/${noteId}`).subscribe({
      next: () => {
        this.fetchNotes();
        this.logActivity(`Nota eliminada.`);
      },
      error: (err) => alert('Error al eliminar nota')
    });
  }

  // ==========================================
  // MÉTODO PARA REGISTRO DE ACTIVIDAD
  // ==========================================

  private logActivity(description: string) {
    const currentActivities = this.activitySource.getValue();
    this.activitySource.next([
      { id: Date.now().toString(), description, timestamp: new Date() },
      ...currentActivities
    ]);
  }
}
