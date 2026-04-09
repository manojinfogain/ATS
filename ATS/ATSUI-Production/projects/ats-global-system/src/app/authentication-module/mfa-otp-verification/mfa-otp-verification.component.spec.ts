import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MfaOtpVerificationComponent } from './mfa-otp-verification.component';

describe('MfaOtpVerificationComponent', () => {
  let component: MfaOtpVerificationComponent;
  let fixture: ComponentFixture<MfaOtpVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MfaOtpVerificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MfaOtpVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
