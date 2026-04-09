import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateIdentityVerificationModalHrComponent } from './candidate-identity-verification-modal-hr.component';

describe('CandidateIdentityVerificationModalHrComponent', () => {
  let component: CandidateIdentityVerificationModalHrComponent;
  let fixture: ComponentFixture<CandidateIdentityVerificationModalHrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateIdentityVerificationModalHrComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateIdentityVerificationModalHrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
