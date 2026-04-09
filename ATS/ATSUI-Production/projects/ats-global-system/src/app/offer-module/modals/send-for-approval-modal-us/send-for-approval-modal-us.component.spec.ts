import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendForApprovalModalUsComponent } from './send-for-approval-modal-us.component';

describe('SendForApprovalModalUsComponent', () => {
  let component: SendForApprovalModalUsComponent;
  let fixture: ComponentFixture<SendForApprovalModalUsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendForApprovalModalUsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendForApprovalModalUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
