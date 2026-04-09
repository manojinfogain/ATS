import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { TalentService } from '../../../talent.service';
import { DashboardService } from 'projects/ats-global-system/src/app/dashboard-module/dashboard.service';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { ExternalUserGlobalApiService } from 'projects/ats-global-system/src/app/core/services/external-user-global-api.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CONSTANTS } from 'projects/ats-global-system/src/app/core/constant/constants';
import { OfferService } from 'projects/ats-global-system/src/app/offer-module/offer.service';



@Component({
  selector: 'app-adding-offerd-candidate',
  templateUrl: './adding-offerd-candidate.component.html',
  styleUrls: ['./adding-offerd-candidate.component.scss']
})
export class AddingOfferdCandidateComponent implements OnInit {

  public disablePastDate: any = new Date();
  public minDate: any = new Date();
  addOfferDetailsForm: UntypedFormGroup;
  public sourceTypeList: any = [];
  public externalPortalList: any = [];
  public contactList: any = [];
  public gradeList: any = [];
  public reportingManagerList: any = [];
  public FilterCtrlGrade: UntypedFormControl = new UntypedFormControl();
  public searchInputGrade: string;
  public FilterCtrlRM: UntypedFormControl = new UntypedFormControl();
  public searchInputRM: string;
  public isBillRateEditable: boolean = true;
  public isBillHrEditable: boolean = true;
  public billingHours: any = [8];
  public RehireList: any = CONSTANTS.RehireList;
  public declineCategoryList: any;
public allBonusNames: string= 'Joining Bonus,  Travel Expense, Relocation Expense, Retention Bonus';
  public step: number = 0;
  constructor(
    public dialogRef: MatDialogRef<AddingOfferdCandidateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: UntypedFormBuilder,
    public _dashServe: DashboardService,
    public _talentServe: TalentService,
    private _share: ShareService,
    private _globalApiServe: GlobalApisService,
    private _extGlobalApiServ: ExternalUserGlobalApiService,
    private _offerService: OfferService,
  ) { }

  ngOnInit() {
    this.formInit();
    const control = this.formSchRowGroup;
    control.push(this.initItemRow({ addExist: false }));
    this.getSourceTypeList();
    if (this.data?.LocationID == 13) {
      this.getcontactList()
      this.getGradeList()
      this.getCurrency();
      this.getDeclineCategoryList();
    }
    if (this.data?.BillingRateInPLN) {
      this.isBillRateEditable = false;
    } else {
      this.isBillRateEditable = true;
    }
    if (this.data?.BillingHrs) {
      this.isBillHrEditable = false;
    } else {
      this.isBillHrEditable = true;
    }
  }

  addValidator(name: string, index: number) {
    let ctrl = this.getControlSource(name, index);
    //  ctrl.setValidators([Validators.required]);
    ctrl?.setValidators([Validators.required]);
    ctrl?.updateValueAndValidity();
  }
  /**method for clear validators */
  clearValidators(name: string, index: number) {
    let ctrl = this.getControlSource(name, index);
    ctrl?.clearValidators();
    ctrl?.updateValueAndValidity();
  }

  /**method for reset value */
  resetControl(name: string, index: number) {
    let ctrl = this.getControlSource(name, index);
    ctrl?.reset();
  }
  //control for form
  getControlSource(name: string, index: number) {
    return this.formGroupControls[index]?.get(name);
  }

  getSourceTypeList() {
    let thId = this.data.TH_ID;
    this._talentServe.getProfileListByLocation(thId).subscribe(
      res => {
        this.sourceTypeList = res['data'];
      }
    );
  }

  profileSourceChange(event: any, index: number) {
    // location id for Singapore - 6 
    // location id for Poland - 13 
    // location id for Middle East - 9 

    // var location_id = [6,9,13];
    this.resetControl('ReferrerName', index);
    this.resetControl('SubProfileId', index);
    this.clearValidators('ReferrerName', index);
    this.clearValidators('SubProfileId', index);

    // if(location_id.includes(this.data.LocationID)){
    if (event.value == '4') {
      this.addValidator('ReferrerName', index);
    }
    if (event.value == '13') {
      this.addValidator('SubProfileId', index);
      this.getExternalPortal(13);
    }
    // }
  }

  getExternalPortal(id: number) {
    this._talentServe.getExternalPortal(id).subscribe(
      res => {
        this.externalPortalList = res['data'];
      }
    );
  }

  getControlOfReferrerName(name: string, index: number) {
    return this.formGroupControls[index]?.get(name).value == '4';
  }

  getControlOfExternalPortal(name: string, index: number) {
    return this.formGroupControls[index]?.get(name).value == '13';
  }

