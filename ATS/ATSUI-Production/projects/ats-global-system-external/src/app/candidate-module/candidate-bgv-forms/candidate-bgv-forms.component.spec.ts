import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateBgvFormsComponent } from './candidate-bgv-forms.component';

describe('CandidateBgvFormsComponent', () => {
  let component: CandidateBgvFormsComponent;
  let fixture: ComponentFixture<CandidateBgvFormsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateBgvFormsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateBgvFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
