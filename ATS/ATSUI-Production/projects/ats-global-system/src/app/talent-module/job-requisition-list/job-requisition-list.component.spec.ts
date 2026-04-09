import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobRequisitionListComponent } from './job-requisition-list.component';

describe('JobRequisitionListComponent', () => {
  let component: JobRequisitionListComponent;
  let fixture: ComponentFixture<JobRequisitionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobRequisitionListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobRequisitionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
