import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewTypeControlComponent } from './interview-type-control.component';

describe('InterviewTypeControlComponent', () => {
  let component: InterviewTypeControlComponent;
  let fixture: ComponentFixture<InterviewTypeControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterviewTypeControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterviewTypeControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
