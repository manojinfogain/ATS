import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateTalentOfferDetailsModalComponent } from './candidate-talent-offer-details-modal.component';

describe('CandidateTalentOfferDetailsModalComponent', () => {
  let component: CandidateTalentOfferDetailsModalComponent;
  let fixture: ComponentFixture<CandidateTalentOfferDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateTalentOfferDetailsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateTalentOfferDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
