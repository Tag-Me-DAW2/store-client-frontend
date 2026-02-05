import { Component, inject, Input } from '@angular/core';
import { MotionDirective } from '../../../directives/motion.directive';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../services/auth-service';
import { CommonModule } from '@angular/common';
import { FieldErrorDirective } from '../../../directives/field-error.directive';
import { fullNameValidator } from '../../../validators/fullNameValidator';
import { phoneValidator } from '../../../validators/phoneValidator';
import { Router } from '@angular/router';
import { AlertService } from '../../../services/alert-service';
import { UserService } from '../../../services/user-service';
import { UserResponse } from '../../../model/response/user/userResponse';

@Component({
  selector: 'login-page',
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
  imports: [
    MotionDirective,
    ReactiveFormsModule,
    CommonModule,
    FieldErrorDirective,
  ],
})
export class LoginPage {
  authService = inject(AuthService);
  router = inject(Router);
  alertService = inject(AlertService);
  userService = inject(UserService);
  formulario: FormGroup;
  fb = inject(FormBuilder);
  formSubmitted = false;
  eyeIcon = true;
  createAccount = false;

  constructor() {
    this.formulario = this.fbGroup;
  }

  get fbGroup() {
    if (this.createAccount) {
      return this.fb.group({
        fullName: ['', [Validators.required, fullNameValidator]],
        phone: ['', [Validators.required, phoneValidator]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
      });
    } else {
      return this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
        fullName: [''],
        phone: [''],
      });
    }
  }

  onSubmit() {
    this.formSubmitted = true;
    if (this.formulario.valid) {
      if (!this.createAccount) {
        const { email, password } = this.formulario.value;
        this.authService.login(email, password).subscribe({
          next: () => {
            this.router.navigate(['/']);
          },

          error: (error) => {
            this.alertService.error({
              title: 'Login Fallado',
              text: 'Correo electrónico o contraseña inválidos. Por favor, inténtelo de nuevo.',
            });
          },
        });
      } else {
        this.createAccountSubmit(this.formulario);
      }
    } else {
      this.formulario.markAllAsTouched();
    }
  }

  createAccountSubmit(formulario: FormGroup) {
    const { fullName, phone, email, password } = formulario.value;
    let parts = fullName.trim().split(/\s+/);

    let firstName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
    let lastName = parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
    let username = (firstName + '.' + lastName).toLowerCase();

    let phoneNumber = phone.trim().replace(/\s+/g, '');

    this.userService.createUser(
      username,
      password,
      email,
      firstName,
      lastName,
      phoneNumber,
      '0x00',
      '0x00',
    );
  }

  togglePasswordVisibility() {
    const passwordInput = document.getElementById(
      'password',
    ) as HTMLInputElement;

    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      this.eyeIcon = false;
    } else {
      passwordInput.type = 'password';
      this.eyeIcon = true;
    }
  }

  createAccountClick() {
    this.createAccount = !this.createAccount;
    this.formulario = this.fbGroup;
    this.formSubmitted = false;
  }
}
