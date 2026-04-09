import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateJobPositionModalComponent } from './create-job-position-modal.component';

describe('CreateJobPositionModalComponent', () => {
  let component: CreateJobPositionModalComponent;
  let fixture: ComponentFixture<CreateJobPositionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateJobPositionModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateJobPositionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
