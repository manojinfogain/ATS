import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { ShareService } from '../../../core/services/share.service';
import { OfferService } from '../../offer.service';
import { GlobalApisService } from '../../../core/services/global-apis.service';
import { GlobalMethod } from '../../../core/common/global-method';

@Component({
  selector: 'app-us-send-offer-to-hr-modal',
  templateUrl: './us-send-offer-to-hr-modal.component.html',
  styleUrls: ['./us-send-offer-to-hr-modal.component.scss']
})
export class UsSendOfferToHrModalComponent implements OnInit {
  public userData: any = {};
  public sendOfferToHrForm: UntypedFormGroup;
  public FilterCtrlTagUS: UntypedFormControl = new UntypedFormControl();
  public searchInputTagUs: string;
  constructor(
    public dialogRef: MatDialogRef<UsSendOfferToHrModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: UntypedFormBuilder,
    private _share: ShareService,
    private _offerServe: OfferService,
    private _globalApiServe: GlobalApisService
  ) { }


  ngOnInit() {
    this.formInit();
    this.getUsHrList();
  }

  public usHrList: any = [];
  getUsHrList() {
    this._globalApiServe.GetUSHRList().subscribe(
      res => {
        this.usHrList = res['data']

      }
    )
  }

  /**form init */
  formInit() {
    this.sendOfferToHrForm = this._fb.group({
      hrApprover: [null, [Validators.required]],
      remarks: [null],
    })
  }


  /**send for approval */
  sendOfferToHrHandler(form: any) {
    if (this.sendOfferToHrForm.valid) {

      let formValue = form.value;
      // formValue['cid'] = this.data?.cid;
      let OfferAcceptDate = new Date();
      let OfferAcceptTime = OfferAcceptDate.getHours() + ':' + OfferAcceptDate.getMinutes() + ':' + OfferAcceptDate.getSeconds();
      let body = {
        cid: this.data?.cid,
        HRApprovalId: formValue['hrApprover'],
        Remark: formValue['remarks'],
        /*by ar 18jul-2024*/
        ActionDateUTC: GlobalMethod.convertToUTCDate(OfferAcceptDate),
        ActionOnTimeZone: GlobalMethod.getTimezone(),
        ActionOnOffsetDate: GlobalMethod.getOffset().toString()
      }
      //delete formValue['talendIdControl'];
      this._offerServe.AddUpdateHRApproval(body).subscribe(
        res => {
          this._share.showAlertSuccessMessage.next(res);
          // this.dialogRef.close(true);
          this.dialogRef.close({ type: 'A' });

        }
      )

    }
    else {
      this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
    }

  }




  /***
  * close dialog
  */
  closeModal(): void {
    this.dialogRef.close();
  }

}
