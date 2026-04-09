import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateInfoDialogComponent } from './candidate-info-dialog.component';

describe('CandidateInfoDialogComponent', () => {
  let component: CandidateInfoDialogComponent;
  let fixture: ComponentFixture<CandidateInfoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateInfoDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
