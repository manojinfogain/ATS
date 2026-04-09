import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateSearchIntComponent } from './candidate-search-int.component';

describe('CandidateSearchIntComponent', () => {
  let component: CandidateSearchIntComponent;
  let fixture: ComponentFixture<CandidateSearchIntComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateSearchIntComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateSearchIntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
