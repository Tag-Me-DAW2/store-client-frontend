import { Component, inject, signal, effect } from '@angular/core';
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
import { PaymentService } from '../../../services/payment-service';

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
  paymentService = inject(PaymentService);

  cart = this.cartService.cart$;
  subtotal = this.cartService.cartSubtotal;
  shipping = this.cartService.shippingCost;
  total = this.cartService.cartTotal;
  user = this.authService.user$;

  // Control de paso actual (1: envío, 2: pago)
  currentStep = signal<number>(1);

  // Almacenar información de envío
  shippingInfo: ShippingInfoRequest | null = null;

  // Control de estado de submit de formularios
  shippingFormSubmitted = signal<boolean>(false);
  paymentFormSubmitted = signal<boolean>(false);

  constructor() {
    this.shippingForm = this.createShippingForm();
    this.paymentForm = this.createPaymentForm();

    // Effect para actualizar el formulario cuando el usuario cambie
    effect(() => {
      const currentUser = this.user();
      if (currentUser) {
        this.shippingForm.patchValue({
          firstName: currentUser.firstName || '',
          lastName: currentUser.lastName || '',
          email: currentUser.email || '',
          phone: currentUser.phone || '',
        });
      }
    });
  }

  createShippingForm(): FormGroup {
    return this.fb.group({
      firstName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, phoneValidator]],
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
      cardHolderName: ['', [Validators.required, Validators.minLength(3)]],
      cardNumber: ['', [Validators.required, cardNumberValidator]],
      expirationDate: ['', [Validators.required, expiryDateValidator]],
      cvv: ['', [Validators.required, cvvValidator]],
    });
  }

  onShippingSubmit() {
    this.shippingFormSubmitted.set(true);
    if (this.shippingForm.valid) {
      this.shippingInfo = this.shippingForm.value;
      console.log('Información de envío guardada:', this.shippingInfo);
      this.currentStep.set(2);
      this.shippingFormSubmitted.set(false); // Reset para el siguiente intento
    } else {
      console.log('Formulario de envío inválido');
      Object.keys(this.shippingForm.controls).forEach((key) => {
        this.shippingForm.get(key)?.markAsTouched();
      });
    }
  }

  onPaymentSubmit() {
    this.paymentFormSubmitted.set(true);
    if (this.paymentForm.valid && this.shippingInfo) {
      const paymentData = {
        shippingInfo: this.shippingInfo,
        paymentInfo: this.paymentForm.value,
        orderInfo: {
          shippingCost: this.shipping(),
          subtotal: this.subtotal(),
          total: this.total(),
        },
      };
      console.log('Datos completos para pagar:', paymentData);
      paymentData.paymentInfo.cardNumber =
        paymentData.paymentInfo.cardNumber.replace(/\s/g, '');
      this.paymentService.processCreditCardPayment(paymentData);
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
    this.paymentFormSubmitted.set(false); // Reset al volver atrás
  }
}
