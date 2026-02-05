import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MotionDirective } from '../../../directives/motion.directive';

@Component({
  selector: 'app-tecnologia-page',
  imports: [CommonModule, MotionDirective],
  templateUrl: './tecnologia-page.html',
  styleUrl: './tecnologia-page.scss',
})
export class TecnologiaPage {}
