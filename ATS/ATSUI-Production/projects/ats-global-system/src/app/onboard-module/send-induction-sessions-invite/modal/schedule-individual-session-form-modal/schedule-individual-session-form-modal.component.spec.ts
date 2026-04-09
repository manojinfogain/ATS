import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleIndividualSessionFormModalComponent } from './schedule-individual-session-form-modal.component';

describe('ScheduleIndividualSessionFormModalComponent', () => {
  let component: ScheduleIndividualSessionFormModalComponent;
  let fixture: ComponentFixture<ScheduleIndividualSessionFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduleIndividualSessionFormModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleIndividualSessionFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
