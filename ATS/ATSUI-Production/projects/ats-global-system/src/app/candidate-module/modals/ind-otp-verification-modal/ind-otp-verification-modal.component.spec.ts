import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndOtpVerificationModalComponent } from './ind-otp-verification-modal.component';

describe('IndOtpVerificationModalComponent', () => {
  let component: IndOtpVerificationModalComponent;
  let fixture: ComponentFixture<IndOtpVerificationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndOtpVerificationModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndOtpVerificationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
