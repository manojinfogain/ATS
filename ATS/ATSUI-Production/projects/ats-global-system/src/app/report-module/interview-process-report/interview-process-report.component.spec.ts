import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewProcessReportComponent } from './interview-process-report.component';

describe('InterviewProcessReportComponent', () => {
  let component: InterviewProcessReportComponent;
  let fixture: ComponentFixture<InterviewProcessReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterviewProcessReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterviewProcessReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
