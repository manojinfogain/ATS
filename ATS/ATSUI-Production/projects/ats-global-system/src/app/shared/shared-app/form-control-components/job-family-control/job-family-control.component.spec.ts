import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobFamilyControlComponent } from './job-family-control.component';

describe('JobFamilyControlComponent', () => {
  let component: JobFamilyControlComponent;
  let fixture: ComponentFixture<JobFamilyControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobFamilyControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobFamilyControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
