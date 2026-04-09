import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { PanelSelfNominationService } from '../../../panel-self-nomination.service';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';


@Component({
  selector: 'app-panel-active-deactive',
  templateUrl: './panel-active-deactive.component.html',
  styleUrls: ['./panel-active-deactive.component.scss']
})
export class PanelActiveDeactiveComponent implements OnInit {
  public formActiveUser: UntypedFormGroup;
  constructor(
    public dialogRef: MatDialogRef<PanelActiveDeactiveComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: UntypedFormBuilder,
    private _share: ShareService,
    private  _PanelServe:PanelSelfNominationService
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
      let body = {
        Id: this.data?.Id,
        Status: this.data?.statusForUpdate,
        Remarks: formValue.remarks,
        ActionDateUTC: GlobalMethod.convertToUTCDate(new Date()),
        ActionTimeZone:GlobalMethod.getTimezone()
      };

      this._PanelServe.changePanelStatus(body).subscribe(
        res=>{
          this._share.showAlertSuccessMessage.next(res);
          this.dialogRef.close(true);
        }
      )
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
