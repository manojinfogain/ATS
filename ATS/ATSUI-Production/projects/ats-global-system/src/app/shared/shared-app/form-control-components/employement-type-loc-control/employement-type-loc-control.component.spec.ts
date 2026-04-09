import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployementTypeLocControlComponent } from './employement-type-loc-control.component';

describe('EmployementTypeLocControlComponent', () => {
  let component: EmployementTypeLocControlComponent;
  let fixture: ComponentFixture<EmployementTypeLocControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployementTypeLocControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployementTypeLocControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
