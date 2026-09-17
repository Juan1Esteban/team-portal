import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TeamDataService } from '../../services/team-data.service';
import { User, Role } from '../../models/team.models';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './users.html'
})
export class UsersComponent {
  teamData = inject(TeamDataService);
  private fb = inject(FormBuilder);

  users$ = this.teamData.users$;

  isEditing = false;
  editingUserId: string | null = null;

  // Formulario reactivo para crear/editar
  userForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    role: ['Usuario' as Role, Validators.required],
    password: ['', Validators.required]
  });

  onSubmit() {
    if (this.userForm.invalid) return;

    const formValue = this.userForm.value;

    if (this.isEditing && this.editingUserId) {
      // Editar usuario existente
      this.teamData.updateUser(this.editingUserId, {
        name: formValue.name!,
        email: formValue.email!,
        role: formValue.role as Role,
        password: formValue.password!
      });
    } else {
      // Crear nuevo usuario (Registro)
      const newUser: User = {
        id: Date.now().toString(), // Generar un ID simple
        name: formValue.name!,
        email: formValue.email!,
        role: formValue.role as Role,
        isActive: true, // Por defecto nacen activos
        password: formValue.password!
      };
      this.teamData.addUser(newUser);
    }

    this.cancelEdit();
  }

  editUser(user: User) {
    this.isEditing = true;
    this.editingUserId = user.id;
    this.userForm.patchValue({
      name: user.name,
      email: user.email,
      role: user.role,
      password: user.password
    });
  }

  cancelEdit() {
    this.isEditing = false;
    this.editingUserId = null;
    this.userForm.reset({ role: 'Usuario' });
  }

  toggleStatus(userId: string) {
    // La regla de "mantener siempre un admin activo" ya está manejada dentro de este método en tu servicio
    this.teamData.toggleUserStatus(userId);
  }
}
