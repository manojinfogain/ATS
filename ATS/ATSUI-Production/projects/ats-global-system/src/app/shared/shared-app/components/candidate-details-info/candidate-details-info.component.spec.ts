import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateDetailsInfoComponent } from './candidate-details-info.component';

describe('CandidateDetailsInfoComponent', () => {
  let component: CandidateDetailsInfoComponent;
  let fixture: ComponentFixture<CandidateDetailsInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateDetailsInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateDetailsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
