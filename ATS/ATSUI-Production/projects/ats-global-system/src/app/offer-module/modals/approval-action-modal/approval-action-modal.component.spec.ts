import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalActionModalComponent } from './approval-action-modal.component';

describe('ApprovalActionModalComponent', () => {
  let component: ApprovalActionModalComponent;
  let fixture: ComponentFixture<ApprovalActionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovalActionModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalActionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
