import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CartService } from '../../../services/cart-service';
import { AuthService } from '../../../services/auth-service';
import { DecimalPipe } from '@angular/common';
import { FieldErrorDirective } from '../../../directives/field-error.directive';
import { phoneValidator } from '../../../validators/phoneValidator';
import { postalCodeValidator } from '../../../validators/postalCodeValidator';
import { addressValidator } from '../../../validators/addressValidator';
import {
  cardNumberValidator,
  expiryDateValidator,
  cvvValidator,
} from '../../../validators/cardValidator';
import { ShippingInfoRequest } from '../../../model/request/ShippingInfoRequest';

@Component({
  selector: 'payment-page',
  templateUrl: './payment-page.html',
  styleUrls: ['./payment-page.scss'],
  imports: [FormsModule, ReactiveFormsModule, DecimalPipe, FieldErrorDirective],
})
export class PaymentPage {
  shippingForm: FormGroup;
  paymentForm: FormGroup;
  fb = inject(FormBuilder);
  cartService = inject(CartService);
  authService = inject(AuthService);

  cart = this.cartService.cart$;
  subtotal = this.cartService.cartSubtotal;
  shipping = this.cartService.shippingCost;
  total = this.cartService.cartTotal;
  user = this.authService.user$;

  // Control de paso actual (1: envío, 2: pago)
  currentStep = signal<number>(1);

  // Almacenar información de envío
  shippingInfo: ShippingInfoRequest | null = null;

  constructor() {
    this.shippingForm = this.createShippingForm();
    this.paymentForm = this.createPaymentForm();
  }

  createShippingForm(): FormGroup {
    const currentUser = this.user();

    return this.fb.group({
      firstName: [
        currentUser?.firstName || '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      lastName: [
        currentUser?.lastName || '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      email: [
        currentUser?.email || '',
        [Validators.required, Validators.email],
      ],
      phone: [currentUser?.phone || '', [Validators.required, phoneValidator]],
      address: ['', [Validators.required, addressValidator]],
      city: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
        ],
      ],
      postalCode: ['', [Validators.required, postalCodeValidator]],
      country: [
        'España',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
        ],
      ],
    });
  }

  createPaymentForm(): FormGroup {
    return this.fb.group({
      cardName: ['', [Validators.required, Validators.minLength(3)]],
      cardNumber: ['', [Validators.required, cardNumberValidator]],
      expiryDate: ['', [Validators.required, expiryDateValidator]],
      cvv: ['', [Validators.required, cvvValidator]],
    });
  }

  onShippingSubmit() {
    if (this.shippingForm.valid) {
      this.shippingInfo = this.shippingForm.value;
      console.log('Información de envío guardada:', this.shippingInfo);
      this.currentStep.set(2);
    } else {
      console.log('Formulario de envío inválido');
      Object.keys(this.shippingForm.controls).forEach((key) => {
        this.shippingForm.get(key)?.markAsTouched();
      });
    }
  }

  onPaymentSubmit() {
    if (this.paymentForm.valid) {
      const paymentData = {
        shipping: this.shippingInfo,
        payment: this.paymentForm.value,
        order: {
          subtotal: this.subtotal(),
          shipping: this.shipping(),
          total: this.total(),
        },
      };
      console.log('Datos completos para pagar:', paymentData);
      // Aquí llamarías al servicio de pago
    } else {
      console.log('Formulario de pago inválido');
      Object.keys(this.paymentForm.controls).forEach((key) => {
        this.paymentForm.get(key)?.markAsTouched();
      });
    }
  }

  // Formatear número de tarjeta: agregar espacio cada 4 dígitos
  onCardNumberInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\s/g, '');
    let formattedValue = '';

    for (let i = 0; i < value.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formattedValue += ' ';
      }
      formattedValue += value[i];
    }

    this.paymentForm.patchValue(
      { cardNumber: formattedValue },
      { emitEvent: false },
    );
    input.value = formattedValue;
  }

  // Formatear fecha de expiración: agregar / después de 2 dígitos
  onExpiryDateInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }

    this.paymentForm.patchValue({ expiryDate: value }, { emitEvent: false });
    input.value = value;
  }

  // Solo permitir dígitos en CVV
  onCvvInput(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/\D/g, '').substring(0, 4);
    this.paymentForm.patchValue({ cvv: input.value }, { emitEvent: false });
  }

  goBackToShipping() {
    this.currentStep.set(1);
  }
}
