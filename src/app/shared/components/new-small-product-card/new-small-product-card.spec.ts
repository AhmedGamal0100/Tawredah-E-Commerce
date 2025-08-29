import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSmallProductCard } from './new-small-product-card';

describe('NewSmallProductCard', () => {
  let component: NewSmallProductCard;
  let fixture: ComponentFixture<NewSmallProductCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewSmallProductCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewSmallProductCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
