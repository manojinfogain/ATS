import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentLetterConsentComponent } from './appointment-letter-consent.component';

describe('AppointmentLetterConsentComponent', () => {
  let component: AppointmentLetterConsentComponent;
  let fixture: ComponentFixture<AppointmentLetterConsentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppointmentLetterConsentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentLetterConsentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
