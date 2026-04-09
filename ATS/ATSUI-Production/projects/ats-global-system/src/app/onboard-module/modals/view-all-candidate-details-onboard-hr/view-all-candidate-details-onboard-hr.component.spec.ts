import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllCandidateDetailsOnboardHrComponent } from './view-all-candidate-details-onboard-hr.component';

describe('ViewAllCandidateDetailsOnboardHrComponent', () => {
  let component: ViewAllCandidateDetailsOnboardHrComponent;
  let fixture: ComponentFixture<ViewAllCandidateDetailsOnboardHrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAllCandidateDetailsOnboardHrComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAllCandidateDetailsOnboardHrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
