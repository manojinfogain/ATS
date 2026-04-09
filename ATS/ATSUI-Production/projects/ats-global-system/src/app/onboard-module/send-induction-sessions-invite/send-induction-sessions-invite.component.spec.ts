import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendInductionSessionsInviteComponent } from './send-induction-sessions-invite.component';

describe('SendInductionSessionsInviteComponent', () => {
  let component: SendInductionSessionsInviteComponent;
  let fixture: ComponentFixture<SendInductionSessionsInviteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendInductionSessionsInviteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendInductionSessionsInviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
