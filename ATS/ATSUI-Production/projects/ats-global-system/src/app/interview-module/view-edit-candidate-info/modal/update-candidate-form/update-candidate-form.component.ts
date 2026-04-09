import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { InterviewCommonService } from 'projects/ats-global-system/src/app/core/services/interview-common.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { InrerviewsService } from 'projects/ats-global-system/src/app/interview-module/inrerviews.service';
import { COMMON_CONST, FILE_UPLOAD, salaryMinMaxLoc, tcSupportList } from 'projects/ats-global-system/src/app/core/constant/common.const';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { CandidateCommonApiService } from 'projects/ats-global-system/src/app/core/services/candidate-common-api.service';
import { forkJoin } from 'rxjs';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { GetLocationInfo } from 'projects/ats-global-system/src/app/core/common/getLocationInfo';
import { CONSTANTS } from 'projects/ats-global-system/src/app/core/constant/constants';

@Component({
  selector: 'app-update-candidate-form',
  templateUrl: './update-candidate-form.component.html',
  styleUrls: ['./update-candidate-form.component.scss']
})
export class UpdateCandidateFormComponent implements OnInit {
  public isloader: boolean = false;
  public candidateData: any = [];
  public candidteRoundDetails: any = [];
  minDate = new Date();
  isTimeZero = true;
  intModeData: any = [];
  updateCandidateForm: UntypedFormGroup;
  isHideJoinDate: boolean = false;

  public isCancelledStatus: boolean = false;
  public techRoundFilter: any = [];
  public idProofReq: boolean = false;
  public candidateTypeData: any = [];
  public idTypeData: any = [];
  public currencyTypeData: any = [];
  public hideCountryCtrl: boolean = true;
  public hideStateCtrl: boolean = true;
  public hideCurrentSalaryCtrl: boolean = true;
  public isGenderVisible: boolean = false;
  public isDobVisible: boolean = false;
  public isDobNotNull: boolean = true;
  public isUniqueIdAndNumberVisible: boolean = false;
  public isDivisionVisible: boolean = false;
  public isWithCountryCode: boolean = false;
  public isTCVisible: boolean = false;
  public isClusterVisible: boolean = false;
  public isRoleVisible: boolean = false;
  public isGradeVisible: boolean = false;
  public isGradeBandVisible: boolean = false;
  public isSalaryGridVisible: boolean = false;
  public isSalaryTypeVisible: boolean = true;
  public isEmpUnitVisible: boolean = true;
  public today = new Date();
  public maxDate = new Date(this.today.getFullYear() - 10, this.today.getMonth(), this.today.getDate());
  public salaryTypeList: any = this.getSalaryTypeListLocationWise();
  public JfCategList: any = CONSTANTS.JfCategList;
  public isRenuTeam:boolean = false;

  constructor(
    public dialogRef: MatDialogRef<UpdateCandidateFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: UntypedFormBuilder,
    private _share: ShareService,
    private _InterviewServe: InrerviewsService,
    private _intCommonServe: InterviewCommonService,
    private _globalApiSere: GlobalApisService,
    private _candidateCommon: CandidateCommonApiService,
    private _storage: GetSetStorageService,
    private getLocInfo: GetLocationInfo,
  ) { }

