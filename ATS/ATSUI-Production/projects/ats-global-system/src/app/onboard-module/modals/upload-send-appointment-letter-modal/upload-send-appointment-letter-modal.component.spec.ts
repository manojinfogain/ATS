import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadSendAppointmentLetterModalComponent } from './upload-send-appointment-letter-modal.component';

describe('UploadSendAppointmentLetterModalComponent', () => {
  let component: UploadSendAppointmentLetterModalComponent;
  let fixture: ComponentFixture<UploadSendAppointmentLetterModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadSendAppointmentLetterModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadSendAppointmentLetterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
