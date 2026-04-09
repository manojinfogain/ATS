import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { OfferService } from 'projects/ats-global-system/src/app/offer-module/offer.service';

@Component({
  selector: 'app-revoke-delegate-rights-modal',
  templateUrl: './revoke-delegate-rights-modal.component.html',
  styleUrls: ['./revoke-delegate-rights-modal.component.scss']
})
export class RevokeDelegateRightsModalComponent implements OnInit {

  public formActiveUser: UntypedFormGroup;
  constructor(
    public dialogRef: MatDialogRef<RevokeDelegateRightsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: UntypedFormBuilder,
    private _share: ShareService,
    private _offerService: OfferService
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
      let param:String = `ID=${this.data.id}&Remarks=${formValue.remarks}`;
        this._offerService.revokeDelegation(param).subscribe(
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
