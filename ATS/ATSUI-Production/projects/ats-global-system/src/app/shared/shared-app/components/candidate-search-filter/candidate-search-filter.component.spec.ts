import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateSearchFilterComponent } from './candidate-search-filter.component';

describe('CandidateSearchFilterComponent', () => {
  let component: CandidateSearchFilterComponent;
  let fixture: ComponentFixture<CandidateSearchFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateSearchFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateSearchFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
