import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualPipelineMailModalComponent } from './manual-pipeline-mail-modal.component';

describe('ManualPipelineMailModalComponent', () => {
  let component: ManualPipelineMailModalComponent;
  let fixture: ComponentFixture<ManualPipelineMailModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManualPipelineMailModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualPipelineMailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
