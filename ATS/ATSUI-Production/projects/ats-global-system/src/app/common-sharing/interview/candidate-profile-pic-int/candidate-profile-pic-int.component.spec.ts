import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateProfilePicIntComponent } from './candidate-profile-pic-int.component';

describe('CandidateProfilePicIntComponent', () => {
  let component: CandidateProfilePicIntComponent;
  let fixture: ComponentFixture<CandidateProfilePicIntComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateProfilePicIntComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateProfilePicIntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
