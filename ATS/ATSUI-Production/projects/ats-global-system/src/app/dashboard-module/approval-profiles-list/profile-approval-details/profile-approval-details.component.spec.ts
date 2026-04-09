import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileApprovalDetailsComponent } from './profile-approval-details.component';

describe('ProfileApprovalDetailsComponent', () => {
  let component: ProfileApprovalDetailsComponent;
  let fixture: ComponentFixture<ProfileApprovalDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileApprovalDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileApprovalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
