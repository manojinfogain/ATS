import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendForApprovalModalSupportComponent } from './send-for-approval-modal-support.component';

describe('SendForApprovalModalSupportComponent', () => {
  let component: SendForApprovalModalSupportComponent;
  let fixture: ComponentFixture<SendForApprovalModalSupportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendForApprovalModalSupportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendForApprovalModalSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
