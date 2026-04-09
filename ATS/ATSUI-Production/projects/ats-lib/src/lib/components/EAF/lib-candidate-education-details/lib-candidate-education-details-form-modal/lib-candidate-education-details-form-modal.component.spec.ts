import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibCandidateEducationDetailsFormModalComponent } from './lib-candidate-education-details-form-modal.component';

describe('CandidateEducationDetailsFormModalComponent', () => {
  let component: LibCandidateEducationDetailsFormModalComponent;
  let fixture: ComponentFixture<LibCandidateEducationDetailsFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LibCandidateEducationDetailsFormModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LibCandidateEducationDetailsFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
