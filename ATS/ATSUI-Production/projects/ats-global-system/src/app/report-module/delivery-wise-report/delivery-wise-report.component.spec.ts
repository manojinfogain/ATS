import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryWiseReportComponent } from './delivery-wise-report.component';

describe('DeliveryWiseReportComponent', () => {
  let component: DeliveryWiseReportComponent;
  let fixture: ComponentFixture<DeliveryWiseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveryWiseReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryWiseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
