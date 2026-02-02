import { inject, Injectable } from '@angular/core';
import { UserHttp } from './user-http';
import { UserResponse } from '../model/response/userResponse';
import { Observable } from 'rxjs';
import { AuthService } from './auth-service';
import { AlertService } from './alert-service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  userHttp = inject(UserHttp);
  authService = inject(AuthService);
  alertService = inject(AlertService);
  router = inject(Router);

  createUser(
    username: string,
    password: string,
    email: string,
    firstName: string,
    lastName: string,
    phone: string,
    profilePicture: string | null,
    profilePictureName: string | null,
  ): void {
    const user = {
      username,
      password,
      email,
      firstName,
      lastName,
      phone,
      profilePicture,
      profilePictureName,
    };

    this.userHttp.createUser(user).subscribe({
      next: (userResponse: UserResponse) => {
        this.alertService.success({
          title: 'Usuario creado',
          text: `El usuario ${userResponse.username} ha sido creado exitosamente.`,
        });
        this.authService.login(email, password).subscribe({
          next: () => {
            this.authService.getUser();
            this.router.navigate(['/']);
          },
          error: (error) => {
            this.alertService.error({
              title: 'Error al iniciar sesión',
              text: error.error?.message || 'Ha ocurrido un error inesperado.',
            });
          },
        });
      },
      error: (error) => {
        this.alertService.error({
          title: 'Error al crear el usuario',
          text: error.error?.message || 'Ha ocurrido un error inesperado.',
        });
      },
    });
  }

  updateUser(
    user: UserResponse,
    previewUrl: string | null,
    previewFileName: string | null,
  ): void {
    const userUpdateRequest = {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      profilePicture: user.profilePicture || previewUrl || '0x00',
      profilePictureName: user.profilePictureName || previewFileName || '0x00',
      role: user.role,
    };

    this.userHttp.updateUser(userUpdateRequest).subscribe({
      next: (updatedUser: UserResponse) => {
        this.alertService.success({
          title: 'Usuario actualizado',
          text: `El usuario ${updatedUser.username} ha sido actualizado exitosamente.`,
        });
        this.authService.getUser();
      },
      error: (error) => {
        this.alertService.error({
          title: 'Error al actualizar el usuario',
          text: error.error?.message || 'Ha ocurrido un error inesperado.',
        });
      },
    });
  }

  updateUserPassword(
    newPassword: string,
    newPasswordConfirmation: string,
    userId: number,
  ): Observable<void> {
    const passwordRequest = {
      newPassword,
      newPasswordConfirmation,
    };

    return this.userHttp.updateUserPassword(passwordRequest, userId);
  }
}
