import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateOnboardVerificationListComponent } from './candidate-onboard-verification-list.component';

describe('CandidateOnboardVerificationListComponent', () => {
  let component: CandidateOnboardVerificationListComponent;
  let fixture: ComponentFixture<CandidateOnboardVerificationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateOnboardVerificationListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateOnboardVerificationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
