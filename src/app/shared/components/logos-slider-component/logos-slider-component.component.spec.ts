import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogosSliderComponentComponent } from './logos-slider-component.component';

describe('LogosSliderComponentComponent', () => {
  let component: LogosSliderComponentComponent;
  let fixture: ComponentFixture<LogosSliderComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogosSliderComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogosSliderComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
