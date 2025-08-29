import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomizationRequests } from './customization-requests';

describe('CustomizationRequests', () => {
  let component: CustomizationRequests;
  let fixture: ComponentFixture<CustomizationRequests>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomizationRequests]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomizationRequests);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
