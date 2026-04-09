import { Component, Inject, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { InterviewStatusService } from 'projects/ats-global-system/src/app/core/services/interview-status.service';
import { forkJoin } from 'rxjs';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { OfferService } from '../../offer.service';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { FeedbackRoundDetailsComponent } from 'projects/ats-global-system/src/app/interview-module/interview-feedback/modals/feedback-round-details/feedback-round-details.component';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CONSTANTS } from 'projects/ats-global-system/src/app/core/constant/constants';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { InterviewCommonService } from '../../../core/services/interview-common.service';
import { ExternalUserGlobalApiService } from '../../../core/services/external-user-global-api.service';
import { GlobalCommonMethodService } from '../../../core/common/global-common-method.service';
import { TalentService } from '../../../talent-module/talent.service';


@Component({
  selector: 'app-send-for-approval-modal-us',
  templateUrl: './send-for-approval-modal-us.component.html',
  styleUrls: ['./send-for-approval-modal-us.component.scss']
})
export class SendForApprovalModalUsComponent implements OnInit {
  //
  public sendForApprovalForm: UntypedFormGroup = new UntypedFormGroup({});
  gotSendApprovalSubmit: any
  public candData: any = [];
  public allRoundList: any = [];
  public selectedList: any = [];
  public gradeList: any = [];
  public gradeBandList: any = [];
  //  public jobFamilyList: any = [];
  public offerAprDt: any = [];
  public FilterCtrlTAG: UntypedFormControl = new UntypedFormControl();
  public FilterCtrlDepCode: UntypedFormControl = new UntypedFormControl();
  public FilterCtrlGrade: UntypedFormControl = new UntypedFormControl();
  public FilterCtrlWorkVisa: UntypedFormControl = new UntypedFormControl();
  public FilterCtrlRM: UntypedFormControl = new UntypedFormControl();
  public FilterCtrlTalentCube: UntypedFormControl = new UntypedFormControl();
  public searchInputRM: string;
  public FilterCtrlVender: UntypedFormControl = new UntypedFormControl();
  public searchInputCtrlVenter: string;
  public searchInputTalentCube: string;
  public salaryTypeList: any = CONSTANTS.salaryType;
  public FilterCtrlTagUS: UntypedFormControl = new UntypedFormControl();
  public FilterCtrlTAGhead: UntypedFormControl = new UntypedFormControl();
  public searchInputTagUs: string;
  public searchInputTagHeadUs: string;
  public minDate: any = new Date();
  public minDateEnd: any = new Date();
  public RehireList: any = CONSTANTS.RehireList;
  public practiceList: any = [];
  public locId: number;
  public BasePayLabel: string = 'Base Pay';
  constructor(
    public dialogRef: MatDialogRef<SendForApprovalModalUsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _interviewStatus: InterviewStatusService,
    private _fb: UntypedFormBuilder,
    private _offerService: OfferService,
    private _globalApiServe: GlobalApisService,
    private _intCommonServe: InterviewCommonService,
    private _extGlobalApiServ: ExternalUserGlobalApiService,
    private _share: ShareService,
    public dialog: MatDialog,
    private _storage: GetSetStorageService,
    private _globalCommonMethod: GlobalCommonMethodService,
    private _talentServ: TalentService
    //  private _commonOfferMet: AtsOfferCommonMethodService
  ) { }

  ngOnInit(): void {
    if (this.data.DivisionID) {
      this.divisionID = this.data.DivisionID;
    }
    this.locId = this._globalCommonMethod.getSetLocation().locId;
    this.sendApprovalForm()
    this.getCandidateDetails();
    this.callMasterAPI();
    // this.getAllApproverList();
  }

  ngAfterViewInit(): void {
    this.inputValueChangedFunc();
  }

  public visaTypeList: any = [];
  public i9RepresentativeList: any = [];
  public legalEntityList: any = [];
  public offerTypeList: any = [];
  public employeeUnitList: any = [];
  public profileSourceList: any = [];
  public departmentCodeList: any = [];
  public hireRehireList: any = [];
  public remoteStatusList: any = [];
  public FLSAClassificationList: any = [];
  public divisionList: any = [];
  public contactList: any = [];
  public reportingManagerList: any = [];
  public talentCubeList: any = [];
  public venderRefreeList: any = [];
  public searchInput: string;
  public searchInputGrade: string;
  public searchInputWorkVisa: string;
  public searchInputDepCode: string;
  public tagHeadList: any = [];
  public tagHeadListIndiaUS: any = [];
  //all master api call at once
  callMasterAPI() {
    forkJoin([
      this._globalApiServe.getVisaTypeList(),
      this._globalApiServe.getI9RepresentativeList(),
      this._globalApiServe.getLegalEntityList(),
      this._globalApiServe.getOfferTypeList(),
      this._globalApiServe.getEmployeeUnitList(),
      this._intCommonServe.getProfileName(),
      this._globalApiServe.getAllPractices(),
      this._globalApiServe.getDepertmentCodeList(),
      this._globalApiServe.getHireRehireList(),
      this._globalApiServe.getRemoteStatusList(),
      this._globalApiServe.getFLSAClassificationList(),
      this._globalApiServe.getDivisionList(),
      this._globalApiServe.getGradeList(),
      this._globalApiServe.GetContractTypesForUS(this.locId),
      this._globalApiServe.getTalentCubeListUS(),
      this._globalApiServe.getTagHeadApproverListUS(),
      this._globalApiServe.GetVenderRefree(),
      this._globalApiServe.getTagHeadList()
      // this._extGlobalApiServ.GetReportingManagerBYGrade(203)
    ]).subscribe(
      res => {
        this.visaTypeList = res[0]['data'];
        this.i9RepresentativeList = res[1]['data'];
        this.legalEntityList = res[2]['data'];
        this.offerTypeList = res[3]['data'];
        this.employeeUnitList = res[4]['data'];
        this.profileSourceList = res[5]['data'];
        this.practiceList = res[6]['data'];
        this.departmentCodeList = res[7]['data'];
        this.hireRehireList = res[8]['data'];
        this.remoteStatusList = res[9]['data'];
        this.FLSAClassificationList = res[10]['data'];
        this.divisionList = res[11]['data'];
        this.gradeList = res[12]['data'];
        //this.contactList = res[13]['data'];
        this.talentCubeList = res[14]['data'];
        this.tagHeadList = res[15]['data'];
        this.venderRefreeList = res[16]['data'];
        this.tagHeadListIndiaUS = res[17]['data'];
        // this.reportingManagerList = res[7]['data'];
        this.FilterCtrlGrade.valueChanges.subscribe(
          val => {
            this.searchInputGrade = val;
          }
        );
        this.FilterCtrlWorkVisa.valueChanges.subscribe(
          val => {
            this.searchInputWorkVisa = val;
          }
        );
        this.FilterCtrlDepCode.valueChanges.subscribe(
          val => {
            this.searchInputDepCode = val;
          }
        );
        this.FilterCtrlRM.valueChanges.subscribe(
          val => {
            this.searchInputRM = val;
          }
        );
        this.FilterCtrlTalentCube.valueChanges.subscribe(
          val => {
            this.searchInputTalentCube = val;
          }
        );
        /**tag lead search */
        this.FilterCtrlTagUS.valueChanges.subscribe(
          val => {
            this.searchInputTagUs = val;
          }
        );
        /**tag head search */
        this.FilterCtrlTAGhead.valueChanges.subscribe(
          val => {
            this.searchInputTagHeadUs = val;
          }
        );
        /**vender search */
        this.FilterCtrlVender.valueChanges.subscribe(
          val => {
            this.searchInputCtrlVenter = val;
          }
        )
        /**filter to remove FTE from dropdown */
        var filterOfferType = res[3]['data'].filter(user => user.Id != 1);
        this.offerTypeList = filterOfferType;
      }
    )
    this.getLocation();
    this.getcontactList()
  }

