import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndCandidateOfferAcceptanceComponent } from './ind-candidate-offer-acceptance.component';

describe('IndCandidateOfferAcceptanceComponent', () => {
  let component: IndCandidateOfferAcceptanceComponent;
  let fixture: ComponentFixture<IndCandidateOfferAcceptanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndCandidateOfferAcceptanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndCandidateOfferAcceptanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
