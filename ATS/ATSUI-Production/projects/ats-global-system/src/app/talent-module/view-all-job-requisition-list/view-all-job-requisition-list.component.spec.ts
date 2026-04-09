import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllJobRequisitionListComponent } from './view-all-job-requisition-list.component';

describe('ViewAllJobRequisitionListComponent', () => {
  let component: ViewAllJobRequisitionListComponent;
  let fixture: ComponentFixture<ViewAllJobRequisitionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAllJobRequisitionListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAllJobRequisitionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
