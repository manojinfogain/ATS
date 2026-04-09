import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBillingOnboardingDatesModalComponent } from './edit-billing-onboarding-dates-modal.component';

describe('EditBillingOnboardingDatesModalComponent', () => {
  let component: EditBillingOnboardingDatesModalComponent;
  let fixture: ComponentFixture<EditBillingOnboardingDatesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditBillingOnboardingDatesModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBillingOnboardingDatesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
