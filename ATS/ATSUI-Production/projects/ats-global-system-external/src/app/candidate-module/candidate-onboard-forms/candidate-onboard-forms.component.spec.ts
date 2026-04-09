import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateOnboardFormsComponent } from './candidate-onboard-forms.component';

describe('CandidateOnboardFormsComponent', () => {
  let component: CandidateOnboardFormsComponent;
  let fixture: ComponentFixture<CandidateOnboardFormsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateOnboardFormsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateOnboardFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
