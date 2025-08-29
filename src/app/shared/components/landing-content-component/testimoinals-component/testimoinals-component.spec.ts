import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestimoinalsComponent } from './testimoinals-component';

describe('TestimoinalsComponent', () => {
  let component: TestimoinalsComponent;
  let fixture: ComponentFixture<TestimoinalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestimoinalsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestimoinalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
