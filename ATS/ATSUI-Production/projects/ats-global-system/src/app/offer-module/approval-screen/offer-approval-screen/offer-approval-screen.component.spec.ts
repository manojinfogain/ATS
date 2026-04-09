import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferApprovalScreenComponent } from './offer-approval-screen.component';

describe('OfferApprovalScreenComponent', () => {
  let component: OfferApprovalScreenComponent;
  let fixture: ComponentFixture<OfferApprovalScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfferApprovalScreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferApprovalScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
