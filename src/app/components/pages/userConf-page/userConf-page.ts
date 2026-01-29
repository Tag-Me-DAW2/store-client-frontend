import { Component, inject, effect } from '@angular/core';
import { AuthService } from '../../../services/auth-service';
import { Router } from '@angular/router';
import { AlertService } from '../../../services/alert-service';
import { UserService } from '../../../services/user-service';
import {
  Form,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { last } from 'rxjs';
import { FieldErrorDirective } from '../../../directives/field-error.directive';
import { phoneValidator } from '../../../validators/phoneValidator';

@Component({
  selector: 'userconf-page',
  templateUrl: './userConf-page.html',
  styleUrls: ['./userConf-page.scss'],
  imports: [ReactiveFormsModule, FieldErrorDirective],
})
export class UserConfPage {
  authService = inject(AuthService);
  router = inject(Router);
  alertService = inject(AlertService);
  userService = inject(UserService);
  formulario: FormGroup;
  fb = inject(FormBuilder);
  previewUrl: string | null = null;
  fileName: string | null = null;
  user = this.authService.user$;
  eyeIcon = true;
  eyeIcon2 = true;

  constructor() {
    this.formulario = this.createForm();

    this.formulario.get('password')?.valueChanges.subscribe((value) => {
      const passwordConfirmControl = this.formulario.get('passwordConfirm');
      if (value && value.length > 0) {
        passwordConfirmControl?.enable({ emitEvent: false });
      } else {
        passwordConfirmControl?.disable({ emitEvent: false });
        passwordConfirmControl?.setValue('', { emitEvent: false });
      }

      passwordConfirmControl?.updateValueAndValidity({ emitEvent: false });
    });

    this.formulario.get('passwordConfirm')?.valueChanges.subscribe(() => {
      this.formulario
        .get('passwordConfirm')
        ?.updateValueAndValidity({ emitEvent: false });
    });

    effect(() => {
      const currentUser = this.user();
      if (currentUser) {
        this.formulario.patchValue({
          name: currentUser.firstName,
          lastName: currentUser.lastName,
          username: currentUser.username,
          phone: currentUser.phone,
          email: currentUser.email,
        });
        this.previewUrl = currentUser.profilePicture;
      }
    });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: [this.user()?.firstName, [Validators.required]],
      lastName: [this.user()?.lastName, [Validators.required]],
      username: [this.user()?.username, [Validators.required]],
      phone: [this.user()?.phone, [Validators.required, phoneValidator]],
      email: [this.user()?.email, [Validators.required, Validators.email]],
      password: [''],
      passwordConfirm: [
        { value: '', disabled: true },
        [this.passwordMatchValidator.bind(this)],
      ],
    });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.parent) {
      return null;
    }
    const password = control.parent.get('password')?.value;
    const passwordConfirm = control.value;

    if (!password || password.length === 0) {
      return null;
    }

    return password === passwordConfirm ? null : { passwordMismatch: true };
  }

  get isFormValid(): boolean | undefined {
    const name = this.formulario.get('name');
    const lastName = this.formulario.get('lastName');
    const username = this.formulario.get('username');
    const phone = this.formulario.get('phone');
    const email = this.formulario.get('email');

    const password = this.formulario.get('password');
    const passwordConfirm = this.formulario.get('passwordConfirm');

    const personalDataValid =
      name?.valid &&
      lastName?.valid &&
      username?.valid &&
      phone?.valid &&
      email?.valid;

    const passwordValue = password?.value;
    const hasPasswordInput = passwordValue && passwordValue.length > 0;

    if (hasPasswordInput) {
      return personalDataValid && passwordConfirm?.valid === true;
    }

    return personalDataValid;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    this.fileName = file.name;

    this.formulario.patchValue({ profilePicture: file });

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      this.previewUrl = base64String;
    };
    reader.readAsDataURL(file);
  }

  removeImage() {
    this.fileName = '0x00';
    this.previewUrl = '0x00';
    this.formulario.patchValue({ profilePicture: null });
  }

  togglePasswordVisibility(number: number) {
    const passwordInput = document.getElementById(
      number === 1 ? 'password' : 'passwordConfirm',
    ) as HTMLInputElement;

    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';

      number === 1 ? (this.eyeIcon = false) : (this.eyeIcon2 = false);
    } else {
      passwordInput.type = 'password';
      number === 1 ? (this.eyeIcon = true) : (this.eyeIcon2 = true);
    }
  }

  onSubmit() {
    const currentUser = this.user();
    if (!currentUser) return;

    const name = this.formulario.get('name')?.value;
    const lastName = this.formulario.get('lastName')?.value;
    const username = this.formulario.get('username')?.value;
    const phone = this.formulario.get('phone')?.value;
    const email = this.formulario.get('email')?.value;
    const password = this.formulario.get('password')?.value;
    const passwordConfirm = this.formulario.get('passwordConfirm')?.value;

    this.userService.updateUser(
      {
        id: currentUser.id,
        username: username,
        email: email,
        firstName: name,
        lastName: lastName,
        phone: phone,
        profilePicture:
          this.previewUrl === '0x00'
            ? '0x00'
            : this.previewUrl?.split(',')[1] || currentUser.profilePicture,
        profilePictureName:
          this.fileName === '0x00'
            ? '0x00'
            : this.fileName || currentUser.profilePictureName,
        role: currentUser.role,
      },
      this.previewUrl,
      this.fileName,
    );

    if (password && password.length > 0) {
      this.userService.updateUserPassword(
        password,
        passwordConfirm,
        currentUser.id,
      );
    }
  }
}
