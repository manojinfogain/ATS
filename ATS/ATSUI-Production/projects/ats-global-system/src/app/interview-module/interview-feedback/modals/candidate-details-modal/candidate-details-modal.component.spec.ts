import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateDetailsModalComponent } from './candidate-details-modal.component';

describe('CandidateDetailsModalComponent', () => {
  let component: CandidateDetailsModalComponent;
  let fixture: ComponentFixture<CandidateDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateDetailsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
