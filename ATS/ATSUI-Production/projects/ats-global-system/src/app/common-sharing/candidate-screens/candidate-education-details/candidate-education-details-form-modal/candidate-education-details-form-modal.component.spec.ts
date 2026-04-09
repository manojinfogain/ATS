import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateEducationDetailsFormModalComponent } from './candidate-education-details-form-modal.component';

describe('CandidateEducationDetailsFormModalComponent', () => {
  let component: CandidateEducationDetailsFormModalComponent;
  let fixture: ComponentFixture<CandidateEducationDetailsFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateEducationDetailsFormModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateEducationDetailsFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
