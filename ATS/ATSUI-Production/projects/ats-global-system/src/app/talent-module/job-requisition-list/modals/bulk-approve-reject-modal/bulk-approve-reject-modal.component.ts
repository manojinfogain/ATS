import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { TalentService } from '../../../talent.service';

@Component({
  selector: 'app-bulk-approve-reject-modal',
  templateUrl: './bulk-approve-reject-modal.component.html',
  styleUrls: ['./bulk-approve-reject-modal.component.scss']
})
export class BulkApproveRejectModalComponent implements OnInit {

  @ViewChild('remarksField', { static: false }) remarksField!: ElementRef;

  public bulkActionForm: UntypedFormGroup;
  public actionType: 'approve' | 'reject';
  public selectedRecords: any[] = [];
  public recordCount: number = 0;
  public isSubmitting: boolean = false;
  public showValidationError: boolean = false;

  constructor(
    private _fb: UntypedFormBuilder,
    public dialogRef: MatDialogRef<BulkApproveRejectModalComponent>,
        private _talentServ: TalentService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.actionType = data.actionType || 'approve';
    this.selectedRecords = data.selectedRecords || [];
    this.recordCount = data.recordCount || 0;
  }

  ngOnInit(): void {
    this.initializeForm();
    this.setupFormSubscriptions();    
        this.getCancelTalentReasonCateg();
  }

  /**
   * Initialize the form
   */
  initializeForm(): void {
    this.bulkActionForm = this._fb.group({      
      reasonCategory: ['',[this.actionType === 'reject' ? Validators.required : Validators.nullValidator]],
      subReason: ['',[this.actionType === 'reject' ? Validators.required : Validators.nullValidator]],
      remarks: ['', [this.actionType === 'reject' ? Validators.required : Validators.nullValidator, Validators.minLength(10), Validators.maxLength(500)]]
    });
  }

  /**
   * Setup form subscriptions
   */
  setupFormSubscriptions(): void {
    // Clear validation error when user starts typing
    this.f.remarks.valueChanges.subscribe(() => {
      if (this.showValidationError) {
        this.showValidationError = false;
      }
    });
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
    return this.actionType === 'approve' ? 'Bulk Approve' : 'Bulk Reject';
  }

  /**
   * Get action button text
   */
  getActionButtonText(): string {
    return this.actionType === 'approve' ? 'Approve All' : 'Reject All';
  }

  /**
   * Get action icon
   */
  getActionIcon(): string {
    return this.actionType === 'approve' ? 'check_circle' : 'cancel';
  }

  /**
   * Get action color class
   */
  getActionColorClass(): string {
    return this.actionType === 'approve' ? 'approve-action' : 'reject-action';
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    // Reset validation error flag
    this.showValidationError = false;
    
    if (this.bulkActionForm.valid) {
      this.isSubmitting = true;
      
      const formData = {
        actionType: this.actionType,
        remarks: this.f.remarks.value.trim(),
        recordCount: this.recordCount,
        selectedRecords: this.selectedRecords,
        // reasonCategory: this.f.reasonCategory.value,
        subReason: this.f.subReason.value || null
      };

      // Close dialog and return the form data
      this.dialogRef.close(formData);
    } else {
      // Show validation error
      this.showValidationError = true;
      
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched();
      
      // Scroll to remarks field if it has errors
      if (this.f.remarks.invalid) {
        this.scrollToRemarksField();
      }
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
  private scrollToRemarksField(): void {
    setTimeout(() => {
      if (this.remarksField && this.remarksField.nativeElement) {
        // Scroll to the field
        this.remarksField.nativeElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
        // Focus the field
        this.remarksField.nativeElement.focus();
      }
    }, 150);
  }

  /**
   * Cancel and close dialog
   */
  onCancel(): void {
    this.dialogRef.close(null);
  }

  /**
   * Get character count for remarks
   */
  getRemarksCharacterCount(): number {
    return this.f.remarks.value?.length || 0;
  }

  /**
   * Check if remarks field has error
   */
  hasRemarksError(): boolean {
    const remarksControl = this.f.remarks;
    return remarksControl.invalid && (remarksControl.dirty || remarksControl.touched);
  }

  /**
   * Get remarks error message
   */
  getRemarksErrorMessage(): string {
    const remarksControl = this.f.remarks;
    
    if (remarksControl.hasError('required')) {
      return 'Remarks are required for bulk operations';
    }
    
    if (remarksControl.hasError('minlength')) {
      return 'Remarks must be at least 10 characters long';
    }
    
    if (remarksControl.hasError('maxlength')) {
      return 'Remarks cannot exceed 500 characters';
    }
    
    return '';
  }

  /**
   * Get validation error message for display at top of modal
   */
  getValidationErrorMessage(): string {
    if (this.f.remarks.hasError('required')) {
      return 'Please fill in the remarks field before submitting.';
    }
    
    if (this.f.remarks.hasError('minlength')) {
      return 'Remarks must be at least 10 characters long.';
    }
    
    return 'Please correct the validation errors before submitting.';
  }

  /**control */
  getControl(name: string) {
    return this.bulkActionForm.get(name);
  }

    getReasonCategId(data: any) {
    //let reasonCategFilteredData = this.reasonCategList.filter(x => x.ProjectID === data.value);
    //this.projData = reasonCategFilteredData[0];
    this.getCancelTalentReason(data?.value);
  }

  /**get cancel reason */
  public reasonList: any = [];
  getCancelTalentReason(id) {
    this._talentServ.cancelTalentReason(id).subscribe(
      res => {
        //  this.reasonList = res['data'];
        let filterById = [6];
        let dataRes = res['data'];
        let filterByStatus = dataRes.filter(t => {
          return filterById.indexOf(t.SubCateID) === -1;
        });
        this.reasonList = filterByStatus;
      }
    )
  }

   /**get cancel reason category */
  public reasonCategList: any = [];
  getCancelTalentReasonCateg() {
    this._talentServ.cancelTalentReasonCateg().subscribe(
      res => {
        // if (this.talentDetails?.ReqTypeID == 3) {
        //   let filterById = [1, 2, 3];
        //   let dataRes = res['data'];
        //   /**showing category Opportunity Lost - 1, Opportunity Scaled Down -2,  Requirement/Scope Change- 3 
        //    * for replacement type*/
        //   let filterByStatus = dataRes.filter(t => {
        //     return filterById.indexOf(t.CateID) === -1;
        //   });
          // this.reasonCategList = filterByStatus;
        // } else {
        //   //  this.reasonCategList = res['data'];
        //   let filterById = [5];
        //   let dataRes = res['data'];
        //   let filterByStatus = dataRes.filter(t => {
        //     return filterById.indexOf(t.CateID) === -1;
        //   });
          this.reasonCategList = res['data'];
        // }
      }
    )
  }

}