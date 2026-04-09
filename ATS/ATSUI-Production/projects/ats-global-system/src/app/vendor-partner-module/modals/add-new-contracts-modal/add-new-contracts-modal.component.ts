import { Component, Inject, OnInit } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { ShareService } from '../../../core/services/share.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { GlobalMethod } from '../../../core/common/global-method';
import { PartnerService } from '../../partner.service';
import { GlobalApisService } from '../../../core/services/global-apis.service';

@Component({
  selector: 'app-add-new-contracts-modal',
  templateUrl: './add-new-contracts-modal.component.html',
  styleUrls: ['./add-new-contracts-modal.component.scss']
})
export class AddNewContractsModalComponent implements OnInit {
  public isloader: boolean = false;
  public addPartnerContractsForm: UntypedFormGroup = new UntypedFormGroup({});
  public talentHistoryList: any[];
  public minDate: any = new Date();
  public startEndDateReq: boolean = true;
  public EndDateReq: boolean = true;
  public readOnlyFields: boolean = false;
  public readOnlyEmail: boolean = false;
  public isContractEndDateUpdate: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<AddNewContractsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public _share: ShareService,
    private _fb: UntypedFormBuilder,
    private __partnerServe: PartnerService,
    private _globalServe: GlobalApisService
  ) { }

  ngOnInit(): void {
    this.formInit({});
    this.getContractList();
  }


  formInit(data) {
    this.addPartnerContractsForm = this._fb.group({
      ContractTypeID: [null, [Validators.required]],
      ContractAvailability: [null, [Validators.required]],
      StartDate: [null, [Validators.required]],
      EndDate: [null, [Validators.required]],
      status: [null],
      Remarks: [null]
    })
    /**P for pending/ U for Update / S for resend rejected for approval/ N for new */
    if (this.data?.type == 'P') {
      this.getControl('status').addValidators([Validators.required]);
      this.setDefaultValues(this.data);
      this.isContractEndDateUpdate = false;
    }
    else if (this.data?.type == 'U') {
      this.getControl('status').clearValidators();
      this.setDefaultValues(this.data);
      this.isContractEndDateUpdate = true;
    }
    else if (this.data?.type == 'S') {
      this.getControl('status').clearValidators();
      this.setDefaultValues(this.data);
      this.isContractEndDateUpdate = false;
    }
    else {
      this.getControl('status').clearValidators();
      this.isContractEndDateUpdate = false;
    }
    this.getControl('status').updateValueAndValidity();


  }

  setDefaultValues(data: any) {
    this.addPartnerContractsForm.patchValue({
      ContractTypeID: data?.ContractTypeID ? data?.ContractTypeID : null,
      ContractAvailability: data?.ContractAvailability ? data?.ContractAvailability : null,
      StartDate: data?.StartDate ? data?.StartDate : null,
      EndDate: data?.EndDate ? data?.EndDate : null,
      // status: this.data?.status ? this.data?.status : null,
      // Remarks: this.data?.Remarks ? this.data?.Remarks : null
    })

    // let abc ={};
    // abc['value'] = data?.ContractAvailability;
    // this.contractHandler(abc);
    if (this.data?.ContractAvailability == 'N') {
      this.getControl('StartDate').clearValidators();
      this.getControl('EndDate').clearValidators();

    } else {
      this.getControl('StartDate').addValidators([Validators.required]);
      this.getControl('EndDate').addValidators([Validators.required]);
    }
    this.getControl('StartDate').updateValueAndValidity();
    this.getControl('EndDate').updateValueAndValidity();
  }

  //   * change date
  //  */
  changeDate(type: string, event: any) {
    this.addPartnerContractsForm.get('EndDate').reset();
    this.minDate = new Date(event.value);
  }
  //radio btn for contract
  contractHandler(val: any) {
    let startDate = new Date();
    let endDate = new Date(new Date().setMonth(new Date().getMonth() + 3));

    if (val.value == "Y") {
      this.addPartnerContractsForm.get('StartDate').reset();
      this.addPartnerContractsForm.get('EndDate').reset();
      this.getControl('StartDate').addValidators([Validators.required]);
      this.getControl('EndDate').addValidators([Validators.required]);
    } else {
      // this.getControl('StartDate').clearValidators();
      // this.getControl('EndDate').clearValidators();
      this.addPartnerContractsForm.get('StartDate').patchValue(startDate);
      this.addPartnerContractsForm.get('EndDate').patchValue(endDate);
    }
    this.getControl('StartDate').updateValueAndValidity();
    this.getControl('EndDate').updateValueAndValidity();
  }

  onNoClick() {
    this.dialogRef.close();
  }
  getControl(name: string) {
    return this.addPartnerContractsForm.get(name);
  }
  public contactList: any = [];

  getContractList() {
    this._globalServe.GetContractTypes().subscribe(
      res => {
       // this.contactList = res['data'];
        // this.locationWiseContracList();
        /**removed Direct Contract for india */
        this.contactList = res['data'].filter(item => item.ID !== 1);

      }
    )
  }
  /**while approving checking approve or reject */
  statusChange(e: any) {
    if (e.value == 'R') {
      this.getControl('Remarks').setValidators([Validators.required]);
    } else {
      this.getControl('Remarks').clearValidators();
    }
    this.getControl('Remarks').updateValueAndValidity();
  }

  /**submit to add new contract */
  addNewContractToPartnerHandle(form: any) {
    this.addPartnerContractsForm.markAllAsTouched();
    if (form.valid) {
      let formData = form.value;
      let formBody = {};
      /**for approval/reject api */

      if (this.data?.type == 'P') {
        formBody['ContractTypeID'] = formData?.ContractTypeID;
        formBody['Action'] = formData?.status;
        formBody['ContId'] = this.data?.ContractId;
        formBody['Remarks'] = formData?.Remarks;
        formBody['ContractAvailability'] = formData?.ContractAvailability;
        formBody['StartDate'] = formData.StartDate ? GlobalMethod.formatDate(formData.StartDate) : null,
          formBody['EndDate'] = formData.EndDate ? GlobalMethod.formatDate(formData.EndDate) : null,
          this.approveSingleContractUodate(formBody);
      }
      /**U for Update  */
      else if (this.data?.type == 'U') {
        formBody['ContractTypeID'] = this.data?.ContractTypeID;
        formBody['ContId'] = this.data?.ContractId;
        formBody['ContractAvailability'] = this.data?.ContractAvailability;
        formBody['StartDate'] = this.data?.StartDate ? GlobalMethod.formatDate(this.data?.StartDate) : null,
          formBody['EndDate'] = formData.EndDate ? GlobalMethod.formatDate(formData.EndDate) : null,
          this.updateContractEndDate(formBody);
      }
      /**s for resend for approval */
      else if (this.data?.type == 'S') {
        //  formBody['Action'] = formData?.status;
        formBody['ContractTypeID'] = this.data?.ContractTypeID;
        formBody['ID'] = this.data?.ContractId;
        formBody['Remarks'] = formData?.Remarks;
        formBody['ContractAvailability'] = formData?.ContractAvailability;
        formBody['StartDate'] = formData.StartDate ? GlobalMethod.formatDate(formData.StartDate) : null,
          formBody['EndDate'] = formData.EndDate ? GlobalMethod.formatDate(formData.EndDate) : null,
          delete formBody['Partnerid'];
        this.ResendContractforApproval(formBody);
      }
      /**new contract  */
      else if (this.data?.type == 'N') {
        formBody['Partnerid'] = this.data?.PartnerID;
        formBody['ContractTypeID'] = formData.ContractTypeID;
        formBody['ContractAvailability'] = formData?.ContractAvailability;
        formBody['StartDate'] = formData.StartDate ? GlobalMethod.formatDate(formData.StartDate) : null,
          formBody['EndDate'] = formData.EndDate ? GlobalMethod.formatDate(formData.EndDate) : null,
          this.__partnerServe.AddNewContractToPartner(formBody).subscribe(
            res => {
              this._share.showAlertSuccessMessage.next(res);
              this.dialogRef.close(true);

            }
          )
      }
      else {
        this._share.showAlertErrorMessage.next('Cannot proccess this request at this time.');

      }

    }
    else {
      this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
    }

  }

  /**approve contracts */
  approveSingleContractUodate(formData) {
    this.__partnerServe.SingleApproveRejectContractofPartner(formData).subscribe(
      res => {
        this._share.showAlertSuccessMessage.next(res);
        this.dialogRef.close(true);

      }
    )
  }

  /** update contract end date*/
  updateContractEndDate(formBody: any) {

    debugger
    // let formData = form.value;
    // let FormVal =
    // {
    //   ContId: this.data?.id,
    //   ContractTypeID: formData.ContractTypeID,
    //   ContractAvailability: formData.ContractAvailability,
    //   StartDate: GlobalMethod.formatDate(formData.StartDate),
    //   EndDate: GlobalMethod.formatDate(formData.EndDate),
    // };
    this.__partnerServe.UpdatepartnerContractDetail(formBody).subscribe(
      res => {
        this._share.showAlertSuccessMessage.next(res);
        this.dialogRef.close(true);

      }
    )
  }
  /** Resend Contract for Approval contract end date*/
  ResendContractforApproval(formBody: any) {
    //  let queryString = `contId=${formBody.ContId}&Partnerid=${formBody.Partnerid}`;
    this.__partnerServe.ResendContractforApproval(formBody).subscribe(
      res => {
        this._share.showAlertSuccessMessage.next(res);
        this.dialogRef.close(true);

      }
    )
  }


  closeModal(): void {
    this.dialogRef.close();
  }

}
