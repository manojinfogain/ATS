import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeLatestControlComponent } from './grade-latest-control.component';

describe('GradeLatestControlComponent', () => {
  let component: GradeLatestControlComponent;
  let fixture: ComponentFixture<GradeLatestControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GradeLatestControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GradeLatestControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
