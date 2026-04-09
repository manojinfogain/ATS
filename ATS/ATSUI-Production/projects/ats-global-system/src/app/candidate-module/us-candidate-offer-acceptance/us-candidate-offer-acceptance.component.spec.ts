import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsCandidateOfferAcceptanceComponent } from './us-candidate-offer-acceptance.component';

describe('UsCandidateOfferAcceptanceComponent', () => {
  let component: UsCandidateOfferAcceptanceComponent;
  let fixture: ComponentFixture<UsCandidateOfferAcceptanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsCandidateOfferAcceptanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsCandidateOfferAcceptanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
