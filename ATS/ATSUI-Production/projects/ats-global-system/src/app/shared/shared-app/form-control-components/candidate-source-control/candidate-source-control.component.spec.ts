import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateSourceControlComponent } from './candidate-source-control.component';

describe('CandidateSourceControlComponent', () => {
  let component: CandidateSourceControlComponent;
  let fixture: ComponentFixture<CandidateSourceControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateSourceControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateSourceControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
