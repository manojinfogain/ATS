import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeReferalReportComponent } from './employee-referal-report.component';

describe('EmployeeReferalReportComponent', () => {
  let component: EmployeeReferalReportComponent;
  let fixture: ComponentFixture<EmployeeReferalReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeReferalReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeReferalReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
