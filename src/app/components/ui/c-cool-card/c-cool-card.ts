import { Component, Input } from '@angular/core';
import { MotionDirective } from '../../../directives/motion.directive';

@Component({
  selector: 'c-cool-card',
  imports: [MotionDirective],
  templateUrl: './c-cool-card.html',
  styleUrl: './c-cool-card.scss',
})
export class CCoolCard {
  @Input() name?: string;
  @Input() email?: string;
  job!: string;

  ngOnInit() {
    this.name = this.name ?? 'Pepe';
    this.email = this.email ?? 'pepe@gmail.com';
    this.job = this.getTrabajoAleatorio();
  }

  getTrabajoAleatorio(): string {
    const trabajos = [
      'Mozo de almacén',
      'Programador',
      'Diseñador gráfico',
      'Administrador de sistemas',
      'Camarero',
      'Dependiente',
      'Electricista',
      'Fontanero',
      'Analista de datos',
      'Project Manager',
      'QA Tester',
      'Soporte técnico',
      'Marketing digital',
    ];

    const index = Math.floor(Math.random() * trabajos.length);
    return trabajos[index];
  }
}
