import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingCoursesAttendedComponent } from './training-courses-attended.component';

describe('TrainingCoursesAttendedComponent', () => {
  let component: TrainingCoursesAttendedComponent;
  let fixture: ComponentFixture<TrainingCoursesAttendedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainingCoursesAttendedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingCoursesAttendedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
