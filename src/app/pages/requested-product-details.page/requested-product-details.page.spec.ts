import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestedProductDetailsPage } from './requested-product-details.page';

describe('RequestedProductDetailsPage', () => {
  let component: RequestedProductDetailsPage;
  let fixture: ComponentFixture<RequestedProductDetailsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestedProductDetailsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestedProductDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
