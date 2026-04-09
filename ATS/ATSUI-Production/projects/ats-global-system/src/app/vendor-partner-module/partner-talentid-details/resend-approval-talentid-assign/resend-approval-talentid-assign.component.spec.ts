import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResendApprovalTalentidAssignComponent } from './resend-approval-talentid-assign.component';

describe('ResendApprovalTalentidAssignComponent', () => {
  let component: ResendApprovalTalentidAssignComponent;
  let fixture: ComponentFixture<ResendApprovalTalentidAssignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResendApprovalTalentidAssignComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResendApprovalTalentidAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
