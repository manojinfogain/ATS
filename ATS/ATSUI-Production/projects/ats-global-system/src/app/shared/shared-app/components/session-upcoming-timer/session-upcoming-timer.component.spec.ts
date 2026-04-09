import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionUpcomingTimerComponent } from './session-upcoming-timer.component';

describe('SessionUpcomingTimerComponent', () => {
  let component: SessionUpcomingTimerComponent;
  let fixture: ComponentFixture<SessionUpcomingTimerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionUpcomingTimerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionUpcomingTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
