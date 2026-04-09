import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenPositionReportDetailsComponent } from './open-position-report-details.component';

describe('OpenPositionReportDetailsComponent', () => {
  let component: OpenPositionReportDetailsComponent;
  let fixture: ComponentFixture<OpenPositionReportDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenPositionReportDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenPositionReportDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
