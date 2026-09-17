import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User, Note, Activity } from '../models/team.models';

@Injectable({
  providedIn: 'root'
})
export class TeamDataService {
  // ==========================================
  // ESTADO DE USUARIOS (Con cuentas demo)
  // ==========================================
  private usersSource = new BehaviorSubject<User[]>([
    { id: '1', name: 'Admin Demo', email: 'admin@demo.com', role: 'Administrador', isActive: true, password: 'admin' },
    { id: '2', name: 'User Demo', email: 'user@demo.com', role: 'Usuario', isActive: true, password: 'user' }
  ]);
  // Esta línea expone los usuarios y soluciona el error de tu HTML
  users$ = this.usersSource.asObservable();

  // ==========================================
  // ESTADO DE NOTAS
  // ==========================================
  private notesSource = new BehaviorSubject<Note[]>([
    { id: '1', title: 'Configurar entorno', content: 'Instalar Angular 17 y dependencias', status: 'done' },
    { id: '2', title: 'Crear componentes', content: 'Generar Navbar, Tablero y Usuarios', status: 'in-progress' },
    { id: '3', title: 'Implementar Drag & Drop', content: 'Usar Angular CDK para mover las notas', status: 'todo' }
  ]);
  notes$ = this.notesSource.asObservable();

  // ==========================================
  // ESTADO DE ACTIVIDAD
  // ==========================================
  private activitySource = new BehaviorSubject<Activity[]>([
    { id: '1', description: 'Sistema inicializado.', timestamp: new Date() }
  ]);
  activities$ = this.activitySource.asObservable();


  constructor() {}

  // ==========================================
  // MÉTODOS PARA USUARIOS (CRUD y Reglas)
  // ==========================================

  getUsersValue(): User[] {
    return this.usersSource.getValue();
  }

  addUser(user: User) {
    const currentUsers = this.usersSource.getValue();
    this.usersSource.next([...currentUsers, user]);
    this.logActivity(`Usuario ${user.name} registrado en el sistema.`);
  }

  updateUser(userId: string, updatedData: Partial<User>) {
    const currentUsers = this.usersSource.getValue();
    const updatedUsers = currentUsers.map(u =>
      u.id === userId ? { ...u, ...updatedData } : u
    );
    this.usersSource.next(updatedUsers);
    this.logActivity(`Usuario actualizado exitosamente.`);
  }

  toggleUserStatus(userId: string) {
    const currentUsers = this.usersSource.getValue();
    const user = currentUsers.find(u => u.id === userId);

    if (!user) return;

    // Regla de negocio: Conservar siempre al menos un administrador activo.
    if (user.isActive && user.role === 'Administrador') {
      const activeAdmins = currentUsers.filter(u => u.role === 'Administrador' && u.isActive).length;
      if (activeAdmins <= 1) {
        alert('Error: Debe conservarse siempre al menos un administrador activo.');
        return; // Detiene la ejecución para no desactivarlo
      }
    }

    const updatedUsers = currentUsers.map(u =>
      u.id === userId ? { ...u, isActive: !u.isActive } : u
    );
    this.usersSource.next(updatedUsers);
    this.logActivity(`Estado del usuario modificado.`);
  }

  // ==========================================
  // MÉTODOS PARA NOTAS
  // ==========================================

  addNote(note: Note) {
    const currentNotes = this.notesSource.getValue();
    this.notesSource.next([...currentNotes, note]);
    this.logActivity(`Nueva nota creada: "${note.title}".`);
  }

  updateNoteStatus(noteId: string, newStatus: 'todo' | 'in-progress' | 'done') {
    const currentNotes = this.notesSource.getValue();
    const updatedNotes = currentNotes.map(n =>
      n.id === noteId ? { ...n, status: newStatus } : n
    );
    this.notesSource.next(updatedNotes);
    this.logActivity(`Estado de la nota actualizado a ${newStatus}.`);
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
