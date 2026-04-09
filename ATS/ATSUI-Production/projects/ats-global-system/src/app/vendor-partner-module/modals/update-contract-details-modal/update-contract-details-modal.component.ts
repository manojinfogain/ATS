import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { ShareService } from '../../../core/services/share.service';
import { PartnerService } from '../../partner.service';
import { GlobalMethod } from '../../../core/common/global-method';

@Component({
  selector: 'app-update-contract-details-modal',
  templateUrl: './update-contract-details-modal.component.html',
  styleUrls: ['./update-contract-details-modal.component.scss']
})
export class UpdateContractDetailsModalComponent implements OnInit {

  public formUpdateContract: UntypedFormGroup;

  public disablePastDate: any = new Date(new Date().setDate(new Date().getDate()));
  public minDate: any = new Date();
  constructor(
    public dialogRef: MatDialogRef<UpdateContractDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: UntypedFormBuilder,
    private _share: ShareService,
    private __partnerServe: PartnerService
  ) { }

  ngOnInit() {
    this.formInit();
  }
  public isContractAvailibityNo: boolean = false;
  formInit() {
    this.formUpdateContract = this._fb.group({
      ContractTypeID: [this.data?.contaractTypeId, [Validators.required]],
      ContractAvailability: [this.data?.contractAvailabitily, [Validators.required]],
      StartDate: [this.data?.startDate, [Validators.required]],
      EndDate: [this.data?.endDate, [Validators.required]],
    });
    this.getControl('StartDate').disable();
    //this.contractHandler(this.getControl('ContractAvailability').value);
    // if(this.getControl('ContractAvailability').value == 'N'){
    //   this.isContractAvailibityNo = true;
    // }else{
    //   this.isContractAvailibityNo = false;
    // }
  }

  getControl(name: string) {
    return this.formUpdateContract.get(name);
  }

  /**on change of contract availibility */
  public isDateRequired: boolean = false;
  contractHandler(val: any) {
    let startDate = new Date();
    let endDate = new Date(new Date().setMonth(new Date().getMonth() + 3));

    if (val.value == "Y") {
      this.isDateRequired = true;
      this.getControl('StartDate').reset();
      this.getControl('EndDate').reset();

      this.getControl('StartDate').addValidators([Validators.required]);
      this.getControl('EndDate').addValidators([Validators.required]);

    } else {
      // this.getControl('StartDate').clearValidators();
      // this.getControl('EndDate').clearValidators();
      this.getControl('StartDate').patchValue(startDate);
      this.getControl('EndDate').patchValue(endDate);
      this.isDateRequired = false;
    }
    this.getControl('StartDate').updateValueAndValidity();
    this.getControl('EndDate').updateValueAndValidity();
  }
  //   * change date
  //  */
  changeDate(event: any) {
    this.getControl('EndDate').reset();
    this.minDate = new Date(event.value);
  }

  /** submit fulfilment*/
  updateEndDateHandler(form: any) {
    this.formUpdateContract.markAllAsTouched();
    if (form.valid) {
      let formData = form.value;
      let FormVal =
      {
        ContId: this.data?.id,
        ContractTypeID: formData.ContractTypeID,
        ContractAvailability: formData.ContractAvailability,
        StartDate: this.data?.startDate ?  GlobalMethod.formatDate(this.data?.startDate): null,
        EndDate: formData.EndDate ? GlobalMethod.formatDate(formData.EndDate): null,
      };
      this.__partnerServe.UpdatepartnerContractDetail(FormVal).subscribe(
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


  /***
  * close dialog
  */
  closeModal(): void {
    this.dialogRef.close();
  }

}
