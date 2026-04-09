import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateProfessionalReferenceFormModalComponent } from './candidate-professional-reference-form-modal.component';

describe('CandidateProfessionalReferenceFormModalComponent', () => {
  let component: CandidateProfessionalReferenceFormModalComponent;
  let fixture: ComponentFixture<CandidateProfessionalReferenceFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateProfessionalReferenceFormModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateProfessionalReferenceFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
