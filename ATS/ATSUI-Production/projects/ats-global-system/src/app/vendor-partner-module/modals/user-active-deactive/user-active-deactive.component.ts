import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { PartnerService } from '../../partner.service';

@Component({
  selector: 'app-user-active-deactive',
  templateUrl: './user-active-deactive.component.html',
  styleUrls: ['./user-active-deactive.component.scss']
})
export class UserActiveDeactiveComponent implements OnInit {
  public formActiveUser: UntypedFormGroup;
  constructor(
    public dialogRef: MatDialogRef<UserActiveDeactiveComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: UntypedFormBuilder,
    private _share: ShareService,
    private _partnerserve: PartnerService
  ) { }

  ngOnInit() {
    this.formActiveUser = this._fb.group({
      remarks: [null, [Validators.required]]
    })
  }

  /**
   * submit fom
   * @param form 
   */
  sumbitForm(form: any) {
    if (this.formActiveUser.valid) {
      let formValue = form.value;
      /***
       * if partner user
       */
      if(this.data?.type == 1){
        let param: string = `UserID=${this.data?.Id}&status=${this.data?.statusForUpdate}&Remarks=${formValue.remarks}`;
        this._partnerserve.updateStatusUserPartner(param).subscribe(
          res => {
            this._share.showAlertSuccessMessage.next(res);
            this.dialogRef.close(true);
          }
        )
      }
      /***
       * if vendor/partner
       */
      else if(this.data?.type == 2){
        let param: string = `PartnerID=${this.data?.PartnerID}&status=${this.data?.statusForUpdate}&Remarks=${formValue.remarks}`;
      this._partnerserve.updateStatusPartner(param).subscribe(
        res => {
          this._share.showAlertSuccessMessage.next(res);
          this.dialogRef.close(true);
        }
      )
      }

       /***
       * if talent id assign/unassign
       */
        else if(this.data?.type == 3){
          let param: string = `PartnerID=${this.data?.PartnerID}&status=${this.data?.statusForUpdate}&Remarks=${formValue.remarks}&thid=${this.data?.thid}`;
        this._partnerserve.updateStatusPartnerTalentID(param).subscribe(
          res => {
            this._share.showAlertSuccessMessage.next(res);
            this.dialogRef.close(true);
          }
        )
        }

         /***
       * if talent id assign/unassign
       */
          else if(this.data?.type == 4){
            console.log(this.data);
            if(this.data?.location == 'US'){
              let param1: string = `PartnerID=${this.data?.PartnerID}&status=${this.data?.statusForUpdate}&Remarks=${formValue.remarks}&id=${this.data?.id}`;
              this._partnerserve.candidateStatusUpdateByPartner(param1).subscribe(
                res => {
                  this._share.showAlertSuccessMessage.next(res);
                  this.dialogRef.close(true);
                }
              )
            }else{
              let param2: string = `PartnerId=${this.data?.PartnerID}&id=${this.data?.id}&status=${this.data?.statusForUpdate}&isCache=N&Remarks=${formValue.remarks}&cid=${this.data?.cid}`;
              this._partnerserve.candidateWithrawnByPartner(param2).subscribe(
                res => {
                  this._share.showAlertSuccessMessage.next(res);
                  this.dialogRef.close(true);
                }
              )
            }
          }
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
