import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerMultiContractsFieldsComponent } from './partner-multi-contracts-fields.component';

describe('PartnerMultiContractsFieldsComponent', () => {
  let component: PartnerMultiContractsFieldsComponent;
  let fixture: ComponentFixture<PartnerMultiContractsFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartnerMultiContractsFieldsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerMultiContractsFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
