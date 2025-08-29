import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestedProductFormPage } from './requested-product-form.page';

describe('RequestedProductFormPage', () => {
  let component: RequestedProductFormPage;
  let fixture: ComponentFixture<RequestedProductFormPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestedProductFormPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestedProductFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
