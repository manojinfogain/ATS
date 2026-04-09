import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LibCandidateProfessionalReferenceFormModalComponent } from './lib-candidate-pro-ref-form-modal.component';


describe('CandidateProfessionalReferenceFormModalComponent', () => {
  let component: LibCandidateProfessionalReferenceFormModalComponent;
  let fixture: ComponentFixture<LibCandidateProfessionalReferenceFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LibCandidateProfessionalReferenceFormModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LibCandidateProfessionalReferenceFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
