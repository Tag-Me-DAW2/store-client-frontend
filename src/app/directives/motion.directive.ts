import { AfterViewInit, Directive, ElementRef, Input, OnDestroy } from '@angular/core';

@Directive({
  selector: '[motion]',
  standalone: true
})
export class MotionDirective implements AfterViewInit, OnDestroy {

  /* Posición inicial */
  @Input() x = 0;       // translateX en px
  @Input() y = 0;       // translateY en px
  @Input() scale = 1;   // escala inicial
  @Input() rotate = 0;  // rotación inicial en deg
  @Input() opacity = 1; // opacidad inicial

  /* Animación */
  @Input() duration = 300; // duración en milisegundos
  @Input() delay = 0;      // delay en milisegundos
  @Input() easing = 'ease-out'; // easing CSS

  /* IntersectionObserver */
  @Input() threshold = 0.2; // porcentaje visible para disparar animación

  private observer!: IntersectionObserver;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngAfterViewInit() {
    const el = this.el.nativeElement;

    /* ESTADO INICIAL */
    el.style.opacity = String(this.opacity);
    el.style.transform = `
      translate(${this.x}px, ${this.y}px)
      scale(${this.scale})
      rotate(${this.rotate}deg)
    `;

    /* OBSERVER: animar solo cuando entra en pantalla */
    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.animate();
          this.observer.disconnect();
        }
      },
      { threshold: this.threshold }
    );

    this.observer.observe(el);

    // Extra: si ya está visible al cargar, animar con delay
    setTimeout(() => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      if (rect.top < vh && rect.bottom > 0) {
        this.animate();
        this.observer.disconnect();
      }
    }, 0);
  }

  private animate() {
    const el = this.el.nativeElement;

    requestAnimationFrame(() => {
      // Obtener la transición existente del elemento
      const existingTransition = window.getComputedStyle(el).transition;
      const hasExistingTransition = existingTransition && existingTransition !== 'all 0s ease 0s';
      
      // Construir la nueva transición preservando la existente
      const motionTransition = `opacity ${this.duration}ms ${this.easing} ${this.delay}ms, transform ${this.duration}ms ${this.easing} ${this.delay}ms`;
      
      if (hasExistingTransition && existingTransition !== 'none') {
        el.style.transition = `${existingTransition}, ${motionTransition}`;
      } else {
        el.style.transition = motionTransition;
      }

      /* ESTADO FINAL */
      el.style.opacity = '1';
      el.style.transform = 'translate(0, 0) scale(1) rotate(0deg)';
    });
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}