import { Component, OnInit, Inject } from '@angular/core';
import { GlobalMethod } from '../../../core/common/global-method';
import { GlobalApisService } from '../../../core/services/global-apis.service';
import { PartnerService } from '../../partner.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ShareService } from '../../../core/services/share.service';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-approv-reject-multi-contracts-modal',
  templateUrl: './approv-reject-multi-contracts-modal.component.html',
  styleUrls: ['./approv-reject-multi-contracts-modal.component.scss']
})
export class ApprovRejectMultiContractsModalComponent implements OnInit {
  public isloader: boolean = false;
  public approveMultiPartnerContractsForm: UntypedFormGroup = new UntypedFormGroup({});
  public talentHistoryList: any[];
  public minDate: any = new Date();
  public startEndDateReq: boolean = true;
  public EndDateReq: boolean = true;
  public readOnlyFields: boolean = false;
  public readOnlyEmail: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<ApprovRejectMultiContractsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public _share: ShareService,
    private _fb: UntypedFormBuilder,
    private __partnerServe: PartnerService,
    private _globalServe: GlobalApisService
  ) { }

  ngOnInit(): void {
    this.data;
    debugger
    this.formInit({});
  }


  formInit(data) {
    this.approveMultiPartnerContractsForm = this._fb.group({
      // ContractTypeID: [null, [Validators.required]],
      // ContractAvailability: [null, [Validators.required]],
      // StartDate: [null, [Validators.required]],
      // EndDate: [null, [Validators.required]],
      // status: [null],
      Remarks: [null]
    })
    if (this.data?.type == 'R') {
      this.getControl('Remarks').addValidators([Validators.required]);
    } else {
      this.getControl('Remarks').clearValidators();
    }
    this.getControl('Remarks').updateValueAndValidity();
  }


  onNoClick() {
    this.dialogRef.close();
  }
  getControl(name: string) {
    return this.approveMultiPartnerContractsForm.get(name);
  }
  public contactList: any = [];


  /**while approving checking approve or reject */
  statusChange(e: any) {
    if (e.value == 'R') {
      this.getControl('Remarks').setValidators([Validators.required]);
    } else {
      this.getControl('Remarks').clearValidators();
    }
    this.getControl('Remarks').updateValueAndValidity();
  }

  /**approve reject multi contract */
  approveRejectMultiContractHandle(form: any) {
    this.approveMultiPartnerContractsForm.markAllAsTouched();
    if (this.approveMultiPartnerContractsForm.valid) {
      let formValue = form.value;
      this.data['Remarks'] = formValue?.Remarks;
      // this.data['Decision'] = this.data?.type == 'A' ? 'approve' : 'reject';
      delete this.data['type'];
      this.dialogRef.close(this.data);
    } else {
      this._share.showAlertErrorMessage.next('Please fill all required fields');
    }

  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
