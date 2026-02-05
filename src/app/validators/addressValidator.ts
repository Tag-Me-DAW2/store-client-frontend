import { AbstractControl, ValidationErrors } from '@angular/forms';

export function addressValidator(
  control: AbstractControl,
): ValidationErrors | null {
  if (!control.value) return null;

  const limpio = control.value.toString().trim();

  // Dirección válida: debe tener al menos 5 caracteres y contener al menos un número
  const tieneNumero = /\d/.test(limpio);
  const longitudMinima = limpio.length >= 5;

  if (!longitudMinima) {
    return { direccionMuyCorta: true };
  }

  if (!tieneNumero) {
    return { direccionSinNumero: true };
  }

  return null;
}
