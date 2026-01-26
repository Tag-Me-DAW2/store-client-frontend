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
}
