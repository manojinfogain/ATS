import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LibTrainingCoursesAttendedFormModalComponent } from './lib-training-courses-attended-form-modal.component';



describe('TrainingCoursesAttendedFormModalComponent', () => {
  let component: LibTrainingCoursesAttendedFormModalComponent;
  let fixture: ComponentFixture<LibTrainingCoursesAttendedFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LibTrainingCoursesAttendedFormModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LibTrainingCoursesAttendedFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
