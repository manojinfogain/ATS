import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewInvitedRecruitersListModalComponent } from './view-invited-recruiters-list-modal.component';

describe('ViewInvitedRecruitersListModalComponent', () => {
  let component: ViewInvitedRecruitersListModalComponent;
  let fixture: ComponentFixture<ViewInvitedRecruitersListModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewInvitedRecruitersListModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewInvitedRecruitersListModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