  /**get contract type */
  getcontactList() {
    this._globalApiServe.GetContractTypesForUS(this.locId).subscribe(
      res => {

        if (this.data?.requirementTypeId == 6) {
          // let filterById = [ 14, 1010, 2009]
          let filterByStatus = this.contactList = res['data'].filter(item => item.ID !== 14 && item.ID !== 1010 && item.ID !== 2009);
          this.contactList = filterByStatus;
        } else {
          this.contactList = res['data'];
        }
      }
    );
  }

  //show hide pay field on basis of salary type & employment type
  public isBasePayVisible: boolean = true;
  public isLoadingCostVisible: boolean = true;
  public isGrossSalaryUSDVisible: boolean = true;
  public isSalaryGridVisible: boolean = true;
  public isI9RepresentativeVisible: boolean = true;
  public isMedicalBenefitVisible: boolean = true;
  public isFLSAJobClassificationVisible: boolean = true;
  public isPreviousV_Visible: boolean = true;
  public isJoiningBonusVisible: boolean = false;
  public isRelocationBonusVisible: boolean = false;
  public isVisaCostVisible: boolean = false;

  public isIncentiveBonusVisible: boolean = false;
  public isAnnualVariableVisible: boolean = false;
  public isIntern: boolean = false;
  validationPayFields() {
    let empType = this.getControl('CandidateTypeID')?.value;
    // let salaryType = this.getControl('SalaryType')?.value;
    if (empType) {
      /*  14 c2c and 1010 direct contractor 
        hiding fields for both emp type*/
      if (empType == 14) {
        this.BasePayLabel = 'Vendor Rate';
        this.isBasePayVisible = true;
        this.isJoiningBonusVisible = false;
        this.isRelocationBonusVisible = false;
        this.isVisaCostVisible = false;
        this.isIncentiveBonusVisible = false;
        this.isAnnualVariableVisible = false;
        this.getControl('basePay').setValidators([Validators.required]);
        this.resetAllBonusFields();
        this.resetControl('internEndDate');
        this.clearValidators('internEndDate');
        this.isIntern = false;
        this.getControl('SalaryType').patchValue(3);
        this.selectSalaryType(3);
      } else
        if (empType == 1010) {
          this.BasePayLabel = 'Base Pay';
          this.isBasePayVisible = true;
          this.isJoiningBonusVisible = false;
          this.isRelocationBonusVisible = false;
          this.isVisaCostVisible = false;
          this.isIncentiveBonusVisible = false;
          this.isAnnualVariableVisible = false;
          this.getControl('basePay').setValidators([Validators.required]);
          this.resetAllBonusFields();
          this.resetControl('internEndDate');
          this.clearValidators('internEndDate');
          this.isIntern = false;
          this.getControl('SalaryType').patchValue(1);
          this.selectSalaryType(1);
        } else {

          this.BasePayLabel = 'Base Pay';
          // this.getControl('SalaryType').patchValue(1);
          //  this.selectSalaryType(1);
          /**intern 16 */
          if (empType == 16) {
            this.isIntern = true;
            this.addValidator('internEndDate');
          }
          else {
            this.resetControl('internEndDate');
            this.clearValidators('internEndDate');
            this.isIntern = false;
          }
          this.isJoiningBonusVisible = true;
          this.isRelocationBonusVisible = true;
          this.isVisaCostVisible = true;
          this.isIncentiveBonusVisible = true;
          this.isAnnualVariableVisible = true;
          this.isBasePayVisible = true;
          this.getControl('basePay').setValidators([Validators.required]);
        }
      this.getControl('basePay').updateValueAndValidity();
    }
  }

  /**resetig all bonus fileds */
  resetAllBonusFields() {
    this.getControl('annualVariablePay').reset();
    this.getControl('joiningBonusPay').reset();
    this.getControl('relocationPay').reset();
    this.getControl('visaCost').reset();
    this.getControl('incentiveBonus').reset();
  }

  //on selection of employment type
  selectEmploymentType(e: any) {
    if (this.getControl('CandidateTypeID')?.value == 14) {
      this.getApproverCont(this.getControl('gradeId')?.value, this.getControl('talentCubeCode')?.value, this.getControl('basePay')?.value, this.getControl('billRate')?.value, this.getControl('candidateLocationCity')?.value, e);
    } else {
      this.getApproverCont(this.getControl('gradeId')?.value, this.getControl('talentCubeCode')?.value, this.getControl('basePay')?.value, this.getControl('joiningBonusPay')?.value, this.getControl('candidateLocationCity')?.value, e);
    }
    this.getDGMCalcValue(e, this.getControl('SalaryType')?.value, this.getControl('basePay')?.value, this.getControl('annualVariablePay')?.value, this.getControl('joiningBonusPay')?.value, this.getControl('relocationPay')?.value, this.getControl('visaCost')?.value, this.getControl('billRate')?.value);
    if (e == 12 || e == 14) {
      this.getControl('medicalBenefitElligible').patchValue('0');
    } else {
      this.getControl('medicalBenefitElligible').patchValue('1');
    }
    this.showHideFieldsForCorpToCorp(e);

  }

  /**show hide corp to corp emp type */
  public isCorporateEmplyment: boolean = true;
  public isVisaExpiry: boolean = false;
  public isOfferType: boolean = true;
  showHideFieldsForCorpToCorp(id: number) {
    this.resetControl('VendorRefreeName');
    this.resetControl('clientLocationState');
    this.resetControl('clientLocationCity');
    this.resetControl('isBilableC2C');
    this.resetControl('visaExpireDate');
    this.resetControl('endDateC2C');
    // this.resetControl('offerType');
    if (id == 14) {
      this.isCorporateEmplyment = true;
      this.isLoadingCostVisible = false;
      this.isGrossSalaryUSDVisible = false;
      this.isMedicalBenefitVisible = false;
      this.isFLSAJobClassificationVisible = false;
      this.isPreviousV_Visible = false;
      this.isI9RepresentativeVisible = false;
      this.isSalaryGridVisible = false;
      this.clearValidators('I9Representative');
      this.clearValidators('I9RepresentativeEmp');
      this.clearValidators('medicalBenefitElligible');
      this.clearValidators('FLSAJobClassification');
      this.clearValidators('previousV');
      this.resetControl('I9Representative');
      this.resetControl('I9RepresentativeEmp');
      this.resetControl('medicalBenefitElligible');
      this.resetControl('FLSAJobClassification');
      this.resetControl('previousV');
      this.addValidator('VendorRefreeName');
      this.addValidator('clientLocationState');
      this.addValidator('clientLocationCity');
      this.addValidator('isBilableC2C');
      this.addValidator('endDateC2C');
      // this.clearValidators('visaExpireDate');
      this.clearValidators('offerType');
      this.resetControl('offerType');
      this.isOfferType = false;
      this.isVisaExpiry = false;
    }
    /**Direct Contractor 1010 */
    else if (id == 1010) {
      this.addValidator('offerType');
      // this.clearValidators('visaExpireDate');
      this.isVisaExpiry = false;
      this.clearValidators('VendorRefreeName');
      this.clearValidators('clientLocationState');
      this.clearValidators('clientLocationCity');
      this.clearValidators('isBilableC2C');
      this.clearValidators('endDateC2C');
      this.clearValidators('offerType');
      this.resetControl('offerType');
      this.isOfferType = false;
      this.isCorporateEmplyment = false;

      this.isLoadingCostVisible = true;
      this.isGrossSalaryUSDVisible = true;
      this.isSalaryGridVisible = true;
      this.isMedicalBenefitVisible = true;
      this.isFLSAJobClassificationVisible = true;
      this.isPreviousV_Visible = true;
      this.isI9RepresentativeVisible = true;
      this.addValidator('I9Representative');
      // this.addValidator('I9RepresentativeEmp');
      this.addValidator('FLSAJobClassification');
      this.addValidator('previousV');

    }
    else {
      this.clearValidators('VendorRefreeName');
      this.clearValidators('clientLocationState');
      this.clearValidators('clientLocationCity');
      this.clearValidators('isBilableC2C');
      this.clearValidators('endDateC2C');
      ///this.resetControl('offerType');
      this.isCorporateEmplyment = false;
      this.isVisaExpiry = true;
      // this.addValidator('visaExpireDate');
      this.isOfferType = true;
      // this.getControl('offerType').patchValue(1);
      //  offerType: data?.USOfferTypeId ? data?.USOfferTypeId : null,
      this.addValidator('offerType');
      this.isLoadingCostVisible = true;
      this.isGrossSalaryUSDVisible = true;
      this.isSalaryGridVisible = true;
      this.isMedicalBenefitVisible = true;
      this.isFLSAJobClassificationVisible = true;
      this.isPreviousV_Visible = true;
      this.isI9RepresentativeVisible = true;
      this.addValidator('I9Representative');
      //  this.addValidator('I9RepresentativeEmp');
      this.addValidator('FLSAJobClassification');
      this.addValidator('previousV');
    }
  }
  //on selection of salary type
  public getselectedSalType: any = {};
  selectSalaryType(val: any) {
    this.getselectedSalType = this.salaryTypeList.filter(d => d.id == val)[0];
    this.getDGMCalcValue(this.getControl('CandidateTypeID')?.value, val, this.getControl('basePay')?.value, this.getControl('annualVariablePay')?.value, this.getControl('joiningBonusPay')?.value, this.getControl('relocationPay')?.value, this.getControl('visaCost')?.value, this.getControl('billRate')?.value);
    this.calcAnnualizedSalary(this.getControl('basePay')?.value, val);
  }

