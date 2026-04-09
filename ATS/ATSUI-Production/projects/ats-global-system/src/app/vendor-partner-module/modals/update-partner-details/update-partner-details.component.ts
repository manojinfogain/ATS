import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { COMMON_CONST } from 'projects/ats-global-system/src/app/core/constant/common.const';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { PartnerService } from '../../partner.service';
import { GetLocationInfo } from '../../../core/common/getLocationInfo';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-update-partner-details',
  templateUrl: './update-partner-details.component.html',
  styleUrls: ['./update-partner-details.component.scss']
})
export class UpdatePartnerDetailsComponent implements OnInit, OnDestroy {
  public partnerRegistrationForm: UntypedFormGroup = new UntypedFormGroup({});
  public partnerApprovalForm: UntypedFormGroup = new UntypedFormGroup({});
  public startDateEndDate: boolean = true;
  constructor(
    public dialogRef: MatDialogRef<UpdatePartnerDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: UntypedFormBuilder,
    private _share: ShareService,
    private _partnerServe: PartnerService,
    private _storage: GetSetStorageService,
    private getLocInfo: GetLocationInfo
  ) { }
  private refreshSubscription: Subscription = new Subscription();
  ngOnInit(): void {
    this.showHideLocWise();
    this.refreshSubscription = this._share.detectSwitchLoc.subscribe(
      get => {
        this.showHideLocWise();
      }
    )
    this.formInit();
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  // location wise check
  public isLocationUS: boolean = false;
  public isLocationIndia: boolean = false;
  showHideLocWise() {
    if (this.getLocInfo.isLocationIndia()) {
      this.isLocationIndia = true;
      this.isLocationUS = false;
    } else if (this.getLocInfo.isLocationUS()) {
      this.isLocationIndia = false;
      this.isLocationUS = true;
    }
  }

  public StartDate: any = {};
  formInit() {
    this.StartDate = new Date(this.data?.StartDate);
    this.partnerRegistrationForm = this._fb.group({
      Name: [this.data?.PartnerName, [Validators.required]],
      Email: [this.data?.Email, [Validators.required, Validators.pattern(COMMON_CONST.emailregex)]],
      ContactNo: [this.data?.ContactNo, [Validators.required]],
      CountryID: [this.data?.CountryID, [Validators.required]],
      CityID: [this.data?.CityID, [Validators.required]],
      ContractTypeID: [this.data?.ContractTypeID, [Validators.required]],
      ContractAvailability: [this.data?.ContractAvailability, [Validators.required]],
      StartDate: [this.data.StartDate ? new Date(this.data?.StartDate) : null,],
      EndDate: [this.data.EndDate ? new Date(this.data?.EndDate) : null,],
      Remarks: [this.data?.Remarks],
      status: [null],
      TagHeadApprover: [this.data?.TagheadApprover],
      addressLine1: [this.data?.AddressLine1 ? this.data?.AddressLine1 : null],
      addressLine2: [this.data?.AddressLine2 ? this.data?.AddressLine2 : null],
      city: [this.data?.cityName ? this.data?.cityName : null],
      state: [this.data?.stateName ? this.data?.stateName : null],
      postalCode: [this.data?.postalCode ? this.data?.postalCode : null],
      ContractDetails: this._fb.array([])
    })
    if (this.data.ContractAvailability == 'N') {
      this.startDateEndDate = false
    }
  }

  /**
   * update partner profile
   * @param form 
   */
  UpdateProfile(form: UntypedFormGroup) {
    form.markAllAsTouched();
    if (form.valid) {
      let formData = form.value;
      formData['PartnerID'] = this.data?.PartnerID;
      formData['AddedBy'] = this._storage.getUserEmpId();

      // if (formData.StartDate) {
      //   formData['StartDate'] = GlobalMethod.formatDate(formData['StartDate']);
      // }
      // if (formData.EndDate) {
      //   formData['EndDate'] = GlobalMethod.formatDate(formData['EndDate']);
      // }



      if (formData.status) {
        formData['Action'] = formData.status;
      }
      if (this.data?.type == 'S') {
        formData['Action'] = 'S';
      }
      delete formData['status'];
      if (this.data?.type == 'U') {
        formData['Action'] = 'U';
      }
      if (!formData.Remarks) {
        delete formData['Remarks']
      }
      form.value.ContractDetails
      debugger
      if (this.isLocationIndia) {
        let contractFormVal = form.value.ContractDetails.map(val => (
          {
            StartDate: val.StartDate ? GlobalMethod.formatDate(val.StartDate): null,
            EndDate: val.EndDate ? GlobalMethod.formatDate(val.EndDate): null,
            ContractTypeID: val.ContractTypeID,
            ContractAvailability: val.ContractAvailability,
            ID: val.id ? val.id : 0
          }));
        formData['ContractDetails'] = contractFormVal;
      }
      if (this.isLocationUS) {
        let contractFormVal = [
          {
            StartDate:formData.StartDate ? GlobalMethod.formatDate(formData.StartDate): null,
            EndDate:formData.EndDate ? GlobalMethod.formatDate(formData.EndDate): null,
            ContractTypeID: formData.ContractTypeID,
            ContractAvailability: formData.ContractAvailability
          }];
        formData['ContractDetails'] = contractFormVal;
      }
      // delete formData['EndDate'];
      // delete formData['StartDate'];
      this._partnerServe.addUpdatePartner(formData).subscribe(
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

  closeModal(): void {
    this.dialogRef.close();
  }

}
