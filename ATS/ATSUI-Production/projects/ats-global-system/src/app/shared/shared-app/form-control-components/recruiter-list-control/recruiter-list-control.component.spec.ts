import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruiterListControlComponent } from './recruiter-list-control.component';

describe('RecruiterListControlComponent', () => {
  let component: RecruiterListControlComponent;
  let fixture: ComponentFixture<RecruiterListControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecruiterListControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecruiterListControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