  /**method for add validators */
  addValidator(name: string) {
    let ctrl = this.getControl(name);
    //  ctrl.setValidators([Validators.required]);
    ctrl?.setValidators([Validators.required]);
    ctrl?.updateValueAndValidity();
  }

  /**method for reset value */
  resetControl(name: string) {
    let ctrl = this.getControl(name);
    ctrl?.reset();
  }

  /**method for clear validators */
  clearValidators(name: string) {
    let ctrl = this.getControl(name);
    ctrl?.clearValidators();
    ctrl?.updateValueAndValidity();
  }




  /**
   * Division on changed
   */
  public divisionID: number = 1;
  public talentDetails: any = {};
  public isDemandCreateByCube: boolean = false;
  public isTCEditExcep: boolean = false;
  getCandidateDetails() {
    forkJoin([
      this._interviewStatus.getCandidateDetails(this.data.cid),
      this._offerService.getSelectedCandidateDetails(this.data.cid),
      this._offerService.getCandidateOfferAprDetails(this.data.cid),
      this._offerService.getOfferApprovalAttachaments(`cid=${this.data.cid}&ActionTakenBy=R`),
      this._talentServ.GetTHIDDetailsByTHID(this.data?.th_id)
    ]).subscribe(
      res => {
        this.allRoundList = res[0];
        this.candData = res[1]['data'][0];
        this.getAllApproverList();
        this.offerAprDt = res[2]['data'][0];
        //  this.previewFileExist(res[3]['data']);
        this.talentDetails = res[4]['data'][0];
        this.selectedList = this.allRoundList.roundList.filter(d => d?.interviewType?.Id === 4 && d?.InterViewStatus?.Id === 4);
        if (this.talentDetails?.TalentIdCreatedBy == 'TC') {
          this.isDemandCreateByCube = true;
        }
        else {
          this.isDemandCreateByCube = false
        }

        if (this.candData?.isTCEdit == 'Y') {
          this.isTCEditExcep = true
        }

        if (this.offerAprDt.OfferID === null) {
          this.getControl('talentCubeCode').patchValue(this.talentDetails?.TalentCubeId);
        }
        else {
          this.getControl('talentCubeCode').patchValue(this.offerAprDt?.TalentCubecodeId);
          this.stateId = this.offerAprDt?.joiningStateId;
          this.I9EmpHideShow(this.offerAprDt?.USI9RepresentativeId);
          this.getselectedSalType = this.salaryTypeList.filter(d => d.id == this.offerAprDt?.USSalaryType)[0];
          this.calcAnnualizedSalary(this.offerAprDt?.USBasePay, this.offerAprDt?.USSalaryType);
        }

        setTimeout(() => {
          this.setDefaultValue(this.offerAprDt);
          //  this.hideVandOtherContract(this.offerAprDt?.CandidateTypeID);
          //  this.getDGMCalcValue(1, this.offerAprDt.gradeId, this.offerAprDt.gradeBandId);
        }, 1000);
      }
    )
  }
  sendApprovalForm() {
    this.sendForApprovalForm = this._fb.group({
      legalFirstName: [null, [Validators.required]],
      legalLastName: [null, [Validators.required]],
      preferredName: [null],
      // phone: [null, [Validators.required]],
      // email: [null, [Validators.required]],
      workVisaStatus: [null],
      I9Representative: [null, [Validators.required]],
      legalEntity: [null],
      offerType: [null],
      departmentCode: [null],
      employeeUnit: [null, [Validators.required]],
      resourceFind: [null],
      title: [null, [Validators.required]],
      newOrRehire: [null],
      workingRemoteStatus: [null, [Validators.required]],
      relocation: [null],
      // noOfExpInYrs: [null, [Validators.required]],
      // prSkills: [null, [Validators.required]],
      //  subSkills: [null, [Validators.required]],
      // noOfYrsWithPrSkills: [null, [Validators.required]],
      SalaryType: [null, [Validators.required]],
      basePay: [null, [Validators.required]],
      performanceBonus: [null],
      annualVariablePay: [null],
      joiningBonusPay: [null],
      relocationPay: [null],
      visaCost: [null],
      incentiveBonus: [null],
      relocationAllownces: [null],
      medicalBenefitElligible: [null],
      FLSAJobClassification: [null, [Validators.required]],
      previousV: [null, [Validators.required]],
      reportingManager: [null, [Validators.required]],
      startDate: [null],
      //perHourCostRate: [null],
      billRate: [null, [Validators.required]],
      //margin: [null],
      CandidateTypeID: [null, [Validators.required]],
      gradeId: [null, [Validators.required]],
      talentCubeCode: [null, [Validators.required]],
      // PracticeId : [null, [Validators.required]],
      DivisionID: [null, [Validators.required]],
      TAGLead_Approver: [null],
      TAGHead_Approver: [null],
      DH_Approver: [null],
      SVP_Approver: [null],
      COO_Approver: [null],
    //  CDO_Approver: [null],
      VendorRefreeName: [null],
      clientLocationState: [null],
      clientLocationCity: [null],
      isBilableC2C: [null],
      endDateC2C: [null],
      internEndDate: [null],
      visaExpireDate: [null],
      joiningLocation: [null, [Validators.required]],
      CandidateLocationState: [null, [Validators.required]],
      candidateLocationCity: [null, [Validators.required]],
      I9RepresentativeEmp: [null],
      // isBilable:[null],
    })
  }


  public isI9RepresentativeEmp: boolean = false;
  I9RepresentativeFunc(e) {
    this.I9EmpHideShow(e.value)
  }

  I9EmpHideShow(value: number) {
    if (value == 3) {
      this.getControl('I9RepresentativeEmp').clearValidators();
      this.isI9RepresentativeEmp = false;
    }
    else {
      this.isI9RepresentativeEmp = true;
      this.getControl('I9RepresentativeEmp').addValidators([Validators.required]);
    }

    this.getControl('I9RepresentativeEmp').updateValueAndValidity();
  }

  myFilterDate = (d: Date): boolean => {
    const day = d?.getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  }

  //restrict initial zero
  restrictInitialZero(e) {
    if (e.target.value.length === 0 && e.key === "0") {
      e.preventDefault();
    }
  }

  public totalAnnualizedSalary: number = 0;
  calcAnnualizedSalary(pay: number, salType: number) {
    let totalSal: number = 0
    if (salType == 1) {
      totalSal = pay * 1
    }
    else if (salType == 2) {
      totalSal = pay * 12
    }
    else if (salType == 3) {
      totalSal = pay * 1880
    }

    this.totalAnnualizedSalary = totalSal;
  }

