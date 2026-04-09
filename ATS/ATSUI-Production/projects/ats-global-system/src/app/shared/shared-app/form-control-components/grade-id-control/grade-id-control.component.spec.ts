import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeIdControlComponent } from './grade-id-control.component';

describe('GradeIdControlComponent', () => {
  let component: GradeIdControlComponent;
  let fixture: ComponentFixture<GradeIdControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GradeIdControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GradeIdControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
