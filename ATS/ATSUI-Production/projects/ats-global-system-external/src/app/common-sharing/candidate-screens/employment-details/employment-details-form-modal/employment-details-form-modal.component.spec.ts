import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmploymentDetailsFormModalComponent } from './employment-details-form-modal.component';

describe('EmploymentDetailsFormModalComponent', () => {
  let component: EmploymentDetailsFormModalComponent;
  let fixture: ComponentFixture<EmploymentDetailsFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmploymentDetailsFormModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmploymentDetailsFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
