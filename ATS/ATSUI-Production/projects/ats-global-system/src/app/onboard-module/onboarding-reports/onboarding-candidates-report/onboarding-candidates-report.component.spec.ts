import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingCandidatesReportComponent } from './onboarding-candidates-report.component';

describe('OnboardingCandidatesReportComponent', () => {
  let component: OnboardingCandidatesReportComponent;
  let fixture: ComponentFixture<OnboardingCandidatesReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardingCandidatesReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingCandidatesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
