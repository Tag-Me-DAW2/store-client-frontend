import { Component, Input, signal } from '@angular/core';
import { MotionDirective } from '../../../directives/motion.directive';
import { NgClass } from '@angular/common';

@Component({
  selector: 'c-cool-card',
  imports: [MotionDirective, NgClass],
  templateUrl: './c-cool-card.html',
  styleUrl: './c-cool-card.scss',
})
export class CCoolCard {
  @Input() name?: string;
  @Input() email?: string;
  job!: string;
  intervalId!: any;
  isJobAnimating = signal(false);

  ngOnInit() {
    this.setUser();
    this.intervalId = setInterval(() => {
      this.triggerJobAnimation();
    }, 5000);
  }

  triggerJobAnimation() {
    this.isJobAnimating.set(true);
    setTimeout(() => {
      this.job = this.getTrabajoAleatorio();
      setTimeout(() => {
        this.isJobAnimating.set(false);
      }, 300);
    }, 300);
  }

  ngOnChanges() {
    this.setUser();
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  setUser() {
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
      'Redactor de contenidos',
      'Community Manager',
      'Consultor IT',
      'Desarrollador web',
      'Ingeniero de redes',
      'Técnico de hardware',
      'Especialista en SEO',
      'Git Puller',
      'Vibecoder de Confianza',
      'ChatGPT Whisperer',
      'Arquitecto de Microservicios',
      'Ninja DevOps',
      'Maestro del Código Limpio',
      'Explorador de Bugs',
      'Ingeniero de la Nube',
      'Alquimista de Datos',
      'Diseñador de Experiencias',
      'Cazador de Tendencias Tech',
      'Evangelista de Código Abierto',
      'Guardían de la Seguridad Cibernética',
      'Cartomagia',
      'Goofy ah',
      'The one who knocks',
      'Full Stack Overlord',
      'The one who pushes',
      'The boiled one',
      'Debugging Wizard',
      'Pixel Perfectionist',
      'Byte Bender',
      'Script Kiddie Supreme',
      'Code Conjurer',
      'Tech Troubadour',
      'Algorithm Alchemist',
      'Syntax Sorcerer',
      'Data Dynamo',
      'Cloud Conductor',
      'Interface Illusionist',
      'System Sage',
      'Network Ninja',
      'Backend Bard',
      'Frontend Falconer',
      'DevOps Druid',
      'Gurt',
      'Gurtimor',
      'The Gurter',
      'The one who Gurts',
      'Lord of the Gurts',
      'Gurtmaster General',
      'Gurt Whisperer',
      'Gurt Engineer',
      'Cheff',
      'Lord of the Files',
      'The Committer',
      'The Pusher',
    ];

    const index = Math.floor(Math.random() * trabajos.length);
    return trabajos[index];
  }
}
