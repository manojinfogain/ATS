import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewFeedbackQuesionnaireModalComponent } from './interview-feedback-quesionnaire-modal.component';

describe('InterviewFeedbackQuesionnaireModalComponent', () => {
  let component: InterviewFeedbackQuesionnaireModalComponent;
  let fixture: ComponentFixture<InterviewFeedbackQuesionnaireModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterviewFeedbackQuesionnaireModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterviewFeedbackQuesionnaireModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
