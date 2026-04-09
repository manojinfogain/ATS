import { query } from '@angular/animations';
import { Component, Input, OnInit, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { GetLocationInfo } from 'projects/ats-global-system/src/app/core/common/getLocationInfo';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { PartnerService } from 'projects/ats-global-system/src/app/vendor-partner-module/partner.service';
import { Subscription } from 'rxjs';
import { EventEmitter } from 'stream';

@Component({
  selector: 'app-partner-form',
  templateUrl: './partner-form.component.html',
  styleUrls: ['./partner-form.component.scss']
})
export class PartnerFormComponent implements OnInit {
  @Input() form: UntypedFormGroup = new UntypedFormGroup({});
  @Input() public CountryId: number;
  @Input() public minDate: any = new Date();
  @Input() public readOnlyEmail: boolean = false;
  public readOnlyFields: boolean = false;
  @Input() public startEndDateReq: boolean = true;
  @Input() public EndDateReq: boolean = true;
  @Input() public data: any = [];
  @Input() public isContractsNew: boolean ;
  public isContractTypeEditable: boolean = false;
  public FilterCtrlTAGhead: UntypedFormControl = new UntypedFormControl();
  public searchInputTagHead: string;
  public isPartnerForApproval: boolean = false;
  private refreshSubscription: Subscription = new Subscription();
  constructor(
    private _globalServe: GlobalApisService,
    private getLocInfo: GetLocationInfo,
    private _share: ShareService,
    private _partnerServe: PartnerService
  ) { }


  public isLocationUS: boolean = false;
  public isLocationIndia: boolean = false;
  ngOnInit(): void {
    this.data 
    this.form 
    //form share
    debugger
    this.refreshSubscription = this._share.detectSwitchLoc.subscribe(
      get => {
        this.showHideLocWise();
      }
    )

    if (this.data?.type == 'P') {
      this.getControl('status')?.setValidators([Validators.required]);
      this.getControl('TagHeadApprover')?.clearValidators();
      // this.isPartnerForApproval = true;
    }
    else if (this.data?.type == 'N' || this.data?.type == 'S') {
      this.getControl('TagHeadApprover')?.setValidators([Validators.required]);
      this.getControl('status')?.clearValidators();
      // this.isPartnerForApproval = true;
    }
    else {
      this.getControl('status')?.clearValidators();
      this.getControl('TagHeadApprover')?.clearValidators();
      // this.isPartnerForApproval = false;
    }
    this.getControl('status')?.updateValueAndValidity();
    this.getControl('TagHeadApprover')?.updateValueAndValidity();
    // 
    /**non editable for update case */
    if (this.data?.type == 'U') {
      this.readOnlyFields = true;
    } else {
      this.readOnlyFields = false;
    }
    this.showHideLocWise();


    this.getContractList();

   
  }

  // location wise check

  showHideLocWise() {
    if (this.getLocInfo.isLocationIndia()) {
      this.isLocationIndia = true;
      this.isLocationUS = false;
      this.showHideContractFieldsLocWise('IND');
    } else if (this.getLocInfo.isLocationUS()) {
      this.isLocationIndia = false;
      this.isLocationUS = true;
      this.showHideContractFieldsLocWise('OTH');
    }
    this.formValidationLocWise();
    this.dateLocationWise();
    this.locationWiseContracList();
    this.getTagHeadApproverList();
 //   this.showHideContractFieldsLocWise('OTH');
  }

  /** loc wise  */
  public isMultiContractForIndia: boolean = false;
  showHideContractFieldsLocWise(type: string) {
    debugger
    if (type == "IND") {
      this.isMultiContractForIndia = true;
      this.getControl('ContractTypeID').clearValidators();
      this.getControl('ContractAvailability').clearValidators();
      this.getControl('StartDate').clearValidators();
      this.getControl('EndDate').clearValidators();
      this.getControl('ContractAvailability').reset();

    } else {
      this.getControl('StartDate').setValidators([Validators.required]);
      this.getControl('EndDate').setValidators([Validators.required]);
      this.getControl('ContractTypeID').setValidators([Validators.required]);
      this.getControl('ContractAvailability').setValidators([Validators.required]);

      this.isMultiContractForIndia = false;
    }
    this.getControl('ContractTypeID').updateValueAndValidity();
    this.getControl('ContractAvailability').updateValueAndValidity();
    this.getControl('StartDate').updateValueAndValidity();
    this.getControl('EndDate').updateValueAndValidity();
  }

  /***
   * form validation location wise
   */

  formValidationLocWise() {
    if (this.isLocationIndia) {
      this.form.get('CityID').setValidators([Validators.required]);
      this.getControl('addressLine1').reset();
      this.getControl('addressLine2').reset();
      this.getControl('city').reset();
      this.getControl('state').reset();
      this.getControl('postalCode').reset();
      this.getControl('addressLine1').clearValidators();
      this.getControl('addressLine2').clearValidators();
      this.getControl('city').clearValidators();
      this.getControl('state').clearValidators();
      this.getControl('postalCode').clearValidators();

    }
    else if (this.isLocationUS) {
      this.form.get('CityID').clearValidators();
      this.form.get('CityID').reset();
      this.getControl('addressLine1').setValidators([Validators.required]);
      this.getControl('addressLine2').setValidators([Validators.required]);
      this.getControl('city').setValidators([Validators.required]);
      this.getControl('state').setValidators([Validators.required]);
      this.getControl('postalCode').setValidators([Validators.required]);
    }
    else {
      this.form.get('CityID').clearValidators();
      this.getControl('addressLine1').clearValidators();
      this.getControl('addressLine2').clearValidators();
      this.getControl('city').clearValidators();
      this.getControl('state').clearValidators();
      this.getControl('postalCode').clearValidators();

    }
    this.form.get('CityID').updateValueAndValidity();
    this.getControl('addressLine1').updateValueAndValidity();
    this.getControl('addressLine2').updateValueAndValidity();
    this.getControl('city').updateValueAndValidity();
    this.getControl('state').updateValueAndValidity();
    this.getControl('postalCode').updateValueAndValidity();

  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  /***
   * start date end date locationWise check
   */
  dateLocationWise() {
    let ContractAvailability = this.form.get('ContractAvailability').value;
    if (ContractAvailability === 'Y') {
      if (this.isLocationIndia) {
        this.startEndDateReq = true;
        this.EndDateReq = true;
        this.getControl('StartDate').setValidators([Validators.required]);
        this.getControl('EndDate').setValidators([Validators.required]);
      }
      else {
        this.startEndDateReq = true;
        this.EndDateReq = false;
        this.getControl('EndDate').clearValidators();
        this.getControl('StartDate').setValidators([Validators.required]);
      }
    }
    else {
      this.startEndDateReq = false;
      this.EndDateReq = false;
      this.getControl('StartDate').clearValidators();
      this.getControl('EndDate').clearValidators();
    }

  }
  //radio btn for contract
  contractHandler(val: any) {
    let startDate = new Date();
    let endDate = new Date(new Date().setMonth(new Date().getMonth() + 3));

    if (val.value == "Y") {
      // this.startEndDateReq = true;
      this.dateLocationWise();
      if (!this.readOnlyEmail) {
        this.form.get('StartDate').reset();
        this.form.get('EndDate').reset();
      }

    } else {
      this.startEndDateReq = false;
      this.EndDateReq = false;
      this.getControl('StartDate').clearValidators();
      this.getControl('EndDate').clearValidators();
      if (!this.readOnlyEmail) {
        this.form.get('StartDate').patchValue(startDate);
        this.form.get('EndDate').patchValue(endDate);
      }

    }
  }

  //   * change date
  //  */
  changeDate(type: string, event: any) {
    this.form.get('EndDate').reset();
    this.minDate = new Date(event.value);
  }

  getCountry(e) {
    this.getControl('CityID').reset();
    this.CountryId = e;
  }

  getControl(name: string) {
    return this.form.get(name);
  }

  public contactList: any = [];
  public prContactList: any = [];
  getContractList() {
    this._globalServe.GetContractTypes().subscribe(
      res => {
        this.prContactList = res['data'];
        this.locationWiseContracList();

      }
    )
  }

  locationWiseContracList() {
    if (this.isLocationUS) {
      this.contactList = this.prContactList.filter((item: any) => item.ID == '3' || item.ID == '7' || item.ID == '8');
    }
    else {
      this.contactList = this.prContactList;

    }
  }


  public tagHeadList: any = [];
  getTagHeadApproverList() {

    /**getting list of tag head  */
    let locId: number = 1;
    if (this.isLocationUS) {
      locId = 3
    }
    this._partnerServe.getPartnerTagHeadApproverByLoc(locId).subscribe(
      res => {
        this.tagHeadList = res['data'];
        this.FilterCtrlTAGhead.valueChanges.subscribe(
          val => {
            this.searchInputTagHead = val
          }
        )
      }
    )
  }
  public isRemarkRequired: boolean = false;
  public isRejectTalent: boolean = false;
  statusChange(e) {

    // this.getControl('subReason').reset();
    if (e.value == 'R') {
      this.getControl('Remarks')?.setValidators([Validators.required]);
    }
    else {
      this.getControl('Remarks')?.clearValidators();
      this.getControl('Remarks').reset();
    }
    this.getControl('Remarks')?.updateValueAndValidity();
  }
  /**Get Credit Total Days */
  public creditDays: any = [];
  GetCreditTotalDays() {
    this._globalServe.GetContractTypes().subscribe(
      (res: any) => {
        this.creditDays = res['DATA']
      }
    )
  }



}
