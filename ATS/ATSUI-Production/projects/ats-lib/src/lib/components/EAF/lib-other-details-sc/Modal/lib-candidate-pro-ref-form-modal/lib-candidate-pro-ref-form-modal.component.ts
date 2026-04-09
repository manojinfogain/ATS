

import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { LIBCOMMON_CONST } from 'projects/ats-lib/src/lib/core/constant/lib-common.const';
import { LibCandidateService } from 'projects/ats-lib/src/lib/services/lib-candidate.service';
import { LibShareService } from 'projects/ats-lib/src/lib/services/lib-share.service';

@Component({
  selector: 'lib-candidate-professional-reference-form-modal',
  templateUrl: './lib-candidate-pro-ref-form-modal.component.html',
  styleUrls: ['./lib-candidate-pro-ref-form-modal.component.scss']
})
export class LibCandidateProfessionalReferenceFormModalComponent implements OnInit {
  public appearance: string = 'fill';
  public formClass: string = 'form-fill-ats'
  public professioanalReferencesForm: UntypedFormGroup = new UntypedFormGroup({});
  public apiBaseUrlCand:string = '';
  public apiBaseUrlMaster:string = '';
  constructor(
    public dialogRef: MatDialogRef<LibCandidateProfessionalReferenceFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: UntypedFormBuilder,
    private _candidateServe: LibCandidateService,
    private _share: LibShareService
  ) { }

  ngOnInit(): void {
    this.apiBaseUrlCand = this.data?.apiBaseUrlCand;
    this.apiBaseUrlMaster = this.data?.apiBaseUrlMaster;
    this.formInit();
  }

  //init form
  formInit() {
    this.professioanalReferencesForm = this._fb.group({
      Name: [this.data?.name ? this.data?.name : null, [Validators.required]],
      Designation: [this.data?.designation ? this.data?.designation : null, [Validators.required]],
      Mobile: [this.data?.phone ? this.data?.phone : null, [Validators.required,Validators.minLength(10),Validators.maxLength(10)]],
      Organization: [this.data?.orgName ? this.data?.orgName : null, [Validators.required]],
      Email: [this.data?.email ? this.data?.email : null, [Validators.required,Validators.pattern(LIBCOMMON_CONST.emailregex)]],
    })
  }

  //get control name
  getControl(name: string) {
    return this.professioanalReferencesForm.get(name);
  }
  
  /***
   * update professional references form- to server
   */
  updateProfRefForm(form: any) {
    form.markAllAsTouched();
    if (this.professioanalReferencesForm.valid) {
      let formValue = form?.value;
      if (formValue['Name']) {
        formValue['Name'] = formValue?.Name;
      }
      if (formValue['Email']) {
        formValue['Email'] = formValue?.Email;
      }
      if (formValue['Mobile']) {
        formValue['Mobile'] = formValue?.Mobile;
      }
      if (formValue['Organization']) {
        formValue['Organization'] = formValue?.Organization;
      }
      if (formValue['Designation']) {
        formValue['Designation'] = formValue?.Designation;
      }
      this._candidateServe.updateProfRefDetails(this.apiBaseUrlCand,this.data?.id, formValue).subscribe(
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
