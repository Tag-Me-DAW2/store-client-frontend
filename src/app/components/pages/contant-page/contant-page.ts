import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MotionDirective } from '../../../directives/motion.directive';
import { Footer } from '../../ui/c-footer/c.footer';

@Component({
  selector: 'contant-page',
  imports: [FormsModule, MotionDirective, Footer],
  templateUrl: './contant-page.html',
  styleUrl: './contant-page.scss',
})
export class ContantPage {
  formData = {
    name: '',
    email: '',
    phone: '',
    message: ''
  };

  mapLoaded = false;

  onSubmit(): void {
    console.log('Form submitted:', this.formData);
    // Aquí puedes agregar la lógica para enviar el formulario
  }

  onMapLoad(): void {
    this.mapLoaded = true;
  }
}
