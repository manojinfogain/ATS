import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingAddresConfirmationStatusReportComponent } from './shipping-addres-confirmation-status-report.component';

describe('ShippingAddresConfirmationStatusReportComponent', () => {
  let component: ShippingAddresConfirmationStatusReportComponent;
  let fixture: ComponentFixture<ShippingAddresConfirmationStatusReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShippingAddresConfirmationStatusReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShippingAddresConfirmationStatusReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
