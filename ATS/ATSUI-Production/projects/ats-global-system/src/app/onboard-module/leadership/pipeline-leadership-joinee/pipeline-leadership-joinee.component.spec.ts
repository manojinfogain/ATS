import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PipelineLeadershipJoineeComponent } from './pipeline-leadership-joinee.component';

describe('PipelineLeadershipJoineeComponent', () => {
  let component: PipelineLeadershipJoineeComponent;
  let fixture: ComponentFixture<PipelineLeadershipJoineeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PipelineLeadershipJoineeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PipelineLeadershipJoineeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
