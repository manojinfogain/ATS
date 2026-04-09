import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeAgreementPreviewUsComponent } from './employee-agreement-preview-us.component';

describe('EmployeeAgreementPreviewUsComponent', () => {
  let component: EmployeeAgreementPreviewUsComponent;
  let fixture: ComponentFixture<EmployeeAgreementPreviewUsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeAgreementPreviewUsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeAgreementPreviewUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
