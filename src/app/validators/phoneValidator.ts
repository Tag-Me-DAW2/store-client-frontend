import { AbstractControl, ValidationErrors } from '@angular/forms';

export function phoneValidator(
  control: AbstractControl,
): ValidationErrors | null {
  if (!control.value) return null;

  const limpio = control.value.toString().trim().replace(/[\s-]/g, '');

  const regex = /^\+[1-9]\d{7,14}$/;

  return regex.test(limpio) ? null : { telefonoInvalido: true };
}
