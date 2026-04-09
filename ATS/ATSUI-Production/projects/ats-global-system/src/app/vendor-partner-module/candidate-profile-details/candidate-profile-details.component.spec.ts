import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateProfileDetailsComponent } from './candidate-profile-details.component';

describe('CandidateProfileDetailsComponent', () => {
  let component: CandidateProfileDetailsComponent;
  let fixture: ComponentFixture<CandidateProfileDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateProfileDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateProfileDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
