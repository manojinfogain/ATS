import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryGridControlComponent } from './salary-grid-control.component';

describe('SalaryGridControlComponent', () => {
  let component: SalaryGridControlComponent;
  let fixture: ComponentFixture<SalaryGridControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalaryGridControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalaryGridControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
