import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateOfferApprovalModalComponent } from './candidate-offer-approval-modal.component';

describe('CandidateOfferApprovalModalComponent', () => {
  let component: CandidateOfferApprovalModalComponent;
  let fixture: ComponentFixture<CandidateOfferApprovalModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateOfferApprovalModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateOfferApprovalModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
