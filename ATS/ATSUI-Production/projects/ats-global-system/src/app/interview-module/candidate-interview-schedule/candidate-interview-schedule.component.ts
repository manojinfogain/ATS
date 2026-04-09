import { AfterContentInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, Subscription } from 'rxjs';
import { GetLocationInfo } from 'projects/ats-global-system/src/app/core/common/getLocationInfo';
import { GlobalCommonMethodService } from 'projects/ats-global-system/src/app/core/common/global-common-method.service';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { COMMON_CONST, FILE_UPLOAD, salaryMinMaxLoc, tcSupportList } from 'projects/ats-global-system/src/app/core/constant/common.const';
import { CONSTANTS } from 'projects/ats-global-system/src/app/core/constant/constants';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { InterviewCommonService } from 'projects/ats-global-system/src/app/core/services/interview-common.service';
import { NewInterviewService } from 'projects/ats-global-system/src/app/core/services/new-interview.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { ViewInfoTalentidComponent } from 'projects/ats-global-system/src/app/dashboard-module/modal/view-info-talentid/view-info-talentid.component';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { JdPanelConfirmationModalComponent } from '../modals/jd-panel-confirmation-modal/jd-panel-confirmation-modal.component';
import { InterviewMessageAlertComponent } from './modal/interview-message-alert/interview-message-alert.component';
import { ViewCalenderHistoryComponent } from '../../shared/shared-app/components/view-calender-history/view-calender-history.component';
import { TalentService } from '../../talent-module/talent.service';
import { G5AboveCpmmon } from '../../core/common/g5AboveCommon';

@Component({
  selector: 'app-candidate-interview-schedule',
  templateUrl: './candidate-interview-schedule.component.html',
  styleUrls: ['./candidate-interview-schedule.component.scss']
})
export class CandidateInterviewScheduleComponent implements OnInit, AfterContentInit, OnDestroy {
  public panelData: any = {};
  public step: number = 0;
  public profileNameData: any = [];
  ScheduleFormGroup: UntypedFormGroup;
  minDate = new Date();
  public c_profileUniqId: number;
  public updateFormSubs: Subscription;
  public talentIdControl: UntypedFormControl = new UntypedFormControl();
  public today = new Date();
  public maxDate = new Date(this.today.getFullYear() - 10, this.today.getMonth(), this.today.getDate());
  public salaryTypeList: any = this.getSalaryTypeListLocationWise();
  public JfCategList: any = CONSTANTS.JfCategList;
  public entityList: any = [];
  // public durationData: any[] = CONSTANTS.interviewDuration;

  //@ViewChild(MatAccordion) accordion: MatAccordion;
  constructor(
    private _newInterviewServe: NewInterviewService,
    private _fb: UntypedFormBuilder,
    private acttive: ActivatedRoute,
    private _globalApi: GlobalApisService,
    public dialog: MatDialog,
    private _globalMethodServe: GlobalCommonMethodService,
    private _intCommonServe: InterviewCommonService,
    private _share: ShareService,
    private getLocInfo: GetLocationInfo,
    private _globalCommonMethod: GlobalCommonMethodService,
    private _talentServ: TalentService
  ) { }

