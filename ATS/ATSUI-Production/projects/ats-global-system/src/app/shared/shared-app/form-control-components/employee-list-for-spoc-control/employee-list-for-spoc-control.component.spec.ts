import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeListForSpocControlComponent } from './employee-list-for-spoc-control.component';

describe('EmployeeListForSpocControlComponent', () => {
  let component: EmployeeListForSpocControlComponent;
  let fixture: ComponentFixture<EmployeeListForSpocControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeListForSpocControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeListForSpocControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
