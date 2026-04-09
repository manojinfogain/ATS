import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibTrainingCoursesAttendedComponent } from './lib-training-courses-attended.component';

describe('TrainingCoursesAttendedComponent', () => {
  let component: LibTrainingCoursesAttendedComponent;
  let fixture: ComponentFixture<LibTrainingCoursesAttendedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LibTrainingCoursesAttendedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LibTrainingCoursesAttendedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
