import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TalentInterviewersListControlComponent } from './talent-interviewers-list-control.component';

describe('TalentInterviewersListControlComponent', () => {
  let component: TalentInterviewersListControlComponent;
  let fixture: ComponentFixture<TalentInterviewersListControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TalentInterviewersListControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TalentInterviewersListControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
