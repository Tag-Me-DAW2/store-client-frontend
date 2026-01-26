import { AbstractControl, ValidationErrors } from '@angular/forms';

export function fullNameValidator(
  control: AbstractControl,
): ValidationErrors | null {
  if (!control.value) return null;

  const palabras = control.value.trim().split(/\s/);

  return palabras.length >= 2 ? null : { nombreCompleto: true };
}
