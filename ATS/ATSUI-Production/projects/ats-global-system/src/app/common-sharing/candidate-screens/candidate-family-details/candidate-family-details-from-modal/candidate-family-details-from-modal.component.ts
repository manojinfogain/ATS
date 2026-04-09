import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';

@Component({
  selector: 'app-candidate-family-details-from-modal',
  templateUrl: './candidate-family-details-from-modal.component.html',
  styleUrls: ['./candidate-family-details-from-modal.component.scss']
})
export class CandidateFamilyDetailsFromModalComponent implements OnInit {
  public appearance: string = 'fill';
  public formClass: string = 'form-fill-ats'
  updateFamilyDetailsForm: UntypedFormGroup;
  constructor(
    public dialogRef: MatDialogRef<CandidateFamilyDetailsFromModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: UntypedFormBuilder,
    private _share: ShareService
  ) { }

  ngOnInit(): void {
    this.formInit();
  }

  /***
   * form Initialization
   */
  formInit() {
    this.updateFamilyDetailsForm = this._fb.group({
      relationship: [null, [Validators.required]],
      familyMemberName: [null, [Validators.required]],
      memberDob: [null, [Validators.required]],
      gender: [null, [Validators.required]],
      dependent: [null],
      occupation: [null],
      address: [null],
      minor: [null],
      guardianName: [null],
      guardianAddress: [null],
      organizatonName: [null],
      remarks: [null]
    })
  }

  get relationshipControl() { return this.updateFamilyDetailsForm.get('relationship'); }
  get familyMemberNameControl() { return this.updateFamilyDetailsForm.get('familyMemberName'); }
  get memberDobControl() { return this.updateFamilyDetailsForm.get('memberDob'); }
  get genderControl() { return this.updateFamilyDetailsForm.get('gender'); }
  get dependentControl() { return this.updateFamilyDetailsForm.get('dependent'); }
  get addressControl() { return this.updateFamilyDetailsForm.get('address'); }
  get minorControl() { return this.updateFamilyDetailsForm.get('minor'); }
  get guardianNameControl() { return this.updateFamilyDetailsForm.get('guardianName'); }
  get guardianAddressControl() { return this.updateFamilyDetailsForm.get('guardianAddress'); }
  get occupationControl() { return this.updateFamilyDetailsForm.get('occupation'); }
  get organizatonNameControl() { return this.updateFamilyDetailsForm.get('organizatonName'); }
  get remarksControl() { return this.updateFamilyDetailsForm.get('remarks'); }

  /***
   * submit form
   */
  submitForm(form: any) {
    form.markAllAsTouched();
    if (this.updateFamilyDetailsForm.valid) {
      console.log(form.value);
      this._share.showAlertSuccessMessage.next('Details Submitted Successfully');
    }
    else {
      this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
    }
  }

  /***
   * close modal
   */
  closeModal(): void {
    this.dialogRef.close();
  }
}
