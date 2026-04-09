import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIssPendingVerificationRemarksModalComponent } from './add-iss-pending-verification-remarks-modal.component';

describe('AddIssPendingVerificationRemarksModalComponent', () => {
  let component: AddIssPendingVerificationRemarksModalComponent;
  let fixture: ComponentFixture<AddIssPendingVerificationRemarksModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddIssPendingVerificationRemarksModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddIssPendingVerificationRemarksModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