  /***
   * Method for input control
   */
  inputValueChangedFunc() {
    //ctc
    this.getControl('basePay').valueChanges.
      pipe(
        distinctUntilChanged(),
        debounceTime(500)
      ).subscribe(
        get => {
          this.calcAnnualizedSalary(get, this.getControl('SalaryType')?.value);
          // this.getApproverCont(this.getControl('gradeId').value, this.getControl('talentCubeCode').value, get, this.getControl('joiningBonusPay')?.value || 0, this.getControl('candidateLocationCity')?.value, this.getControl('CandidateTypeID').value);
          if (this.getControl('CandidateTypeID')?.value == 14) {
            this.getApproverCont(this.getControl('gradeId').value, this.getControl('talentCubeCode').value, get, this.getControl('billRate')?.value, this.getControl('candidateLocationCity')?.value, this.getControl('CandidateTypeID').value);
          } else {
            this.getApproverCont(this.getControl('gradeId').value, this.getControl('talentCubeCode').value, get, this.getControl('joiningBonusPay')?.value || 0, this.getControl('candidateLocationCity')?.value, this.getControl('CandidateTypeID').value);
          }
          this.getDGMCalcValue(this.getControl('CandidateTypeID')?.value, this.getControl('SalaryType')?.value, get, this.getControl('annualVariablePay')?.value, this.getControl('joiningBonusPay')?.value, this.getControl('relocationPay')?.value, this.getControl('visaCost')?.value, this.getControl('billRate')?.value);
        }
      )
    //joiningBonus

    this.getControl('joiningBonusPay')?.valueChanges.

      pipe(
        distinctUntilChanged(),
        debounceTime(500)
      ).subscribe(

        get => {
          if (get) {
            if (this.getControl('CandidateTypeID')?.value == 14) {
              this.getApproverCont(this.getControl('gradeId')?.value, this.getControl('talentCubeCode')?.value, this.getControl('basePay')?.value, this.getControl('billRate')?.value, this.getControl('candidateLocationCity')?.value, this.getControl('CandidateTypeID').value);
            } else {
              this.getApproverCont(this.getControl('gradeId')?.value, this.getControl('talentCubeCode')?.value, this.getControl('basePay')?.value, get, this.getControl('candidateLocationCity')?.value, this.getControl('CandidateTypeID').value);
            }
            // this.getApproverCont(this.getControl('gradeId')?.value, this.getControl('talentCubeCode')?.value, this.getControl('basePay')?.value, get, this.getControl('candidateLocationCity')?.value, this.getControl('CandidateTypeID').value);
            this.getDGMCalcValue(this.getControl('CandidateTypeID')?.value, this.getControl('SalaryType')?.value, this.getControl('basePay')?.value, this.getControl('annualVariablePay')?.value, get, this.getControl('relocationPay')?.value, this.getControl('visaCost')?.value, this.getControl('billRate')?.value);
          }
          else {
            if (this.getControl('CandidateTypeID')?.value == 14) {
              this.getApproverCont(this.getControl('gradeId').value, this.getControl('talentCubeCode').value, this.getControl('basePay').value, this.getControl('billRate')?.value, this.getControl('candidateLocationCity')?.value, this.getControl('CandidateTypeID').value);
            } else {
              this.getApproverCont(this.getControl('gradeId').value, this.getControl('talentCubeCode').value, this.getControl('basePay').value, 0, this.getControl('candidateLocationCity')?.value, this.getControl('CandidateTypeID').value);
            }
            // this.getApproverCont(this.getControl('gradeId').value, this.getControl('talentCubeCode').value, this.getControl('basePay').value, 0, this.getControl('candidateLocationCity')?.value, this.getControl('CandidateTypeID').value);
            this.getDGMCalcValue(this.getControl('CandidateTypeID')?.value, this.getControl('SalaryType')?.value, this.getControl('basePay')?.value, this.getControl('annualVariablePay')?.value, 0, this.getControl('relocationPay')?.value, this.getControl('visaCost')?.value, this.getControl('billRate')?.value);
          }
        }
      );

    //performanceBonus
    this.getControl('annualVariablePay')?.valueChanges.
      pipe(
        distinctUntilChanged(),
        debounceTime(500)
      ).subscribe(
        get => {
          if (get) {
            this.getDGMCalcValue(this.getControl('CandidateTypeID')?.value, this.getControl('SalaryType')?.value, this.getControl('basePay')?.value, get, this.getControl('joiningBonusPay')?.value, this.getControl('relocationPay')?.value, this.getControl('visaCost')?.value, this.getControl('billRate')?.value);
          }
          else {
            this.getDGMCalcValue(this.getControl('CandidateTypeID')?.value, this.getControl('SalaryType')?.value, this.getControl('basePay')?.value, 0, this.getControl('joiningBonusPay')?.value, this.getControl('relocationPay')?.value, this.getControl('visaCost')?.value, this.getControl('billRate')?.value);
          }
        }
      );
    //relocationBonus
    this.getControl('relocationPay')?.valueChanges.
      pipe(
        distinctUntilChanged(),
        debounceTime(500)
      ).subscribe(
        get => {
          if (get) {
            this.getDGMCalcValue(this.getControl('CandidateTypeID')?.value, this.getControl('SalaryType')?.value, this.getControl('basePay')?.value, this.getControl('annualVariablePay')?.value, this.getControl('joiningBonusPay')?.value, get, this.getControl('visaCost')?.value, this.getControl('billRate')?.value);
          }
          else {
            this.getDGMCalcValue(this.getControl('CandidateTypeID')?.value, this.getControl('SalaryType')?.value, this.getControl('basePay')?.value, this.getControl('annualVariablePay')?.value, this.getControl('joiningBonusPay')?.value, 0, this.getControl('visaCost')?.value, this.getControl('billRate')?.value);
          }
        }
      );
    //visa cost
    this.getControl('visaCost')?.valueChanges.
      pipe(
        distinctUntilChanged(),
        debounceTime(500)
      ).subscribe(
        get => {
          if (get) {
            this.getDGMCalcValue(this.getControl('CandidateTypeID')?.value, this.getControl('SalaryType')?.value, this.getControl('basePay')?.value, this.getControl('annualVariablePay')?.value, this.getControl('joiningBonusPay')?.value, this.getControl('relocationPay')?.value, get, this.getControl('billRate')?.value);
          }
          else {
            this.getDGMCalcValue(this.getControl('CandidateTypeID')?.value, this.getControl('SalaryType')?.value, this.getControl('basePay')?.value, this.getControl('annualVariablePay')?.value, this.getControl('joiningBonusPay')?.value, this.getControl('relocationPay')?.value, 0, this.getControl('billRate')?.value);
          }
        }
      );
    //bill rate
    this.getControl('billRate')?.valueChanges.
      pipe(
        distinctUntilChanged(),
        debounceTime(500)
      ).subscribe(
        get => {
          if (get) {
            if (this.getControl('CandidateTypeID')?.value == 14) {
              this.getApproverCont(this.getControl('gradeId')?.value, this.getControl('talentCubeCode')?.value, this.getControl('basePay')?.value, get, this.getControl('candidateLocationCity')?.value, this.getControl('CandidateTypeID').value);
            } else {
            }
            this.getDGMCalcValue(this.getControl('CandidateTypeID')?.value, this.getControl('SalaryType')?.value, this.getControl('basePay')?.value, this.getControl('annualVariablePay')?.value, this.getControl('joiningBonusPay')?.value, this.getControl('relocationPay')?.value, this.getControl('visaCost')?.value, get);
          }
          else {
            if (this.getControl('CandidateTypeID')?.value == 14) {
              this.getApproverCont(this.getControl('gradeId')?.value, this.getControl('talentCubeCode')?.value, this.getControl('basePay')?.value, 0, this.getControl('candidateLocationCity')?.value, this.getControl('CandidateTypeID').value);
            } else {
            }
            this.getDGMCalcValue(this.getControl('CandidateTypeID')?.value, this.getControl('SalaryType')?.value, this.getControl('basePay')?.value, this.getControl('annualVariablePay')?.value, this.getControl('joiningBonusPay')?.value, this.getControl('relocationPay')?.value, this.getControl('visaCost')?.value, 0);
          }
        }
      );
  }

  public CountryId: number;
  getCountry(e) {
    this.CountryId = e;
  }


