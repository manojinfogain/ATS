import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferApprovalScreenComponent } from './transfer-approval-screen.component';

describe('TransferApprovalScreenComponent', () => {
  let component: TransferApprovalScreenComponent;
  let fixture: ComponentFixture<TransferApprovalScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferApprovalScreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferApprovalScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
