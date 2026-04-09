import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenPositionReportComponent } from './open-position-report.component';

describe('OpenPositionReportComponent', () => {
  let component: OpenPositionReportComponent;
  let fixture: ComponentFixture<OpenPositionReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenPositionReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenPositionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
