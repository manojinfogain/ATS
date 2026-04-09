import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendInductionSessionsInviteModalComponent } from './send-induction-sessions-invite-modal.component';

describe('SendInductionSessionsInviteModalComponent', () => {
  let component: SendInductionSessionsInviteModalComponent;
  let fixture: ComponentFixture<SendInductionSessionsInviteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendInductionSessionsInviteModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendInductionSessionsInviteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
