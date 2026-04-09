import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateWisePendingDocumentsReportComponent } from './candidate-wise-pending-documents-report.component';

describe('CandidateWisePendingDocumentsReportComponent', () => {
  let component: CandidateWisePendingDocumentsReportComponent;
  let fixture: ComponentFixture<CandidateWisePendingDocumentsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateWisePendingDocumentsReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateWisePendingDocumentsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
