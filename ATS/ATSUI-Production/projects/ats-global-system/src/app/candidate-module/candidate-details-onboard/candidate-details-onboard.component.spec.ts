import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateDetailsOnboardComponent } from './candidate-details-onboard.component';

describe('CandidateDetailsOnboardComponent', () => {
  let component: CandidateDetailsOnboardComponent;
  let fixture: ComponentFixture<CandidateDetailsOnboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateDetailsOnboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateDetailsOnboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
