import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiringTrackerReportComponent } from './hiring-tracker-report.component';

describe('HiringTrackerReportComponent', () => {
  let component: HiringTrackerReportComponent;
  let fixture: ComponentFixture<HiringTrackerReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HiringTrackerReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HiringTrackerReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
