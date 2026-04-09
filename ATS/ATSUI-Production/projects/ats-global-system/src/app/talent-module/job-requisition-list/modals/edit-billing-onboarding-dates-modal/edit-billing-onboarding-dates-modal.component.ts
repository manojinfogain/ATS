import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';

@Component({
  selector: 'app-edit-billing-onboarding-dates-modal',
  templateUrl: './edit-billing-onboarding-dates-modal.component.html',
  styleUrls: ['./edit-billing-onboarding-dates-modal.component.scss']
})
export class EditBillingOnboardingDatesModalComponent implements OnInit {

  // @ViewChild('remarksField', { static: false }) remarksField!: ElementRef;

  public bulkActionForm: UntypedFormGroup;
  public actionType: 'approve' | 'reject';
  public selectedRecords: any[] = [];
  public recordCount: number = 0;
  public isSubmitting: boolean = false;
  public showValidationError: boolean = false;
  public formClassCol: string = 'ats-form-col';
  public disablePastDate: Date = (() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight
    return today;
  })();
  public minDatebilling: any = new Date();

  constructor(
    private _fb: UntypedFormBuilder,
    public dialogRef: MatDialogRef<EditBillingOnboardingDatesModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.actionType = data.actionType || 'approve';
    this.selectedRecords = data.selectedRecords || [];
    this.recordCount = data.recordCount || 0;
  }

  ngOnInit(): void {
    this.data
    debugger
    this.initializeForm();
    this.setupFormSubscriptions();
  }

  /**
   * Initialize the form
   */
  initializeForm(): void {
    this.bulkActionForm = this._fb.group({
      plannedOnBoardingDate: [null,[Validators.required]],
      plannedBillingStartDate: [null, [this.data?.isBillableSelected == 'Y' ? Validators.required : Validators.nullValidator]],
      // remarks: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
    });
  }

  /**
   * Setup form subscriptions
   */
  setupFormSubscriptions(): void {
    // Clear validation error when user starts typing
    // this.f.remarks.valueChanges.subscribe(() => {
    //   if (this.showValidationError) {
    //     this.showValidationError = false;
    //   }
    // });
  }

  /**
   * Get form control for easy access
   */
  get f() {
    return this.bulkActionForm.controls;
  }

  /**
   * Get action title based on action type
   */
  getActionTitle(): string {
    return 'Bulk Update';
    // this.actionType === 'approve' ? 'Bulk Approve' : 'Bulk Reject';
  }

  /**
   * Get action button text
   */
  getActionButtonText(): string {
    return 'Update All';
  }

  /**
   * Get action icon
   */
  getActionIcon(): string {
    return 'check_circle';
  }

  /**
   * Get action color class
   */
  getActionColorClass(): string {
    return 'approve-action';
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    // Reset validation error flag
    this.showValidationError = false;

    if (this.bulkActionForm.valid) {
      this.isSubmitting = true;
      if(this.data?.isBillableSelected == 'Y'){
        const formData = {
          BILLING_DATE: GlobalMethod.formatDate(this.f.plannedBillingStartDate.value),
          BILLING_DATE_UTC: GlobalMethod.convertToUTCDate(this.f.plannedBillingStartDate.value),
          ONBOARDING_DATE: GlobalMethod.formatDate(this.f.plannedOnBoardingDate.value),
          ONBOARDING_DATE_UTC: GlobalMethod.convertToUTCDate(this.f.plannedOnBoardingDate.value),
          TimeZoneIana: GlobalMethod.getTimezone(),
          // remarks: this.f.remarks.value.trim(),
          recordCount: this.recordCount,
          selectedRecords: this.selectedRecords
        };
        // Close dialog and return the form data
        this.dialogRef.close(formData);
      }else{
        const formData = {
          // BILLING_DATE: GlobalMethod.formatDate(this.f.plannedBillingStartDate.value),
          // BILLING_DATE_UTC: GlobalMethod.convertToUTCDate(this.f.plannedBillingStartDate.value),
          ONBOARDING_DATE: GlobalMethod.formatDate(this.f.plannedOnBoardingDate.value),
          ONBOARDING_DATE_UTC: GlobalMethod.convertToUTCDate(this.f.plannedOnBoardingDate.value),
          TimeZoneIana: GlobalMethod.getTimezone(),
          // remarks: this.f.remarks.value.trim(),
          recordCount: this.recordCount,
          selectedRecords: this.selectedRecords
        };
        // Close dialog and return the form data
        this.dialogRef.close(formData);
      }
      
    } else {
      // Show validation error
      this.showValidationError = true;

      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched();

      // Scroll to remarks field if it has errors
      // if (this.f.remarks.invalid) {
      //   this.scrollToRemarksField();
      // }
    }
  }

  /**
   * Mark all form fields as touched
   */
  private markFormGroupTouched(): void {
    Object.keys(this.bulkActionForm.controls).forEach(key => {
      const control = this.bulkActionForm.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Scroll to remarks field when validation fails
   */
  // private scrollToRemarksField(): void {
  //   setTimeout(() => {
  //     if (this.remarksField && this.remarksField.nativeElement) {
  //       // Scroll to the field
  //       this.remarksField.nativeElement.scrollIntoView({
  //         behavior: 'smooth',
  //         block: 'center'
  //       });
  //       // Focus the field
  //       this.remarksField.nativeElement.focus();
  //     }
  //   }, 150);
  // }

  /**
   * Cancel and close dialog
   */
  onCancel(): void {
    this.dialogRef.close(null);
  }

  /**
   * Get character count for remarks
   */
  // getRemarksCharacterCount(): number {
  //   return this.f.remarks.value?.length || 0;
  // }

  /**
   * Check if remarks field has error
   */
  // hasRemarksError(): boolean {
  //   const remarksControl = this.f.remarks;
  //   return remarksControl.invalid && (remarksControl.dirty || remarksControl.touched);
  // }

  /**
   * Get remarks error message
   */
  // getRemarksErrorMessage(): string {
  //   const remarksControl = this.f.remarks;

  //   if (remarksControl.hasError('required')) {
  //     return 'Remarks are required for bulk operations';
  //   }

  //   if (remarksControl.hasError('minlength')) {
  //     return 'Remarks must be at least 10 characters long';
  //   }

  //   if (remarksControl.hasError('maxlength')) {
  //     return 'Remarks cannot exceed 500 characters';
  //   }

  //   return '';
  // }

  /**
   * Get validation error message for display at top of modal
   */
  // getValidationErrorMessage(): string {
  //   if (this.f.remarks.hasError('required')) {
  //     return 'Please fill in the remarks field before submitting.';
  //   }

  //   if (this.f.remarks.hasError('minlength')) {
  //     return 'Remarks must be at least 10 characters long.';
  //   }

  //   return 'Please correct the validation errors before submitting.';
  // }

  public isDateManuallyChangedOnb: boolean = false;
  changeDateOnb(type: string, event: any) {
    this.resetControl('plannedBillingStartDate');

    if (type === 'input') {
      this.isDateManuallyChangedOnb = true;

      const selectedDate = new Date(event.value);
      selectedDate.setHours(0, 0, 0, 0); // ✅ normalize

      const today = new Date();
      today.setHours(0, 0, 0, 0); // ✅ normalize

      this.minDatebilling = new Date(selectedDate); // set billing min date
      //  let requiremntType = this.getControl('requirementType').value;
      //  let isBillable = this.getControl('Billable').value;
      //  if(requiremntType != 5 && isBillable == 'Y'){
      //   this.addValidator('plannedBillingStartDate');

      //  }

      if ( selectedDate < today) {
        this.bulkActionForm.get('plannedOnBoardingDate')
            ?.setErrors({ pastDateNotAllowed: true });
      } else {
        this.bulkActionForm.get('plannedOnBoardingDate')?.setErrors(null);
      }
    }
  }

  /** date filter: exclude past dates and weekends (Sat/Sun) */
  excludePastAndWeekendDates = (d: Date): boolean => {
    const day = d?.getDay();

    // Normalize today's date to midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Normalize selected date
    const selected = new Date(d);
    selected.setHours(0, 0, 0, 0);

    // Disallow past dates and weekends
    return selected >= today && day !== 0 && day !== 6;
  }
  public isDateManuallyChangedBill: boolean = false;
  changeDateBilling(type: string, event: any) {
    if (type === 'input') {
      this.isDateManuallyChangedBill = true;

      const selectedDate = new Date(event.value);
      selectedDate.setHours(0, 0, 0, 0); // normalize

      const today = new Date();
      today.setHours(0, 0, 0, 0); // normalize

      if (selectedDate < today) {
        this.bulkActionForm
          .get('plannedBillingStartDate')
          ?.setErrors({ pastDateNotAllowed: true });
      } else {
        this.bulkActionForm
          .get('plannedBillingStartDate')
          ?.setErrors(null);
      }
    }
  }
  excludePastAndWeekendDatesBill = (d: Date | null): any => {
  if (!d) return false;

  const day = d.getDay();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selected = new Date(d);
  selected.setHours(0, 0, 0, 0);

  const existingValue = this.bulkActionForm.get('plannedBillingStartDate')?.value;
  const minDate = this.minDatebilling
    ? new Date(this.minDatebilling)
    : today; // fallback to today
  minDate.setHours(0, 0, 0, 0);

  // ✅ Allow existing past value if unchanged
  // if (this.isUpdateMode && !this.isDateManuallyChangedBill && existingValue) {
  //   const normalizedExisting = new Date(existingValue);
  //   normalizedExisting.setHours(0, 0, 0, 0);
  //   if (selected.getTime() === normalizedExisting.getTime()) {
  //     return true;
  //   }
  // }

  // ✅ Enforce: billing date must be on or after onboarding date (minDatebilling)
  // ✅ Also ensure: weekday & not before today
  return selected >= minDate && day !== 0 && day !== 6;
}
/**method for reset value */
  resetControl(name: string) {
    let ctrl = this.getControl(name);
    ctrl?.reset();
  }
  /**control */
  getControl(name: string) {
    return this.bulkActionForm.get(name);
  }
  /**method for add validators */
    addValidator(name: string) {
      let ctrl = this.getControl(name);
      //  ctrl.setValidators([Validators.required]);
      ctrl.setValidators([Validators.required]);
      ctrl.updateValueAndValidity();
    }
}