import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeWiseBgvReportComponent } from './employee-wise-bgv-report.component';

describe('EmployeeWiseBgvReportComponent', () => {
  let component: EmployeeWiseBgvReportComponent;
  let fixture: ComponentFixture<EmployeeWiseBgvReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeWiseBgvReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeWiseBgvReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
