import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';

@Component({
  selector: 'app-candidate-education-details-form-modal',
  templateUrl: './candidate-education-details-form-modal.component.html',
  styleUrls: ['./candidate-education-details-form-modal.component.scss']
})
export class CandidateEducationDetailsFormModalComponent implements OnInit {
  public appearance: string = 'fill';
  public formClass: string = 'form-fill-ats'
  updateEduDetailsForm: UntypedFormGroup;
  constructor(
    public dialogRef: MatDialogRef<CandidateEducationDetailsFormModalComponent>,
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
    this.updateEduDetailsForm = this._fb.group({
      category: [null, [Validators.required]],
      // duration: [null, [Validators.required]],
      dateFrom: [null, [Validators.required]],
      dateTo: [null, [Validators.required]],
      yearOfPassing: [null, [Validators.required]],
      collegeName: [null, [Validators.required]],
      boardName: [null, [Validators.required]],
      specialization: [null, [Validators.required]],
      educationType: [null],
      level: [null],
      grade: [null, [Validators.required]],
      gradePercent: [null, [Validators.required]],
      sponsored: [null],
      discipline: [null],
      minorFields: [null],
      majorFields: [null]
    })
  }

  get categoryControl() { return this.updateEduDetailsForm.get('category'); }
  get dateFromControl() { return this.updateEduDetailsForm.get('dateFrom'); }
  get dateToControl() { return this.updateEduDetailsForm.get('dateTo'); }
  get yearOfPassingControl() { return this.updateEduDetailsForm.get('yearOfPassing'); }
  get collegeNameControl() { return this.updateEduDetailsForm.get('collegeName'); }
  get boardNameControl() { return this.updateEduDetailsForm.get('boardName'); }
  get specializationControl() { return this.updateEduDetailsForm.get('specialization'); }
  get educationTypeControl() { return this.updateEduDetailsForm.get('educationType'); }
  get levelControl() { return this.updateEduDetailsForm.get('level'); }
  get gradeControl() { return this.updateEduDetailsForm.get('grade'); }
  get gradePercentControl() { return this.updateEduDetailsForm.get('gradePercent'); }
  get sponsoredControl() { return this.updateEduDetailsForm.get('sponsored'); }
  get disciplineControl() { return this.updateEduDetailsForm.get('discipline'); }
  get minorFieldsControl() { return this.updateEduDetailsForm.get('minorFields'); }
  get majorFieldsControl() { return this.updateEduDetailsForm.get('majorFields'); }

  /***
   * submit form
   */
  submitForm(form: any) {
    form.markAllAsTouched();
    if (this.updateEduDetailsForm.valid) {
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
