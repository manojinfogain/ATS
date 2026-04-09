import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendPreviewAppointmentLetterComponent } from './send-preview-appointment-letter.component';

describe('SendPreviewAppointmentLetterComponent', () => {
  let component: SendPreviewAppointmentLetterComponent;
  let fixture: ComponentFixture<SendPreviewAppointmentLetterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendPreviewAppointmentLetterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendPreviewAppointmentLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
