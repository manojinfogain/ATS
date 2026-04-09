import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCoderbyteReportComponent } from './view-coderbyte-report.component';

describe('ViewCoderbyteReportComponent', () => {
  let component: ViewCoderbyteReportComponent;
  let fixture: ComponentFixture<ViewCoderbyteReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCoderbyteReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCoderbyteReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