  get formSchRowGroup() {
    return (this.ScheduleFormGroup.get('formSchRowGroup') as UntypedFormArray);
  }
  get formGroupControls() {
    return this.formSchRowGroup['controls']
  }
  public queryExtTokenDataS: any;
  ngOnInit(): void {
    this.getGender();
    let queryToken = this.acttive['snapshot'].queryParams.query;
    let queryExtTokenData = queryToken ? this._globalMethodServe.decryptData(queryToken) : null;
    this.queryExtTokenDataS = queryExtTokenData;
    this.formInit();
    const control = this.formSchRowGroup;
    this.getProfileSource(queryExtTokenData);
    this.getEmpType();
    this.getIntMode();
    this.getIntType();
    this.getCurrencyType();
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
  getDivisionID(e: number, index: number) {
    const formGroupControl = this.formSchRowGroup['controls'];
    let empUnitId = formGroupControl[index]['controls'].empUnitId?.value;
    if (this.getLocInfo.isLocationIndia()) {
      if (!this.isRenuTeam) {
        formGroupControl[index]['controls'].gradeBand.setValidators([Validators.required]);
      }

    }
    formGroupControl[index]['controls'].gradeBand.updateValueAndValidity();
    this.hideFieldsForSupport(empUnitId, index);
    this.OnTCSelectionValidation(this.talentCubeId, index);
  }

  // get Talent Cube Id
  public talentCubeList = [];
  public talentCubeId: number;
  getTCID(e: any, index: number) {
    const formGroupControl = this.formSchRowGroup['controls'];
    this.talentCubeList = e?.talentCubeList;
    this.talentCubeId = e?.selectedVal;
    this.OnTCSelectionValidation(this.talentCubeId, index);
    this.getCubeClusterID(e?.selectedVal, e?.talentCubeList, index);
  }

  // To Remove Validation for cluster when TCID is 61
  OnTCSelectionValidation(tcId: any, index: any) {
    const formGroupControl = this.formSchRowGroup['controls'];
    if (tcSupportList.supportItems.find(x => x === tcId)) {
      formGroupControl[index]['controls'].cluster?.reset();
      formGroupControl[index]['controls'].cluster.clearValidators();
      formGroupControl[index]['controls'].cubeClusterId?.reset();
      formGroupControl[index]['controls'].cubeClusterId.clearValidators();
    } else {
      if (this.getLocInfo.isLocationIndia()) {
        formGroupControl[index]['controls'].cluster.addValidators([
          Validators.required,
        ]);
        formGroupControl[index]['controls'].cubeClusterId.addValidators([
          Validators.required,
        ]);
      }
    }
    formGroupControl[index]['controls'].cluster.updateValueAndValidity();
    formGroupControl[index]['controls'].cubeClusterId.updateValueAndValidity();
  }

  getTCList(e: any) {
    this.talentCubeList = e;
  }

  //get grade Id
  getGradeId(e: any, index: number) {
    const formGroupControl = this.formSchRowGroup['controls'];
    this.getCubeClusterID(this.talentCubeId, this?.talentCubeList, index);
  }

  /**
  *
  * @param e get Cub Cluster Id
  */
  public filterCubeList: any = {};
  getCubeClusterID(tcId, tcList, index, type: string = 'I'): any {
    if (type == 'I') {
      const formGroupControl = this.formSchRowGroup['controls'];
      let gradeId = formGroupControl[index]['controls'].gradeId?.value;
      this.filterCubeList = tcList?.filter(r => r?.CubeId == tcId)[0];
      if (gradeId && tcId) {
        this.getRoleByTalentCube(tcId, gradeId, index);
      }
    }
    else {
      this.filterCubeList = tcList?.filter(r => r?.CubeId == tcId)[0];
      if (this.talentDetailsList?.TCGradeId && this.talentDetailsList?.TalentCubeId) {
        this.getRoleByTalentCube(this.talentDetailsList?.TalentCubeId, this.talentDetailsList?.TCGradeId, index, type);
      }
    }
  }

  //get role cluster
  //  public RoleTalentCube: any = {};
  getRoleByTalentCube(talentCubeCode: number, gradeId: number, index: number, type: string = 'I') {
    this._globalApi.getRoleByTalentCube(talentCubeCode, gradeId).subscribe(
      res => {
        let RoleTalentCube = res['data'][0];
        if (type == 'I') {
          const formGroupControl = this.formSchRowGroup['controls'];
          let cluster = formGroupControl[index]['controls'].cluster;
          let role = formGroupControl[index]['controls'].role;
          let cubeClusterId = formGroupControl[index]['controls'].cubeClusterId;
          let roleId = formGroupControl[index]['controls'].roleId;
          cluster.patchValue(this.filterCubeList?.ClusterName);
          role.patchValue(RoleTalentCube?.RoleName);
          cubeClusterId.patchValue(this.filterCubeList?.ClusterId);
          roleId.patchValue(RoleTalentCube?.RoleId);
        }
        else {
          setTimeout(() => {
            this.patchValueToCtrl('cluster', this.filterCubeList?.ClusterName);
            this.patchValueToCtrl('role', RoleTalentCube?.RoleName);
            this.patchValueToCtrl('cubeClusterId', this.filterCubeList?.ClusterId);
            this.patchValueToCtrl('roleId', RoleTalentCube?.RoleId);
          }, 1000);
        }

      }
    );
  }

  // get employee unit Id
  // public EmpUnitID:number = 0;
  getEmpUnitId(e, index: number) {
    let empUnitIdVal = e;
    this.hideFieldsForSupport(empUnitIdVal, index);
  }


  //hideFields for Supprt job damily
  hideFieldsForSupport(empUnitId: number, index: number) {
    const formGroupControl = this.formSchRowGroup['controls'];
    if (empUnitId == 5) {
      formGroupControl[index]['controls'].TCID?.clearValidators();
      formGroupControl[index]['controls'].TCID?.reset();
      formGroupControl[index]['controls'].cubeClusterId?.reset();
      formGroupControl[index]['controls'].cubeClusterId.clearValidators();
      formGroupControl[index]['controls'].cluster?.reset();
      formGroupControl[index]['controls'].cluster.clearValidators();
      formGroupControl[index]['controls'].roleId?.reset();
      formGroupControl[index]['controls'].roleId?.clearValidators();
      formGroupControl[index]['controls'].role?.reset();
      formGroupControl[index]['controls'].role.clearValidators();
      formGroupControl[index]['controls'].gradeId.clearValidators();
      formGroupControl[index]['controls'].gradeId.reset();
      formGroupControl[index]['controls'].gradeBand.clearValidators();
      formGroupControl[index]['controls'].gradeBand.reset();
    }
    else {
      if (this.getLocInfo.isLocationIndia()) {
        formGroupControl[index]['controls'].TCID.addValidators([Validators.required]);
        formGroupControl[index]['controls'].gradeId.addValidators([Validators.required]);
        //formGroupControl[index]['controls'].gradeBand.addValidators([Validators.required]);
        formGroupControl[index]['controls'].cubeClusterId.addValidators([Validators.required]);
        formGroupControl[index]['controls'].cluster.addValidators([Validators.required]);
        if (!this.isRenuTeam) {
          formGroupControl[index]['controls'].gradeBand.addValidators([Validators.required]);
        }
        // formGroupControl[index]['controls'].roleId.addValidators([Validators.required]);
        // formGroupControl[index]['controls'].role.addValidators([Validators.required]);
      }
    }
    formGroupControl[index]['controls'].TCID.updateValueAndValidity();
    formGroupControl[index]['controls'].gradeId.updateValueAndValidity();
    formGroupControl[index]['controls'].gradeBand.updateValueAndValidity();
    formGroupControl[index]['controls'].cubeClusterId.updateValueAndValidity();
    formGroupControl[index]['controls'].cluster.updateValueAndValidity();
    formGroupControl[index]['controls'].roleId.updateValueAndValidity();
    formGroupControl[index]['controls'].role.updateValueAndValidity();
    let talentCubeId = formGroupControl[index]['controls'].TCID?.value;
    this.OnTCSelectionValidation(talentCubeId, index);
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

  public getExistData: any = {};
  public locationData: any = {};
  ngAfterContentInit(): void {
    this.locationData = this.getLocInfo;
    let queryToken = this.acttive['snapshot'].queryParams.query;
    let queryExtTokenData = queryToken ? this._globalMethodServe.decryptData(queryToken) : null;
    this.getExistData = queryExtTokenData;
    if (queryExtTokenData?.talentId && queryExtTokenData?.thId) {
      this.setDataForm(queryExtTokenData);
      this.getReqDetails(queryExtTokenData.thId);

    }

    this.updateFormSubs = this._share.detectSwitchLoc.subscribe(
      get => {
        this.updateValidatorLocWise();
        this.getEmpType();
        this.getProfileSource(queryExtTokenData);
      }
    )
  }


  public CountryId: number;
  getCountry(e) {
    this.CountryId = e;
  }

  getControl(name: string, index: number) {
    return this.formGroupControls[index].get(name);
  }
  /***
   * form Init Schedule interview
   */
  formInit() {
    this.ScheduleFormGroup = this._fb.group(
      {
        formSchRowGroup: this._fb.array([])
      }
    )
  }

  getValFromControl(data: any, i: number) {
    const formGroupControl = this.formSchRowGroup['controls'];
    let ctrl = formGroupControl[i]['controls'].companyName;
    if (data == 'other') {
      ctrl.setValidators([Validators.required])
    }
    else {
      ctrl.clearValidators();
    }
    ctrl.updateValueAndValidity();
  }
  /**
   * patch value to ctrl
   * @param name
   * @param value
   */
  patchValueToCtrl(name: string, value: string) {
    const formGroupControl = this.formSchRowGroup['controls'];
    for (let i = 0; i < formGroupControl.length; i++) {
      let ctrl = formGroupControl[i]['controls'][name];
      if (name == 'currencyType') {
        ctrl.patchValue(parseInt(value));
      }
      else {
        ctrl.patchValue(value);
      }

    }
  }

  numberLimit(index: number) {
    const formGroupControl = this.formSchRowGroup['controls'];
    let ctrl = formGroupControl[index]['controls']['phone'];
    if (this.getLocInfo.isLocationIndia()) {
      ctrl.setValidators([Validators.required, Validators.minLength(10), Validators.maxLength(10)]);
    } else {
      ctrl.setValidators([Validators.required]);

    }
    ctrl.updateValueAndValidity();
  }

  /**
   * add validators
   * @param name
   */
  addValidator(name: string, type?: string, min: number = 0, max: number = 0) {
    const formGroupControl = this.formSchRowGroup['controls'];
    for (let i = 0; i < formGroupControl.length; i++) {
      let ctrl = formGroupControl[i]['controls'][name];
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
  }

  /**
   * clear validator
   * @param name
   */
  clearValidators(name: string) {
    const formGroupControl = this.formSchRowGroup['controls'];
    for (let i = 0; i < formGroupControl.length; i++) {
      let ctrl = formGroupControl[i]['controls'][name];
      ctrl.clearValidators();
      ctrl.updateValueAndValidity();
    }
  }

  /**
   * reset
   * @param name
   */
  resetControl(name: string) {
    const formGroupControl = this.formSchRowGroup['controls'];
    for (let i = 0; i < formGroupControl.length; i++) {
      let ctrl = formGroupControl[i]['controls'][name];
      ctrl.reset();
    }
  }
  /**\
   * update control validity
   */

  public hideCurrentSalaryCtrl: boolean = true;
  public hideCountryCtrl: boolean = true;
  public hideStateCtrl: boolean = true;
  public isGenderVisible: boolean = false;
  public isDobVisible: boolean = true;
  public isDivisionVisible: boolean = true;
  public isTCVisible: boolean = true;
  public isGradeVisible: boolean = true;
  public isRoleVisible: boolean = true;
  public isClusterVisible: boolean = true;
  public isGradeBandVisible: boolean = true;
  public isGradeBandrequired: boolean = false;
  public isSalaryGridVisible: boolean = true;
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
      this.isGradeVisible = true;
      this.isClusterVisible = true;
      this.isRoleVisible = true;
      this.isGradeBandVisible = true;
      this.isSalaryGridVisible = true;
      // this.isSalaryTypeVisible = false;
      this.isPracticeVisible = true;
      this.isEmpUnitVisible = true;
      // this.isTimeZoneVisible = true;
      // this.isIntDateVisible = true;
      // this.isIntTimeHrVisible = true;
      // this.isIntTimeMinVisible = true;
      // this.isIntModeVisible = true;
      // this.isIntDurVisible = true;
      // this.isVenueVisible = true;
      // this.isPrimIntVisible = true;
      // this.isAddIntVisible = true;
      this.isWithCountryCode = false;
      // this.addValidator('countryCode');      
      this.clearValidators('countryCode');
      this.resetControl('countryCode');
      this.addValidator('currCompany');
      this.addValidator('phone', 'minmax', 10, 10);
      this.addValidator('educaQualification');
      this.addValidator('DivisionID');
      this.addValidator('gradeId');
      if (!this.isRenuTeam) {
        this.isGradeBandrequired = true;
        this.addValidator('gradeBand');
      }

      this.addValidator('TCID');
      this.addValidator('offLetter');
      this.addValidator('currentSalary');
      this.addValidator('candiDob');
      this.addValidator('CountryID');
      this.addValidator('empUnitId');
      this.addValidator('cubeClusterId');
      this.addValidator('cluster');
      // this.addValidator('role');
      //  this.addValidator('roleId');
      // this.addValidator('interviewDateTimeZone');
      // this.addValidator('interviewDate');
      // this.addValidator('interviewTimeHours');
      // this.addValidator('interviewTimeMint');
      // this.addValidator('IntModeType');
      // this.addValidator('interviewDuration');
      // this.addValidator('panel');
      this.clearValidators('StateID');
      this.resetControl('StateID');
      // this.clearValidators('SalaryType');
      // this.resetControl('SalaryType');
      this.hideStateCtrl = false;
      // this.addValidator('candidateGender');

    }

    else if (this.getLocInfo.isLocationUS()) {
      this.hideStateCtrl = true;
      // this.isSalaryTypeVisible = true;
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
      this.clearValidators('candiDob');
      this.resetControl('candiDob');
      this.clearValidators('empUnitId');
      this.resetControl('empUnitId');
      this.resetControl('cluster');
      this.resetControl('cubeClusterId');
      this.resetControl('role');
      this.resetControl('roleId');
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
      this.isWithCountryCode = true;
      // this.addValidator('SalaryType');
      //  this.clearValidators('candidateGender');
      this.isGenderVisible = false;
      this.isDobVisible = false;
      this.isDivisionVisible = false;
      this.isTCVisible = false;
      this.isGradeVisible = false;
      this.isRoleVisible = false;
      this.isClusterVisible = false;
      this.isGradeBandVisible = false;
      this.isGradeBandrequired = false;
      this.isSalaryGridVisible = false;
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
    }
    else {

    }
    this.patchValueToCtrl('currencyType', this.getCrrLocId().toString());
  }
  /***
   * get Loc Id
   */
  getCrrLocId() {
    if (this.getLocInfo.isLocationIndia()) {
      return 1
    }
    else if (this.getLocInfo.isLocationUS()) {
      return 2
    }
    else {
      return 1
    }
  }
  /*** dynamic control for form */
  initItemRow(data) {
    let TalentEmpUnit = this.talentDetailsList?.DeliveryOrFunction;
    return this._fb.group({
      profileName: [{ disabled: data?.addExist, value: data?.profileid ? data?.profileid : null }, [Validators.required]],
      appliedid: [data?.appliedid ? data?.appliedid : null],
      c_profileUniqId: [data?.c_profileUniqId ? data?.c_profileUniqId : ''],
      addExist: [data.addExist == true ? 1 : 0],
      //  candidateName: [data?.name ? data?.name : null, [Validators.required]],
      firstName: [null, [Validators.required]],
      middleName: [null],
      lastName: [null],
      email: [{ disabled: data?.addExist, value: data ? data.email : null }, [Validators.required, Validators.pattern(COMMON_CONST.emailregex)]],
      countryCode: [data?.countryCode ? data?.countryCode : null],
      phone: [data?.mobile ? data?.mobile : null, [Validators.required]],
      candidateType: [data?.candidateType ? data?.candidateType : null, [Validators.required]],
      // interviewDateTimeZone: ['Asia/Kolkata'],
      // interviewDate: [null],
      // interviewTimeHours: [null],
      // interviewTimeMint: [null],
      joinDate: [null, [Validators.required]],
      currentSalary: [data?.currentCtc ? data?.currentCtc : null, [Validators.required]],
      expectedSalary: [data?.expCtc ? data?.expCtc : null],
      currencyType: [data?.currencyType ? data?.currencyType : this.getCrrLocId(), [Validators.required]],
      offLetter: ['false', [Validators.required]],
      OfferInHandCTC: [null],
      companyName: [null],

      // IntModeType: [null],
      // panel: [null],
      // AdditionalInterviewer: [null],
      //  talentVal: [null],
      //  talentIds: [null],
      remarkTd: [null],
      // Venue: [{ value: null, disabled: true }],
      //newly added column
      totalExp: [data?.totalExp ? data?.totalExp : null, [Validators.required]],
      totalExpMonth: [data?.totalExpMonth ? data?.totalExpMonth : null, [Validators.required]],
      totalRelExp: [data?.releventExp ? data?.releventExp : null, [Validators.required]],
      totalRelExpMonth: [data?.releventExpMonth ? data?.releventExpMonth : null, [Validators.required]],
      skill: [data?.primarySkill ? parseInt(data?.primarySkill) : null, [Validators.required]],
      DivisionID: [null],
      currCompany: [data?.currentCompany ? data?.currentCompany : null, [Validators.required]],
      CityID: [data?.cityId ? data?.cityId : null, [Validators.required]],
      educaQualification: [data?.education ? data?.education : null, [Validators.required]],
      TCID: [this.talentDetailsList?.TalentCubeId ? parseInt(this.talentDetailsList?.TalentCubeId) : null],
      cluster: [null],
      role: [null],
      cubeClusterId: [null],
      roleId: [null],
      JfCateg: [null],
      practiceId: [null],
      gradeId: [this.talentDetailsList?.TCGradeId ? this.talentDetailsList?.TCGradeId : null],
      gradeBand: [null],
      // currOrganisation: [null],
      // interviewType: [null, [Validators.required]],
      // interviewDuration: [null],
      CountryID: [data?.countryId ? data?.countryId : null],
      filesUpload: [{ disabled: data?.addExist, value: null }, [Validators.required]],
      resume: [''],
      StateID: [null],
      // candidateGender:[null],
      candidateGender: [null, [Validators.required]],
      candiDob: [data?.DOB ? data?.DOB : null],
      SalaryType: [1, [Validators.required]],
      empUnitId: [TalentEmpUnit == 1 ? 1 : null],
      EntityId: [null]
    })


  }

  /**
   * insert Data to form
   */
  setDataForm(data: any) {
    const control = this.formSchRowGroup;
    this.talentId = data.talentId;
    this.thId = data.thId
    setTimeout(() => {
      control.push(this.initItemRow(data));
      this.updateValidatorLocWise();
    }, 500);

  }

  public thId: number;
  public talentId: string = '';
  public isRenuTeam: boolean = false;
  getDataTalent(data) {
    this.thId = data.TH_ID;
    this.talentId = data.talentID;
    if (data?.IsRenuTeam == 'Y') {
      this.isRenuTeam = true;
    }
    else {
      this.isRenuTeam = false;
    }
    // jd clrification panel avl api
    this._intCommonServe.getJDPanelAvailableDetails(data.TH_ID).subscribe(
      res => {
        let dataJD = res['data'][0];
        if (dataJD.JDAvailable == 'Y' && dataJD.PanelAvailable == 'Y') {
          this.addUpdateControl(data)
        }
        else {
          data['th_id'] = data?.TH_ID;
          this.openConfirmationModal(data);
        }
      }
    )


  }
  //for interview schedule
  addUpdateControl(data: any) {
    const control = this.formSchRowGroup;
    this.getReqDetails(data.TH_ID);

    setTimeout(() => {
      if (control.length === 0) {
        control.push(this.initItemRow({ addExist: false }));
      }
      else {
        const formGroupControl = this.formSchRowGroup['controls'];
        for (let i = 0; i < formGroupControl.length; i++) {
          formGroupControl[i]['controls'].TCID.patchValue(this.talentDetailsList?.TalentCubeId ? parseInt(this.talentDetailsList?.TalentCubeId) : null);
          if (this.isRenuTeam) {
            formGroupControl[i]['controls'].gradeBand.clearValidators();
            formGroupControl[i]['controls'].gradeBand.updateValueAndValidity();
          }
          else {
            formGroupControl[i]['controls'].gradeBand.addValidators([Validators.required]);
            formGroupControl[i]['controls'].gradeBand.updateValueAndValidity();
          }

        }
      }

      //this.updateValidatorLocWise('currCompany');
      this.updateValidatorLocWise();
      const formGroupControl = this.formSchRowGroup['controls'];
      for (let i = 0; i < formGroupControl.length; i++) {
        let empUnitId = formGroupControl[i]['controls'].empUnitId?.value;
        this.hideFieldsForSupport(empUnitId, i);
        let talentCubeId = formGroupControl[i]['controls'].TCID?.value;
        this.OnTCSelectionValidation(talentCubeId, i);
      }
    }, 1000);

  }



  //open jd confirmation popup
  openConfirmationModal(element: any) {
    // element['title'] = "Confirmation for JD available and panel available";
    const dialogRef = this.dialog.open(JdPanelConfirmationModalComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'ats-model-full-screenss', 'request-transfers-candidate',],
      data: element,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addUpdateControl(element)
      }
      else {
        this.talentIdControl.reset();
      }
    });
  }

  /***
   * get requition details
   */
  public talentDetailsList: any = [];
  getReqDetails(thId: number) {
    forkJoin([
      this._globalApi.getRequisitionTHID(thId),
      this._talentServ.GetTHIDDetailsByTHID(thId),
      this._globalApi.getTalentCubeList(),
      this._globalApi.getLegalEntityList(),
    ]).subscribe(
      res => {
        this.panelData = res[0][0];
        this.talentDetailsList = res[1]['data'][0];
        this.talentCubeList = res[2]['data'];
        let entityListData = res[3]['data'];
        if (this.getLocInfo.isLocationUS()) {
          // this.entityList = entityListData.filter(list => list?.ID == 22);
          this.entityList = entityListData
        } else {
          this.entityList = res[3]['data'];
          // this.EntityIdCtrl.reset();
        }
        this.getProfileSource({});
        this.getCubeClusterID(this.talentDetailsList.TalentCubeId, this.talentCubeList, 0, 'Y');
      }
    )
    // this._globalApi.getRequisitionTHID(thId).subscribe(
    //   res => {
    //     this.panelData = res[0]
    //   }
    // )
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

  /***
   * add row
   */
  addMoreRow() {
    const control = this.formSchRowGroup;
    if (this.talentId === '' || this.talentId === null) {
      this._share.showAlertErrorMessage.next('Please Select Talent Id.');
    }
    else if (control.length >= 5) {
      this._share.showAlertErrorMessage.next('You can not add more than 5 rows');
    }
    else {
      control.push(this.initItemRow({ addExist: false }));
      this.getCubeClusterID(this.talentDetailsList.TalentCubeId, this.talentCubeList, 0, 'Y');

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

  /***
    * hours Valididation
    */
  // public isTimeZero: boolean = false;
  // hoursValid(event: any, i: number) {
  //   if (event.value == "00") {
  //     this.isTimeZero = false;
  //     this.getControl('interviewTimeMint', i).patchValue("-1");
  //   }
  //   else {
  //     this.isTimeZero = true;
  //     this.getControl('interviewTimeMint', i).patchValue("00");
  //   }
  // }

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
            // this.profileNameData = this._globalCommonMethod.getProfileIndia(data, res);
            this.loadIndiaProfileSource(data, res);
          }
          else {
            this.profileNameData = this._globalCommonMethod.getProfileUs(data, res);
          }
        }
        else {
          // this.profileNameData = this._globalCommonMethod.getProfileIndia(data, res);
          this.loadIndiaProfileSource(data, res);
        }
      }
    );
  }

  loadIndiaProfileSource(data: any, res: any) {
    if (this.isRenuTeam) {
      this.profileNameData = this._globalCommonMethod.getProfileRenuTeamG5Above(data, res);
    }
    else {
      this.profileNameData = this._globalCommonMethod.getProfileIndia(data, res);
    }
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


  //  get currencyTypeData
  public currencyTypeData: any = [];
  getCurrencyType() {
    this._globalApi.getCurrency().subscribe(
      res => {
        this.currencyTypeData = res;
      }
    );
  }


  /** is offer in hand change  */
  public isOfferInHandCTCReq: boolean = false;
  getOfferInHand(e: any, i: number) {
    this.showOfferInHandCTC(e.value, i);
  }

  showOfferInHandCTC(isInHandOfferYes: string, i: number) {
    const formGroupControl = this.formSchRowGroup['controls'];
    let OfferInHandCTC =formGroupControl[i]['controls'].OfferInHandCTC;
    let currencyType = formGroupControl[i]['controls'].currencyType.value;
    let salTypeCtrl = formGroupControl[i]['controls'].SalaryType.value;
    debugger
    if (isInHandOfferYes === 'true' && this.getLocInfo.isLocationIndia()) {
      this.isOfferInHandCTCReq = true;
       if (currencyType == 2) {
         if (salTypeCtrl == 1) {
          OfferInHandCTC.setValidators([Validators.required, Validators.min(this.salRange.usdMin), Validators.max(this.salRange.usdMax)]);
        } 
        else if (salTypeCtrl == 2) {
          OfferInHandCTC.setValidators([Validators.required, Validators.min(this.salRange.usdMonthlyMin), Validators.max(this.salRange.usdMonthlyMax)]);
         }
          else if (salTypeCtrl == 3) {
          OfferInHandCTC.setValidators([Validators.required, Validators.min(this.salRange.usdHrlyMin), Validators.max(this.salRange.usdHrlyMax)]);
        } else {
          OfferInHandCTC.setValidators([Validators.required, Validators.min(this.salRange.usdMin), Validators.max(this.salRange.usdMax)]);
        }
      }
        else {
        if (salTypeCtrl == 1) {
          OfferInHandCTC.setValidators([Validators.required, Validators.min(this.salRange.inrMin), Validators.max(this.salRange.inrMax)]);
        } 
         else if (salTypeCtrl == 2) {
          OfferInHandCTC.setValidators([Validators.required, Validators.min(this.salRange.inrMonthlyMin), Validators.max(this.salRange.inrMonthlyMax)]);
         
        }
        else if (salTypeCtrl == 3) {
          OfferInHandCTC.setValidators([Validators.required, Validators.min(this.salRange.inrHrlyMin), Validators.max(this.salRange.inrHrlyMax)]);
        }

      }
     // formGroupControl[i]['controls'].OfferInHandCTC.addValidators([Validators.required]);
    } else {
      OfferInHandCTC?.clearValidators();
      OfferInHandCTC?.reset();
      this.isOfferInHandCTCReq = false;
    }
   OfferInHandCTC?.updateValueAndValidity();
  }

  fileUp(event: any, i: number) {
    let allowedExtensions = /(\.jpg|\.jpeg|\.png|\.txt|\.pdf|\.doc|\.docx|\.rtf)$/i;
    let file = event.target.files[0];
    if (file) {
      let fileName = file.name;
      if (!allowedExtensions.exec(fileName)) {
        this._share.showAlertErrorMessage.next('Please upload file type  jpeg/jpg/png/txt/pdf/doc/docx/rtf only.');
        event.target.value = "";
        this.getControl('filesUpload', i).reset();
        this.getControl('resume', i).reset();
        return false;
      }
      else if (file.size > FILE_UPLOAD.FILE_SIZE) {
        this._share.showAlertErrorMessage.next('Image  uploaded cannot be greater than 15MB.');
        event.target.value = "";
        this.getControl('filesUpload', i).reset();
        this.getControl('resume', i).reset();
        return false;
      }
      else {
        // this.getControl('Resume').patchValue('file');
        // this.getResumeOutput.emit(this.imgFile);
        //this.getControl('filesUpload',i).patchValue(file);
        this.getControl('resume', i).patchValue(file);

      }
    }

  }
  /***
    * form submit method
    */
  submitInterview(form: UntypedFormGroup) {
    form.markAllAsTouched();
    //  let formData = form.get('formSchRowGroup').value;
    let formData = form.getRawValue().formSchRowGroup;
    this.talentIdControl.value;
    //error msg when no talent id selected
    if (this.talentIdControl.value === null || this.talentIdControl.value === '') {
      this._share.showAlertErrorMessage.next(`Please select talent Id first.`);
      return false;
    }

    // checking that relevent exp should not be greater than total exp
    let ctrlF = this.formSchRowGroup['controls'];
    for (let i = 0; i < ctrlF.length; i++) {
      let totalExps = (parseInt(ctrlF[i]['controls'].totalExp.value) * 12) + parseInt(ctrlF[i]['controls'].totalExpMonth.value);
      let relExps = (parseInt(ctrlF[i]['controls'].totalRelExp.value) * 12) + parseInt(ctrlF[i]['controls'].totalRelExpMonth.value);
      let candidateName: string = ctrlF[i]['controls'].firstName.value;
      // let joinDate = ctrlF[i]['controls']?.joinDate?.value;
      // let intDate = ctrlF[i]['controls']?.interviewDate?.value;
      if (relExps > totalExps) {
        this._share.showAlertErrorMessage.next(`Total Experience can not be less than Relevant Experience for Candidate - ${i + 1} ${candidateName ? ' (' + candidateName + ')' : ''}`);
        return false;
      }
      // if (intDate > joinDate) {
      //   this._share.showAlertErrorMessage.next(`Interview Date can not be greater than Tentative Joining Date for Candidate - ${i + 1} ${candidateName ? ' (' + candidateName + ')' : ''}`);
      //   return false;
      // }
    }
    if (form.valid) {
      this.submitToServer(formData);
    }
    else {
      let ctrlF = this.formSchRowGroup['controls'];
      for (let i = 0; i < ctrlF.length; i++) {
        if (ctrlF[i].invalid) {
          let candidateName: string = ctrlF[i]['controls'].firstName.value;
          this._share.showAlertErrorMessage.next(`Please fill all mandatory field for Candidate - ${i + 1} ${candidateName ? ' (' + candidateName + ')' : ''}`);
          return false
        }
      }
    }

  }


  /***
   * api
   */
  submitToServer(formData: any) {
    let messageList: any = [];
    for (let i = 0; i < formData.length; i++) {
      // formData[i]['interviewDate'] = GlobalMethod.formatDate(formData[i].interviewDate) + " " + formData[i].interviewTimeHours + ":" + formData[i].interviewTimeMint + ":00";
      formData[i]['joiningDate'] = GlobalMethod.formatDate(formData[i].joinDate) + " " + "00" + ":" + "00" + ":00";
      formData[i]['talentId'] = this.talentId;
      formData[i]['thId'] = this.thId;
      formData[i]['hiringLocation'] = this._globalCommonMethod.getSetLocation().locId;
      if (formData[i]['currCompany'] == 'other') {
        formData[i]['currCompany'] = formData[i]['companyName']
      }

      delete formData[i]['cluster'];
      delete formData[i]['role'];
      // if(this.panelData?.IsRenuTeam == 'Y'){
      //   formData[i]['isRenuTeam'] = 'Y'
      // }
      // else{
      //   formData[i]['isRenuTeam'] = 'N'
      // }
      // formData[i]['c_profileUniqId'] = this.c_profileUniqId;
      // "talentId": talentId,
      // "thId": talentIdNum,
      /**commented for test */
      this._newInterviewServe.scheduleInterviewScreen(formData[i]).subscribe(
        res => {
          messageList.push({ msg: res, type: 'suc' });
          this.deleteRowSuc(i);
          if (formData.length === 1) {
            this.resetForm();
          }
        },
        (error) => {
          messageList.push({ msg: error?.error?.Message, type: 'err' })
        }
      );
      /**commented for test */
      //  calls.push(this._newInterviewServe.scheduleInterviewScreen(formData[i]));
    }

    setTimeout(() => {
      this.openMessageModal(messageList);
    }, 1000);
  }
  /**
   *
   * @param e \
   * @param index
   */
  deleteRowSuc(index: number) {
    const control = this.formSchRowGroup;
    if (control.length != 1) {
      control.removeAt(index);
    }
  }

  TotalExp(index: number) {
    const formGroupControl = this.formSchRowGroup['controls'];
    let totalExp = formGroupControl[index]['controls'].totalExp.value;
    let totalExpM = formGroupControl[index]['controls'].totalExpMonth.value;

    if (totalExp == 0) {
      if (totalExpM > 1) {
        this.addvalidationMinMax(index)
      }
      else {
        this.claervalidationMinMax(index);
      }
    }
    else {
      this.addvalidationMinMax(index)
    }
  }



  addvalidationMinMax(index: number) {
    const formGroupControl = this.formSchRowGroup['controls'];
    let currentSalary = formGroupControl[index]['controls'].currentSalary;
    let expectedSalary = formGroupControl[index]['controls'].expectedSalary;
    let currencyType = formGroupControl[index]['controls'].currencyType.value;
    let salTypeCtrl = formGroupControl[index]['controls'].SalaryType.value;
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
        } else {
          currentSalary.setValidators([Validators.required, Validators.min(this.salRange.usdMin), Validators.max(this.salRange.usdMax)]);
          expectedSalary.setValidators([Validators.required, Validators.min(this.salRange.usdMin), Validators.max(this.salRange.usdMax)]);
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
        // currentSalary.setValidators([Validators.min(this.salRange.usdMin), Validators.max(this.salRange.usdMax)]);
        expectedSalary.setValidators([Validators.required]);
        currentSalary.clearValidators();
      }
      else {
        // currentSalary.setValidators([Validators.min(this.salRange.inrMin), Validators.max(this.salRange.inrMax)]);
        expectedSalary.setValidators([Validators.required]);
        currentSalary.clearValidators();
        // expectedSalary.setValidators([Validators.min(100000)]);
      }
    }
    currentSalary.updateValueAndValidity();
    expectedSalary.updateValueAndValidity();

  }
  public salRange: any = salaryMinMaxLoc;
  claervalidationMinMax(index: number) {
    const formGroupControl = this.formSchRowGroup['controls'];
    let currentSalary = formGroupControl[index]['controls'].currentSalary;
    let expectedSalary = formGroupControl[index]['controls'].expectedSalary;
    let currencyType = formGroupControl[index]['controls'].currencyType.value;
    let salTypeCtrl = formGroupControl[index]['controls'].SalaryType.value;
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
        } else {
          currentSalary.setValidators([Validators.required, Validators.min(0), Validators.max(this.salRange.usdMax)]);
          expectedSalary.setValidators([Validators.required, Validators.min(0), Validators.max(this.salRange.usdMax)]);
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
      }
      else {
        // currentSalary.setValidators([Validators.min(0), Validators.max(this.salRange.inrMax)]);
        // expectedSalary.setValidators([Validators.required, Validators.min(0), Validators.max(this.salRange.inrMax)]);
        expectedSalary.setValidators([Validators.required]);
        currentSalary.clearValidators();
      }
    }

    currentSalary.updateValueAndValidity();
    expectedSalary.updateValueAndValidity();
  }
  /***
   * reset Form
   */
  resetForm(): void {
    this.ScheduleFormGroup.reset();
    this.resetSpecificControl();
  }
  resetSpecificControl() {
    const formGroupControl = this.formSchRowGroup['controls'];
    for (let i = 0; i < formGroupControl.length; i++) {
      formGroupControl[i]['controls'].offLetter.patchValue('false');
      formGroupControl[i]['controls'].addExist.patchValue('0');
    }
  }

  openMessageModal(data: any) {
    const dialogRef = this.dialog.open(InterviewMessageAlertComponent, {
      width: '650px',
      panelClass: ['ats-model-wrap', 'ats-msg-modal'],
      data: data,
      //  disableClose: true
    });
  }

  /***
   * on mode change
   */
  onSelectModeInt(event: any, index: number): void {
    const formGroupControl = this.formSchRowGroup['controls'];
    let venueCtrl = formGroupControl[index]['controls']?.Venue;
    venueCtrl.reset();
    let id = event.value;
    if (id == "6" || id == '3') {
      venueCtrl.disable();
    }
    else {
      venueCtrl.enable();
    }
  }

  // viewCalender(index: number) {
  //   const formGroupControl = this.formSchRowGroup['controls'];
  //   let panelControl = formGroupControl[index]['controls']?.panel?.value;
  //   let adpanelControl = formGroupControl[index]['controls']?.AdditionalInterviewer?.value;
  //   let empIdArr = [];
  //   let dateControl = formGroupControl[index]['controls']?.interviewDate;
  //   let date: string = formGroupControl[index]['controls']?.interviewDate?.value;
  //   if (adpanelControl) {
  //     empIdArr = adpanelControl;
  //   }
  //   if (panelControl) {
  //     empIdArr.push(panelControl)
  //   }
  //   let filterData: any = [];
  //   if (dateControl?.invalid) {
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

  public EmpListData: any = [];
  getEmpList(data: any) {
    this.EmpListData = data;
  }


  ngOnDestroy(): void {
    if (this.updateFormSubs) {
      this.updateFormSubs.unsubscribe();
    }
  }

}
