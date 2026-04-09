import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalProfilesListComponent } from './approval-profiles-list.component';

describe('ApprovalProfilesListComponent', () => {
  let component: ApprovalProfilesListComponent;
  let fixture: ComponentFixture<ApprovalProfilesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovalProfilesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalProfilesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
