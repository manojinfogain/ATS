import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatePersonalDetailsComponent } from './candidate-personal-details.component';

describe('CandidatePersonalDetailsComponent', () => {
  let component: CandidatePersonalDetailsComponent;
  let fixture: ComponentFixture<CandidatePersonalDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidatePersonalDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidatePersonalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
