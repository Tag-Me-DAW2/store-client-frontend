import {
  Component,
  signal,
  inject,
  OnInit,
  effect,
  untracked,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/ui/header-component/header-component';
import { CCart } from './components/ui/c-cart/c-cart';
import { AuthService } from './services/auth-service';
import { CartService } from './services/cart-service';
import { EasterEggService } from './services/easter-egg.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, CCart],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  readonly easterEggService = inject(EasterEggService);

  protected readonly title = signal('store-client-frontend');
  private hasLoadedCart = false;

  // Índices para las partículas del Easter Egg
  readonly particleIndexes = Array.from({ length: 20 }, (_, i) => i + 1);

  constructor() {
    // Cargar carrito automáticamente cuando el usuario cambie (solo una vez)
    effect(() => {
      const user = this.authService.user$();
      if (user && !this.hasLoadedCart) {
        untracked(() => {
          this.cartService.loadCart();
          this.hasLoadedCart = true;
        });
      } else if (!user) {
        this.hasLoadedCart = false;
      }
    });
  }

  ngOnInit(): void {
    // Cargar usuario desde el token almacenado
    this.authService.getUser();
  }
}
