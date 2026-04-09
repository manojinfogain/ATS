import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerCandidateTransferRequestComponent } from './partner-candidate-transfer-request.component';

describe('PartnerCandidateTransferRequestComponent', () => {
  let component: PartnerCandidateTransferRequestComponent;
  let fixture: ComponentFixture<PartnerCandidateTransferRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartnerCandidateTransferRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerCandidateTransferRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
