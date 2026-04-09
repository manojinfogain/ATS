import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PipelineCandidateHistoryComponent } from './pipeline-candidate-history.component';

describe('PipelineCandidateHistoryComponent', () => {
  let component: PipelineCandidateHistoryComponent;
  let fixture: ComponentFixture<PipelineCandidateHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PipelineCandidateHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PipelineCandidateHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