  ngOnInit(): void {
    this.getGender();
    this.data;

    /***
     * firm init
     */
    this.formSetup();
    /***
     * load
     */
    this.InitLoad();
    // this.getGradeId(this.gradeID);
    // this.getDivisionID1();
    this.isRenuTeam = this.data?.IsRenuTeam == 'Y' ? true : false;
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
  public divisionId: number = 1;
  getDivisionID(e) {
    this.divisionId = e;
    this.TCIDControl.reset();
    this.gradeIdControl.reset();
    this.gradeBandControl.reset();
    let empUnitId = this.getControl('empUnitId')?.value;
    if(!this.isRenuTeam){
      this.gradeBandControl.setValidators([Validators.required]);
      this.gradeBandControl.updateValueAndValidity();
    }
    this.hideFieldsForSupport(empUnitId);

  }

  // get employee unit Id
  getEmpUnitId(e) {
    let empUnitIdVal = e;
    this.hideFieldsForSupport(empUnitIdVal);
  }


  //hideFields for Supprt job damily
  hideFieldsForSupport(empUnitId: number) {
    if (empUnitId == 5) {
      // this.isPracticeVisible = false;
      this.isGradeVisible = false;
      this.isGradeBandVisible = false;
      this.isSalaryGridVisible = false;
      this.isTCVisible = false;
      this.isClusterVisible = false;
      this.isRoleVisible = false;
      this.getControl('TCID').clearValidators();
      this.getControl('TCID').reset();
      this.getControl('cubeClusterId').reset();
      this.getControl('roleId').reset();
      this.getControl('gradeId').clearValidators();
      this.getControl('gradeId').reset();
      this.getControl('gradeBand').clearValidators();
      this.getControl('gradeBand').reset();
    } else {
      this.isGradeVisible = true;
      this.isGradeBandVisible = true;
      if(!this.isRenuTeam){
        this.isSalaryGridVisible = true;
      }
      this.isTCVisible = true;
      this.isClusterVisible = true;
      this.isRoleVisible = true;
      this.getControl('TCID').addValidators([Validators.required]);
      this.getControl('gradeId').addValidators([Validators.required]);
      if(!this.isRenuTeam){
        this.getControl('gradeBand').addValidators([Validators.required]);
      }
    }
    this.getControl('TCID').updateValueAndValidity();
    this.getControl('gradeId').updateValueAndValidity();
    this.getControl('gradeBand').updateValueAndValidity();
  }

  //getgender
  public genderType: any = []
  getGender() {
    this._globalApiSere.getGenderList().subscribe(
      res => {
        this.genderType = res['data'];
      }
    )
  }

  /***
   * Init Call ALL API's
   */

  InitLoad() {
    /***
     * combine api call
     */
    forkJoin([
      this._intCommonServe.getIntMode(),
      this._globalApiSere.getCurrency(),
      this._intCommonServe.getCandidateType(),
      this._intCommonServe.getIdType()
    ]).subscribe(
      res => {
        this.intModeData = res[0];
        this.currencyTypeData = res[1];

        // this.candidateTypeData = res[2];
        if (this.data?.requirementTypeId == 6) {
          // let filterById = [ 14, 1010, 2009]
          let filterByStatus = res[2].filter(item => item.typeId !== 2 && item.typeId !== 8 && item.typeId !== 9);
          this.candidateTypeData = filterByStatus;
        } else {
          this.candidateTypeData = res[2];
        }

        this.idTypeData = res[3];

      }
    )
    /***
     * get candidate details api
     */
    if (this.data?.cid) {
      this.getCandidateDetails(this.data?.cid);
    }
  }


  /***
   * grt Candidate Details
   */

  getCandidateDetails(cid: number) {
    this._candidateCommon.getCandidateDetailsByCid(cid).subscribe(
      res => {
        this.setValueToForm(res);
        this.updateValidatorLocWise(res);
      }

    )
  }
  /**\
   * update control validity
   */

  updateValidatorLocWise(res: any) {
    if (res?.HiringLocation?.id === 0 || res?.HiringLocation?.name == "") {
      this.locIndia();
    }
    else {
      if (res?.HiringLocation?.id == 1 ||
        res?.HiringLocation?.id == 2 ||
        res?.HiringLocation?.id == 4 ||
        res?.HiringLocation?.id == 5 ||
        res?.HiringLocation?.id == 10 ||
        res?.HiringLocation?.id == 16 ||
        res?.HiringLocation?.id == 11 ||
        res?.HiringLocation?.id == 23) {
        this.locIndia();
      }
      else if (res?.HiringLocation?.id == 3) {
        this.locUs();
      }
    }


    this.stateControl.updateValueAndValidity();
    this.countryControl.updateValueAndValidity();
    this.curSalaryControl.updateValueAndValidity();
    this.currOrganisationControl.updateValueAndValidity();
    this.eduQualificationControl.updateValueAndValidity();

    this.candidateGenderControl.updateValueAndValidity();
    this.DivisionIDControl.updateValueAndValidity();
    this.gradeIdControl.updateValueAndValidity();
    this.gradeBandControl.updateValueAndValidity();
    this.TCIDControl.updateValueAndValidity();
    this.mobileNumberControl.updateValueAndValidity();
    this.identityNoControl.updateValueAndValidity();
    this.SalaryTypeControl.updateValueAndValidity();
    this.empUnitIdControl.updateValueAndValidity();
    this.clearSalaryValidatorsC2h();
    this.CountryCodeControl.updateValueAndValidity();
  }

/**clear validators for c2h  */
 public isC2hReqType:boolean = false;
  clearSalaryValidatorsC2h() {

    if (this.data?.requirementTypeId == 6) {
      this.isC2hReqType = true;
      this.curSalaryControl.clearValidators();
      this.curSalaryControl.updateValueAndValidity();
      this.getControl('expSalary').clearValidators();
      this.getControl('expSalary').updateValueAndValidity();
    }
  }
  /***
   * indian Location
   */

  locIndia() {
    this.hideCurrentSalaryCtrl = true;
    this.isGenderVisible = true;
    this.hideCountryCtrl = true;
    this.isDobVisible = true;
    this.isUniqueIdAndNumberVisible = true;
    this.isDivisionVisible = true;
    this.isTCVisible = true;
    this.isClusterVisible = true;
    this.isRoleVisible = true;
    this.isGradeVisible = true;
    this.isGradeBandVisible = true;
    if(!this.isRenuTeam){
      this.isSalaryGridVisible = true;
    }
    // this.isSalaryTypeVisible = false;
    this.isEmpUnitVisible = true;
    this.isWithCountryCode = false;
    this.CountryCodeControl.clearValidators();
    this.CountryCodeControl.reset();
    this.mobileNumberControl.setValidators([Validators.required, Validators.minLength(10), Validators.maxLength(10)]);
    this.stateControl.clearValidators();    
    this.countryControl.setValidators([Validators.required]);
    this.curSalaryControl.setValidators([Validators.required]);
    this.currOrganisationControl.setValidators([Validators.required]);
    this.eduQualificationControl.setValidators([Validators.required]);
    this.DivisionIDControl.setValidators([Validators.required]);
    this.gradeIdControl.setValidators([Validators.required]);
    if(!this.isRenuTeam){
      this.gradeBandControl.setValidators([Validators.required]);
    }
    this.TCIDControl.setValidators([Validators.required]);
    this.empUnitIdControl.setValidators([Validators.required]);
    this.hideStateCtrl = false;
    this.candidateGenderControl.setValidators([Validators.required]);
    // this.SalaryTypeControl.clearValidators();
    // this.SalaryTypeControl.reset();
    // this.candidateDobControl.setValidators([Validators.required])
    // if(){
    //   this.curSalaryControl.setValidators([Validators.required]);
    // }
  }
  /***
   * US Location
   */

  locUs() {
    this.hideStateCtrl = true;
    this.isWithCountryCode = true;
    this.CountryCodeControl.setValidators([Validators.required]);
    this.mobileNumberControl.clearValidators();
    this.mobileNumberControl.setValidators([Validators.required]);
    this.stateControl.setValidators([Validators.required]);
    // this.SalaryTypeControl.setValidators([Validators.required]);
    this.countryControl.clearValidators();
    this.curSalaryControl.clearValidators();
    this.currOrganisationControl.clearValidators();
    this.eduQualificationControl.clearValidators();
    this.DivisionIDControl.clearValidators();
    this.gradeIdControl.clearValidators();
    this.gradeBandControl.clearValidators();
    this.TCIDControl.clearValidators();
    this.empUnitIdControl.clearValidators();
    this.DivisionIDControl.reset();
    this.gradeIdControl.reset();
    this.gradeBandControl.reset();
    this.TCIDControl.reset();
    this.empUnitIdControl.reset();
    this.hideCurrentSalaryCtrl = false;
    this.hideCountryCtrl = false;
    this.isDobVisible = false;
    this.isUniqueIdAndNumberVisible = false;
    this.isDivisionVisible = false;
    this.isTCVisible = false;
    this.isClusterVisible = false;
    this.isRoleVisible = false;
    this.isGradeVisible = false;
    this.isGradeBandVisible = false;
    this.isSalaryGridVisible = false;
    this.identityNoControl.clearValidators();
    this.candidateGenderControl.clearValidators();
    this.isGenderVisible = false;
    // this.isSalaryTypeVisible = true;
    this.isEmpUnitVisible = false;
    // this.candidateDobControl.clearValidators();
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
    let currentSalary = this.getControl('curSalary');
    let expectedSalary = this.getControl('expSalary');
    let currencyType = this.getControl('currencyTypeId').value;
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
        //  currentSalary.setValidators([Validators.min(this.salRange.usdMin), Validators.max(this.salRange.usdMax)]);
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
  claervalidationMinMax() {
    let currentSalary = this.getControl('curSalary');
    let expectedSalary = this.getControl('expSalary');
    let currencyType = this.getControl('currencyTypeId').value;
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
        currentSalary.clearValidators();
        expectedSalary.setValidators([Validators.required, Validators.min(0), Validators.max(this.salRange.usdMax)]);
      }
      else {
        // currentSalary.setValidators([Validators.min(0), Validators.max(this.salRange.inrMax)]);
        currentSalary.clearValidators();
        expectedSalary.setValidators([Validators.required, Validators.min(0), Validators.max(this.salRange.inrMax)]);
      }
    }

    currentSalary.updateValueAndValidity();
    expectedSalary.updateValueAndValidity();
  }