  setDefaultValue(data: any) {
    this.CountryId = this.candData?.countryId;
    //  this.billingCurrencyControl.patchValue(this.candData?.CurrencyId);
    this.sendForApprovalForm.patchValue({
      legalFirstName: data?.USFirstName ? data?.USFirstName : null,
      legalLastName: data?.USLastNmae ? data?.USLastNmae : null,
      preferredName: data?.USPreferedName ? data?.USPreferedName : null,
      workVisaStatus: data?.USvisaID ? data?.USvisaID : null,
      I9Representative: data?.USI9RepresentativeId ? data?.USI9RepresentativeId : null,
      I9RepresentativeEmp: data?.I9RepresentativeEmp ? data?.I9RepresentativeEmp : null,
      legalEntity: data?.USLegalEntityId ? data?.USLegalEntityId : null,
      offerType: data?.USOfferTypeId ? parseInt(data?.USOfferTypeId) : null,
      CandidateTypeID: data?.CandidateTypeID ? data?.CandidateTypeID : null,
      departmentCode: data?.USDepartmentId ? data?.USDepartmentId.toString() : null,
      employeeUnit: data?.USUSEmpUnitId ? data?.USUSEmpUnitId : null,
      resourceFind: data?.USResourceId ? data?.USResourceId : null,
      title: data?.USTitleId ? data?.USTitleId : null,
      gradeId: data?.gradeId ? data?.gradeId : null,
      //  talentCubeCode: data?.TalentCubecodeId ? data?.TalentCubecodeId : null,
      newOrRehire: data?.USNewHireOrRehireId ? data?.USNewHireOrRehireId : null,
      workingRemoteStatus: data?.USRemoteStatusId ? data?.USRemoteStatusId : null,
      relocation: data?.USRelocationId != null ? data?.USRelocationId : null,
      // noOfExpInYrs: data?.USExpYear != null ? data?.USExpYear : null,
      //  prSkills: data?.USPskillId ? data?.USPskillId : null,
      // subSkills: data?.USSubSkillId ? data?.USSubSkillId : null,
      //  noOfYrsWithPrSkills: data?.USPskillExp != null ? data?.USPskillExp : null,
      SalaryType: data?.USSalaryType ? data?.USSalaryType : null,
      basePay: data?.USBasePay != null ? data?.USBasePay : null,
      // performanceBonus: data?.USPerfomanceBonous != null ? data?.USPerfomanceBonous : null,
      annualVariablePay: data?.USAnnualVariablePay != null ? data?.USAnnualVariablePay : null,
      joiningBonusPay: data?.USjoiningBonus != null ? data?.USjoiningBonus : null,
      relocationPay: data?.USRelocationPay != null ? data?.USRelocationPay : null,
      visaCost: data?.USVisaPay != null ? data?.USVisaPay : null,
      incentiveBonus: data?.USIncentiveBonus != null ? data?.USIncentiveBonus : null,
      relocationAllownces: data?.USRelocationAllowance != null ? data?.USRelocationAllowance : null,
      medicalBenefitElligible: data?.USMedicalBenifitsId != null ? data?.USMedicalBenifitsId.toString() : null,
      FLSAJobClassification: data?.USFLSACId ? data?.USFLSACId : null,
      previousV: data?.USPreviousV ? data?.USPreviousV : null,
      //  PracticeId: data?.PracticeId ? data?.PracticeId : null,
      reportingManager: data?.USReportingManagerId ? data?.USReportingManagerId : null,
      TAGLead_Approver: data?.USTagApprover ? data?.USTagApprover : null,
      TAGHead_Approver: data?.USTagHeadApprover ? data?.USTagHeadApprover : null,
      DH_Approver: data?.USDHApprover ? data?.USDHApprover : null,
      SVP_Approver: data?.USGDL ? data?.USGDL : null,
    //  CDO_Approver: data?.USCDO ? data?.USCDO : null,
      COO_Approver: data?.USCOO ? data?.USCOO : null,
      startDate: data?.USStartDate ? data?.USStartDate : null,
      internEndDate: data?.USInternEndDate ? data?.USInternEndDate : null,
      billRate: data?.USbillingRate != null ? data?.USbillingRate : null,

    }, { emitEvent: false });

    this.minDateEnd = this.offerAprDt.OfferID === null ? new Date(this.candData.doj) : new Date(data.DateOfJoining);
    this.showHideFieldsForCorpToCorp(this.getControl('CandidateTypeID').value);
    //this.getReportingManagersList(data?.gradeId);
    if (data?.gradeId) {
      this.getReportingManagersList(data?.gradeId);
    }
    this.getControl('VendorRefreeName').patchValue(data?.USVenderID ? data?.USVenderID : null);
    this.getControl('clientLocationState').patchValue(data?.USLocationStateId ? data?.USLocationStateId : null);
    this.getControl('clientLocationCity').patchValue(data?.USCityId ? data?.USCityId : null);
    this.getControl('isBilableC2C').patchValue(data?.IsBillableId != null ? data?.IsBillableId.toString() : null);
    this.getControl('endDateC2C').patchValue(data?.USENDDATE ? data?.USENDDATE : null);
    this.getControl('visaExpireDate').patchValue(data?.USVisaExpiryDate ? data?.USVisaExpiryDate : null);
    this.getControl('CandidateLocationState').patchValue(data?.joiningStateId ? data?.joiningStateId : null);
    this.getControl('candidateLocationCity').patchValue(data?.JoiningCityId ? data?.JoiningCityId : null);
    this.getControl('joiningLocation').patchValue(data?.JoiningLocationID ? data?.JoiningLocationID : null);
    this.validationPayFields();
    if (this.getControl('CandidateTypeID')?.value == 14) {
      this.getApproverCont(this.getControl('gradeId').value, this.getControl('talentCubeCode').value, this.getControl('basePay').value, this.getControl('billRate')?.value, this.getControl('candidateLocationCity')?.value, this.getControl('CandidateTypeID').value);
    } else {
      this.getApproverCont(this.getControl('gradeId').value, this.getControl('talentCubeCode').value, this.getControl('basePay').value, this.getControl('joiningBonusPay')?.value, this.getControl('candidateLocationCity')?.value, this.getControl('CandidateTypeID').value);
    }
    // this.getApproverCont(this.getControl('gradeId').value, this.getControl('talentCubeCode').value, this.getControl('basePay').value, this.getControl('joiningBonusPay')?.value, this.getControl('candidateLocationCity')?.value, this.getControl('CandidateTypeID').value);
  }

  /*
  get control Method*/
  getControl(name: string) {
    return this.sendForApprovalForm.get(name);
  }

  /***
 * change date
 */
  changeDate(type: string, event: any) {
    this.minDateEnd = new Date(event.value);
  }

  public stateId: number = 0;
  /**on change of state - reseting talent cube and salary details */
  getStateId(e) {
    this.stateId = e;
    if (this.talentDetails?.TalentIdCreatedBy != 'TC') {
      this.getControl('talentCubeCode').reset();
    }

    this.aprvCountDataList = [];
  }
  getCity(e: any) {
    if (this.getControl('CandidateTypeID')?.value == 14) {
      this.getApproverCont(this.getControl('gradeId').value, this.getControl('talentCubeCode').value, this.getControl('basePay').value, this.getControl('billRate')?.value, e, this.getControl('CandidateTypeID').value);
    } else {
      this.getApproverCont(this.getControl('gradeId').value, this.getControl('talentCubeCode').value, this.getControl('basePay').value, this.getControl('joiningBonusPay')?.value || 0, e, this.getControl('CandidateTypeID').value);
    }
    // this.getApproverCont(e, this.getControl('talentCubeCode').value, this.getControl('basePay').value, this.getControl('joiningBonusPay')?.value || 0, e, this.getControl('CandidateTypeID').value);
  }
  /**
   * get Grade Id
   * @param e 
   */
  getGradeId(e): void {
    this.getReportingManagersList(e);
    if (this.getControl('CandidateTypeID')?.value == 14) {
      this.getApproverCont(e, this.getControl('talentCubeCode').value, this.getControl('basePay').value, this.getControl('billRate')?.value, this.getControl('candidateLocationCity')?.value, this.getControl('CandidateTypeID').value);
    } else {
      this.getApproverCont(e, this.getControl('talentCubeCode').value, this.getControl('basePay').value, this.getControl('joiningBonusPay')?.value || 0, this.getControl('candidateLocationCity')?.value, this.getControl('CandidateTypeID').value);
    }
    //  this.getDGMCalcValue(0, this.getControl('gradeId').value, 0);

  }

