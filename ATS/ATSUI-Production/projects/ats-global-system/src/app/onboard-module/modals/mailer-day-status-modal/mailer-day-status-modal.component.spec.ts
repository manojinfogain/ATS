import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailerDayStatusModalComponent } from './mailer-day-status-modal.component';

describe('MailerDayStatusModalComponent', () => {
  let component: MailerDayStatusModalComponent;
  let fixture: ComponentFixture<MailerDayStatusModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MailerDayStatusModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MailerDayStatusModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
