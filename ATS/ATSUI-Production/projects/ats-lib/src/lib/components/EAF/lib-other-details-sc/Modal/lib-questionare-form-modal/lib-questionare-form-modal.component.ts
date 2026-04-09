import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { LibCandidateService } from 'projects/ats-lib/src/lib/services/lib-candidate.service';
import { LibShareService } from 'projects/ats-lib/src/lib/services/lib-share.service';

@Component({
  selector: 'lib-questionare-form-modal',
  templateUrl: './lib-questionare-form-modal.component.html',
  styleUrls: ['./lib-questionare-form-modal.component.scss']
})
export class LibQuestionareFormModalComponent implements OnInit {
  public appearance: string = 'fill';
  public formClass: string = 'form-fill-ats'
  public questionareForm: UntypedFormGroup = new UntypedFormGroup({});
  public reqDetails: boolean = false;
  public apiBaseUrlCand:string = '';
  public apiBaseUrlMaster:string = '';
  constructor(
    public dialogRef: MatDialogRef<LibQuestionareFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: UntypedFormBuilder,
    private _candidateServe: LibCandidateService,
    private _share: LibShareService,
  ) { }

  ngOnInit(): void {
    this.apiBaseUrlCand = this.data?.apiBaseUrlCand;
    this.apiBaseUrlMaster = this.data?.apiBaseUrlMaster;
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
      this._candidateServe.updateQuestionareDetails(this.apiBaseUrlCand,this.data?.id, formValue).subscribe(
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
