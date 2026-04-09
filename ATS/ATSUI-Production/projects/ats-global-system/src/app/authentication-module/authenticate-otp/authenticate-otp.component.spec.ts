import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthenticateOtpComponent } from './authenticate-otp.component';

describe('AuthenticateOtpComponent', () => {
  let component: AuthenticateOtpComponent;
  let fixture: ComponentFixture<AuthenticateOtpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthenticateOtpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthenticateOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
