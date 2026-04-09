import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCheckWiseReportHistoryComponent } from './view-check-wise-report-history.component';

describe('ViewCheckWiseReportHistoryComponent', () => {
  let component: ViewCheckWiseReportHistoryComponent;
  let fixture: ComponentFixture<ViewCheckWiseReportHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCheckWiseReportHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCheckWiseReportHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