  /***
   * formSetup
   */
  formSetup() {
    let totalYear = 40;
    let maxExpInMonth = 40 * 12;
    this.updateCandidateForm = this._fb.group({
      firstName: [null, [Validators.required]],
      middleName: [null],
      lastName: [null],
      email: [null, [Validators.required, Validators.pattern(COMMON_CONST.emailregex)]],
      CountryCode: [null],
      mobileNumber: [null, [Validators.required]],
      primarySkill: [null, [Validators.required]],
      totalExp: [null, [Validators.required, Validators.max(maxExpInMonth)]],
      totalExpMonth: [null, [Validators.required]],
      releventExp: [null, [Validators.required]],
      relExpMonth: [null, [Validators.required]],
      countryID: [null, [Validators.required]],
      stateID: [null],
      cityId: [null, [Validators.required]],
      identityId: [1],
      identityNo: [null],
      currentOrg: [null, [Validators.required]],
      eduQualification: [null, [Validators.required]],
      expSalary: [null, [Validators.required]],
      curSalary: [null, [Validators.required]],
      candidateTypeID: [null, [Validators.required]],
      currencyTypeId: [null, [Validators.required]],
      JoiningDate: [null, Validators.required],
      resume: [null],
      candidateGender: [null],
      dob: [null],
      DivisionID: [null, [Validators.required]],
      gradeId: [null, [Validators.required]],
      gradeBand: [null],
      TCID: [null, [Validators.required]],
      cluster: [null],
      role: [null],
      cubeClusterId: [null],
      roleId: [null],
      SalaryType: [null, [Validators.required]],
      empUnitId: [null],
    })
  }

