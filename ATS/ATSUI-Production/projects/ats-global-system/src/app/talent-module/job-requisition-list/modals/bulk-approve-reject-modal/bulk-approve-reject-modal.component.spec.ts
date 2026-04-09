import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkApproveRejectModalComponent } from './bulk-approve-reject-modal.component';

describe('BulkApproveRejectModalComponent', () => {
  let component: BulkApproveRejectModalComponent;
  let fixture: ComponentFixture<BulkApproveRejectModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkApproveRejectModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BulkApproveRejectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});