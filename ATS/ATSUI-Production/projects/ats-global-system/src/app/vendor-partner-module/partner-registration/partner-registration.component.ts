import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { COMMON_CONST } from 'projects/ats-global-system/src/app/core/constant/common.const';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { PartnerService } from '../partner.service';
import { GetLocationInfo } from '../../core/common/getLocationInfo';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-partner-registration',
  templateUrl: './partner-registration.component.html',
  styleUrls: ['./partner-registration.component.scss']
})
export class PartnerRegistrationComponent implements OnInit, OnDestroy {
  public partnerRegistrationForm: UntypedFormGroup = new UntypedFormGroup({});
  public data: any = [];
  private refreshSubscription: Subscription = new Subscription();
  constructor(
    private _fb: UntypedFormBuilder,
    private _share: ShareService,
    private _partnerServe: PartnerService,
    private _storage: GetSetStorageService,
    private _router: Router,
    private getLocInfo: GetLocationInfo
  ) { }

  public isLocationUS: boolean = false;
  public isLocationIndia: boolean = false;
  ngOnInit(): void {
    this.data['type'] = 'N';
    this.formInit();
    this.partnerRegistrationForm.get('Name').setErrors({ invalid: true });
    this.showHideLocWise();
    this.refreshSubscription = this._share.detectSwitchLoc.subscribe(
      get => {
        this.showHideLocWise();
      }
    )

  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  // location wise check

  showHideLocWise() {
    if (this.getLocInfo.isLocationIndia()) {
      this.isLocationIndia = true;
      this.isLocationUS = false;
    } else if (this.getLocInfo.isLocationUS()) {
      this.isLocationIndia = false;
      this.isLocationUS = true;
    }
  }

  formInit() {
    this.partnerRegistrationForm = this._fb.group({
      Name: [null, [Validators.required]],
      Email: [null, [Validators.required, Validators.pattern(COMMON_CONST.emailregex)]],
      ContactNo: [null, [Validators.required]],
      CountryID: [null, [Validators.required]],
      CityID: [null, [Validators.required]],
      ContractTypeID: [null, [Validators.required]],
      ContractAvailability: ['Y', [Validators.required]],
      StartDate: [null],
      EndDate: [null],
      Remarks: [null],
      TagHeadApprover: [null, [Validators.required]],
      addressLine1: [null],
      addressLine2: [null],
      city: [null],
      state: [null],
      postalCode: [null],
      ContractDetails: this._fb.array([])
    })
  }

  /***
   * register partner
   */
  registerPartner(form: UntypedFormGroup) {
    form.markAllAsTouched();
    debugger
    if (form.valid) {
      let formData = form.value;
      formData['PartnerID'] = 0;
      formData['Action'] = 'N';
      formData['AddedBy'] = this._storage.getUserEmpId();
      // if (formData.StartDate) {
      //   formData['StartDate'] = GlobalMethod.formatDate(formData['StartDate']);
      // }
      // if (formData.EndDate) {
      //   formData['EndDate'] = GlobalMethod.formatDate(formData['EndDate']);
      // }
      // if(formData.TagHeadApprover){
      //   formData['TagHeadApprover']= 117649;
      // }
      if (formData.TagHeadApprover) {
        formData['TagHeadApprover'] = formData.TagHeadApprover;
      }
      if (!formData.Remarks) {
        delete formData['Remarks']
      }

      if (this.isLocationIndia) {
        let contractFormVal = form.value.ContractDetails.map(val => (
          {
            StartDate: val.StartDate ? GlobalMethod.formatDate(val.StartDate) : null,
            EndDate: val.EndDate ? GlobalMethod.formatDate(val.EndDate): null,
            ContractTypeID: val.ContractTypeID,
            ContractAvailability: val.ContractAvailability,
            ID: val.id
          }));
        formData['ContractDetails'] = contractFormVal;
      }
      debugger

      if (this.isLocationUS) {
        let contractFormVal = [
          {
            StartDate: formData.StartDate?  GlobalMethod.formatDate(formData.StartDate): null,
            EndDate: formData.EndDate? GlobalMethod.formatDate(formData.EndDate): null,
            ContractTypeID: formData.ContractTypeID,
            ContractAvailability: formData.ContractAvailability
          }];
        formData['ContractDetails'] = contractFormVal;
      }
      debugger
      this._partnerServe.addUpdatePartner(formData).subscribe(
        res => {
          this._share.showAlertSuccessMessage.next(res);
          this._router.navigate(['partner-details'])

        }
      )
    } 
    else {
      this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
    }

  }

  resetForm() {
    this.partnerRegistrationForm.reset({ ContractAvailability: 'Y' })
  }

  gotPartnerDetailsPage(): void {
    this._router.navigate(['partner-details'])
  }


}
