import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendAssesmentToCandidateModalComponent } from './send-assesment-to-candidate-modal.component';

describe('SendAssesmentToCandidateModalComponent', () => {
  let component: SendAssesmentToCandidateModalComponent;
  let fixture: ComponentFixture<SendAssesmentToCandidateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendAssesmentToCandidateModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendAssesmentToCandidateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
