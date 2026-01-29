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
    this.setUser();
  }

  ngOnChanges() {
    this.setUser();
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
    ];

    const index = Math.floor(Math.random() * trabajos.length);
    return trabajos[index];
  }
}
