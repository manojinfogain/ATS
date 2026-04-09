import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveRequestPartnerProfilesTransferComponent } from './approve-request-partner-profiles-transfer.component';

describe('ApproveRequestPartnerProfilesTransferComponent', () => {
  let component: ApproveRequestPartnerProfilesTransferComponent;
  let fixture: ComponentFixture<ApproveRequestPartnerProfilesTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveRequestPartnerProfilesTransferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveRequestPartnerProfilesTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
