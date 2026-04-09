import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateOfferAcceptanceComponent } from './candidate-offer-acceptance.component';

describe('CandidateOfferAcceptanceComponent', () => {
  let component: CandidateOfferAcceptanceComponent;
  let fixture: ComponentFixture<CandidateOfferAcceptanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateOfferAcceptanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateOfferAcceptanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
