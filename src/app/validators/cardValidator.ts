import { AbstractControl, ValidationErrors } from '@angular/forms';

export function cardNumberValidator(
  control: AbstractControl,
): ValidationErrors | null {
  if (!control.value) return null;

  const limpio = control.value.toString().replace(/\s/g, '');

  // Validar que solo tenga números
  if (!/^\d+$/.test(limpio)) {
    return { soloNumeros: true };
  }

  // Validar que tenga exactamente 16 dígitos (4 grupos de 4)
  if (limpio.length !== 16) {
    return { longitudInvalida: true };
  }

  return null;
}

export function expiryDateValidator(
  control: AbstractControl,
): ValidationErrors | null {
  if (!control.value) return null;

  const valor = control.value.toString().trim();

  // Formato MM/AA
  const regex = /^(0[1-9]|1[0-2])\/(\d{2})$/;
  const match = valor.match(regex);

  if (!match) {
    return { formatoInvalido: true };
  }

  const mes = parseInt(match[1], 10);
  const anio = parseInt(match[2], 10) + 2000;

  const ahora = new Date();
  const fechaExpiracion = new Date(anio, mes - 1);

  if (fechaExpiracion < ahora) {
    return { tarjetaExpirada: true };
  }

  return null;
}

export function cvvValidator(
  control: AbstractControl,
): ValidationErrors | null {
  if (!control.value) return null;

  const limpio = control.value.toString().trim();

  // CVV debe ser 3 o 4 dígitos
  const regex = /^\d{3,4}$/;

  return regex.test(limpio) ? null : { cvvInvalido: true };
}
