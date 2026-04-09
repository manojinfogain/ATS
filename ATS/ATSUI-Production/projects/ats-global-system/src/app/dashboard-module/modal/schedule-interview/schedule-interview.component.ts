import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { Subscription, forkJoin } from 'rxjs';
import { GetLocationInfo } from 'projects/ats-global-system/src/app/core/common/getLocationInfo';
import { GlobalCommonMethodService } from 'projects/ats-global-system/src/app/core/common/global-common-method.service';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { salaryMinMaxLoc, tcSupportList } from 'projects/ats-global-system/src/app/core/constant/common.const';
import { CONSTANTS } from 'projects/ats-global-system/src/app/core/constant/constants';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { InterviewCommonService } from 'projects/ats-global-system/src/app/core/services/interview-common.service';
import { NewInterviewService } from 'projects/ats-global-system/src/app/core/services/new-interview.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { ViewInfoTalentidComponent } from '../view-info-talentid/view-info-talentid.component';
import { ViewCalenderHistoryComponent } from '../../../shared/shared-app/components/view-calender-history/view-calender-history.component';
import { TalentService } from '../../../talent-module/talent.service';

declare var $: any;
@Component({
  selector: 'app-schedule-interview',
  templateUrl: './schedule-interview.component.html',
  styleUrls: ['./schedule-interview.component.scss']
})
export class ScheduleInterviewComponent implements OnInit {
  public panelData: any = {};
  public step: number = 0;
  public profileNameData: any = [];
  public ScheduleFormGroup: UntypedFormGroup = new UntypedFormGroup({});
  minDate = new Date();
  public c_profileUniqId: number;
  public updateFormSubs: Subscription;
  public today = new Date();
  public maxDate = new Date(this.today.getFullYear() - 10, this.today.getMonth(), this.today.getDate());
  //@ViewChild(MatAccordion) accordion: MatAccordion;
  // public salaryTypeList: any = CONSTANTS.salaryType;
  public salaryTypeList: any = this.getSalaryTypeListLocationWise();
  public JfCategList: any = CONSTANTS.JfCategList;
  public entityList: any = [];
  // intModeData2: any = [];
  // public durationData: any[] = CONSTANTS.interviewDuration;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ScheduleInterviewComponent>,
    private _fb: UntypedFormBuilder,
    private _globalApi: GlobalApisService,
    public dialog: MatDialog,
    private _intCommonServe: InterviewCommonService,
    private _newInterviewServe: NewInterviewService,
    private _share: ShareService,
    private getLocInfo: GetLocationInfo,
    private _globalCommonMethod: GlobalCommonMethodService,
    private _talentServ: TalentService

  ) { }

  public getExistData: any = {};
  public locationData: any = {};
  public talentDetailsList: any = {};
  public IsRenuTeam: boolean = false;
  ngOnInit(): void {
    if (this.data?.IsRenuTeam == 'Y') {
      this.IsRenuTeam = true;
    }
    this.getGender();
    this.getProfileSource(this.data);
    this.getEmpType();
    this.getCurrencyType();
    this.formInit(this.data);
    this.updateValidatorLocWise();
    forkJoin([
      this._talentServ.GetTHIDDetailsByTHID(this.data?.candidate?.thId),
      this._globalApi.getTalentCubeList(),
      this._globalApi.getLegalEntityList(),
    ]).subscribe(
      res => {
        this.talentDetailsList = res[0]['data'][0];
        this.talentCubeList = res[1]['data'];
        let entityListData = res[2]['data'];
        if (this.getLocInfo.isLocationUS()) {
          // this.entityList = entityListData.filter(list => list?.ID == 22);
          this.entityList = entityListData
        } else {
          this.entityList = res[2]['data'];
          this.resetControl('EntityId');
        }

        this.gradeId = this.talentDetailsList?.TCGradeId;
        if (this.talentDetailsList?.IsRenuTeam == 'Y') {
          this.IsRenuTeam = true;
        }
        this.setValueDefault(this.data)
        this.getCubeClusterID(this.talentDetailsList.TalentCubeId, this.talentCubeList);
      }
    )



    this.locationData = this.getLocInfo;
    this.getIntMode()
    // this.updateFormSubs = this._share.detectSwitchLoc.subscribe(
    //   get=>{
    //     // this.updateValidatorLocWise();
    //     // this.getEmpType();
    //     // this.getProfileSource(this.data);
    //   }
    // )

  }


  //get Salary Type List LocationWise
  getSalaryTypeListLocationWise() {
    if (this.getLocInfo.isLocationIndia()) {
      return CONSTANTS.salaryType?.filter(d => d?.id == 1 || d?.id == 2);
    } else {
      return CONSTANTS.salaryType;
    }
  }

  /***
   * get Division Id
   */
  public divisionId: number;
  getDivisionID(e) {
    this.divisionId = e;
    let empUnitId = this.getControl('empUnitId')?.value;
    if (!this.IsRenuTeam) {
      this.getControl('gradeBand').setValidators([Validators.required]);
      this.getControl('gradeBand').updateValueAndValidity();
    }

    this.hideFieldsForSupport(empUnitId);
    this.OnTCSelectionValidation(this.talentCubeId);
  }
  /***
   * get Grade Id
   */
  public gradeId: number = 1;
  getGradeId(e) {
    this.gradeId = e;
    this.getCubeClusterID(this.talentCubeId, this?.talentCubeList);
  }

  /**
   *
   * @param e get Cub Cluster Id
   */
  public filterCubeList: any = {};
  getCubeClusterID(tcId, tcList, type: string = 'I'): any {
    if (type == 'I') {
      let gradeId = this.getControl('gradeId')?.value;
      this.filterCubeList = tcList?.filter(r => r?.CubeId == tcId)[0];
      if (gradeId && tcId) {
        this.getRoleByTalentCube(tcId, gradeId);
      }
    }
    else {
      this.filterCubeList = tcList?.filter(r => r?.CubeId == tcId)[0];
      if (this.talentDetailsList?.TCGradeId && this.talentDetailsList?.TalentCubeId) {
        this.getRoleByTalentCube(this.talentDetailsList?.TalentCubeId, this.talentDetailsList?.TCGradeId);
      }
    }

  }

  //To Remove Validation for cluster when TCID is 61
  OnTCSelectionValidation(tcId: any) {
    if (tcSupportList.supportItems.find(x => x === tcId)) {
      this.getControl('cluster').reset();
      this.getControl('cluster').clearValidators();
      this.getControl('cubeClusterId').reset();
      this.getControl('cubeClusterId').clearValidators();
    } else {
      if (this.getLocInfo.isLocationIndia()) {
        this.getControl('cluster').addValidators([
          Validators.required,
        ]);
        this.getControl('cubeClusterId').addValidators([
          Validators.required,
        ]);
      }
    }
    this.getControl('cluster').updateValueAndValidity();
    this.getControl('cubeClusterId').updateValueAndValidity();
  }

  //get role cluster
  //  public RoleTalentCube: any = {};
  getRoleByTalentCube(talentCubeCode: number, gradeId: number) {
    this._globalApi.getRoleByTalentCube(talentCubeCode, gradeId).subscribe(
      res => {
        let RoleTalentCube = res['data'][0];
        let cluster = this.getControl('cluster');
        let role = this.getControl('role');
        let cubeClusterId = this.getControl('cubeClusterId');
        let roleId = this.getControl('roleId');
        setTimeout(() => {
          cluster.patchValue(this.filterCubeList?.ClusterName);
          role.patchValue(RoleTalentCube?.RoleName);
          cubeClusterId.patchValue(this.filterCubeList?.ClusterId);
          roleId.patchValue(RoleTalentCube?.RoleId);
        }, 1000);
      }
    );
  }

  //getgender
  public genderType: any = []
  getGender() {
    this._globalApi.getGenderList().subscribe(
      res => {
        this.genderType = res['data'];
      }
    )
  }

  public hideCurrentSalaryCtrl: boolean = true;
  public hideCountryCtrl: boolean = true;
  public hideStateCtrl: boolean = true;
  public isGenderVisible: boolean = false;
  public isDobVisible: boolean = true;
  public isDivisionVisible: boolean = true;
  public isTCVisible: boolean = true;
  public isGradeVisible: boolean = true;
  public isClusterVisible: boolean = true;
  public isGradeBandVisible: boolean = true;
  public isGradeBandReq: boolean = false;
  public isRoleVisible: boolean = true;
  public isSalaryGridVisible: boolean = false;
  public isSalaryTypeVisible: boolean = true;
  public isPracticeVisible: boolean = true;
  public isEmpUnitVisible: boolean = true;
  public isWithCountryCode: boolean = false;
  // public isTimeZoneVisible: boolean = true;
  // public isIntDateVisible: boolean = true;
  // public isIntTimeHrVisible: boolean = true;
  // public isIntTimeMinVisible: boolean = true;
  // public isIntModeVisible: boolean = true;
  // public isIntDurVisible: boolean = true;
  // public isVenueVisible: boolean = true;
  // public isPrimIntVisible: boolean = true;
  // public isAddIntVisible: boolean = true;
  updateValidatorLocWise() {
    if (this.getLocInfo.isLocationIndia()) {
      this.hideCurrentSalaryCtrl = true;
      this.hideCountryCtrl = true;
      this.isGenderVisible = true;
      this.isDobVisible = true;
      this.isDivisionVisible = true;
      this.isTCVisible = true;
      this.isClusterVisible = true;
      this.isRoleVisible = true;
      this.isGradeVisible = true;
      this.isGradeBandVisible = true;
      // this.isSalaryTypeVisible = false;
      this.isPracticeVisible = true;
      this.isEmpUnitVisible = true;
      if (!this.IsRenuTeam) {
        this.isSalaryGridVisible = true;
      }
      this.isWithCountryCode = false

      // this.isTimeZoneVisible = true;
      // this.isIntDateVisible = true;
      // this.isIntTimeHrVisible = true;
      // this.isIntTimeMinVisible = true;
      // this.isIntModeVisible = true;
      // this.isIntDurVisible = true;
      // this.isVenueVisible = true;
      // this.isPrimIntVisible = true;
      // this.isAddIntVisible = true;
      this.addValidator('phone', 'minmax', 10, 10);
      this.addValidator('currCompany');
      this.addValidator('educaQualification');
      this.addValidator('offLetter');
      this.addValidator('currentSalary');
      this.addValidator('CountryID');
      this.clearValidators('StateID');
      this.resetControl('StateID');
      this.addValidator('candiDob');
      this.addValidator('DivisionID');
      this.addValidator('gradeId');
      this.addValidator('TCID');
      this.addValidator('empUnitId');
      this.addValidator('cubeClusterId');
      this.addValidator('cluster');
      
      if (!this.IsRenuTeam) {
        this.addValidator('gradeBand');
        this.isGradeBandReq = true;
      }

      this.clearValidators('countryCode');
      this.resetControl('countryCode');

      // this.addValidator('interviewDateTimeZone');
      // this.addValidator('interviewDate');
      // this.addValidator('interviewTimeHours');
      // this.addValidator('interviewTimeMint');
      // this.addValidator('IntModeType');
      // this.addValidator('interviewDuration');
      // this.addValidator('Venue');
      // this.addValidator('panel');
      // this.addValidator('AdditionalInterviewer');
      // this.clearValidators('SalaryType');
      // this.resetControl('SalaryType');
      this.hideStateCtrl = false;
      //this.addValidator('candidateGender');

    }

    else if (this.getLocInfo.isLocationUS()) {
      this.hideStateCtrl = true;
      this.isWithCountryCode = true;
      this.clearValidators('currCompany');
      this.resetControl('currCompany');
      this.clearValidators('educaQualification');
      this.resetControl('educaQualification');
      this.clearValidators('DivisionID');
      this.resetControl('DivisionID');
      this.clearValidators('gradeId');
      this.resetControl('gradeId');
      this.clearValidators('gradeBand');
      this.resetControl('gradeBand');
      this.clearValidators('TCID');
      this.resetControl('TCID');
      this.clearValidators('offLetter');
      this.clearValidators('currentSalary');
      this.resetControl('currentSalary');
      this.clearValidators('CountryID');
      this.resetControl('CountryID');
      this.addValidator('StateID');
      // this.addValidator('SalaryType');
      this.clearValidators('candiDob');
      this.resetControl('candiDob');
      this.clearValidators('empUnitId');
      this.resetControl('empUnitId');
      this.clearValidators('cubeClusterId');
      this.resetControl('cubeClusterId');
      this.clearValidators('cluster');
      this.resetControl('cluster');
      // this.clearValidators('interviewDateTimeZone');
      // this.resetControl('interviewDateTimeZone');
      // this.clearValidators('interviewDate');
      // this.resetControl('interviewDate');
      // this.clearValidators('interviewTimeHours');
      // this.resetControl('interviewTimeHours');
      // this.clearValidators('interviewTimeMint');
      // this.resetControl('interviewTimeMint');
      // this.clearValidators('IntModeType');
      // this.resetControl('IntModeType');
      // this.clearValidators('interviewDuration');
      // this.resetControl('interviewDuration');
      // this.clearValidators('Venue');
      // this.resetControl('Venue');
      // this.clearValidators('panel');
      // this.resetControl('panel');
      // this.clearValidators('AdditionalInterviewer');
      // this.resetControl('AdditionalInterviewer');
      this.hideCurrentSalaryCtrl = false;
      this.hideCountryCtrl = false;
      this.addValidator('phone');
      this.addValidator('countryCode');
      this.isGenderVisible = false;
      this.isDobVisible = false;
      this.isDivisionVisible = false;
      this.isTCVisible = false;
      this.isClusterVisible = false;
      this.isRoleVisible = false;
      this.isGradeVisible = false;
      this.isGradeBandReq = false;
      this.isGradeBandVisible = false;
      this.isSalaryGridVisible = false;
      // this.isSalaryTypeVisible = true;
      this.isPracticeVisible = false;
      this.isEmpUnitVisible = false;
      // this.isTimeZoneVisible = false;
      // this.isIntDateVisible = false;
      // this.isIntTimeHrVisible = false;
      // this.isIntTimeMinVisible = false;
      // this.isIntModeVisible = false;
      // this.isIntDurVisible = false;
      // this.isVenueVisible = false;
      // this.isPrimIntVisible = false;
      // this.isAddIntVisible = false;
      // this.clearValidators('candidateGender');
    }
    else {

    }
  }

  /**
   * add validators
   * @param name
   */
  addValidator(name: string, type?: string, min: number = 0, max: number = 0) {
    let ctrl = this.getControl(name);
    //  ctrl.setValidators([Validators.required]);
    if (type == 'minmax') {
      ctrl.setValidators([Validators.required, Validators.minLength(min), Validators.maxLength(max)]);
    }
    else if (type == 'min') {
      ctrl.setValidators([Validators.required, Validators.min(min)]);
    }
    else if (type == 'max') {
      ctrl.setValidators([Validators.required, Validators.max(max)]);
    }
    else {
      ctrl.setValidators([Validators.required]);
    }
    ctrl.updateValueAndValidity();
  }

  /**
   * clear validator
   * @param name
   */
  clearValidators(name: string) {
    let ctrl = this.getControl(name);
    ctrl.clearValidators();
    ctrl.updateValueAndValidity();
  }

  /**
   * reset
   * @param name
   */
  resetControl(name: string) {
    let ctrl = this.getControl(name);
    ctrl.reset();
  }

  /***
   * form Init Schedule interview
   */
  formInit(data: any) {
    this.ScheduleFormGroup = this._fb.group({
      // appliedid: [null,[Validators.required]],
      firstName: [data?.candidate?.firstName ? data?.candidate?.firstName : null, [Validators.required]],
      middleName: [data?.candidate?.middleName ? data?.candidate?.middleName : null],
      lastName: [data?.candidate?.lastName ? data?.candidate?.lastName : null],
      countryCode: [data?.candidate?.countryCode ? data?.candidate?.countryCode : null],
      phone: [data?.candidate?.mobile ? data?.candidate?.mobile : null, [Validators.required]],
      email: [{ disabled: true, value: data?.candidate?.email ? data?.candidate?.email : null }, [Validators.required]],
      educaQualification: [data?.candidate?.education ? data?.candidate?.education : null, [Validators.required]],
      totalExp: [data?.candidate?.totalExp ? data?.candidate?.totalExp : null, [Validators.required]],
      skill: [data?.candidate?.primarySkill ? data?.candidate?.primarySkill : null, [Validators.required]],
      totalExpMonth: [data?.candidate?.totalExpMonth ? data?.candidate?.totalExpMonth : null, [Validators.required]],
      totalRelExp: [data?.candidate?.releventExp ? data?.candidate?.releventExp : null, [Validators.required]],
      totalRelExpMonth: [data?.candidate?.releventExpMonth ? data?.candidate?.releventExpMonth : null, [Validators.required]],
      currCompany: [data.candidate?.currCompany ? data.candidate?.currCompany : null, [Validators.required]],
      joinDate: [data?.candidate?.tentativeJoinDate ? new Date(data?.candidate?.tentativeJoinDate) : null, [Validators.required]],
      currencyType: [data?.candidate?.currencyType ? data.candidate?.currencyType : null, [Validators.required]],
      currentSalary: [data?.candidate?.currentCtc ? data?.candidate?.currentCtc : null, [Validators.required]],
      expectedSalary: [data?.candidate?.expCtc ? data?.candidate?.expCtc : null, [Validators.required]],
      profileName: [{ disabled: true, value: data?.candidate?.profileid ? data?.candidate?.profileid : null }, [Validators.required]],
      candidateType: [data?.candidate?.candidateType ? data.candidate?.candidateType : null, [Validators.required]],
      // candidateType: [data?.candidate?.candidateType ? data?.candidate?.candidateType === 3 ? 1 : 2 : null],
      offLetter: ['false', [Validators.required]],
      remarkTd: [null],
      CountryID: [data?.candidate?.country ? data?.candidate?.country : null, [Validators.required]],
      CityID: [data?.candidate?.cityId ? data?.candidate?.cityId : null, [Validators.required]],
      StateID: [data?.candidate?.stateId ? data?.candidate?.stateId : null],
      companyName: [null],
      candidateGender: [data?.candidate?.genderId ? data?.candidate?.genderId : null, [Validators.required]],
      candiDob: [data?.candidate?.dob ? data?.candidate?.dob : null, [Validators.required]],
      DivisionID: [data?.DivisionID ? data?.DivisionID : null, [Validators.required]],
      empUnitId: [data?.employeeUnitId ? data?.employeeUnitId : null, [Validators.required]],
      TCID: [data?.CubeID ? data?.CubeID : null, [Validators.required]],
      cluster: [null],
      role: [null],
      cubeClusterId: [null],
      roleId: [null],
      JfCateg: [null],
      gradeId: [data?.gradeId ? data?.gradeId : null, [Validators.required]],
      gradeBand: [data?.gradeBand ? data?.gradeBand : null],
      practiceId: [data?.practiceId ? data?.practiceId : null],
      SalaryType: [data?.candidate?.SalaryType ? data?.candidate?.SalaryType : null, [Validators.required]],
      // interviewDateTimeZone: ['Asia/Kolkata'],
      // interviewDate: [null],
      // interviewTimeHours: [null],
      // interviewTimeMint: [null],
      // IntModeType: [null],
      // interviewDuration: [null],
      // Venue: [{value: null, disabled: true}],
      // panel: [null],
      // AdditionalInterviewer: [null],
      EntityId: [null],
      OfferInHandCTC: [null],

    })

    setTimeout(() => {
      this.getControl('CityID').patchValue(data?.candidate?.cityId ? data?.candidate?.cityId : null);

    }, 1000);
  }

  /** is offer in hand change  */
  public isOfferInHandCTCReq: boolean = false;
  getOfferInHand(e: any) {
    debugger;
    this.showOfferInHandCTC(e.value);
    
  }

  showOfferInHandCTC(isInHandOfferYes: string) {
    debugger
    let OfferInHandCTC = this.getControl('OfferInHandCTC');
    let currencyType = this.getControl('currencyType').value;
    let salTypeCtrl = this.getControl('SalaryType').value;
    if (isInHandOfferYes === 'true'  && this.getLocInfo.isLocationIndia()) {
      this.isOfferInHandCTCReq = true;
     // this.getControl('OfferInHandCTC').setValidators([Validators.required]);
     if (currencyType == 2) {
        // currentSalary.setValidators([Validators.required, Validators.min(this.salRange.usdMin), Validators.max(this.salRange.usdMax)]);
        // expectedSalary.setValidators([Validators.required, Validators.min(this.salRange.usdMin), Validators.max(this.salRange.usdMax)]);
        if (salTypeCtrl == 1) {
          OfferInHandCTC.setValidators([Validators.required, Validators.min(this.salRange.usdMin), Validators.max(this.salRange.usdMax)]);
        } else if (salTypeCtrl == 2) {
          OfferInHandCTC.setValidators([Validators.required, Validators.min(this.salRange.usdMonthlyMin), Validators.max(this.salRange.usdMonthlyMax)]);
        } else if (salTypeCtrl == 3) {
          OfferInHandCTC.setValidators([Validators.required, Validators.min(this.salRange.usdHrlyMin), Validators.max(this.salRange.usdHrlyMax)]);
        }
      }
       else {
        if (salTypeCtrl == 1) {
          OfferInHandCTC.setValidators([Validators.required, Validators.min(this.salRange.inrMin), Validators.max(this.salRange.inrMax)]);
        } else if (salTypeCtrl == 2) {
          OfferInHandCTC.setValidators([Validators.required, Validators.min(this.salRange.inrMonthlyMin), Validators.max(this.salRange.inrMonthlyMax)]);
        } else if (salTypeCtrl == 3) {
          OfferInHandCTC.setValidators([Validators.required, Validators.min(this.salRange.inrHrlyMin), Validators.max(this.salRange.inrHrlyMax)]);
        }
      }
    } else {
     OfferInHandCTC.clearValidators();
      OfferInHandCTC.reset();
      this.isOfferInHandCTCReq = false;
    }
    OfferInHandCTC.updateValueAndValidity();
  }

  /***
 * on mode change
 */
  //  onSelectModeInt(event: any): void {
  //   this.getControl('Venue')?.reset();
  //   let id = event.value;
  //   console.log(id);
  //   if (id == "6" || id == '3') {
  //     this.getControl('Venue')?.disable();
  //   }
  //   else {
  //     this.getControl('Venue')?.enable();
  //   }
  // }

  /***
   * hours Valididation
   */
  // public isTimeZero = true;
  //  hoursValid(event) {
  //   if (event.value == "00") {
  //     // this.isTimeZero = false;
  //     // this.interviewStatus.controls['interviewTimeMint'].patchValue("-1");
  //   }
  //   else {
  //     // this.isTimeZero = true;
  //     // this.interviewStatus.controls['interviewTimeMint'].patchValue("00");
  //   }
  // }

  setValueDefault(data) {
    console.log(data)
    let formData = data.candidate;
    let vv = this.talentDetailsList?.TalentCubeId;
    this.ScheduleFormGroup.patchValue({
      candidateName: data?.candidate?.name,
      phone: data?.candidate?.mobile,
      email: data?.candidate?.email,
      educaQualification: data?.candidate?.education,
      totalExp: data?.candidate?.totalExp,
      totalExpMonth: data?.candidate?.totalExpMonth,
      totalRelExp: data?.candidate?.releventExp,
      totalRelExpMonth: data?.candidate?.releventExpMonth,
      candiDob: data?.candidate?.dob,
      joinDate: data?.candidate?.joinDate,
      profileName: data?.candidate?.profileid,
      candidateType: data?.candidate?.candidateType ? data?.candidate?.candidateType : null,
      // offLetter: data?.candidate?.statusid,
      CountryID: data?.candidate?.country,
      skill: data?.candidate?.primarySkill,
      //  skill: parseInt(data?.sSkillID),
      currentSalary: data?.candidate?.currentCtc,
      currCompany: data?.candidate?.currCompany,
      currencyType: data?.candidate?.currencyType,
      // SalaryType: data?.candidate?.SalaryType,
      candidateGender: data?.candidate?.genderId,
      TCID: this.talentDetailsList?.TalentCubeId ? parseInt(this.talentDetailsList?.TalentCubeId) : null,
      gradeId: this.talentDetailsList?.TCGradeId ? parseInt(this.talentDetailsList?.TCGradeId) : null,
      SalaryType: data?.candidate?.SalaryType

    })
  }

  // get job family Id
  public talentCubeList = [];
  public talentCubeId: number;
  getTCID(e) {
    this.talentCubeList = e?.talentCubeList;
    this.talentCubeId = e?.selectedVal;
    this.OnTCSelectionValidation(this.talentCubeId);
    this.getCubeClusterID(e?.selectedVal, e?.talentCubeList);
  }



  // get employee unit Id
  getEmpUnitId(e) {
    let empUnitIdVal = e;
    this.hideFieldsForSupport(empUnitIdVal);
  }

  //hideFields for Supprt job damily
  hideFieldsForSupport(empUnitId: number) {
    if (empUnitId == 5) {
      this.isPracticeVisible = false;
      this.isGradeVisible = false;
      this.isGradeBandReq = false;
      this.isGradeBandVisible = false;
      this.isSalaryGridVisible = false;
      this.isTCVisible = false;
      this.isClusterVisible = false;
      this.isRoleVisible = false;
      this.clearValidators('TCID');
      this.resetControl('TCID');
      this.resetControl('cubeClusterId');
      this.resetControl('roleId');
      this.clearValidators('gradeId');
      this.resetControl('gradeId');
      this.clearValidators('gradeBand');
      this.resetControl('gradeBand');
      this.clearValidators('cluster');
      this.resetControl('cluster');
      this.clearValidators('cubeClusterId');
      this.resetControl('cubeClusterId');
    } else {
      this.isPracticeVisible = true;
      this.isGradeVisible = true;
      this.isGradeBandVisible = true;
      if (!this.IsRenuTeam) {
        this.isSalaryGridVisible = true;
      }
      this.isTCVisible = true;
      this.isClusterVisible = true;
      this.isRoleVisible = true;
      this.addValidator('TCID');
      this.addValidator('gradeId');
      this.addValidator('cubeClusterId');
      this.addValidator('cluster');
      if (!this.IsRenuTeam) {
        this.addValidator('gradeBand');
        this.isGradeBandReq = true;
      }
    }
  }

  //submit form
  submitInterview(form: UntypedFormGroup) {
    // let intDate = this.getControl('interviewDate')?.value;
    // let joinDate = this.getControl('joinDate')?.value;
    let candidateName = this.getControl('candidateName')?.value;
    // if (intDate > joinDate) {
    //   this._share.showAlertErrorMessage.next(`Interview Date can not be greater than Tentative Joining Date for Candidate -${candidateName ? ' (' + candidateName + ')' : ''}`);
    //   return false;
    // }
    form.markAllAsTouched();
    if (form.valid) {
      let formData = form.value;
      if (formData['currCompany'] == 'other') {
        formData['currCompany'] = formData['companyName'];
      }
      //  formData['interviewDate'] = GlobalMethod.formatDate(formData.intDate) + " " + formData[i].timeHours + ":" + formData[i].timeMint + ":00";
      formData['joiningDate'] = GlobalMethod.formatDate(formData.joinDate) + " " + "00" + ":" + "00" + ":00";
      formData['talentId'] = this.data?.candidate?.talentId;
      formData['thId'] = this.data?.candidate.thId;
      formData['profileName'] = this.data?.candidate?.profileid;
      formData['email'] = this.data?.candidate?.email;
      formData['hiringLocation'] = this._globalCommonMethod.getSetLocation().locId;
      if (this.data?.candidate?.profileid === 3) {
        formData['appliedid'] = this.data?.candidate?.appliedid
      }
      else {
        formData['c_profileUniqId'] = this.data?.candidate?.c_profileUniqId;
      }
      if (formData.candidateGender) {
        formData['Gender'] = formData.candidateGender;
      }
      if (this.data?.candidate?.ApplicantUid) {
        formData['ApplicantUid'] = this.data?.candidate?.ApplicantUid;
      }
      if (this.data?.candidate?.IsFromNaukriAPI) {
        formData['IsFromNaukriAPI'] = this.data?.candidate?.IsFromNaukriAPI;
      }
      // anayt
      this._newInterviewServe.scheduleInterviewScreen(formData).subscribe(
        res => {
          this._share.showAlertSuccessMessage.next(res);
          this.dialogRef.close(true);
        }
      );
    }


  }

  //controls
  get formSchRowGroup() {
    return this.ScheduleFormGroup.get('formSchRowGroup');
  }

  get formGroupControls() {
    return this.formSchRowGroup['controls']
  }

  getControl(name: string) {
    return this.ScheduleFormGroup.get(name);
  }

  public isOtherSelected: boolean = false;
  getCompany(val: string) {
    let control = this.getControl('companyName');
    if (val === 'other') {
      this.isOtherSelected = true;
      control.setValidators([Validators.required]);
    }
    else {
      this.isOtherSelected = false;
      control.clearValidators();
    }
    control.updateValueAndValidity();
  }

  //  get currencyTypeData
  public currencyTypeData: any = [];
  getCurrencyType() {
    this._globalApi.getCurrency().subscribe(
      res => {
        this.currencyTypeData = res;
      }
    );
  }

  //reset form
  resetForm(): void {
    this.ScheduleFormGroup.reset();

  }
  /***
   * get requition details
   */
  getReqDetails(thId: number) {
    this._globalApi.getRequisitionTHID(thId).subscribe(
      res => {
        this.panelData = res[0]
      }
    )
  }

  /**
   * view talent id details
   * @param data
   */
  viewTalentIdDetails(data) {
    const dialogRef = this.dialog.open(ViewInfoTalentidComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'ats-model-talent'],
      data: data,
      disableClose: true
    });
  }

  //country id
  public CountryId: number;
  getCountry(e) {
    this.CountryId = e;
  }



  public interviewTypeData: any = [];
  getIntType() {
    //Get interview type
    this._intCommonServe.getInterviewType().subscribe(
      res => {
        let filterById = [1];
        let dataRes = res['data'];
        let filterByStatus = dataRes.filter(t => {
          return filterById.indexOf(t.id) !== -1;
        });
        this.interviewTypeData = filterByStatus;
      }
    )
  }

  /***
   * interview Mode
   */
  public intModeData: any = [];
  getIntMode() {
    this._intCommonServe.getIntMode().subscribe(
      res => {
        this.intModeData = res;
      }
    );
  }
  /**
   * getProfileSource
   */
  getProfileSource(data: any) {
    //get Profile Name
    this._intCommonServe.getProfileName().subscribe(
      res => {
        if (environment.locationWise) {
          if (this.getLocInfo.isLocationIndia()) {
            this.profileNameData = this._globalCommonMethod.getProfileIndia(data, res, [1, 2, 6, 3, 4, 5, 10, 15]);
          }
          else {
            this.profileNameData = this._globalCommonMethod.getProfileUs(data, res);
          }
        }
        else {
          this.profileNameData = this._globalCommonMethod.getProfileIndia(data, res);
        }
      }
    );
  }


  TotalExp(event: any) {
    let totalExp = this.getControl('totalExp').value;
    let totalExpM = this.getControl('totalExpMonth').value;

    if (totalExp == 0) {
      if (totalExpM > 1) {
        this.addvalidationMinMax()
      }
      else {
        this.claervalidationMinMax();
      }
    }
    else {
      this.addvalidationMinMax()
    }
  }



  addvalidationMinMax() {
    let currentSalary = this.getControl('currentSalary');
    let expectedSalary = this.getControl('expectedSalary');
    let currencyType = this.getControl('currencyType').value;
    let salTypeCtrl = this.getControl('SalaryType').value;
    if (this.getLocInfo.isLocationIndia()) {
      if (currencyType == 2) {
        // currentSalary.setValidators([Validators.required, Validators.min(this.salRange.usdMin), Validators.max(this.salRange.usdMax)]);
        // expectedSalary.setValidators([Validators.required, Validators.min(this.salRange.usdMin), Validators.max(this.salRange.usdMax)]);
        if (salTypeCtrl == 1) {
          currentSalary.setValidators([Validators.required, Validators.min(this.salRange.usdMin), Validators.max(this.salRange.usdMax)]);
          expectedSalary.setValidators([Validators.required, Validators.min(this.salRange.usdMin), Validators.max(this.salRange.usdMax)]);
        } else if (salTypeCtrl == 2) {
          currentSalary.setValidators([Validators.required, Validators.min(this.salRange.usdMonthlyMin), Validators.max(this.salRange.usdMonthlyMax)]);
          expectedSalary.setValidators([Validators.required, Validators.min(this.salRange.usdMonthlyMin), Validators.max(this.salRange.usdMonthlyMax)]);
        } else if (salTypeCtrl == 3) {
          currentSalary.setValidators([Validators.required, Validators.min(this.salRange.usdHrlyMin), Validators.max(this.salRange.usdHrlyMax)]);
          expectedSalary.setValidators([Validators.required, Validators.min(this.salRange.usdHrlyMin), Validators.max(this.salRange.usdHrlyMax)]);
        }
      }
      else {
        // currentSalary.setValidators([Validators.required, Validators.min(this.salRange.inrMin), Validators.max(this.salRange.inrMax)]);
        // expectedSalary.setValidators([Validators.required, Validators.min(this.salRange.inrMin), Validators.max(this.salRange.inrMax)]);
        if (salTypeCtrl == 1) {
          currentSalary.setValidators([Validators.required, Validators.min(this.salRange.inrMin), Validators.max(this.salRange.inrMax)]);
          expectedSalary.setValidators([Validators.required, Validators.min(this.salRange.inrMin), Validators.max(this.salRange.inrMax)]);
        } else if (salTypeCtrl == 2) {
          currentSalary.setValidators([Validators.required, Validators.min(this.salRange.inrMonthlyMin), Validators.max(this.salRange.inrMonthlyMax)]);
          expectedSalary.setValidators([Validators.required, Validators.min(this.salRange.inrMonthlyMin), Validators.max(this.salRange.inrMonthlyMax)]);
        } else if (salTypeCtrl == 3) {
          currentSalary.setValidators([Validators.required, Validators.min(this.salRange.inrHrlyMin), Validators.max(this.salRange.inrHrlyMax)]);
          expectedSalary.setValidators([Validators.required, Validators.min(this.salRange.inrHrlyMin), Validators.max(this.salRange.inrHrlyMax)]);
        }
      }
    }
    else {
      if (currencyType == 2) {
        // currentSalary.setValidators([Validators.min(this.salRange.usdMin),Validators.max(this.salRange.usdMax)]);
        expectedSalary.setValidators([Validators.required]);
        currentSalary.clearValidators();
      }
      else {
        // currentSalary.setValidators([Validators.min(this.salRange.inrMin),Validators.max(this.salRange.inrMax)]);
        expectedSalary.setValidators([Validators.required]);
        currentSalary.clearValidators();
        // expectedSalary.setValidators([Validators.min(100000)]);
      }
    }
    currentSalary.updateValueAndValidity();
    expectedSalary.updateValueAndValidity();

  }
  public salRange: any = salaryMinMaxLoc;
  claervalidationMinMax() {
    let currentSalary = this.getControl('currentSalary');
    let expectedSalary = this.getControl('expectedSalary');
    let currencyType = this.getControl('currencyType').value;
    let salTypeCtrl = this.getControl('SalaryType').value;
    if (this.getLocInfo.isLocationIndia()) {
      if (currencyType == 2) {
        // currentSalary.setValidators([Validators.required, Validators.min(0), Validators.max(this.salRange.usdMax)]);
        // expectedSalary.setValidators([Validators.required, Validators.min(0), Validators.max(this.salRange.usdMax)]);
        if (salTypeCtrl == 1) {
          currentSalary.setValidators([Validators.required, Validators.min(0), Validators.max(this.salRange.usdMax)]);
          expectedSalary.setValidators([Validators.required, Validators.min(0), Validators.max(this.salRange.usdMax)]);
        } else if (salTypeCtrl == 2) {
          currentSalary.setValidators([Validators.required, Validators.min(0), Validators.max(this.salRange.usdMonthlyMax)]);
          expectedSalary.setValidators([Validators.required, Validators.min(0), Validators.max(this.salRange.usdMonthlyMax)]);
        } else if (salTypeCtrl == 3) {
          currentSalary.setValidators([Validators.required, Validators.min(0), Validators.max(this.salRange.usdHrlyMax)]);
          expectedSalary.setValidators([Validators.required, Validators.min(0), Validators.max(this.salRange.usdHrlyMax)]);
        }
      }
      else {
        // currentSalary.setValidators([Validators.required, Validators.min(0), Validators.max(this.salRange.inrMax)]);
        // expectedSalary.setValidators([Validators.required, Validators.min(0), Validators.max(this.salRange.inrMax)]);
        if (salTypeCtrl == 1) {
          currentSalary.setValidators([Validators.required, Validators.min(0), Validators.max(this.salRange.inrMax)]);
          expectedSalary.setValidators([Validators.required, Validators.min(0), Validators.max(this.salRange.inrMax)]);
        } else if (salTypeCtrl == 2) {
          currentSalary.setValidators([Validators.required, Validators.min(0), Validators.max(this.salRange.inrMonthlyMax)]);
          expectedSalary.setValidators([Validators.required, Validators.min(0), Validators.max(this.salRange.inrMonthlyMax)]);
        } else if (salTypeCtrl == 3) {
          currentSalary.setValidators([Validators.required, Validators.min(0), Validators.max(this.salRange.inrHrlyMax)]);
          expectedSalary.setValidators([Validators.required, Validators.min(0), Validators.max(this.salRange.inrHrlyMax)]);
        }
      }

    }
    else {
      if (currencyType == 2) {
        // currentSalary.setValidators([Validators.min(0), Validators.max(this.salRange.usdMax)]);
        // expectedSalary.setValidators([Validators.required, Validators.min(0), Validators.max(this.salRange.usdMax)]);
        expectedSalary.setValidators([Validators.required]);
        currentSalary.clearValidators();
        // if(salTypeCtrl == 1){
        //   currentSalary.setValidators([Validators.min(0), Validators.max(this.salRange.usdMax)]);
        //   expectedSalary.setValidators([Validators.required, Validators.min(0), Validators.max(this.salRange.usdMax)]);
        // }else if(salTypeCtrl == 2){
        //   currentSalary.setValidators([Validators.min(0), Validators.max(this.salRange.usdMonthlyMax)]);
        //   expectedSalary.setValidators([Validators.required, Validators.min(0), Validators.max(this.salRange.usdMonthlyMax)]);
        // }else if(salTypeCtrl == 3){
        //   currentSalary.setValidators([Validators.min(0), Validators.max(this.salRange.usdHrlyMax)]);
        //   expectedSalary.setValidators([Validators.required, Validators.min(0), Validators.max(this.salRange.usdHrlyMax)]);
        // }
      }
      else {
        // currentSalary.setValidators([Validators.min(0), Validators.max(this.salRange.inrMax)]);
        // expectedSalary.setValidators([Validators.required, Validators.min(0), Validators.max(this.salRange.inrMax)]);
        expectedSalary.setValidators([Validators.required]);
        currentSalary.clearValidators();
        // if(salTypeCtrl == 1){
        //   currentSalary.setValidators([Validators.min(0), Validators.max(this.salRange.inrMax)]);
        //   expectedSalary.setValidators([Validators.required, Validators.min(0), Validators.max(this.salRange.inrMax)]);
        // }else if(salTypeCtrl == 2){
        //   currentSalary.setValidators([Validators.min(0), Validators.max(this.salRange.inrMonthlyMax)]);
        //   expectedSalary.setValidators([Validators.required, Validators.min(0), Validators.max(this.salRange.inrMonthlyMax)]);
        // }else if(salTypeCtrl == 3){
        //   currentSalary.setValidators([Validators.min(0), Validators.max(this.salRange.inrHrlyMax)]);
        //   expectedSalary.setValidators([Validators.required, Validators.min(0), Validators.max(this.salRange.inrHrlyMax)]);
        // }
      }
    }

    currentSalary.updateValueAndValidity();
    expectedSalary.updateValueAndValidity();
  }

  public candidateTypeData: any = [];
  getEmpType() {
    //get cand type
    this._intCommonServe.getCandidateType().subscribe(
      res => {
        let filterById: any = [];
        if (environment.locationWise) {
          if (this.getLocInfo.isLocationIndia()) {
            filterById = [1, 2];
          }
          else {
            filterById = [4, 5, 6, 7, 8, 9];
          }

        }
        else {
          filterById = [1, 2];
        }
        this.candidateTypeData = res.filter(t => {
          return filterById.indexOf(t.typeId) !== -1;
        });
      }
    );
  }

  /***
   * get Interview Mode
   */
  //  getIntMode() {
  //   this.isloader = true;
  //   this._intCommonServe.getIntMode().subscribe(
  //     res => {
  //       this.intModeData = res;
  //       this.isloader = false;
  //     },
  //     (error) => {
  //       this.isloader = false;
  //     }
  //   );
  // }

  public EmpListData: any = [];
  getEmpList(data: any) {
    this.EmpListData = data;
  }

  // viewCalender() {
  //   let empIdArr = [];
  //   let panelControl = this.getControl('panel')?.value;
  //   let adpanelControl = this.getControl('AdditionalInterviewer')?.value;
  //   let date: string = this.getControl('interviewDate')?.value;
  //   if (adpanelControl) {
  //     empIdArr = adpanelControl;
  //   }
  //   if (panelControl) {
  //     empIdArr.push(panelControl)
  //   }
  //   let filterData: any = [];
  //   if (this.getControl('interviewDate')?.invalid) {
  //     this._share.showAlertErrorMessage.next('Please select Interview Date.')
  //   }
  //   else if (empIdArr.length === 0) {
  //     this._share.showAlertErrorMessage.next('Please select Panel.')
  //   }
  //   else if (empIdArr.length !== 0 && date) {

  //     filterData = this.EmpListData.filter(t => {
  //       return empIdArr.indexOf(t.empnewid) !== -1;
  //     });
  //     let data = {
  //       fromDate: GlobalMethod.formatDate(date),
  //       toDate: GlobalMethod.formatDate(date),
  //       empInfo: filterData
  //     }

  //     const dialogRef = this.dialog.open(ViewCalenderHistoryComponent, {
  //       width: '650px',
  //       panelClass: ['ats-model-wrap', 'ats-model-lg', , 'ats-model-cl'],
  //       backdropClass: 'calender-overlay',
  //       data: data,
  //       disableClose: true
  //     });
  //     dialogRef.afterClosed().subscribe(result => {
  //       if (result) {

  //       }
  //     });
  //   }
  // }

  closeModal(): void {
    this.dialogRef.close();
  }

}
