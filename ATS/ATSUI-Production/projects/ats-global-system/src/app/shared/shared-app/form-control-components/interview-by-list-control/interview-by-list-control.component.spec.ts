import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewByListControlComponent } from './interview-by-list-control.component';

describe('InterviewByListControlComponent', () => {
  let component: InterviewByListControlComponent;
  let fixture: ComponentFixture<InterviewByListControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterviewByListControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterviewByListControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
