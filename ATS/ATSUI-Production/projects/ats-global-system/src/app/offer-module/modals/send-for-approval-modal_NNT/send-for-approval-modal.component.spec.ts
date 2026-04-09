import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendForApprovalModalComponent } from './send-for-approval-modal.component';

describe('SendForApprovalModalComponent', () => {
  let component: SendForApprovalModalComponent;
  let fixture: ComponentFixture<SendForApprovalModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendForApprovalModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendForApprovalModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
