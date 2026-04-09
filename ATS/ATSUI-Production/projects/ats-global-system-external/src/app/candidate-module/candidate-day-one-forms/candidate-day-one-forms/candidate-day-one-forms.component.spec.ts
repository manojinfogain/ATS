import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateDayOneFormsComponent } from './candidate-day-one-forms.component';

describe('CandidateDayOneFormsComponent', () => {
  let component: CandidateDayOneFormsComponent;
  let fixture: ComponentFixture<CandidateDayOneFormsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateDayOneFormsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateDayOneFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