  showPartnerIfSourceName(name: string, index: number) {
    return this.formGroupControls[index]?.get(name).value == '5';
  }
  // Hide Source Name : 
  // Linkedin, Career website, External Portal
  // Employee Referral, Naukri, Socila media, Dice, Indeed
  getControlOfSourceName(name: string, index: number) {
    let profileVal = this.formGroupControls[index]?.get(name).value
    if (profileVal === 1 || profileVal === 4 || profileVal === 2 || profileVal === 6 ||
      profileVal === 7 || profileVal === 8 || profileVal === 12 || profileVal === 13) {
      return false;
    }
    return true;
  }

  /***
   * update talentid form submit
   */

  formInit() {
    this.addOfferDetailsForm = this._fb.group({
      formSchRowGroup: this._fb.array([])
    })

  }

  addUpdateControl() {
    const control = this.formSchRowGroup;
    if (control.length < 10) {
      control.push(this.initItemRow({ addExist: false }));
    }
  }

  /***
  * on click delate row
  */
  deleteRow(e: any, index: number) {
    e.stopPropagation();
    const control = this.formSchRowGroup;
    if (control.length != 1) {
      control.removeAt(index);
    }
  }

  /*** dynamic control for form */
  initItemRow(data) {
    return this._fb.group({
      CandidateName: [null, [Validators.required]],
      offerDate: [null, [Validators.required]],
      tentativeJoiningDate: [null, [Validators.required]],
      sourceType: [null, [Validators.required]],
      SourceName: [null],
      EmploymentTypeID: [null],
      DesignationId: [null],
      gradeId: [null],
      reportingManager: [null],
      PrimarySkillId: [null],
      SubSkillId: [null],
      ExpInYear: [null],
      ExpInMonth: [null],
      DateOfDecline: [null],
      DeclineCategory: [null],
      DeclineRemarks: [null],
      JoiningBonus: [null],
      RetentionBonus: [null],
      RelocationExpense: [null],
      TravelExpense: [null],
      NoticePeriodInDays: [null],
      BillingCurrencyId: [this.data?.LocationID == 13 ? 4 : null],
      billingRateHrCurrency: [this.data?.BillingRateInPLN ? this.data.BillingRateInPLN : null],
      BillableHoursDay: [this.data?.BillingHrs ? this.data.BillingHrs : null],
      ProjectBufferInPercent: [null],
      // NonReimbursableTravelCostUsd: [null],
      // ProjectSpecificCostUsd: [null],
      reHire: [null],
      //non-editable DGM fields for Poland location -13
      LocalCurrency: [this.data?.LocalCurrencyName],
      LocalCurrencyId: [null],
      AnnualCTC: [null],
      HourlySalary: [null],
      BillingRateHrInUSD: [this.data?.BillingRateInUSD],
      AnnualBillableHours: [this.data?.BillingHrsInPLN],
      AnnualRevenueUsd: [null],
      AnnualSalaryCostUsd: [null],
      JoiningBonusUsd: [null],
      BenefitsUsd: [null],
      ProjectBufferUsd: [null],
      DgmCostUsd: [null],
      DgmPercentUsd: [null],
      //
      ReferrerName: [null, [Validators.required]],
      SubProfileId: [null, [Validators.required]],
      // maxSalary: [null, [Validators.required]],
      offeredCTC: [null],
      Comment: [null],
      // variance: [null, [Validators.required]]
    })
  }

  get formSchRowGroup() {
    return (this.addOfferDetailsForm.get('formSchRowGroup') as UntypedFormArray);
  }
  get formGroupControls() {
    return this.formSchRowGroup['controls']
  }



  getControl(name: string, index: number) {
    return this.formGroupControls[index]?.get(name);
  }

  /***
* change date
*/
  changeDate(type: string, event: any) {
    this.minDate = new Date(event.value);
  }

  /***
  * close dialog
  */
  closeModal(): void {
    this.dialogRef.close();
  }

  /***
   * submit details  Data to server
   */
  updateTalentIdHandler(form: UntypedFormGroup) {
    this.addOfferDetailsForm.markAllAsTouched();
    if (form.valid) {
      let formData = form?.value?.formSchRowGroup;
      formData.forEach((data, index) => this.processFormData(data, index));
      this.submitFormData(formData);
    } else {
      this._share.showAlertErrorMessage.next("Please fill all mandatory fields.");
    }
  }

