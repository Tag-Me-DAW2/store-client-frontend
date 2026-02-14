import {
  Component,
  ElementRef,
  Host,
  HostListener,
  inject,
  ViewChild,
} from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, Observable, Subscription } from 'rxjs';
import { NgClass } from '@angular/common';
import { UserResponse } from '../../../model/response/user/userResponse';
import { AuthService } from '../../../services/auth-service';
import { CartService } from '../../../services/cart-service';
import { EasterEggService } from '../../../services/easter-egg.service';

@Component({
  selector: 'header-component',
  imports: [RouterLink, NgClass],
  templateUrl: './header-component.html',
  styleUrl: './header-component.scss',
})
export class HeaderComponent {
  authService = inject(AuthService);
  cartService = inject(CartService);
  router = inject(Router);
  easterEggService = inject(EasterEggService);
  subscriptions: Subscription[] = [];

  isMenuOpen: boolean = false;
  user = this.authService.user$;
  cartItemsCount = this.cartService.cartItemsCount;
  profilePictureUrl: string | null = null;
  route: string = '';

  @ViewChild('userMenu') userMenu!: ElementRef;
  isUserMenuOpen: boolean = false;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.userMenu) return;

    const clickedInside = this.userMenu.nativeElement.contains(event.target);
    const clickedToggle = (event.target as HTMLElement).closest(
      '.header__user-container',
    );

    if (clickedToggle) {
      return;
    }

    if (!clickedInside && this.isUserMenuOpen) {
      this.isUserMenuOpen = false;
    }
  }

  constructor() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.isUserMenuOpen = false;
      });
  }

  ngOnInit() {
    this.route = this.router.url; // Capturar la ruta actual inmediatamente
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

  // Function to open the cart sidebar
  openCart() {
    this.cartService.openCart();
  }

  closeSession() {
    this.authService.logout();
  }

  logout() {
    this.authService.logout();
  }

  // Función aislada para el Easter Egg - emite evento al hacer click en el logo
  onLogoClick(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation(); // Evitar que el click burbujee al wrapper del cubo

    // Si estamos en products y las condiciones se cumplen, solo emitir evento
    if (
      this.route.includes('/products') &&
      this.easterEggService.areConditionsMet()
    ) {
      this.easterEggService.emitLogoClick();
    } else {
      // Si no, navegar a inicio normalmente
      this.router.navigate(['/']);
    }
  }
}
