import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruiterWiseReportDetailsComponent } from './recruiter-wise-report-details.component';

describe('RecruiterWiseReportDetailsComponent', () => {
  let component: RecruiterWiseReportDetailsComponent;
  let fixture: ComponentFixture<RecruiterWiseReportDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecruiterWiseReportDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecruiterWiseReportDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
