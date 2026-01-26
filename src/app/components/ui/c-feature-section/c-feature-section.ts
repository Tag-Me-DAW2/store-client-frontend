import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLinkWithHref } from "@angular/router";
import { MotionDirective } from "../../../directives/motion.directive";

@Component({
  selector: 'feature-section',
  templateUrl: './c-feature-section.html',
  styleUrls: ['./c-feature-section.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, RouterLinkWithHref, MotionDirective]
})
export class FeatureSectionComponent {

  @Input({ required: true })
  title!: string;

  @Input({ required: true })
  imageUrl!: string;

  @Input({ required: true })
  imagePosition: 'left' | 'right' = 'right';

  @Input({ required: true })
  butonContent!: string;

  @Input({ required: false })
  routeLink: string[] = [];

  get motionX(): number {
    return this.imagePosition === 'left' ? -20 : 20;
  }
  get textMotionX(): number {
    return this.imagePosition === 'left' ? 20 : -20;
  }}