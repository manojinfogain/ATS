import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmploymentUnitTypeComponent } from './employment-unit-type.component';

describe('EmploymentUnitTypeComponent', () => {
  let component: EmploymentUnitTypeComponent;
  let fixture: ComponentFixture<EmploymentUnitTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmploymentUnitTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmploymentUnitTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
