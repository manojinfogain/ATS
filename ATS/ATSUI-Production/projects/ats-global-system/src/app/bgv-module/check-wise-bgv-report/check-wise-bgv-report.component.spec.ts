import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckWiseBgvReportComponent } from './check-wise-bgv-report.component';

describe('CheckWiseBgvReportComponent', () => {
  let component: CheckWiseBgvReportComponent;
  let fixture: ComponentFixture<CheckWiseBgvReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckWiseBgvReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckWiseBgvReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
