import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibEmploymentDetailsFormModalComponent } from './lib-employment-details-form-modal.component';

describe('EmploymentDetailsFormModalComponent', () => {
  let component: LibEmploymentDetailsFormModalComponent;
  let fixture: ComponentFixture<LibEmploymentDetailsFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LibEmploymentDetailsFormModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LibEmploymentDetailsFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
