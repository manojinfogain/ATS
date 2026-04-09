import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsOtpVerificationModalComponent } from './us-otp-verification-modal.component';

describe('UsOtpVerificationModalComponent', () => {
  let component: UsOtpVerificationModalComponent;
  let fixture: ComponentFixture<UsOtpVerificationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsOtpVerificationModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsOtpVerificationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
