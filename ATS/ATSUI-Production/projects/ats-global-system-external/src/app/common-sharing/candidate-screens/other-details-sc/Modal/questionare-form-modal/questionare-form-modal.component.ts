import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { CandidateService } from 'projects/ats-global-system-external/src/app/candidate-module/candidate.service';
import { ShareService } from 'projects/ats-global-system-external/src/app/core/services/share.service';

@Component({
  selector: 'app-questionare-form-modal',
  templateUrl: './questionare-form-modal.component.html',
  styleUrls: ['./questionare-form-modal.component.scss']
})
export class QuestionareFormModalComponent implements OnInit {
  public appearance: string = 'fill';
  public formClass: string = 'form-fill-ats'
  public questionareForm: UntypedFormGroup = new UntypedFormGroup({});
  public reqDetails: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<QuestionareFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: UntypedFormBuilder,
    private _candidateServe: CandidateService,
    private _share: ShareService,
  ) { }

  ngOnInit(): void {
    this.formInit();
  }

  //get value of yes / no set validation
  getYesNo(event: any) {
    if (event?.value == 'Y') {
      this.reqDetails = true;
      this.detailsControl.setValidators([Validators.required]);
    }
    else {
      this.detailsControl.clearValidators();
      this.reqDetails = false;
    }
    this.detailsControl.updateValueAndValidity();
  }

  //init form
  formInit() {
    this.questionareForm = this._fb.group({
      yesNo: [this.data?.yesNo ? this.data?.yesNo : null],
      details: [this.data?.details ? this.data?.details : null],
    });
    if (this.data?.yesNo == 'Y') {
      this.reqDetails = true;
      this.detailsControl.setValidators([Validators.required]);
    }
    else {
      this.detailsControl.clearValidators();
      this.reqDetails = false;
    }
    this.detailsControl.updateValueAndValidity();
  }


  get yesNoControl() { return this.questionareForm.get('yesNo'); }
  get detailsControl() { return this.questionareForm.get('details'); }

  /***
   * update form- to server
   */
  updateQuestionareForm(form: any) {
    form.markAllAsTouched();
    if (this.questionareForm.valid) {
      let formValue = form.value;

      if (formValue['yesNo']) {
        formValue['yesNo'] = formValue.yesNo;
      }
      if (formValue['details']) {
        formValue['details'] = formValue.details;
      }
      if (this.data.questId) {
        formValue['questId'] = this.data.questId;
      }
      this._candidateServe.updateQuestionareDetails(this.data?.id, formValue).subscribe(
        res => {
          this._share.showAlertSuccessMessage.next(res)
        }
      )
      this.dialogRef.close(true);
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
