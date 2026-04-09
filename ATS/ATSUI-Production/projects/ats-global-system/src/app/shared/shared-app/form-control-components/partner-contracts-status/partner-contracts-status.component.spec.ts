import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerContractsStatusComponent } from './partner-contracts-status.component';

describe('PartnerContractsStatusComponent', () => {
  let component: PartnerContractsStatusComponent;
  let fixture: ComponentFixture<PartnerContractsStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartnerContractsStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerContractsStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
