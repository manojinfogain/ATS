import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpVerificationVideoMatchComponent } from './otp-verification-video-match.component';

describe('OtpVerificationVideoMatchComponent', () => {
  let component: OtpVerificationVideoMatchComponent;
  let fixture: ComponentFixture<OtpVerificationVideoMatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtpVerificationVideoMatchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OtpVerificationVideoMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