  public localSystemTimeZone = GlobalMethod.getTimezone();
  processFormData(data: any, index: number) {
    data['THID'] = this.data?.TH_ID;
    data['offerDate'] = GlobalMethod.formatDate(data['offerDate']);
    data['tentativeJoiningDate'] = GlobalMethod.formatDate(data['tentativeJoiningDate']);
    if (this.data?.LocationID == 13) {
      if (data['SubSkillId']) {
        data['SubSkillId'] = data['SubSkillId']?.toString();
      }
      data['OfferDateUTC'] = data['offerDate'] ? GlobalMethod.convertToUTCDate(data['offerDate']) : null;
      data['TentativeJoiningDateUTC'] = data['tentativeJoiningDate'] ? GlobalMethod.convertToUTCDate(data['tentativeJoiningDate']) : null;
      // data['DateOfDeclineUtc'] = data['DateOfDecline'] ? GlobalMethod.convertToUTCDate(data['DateOfDecline']) : null;
      data['ModifiedOnUtc'] = GlobalMethod.convertToUTCDate(new Date());
      data['ModifiedOnTimeZone'] = this.localSystemTimeZone;
      data['ModifiedOnOffSet'] = GlobalMethod.getOffset();
      data['AddedOnUTC'] = GlobalMethod.convertToUTCDate(new Date());
      data['AddedOnTimeZone'] = this.localSystemTimeZone;
      data['AddedOnOffSet'] = GlobalMethod.getOffset();
      data['LocationId'] = this.data?.LocationID;
      delete data['LocalCurrency'];
      delete data['DateOfDecline'];
      delete data['DeclineCategory'];
      delete data['DeclineRemarks'];
    } else {
      this.removeUnnecessaryFields(data);
    }
  }

  removeUnnecessaryFields(data: any) {
    const fieldsToRemove = [
      'SubSkillId', 'EmploymentTypeID', 'DateOfDecline', 'DeclineRemarks', 'DesignationId',
      'NoticePeriodInDays', 'PrimarySkillId', 'RelocationExpense',
      'RetentionBonus', 'TravelExpense', 'billingRate',
      'DeclineCategory', 'gradeId', 'JoiningBonus', 'reportingManager',
      'ExpInYear', 'ExpInMonth', 'BillingCurrencyId', 'billingRateHrCurrency',
      'BillableHoursDay', 'ProjectBufferInPercent',
      'LocalCurrency', 'LocalCurrencyId', 'AnnualCTC', 'HourlySalary',
      'BillingRateHrInUSD', 'AnnualBillableHours', 'AnnualRevenueUsd',
      'AnnualSalaryCostUsd', 'JoiningBonusUsd', 'BenefitsUsd', 'ProjectBufferUsd',
      'DgmCostUsd', 'DgmPercentUsd', 'reHire'
    ];
    fieldsToRemove.forEach(field => delete data[field]);
  }

  submitFormData(formData: any) {
    const serviceCall = this.data?.LocationID == 13
      ? this._talentServe.AddUpdateTalentOfferDetails(formData)
      : this._talentServe.AddUpdateOfferDetailsByTHID(formData);

    serviceCall.subscribe(
      res => {
        this._share.showAlertSuccessMessage.next(res);
        this.dialogRef.close(true);
      }
    );
  }

  /**get contract type */
  getcontactList() {
    this._globalApiServe.GetContractTypesForUS(this.data?.LocationID).subscribe(
      res => {
        this.contactList = res['data'];
      }
    );
  }
  /**get grade list */
  getGradeList() {
    this._globalApiServe.getGradeList().subscribe(
      res => {
        this.gradeList = res['data'];
        this.FilterCtrlGrade.valueChanges.subscribe(
          val => {
            this.searchInputGrade = val;
          }
        );
      }
    );
  }
  //get reporting managers list
  getReportingManagersList(gradeId: number) {
    this._extGlobalApiServ.GetReportingManagerBYGrade(gradeId).subscribe(
      res => {
        this.reportingManagerList = res['data'];
        this.FilterCtrlRM.valueChanges.subscribe(
          val => {
            this.searchInputRM = val;
          }
        );
      }
    );
  }
  /**
  * get Grade Id
  * @param e 
  */
  getGradeId(e): void {
    this.getReportingManagersList(e.value);
  }

  public currencyTypeData: any = [];
  getCurrency() {
    //get cand type
    this._globalApiServe.GetCurrencyList().subscribe(
      res => {
        // this.currencyTypeData = res['data'];
        let filterById = [4]
        let filterByStatus = res['data'].filter(t => {
          return filterById.indexOf(t.CurId) !== -1;
        });
        this.currencyTypeData = filterByStatus;
      }
    );
  }

