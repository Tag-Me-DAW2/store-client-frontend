import {
  Component,
  Host,
  HostBinding,
  Input,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'div[c-badge]',
  template: '<ng-content></ng-content>',
  styleUrl: './c-badge.scss',
  encapsulation: ViewEncapsulation.None,
})
export class CBadge {
  @Input() variant: 'primary' | 'success' | 'warning' | 'danger' = 'primary';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() hoverable: boolean = false;

  @HostBinding('class')
  get hostClasses(): Record<string, boolean> {
    return {
      'c-badge': true,
      [`c-badge--${this.variant}`]: true,
      [`c-badge--${this.size}`]: true,
      'c-badge--hoverable': this.hoverable,
    };
  }
}
