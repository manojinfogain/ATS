import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { DashboardService } from '../../dashboard.service';

@Component({
  selector: 'app-screen-reject-modal',
  templateUrl: './screen-reject-modal.component.html',
  styleUrls: ['./screen-reject-modal.component.scss']
})
export class ScreenRejectModalComponent implements OnInit {
  public formActiveUser: UntypedFormGroup;
  constructor(
    public dialogRef: MatDialogRef<ScreenRejectModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: UntypedFormBuilder,
    private _share: ShareService,
    public _dashServe: DashboardService
  ) { }

  ngOnInit() {
    this.formActiveUser = this._fb.group({
      remarks: [null, [Validators.required]]
    })
  }

  /**
   * submit old method form
   * @param form 
   */
  sumbitForm(form: any) {
    if (this.formActiveUser.valid) {
      let formValue = form.value;
      let param:String = `id=${this.data.id}&Remarks=${formValue.remarks}&screenRejected=${this.data?.isScreenRejected === 1?0:1}`;
      //emp ref unmap
      if(this.data.type === 1){
        this._dashServe.unmapEmpRefScreenReject(param).subscribe(
          res=>{
            this._share.showAlertSuccessMessage.next(res);
            this.dialogRef.close(true);  
          }
        );
      }
      //partner profile
     else if(this.data.type === 2){
        this._dashServe.partnerScreenReject(param).subscribe(
          res=>{
            this._share.showAlertSuccessMessage.next(res);
            this.dialogRef.close(true);  
          }
        );
      }
      //cskill profile
      else{
        this._dashServe.cskillScreenReject(param).subscribe(
          res=>{
            this._share.showAlertSuccessMessage.next(res);
            this.dialogRef.close(true);  
          }
        );
      }
    }
    else {
      this._share.showAlertErrorMessage.next('Please enter Remarks.');
    }

  }

  /**active new method */
  sumbitActiveForm(form: any) {
    debugger
    if (this.formActiveUser.valid) {
      let formValue = form.value;
      let param:String = `id=${this.data.pId}&Remarks=${formValue.remarks}&profileTypeId=${this.data?.profileId}&IsFromNaukriAPI=${this.data?.IsFromNaukriAPI ? this.data?.IsFromNaukriAPI : 'N'}${this.data?.ApplicantUid ? '&ApplicantUid='+this.data?.ApplicantUid : ''}`;
        this._dashServe.activeCandidateScreenReject(param).subscribe(
          res=>{
            this._share.showAlertSuccessMessage.next(res);
            this.dialogRef.close(true);  
          }
        );  
    }
    else {
      this._share.showAlertErrorMessage.next('Please enter Remarks.');
    }

  }




  /***
  * close dialog
  */
  closeModal(): void {
    this.dialogRef.close();
  }
}
