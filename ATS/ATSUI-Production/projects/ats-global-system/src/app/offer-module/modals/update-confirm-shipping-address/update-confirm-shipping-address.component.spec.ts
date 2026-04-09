import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateConfirmShippingAddressComponent } from './update-confirm-shipping-address.component';

describe('UpdateConfirmShippingAddressComponent', () => {
  let component: UpdateConfirmShippingAddressComponent;
  let fixture: ComponentFixture<UpdateConfirmShippingAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateConfirmShippingAddressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateConfirmShippingAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
