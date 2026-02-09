import {
  Directive,
  ElementRef,
  Host,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[fieldError]',
  standalone: true,
})
export class FieldErrorDirective implements OnDestroy, OnChanges, OnInit {
  @Input() fieldError = '';
  @Input() formSubmitted = false;

  private tooltip?: HTMLElement;
  private statusChangesSubscription?: Subscription;

  constructor(
    private el: ElementRef<HTMLInputElement>,
    private renderer: Renderer2,
    private control: NgControl,
  ) {
    const parent = this.renderer.parentNode(this.el.nativeElement);

    if (parent && getComputedStyle(parent).position === 'static') {
      this.renderer.setStyle(parent, 'position', 'relative');
    }
  }

  ngOnInit() {
    // Suscribirse a cambios del estado del control
    if (this.control.control) {
      this.statusChangesSubscription =
        this.control.control.statusChanges.subscribe(() => {
          this.updateTooltip();
        });
    }
  }

  private shouldShow(): boolean {
    const control = this.control.control;

    if (!control) return false;

    // Mostrar errores si el formulario fue enviado y es inválido
    if (this.formSubmitted && control.invalid) {
      return true;
    }

    // Mostrar errores si el campo ha sido tocado o modificado y es inválido
    if ((control.touched || control.dirty) && control.invalid) {
      return true;
    }

    return false;
  }

  private getErrorMessage(): string {
    const errors = this.control.control?.errors;

    if (!errors) return this.fieldError;

    if (errors['required']) return 'Este campo es obligatorio';
    if (errors['email']) return 'Formato de email inválido';
    if (errors['nombreCompleto'])
      return 'Por favor ingresa tu nombre y apellido separados por un espacio';
    if (errors['telefonoInvalido'])
      return 'El número de teléfono debe comenzar con + seguido del código de país y contener entre 8 y 15 dígitos';
    if (errors['passwordMismatch']) return 'Las contraseñas no coinciden';

    return this.fieldError;
  }

  private createTooltip() {
    if (this.tooltip) return;

    this.tooltip = this.renderer.createElement('div');
    this.renderer.addClass(this.tooltip, 'field-tooltip');
    this.renderer.addClass(this.tooltip, 'error');

    const icon = this.renderer.createElement('span');

    this.renderer.addClass(icon, 'warning-icon');
    this.renderer.setProperty(icon, 'textContent', '!');

    const text = this.renderer.createText(this.getErrorMessage());

    this.renderer.appendChild(this.tooltip, icon);
    this.renderer.appendChild(this.tooltip, text);

    this.renderer.appendChild(
      this.el.nativeElement.parentElement,
      this.tooltip,
    );
  }

  private updateTooltip() {
    if (this.shouldShow()) {
      this.createTooltip();
    } else {
      this.hide();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('formSubmitted' in changes) {
      this.updateTooltip();
    }
  }

  @HostListener('focus')
  @HostListener('mouseenter')
  show() {
    if (!this.shouldShow() || this.tooltip) {
      return;
    }

    this.createTooltip();
  }

  @HostListener('blur')
  @HostListener('mouseleave')
  hide() {
    // No ocultar el tooltip si el formulario ha sido enviado y hay errores
    if (this.formSubmitted && this.shouldShow()) {
      return;
    }

    if (this.tooltip) {
      this.renderer.removeChild(
        this.el.nativeElement.parentElement,
        this.tooltip,
      );
      this.tooltip = undefined;
    }
  }

  ngOnDestroy() {
    this.statusChangesSubscription?.unsubscribe();
    this.hide();
  }
}
