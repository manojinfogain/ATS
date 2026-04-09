import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewResumeAiRatingDetailsComponent } from './view-resume-ai-rating-details.component';

describe('ViewResumeAiRatingDetailsComponent', () => {
  let component: ViewResumeAiRatingDetailsComponent;
  let fixture: ComponentFixture<ViewResumeAiRatingDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewResumeAiRatingDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewResumeAiRatingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
