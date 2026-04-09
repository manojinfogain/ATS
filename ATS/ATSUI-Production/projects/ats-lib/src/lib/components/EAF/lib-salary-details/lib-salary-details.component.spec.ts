import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibSalaryDetailsComponent } from './lib-salary-details.component';

describe('SalaryDetailsComponent', () => {
  let component: LibSalaryDetailsComponent;
  let fixture: ComponentFixture<LibSalaryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LibSalaryDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LibSalaryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
