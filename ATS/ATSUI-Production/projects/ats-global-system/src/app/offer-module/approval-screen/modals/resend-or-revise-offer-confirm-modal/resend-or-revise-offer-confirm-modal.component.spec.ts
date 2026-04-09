import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResendOrReviseOfferConfirmModalComponent } from './resend-or-revise-offer-confirm-modal.component';

describe('ResendOrReviseOfferConfirmModalComponent', () => {
  let component: ResendOrReviseOfferConfirmModalComponent;
  let fixture: ComponentFixture<ResendOrReviseOfferConfirmModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResendOrReviseOfferConfirmModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResendOrReviseOfferConfirmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
