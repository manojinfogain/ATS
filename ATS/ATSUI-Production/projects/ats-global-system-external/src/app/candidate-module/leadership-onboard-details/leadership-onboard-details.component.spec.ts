import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadershipOnboardDetailsComponent } from './leadership-onboard-details.component';

describe('LeadershipOnboardDetailsComponent', () => {
  let component: LeadershipOnboardDetailsComponent;
  let fixture: ComponentFixture<LeadershipOnboardDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadershipOnboardDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadershipOnboardDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
