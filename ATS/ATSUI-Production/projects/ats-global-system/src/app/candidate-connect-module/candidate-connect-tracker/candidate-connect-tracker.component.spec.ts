import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateConnectTrackerComponent } from './candidate-connect-tracker.component';

describe('CandidateConnectTrackerComponent', () => {
  let component: CandidateConnectTrackerComponent;
  let fixture: ComponentFixture<CandidateConnectTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateConnectTrackerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateConnectTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
