import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateStatusControlComponent } from './candidate-status-control.component';

describe('CandidateStatusControlComponent', () => {
  let component: CandidateStatusControlComponent;
  let fixture: ComponentFixture<CandidateStatusControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateStatusControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateStatusControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
