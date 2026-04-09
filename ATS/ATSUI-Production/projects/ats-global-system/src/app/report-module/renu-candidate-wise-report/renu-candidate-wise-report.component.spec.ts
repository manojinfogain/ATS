import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenuCandidateWiseReportComponent } from './renu-candidate-wise-report.component';

describe('RenuCandidateWiseReportComponent', () => {
  let component: RenuCandidateWiseReportComponent;
  let fixture: ComponentFixture<RenuCandidateWiseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RenuCandidateWiseReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RenuCandidateWiseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
