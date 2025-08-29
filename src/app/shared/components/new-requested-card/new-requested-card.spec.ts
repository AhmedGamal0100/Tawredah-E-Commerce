import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRequestedCard } from './new-requested-card';

describe('NewRequestedCard', () => {
  let component: NewRequestedCard;
  let fixture: ComponentFixture<NewRequestedCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewRequestedCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewRequestedCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
