import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateVerificationReportComponent } from './candidate-verification-report.component';

describe('CandidateVerificationReportComponent', () => {
  let component: CandidateVerificationReportComponent;
  let fixture: ComponentFixture<CandidateVerificationReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateVerificationReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateVerificationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
