import { Injectable, signal } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

/**
 * Servicio aislado para manejar la acción secreta (Easter Egg)
 * Se activa cuando se cumplen condiciones específicas y se hace click en el logo
 */
@Injectable({
  providedIn: 'root',
})
export class EasterEggService {
  // Signal reactivo para el estado activo del Easter Egg (usado por app.ts)
  readonly isActive = signal(false);

  // Subject para emitir cuando se hace click en el logo del header
  private logoClickSubject = new Subject<void>();
  logoClick$ = this.logoClickSubject.asObservable();

  // Estado actual de las condiciones (para que el header sepa si debe redirigir)
  private currentConditionsSubject = new BehaviorSubject<{
    minPrice: number;
    maxPrice: number;
    searchQuery: string;
  } | null>(null);

  // Emitir evento de click en el logo
  emitLogoClick(): void {
    this.logoClickSubject.next();
  }

  // Actualizar las condiciones actuales desde products-page
  updateCurrentConditions(
    minPrice: number,
    maxPrice: number,
    searchQuery: string,
  ): void {
    this.currentConditionsSubject.next({ minPrice, maxPrice, searchQuery });
  }

  // Limpiar condiciones cuando se sale de products-page
  clearConditions(): void {
    this.currentConditionsSubject.next(null);
  }

  // Verificar si las condiciones actuales se cumplen
  areConditionsMet(): boolean {
    const conditions = this.currentConditionsSubject.getValue();
    if (!conditions) return false;
    return this.checkSecretConditions(
      conditions.minPrice,
      conditions.maxPrice,
      conditions.searchQuery,
    );
  }

  /**
   * Verifica si las condiciones secretas se cumplen
   * @param minPrice - Precio mínimo del rango
   * @param maxPrice - Precio máximo del rango
   * @param searchQuery - Texto de búsqueda
   * @returns true si todas las condiciones se cumplen
   */
  checkSecretConditions(
    minPrice: number,
    maxPrice: number,
    searchQuery: string,
  ): boolean {
    const isMinPriceCorrect = minPrice === 6;
    const isMaxPriceCorrect = maxPrice === 7;
    const isSearchQueryCorrect =
      searchQuery.toLowerCase().trim() === 'jeffrey epstein';

    return isMinPriceCorrect && isMaxPriceCorrect && isSearchQueryCorrect;
  }

  // Audio del Easter Egg
  private audio: HTMLAudioElement | null = null;

  // Activar el Easter Egg
  activate(): void {
    this.isActive.set(true);
    document.body.classList.add('easter-egg-active');
    this.playAudio();
  }

  // Desactivar el Easter Egg
  deactivate(): void {
    this.isActive.set(false);
    document.body.classList.remove('easter-egg-active');
    this.stopAudio();
  }

  // Toggle
  toggle(): void {
    if (this.isActive()) {
      this.deactivate();
    } else {
      this.activate();
    }
  }

  /** Inicializa y reproduce el audio */
  private playAudio(): void {
    try {
      if (!this.audio) {
        this.audio = new Audio('/assets/easter-egg.mp3');
        this.audio.loop = true;
        this.audio.volume = 0.9;
      }
      this.audio.currentTime = 0;
      this.audio.play().catch(() => {
        /* permisos */
      });
    } catch (e) {
      /* ignore */
    }
  }

  /** Para el audio */
  private stopAudio(): void {
    try {
      this.audio?.pause();
      if (this.audio) this.audio.currentTime = 0;
    } catch (e) {
      /* ignore */
    }
  }
}
