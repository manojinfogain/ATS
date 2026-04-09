import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentsControlComponent } from './departments-control.component';

describe('DepartmentsControlComponent', () => {
  let component: DepartmentsControlComponent;
  let fixture: ComponentFixture<DepartmentsControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepartmentsControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentsControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
