import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, Observable, Subscription } from 'rxjs';
import { NgClass } from '@angular/common';
import { UserResponse } from '../../../model/response/userResponse';
import { AuthService } from '../../../services/auth-service';

@Component({
  selector: 'header-component',
  imports: [RouterLink, NgClass],
  templateUrl: './header-component.html',
  styleUrl: './header-component.scss',
})
export class HeaderComponent {
  authService = inject(AuthService);
  router = inject(Router);
  subscriptions: Subscription[] = [];

  isMenuOpen: boolean = false;
  isUserMenuOpen: boolean = false;
  user = this.authService.user$;
  route: string = '';

  ngOnInit() {
    this.checkRoute();
    this.loadUser();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  // Function to check the current route
  checkRoute() {
    const subscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.route = event.urlAfterRedirects;
      });
    this.subscriptions.push(subscription);
  }

  // Function to get the user information
  loadUser() {
    this.authService.getUser();
  }

  // Function to toggle the menu visibility
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Function to toggle the user menu visibility
  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  closeSession() {
    this.authService.logout();
  }

  logout() {
    this.authService.logout();
  }
}
