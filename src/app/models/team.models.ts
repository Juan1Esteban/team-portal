export type Role = 'Administrador' | 'Usuario';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean; // Estado activo/inactivo
  password?: string; // Requerido para el inicio de sesión
}

export interface Note {
  id: string;
  title: string;
  content: string;
  status: 'todo' | 'in-progress' | 'done';
}

export interface Activity {
  id: string;
  description: string;
  timestamp: Date;
}
