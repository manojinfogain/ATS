import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewQuestionnaireDetailedFeedbackComponent } from './view-questionnaire-detailed-feedback.component';

describe('ViewQuestionnaireDetailedFeedbackComponent', () => {
  let component: ViewQuestionnaireDetailedFeedbackComponent;
  let fixture: ComponentFixture<ViewQuestionnaireDetailedFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewQuestionnaireDetailedFeedbackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewQuestionnaireDetailedFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
