import { AbstractControl, ValidationErrors } from '@angular/forms';

export function postalCodeValidator(
  control: AbstractControl,
): ValidationErrors | null {
  if (!control.value) return null;

  const limpio = control.value.toString().trim();

  // Código postal español: 5 dígitos
  const regex = /^\d{5}$/;

  return regex.test(limpio) ? null : { codigoPostalInvalido: true };
}