  //get reporting managers list
  getReportingManagersList(gradeId: number) {
    this._extGlobalApiServ.GetReportingManagerBYGrade(gradeId).subscribe(
      res => {
        this.reportingManagerList = res['data'];
      }
    );
  }

  //get talent cube code id
  getTalentCubeCodeId(e): any {
    if (this.getControl('CandidateTypeID')?.value == 14) {
      this.getApproverCont(this.getControl('gradeId').value, e.value, this.getControl('basePay').value, this.getControl('billRate')?.value, this.getControl('candidateLocationCity')?.value, this.getControl('CandidateTypeID').value);
    } else {
      this.getApproverCont(this.getControl('gradeId').value, e.value, this.getControl('basePay').value, this.getControl('joiningBonusPay')?.value || 0, this.getControl('candidateLocationCity')?.value, this.getControl('CandidateTypeID').value);
    }
    // this.getApproverCont(this.getControl('gradeId').value, e.value, this.getControl('basePay').value, this.getControl('joiningBonusPay')?.value || 0, this.getControl('candidateLocationCity')?.value, this.getControl('CandidateTypeID').value);
    //    this.getDGMCalcValue(0, this.getControl('gradeId').value, this.getControl('gradeBand').value);

  }


  /***
   * get CTC
   */
  getCTC() {
    this.getControl('basePay').valueChanges.
      pipe(
        distinctUntilChanged(),
        debounceTime(500)
      ).subscribe(
        get => {
          if (this.getControl('CandidateTypeID')?.value == 14) {
            this.getApproverCont(this.getControl('gradeId').value, this.getControl('talentCubeCode').value, get, this.getControl('billRate').value, this.getControl('candidateLocationCity')?.value, this.getControl('CandidateTypeID').value);
          } else {
            this.getApproverCont(this.getControl('gradeId').value, this.getControl('talentCubeCode').value, get, this.getControl('joiningBonusPay').value, this.getControl('candidateLocationCity')?.value, this.getControl('CandidateTypeID').value);
          }
          // this.getApproverCont(this.getControl('gradeId').value, this.getControl('talentCubeCode').value, get, this.getControl('joiningBonusPay').value, this.getControl('candidateLocationCity')?.value, this.getControl('CandidateTypeID').value);
          //  this.getDGMCalcValue(0, this.getControl('gradeId').value, this.getControl('gradeBand').value);
        }
      )


  }
  /***
   * get ApproverList
   */

  public DPApproverList: any = [];
  public GDLApproverList: any = [];
  public COOLApproverList: any = [];
  public CDOApproverList: any = [];
  getAllApproverList() {
    this.candData?.RequirementTypeId
    let userEmp = this._storage.getUserEmpId();
    let data = {
      // empId: parseInt(userEmp),
      // Division: this.divisionID,
      cid: this.data.cid,
      ReqTypeId: this.candData?.RequirementTypeId
    }
    forkJoin([
      this._globalApiServe.getApproverListUS(1, data.cid, data.ReqTypeId),
      this._globalApiServe.getApproverListUS(2, data.cid, data.ReqTypeId),
      this._globalApiServe.getApproverListUS(3, data.cid, data.ReqTypeId),
      this._globalApiServe.getApproverListUS(7, data.cid, data.ReqTypeId)
    ]).subscribe(
      res => {
        this.DPApproverList = res[0]['data'];
        this.GDLApproverList = res[1]['data'];
        this.COOLApproverList = res[2]['data'];
        this.CDOApproverList = res[3]['data'];
        //  this.getApproverCont(this.offerAprDt.gradeId, this.offerAprDt.gradeBandId, this.offerAprDt.CTC, this.offerAprDt.JobFamilyID || 0, this.candData.totalExpYear, this.candData.totalExpMonth, this.offerAprDt.CandidateTypeID, this.divisionID, this.offerAprDt.joiningBonus, true);
      }
    )
  }
  /***
   * get Approver Count
   */
  public gradeID: number;
  public ctc: number;
  public isTag_ApproverReq: boolean = false;
  public isTag_ApproverShow: boolean = false;
  public isTagHead_ApproverReq: boolean = false;
  public isTagHead_ApproverShow: boolean = false;
  public isDH_ApproverReq: boolean = false;
  public isDH_ApproverShow: boolean = false;
  public isSvp_ApproverReq: boolean = false;
  public isSvp_ApproverShow: boolean = false;
  public isCDO_ApproverShow: boolean = false;
  public isPresidentCOOApprShow: boolean = false;
  public approverMsgMissing: string = '';
  public approverLength: number = 0;
  public aprvCountDataList: any = [];
  getApproverCont(gradeID: number, talentCubeCode: number, ctc: number, joiningBonus: number = 0, cityId: number, CandidateTypeID: number) {
    let DH_Approver = this.getControl('DH_Approver');
    let SVP_Approver = this.getControl('SVP_Approver');
    let COO_Approver = this.getControl('COO_Approver');
  //  let CDO_Approver = this.getControl('CDO_Approver');
    let tag_lead_approver = this.getControl('TAGLead_Approver');
    let tag_head_approver = this.getControl('TAGHead_Approver');
    let GradeLevelAboveG4 = this._globalCommonMethod.validationGradeAboveG4AndAbove(this.getControl('gradeId').value);
    // let GradeLevel = this.gradeList?.filter(r => r.GRADE_ID == this.getControl('gradeId')?.value)[0]?.Grade_Level;
    //  let JFCategory = this.getControl('JfCateg').value;
    //let CandidateTypeID = this.getControl('CandidateTypeID').value;
    joiningBonus = joiningBonus == null ? 0 : joiningBonus;

    //  let PracticeId: number = 0;
    //  if (isLoad) {
    //    PracticeId = this.offerAprDt?.PracticeId;
    //  }
    //  else {
    //     PracticeId = this.getControl('PracticeId').value;
    //  }
    if (gradeID && talentCubeCode && ctc && cityId && CandidateTypeID) {
      this._offerService.getApprovalCountForUS(gradeID, talentCubeCode, ctc, joiningBonus, cityId, CandidateTypeID).subscribe
        (
          res => {
            let data = res['data'][0];
            this.aprvCountDataList = data;
            this.approverMsgMissing = '';
            this.approverLength = data.NumberOfApprover;
            if (data.NumberOfApprover === 0) {
              this.clearValidators('DH_Approver');
              this.clearValidators('SVP_Approver');
              this.clearValidators('COO_Approver');
             // this.clearValidators('CDO_Approver');
              DH_Approver.reset();
              SVP_Approver.reset();
              COO_Approver.reset()
            //  CDO_Approver.reset()
              tag_lead_approver.clearValidators();
              tag_head_approver.clearValidators();
              this.isTag_ApproverShow = false;
              this.isTagHead_ApproverShow = false;
              this.isDH_ApproverShow = false;
              this.isSvp_ApproverShow = false;
              this.isCDO_ApproverShow = false;
              this.isPresidentCOOApprShow = false;
              this.approverMsgMissing = data.Msg;
              this._share.showAlertErrorMessage.next(data.Msg)
            }
            else {
              if (data.NumberOfApprover === 1) {
                this.isTag_ApproverShow = true;
                this.addValidator('TAGLead_Approver');
                this.clearValidators('DH_Approver');
                this.clearValidators('SVP_Approver');
                this.clearValidators('COO_Approver');
              //  this.clearValidators('CDO_Approver');
                DH_Approver.reset();
                SVP_Approver.reset();
                COO_Approver.reset();
              //  CDO_Approver.reset();
                tag_head_approver.clearValidators();
                this.isTagHead_ApproverShow = false;
                this.isDH_ApproverShow = false;
                this.isCDO_ApproverShow = false;
                this.isPresidentCOOApprShow = false;
                if (data?.isReplaceReq === 1) {
                  this.isSvp_ApproverShow = true;
                  this.addValidator('SVP_Approver');
                }
                else {
                  this.clearValidators('SVP_Approver');
                  this.isSvp_ApproverShow = false;
                }
              }
              else if (data.NumberOfApprover === 2) {
                this.isTag_ApproverShow = true;
                this.addValidator('TAGLead_Approver');
                this.isDH_ApproverShow = true;
                this.addValidator('DH_Approver');
                this.clearValidators('COO_Approver');
                this.clearValidators('CDO_Approver');
                COO_Approver.reset();
              //  CDO_Approver.reset();
                tag_head_approver.clearValidators();
                this.isTagHead_ApproverShow = false;
                this.isPresidentCOOApprShow = false;
                this.isCDO_ApproverShow = false;
                this.clearValidators('SVP_Approver');
                SVP_Approver.reset();
                if (data?.isReplaceReq === 1) {
                  this.isSvp_ApproverShow = true;
                  this.addValidator('SVP_Approver');
                }
                else {
                  this.clearValidators('SVP_Approver');
                  this.isSvp_ApproverShow = false;
                }

                setTimeout(() => {
                  DH_Approver.patchValue(this.DPApproverList[0]?.empnewid);
                }, 1000);
              }

              else if (data.NumberOfApprover === 3) {

                this.isTag_ApproverShow = true;
                this.addValidator('TAGLead_Approver');
                this.isDH_ApproverShow = true;
                this.addValidator('DH_Approver');
                this.isSvp_ApproverShow = true;
                this.addValidator('SVP_Approver');
                //  COO_Approver.clearValidators();
                this.clearValidators('COO_Approver');
                COO_Approver.reset();
                this.clearValidators('CDO_Approver');
             //   CDO_Approver.reset();
                tag_head_approver.clearValidators();
                this.isTagHead_ApproverShow = false;
                this.isPresidentCOOApprShow = false;
                this.isCDO_ApproverShow = false;
                setTimeout(() => {
                  DH_Approver.patchValue(this.DPApproverList[0]?.empnewid);
                  SVP_Approver.patchValue(this.GDLApproverList[0]?.empnewid);
                }, 1000);
              }
              else if (data.NumberOfApprover === 4) {
                
              if(GradeLevelAboveG4){             
                
                this.isTag_ApproverShow = true;
                this.addValidator('TAGLead_Approver');
                this.isTagHead_ApproverShow = true;
                this.addValidator('TAGHead_Approver');
                this.isDH_ApproverShow = true;
                this.addValidator('DH_Approver');
                this.isSvp_ApproverShow = true;
                this.addValidator('SVP_Approver');
                this.isCDO_ApproverShow = true;
                COO_Approver.clearValidators();
                COO_Approver.reset();
                this.isPresidentCOOApprShow = false;
                setTimeout(() => {
                  DH_Approver.patchValue(this.DPApproverList[0]?.empnewid);
                  SVP_Approver.patchValue(this.GDLApproverList[0]?.empnewid);
                //  CDO_Approver.patchValue(this.CDOApproverList[0]?.empnewid);
                }, 1000);
              }else{                
                tag_head_approver.clearValidators();
                this.isTagHead_ApproverShow = false;
              //  this.clearValidators('CDO_Approver');
              //  CDO_Approver.reset();
                this.isCDO_ApproverShow = false;
                this.isTag_ApproverShow = true;
                this.addValidator('TAGLead_Approver');
                this.isDH_ApproverShow = true;
                this.addValidator('DH_Approver');
                this.isSvp_ApproverShow = true;
                this.addValidator('SVP_Approver');
                this.isPresidentCOOApprShow = true;
                this.addValidator('COO_Approver');
                setTimeout(() => {
                  DH_Approver.patchValue(this.DPApproverList[0]?.empnewid);
                  SVP_Approver.patchValue(this.GDLApproverList[0]?.empnewid);
                }, 1000);
               }
               }

              DH_Approver.updateValueAndValidity();
              SVP_Approver.updateValueAndValidity();
              COO_Approver.updateValueAndValidity();
           //   CDO_Approver.updateValueAndValidity();
              tag_head_approver.updateValueAndValidity();
            }
          }
        )
    }
  }


