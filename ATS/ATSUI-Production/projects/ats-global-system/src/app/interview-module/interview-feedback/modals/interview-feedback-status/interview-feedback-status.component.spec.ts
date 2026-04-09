import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewFeedbackStatusComponent } from './interview-feedback-status.component';

describe('InterviewFeedbackStatusComponent', () => {
  let component: InterviewFeedbackStatusComponent;
  let fixture: ComponentFixture<InterviewFeedbackStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterviewFeedbackStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterviewFeedbackStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
