import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { PartnerService } from '../../partner.service';

@Component({
  selector: 'app-parner-status-form-modal',
  templateUrl: './parner-status-form-modal.component.html',
  styleUrls: ['./parner-status-form-modal.component.scss']
})
export class ParnerStatusFormModalComponent implements OnInit {
  public partnerStatusForm: UntypedFormGroup = new UntypedFormGroup({});
  constructor(
    public dialogRef: MatDialogRef<ParnerStatusFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: UntypedFormBuilder,
    private _share: ShareService,
    private _partnerServe: PartnerService,
  ) { }

  ngOnInit(): void {
    this.formInit();
  }

  formInit() {
    // if(this.data){
    //   if(this.data?.status == '1'){
    //      this.data['status'] = 'A';
    //   }
    //   if(this.data?.status == '0'){
    //     this.data['status'] = 'I';
    //   }
    // }
    this.partnerStatusForm = this._fb.group({
      Status: [this.data?.PartnerStatus, [Validators.required]],
      Remarks: [null, [Validators.required]]
    })
    this.partnerStatusForm.patchValue({ 
      Status: this.data?.PartnerStatus.toString()
    })
  }

  /**
   * update partner profile
   * @param form 
   */
  UpdateProfile(form: UntypedFormGroup) {
    form.markAllAsTouched();
    if (form.valid) {
      let formValue = form.value;  
      let param: string = `PartnerID=${this.data?.PartnerID}&status=${formValue?.Status}&Remarks=${formValue.Remarks}`;
      this._partnerServe.updateStatusPartner(param).subscribe(
        res => {
          this._share.showAlertSuccessMessage.next(res);
          this.dialogRef.close(true);
        }
      )
    }
    else {
      this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
    }
  }

  closeModal(): void {
    this.dialogRef.close();
  }

}
