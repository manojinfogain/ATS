import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproverReffereRemarksModalComponent } from './approver-reffere-remarks-modal.component';

describe('ApproverReffereRemarksModalComponent', () => {
  let component: ApproverReffereRemarksModalComponent;
  let fixture: ComponentFixture<ApproverReffereRemarksModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproverReffereRemarksModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproverReffereRemarksModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