  //get infogain location 
  public locationList: any = [];
  getLocation() {
    this._globalApiServe.getLocationList().subscribe(
      res => {
        let ids = [3];
        // let ids = [];
        // if (this.data.DivisionID == 7) {
        //   ids = [1, 2, 4, 5, 16];
        // } else {
        //   ids = [1, 2, 4, 5];
        // }
        let filterLocation = res['data'].filter(loc => {
          return ids.indexOf(loc.LocID) !== -1;
        })
        this.locationList = filterLocation;
        // this.locationList = res['data']
      }
    );
  }

  public GMData: any = {};
  getDGMCalcValue(employeeTypeId: number = null, SalaryType: number = null, annualCTC: number = 0, AnnualVariablePay: number = 0, joiningBonus: number = 0, RelocationBonus: number = 0, VisaCost: number = 0, ClientBillingRate: number = 0) {
    let obj =
    {
      EmployeeTypeID: employeeTypeId,
      SalaryType: SalaryType,
      annualCTC: annualCTC,
      PerformanceBonus: AnnualVariablePay,
      joiningBonus: joiningBonus,
      RelocationBonus: RelocationBonus,
      VisaCost: VisaCost,
      ClientBillingRate: ClientBillingRate
    };
    this._offerService.getGMData(obj).subscribe(
      res => {
        if (res) {
          this.GMData = res['data'][0];
        }
      })
  }


  // elm.OfferStatusID === 120 ||
  //       elm.OfferStatusID === 135 || 
  //       elm.OfferStatusID === 140 ||
  //       elm.OfferStatusID === 160 ||
  //       elm.OfferStatusID === 180 ||
  //       elm.OfferStatusID === 220