  /***
   * form set value
   */
  public filteryByCountry: boolean = true;
  setValueToForm(data) {
    if (data?.HiringLocation?.id == 3) {
      this.filteryByCountry = false;
      this.country = data?.state?.id;
    }
    else {
      this.country = data?.country?.id;
      this.filteryByCountry = true;
    }
    if (data?.dob == '' || data?.dob == null) {
      this.isDobNotNull = false;
    } else {
      this.isDobNotNull = true;
    }
    if (data?.EmpUnit?.id) {
      this.hideFieldsForSupport(data?.EmpUnit?.id);
    }
    this.updateCandidateForm.patchValue({
      firstName: data?.firstName,
      lastName: data?.lastName,
      middleName: data?.middleName,
      email: data?.Email,
      CountryCode: data?.countryCode,
      mobileNumber: data?.phone,
      primarySkill: parseInt(data?.primarySkill?.id),
      totalExp: data?.totalExperience?.year,
      totalExpMonth: data?.totalExperience?.month,
      releventExp: data?.releventExperience?.year,
      relExpMonth: data?.releventExperience?.month,
      countryID: data?.country?.id ? data?.country?.id : null,
      stateID: data?.state?.id ? data?.state?.id : null,
      cityId: data?.city?.id,
      identityId: data?.Identity?.id,
      identityNo: data?.IdentityNo,
      currentOrg: data?.CurrentOrg?.id == 0 ? null : data?.CurrentOrg?.id,
      eduQualification: data?.eduQualification?.id == 0 ? null : data?.eduQualification?.id,
      candidateGender: data?.Gender?.id == 0 ? null : data?.Gender?.id,
      expSalary: data?.salaryDetails?.expected,
      curSalary: data?.salaryDetails?.current,
      candidateTypeID: data?.candidateType?.id,
      currencyTypeId: data?.currency?.id,
      JoiningDate: new Date(data?.joiningDate),
      DivisionID: data?.Division?.id == 0 ? null : data?.Division?.id,
      gradeId: data?.Grade?.id == 0 ? null : data?.Grade?.id,
      gradeBand: data?.GradeBand == '' ? null : data?.GradeBand,
      TCID: data?.CubeID == 0 ? null : data?.CubeID,
      cubeClusterId: data?.CubeClusterID == 0 ? null : data?.CubeClusterID,
      roleId: data?.CubeRoleID == 0 ? null : data?.CubeRoleID,
      cluster: data?.CubeClusterName == '' || data?.CubeClusterName == null ? null : data?.CubeClusterName,
      // role: data?.CubeClusterName,
      dob: data?.dob == '' ? null : GlobalMethod.formatDate(data?.dob),
      SalaryType: data?.salaryDetails?.SalaryType,
      empUnitId: data?.EmpUnit?.id == '' || data?.EmpUnit?.id == 0 ? null : data?.EmpUnit?.id,
    });
    if (data?.Identity?.id) {
      this.idValidation(data?.Identity?.id);
    }
    else {

    }
    this.getRoleByTalentCube(data?.CubeID, data?.Grade?.id);
  }

