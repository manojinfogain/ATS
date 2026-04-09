import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { GlobalApisService } from '../../../core/services/global-apis.service';
import { PartnerService } from '../../partner.service';
import { ShareService } from '../../../core/services/share.service';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-approver-reffere-remarks-modal',
  templateUrl: './approver-reffere-remarks-modal.component.html',
  styleUrls: ['./approver-reffere-remarks-modal.component.scss']
})
export class ApproverReffereRemarksModalComponent implements OnInit {
  public partnerStatusForm: UntypedFormGroup = new UntypedFormGroup({});
  public searchInput: string;
  constructor(
    public dialogRef: MatDialogRef<ApproverReffereRemarksModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: UntypedFormBuilder,
    private _share: ShareService,
    private _partnerServe: PartnerService,
    private _globalServe: GlobalApisService
  ) { }

  ngOnInit(): void {
    this.data;
    
    this.formInit();
  }
  public FilterCtrlTAG: UntypedFormControl = new UntypedFormControl();
  public tagHeadList: any = [];

  formInit() {
    this.partnerStatusForm = this._fb.group({
      //  Action: [null],
      Remarks: [null]
    })

    if (this.data?.type == 'A') {
      this.getControl('Remarks').clearValidators();
    }
    else {
      this.getControl('Remarks').setValidators([Validators.required]);
    }
    this.getControl('Remarks').updateValueAndValidity();
  }

  /***
   * get Control
   */
  getControl(name: string) {
    return this.partnerStatusForm.get(name);
  }

  /**
   * approve/reject
   * @param form 
   */
  approveRejected(form: UntypedFormGroup) {
    form.markAllAsTouched();
    if (form.valid) {
      let formData = form.value;
      //formData['AssignID'] = this.data?.formIds;

      if (this.data?.type == 'A') {
        formData['Action'] = 'A';
      } else if (this.data?.type == 'R') {
        formData['Action'] = 'R';
      }
      
      this._partnerServe.UpdatePartnerTHIDAssignStatus(formData).subscribe(
        res => {
          this._share.showAlertSuccessMessage.next(res);
          this.dialogRef.close(true);
        }
      );
    }
    else {
      this._share.showAlertErrorMessage.next('Please Enter Remarks.');
    }
  }

  /***
   * close Modal
   */
  closeModal(): void {
    this.dialogRef.close();
  }

}
