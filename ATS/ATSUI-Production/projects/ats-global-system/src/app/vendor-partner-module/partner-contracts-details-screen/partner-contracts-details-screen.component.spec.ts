import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerContractsDetailsScreenComponent } from './partner-contracts-details-screen.component';

describe('PartnerContractsDetailsScreenComponent', () => {
  let component: PartnerContractsDetailsScreenComponent;
  let fixture: ComponentFixture<PartnerContractsDetailsScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartnerContractsDetailsScreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerContractsDetailsScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