  //gt talent cube list
  getTalentCubeList(list: any) {
    this.talentCubeList = list;
  }

  public gradeId: number = 0;
  getGradeId(e) {
    this.gradeId = e;
    this.getControl('gradeBand').reset();
    this.getCubeClusterID(this.talentCubeId, this?.talentCubeList);
  }

  // get talent cube Id
  public talentCubeList = [];
  public talentCubeId: number;
  getTCID(e) {
    //  this.talentCubeList = e?.talentCubeList;
    this.talentCubeId = e?.selectedVal;
    this.OnTCSelectionValidation(this.talentCubeId);
    this.getCubeClusterID(e?.selectedVal, this.talentCubeList);
  }

   //To Remove Validation for cluster when TCID is 61
   OnTCSelectionValidation(tcId: any) {
    if (tcSupportList.supportItems.find(x => x === tcId)) {
      this.getControl('cluster').reset();
      this.getControl('cluster').clearValidators();;
    } else {
      if (this.getLocInfo.isLocationIndia()) {
        this.getControl('cluster').addValidators([
          Validators.required,
        ]);
      }
    }
    this.getControl('cluster').updateValueAndValidity();
  }

  /**
   *
   * @param e get Cub Cluster Id
   */
  public filterCubeList: any = {};
  getCubeClusterID(tcId, tcList): any {
    let gradeId = this.getControl('gradeId')?.value;
    let cluster = this.getControl('cluster');
    let cubeClusterId = this.getControl('cubeClusterId');
    this.filterCubeList = tcList?.filter(r => r?.CubeId == tcId)[0];
    if (gradeId && tcId) {
      cluster.patchValue(this.filterCubeList?.ClusterName);
      cubeClusterId.patchValue(this.filterCubeList?.ClusterId);
      this.getRoleByTalentCube(tcId, gradeId);
    }
  }

  //get role cluster
  //  public RoleTalentCube: any = {};
  getRoleByTalentCube(talentCubeCode: number, gradeId: number) {
    this._globalApiSere.getRoleByTalentCube(talentCubeCode, gradeId).subscribe(
      res => {
        let RoleTalentCube = res['data'][0];
        let role = this.getControl('role');
        let roleId = this.getControl('roleId');
        role.patchValue(RoleTalentCube?.RoleName);
        roleId.patchValue(RoleTalentCube?.RoleId);
      }
    );
  }

