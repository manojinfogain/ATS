import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateDropoutReportComponent } from './candidate-dropout-report.component';

describe('CandidateDropoutReportComponent', () => {
  let component: CandidateDropoutReportComponent;
  let fixture: ComponentFixture<CandidateDropoutReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateDropoutReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateDropoutReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
