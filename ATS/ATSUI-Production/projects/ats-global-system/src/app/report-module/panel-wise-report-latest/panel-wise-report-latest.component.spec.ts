import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelWiseReportLatestComponent } from './panel-wise-report-latest.component';

describe('PanelWiseReportLatestComponent', () => {
  let component: PanelWiseReportLatestComponent;
  let fixture: ComponentFixture<PanelWiseReportLatestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanelWiseReportLatestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelWiseReportLatestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