  getControl(name: string) {
    return this.updateCandidateForm.get(name);
  }
  get nameControl() { return this.updateCandidateForm.get('name'); }
  get firstnameControl() { return this.updateCandidateForm.get('firstName'); }
  get lastnameControl() { return this.updateCandidateForm.get('lastName'); }
  get middlenameControl() { return this.updateCandidateForm.get('middleName'); }
  get emailControl() { return this.updateCandidateForm.get('email'); }
  get mobileNumberControl() { return this.updateCandidateForm.get('mobileNumber'); }
  get primarySkillControl() { return this.updateCandidateForm.get('primarySkill'); }
  get totalExperienceControl() { return this.updateCandidateForm.get('totalExp'); }
  get totalExperienceMonthControl() { return this.updateCandidateForm.get('totalExpMonth'); }
  get releventExperienceControl() { return this.updateCandidateForm.get('releventExp'); }
  get releventExperienceMonthControl() { return this.updateCandidateForm.get('relExpMonth'); }
  get countryControl() { return this.updateCandidateForm.get('countryID'); }
  get stateControl() { return this.updateCandidateForm.get('stateID'); }
  get cityControl() { return this.updateCandidateForm.get('cityId'); }
  get identityIdControl() { return this.updateCandidateForm.get('identityId'); }
  get identityNoControl() { return this.updateCandidateForm.get('identityNo'); }
  get eduQualificationControl() { return this.updateCandidateForm.get('eduQualification'); }
  get currOrganisationControl() { return this.updateCandidateForm.get('currentOrg'); }
  get curSalaryControl() { return this.updateCandidateForm.get('curSalary'); }
  get resumeControl() { return this.updateCandidateForm.get('resume'); }

  get candidateGenderControl() { return this.updateCandidateForm.get('candidateGender'); }
  get candidateDobControl() { return this.updateCandidateForm.get('dob') }
  get CountryCodeControl() { return this.updateCandidateForm.get('CountryCode'); }
  get DivisionIDControl() { return this.updateCandidateForm.get('DivisionID'); }
  get gradeIdControl() { return this.updateCandidateForm.get('gradeId'); }
  get gradeBandControl() { return this.updateCandidateForm.get('gradeBand'); }
  get TCIDControl() { return this.updateCandidateForm.get('TCID'); }
  get SalaryTypeControl() { return this.updateCandidateForm.get('SalaryType'); }
  get empUnitIdControl() { return this.updateCandidateForm.get('empUnitId'); }

  /***
   * get Country value
   */
  public country: number;
  getCountryId(e) {
    this.country = e;
    this.cityControl.reset();
  }

  /**
     *
     * @param event
     * get Id Type
     */
  public idTypeName: string;
  getSelectedIdType(e) {
    let val = e.source.value;
    this.identityNoControl.reset();
    this.idValidation(val);
  }

  /***
   * validation for id proof
   */
  idValidation(val: number) {
    let regpan = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
    let adhar = /^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/;
    if (val === 4) {
      this.identityNoControl.patchValue('NA');
      this.identityNoControl.clearValidators();
      this.identityNoControl.updateValueAndValidity();
      this.identityNoControl.disable({ onlySelf: true });
    }
    else if (val === 1) {
      this.identityNoControl.enable();
      this.idTypeName = "PAN No";
      this.identityNoControl.clearValidators();
      this.idProofReq = true;
      this.identityNoControl.setValidators([Validators.pattern(regpan), Validators.required]);
      this.identityNoControl.updateValueAndValidity();

    }
    else if (val === 2) {
      this.identityNoControl.enable();
      this.idTypeName = "AADHAAR Number";
      this.identityNoControl.clearValidators();
      this.idProofReq = true;
      this.identityNoControl.setValidators([Validators.pattern(adhar), Validators.required]);
      this.identityNoControl.updateValueAndValidity();

    }
    else {
      this.identityNoControl.enable();
      this.identityNoControl.clearValidators();
      this.idProofReq = true;
      this.identityNoControl.setValidators([Validators.required]);
      this.identityNoControl.updateValueAndValidity();

    }
  }

