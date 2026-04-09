import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateOfferReportComponent } from './candidate-offer-report.component';

describe('CandidateOfferReportComponent', () => {
  let component: CandidateOfferReportComponent;
  let fixture: ComponentFixture<CandidateOfferReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateOfferReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateOfferReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
