import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderSimilarDetails } from './slider-similar-details';

describe('SliderSimilarDetails', () => {
  let component: SliderSimilarDetails;
  let fixture: ComponentFixture<SliderSimilarDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SliderSimilarDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SliderSimilarDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