  // Method to calculate DGM
  public dgmData: any = {};
  getDGMCalcValue(index: number) {
    let body = {
      billingRate: this.getControl('billingRateHrCurrency', index)?.value,
      billingCurrencyId: this.getControl('BillingCurrencyId', index)?.value,
      billableHoursDay: this.getControl('BillableHoursDay', index)?.value,
      projectBuffer: this.getControl('ProjectBufferInPercent', index)?.value,
      cadidateTypeId: this.getControl('EmploymentTypeID', index)?.value,
      offeredCTC: this.getControl('offeredCTC', index)?.value,
      joiningBonus: this.getControl('JoiningBonus', index)?.value,
      gradeId: this.getControl('gradeId', index)?.value,
      JoiningLocationId: this.data?.LocationID,
      RetentionBonus: this.getControl('RetentionBonus', index)?.value,
      RelocationExp: this.getControl('RelocationExpense', index)?.value,
      TravelExp: this.getControl('TravelExpense', index)?.value,
      //   joiningBonus: this.getControl('JoiningBonus', index)?.value,
    }
    this.dgmCallAPI(body, index);

  }

  /***
   * api call for dgm calc 
   */
  public dgmAllAllowance: any = [];
  dgmCallAPI(body: any, index: number) {
    this._talentServe.getDgmCalcForPoland(body).subscribe(
      res => {
        this.dgmData = res['data'][0];
        //********** */
        // this.getControl('LocalCurrency', index)?.setValue(this.dgmData?.LocalCurrencyName);
        this.getControl('LocalCurrencyId', index)?.setValue(this.dgmData?.LocalCurrencyId);
        this.getControl('AnnualCTC', index)?.setValue(this.dgmData?.AnnualCTC);
        this.getControl('HourlySalary', index)?.setValue(this.dgmData?.HourlyOfferedCTCInLocal);
        // this.getControl('BillingRateHrInUSD', index)?.setValue(this.dgmData?.BillingRateHr);
        // this.getControl('AnnualBillableHours', index)?.setValue(this.dgmData?.AnnualBillableHours);
        this.getControl('AnnualRevenueUsd', index)?.setValue(this.dgmData?.AnnualRevenue);
        this.getControl('AnnualSalaryCostUsd', index)?.setValue(this.dgmData?.AnnualSalaryCost);
        this.getControl('JoiningBonusUsd', index)?.setValue(this.dgmData?.TotalOTBonusinUSD);
        this.getControl('BenefitsUsd', index)?.setValue(this.dgmData?.Benefits);
        this.getControl('ProjectBufferUsd', index)?.setValue(this.dgmData?.ProjectBuffer);
        this.getControl('DgmCostUsd', index)?.setValue(this.dgmData?.dgmCost);
        this.getControl('DgmPercentUsd', index)?.setValue(this.dgmData?.dgmCostPercent);
        this.dgmAllAllowance[index] = this.dgmData?.TotalOTBonus;
        //********* */
      }
    )
  }

  //get Decline CategoryList
  getDeclineCategoryList() {
    this._offerService.getDeclineCategory().subscribe(
      res => {
        this.declineCategoryList = res.data;
      }
    )
  }

  getJoiningBonus(index: number) {
    this.getControl('JoiningBonus', index)?.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(1000)
      ).subscribe(
        get => {
          this.getDGMCalcValue(index);
        }
      );
  }
  /**New allowance retention bonus*/
  getRetentionBonus(index: number) {
    this.getControl('RetentionBonus', index)?.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(1000)
      ).subscribe(
        get => {
          this.getDGMCalcValue(index);
        }
      );
  }
/**New allowance relocation expense*/
  getRelocationExpense(index: number) {
    this.getControl('RelocationExpense', index)?.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(1000)
      ).subscribe(
        get => {
          this.getDGMCalcValue(index);
        }
      );
  }
  /**New allowance travel expense*/
  getTravelExpense(index: number) {
    this.getControl('TravelExpense', index)?.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(1000)
      ).subscribe(
        get => {
          this.getDGMCalcValue(index);
        }
      );
  }
  getOfferedCTC(index: number) {
    this.getControl('offeredCTC', index)?.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(1000)
      ).subscribe(
        get => {
          this.getDGMCalcValue(index);
        }
      );
  }

  getBillingRateHrCurrency(index: number) {
    this.getControl('billingRateHrCurrency', index)?.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(1000)
      ).subscribe(
        get => {
          this.getDGMCalcValue(index);
        }
      );
  }

  getProjectBufferInPercent(index: number) {
    this.getControl('ProjectBufferInPercent', index)?.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(1000)
      ).subscribe(
        get => {
          this.getDGMCalcValue(index);
        }
      );
  }

}
