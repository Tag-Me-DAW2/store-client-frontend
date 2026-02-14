import {
  Component,
  signal,
  inject,
  OnInit,
  OnDestroy,
  effect,
  untracked,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/ui/header-component/header-component';
import { CCart } from './components/ui/c-cart/c-cart';
import { AuthService } from './services/auth-service';
import { CartService } from './services/cart-service';
import { EasterEggService } from './services/easter-egg.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, CCart],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private sanitizer = inject(DomSanitizer);
  readonly easterEggService = inject(EasterEggService);

  protected readonly title = signal('store-client-frontend');
  private hasLoadedCart = false;

  // Índices para las partículas del Easter Egg
  readonly particleIndexes = Array.from({ length: 20 }, (_, i) => i + 1);

  // Video random popup del Easter Egg
  readonly showVideo = signal(false);
  readonly videoStyle = signal<Record<string, string>>({});
  readonly safeVideoUrl: SafeResourceUrl;
  private videoInterval: ReturnType<typeof setInterval> | null = null;
  private videoTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    // URL del video sanitizada para el iframe
    this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://www.youtube.com/embed/Uj266NF1mUk?autoplay=1&controls=0&loop=1&playlist=Uj266NF1mUk',
    );

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

    // Cuando el Easter Egg se activa/desactiva, iniciar/parar el video random
    effect(() => {
      const active = this.easterEggService.isActive();
      untracked(() => {
        if (active) {
          this.startVideoLoop();
        } else {
          this.stopVideoLoop();
        }
      });
    });
  }

  ngOnInit(): void {
    // Cargar usuario desde el token almacenado
    this.authService.getUser();
  }

  ngOnDestroy(): void {
    this.stopVideoLoop();
  }

  /** Inicia el bucle de videos random apareciendo */
  private startVideoLoop(): void {
    this.stopVideoLoop();
    // Primer video aparece entre 3-6s después de activar
    const firstDelay = 3000 + Math.random() * 3000;
    this.videoTimeout = setTimeout(() => {
      this.spawnVideo();
      // Luego cada 8-15 segundos
      this.videoInterval = setInterval(
        () => {
          this.spawnVideo();
        },
        8000 + Math.random() * 7000,
      );
    }, firstDelay);
  }

  /** Para el bucle y oculta el video */
  private stopVideoLoop(): void {
    if (this.videoInterval) {
      clearInterval(this.videoInterval);
      this.videoInterval = null;
    }
    if (this.videoTimeout) {
      clearTimeout(this.videoTimeout);
      this.videoTimeout = null;
    }
    this.showVideo.set(false);
  }

  /** Muestra el video en posición aleatoria durante 6 segundos */
  private spawnVideo(): void {
    // Posición aleatoria (evitar bordes extremos)
    const x = 5 + Math.random() * 55; // 5% - 60% desde la izquierda
    const y = 5 + Math.random() * 45; // 5% - 50% desde arriba
    const rotation = -20 + Math.random() * 40; // -20° a +20°
    const scale = 0.7 + Math.random() * 0.6; // 0.7 a 1.3

    this.videoStyle.set({
      left: `${x}%`,
      top: `${y}%`,
      transform: `rotate(${rotation}deg) scale(${scale})`,
    });
    this.showVideo.set(true);

    // Ocultar después de 6 segundos
    setTimeout(() => {
      this.showVideo.set(false);
    }, 6000);
  }
}
