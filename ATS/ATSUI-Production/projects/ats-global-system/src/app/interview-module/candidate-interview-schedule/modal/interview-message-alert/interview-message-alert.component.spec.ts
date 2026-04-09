import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewMessageAlertComponent } from './interview-message-alert.component';

describe('InterviewMessageAlertComponent', () => {
  let component: InterviewMessageAlertComponent;
  let fixture: ComponentFixture<InterviewMessageAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterviewMessageAlertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterviewMessageAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
