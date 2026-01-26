import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CBadge } from '../../ui/c-badge/c-badge';
import { MatButtonModule } from '@angular/material/button';
import { CCoolCard } from '../../ui/c-cool-card/c-cool-card';
import { MotionDirective } from '../../../directives/motion.directive';
import { FeatureSectionComponent } from '../../ui/c-feature-section/c-feature-section';
import { RouterLink } from '@angular/router';
import { Footer } from '../../ui/c-footer/c.footer';
import { AuthService } from '../../../services/auth-service';

@Component({
  selector: 'app-landing-page',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    CBadge,
    CCoolCard,
    MotionDirective,
    FeatureSectionComponent,
    RouterLink,
    Footer,
  ],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.scss',
})
export class LandingPage {
  authService = inject(AuthService);
  user = this.authService.user$;

  loadUser() {
    this.authService.getUser();
  }
}
