import { Injectable } from '@angular/core';
import { AlertInterface, AlertOptions } from '../model/alertInterface';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertService implements AlertInterface {
  private isSessionExpiredAlertActive = false;

  setSessionExpiredAlertActive(active: boolean): void {
    this.isSessionExpiredAlertActive = active;
  }

  isSessionAlertActive(): boolean {
    return this.isSessionExpiredAlertActive;
  }
  success(options: AlertOptions): Promise<void> {
    return Swal.fire({
      title: options.title,
      text: options.text,
      icon: 'success',
      timer: options.duration ? options.duration : undefined,
      showConfirmButton: options.dismissible !== false,
    }).then(() => {});
  }

  error(options: AlertOptions): Promise<void> {
    // Si hay una alerta de sesión activa Y NO es la propia alerta de sesión, no mostrar
    if (this.isSessionExpiredAlertActive && options.title !== 'Session Expired') {
      return Promise.resolve();
    }
    return Swal.fire({
      title: options.title,
      text: options.text,
      icon: 'error',
      timer: options.duration ? options.duration : undefined,
      showConfirmButton: options.dismissible !== false,
      allowOutsideClick: options.allowOutsideClick !== false,
      allowEscapeKey: options.allowEscapeKey !== false,
    }).then(() => {});
  }

  warning(options: AlertOptions): Promise<void> {
    return Swal.fire({
      title: options.title,
      text: options.text,
      icon: 'warning',
      timer: options.duration ? options.duration : undefined,
      showConfirmButton: options.dismissible !== false,
    }).then(() => {});
  }

  info(options: AlertOptions): Promise<void> {
    return Swal.fire({
      title: options.title,
      text: options.text,
      icon: 'info',
      timer: options.duration ? options.duration : undefined,
      showConfirmButton: options.dismissible !== false,
    }).then(() => {});
  }

  close() {
    Swal.close();
  }
}
