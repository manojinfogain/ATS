import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateEducationDetailsComponent } from './candidate-education-details.component';

describe('CandidateEducationDetailsComponent', () => {
  let component: CandidateEducationDetailsComponent;
  let fixture: ComponentFixture<CandidateEducationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateEducationDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateEducationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
