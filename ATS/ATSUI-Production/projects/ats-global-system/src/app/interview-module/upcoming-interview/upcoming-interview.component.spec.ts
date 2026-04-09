import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcomingInterviewComponent } from './upcoming-interview.component';

describe('UpcomingInterviewComponent', () => {
  let component: UpcomingInterviewComponent;
  let fixture: ComponentFixture<UpcomingInterviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpcomingInterviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpcomingInterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
