import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerProfilesDirectTransferModalComponent } from './partner-profiles-direct-transfer-modal.component';

describe('PartnerProfilesDirectTransferModalComponent', () => {
  let component: PartnerProfilesDirectTransferModalComponent;
  let fixture: ComponentFixture<PartnerProfilesDirectTransferModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartnerProfilesDirectTransferModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerProfilesDirectTransferModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
