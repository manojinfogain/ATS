import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingCoursesAttendedFormModalComponent } from './training-courses-attended-form-modal.component';

describe('TrainingCoursesAttendedFormModalComponent', () => {
  let component: TrainingCoursesAttendedFormModalComponent;
  let fixture: ComponentFixture<TrainingCoursesAttendedFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainingCoursesAttendedFormModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingCoursesAttendedFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
