import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimilarProductSlider } from './similar-product-slider';

describe('SimilarProductSlider', () => {
  let component: SimilarProductSlider;
  let fixture: ComponentFixture<SimilarProductSlider>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimilarProductSlider]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimilarProductSlider);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
