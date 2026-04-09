import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResendOfferApprovalDetailsComponent } from './resend-offer-approval-details.component';

describe('ResendOfferApprovalDetailsComponent', () => {
  let component: ResendOfferApprovalDetailsComponent;
  let fixture: ComponentFixture<ResendOfferApprovalDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResendOfferApprovalDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResendOfferApprovalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
