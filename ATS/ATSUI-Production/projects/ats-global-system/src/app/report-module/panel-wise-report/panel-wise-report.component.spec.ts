import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelWiseReportComponent } from './panel-wise-report.component';

describe('PanelWiseReportComponent', () => {
  let component: PanelWiseReportComponent;
  let fixture: ComponentFixture<PanelWiseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanelWiseReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelWiseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
