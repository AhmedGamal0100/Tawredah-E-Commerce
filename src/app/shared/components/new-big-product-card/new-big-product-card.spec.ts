import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBigProductCard } from './new-big-product-card';

describe('NewBigProductCard', () => {
  let component: NewBigProductCard;
  let fixture: ComponentFixture<NewBigProductCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewBigProductCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewBigProductCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
