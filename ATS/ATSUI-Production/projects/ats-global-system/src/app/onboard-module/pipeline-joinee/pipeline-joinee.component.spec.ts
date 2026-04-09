import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PipelineJoineeComponent } from './pipeline-joinee.component';

describe('PipelineJoineeComponent', () => {
  let component: PipelineJoineeComponent;
  let fixture: ComponentFixture<PipelineJoineeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PipelineJoineeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PipelineJoineeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
