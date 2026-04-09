import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateInterviewScheduleComponent } from './candidate-interview-schedule.component';

describe('CandidateInterviewScheduleComponent', () => {
  let component: CandidateInterviewScheduleComponent;
  let fixture: ComponentFixture<CandidateInterviewScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateInterviewScheduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateInterviewScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
