import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveTransferRequestByRecruiterModalComponent } from './approve-transfer-request-by-recruiter-modal.component';

describe('ApproveTransferRequestByRecruiterModalComponent', () => {
  let component: ApproveTransferRequestByRecruiterModalComponent;
  let fixture: ComponentFixture<ApproveTransferRequestByRecruiterModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveTransferRequestByRecruiterModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveTransferRequestByRecruiterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
