import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateDay1FormsDocComponent } from './candidate-day1-forms-doc.component';

describe('CandidateDay1FormsDocComponent', () => {
  let component: CandidateDay1FormsDocComponent;
  let fixture: ComponentFixture<CandidateDay1FormsDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateDay1FormsDocComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateDay1FormsDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
