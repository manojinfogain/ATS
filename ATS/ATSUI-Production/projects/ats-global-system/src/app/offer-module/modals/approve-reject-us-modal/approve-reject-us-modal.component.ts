import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { OfferService } from '../../offer.service';
import { ShareService } from '../../../core/services/share.service';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { GlobalMethod } from '../../../core/common/global-method';

@Component({
  selector: 'app-approve-reject-us-modal',
  templateUrl: './approve-reject-us-modal.component.html',
  styleUrls: ['./approve-reject-us-modal.component.scss']
})
export class ApproveRejectUsModalComponent implements OnInit {

  public userData: any = {};
  public approveRejectForm: UntypedFormGroup;
  constructor(
    public dialogRef: MatDialogRef<ApproveRejectUsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: UntypedFormBuilder,
    private _share: ShareService,
    private _offerServe: OfferService
  ) { }

  ngOnInit() {
    this.formInit();
  }

  formInit() {
    this.approveRejectForm = this._fb.group({
      actionTaken: [null, [Validators.required]],
      remarks: [null],
    })
  }

  getControl(name: string) {
    return this.approveRejectForm.get(name);
  }

  /**submit form */
  submitApproveRejectForm(form: any) {
    this.approveRejectForm.markAllAsTouched();
    if (this.approveRejectForm.valid) {
      let formValue = form.value;
    //  formValue['cid'] = this.data?.cid;
      let OfferAcceptDate = new Date();
      let OfferAcceptTime = OfferAcceptDate.getHours() + ':' + OfferAcceptDate.getMinutes() + ':' + OfferAcceptDate.getSeconds();
      let body = {
        cid: this.data?.cid,
        ActionTaken: formValue['actionTaken'],
        Remark: formValue['remarks'],
        /*by ar 19jul-2024*/
        ModifiedOnUTC: GlobalMethod.convertToUTCDate(OfferAcceptDate),
        ModifiedOnTimeZone: GlobalMethod.getTimezone(),
        ModifiedOnOffsetDate: GlobalMethod.getOffset().toString(),
      }
      this._offerServe.ApprovReferrbackByUsHR(body).subscribe(
        res => {
          this._share.showAlertSuccessMessage.next(res);
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
