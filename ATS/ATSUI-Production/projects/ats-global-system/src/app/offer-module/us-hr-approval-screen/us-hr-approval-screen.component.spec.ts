import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsHrApprovalScreenComponent } from './us-hr-approval-screen.component';

describe('UsHrApprovalScreenComponent', () => {
  let component: UsHrApprovalScreenComponent;
  let fixture: ComponentFixture<UsHrApprovalScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsHrApprovalScreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsHrApprovalScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
