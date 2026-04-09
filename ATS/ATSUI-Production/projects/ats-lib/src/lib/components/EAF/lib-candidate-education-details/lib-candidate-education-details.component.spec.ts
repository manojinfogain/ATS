import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibCandidateEducationDetailsComponent } from './lib-candidate-education-details.component';

describe('CandidateEducationDetailsComponent', () => {
  let component: LibCandidateEducationDetailsComponent;
  let fixture: ComponentFixture<LibCandidateEducationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LibCandidateEducationDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LibCandidateEducationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
