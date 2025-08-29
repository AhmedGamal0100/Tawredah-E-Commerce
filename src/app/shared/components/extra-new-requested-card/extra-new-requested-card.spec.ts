import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtraNewRequestedCard } from './extra-new-requested-card';

describe('ExtraNewRequestedCard', () => {
  let component: ExtraNewRequestedCard;
  let fixture: ComponentFixture<ExtraNewRequestedCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExtraNewRequestedCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExtraNewRequestedCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
