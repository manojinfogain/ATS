import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllCandidateDetailsOnboardComponent } from './view-all-candidate-details-onboard.component';

describe('ViewAllCandidateDetailsOnboardComponent', () => {
  let component: ViewAllCandidateDetailsOnboardComponent;
  let fixture: ComponentFixture<ViewAllCandidateDetailsOnboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAllCandidateDetailsOnboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAllCandidateDetailsOnboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