  /***
   * submit form
   */
  submitCandidateForm(form: any) {
    if (this.updateCandidateForm.valid) {
      let totalExps = (parseInt(this.getControl('totalExp')?.value) * 12) + parseInt(this.getControl('totalExpMonth')?.value);
      let relExps = (parseInt(this.getControl('releventExp')?.value) * 12) + parseInt(this.getControl('relExpMonth')?.value);
      if (relExps > totalExps) {
        this._share.showAlertErrorMessage.next('Total Experience can not be less than Relevant Experience.');
      } else {
        let formValue = form.value;
        let body = new FormData();
        body.append('cid', this.data.cid);
        body.append('firstName', formValue.firstName);
        body.append('lastName', formValue.lastName?formValue.lastName:'');
        body.append('middleName', formValue.middleName?formValue.middleName:'');
        body.append('addedBy', this._storage.getUserEmpId());
      //  body.append('CountryCode', formValue.CountryCode);
        body.append('mobileNumber', formValue.mobileNumber);
        body.append('primarySkill', formValue.primarySkill);
        body.append('totalExp', formValue.totalExp);
        body.append('totalExpMonth', formValue.totalExpMonth);
        body.append('releventExp', formValue.releventExp);
        body.append('relExpMonth', formValue.relExpMonth);
        body.append('cityId', formValue.cityId);
        if (formValue.CountryCode) {
          body.append('CountryCode', formValue.CountryCode);
        }
        if (formValue.countryID) {
          body.append('countryID', formValue.countryID);
        }
        if (formValue.stateID) {
          body.append('stateID', formValue.stateID);
        }
        if (formValue.identityId) {
          body.append('identityId', formValue.identityId);
        }
        if (formValue.identityNo) {
          body.append('identityNo', formValue.identityNo);
        }
        // if(formValue.candidateGender){
        //   body.append('Gender', formValue.candidateGender);
        // }
        body.append('currentOrg', formValue.currentOrg ? formValue.currentOrg : '');
        body.append('eduQualification', formValue.eduQualification ? formValue.eduQualification : '');
        body.append('expSalary', formValue.expSalary ? formValue.expSalary : '');
        body.append('curSalary', formValue.curSalary ? formValue.curSalary : '');
        body.append('email', formValue.email);
        body.append('currencyTypeId', formValue.currencyTypeId);
        body.append('joiningDate', GlobalMethod.formatDate(formValue.JoiningDate) + ' 09:00:00');
        body.append('candidateTypeID', formValue.candidateTypeID);
        body.append('Gender', formValue.candidateGender ? formValue.candidateGender : '')
        body.append('dob', formValue?.dob ? GlobalMethod.formatDate(formValue?.dob) : '');
        body.append('DivisionID', formValue.DivisionID ? formValue.DivisionID : '')
        body.append('gradeId', formValue.gradeId ? formValue.gradeId : '')
        body.append('gradeBand', formValue.gradeBand ? formValue.gradeBand : '')
        body.append('CubeID', formValue.TCID ? formValue.TCID : '');
        if (formValue?.SalaryType) {
          body.append('SalaryType', formValue?.SalaryType);
        }
        if (this.resumeFile) {
          body.append('resume', this.resumeFile);
        }
        if (formValue?.cubeClusterId) {
          body.append('CubeClusterID', formValue?.cubeClusterId);
        }
        if (formValue?.roleId) {
          body.append('CubeRoleID', formValue?.roleId);
        }
        if (formValue?.empUnitId) {
          body.append('EmpUnitId', formValue?.empUnitId);
        }
        this._InterviewServe.updateCandidateRecord(body).subscribe(
          res => {
            this._share.showAlertSuccessMessage.next(res);
            this.isloader = false;
            this.dialogRef.close(true);
          },
          (error) => {
            this._share.showAlertErrorMessage.next(error.error.Message);
            this.isloader = false;
          }
        )
      }

    }
    else {
      this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
    }
  }

  //file upload resume
  public resumeFile: any = {};
  fileUp(event) {
    // let allowedExtensions = /(\.jpg|\.jpeg|\.tiff)$/i;
    let allowedExtensions = /(\.jpg|\.jpeg|\.png|\.txt|\.pdf|\.doc|\.docx|\.rtf)$/i;
    let file = event.target.files[0];
    this.resumeFile = file;
    let fileName = file.name;
    if (!allowedExtensions.exec(fileName)) {
      this._share.showAlertErrorMessage.next('Please upload file type  jpeg/jpg/png/txt/pdf/doc/docx/rtf only.');
      event.target.value = "";
      this.resumeFile = '';
      return false;
    }
    else if (file.size > FILE_UPLOAD.FILE_SIZE) {
      this._share.showAlertErrorMessage.next('Image  uploaded cannot be greater than 15MB.');
      event.target.value = "";
      this.resumeFile = '';
      return false;
    }
    else {
      this.resumeControl.patchValue(this.resumeFile);
    }


  }


  /***
 * close dialog
 */
  closeModal(): void {
    this.dialogRef.close();
  }



}
