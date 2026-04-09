import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryDeviationReportComponent } from './salary-deviation-report.component';

describe('SalaryDeviationReportComponent', () => {
  let component: SalaryDeviationReportComponent;
  let fixture: ComponentFixture<SalaryDeviationReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalaryDeviationReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalaryDeviationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
