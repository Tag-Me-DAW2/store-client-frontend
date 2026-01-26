import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CFeatureSection } from './c-feature-section';

describe('CFeatureSection', () => {
  let component: CFeatureSection;
  let fixture: ComponentFixture<CFeatureSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CFeatureSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CFeatureSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