  //submit sendapproval
  sendApprovalSubmit(form: UntypedFormGroup, action: string) {

    form.markAllAsTouched();
    if (form.valid) {
      let empId = this._storage.getUserEmpId();
      let formValue = form.value;
      let formData = {};
      formData['Division'] = this.divisionID;
      formData['cid'] = this.data.cid;
      formData['OfferID'] = this.offerAprDt.OfferID === null ? 0 : this.offerAprDt.OfferID;
      formData['ActionTaken'] = action;
      formData['OfferGivenBy'] = empId;
      if (this.offerAprDt.StatusID === 100
        || this.offerAprDt.StatusID === 120
        || this.offerAprDt.StatusID === 140
        || this.offerAprDt.StatusID === 160
        || this.offerAprDt.StatusID === 180
        || this.offerAprDt.StatusID === 220
        || this.offerAprDt.StatusID === 135) {
        formData['IsRevised'] = 'Y';
      }
      if (this.offerAprDt.StatusID === 270
      ) {
        formValue['IsReinitiate'] = 'Y';
      }
      if (formValue['legalFirstName']) {
        formData['FirstName'] = formValue['legalFirstName'];
      }
      if (formValue['legalLastName']) {
        formData['LastName'] = formValue['legalLastName'];
      }
      if (formValue['preferredName']) {
        formData['PreferedName'] = formValue['preferredName'];
      }
      if (formValue['workVisaStatus']) {
        formData['VisaId'] = formValue['workVisaStatus'];
      }
      if (formValue['I9Representative']) {
        formData['I9RepresentativeId'] = formValue['I9Representative'];
      }
      if (formValue['legalEntity']) {
        formData['LegalEntityId'] = formValue['legalEntity'];
      }

      // if (formValue['divisionID']) {
      //   formData['Division'] = formValue['divisionID'];
      // }
      if (formValue['offerType']) {
        formData['OfferTypeId'] = formValue['offerType'];
      }
      if (formValue['CandidateTypeID']) {
        formData['EmploymentTypeId'] = formValue['CandidateTypeID'];
      }
      if (formValue['departmentCode']) {
        formData['DepartmentId'] = formValue['departmentCode'];
      }
      if (formValue['employeeUnit']) {
        formData['EmpUnit'] = formValue['employeeUnit'];
      }
      if (formValue['resourceFind']) {
        formData['ResourceId'] = formValue['resourceFind'];
      }
      if (formValue['title']) {
        formData['TitleId'] = formValue['title'];
      }
      if (formValue['gradeId']) {
        formData['GradeId'] = formValue['gradeId'];
      }
      if (formValue['talentCubeCode']) {
        formData['TalentCubecode'] = formValue['talentCubeCode'];
      }
      if (formValue['newOrRehire']) {
        formData['NewHireOrRehireId'] = formValue['newOrRehire'];
      }
      if (formValue['workingRemoteStatus']) {
        formData['RemoteStatusId'] = formValue['workingRemoteStatus'];
      }
      if (formValue['relocation']) {
        formData['Relocation'] = formValue['relocation'];
      }
      // if (formValue['noOfExpInYrs']) {
      //   formData['ExpInYear'] = formValue['noOfExpInYrs'];
      // }
      // if (formValue['prSkills']) {
      //   formData['PrimarySkillID'] = formValue['prSkills'];
      // }
      // if (formValue['subSkills']) {
      //   formData['SubSkillId'] = formValue['subSkills'];
      // }
      // if (formValue['noOfYrsWithPrSkills']) {
      //   formData['ExpYearPriamrySkill'] = formValue['noOfYrsWithPrSkills'];
      // }
      if (formValue['SalaryType']) {
        formData['SalaryType'] = formValue['SalaryType'];
      }
      if (formValue['basePay']) {
        formData['BasePay'] = formValue['basePay'];
      }
      // if (formValue['performanceBonus']) {
      //   formData['PerfomanceBonous'] = formValue['performanceBonus'];
      // }
      if (formValue['annualVariablePay']) {
        formData['AnnualVariablePay'] = formValue['annualVariablePay'];
      }
      if (formValue['joiningBonusPay']) {
        formData['joiningBonuspay'] = formValue['joiningBonusPay'];
      }
      if (formValue['relocationPay']) {
        formData['RelocationPay'] = formValue['relocationPay'];
      }
      // if (formValue['relocationAllownces']) {
      //   formData['RelocationAllowance'] = formValue['relocationAllownces'];
      // }
      if (formValue['visaCost']) {
        formData['VisaPay'] = formValue['visaCost'];
      }
      if (formValue['incentiveBonus']) {
        formData['IncentiveBonus'] = formValue['incentiveBonus'];
      }
      if (formValue['medicalBenefitElligible']) {
        formData['MedicalBenifits'] = formValue['medicalBenefitElligible'];
      }


      if (formValue['FLSAJobClassification']) {
        formData['FLSACId'] = formValue['FLSAJobClassification'];
      }
      if (formValue['previousV']) {
        formData['PreviousV'] = formValue['previousV'];
      }
      // if (formValue['PracticeId']) {
      //   formData['PracticeId'] = formValue['PracticeId'];
      // }

      if (formValue['reportingManager']) {
        formData['ReportingManager'] = formValue['reportingManager'];
      }
      if (formValue['startDate']) {
        formData['StartDate'] = GlobalMethod.formatDate(formValue['startDate']);
      }

      // corp to Crop
      if (formValue['VendorRefreeName']) {
        formData['VenderId'] = formValue['VendorRefreeName'];
      }
      if (formValue['clientLocationState']) {
        formData['LocationStateId'] = formValue['clientLocationState'];
      }
      if (formValue['clientLocationCity']) {
        formData['CityID'] = formValue['clientLocationCity'];
      }
      if (formValue['isBilableC2C']) {
        formData['IsBillable'] = formValue['isBilableC2C'];
      }
      if (formValue['endDateC2C']) {
        formData['EndDate'] = GlobalMethod.formatDate(formValue['endDateC2C']);
      }
      if (formValue['visaExpireDate']) {
        formData['VisaExpiryDate'] = GlobalMethod.formatDate(formValue['visaExpireDate']);
      }
      // corp to Crop ends
      /**Margin Calculator */
      if (formValue['billRate']) {
        formData['billingRate'] = formValue['billRate'];
      }
      if (this.GMData['LoadingCost'] && this.getControl('CandidateTypeID')?.value != 14) {
        formData['LoadingCostinUSD'] = this.GMData['LoadingCost'];
      }
      if (this.GMData['GrossSalary'] && this.getControl('CandidateTypeID')?.value != 14) {
        formData['GrossSalaryinUSD'] = this.GMData['GrossSalary'];
      }
      if (this.GMData['PerHrRate']) {
        formData['PerHourCostRateinUSD'] = this.GMData['PerHrRate'];
      }
      if (this.GMData['GrossMargin']) {
        formData['GrossMargin'] = this.GMData['GrossMargin'];
      }

      /**Margin Calculator ends */
      /** */

      if (formValue['TAGLead_Approver']) {
        formData['TAGLead_Approver'] = formValue['TAGLead_Approver'];
      }
      if (formValue['TAGHead_Approver']) {
        formData['TAGHead_Approver'] = formValue['TAGHead_Approver'];
      }
      if (formValue['DH_Approver']) {
        formData['DH_Approver'] = formValue['DH_Approver'];
      }
      if (formValue['SVP_Approver']) {
        formData['SVP_Approver'] = formValue['SVP_Approver'];
      }
      if (formValue['CDO_Approver']) {
        formData['CDO_Approver'] = formValue['CDO_Approver'];
      }
      if (formValue['COO_Approver']) {
        formData['COO_Approver'] = formValue['COO_Approver'];
      }
      if (formValue['CandidateLocationState']) {
        formData['JoiningStateId'] = formValue['CandidateLocationState'];
      }
      if (formValue['candidateLocationCity']) {
        formData['JoinigCityID'] = formValue['candidateLocationCity'];
      }
      if (formValue['internEndDate']) {
        formData['InternEndDate'] = GlobalMethod.formatDate(formValue['internEndDate']);
      }
      if (formValue['I9RepresentativeEmp']) {
        formData['I9RepresentativeEmp'] = formValue['I9RepresentativeEmp'];
      }
      debugger
      /**timezone by ar  */
      let OfferAcceptDate = new Date();
      let OfferAcceptTime = OfferAcceptDate.getHours() + ':' + OfferAcceptDate.getMinutes() + ':' + OfferAcceptDate.getSeconds();
      formData['AddedOnDateUTC'] = GlobalMethod.convertToUTCDate(OfferAcceptDate);
      formData['AddedOnTimeZone'] = GlobalMethod.getTimezone();
      formData['AddedOffsetDate'] = GlobalMethod.getOffset().toString();
      formData['ModifiedOnUTC'] = GlobalMethod.convertToUTCDate(OfferAcceptDate);
      formData['ModifiedOnTimeZone'] = GlobalMethod.getTimezone();
      formData['ModifiedOnOffsetDate'] = GlobalMethod.getOffset().toString();
      formData['OfferedOnUTC'] = GlobalMethod.convertToUTCDate(OfferAcceptDate);
      formData['OfferedOnTimeZone'] = GlobalMethod.getTimezone();
      formData['OfferedOnOffsetDate'] = GlobalMethod.getOffset().toString();
      formData['RevisedOfferDateUTC'] = GlobalMethod.convertToUTCDate(OfferAcceptDate);
      formData['RevisedOfferDateTimeZone'] = GlobalMethod.getTimezone();
      formData['RevisedOfferDateOffsetDate'] = GlobalMethod.getOffset().toString();
      // if (formValue['Remark']) {
      //   formData['Remark'] = formValue['Remark'];
      // }

      this._offerService.addUpdateOfferApprovalForUS(formData).subscribe(
        res => {
          this._share.showAlertSuccessMessage.next(res.Message);
          this.dialogRef.close(true);
        }
      )
    } else {
      this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
    }

  }

  /**
  * show interview round details
  * @param data 
  */
  openfeedbackInfoModal(data: any) {
    const dialogRef = this.dialog.open(FeedbackRoundDetailsComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'update-interview-feedback'],
      data: data,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }

  closeModal(): void {
    this.dialogRef.close();
  }

}
