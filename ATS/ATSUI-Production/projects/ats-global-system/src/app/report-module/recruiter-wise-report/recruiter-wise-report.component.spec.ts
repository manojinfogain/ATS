import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruiterWiseReportComponent } from './recruiter-wise-report.component';

describe('RecruiterWiseReportComponent', () => {
  let component: RecruiterWiseReportComponent;
  let fixture: ComponentFixture<RecruiterWiseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecruiterWiseReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecruiterWiseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
