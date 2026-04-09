import { AfterContentInit, AfterViewInit, Component, Inject, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { COMMON_CONST, FILE_UPLOAD } from 'projects/ats-global-system/src/app/core/constant/common.const';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { InterviewCommonService } from 'projects/ats-global-system/src/app/core/services/interview-common.service'
import { forkJoin } from 'rxjs';
import { TalentService } from '../../../talent.service';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { ConfirmationDialogComponent } from 'projects/ats-global-system/src/app/shared/shared-app/components/confirmation-dialog/confirmation-dialog.component';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { GlobalCommonMethodService } from 'projects/ats-global-system/src/app/core/common/global-common-method.service';
import { ProposeEmployyeeModalComponent } from '../propose-employyee-modal/propose-employyee-modal.component';
import { TalentCubeRefrenceGridComponent } from '../talent-cube-refrence-grid/talent-cube-refrence-grid.component';
import { MatLegacySelect as MatSelect } from '@angular/material/legacy-select';
import { GetLocationInfo } from 'projects/ats-global-system/src/app/core/common/getLocationInfo';
import { Editor, Toolbar, toHTML } from 'ngx-editor';
import { JDListModalTcComponent } from '../jd-list-modal-tc/jd-list-modal-tc.component';
import { MandateskillConfirmationComponent } from '../mandateskill-confirmation/mandateskill-confirmation.component';
@Component({
  selector: 'app-create-job-position-modal',
  templateUrl: './create-job-position-modal.component.html',
  styleUrls: ['./create-job-position-modal.component.scss']
})
export class CreateJobPositionModalComponent implements OnInit, AfterViewInit, OnDestroy {
  public formAppearance: string = 'outline';
  public formClass: string = 'form-fill-ats';
  public formClassCol: string = 'ats-form-col';
  public addiSkillMulti: boolean = true;
  public isSpecialBidTypeAndProjectDateVisi: boolean = false;
  public user: any = [];
  public today = new Date();
  public submitJobCreateForm: UntypedFormGroup = new UntypedFormGroup({});
  public isEmpUnitSupportActive: boolean = true;
  public isEmpUnitDeliveryActive: boolean = true;
  public isDisableForEdit: boolean = false;
  public isDisableForEdit2: boolean = false;
  public isDisableForEditWMG: boolean = false;
  public isDisableForClone: boolean = false;
  public isCloneForReqType: boolean = false;
  public isActiveEmp: boolean = false;
  public isJdEditable: boolean = false;
  public disablePastDate: Date = (() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight
    return today;
  })();

  public disablePastDateOnBoadring: [];
  public labelInterviewBiling: string = 'Position & Interview Details'
  public isCloneThId: boolean = false;
  public FilterCtrlPrimarySkillTc: UntypedFormControl = new UntypedFormControl();
  public searchInputPrimarySkillTc: string;
  commonConst = COMMON_CONST;
  // public minDate: any = new Date(new Date().setDate(new Date().getDate() - 6));
  public minDatebilling: any = new Date();
  public BillingTypeList: any = [];
  public isInitCallAPISubSkill: boolean = false;
  public isLocationEditAllow: boolean = false;
  editor: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    // ['bold'],
    ['underline', 'strike'],
    // ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    // ['link', 'image'],
    ['text_color', 'background_color'],
    //['align_left', 'align_center', 'align_right', 'align_justify'],
  ];
  public clientWorkRequirementOptions: any = [];
  public locationTypeOptions: any = [];

  isLocationTypeVisible = false;
  constructor(
    public dialogRef: MatDialogRef<CreateJobPositionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private _fb: UntypedFormBuilder,
    private _share: ShareService,
    private _globalServe: GlobalApisService,
    private _talentServ: TalentService,
    private _storage: GetSetStorageService,
    private _GlobCommon: GlobalCommonMethodService,
    private _getLocInfo: GetLocationInfo
  ) {
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  public EmpListData: any = [];
  public isUpdateMode: boolean = false;
  ngOnInit(): void {
    this.editor = new Editor();
    this.formInit();
    this.getLocationList();
    this.excuteAllAPI();
    this.statusChangeFunc();
    this.user = this._storage.getSetUserData();
    let EmpId = this._storage.getUserEmpId();
    let modalOpenType = this.data?.type;
    debugger
    if (modalOpenType == 'U' || modalOpenType == 'A' || modalOpenType == 'UW' || modalOpenType == 'E') {
      this.isUpdateMode = true;
    }
    this.GetSubSkills(0);
    // this.GetNumberOfOffersOnTid(this.data?.TH_ID);
    // this.checkvalidationBasedOnnReqType();
    this._globalServe.getEmployeeList(EmpId, 0, null, null).subscribe(res => {
      this.EmpListData = res['data'];
      this.checkvalidationBasedOnnReqType();
    })

  }
  /***
   * checking validation based on req type
   */
  checkvalidationBasedOnnReqType() {
    /**type U for update */
    if (this.data?.type == 'U') {
      this.setDefaultValueToForm();
      this.isDisableForEdit = true;
      this.isDisableForEdit2 = false;
      this.isDisableForEditWMG = false;
      this.isDisableForClone = false;
      this.isActiveEmp = false;
      this.getControl('jobDescription').enable();
      this.clearValidators('approveRejectstatus');

      this.isJdEditable = false;

      this.isLocationEditAllow = false;
      this.checkLocationEdiEligibility();
      this.getControl('Frequency').clearValidators();
      this.isCloneThId = false;
      this.isCloneForReqType = false;
    }
    /**type UW for update by WMG */

    else if (this.data?.type == 'UW') {
      this.setDefaultValueToForm();
      this.isDisableForEdit = true;
      this.isDisableForEditWMG = true;
      this.isDisableForClone = false;
      this.isActiveEmp = false;
      this.isDisableForEdit2 = false;
      this.getControl('jobDescription').enable();
      this.clearValidators('approveRejectstatus');

      this.isJdEditable = false;
      this.isLocationEditAllow = false;
      /**checking any offer is initiated on this talent */
      // this._talentServ.GetNumberOfOffersOnTid(this.data?.TH_ID).subscribe(
      //   res => {
      //     debugger
      //     let countData = res['data'][0];
      //     if (countData.OfferCount == 0) {
      //       this.isLocationEditAllow = true;
      //     } else {
      //       this.isLocationEditAllow = false;
      //     }
      //   }
      // )

      this.getControl('Frequency').clearValidators();
      this.isCloneThId = false;
      this.isCloneForReqType = false;
    }
    else
      /**type E for Edit for bizops*/
      if (this.data?.type == 'E') {
        this.setDefaultValueToForm();
        this.isDisableForEdit = false;
        this.isDisableForEdit2 = true;
        this.isDisableForEditWMG = false;
        this.isDisableForClone = false;
        this.isActiveEmp = false;
        this.getControl('jobDescription').disable();
        this.clearValidators('approveRejectstatus')

        this.isJdEditable = false;
        this.getControl('expectedMargin').disable();
        this.getControl('billableRates').disable();

        //this.isLocationEditAllow = false;

        /**if pending with dp then location change for bizops */
        this.checkLocationEdiEligibility();
        this.getControl('Frequency').clearValidators();
        this.isCloneThId = false;
        this.isCloneForReqType = false;
      }
      /**type A for Approve */
      else if (this.data?.type == 'A') {
        this.setDefaultValueToForm();
        this.isDisableForEdit = true;
        this.isDisableForEditWMG = false;
        this.isDisableForClone = false;
        this.isActiveEmp = false;
        this.isDisableForEdit2 = false;
        this.getControl('jobDescription').enable();
        this.addValidator('approveRejectstatus');

        this.isJdEditable = false;
        this.isLocationEditAllow = false;
        this.getControl('Frequency').clearValidators();
        this.isCloneThId = false;
        this.isCloneForReqType = false;

        // status id 5 - reffred back by wmg
        // if (this.data?.SubStatusID == 5) {

        // }
        /**if referred back by wmg then location change for bizops on approval option */
        this.checkLocationEdiEligibility();
      }
      /**type C for clone */
      else if (this.data?.type == 'C') {
        this.setDefaultValueToForm();
        this.isDisableForEdit = false;
        this.isDisableForEditWMG = false;
        this.isDisableForClone = true;
        this.isActiveEmp = false;
        this.isDisableForEdit2 = false;
        this.getControl('jobDescription').enable();
        this.clearValidators('approveRejectstatus');
        this.isCloneThId = true;
        this.getControl('Frequency').addValidators([Validators.required, Validators.max(40)]);
        this.isJdEditable = false;
        this.isLocationEditAllow = false;
        this.isCloneForReqType = true;
      }
      else if (this.data?.type == 'JD') {
        this.setDefaultValueToForm();

        this.isDisableForEdit = false;
        this.isDisableForEditWMG = false;
        this.isDisableForClone = false;
        this.isActiveEmp = false;
        this.getControl('jobDescription').enable();
        this.clearValidators('approveRejectstatus');
        this.isJdEditable = true;
        this.getControl('Remarks').disable();
        this.getControl('cubeSkill1').disable();
        this.getControl('cubeSkill2').disable();
        this.getControl('cubeSkill3').disable();
        this.getControl('cubeSkill4').disable();
        this.isDisableForEdit2 = false;

        this.getControl('AcccesmentLink').disable();
        this.getControl('expectedMargin').disable();
        this.getControl('billableRates').disable();
        this.getControl('employeeEmail').disable();
        // this.getControl('conversionRemarks').disable();
        this.isLocationEditAllow = false;

        this.getControl('Frequency').clearValidators();
        this.isCloneThId = false;
        this.isCloneForReqType = false;
      }
      else {
        this.isDisableForEdit = false;
        this.isDisableForEditWMG = false;
        this.isDisableForClone = false;
        this.isActiveEmp = true;
        this.getControl('jobDescription').enable();
        this.employeeUnitCont.patchValue(1);
        this.getEmployeeUnitId({ value: 1 });
        this.clearValidators('approveRejectstatus');
        this.isJdEditable = false;
        this.isLocationEditAllow = false;

        this.getControl('Frequency').clearValidators();
        this.isCloneThId = false;
        this.isCloneForReqType = false;
      }
    this.getControl('Frequency').updateValueAndValidity();
    /***
     * If auto
     */
    if (this.user?.otherRoles?.IsTalentAutoApproval == 'Y') {
      this.isAttechmentRequiredAppr = true;
      this.addValidator('THIDApprovalAttachment');

    } else {
      this.clearValidators('THIDApprovalAttachment');
      this.isAttechmentRequiredAppr = false;

    }

  }
  /** checking location eligilibilty by api  */
  checkLocationEdiEligibility() {
    if (this.data?.SubStatusID == 2 || this.data?.SubStatusID == 5) {
      /**checking any offer is initiated on this talent & reffred back by tag
       * - if no offere and not reffred back by tag then location edit enable*/
      this._talentServ.GetNumberOfOffersOnTid(this.data?.TH_ID).subscribe(
        res => {
          let countData = res['data'][0];
          if (countData.OfferCount == 0 && countData.IsLocaltionEnable == 0) {
            this.isLocationEditAllow = true;
            this.locationFilterForEdit(this.data?.LocationID);

          } else {
            this.isLocationEditAllow = false;
          }
        }
      )
    } else {
      this.isLocationEditAllow = false;
    }
  }
  /**show/hide locationwise */
  public isVisibleForIndia: boolean = false;
  public isVisibleForUS: boolean = false;
  showHideLocWise(joinLocID: number) {
    this.GetReasonForNotOptOnlineExternalAssessment(this.talentDetails?.Tech1InterviewById);
    if (joinLocID == 1 || joinLocID == 4 || joinLocID == 11 || joinLocID == 16 || joinLocID == 10
      || joinLocID == 5 || joinLocID == 2 || joinLocID == 21 || joinLocID == 23) {
      this.isVisibleForIndia = true;

      if (this.talentDetails?.ReqTypeID == 6 || this.requirementTypeID == 6) {
        this.clearValidators('tech1InterviewBy');
        this.resetControl('tech1InterviewBy');
        this.tech1interviewBy = false;

      } else {
        if (this.talentDetails?.IsInternelID != "Y") {
          this.tech1interviewBy = true;
          this.addValidator('tech1InterviewBy');
        }
      }
      if (this.data?.type == 'U' || this.data?.type == 'A' || this.data?.type == 'UW'
        || this.data?.type == 'C' || this.data?.type == 'JD' || this.data?.type == 'E') {

        let val: any = [];
        val['value'] = this.talentDetails?.Tech1InterviewById;
        this.showHideTech1InterviewBy(val);
        this.getControl('tech1InterviewBy').patchValue(this.talentDetails?.Tech1InterviewById ? this.talentDetails?.Tech1InterviewById : null);
        /**show hide interview tech by */
        if (this.talentDetails?.Tech1InterviewById == 1) {
          this.getControl('onlineAssesment').patchValue(this.talentDetails?.OnlineAssesmentById ? this.talentDetails?.OnlineAssesmentById : null);
          /** 1 for coderbyte 2 for glider, 3 for mettl */
          if (this.talentDetails?.OnlineAssesmentById == 1) {
            this.isCoderByteAssesments = true;
            this.addValidator('coderBytesAssesments');
            this.getControl('coderBytesAssesments').patchValue(this.talentDetails?.codeByteTestId ? this.talentDetails?.codeByteTestId : null);
            this.selectedCoderByteAssessment['test_id'] = this.talentDetails?.codeByteTestId;
            this.selectedCoderByteAssessment['public_url'] = this.talentDetails?.coderBytePublicKey;
            this.selectedCoderByteAssessment['display_name'] = this.talentDetails?.coderByteDisplayName;
            this.resetControl('AcccesmentLink');
          }
          else {
            this.isAssesmentLink = true;
            this.addValidator('AcccesmentLink');
            this.getControl('AcccesmentLink').patchValue(this.talentDetails?.AssessmentLink ? this.talentDetails?.AssessmentLink : null);
            this.selectedCoderByteAssessment = [];
          }
        }
        else if (this.talentDetails?.Tech1InterviewById == 2) {
          this.getControl('techInternalPanel').patchValue(this.talentDetails?.ReasonNotOptId ? this.talentDetails?.ReasonNotOptId : null);
        } else {
          // this.getControl('techInternalPanel').patchValue(this.talentDetails?.ReasonNotOptId ? this.talentDetails?.ReasonNotOptId : null);
          this.getControl('techExternalPanel').patchValue(this.talentDetails?.ReasonforOptId ? this.talentDetails?.ReasonforOptId : null);
        }
      }


    } else {
      this.resetControl('tech1InterviewBy');

      this.resetControl('onlineAssesment');
      this.resetControl('AcccesmentLink');
      this.resetControl('techInternalPanel');
      this.resetControl('techExternalPanel');

      this.clearValidators('tech1InterviewBy');

      this.clearValidators('onlineAssesment');
      this.clearValidators('AcccesmentLink');
      this.clearValidators('techInternalPanel');
      this.clearValidators('techExternalPanel');


      this.isVisibleForIndia = false;

    }
  }

  public editorLen: string = '';
  public JobSecHtml: string = '';
  ngAfterViewInit() {
    this.editor.valueChanges.subscribe(
      get => {
        this.JobSecHtml = toHTML(get);
        const el = document.createElement('div')
        el.innerHTML = this.JobSecHtml;
        this.editorLen = el.textContent;
        if (this.editorLen?.length < 100 && this.isRejectTalent == false) {
          this.getControl('jobDescription').setErrors({ 'invalid': true })
        }

      }
    )

  }


  /***
   * get Recuirment Type base on emp unit
   */
  getReqTypeIdByEmpUnit() {
    /**if emp unit support then we are sending hard coded requrement id for account list  */
    let requirementTypeID = this.employeeUnitCont.value === 1 ? this.requirementTypeID : 2;

    return requirementTypeID;
  }


  /***
   * Set Default control Value for update cases
   */
  public talentDetails: any = {};
  public MandatorySkills: any = [];
  public GoodToHaveSkills: any = [];
  public interviewersListOfThId: any = [];
  setDefaultValueToForm() {
    this._talentServ.GetTHIDDetailsByTHID(this.data?.TH_ID).subscribe(
      res => {
        this.talentDetails = res['data'][0];
        this.MandatorySkills = res['MandatorySkills'];
        this.GoodToHaveSkills = res['GoodToHaveSkills'];
        this.interviewersListOfThId = res['InterviewDetails'];

        /**cancel reason category while rejcting talent */
        this.getCancelTalentReasonCateg();
        // this.minDatebilling = new Date(this.talentDetails?.pOnboardDate);


        if (this._getLocInfo.isLocationIndiaById(this.talentDetails?.JoiningLocID)) {
          this.isLocationIndia = true;
        }
        else {
          this.isLocationIndia = false;
        }
        this.employeeUnitCont.patchValue(this.talentDetails?.DeliveryOrFunction ? parseInt(this.talentDetails?.DeliveryOrFunction) : null);
        if (this.talentDetails?.DeliveryOrFunction) {
          this.getEmployeeUnitId({ value: parseInt(this.talentDetails?.DeliveryOrFunction) });
        }
        if (this.talentDetails?.ClientWorkRequirementId) {
          this.getControl('clientWorkRequirement')?.patchValue(parseInt(this.talentDetails?.ClientWorkRequirementId));
          this.onClientWorkRequirementChange({ value: parseInt(this.talentDetails?.ClientWorkRequirementId) })
        }
        if ((this.talentDetails?.ClientWorkRequirementId == 2 || this.talentDetails?.ClientWorkRequirementId == 3) && this.talentDetails?.SubWorkRequirementId) {

          this.getControl('locationType')?.patchValue(parseInt(this.talentDetails?.SubWorkRequirementId));
        }

        /**
         * if replacement 
         */
        if (this.talentDetails?.ReqTypeID == '3') {
          this.getResignReplamentEmp(this.talentDetails?.ReqTypeID);
        }
        let TCSkill1Data: any = [];
        let TCSkill2Data: any = [];
        let TCSkill3Data: any = [];
        let TCSkill4Data: any = [];
        if (this.talentDetails?.TalentIdCreatedBy == 'TC') {
          this.isTcNotAvaialbe = true;
          this.isTalentCube = true;
          this.getControl('talentCubeId').patchValue(this.talentDetails?.TalentCubeId ? this.talentDetails?.TalentCubeId : null)
          // this.demandCreationTcCtrl.patchValue('T');
          this.showHideTcANDJB('T', 'D');
          this.getRoleAndSkillByTalentCube(this.talentDetails?.TalentCubeId, null, 'N');
          this.talentCubeSkills['PrimaryCubeSkillName'] = this.talentDetails?.PrimaryTCSkillName || '-';
          this.filterCubeRole['gradeName'] = this.talentDetails?.TCGradeName || '-';

          if (this.talentDetails?.TCSkill1 != null && this.talentDetails?.TCSkill1 != '') {
            this.talentCubeSkills['CubeSkillId1'] = this.talentDetails?.TCSkill1.trim();
            TCSkill1Data = this.talentDetails?.TCSkill1.split(",").map(Number);

          }
          if (this.talentDetails?.TCSkill2 != null && this.talentDetails?.TCSkill2 != '') {
            this.talentCubeSkills['CubeSkillId2'] = this.talentDetails?.TCSkill2.trim();
            TCSkill2Data = this.talentDetails?.TCSkill2.split(",").map(Number);
          }
          if (this.talentDetails?.TCSkill3 != null && this.talentDetails?.TCSkill3 != '') {
            this.talentCubeSkills['CubeSkillId3'] = this.talentDetails?.TCSkill3.trim();
            TCSkill3Data = this.talentDetails?.TCSkill3.split(",").map(Number);
          }
          if (this.talentDetails?.TCSkill4 != null && this.talentDetails?.TCSkill4 != '') {
            this.talentCubeSkills['CubeSkillId4'] = this.talentDetails?.TCSkill4.trim();
            TCSkill4Data = this.talentDetails?.TCSkill4.split(",").map(Number);
          }
        }
        else {
          this.clearValidators('primarySkillTc');
          this.isTcNotAvaialbe = true;
          this.isTalentCube = false;
          //  this.demandCreationTcCtrl.patchValue('J');
          this.showHideTcANDJB('J', 'D');
          this.getControl('talentCubeId').patchValue('0')
        }
        if (this.data?.type == 'C') {

          if (this.talentDetails?.TalentCubeId == 0 || this.talentDetails?.TalentCubeId == null) {
            this.getControl('talentCubeId').reset();
            this.resetTalentCubeSection();
            this.isTalentCube = true;
          }
        }
        /**show city and state dropdown in US and Poland case */
        /**US */
        if (this.talentDetails?.JoiningLocID == 3) {
          this.isStateActive = true;
          this.stateId = this.talentDetails?.StateId;
          this.getControl('joiningState').patchValue(this.talentDetails?.StateId ? this.talentDetails?.StateId : null);
          setTimeout(() => {
            this.getControl('joiningCity').patchValue(this.talentDetails?.CityID ? parseInt(this.talentDetails?.CityID) : null);
          }, 1000);
          this.isCitiesActive = true;
        }
        /**poland */

        if (this.talentDetails?.JoiningLocID == 13) {
          this.stateId = 175;
          this.isCitiesActive = true;
          setTimeout(() => {
            this.getControl('joiningCity').patchValue(this.talentDetails?.CityID ? this.talentDetails?.CityID : null);
          }, 1000);
        }
        // this.employeeUnitCont.patchValue(this.talentDetails?.DeliveryOrFunction ? parseInt(this.talentDetails?.DeliveryOrFunction) : null);
        // if(this.talentDetails?.DeliveryOrFunction){
        //   this.getEmployeeUnitId({value:parseInt(this.talentDetails?.DeliveryOrFunction)});
        // }
        this.getControl('joiningLocation').patchValue(this.talentDetails?.JoiningLocID ? parseInt(this.talentDetails?.JoiningLocID) : null);

        this.getControl('requirementType').patchValue(this.talentDetails?.ReqTypeID ? parseInt(this.talentDetails?.ReqTypeID) : null);
        this.requirementTypeID = parseInt(this.talentDetails?.ReqTypeID);
        this.desigData['ExpRange'] = this.talentDetails?.ExpRange;
        this.desigData['ExpRangeID'] = this.talentDetails?.ExpRangeID;
        this.subSkillFilterData['PracticeName'] = this.talentDetails?.Practice;
        this.filterCubeRole["PracticeName"] = this.talentDetails?.Practice;

        // subSkillFilterData?.PracticeName
        if (this.talentDetails?.TCGradeId) {
          this.GetExperienceByGradeID(this.talentDetails?.TCGradeId ? this.talentDetails?.TCGradeId : null);
        }
        let additionalSkillData: any = [];
        if (this.talentDetails?.AdditionalSkillID != null && this.talentDetails?.AdditionalSkillID != '') {
          additionalSkillData = this.talentDetails?.AdditionalSkillID.split(",").map(Number);
        }

        /**for multi interviwers patching - filtering with interview  type */
        const interviewer1Ids = this.interviewersListOfThId?.filter(x => x.IntType === 1).map(x => x.EmpId);
        const interviewer2Ids = this.interviewersListOfThId?.filter(x => x.IntType === 2).map(x => x.EmpId);
        const interviewer3Ids = this.interviewersListOfThId?.filter(x => x.IntType === 3).map(x => x.EmpId);
        ////
        // const interviewer1Ids = this.interviewersListOfThId?.filter(x => x.IntType === 1).map(x => Number(x.EmpId));
        //  const interviewer2Ids = this.interviewersListOfThId?.filter(x => x.IntType === 2).map(x => Number(x.EmpId));

        debugger
        this.submitJobCreateForm.patchValue({
          designationCategories: this.talentDetails?.DesigCateID ? this.talentDetails?.DesigCateID : null,
          // Designation:this.talentDetails?.DesigCateID,
          primarySkill: this.talentDetails?.PriSkillID ? this.talentDetails?.PriSkillID : null,

          cubeGradeId: this.talentDetails?.TCGradeId ? this.talentDetails?.TCGradeId : null,
          cubeRoleId: this.talentDetails?.TalentCubeRoleId ? this.talentDetails?.TalentCubeRoleId : null,
          //  primarySkillTc: primarySkillByTc,
          ExperienceId: this.talentDetails?.ExperienceId ? this.talentDetails?.ExperienceId : null,
          cubeSkill1: TCSkill1Data.length != 0 ? TCSkill1Data : null,
          cubeSkill2: TCSkill2Data.length != 0 ? TCSkill2Data : null,
          cubeSkill3: TCSkill3Data.length != 0 ? TCSkill3Data : null,
          cubeSkill4: TCSkill4Data.length != 0 ? TCSkill4Data : null,
          //subSkills:this.talentDetails?.SubSkillID,
          additionalSkills: additionalSkillData.length != 0 ? additionalSkillData : null,
          qualification: this.talentDetails?.QualificationID ? this.talentDetails?.QualificationID : null,
          employmentType: this.talentDetails?.EMPLOYEMENT_TYPE_ID ? parseInt(this.talentDetails?.EMPLOYEMENT_TYPE_ID) : null,
          //Billable: this.talentDetails?.IsBillableID ? this.talentDetails?.IsBillableID : null,
          Designation: this.talentDetails?.DesigID ? this.talentDetails?.DesigID : null,
          subSkills: this.talentDetails?.SubSkillID ? this.talentDetails?.SubSkillID : null,
          plannedOnBoardingDate: this.talentDetails?.pOnboardDate ? this.talentDetails?.pOnboardDateUTC ? new Date(this.talentDetails?.pOnboardDateUTC) : new Date(this.talentDetails?.pOnboardDate) : null,
          // plannedBillingStartDate: this.talentDetails?.BillingSDate ? this.talentDetails?.BillingSDate : null,
          visaReady: this.talentDetails?.IsVisaReadyID ? this.talentDetails?.IsVisaReadyID : null,
          //divisionId: this.talentDetails?.DivisionID ? parseInt(this.talentDetails?.DivisionID) : null,
          isClientInterviewRequired: this.talentDetails?.IsClientIntID ? this.talentDetails?.IsClientIntID : null,
          //  Interviewer1Tech: this.talentDetails?.Interviewer1ID ? this.talentDetails?.Interviewer1ID : null,
          Interviewer1Tech: interviewer1Ids.length != 0 ? interviewer1Ids : null,
          // ["121245", "108364"],
          tech1InterviewBy: this.talentDetails?.tech1InterviewById ? this.talentDetails?.tech1InterviewById : null,
          Interviewer2: interviewer2Ids.length != 0 ? interviewer2Ids : null,
          Interviewer3: interviewer3Ids.length != 0 ? interviewer3Ids : null,
          Remarks: this.talentDetails?.SpclReq ? this.talentDetails?.SpclReq : ''
        });
        setTimeout(() => {
          this.getControl('isClientInterviewRequired').patchValue(this.talentDetails?.IsClientIntID ? this.talentDetails?.IsClientIntID : 'N');
        }, 1000);
        /**when billable yes - showing depended fiedls */
        if (this.talentDetails?.IsBillableID == 'Y') {
          this.isBillableYes = true;
          this.addValidator('BillingType');
          this.getControl('BillingType').patchValue(this.talentDetails?.BillingTypeId ? this.talentDetails?.BillingTypeId : null);
          this.addValidator('expectedMargin');
          this.getControl('expectedMargin').patchValue(this.talentDetails?.ExpMargin ? this.talentDetails?.ExpMargin : null);
          this.addValidator('billableRates');
          this.getControl('billableRates').patchValue(this.talentDetails?.BillingRate ? this.talentDetails?.BillingRate : null);
          this.addValidator('BillableHours');
          this.getControl('BillableHours').patchValue(this.talentDetails?.BillingHours ? this.talentDetails?.BillingHours : null);
          if (!this.isUpdateMode) {
            this.addValidator('plannedBillingStartDate');
          }
          this.getControl('plannedBillingStartDate').patchValue(this.talentDetails?.BillingSDate ? this.talentDetails?.BillingSDateUTC ? new Date(this.talentDetails?.BillingSDateUTC) : new Date(this.talentDetails?.BillingSDate) : null);
          /**if requirement type is pipline - we are removing billing start date in case of bilable yes */

          if (this.talentDetails?.ReqTypeID == 5) {
            this.isBillingDateVisib = false;
            this.clearValidators('plannedBillingStartDate');
          } else {
            this.isBillingDateVisib = true;
            // this.addValidator('plannedBillingStartDate');
            if (!this.isUpdateMode) {
              this.addValidator('plannedBillingStartDate');
            }
          }
        }
        this.priSkillData['JobFamily'] = this.talentDetails?.JfName;
        this.gradeSalCtrl = true;
        this.salaryDetails['GRADE_LEVEL'] = this.talentDetails?.gradeLevel;
        this.salaryDetails['MAX_SALARY'] = this.talentDetails?.MaxSalary;

        if (this.talentDetails?.IsInternelID == "Y") {
          this.clearValidators('jobSummary');
          this.clearValidators('jobDescription');
          this.isJobDescriAndJobVisible = false;
          this.clearValidators('Interviewer1Tech');
          this.clearValidators('tech1InterviewBy');
          this.interviewer1Ctrl = false;
          this.tech1interviewBy = false;
         // this.clearValidators('Interviewer2');
          this.interviewer2Ctrl = false;
        //  this.clearValidators('Interviewer3');
          this.interviewer3Ctrl = false;
          this.clearValidators('plannedOnBoardingDate');
          this.plannnedOnboardingDateCtrl = false;
        }
        if (this.talentDetails?.IsInternelID == "N") {
          this.isJobDescriAndJobVisible = true;
          this.getControl('jobDescription').patchValue(this.talentDetails?.JobDesc ? GlobalMethod.htmlUnescape(this.talentDetails?.JobDesc) : null);
          this.getControl('jobSummary').patchValue(this.talentDetails?.JobSummary ? this.talentDetails?.JobSummary : null);
          this.minLengthMaxLengthValidator('jobSummary', 'min', 10);
          this.minLengthMaxLengthValidator('jobDescription', 'min', 100)
          this.interviewer1Ctrl = true;
          // this.tech1interviewBy = true;
          // this.addValidator('tech1InterviewBy');
          this.addValidator('Interviewer1Tech');

          this.interviewer2Ctrl = true;
       //   this.addValidator('Interviewer2');
          this.interviewer3Ctrl = true;
        //  this.addValidator('Interviewer3');
          this.plannnedOnboardingDateCtrl = true;
          this.addValidator('plannedOnBoardingDate');
          this.isClientIntReqCtrl = true;
          this.addValidator('isClientInterviewRequired');
          this.getControl('isClientInterviewRequired').patchValue('N');
          this.visaReadyCtrl = true;
          this.addValidator('visaReady');
          // this.getControl('visaReady').patchValue('N');

          this.getControl('tech1InterviewBy').patchValue(this.talentDetails?.Tech1InterviewById ? this.talentDetails?.Tech1InterviewById : null);
          /**hide client interview for c2h  */
          if (this.talentDetails?.ReqTypeID == 6) {
            setTimeout(() => {
              this.resetControl('isClientInterviewRequired');
              this.clearValidators('isClientInterviewRequired');

              this.isClientIntReqCtrl = false;

              this.clearValidators('jobSummary');
              this.clearValidators('jobDescription');
              this.isJobDescriAndJobVisible = false;
            }, 1000)

          }
        }

        if (this.talentDetails?.DeliveryOrFunction == 1) {
          this.isDeliveryActive = true;
          this.showGDLCtrl = false;
          this.clearValidators('deliveryUnit');

        }
        else {
          this.isDeliveryActive = false;
          this.showGDLCtrl = true;
          this.addValidator('deliveryUnit');
          // if (this.data?.type == 'U' || this.data?.type == 'A') {
          //   this.getControl('deliveryUnit').patchValue(this.talentDetails?.DU_ID ? this.talentDetails?.DU_ID.toString() : null);

          // }
        }
        /***
         * api call
         */
        this.getDuList(this.talentDetails?.DeliveryOrFunction);
        this.getRequirementTypeList(this.talentDetails?.DeliveryOrFunction);
        this.getAccountList(this.getReqTypeIdByEmpUnit(), this.talentDetails?.DU_ID, this.talentDetails?.DeliveryOrFunction);
        this.getStateList(this.talentDetails?.JoiningLocID ? this.talentDetails?.JoiningLocID : '');
        this.getCitiesList(this.talentDetails?.JoiningLocID, this.talentDetails?.State ? this.talentDetails?.State : null);
        this.getControl('primarySkillTc').patchValue(this.talentDetails?.TalentCubePrimarySkillID ? this.talentDetails?.TalentCubePrimarySkillID : null);
        if (this.talentDetails?.AccountID) {
          this.getProjectsList(this.talentDetails?.AccountID);
        }
        if (this.talentDetails?.SFDCAccountID) {
          this.getOpportunityList(this.talentDetails?.SFDCAccountID, this.talentDetails?.ReqTypeID);
          this.getSfdcClientList(this.talentDetails?.SFDCAccountID);
        }
        if (this.talentDetails?.DesigCateID) {
          this.GetDesignations(this.talentDetails?.DesigCateID);
        }
        this.getPrimarySkillsByTc(this.talentDetails?.TalentCubeId);
        //  this.GetTeamDetailsFromPricing(this.talentDetails?.OppID);
        if (this.talentDetails?.ReqTypeID == 2) {
          this.GetTeamDetailsFromPricing(this.talentDetails?.OppID);
        }
        /**for delivery  */
        if (this.talentDetails?.DeliveryOrFunction == '1') {
          this.deliveryDefaultValue();
        }
        /**for function/ support */
        if (this.talentDetails?.DeliveryOrFunction == '5') {
          this.supportDefaultValue();
        }
        // this.showHideLocWise();
        this.showHideLocWise(this.getControl('joiningLocation').value);



      }
    )
  }

  public isDateManuallyChangedBill: boolean = false;
  changeDateBilling(type: string, event: any) {
    if (type === 'input') {
      this.isDateManuallyChangedBill = true;

      const selectedDate = new Date(event.value);
      selectedDate.setHours(0, 0, 0, 0); // normalize

      const today = new Date();
      today.setHours(0, 0, 0, 0); // normalize

      if (this.isUpdateMode && selectedDate < today) {
        this.submitJobCreateForm
          .get('plannedBillingStartDate')
          ?.setErrors({ pastDateNotAllowed: true });
      } else {
        this.submitJobCreateForm
          .get('plannedBillingStartDate')
          ?.setErrors(null);
      }
    }
  }


  public isDateManuallyChangedOnb:boolean = false;
changeDateOnb(type: string, event: any) {
  this.resetControl('plannedBillingStartDate');

  if (type === 'input') {
    this.isDateManuallyChangedOnb = true;

    const selectedDate = new Date(event.value);
    selectedDate.setHours(0, 0, 0, 0); // ✅ normalize

    const today = new Date();
    today.setHours(0, 0, 0, 0); // ✅ normalize

    this.minDatebilling = new Date(selectedDate); // set billing min date
     let requiremntType = this.getControl('requirementType').value;
     let isBillable = this.getControl('Billable').value;
     if(requiremntType != 5 && isBillable == 'Y'){
      this.addValidator('plannedBillingStartDate');
      
     }
    // Make billing date required if onboarding is set
   // this.submitJobCreateForm.get('plannedBillingStartDate')
  //    ?.setValidators([Validators.required]);
  //  this.submitJobCreateForm.get('plannedBillingStartDate')?.updateValueAndValidity();
    debugger
   
    if (this.isUpdateMode && selectedDate < today) {
      this.submitJobCreateForm.get('plannedOnBoardingDate')
          ?.setErrors({ pastDateNotAllowed: true });
      } else {
        this.submitJobCreateForm
          .get('plannedBillingStartDate')
          ?.setErrors(null);
      }
    }
  }


  /**set default method in delivery  */
  deliveryDefaultValue() {
    this.BillableCtrl = true;
    this.addValidator('Billable');
    this.getControl('Billable').patchValue(this.talentDetails?.IsBillableID ? this.talentDetails?.IsBillableID : 'N');
    this.clearValidators('fileUpload');
    this.isAttechmentRequired = false;
    // this.divisionIdCtrl = true;
    // this.addValidator('divisionId');
    this.exclusiveInfogainCtrl = true;
    this.addValidator('exclusiveInfogain');
    this.getControl('exclusiveInfogain').patchValue(this.talentDetails?.ExclusiveInfoID ? this.talentDetails?.ExclusiveInfoID : 'N');

    //this.opportunityData['BookingMargin'] = this.talentDetails?.BookingDGM ? this.talentDetails?.BookingDGM : null;
    this.opportunityData['CloseDate'] = this.talentDetails?.ClosedDate ? this.talentDetails?.ClosedDate : null;
    /***
      * requirment type id check - 1 for pipeline
      */
    this.labelInterviewBiling = 'Position & Interview Details'
    if (this.talentDetails?.ReqTypeID == '1') {
      this.getLoginName = this.user.FullName;
      this.showHideHMforApproveNewAddition = true;
      this.getLoginName = this.talentDetails?.OffShoreHiringManager;
      this.projData['OffshorePM'] = this.talentDetails?.OffShoreHiringManager ? this.talentDetails?.OffShoreHiringManager : '';
      this.isOffshoreHMpipelineVisibl = true;
      this.clearValidators('isResourceAvailInBu');
      this.isResourceAvailInBu = false;
      this.clearValidators('approvedBy');
      this.isApprovedByVisible = false;
      this.clearValidators('projectNameId');
      this.projectNameIdCtrl = false;
      this.clearValidators('role');
      this.roleCtrl = false;
      this.opportunityTypeCtrl = true;
      this.opportunityData['OppType'] = this.talentDetails?.OppType;
      this.opportunityIdCtrl = true;
      this.addValidator('opportunityId');
      this.getControl('opportunityId').patchValue(this.talentDetails?.OppID ? this.talentDetails?.OppID : null);
      this.isfdcIdCtrl = true;
      this.opportunityData['ISFDCID'] = this.talentDetails?.ISFDCID;
      // this.addValidator('isfdcId');
      this.oddsOfWinningPercentCtrl = true;
      this.opportunityData['OddsOfWinning'] = this.talentDetails?.OddsOfWinning ? this.talentDetails?.OddsOfWinning : null;
      // this.addValidator('oddsOfWinningPercent');
      this.bookingDgmPercentCtrl = true;
      this.opportunityData['BookingMargin'] = this.talentDetails?.BookingDGM ? this.talentDetails?.BookingDGM : null;
      //this.addValidator('bookingDgmPercent');
      this.closedDateCtrl = true;
      this.opportunityData['CloseDate'] = this.talentDetails?.ClosedDate ? this.talentDetails?.ClosedDate : null;
      // this.addValidator('closedDate');

      // this.addValidator('projectEndDate');
      this.clearValidators('SFDCClient');
      this.SFDCClientCtrl = false;
      this.onsiteHiringManagerCtrl = false;
      this.clearValidators('conversionFor');
      this.conversionForCtrl = false;
      this.clearValidators('replacementFor');
      this.replacementForCtrl = false;
      this.clearValidators('replacementReason');
      this.replacementReasonCtrl = false;

      // this.addValidator('qualification')
      this.isSpecialBidTypeAndProjectDateVisi = false;
      this.projectEndDateCtrl = true;
      this.opportunityData['ProjEndDate'] = this.talentDetails?.ProjEndDate;
      this.clearValidators('bidTypeDropdown');
      this.bidTypeDropDownCtrl = false;
      this.bidTypeCtrl = true;
      this.opportunityData['BidType'] = this.talentDetails?.BidType;
      this.opportunityData['BidTypeID'] = this.talentDetails?.BidTypeID;
      this.clearValidators('employeeEmail');
      // this.clearValidators('conversionRemarks');
      this.isConversion = false;
      this.isReplacement = false;

      this.isDisabledFieldsForC2h = false;
      this.isProjectVisible = false;
    }
    /***
 * New Addition for Existing Project
 */

    else if (this.talentDetails?.ReqTypeID == '2') {
      this.isOffshoreHMpipelineVisibl = false;
      this.showHideHMforApproveNewAddition = true;
      this.getLoginName = this.talentDetails?.OffShoreHiringManager;
      this.projData['OffshorePM'] = this.talentDetails?.OffShoreHiringManager ? this.talentDetails?.OffShoreHiringManager : '';
      this.isResourceAvailInBu = true;
      this.addValidator('isResourceAvailInBu');
      this.getControl('isResourceAvailInBu').patchValue(this.talentDetails?.IsInternelID ? this.talentDetails?.IsInternelID : null);
      this.clearValidators('approvedBy');
      this.isApprovedByVisible = false;
      this.projectNameIdCtrl = true;
      this.addValidator('projectNameId');
      this.getControl('projectNameId').patchValue(this.talentDetails?.ProjectID ? parseInt(this.talentDetails?.ProjectID) : null);

      this.opportunityTypeCtrl = true;
      this.opportunityData['OppType'] = this.talentDetails?.OppType;
      // this.addValidator('opportunityType');
      //this.divisionIdCtrl = true;
      //this.addValidator('divisionId');
      this.opportunityIdCtrl = true;
      this.addValidator('opportunityId');
      this.getControl('opportunityId').patchValue(this.talentDetails?.OppID ? this.talentDetails?.OppID : null);
      this.isfdcIdCtrl = true;
      this.opportunityData['ISFDCID'] = this.talentDetails?.ISFDCID;
      this.oddsOfWinningPercentCtrl = true;
      this.opportunityData['OddsOfWinning'] = this.talentDetails?.OddsOfWinning ? this.talentDetails?.OddsOfWinning : null;
      this.opportunityData['OppType'] = this.talentDetails?.OppType;
      this.bookingDgmPercentCtrl = true;
      //this.opportunityData['BookingMargin'] = this.talentDetails?.BookMargin;
      this.opportunityData['BookingMargin'] = this.talentDetails?.BookingDGM ? this.talentDetails?.BookingDGM : null;
      this.closedDateCtrl = true;
      this.opportunityData['CloseDate'] = this.talentDetails?.ClosedDate ? this.talentDetails?.ClosedDate : null;
      // this.opportunityData['CloseDate'] = this.talentDetails?.BookMargin;

      // this.opportunityData['ProjEndDate'] =  this.talentDetails?.ProjEndDate;

      this.SFDCClientCtrl = true;
      this.addValidator('SFDCClient');

      this.getControl('SFDCClient').patchValue(this.talentDetails?.SFDCAccountID ? this.talentDetails?.SFDCAccountID : null);
      this.onsiteHiringManagerCtrl = true;
      this.projData['OnsitePM'] = this.talentDetails?.OnsitePM ? this.talentDetails?.OnsitePM : '';
      this.clearValidators('conversionFor');
      this.conversionForCtrl = false;
      this.clearValidators('replacementFor');
      this.replacementForCtrl = false;
      this.clearValidators('replacementReason');
      this.replacementReasonCtrl = false;

      this.isSpecialBidTypeAndProjectDateVisi = false;
      this.projectEndDateCtrl = true;
      this.opportunityData['ProjEndDate'] = this.talentDetails?.ProjEndDate;
      this.clearValidators('bidTypeDropdown');
      this.bidTypeDropDownCtrl = false;
      this.bidTypeCtrl = true;
      this.opportunityData['BidType'] = this.talentDetails?.BidType;
      this.opportunityData['BidTypeID'] = this.talentDetails?.BidTypeID;
      if (this.talentDetails?.DeliveryOrFunction == 1) {
        this.roleCtrl = true;
        this.addValidator('role');
        this.getControl('role').patchValue(this.talentDetails?.role_id ? this.talentDetails?.role_id : null);
      }

      this.isReplacement = false;
      this.isDisabledFieldsForC2h = false;
      this.clearValidators('employeeEmail');
      // this.clearValidators('conversionRemarks');
      this.isConversion = false;
      this.isProjectVisible = true;

      this.projData['ProjectEndDate'] = this.talentDetails?.ProjEndDate;
      // this.opportunityData['BidType'] = this.talentDetails?.BidType;
      this.projData['ProjectType'] = this.talentDetails?.BidType;
      this.projData['PROJECT_TYPE_ID'] = this.talentDetails?.BidTypeID;
      //this.getLoginName = this.talentDetails?.OffShoreHiringManager ? this.talentDetails?.OffShoreHiringManager : '';
    }

    /***
* Replacement in Existing Project
*/
    else if (this.talentDetails?.ReqTypeID == '3') {
      // this.clearValidators('replacementReason');
      this.conversionForCtrl = true;
      this.replacementReasonSc = true;
      this.replacementReasonCtrl = true;
      // this.isDeliveryActive = false;

      this.addValidator('replacementReason');
      this.clearValidators('conversionFor');

      this.replacementForCtrl = true;
      this.addValidator('replacementFor');
      this.getLoginName = this.talentDetails?.OffShoreHiringManager;

      this.showHideHMforApproveNewAddition = true;
      this.isOffshoreHMpipelineVisibl = false;

      this.isReplacement = true;
      this.getControl('projectNameId').patchValue(this.talentDetails?.ProjectID ? parseInt(this.talentDetails?.ProjectID) : null);
      //new code 
      if (this.empUnitId == 1 || this.talentDetails?.DeliveryOrFunction == 1) {
        this.showHideHMforApproveNewAddition = true;
        this.isOffshoreHMpipelineVisibl = false;
        this.clearValidators('approvedBy');
        this.isApprovedByVisible = false;
        this.isResourceAvailInBu = true;
        this.addValidator('isResourceAvailInBu');
        this.clearValidators('projectNameId');
        this.projectNameIdCtrl = false;
        this.clearValidators('role');
        this.roleCtrl = false;
        this.projectNameIdCtrl = true;
        this.addValidator('projectNameId');
        // this.clearValidators('opportunityType');
        this.opportunityTypeCtrl = false;
        // this.divisionIdCtrl = true;
        // this.addValidator('divisionId');
        this.clearValidators('opportunityId');
        this.opportunityIdCtrl = false;
        // this.clearValidators('isfdcId');
        this.isfdcIdCtrl = false;
        // this.clearValidators('oddsOfWinningPercent');
        this.oddsOfWinningPercentCtrl = false;
        // this.clearValidators('bookingDgmPercent');
        this.bookingDgmPercentCtrl = false;
        //this.clearValidators('closedDate');
        this.closedDateCtrl = false;
        // this.projectEndDateCtrl = true;
        //this.addValidator('projectEndDate');
        this.clearValidators('SFDCClient');
        this.SFDCClientCtrl = false;
        this.onsiteHiringManagerCtrl = false;
        this.isSpecialBidTypeAndProjectDateVisi = true;
        this.clearValidators('bidTypeDropdown');
        this.bidTypeDropDownCtrl = false;
        this.getControl('replacementReason').patchValue(this.talentDetails?.RepReasonID ? parseInt(this.talentDetails?.RepReasonID) : null);
         if(this.talentDetails?.RepReasonID == 13){
        this.isRotation =true
         }
        // this.conversionForCtrl = true;
        // this.addValidator('conversionFor');
        // this.getControl('conversionFor').patchValue(this.talentDetails?.RepalcementForID ? this.talentDetails?.RepalcementForID : null);
        this.getControl('replacementFor').patchValue(this.talentDetails?.RepalcementForID ? this.talentDetails?.RepalcementForID : null);
        this.replacementDesignationData['Designation'] = this.talentDetails?.desigDescription.toString();
        this.projData['OffshorePM'] = this.talentDetails?.OffShoreHiringManager ? this.talentDetails?.OffShoreHiringManager : '';
        // this.getControl('approvedBy').patchValue(this.talentDetails?.ApproveByID ? this.talentDetails?.ApproveByID : null);
        this.isResourceAvailInBu = true;
        this.addValidator('isResourceAvailInBu');
        this.getControl('isResourceAvailInBu').patchValue(this.talentDetails?.IsInternelID ? this.talentDetails?.IsInternelID : null);
        this.projectEndDateCtrl = true;
        //  this.opportunityData['ProjEndDate'] = this.talentDetails?.ProjEndDate;
        this.projData['ProjectEndDate'] = this.talentDetails?.ProjEndDate;
        this.bidTypeCtrl = true;
        // this.opportunityData['BidType'] = this.talentDetails?.BidType;
        this.projData['ProjectType'] = this.talentDetails?.BidType;
        this.projData['PROJECT_TYPE_ID'] = this.talentDetails?.BidTypeID;
      }
      this.isDisabledFieldsForC2h = false;
      this.clearValidators('employeeEmail');
      //  this.clearValidators('conversionRemarks');
      this.isConversion = false;
      this.isProjectVisible = true;
    }

    /**Approved Investment */
    else if (this.talentDetails?.ReqTypeID == '4') {
      this.isOffshoreHMpipelineVisibl = false;
      this.getLoginName = this.talentDetails?.OffShoreHiringManager;
      this.showHideHMforApproveNewAddition = true;
      this.projData['OffshorePM'] = this.talentDetails?.OffShoreHiringManager ? this.talentDetails?.OffShoreHiringManager : '';

      this.isApprovedByVisible = true;
      this.addValidator('approvedBy');

      this.getControl('approvedBy').patchValue(this.talentDetails?.ApproveByID ? this.talentDetails?.ApproveByID : null);
      this.clearValidators('isResourceAvailInBu');
      this.isResourceAvailInBu = false;
      this.clearValidators('role');
      this.roleCtrl = false;
      this.projectNameIdCtrl = true;
      this.addValidator('projectNameId');
      this.getControl('projectNameId').patchValue(this.talentDetails?.ProjectID ? parseInt(this.talentDetails?.ProjectID) : null);
      this.opportunityTypeCtrl = false;
      // this.divisionIdCtrl = true;
      // this.addValidator('divisionId');
      this.clearValidators('opportunityId');
      this.opportunityIdCtrl = false;
      // this.clearValidators('isfdcId');
      this.isfdcIdCtrl = false;
      // this.clearValidators('oddsOfWinningPercent');
      this.oddsOfWinningPercentCtrl = false;
      // this.clearValidators('bookingDgmPercent');
      this.bookingDgmPercentCtrl = false;
      //this.clearValidators('closedDate');
      this.closedDateCtrl = false;

      //this.addValidator('projectEndDate');
      this.clearValidators('SFDCClient');
      this.SFDCClientCtrl = false;
      this.onsiteHiringManagerCtrl = true;
      this.projData['OnsitePM'] = this.talentDetails?.OnsitePM ? this.talentDetails?.OnsitePM : '';

      this.clearValidators('conversionFor');
      this.conversionForCtrl = false;

      this.clearValidators('replacementFor');
      this.replacementForCtrl = false;
      this.clearValidators('replacementReason');
      this.replacementReasonCtrl = false;

      this.isSpecialBidTypeAndProjectDateVisi = true;
      this.projectEndDateCtrl = true;
      //this.opportunityData['ProjEndDate'] = this.talentDetails?.ProjEndDate;
      this.projData['ProjectEndDate'] = this.talentDetails?.ProjEndDate;
      /**when isSpecialBidTypeAndProjDateVisi true  */
      this.projData['ProjectType'] = this.talentDetails?.BidType;
      this.projData['PROJECT_TYPE_ID'] = this.talentDetails?.BidTypeID;
      this.clearValidators('bidTypeDropdown');
      this.bidTypeDropDownCtrl = false;
      this.bidTypeCtrl = true;
      this.replacementReasonSc = false;

      this.isReplacement = false;
      this.isDisabledFieldsForC2h = false;
      this.clearValidators('employeeEmail');
      //  this.clearValidators('conversionRemarks');
      this.isConversion = false;
      this.isProjectVisible = true;
    }
    /***
* Proactive Requirement
*/
    else if (this.talentDetails?.ReqTypeID == '5') {
      this.getLoginName = this.user.FullName;
      this.showHideHMforApproveNewAddition = false;
      this.projData['OffshorePM'] = this.talentDetails?.OffShoreHiringManager ? this.talentDetails?.OffShoreHiringManager : '';
      this.isOffshoreHMpipelineVisibl = true;
      this.clearValidators('approvedBy');
      this.isApprovedByVisible = false;
      this.clearValidators('isResourceAvailInBu');
      this.isResourceAvailInBu = false;
      this.clearValidators('projectNameId');
      this.projectNameIdCtrl = false;
      this.clearValidators('role');
      this.roleCtrl = false;
      //this.clearValidators('opportunityType');
      this.opportunityTypeCtrl = false;

      //this.clearValidators('divisionId');
      //this.divisionIdCtrl = false;
      this.clearValidators('opportunityId');
      this.opportunityIdCtrl = false;
      // this.clearValidators('isfdcId');
      this.isfdcIdCtrl = false;
      // this.clearValidators('oddsOfWinningPercent');
      this.oddsOfWinningPercentCtrl = false;
      // this.clearValidators('bookingDgmPercent');
      this.bookingDgmPercentCtrl = false;
      //this.clearValidators('closedDate');
      this.closedDateCtrl = false;
      // this.clearValidators('projectEndDate');
      this.projectEndDateCtrl = false;
      this.clearValidators('SFDCClient');
      this.SFDCClientCtrl = false;
      this.onsiteHiringManagerCtrl = false;

      this.clearValidators('conversionFor');
      this.conversionForCtrl = false;

      this.clearValidators('replacementFor');
      this.replacementForCtrl = false;
      this.clearValidators('replacementReason');
      this.replacementReasonCtrl = false;
      this.replacementReasonSc = false;

      this.isSpecialBidTypeAndProjectDateVisi = true;
      /**when isSpecialBidTypeAndProjDateVisi true  */
      this.projData['ProjectType'] = this.talentDetails?.BidType;
      this.projData['PROJECT_TYPE_ID'] = this.talentDetails?.BidTypeID;
      this.bidTypeDropDownCtrl = true;
      this.addValidator('bidTypeDropdown');
      this.getControl('bidTypeDropdown').patchValue(this.talentDetails?.BidTypeID ? this.talentDetails?.BidTypeID : null);
      this.bidTypeCtrl = false;
      this.isReplacement = false;

      this.getControl('Billable').patchValue('N');
      this.getControl('Billable').disable();
      this.isDisabledFieldsForC2h = false;

      this.clearValidators('employeeEmail');
      //  this.clearValidators('conversionRemarks');
      this.isConversion = false;
      this.isProjectVisible = false;
    }
    /**C2H Conversion */
    else if (this.talentDetails?.ReqTypeID == '6') {
      this.labelInterviewBiling = 'Billing Details'
      // this.c2hTypeMethod(this.getControl('requirementType').value, []);
      this.isResourceAvailInBu = true;
      this.addValidator('isResourceAvailInBu');
      this.getControl('isResourceAvailInBu').patchValue(this.talentDetails?.IsInternelID ? this.talentDetails?.IsInternelID : null);
      this.replacementReasonSc = true;
      this.showHideHMforApproveNewAddition = true;

      this.projData['OffshorePM'] = this.talentDetails?.OffShoreHiringManager ? this.talentDetails?.OffShoreHiringManager : '';
      //  this.divisionIdCtrl = true;
      // this.addValidator('divisionId');
      //
      this.projectNameIdCtrl = true;
      this.addValidator('projectNameId');
      this.getControl('projectNameId').patchValue(this.talentDetails?.ProjectID ? parseInt(this.talentDetails?.ProjectID) : null);
      this.clearValidators('SFDCClient');
      this.SFDCClientCtrl = false;
      this.clearValidators('opportunityId');
      this.opportunityIdCtrl = false;
      this.clearValidators('role');
      this.roleCtrl = false;
      this.isfdcIdCtrl = false;
      this.opportunityTypeCtrl = false;
      this.oddsOfWinningPercentCtrl = false;
      this.bookingDgmPercentCtrl = false;
      this.closedDateCtrl = false;
      // this.roleCtrl = true;
      // this.addValidator('role');
      this.onsiteHiringManagerCtrl = true;
      this.projData['OnsitePM'] = this.talentDetails?.OnsitePM ? this.talentDetails?.OnsitePM : '';

      this.conversionForCtrl = true;
      this.addValidator('conversionFor');
      this.getControl('conversionFor').patchValue(this.talentDetails?.RepalcementForID ? this.talentDetails?.RepalcementForID : null);
      this.replacementDesignationData['Designation'] = this.talentDetails?.desigDescription;
      this.clearValidators('replacementReason');

      this.clearValidators('replacementFor');
      this.replacementForCtrl = false;

      this.replacementReasonCtrl = false;
      this.isSpecialBidTypeAndProjectDateVisi = true;
      this.projectEndDateCtrl = true;
      //this.opportunityData['ProjEndDate'] = this.talentDetails?.ProjEndDate;
      this.projData['ProjectEndDate'] = this.talentDetails?.ProjEndDate;
      /**when isSpecialBidTypeAndProjDateVisi true  */
      this.projData['ProjectType'] = this.talentDetails?.BidType;
      this.projData['PROJECT_TYPE_ID'] = this.talentDetails?.BidTypeID;
      this.clearValidators('bidTypeDropdown');
      this.bidTypeDropDownCtrl = false;
      this.bidTypeCtrl = true;
      this.isConversion = true;
      this.isReplacement = false;

      this.resetControl('Interviewer1Tech');
      this.resetControl('tech1InterviewBy');
      this.resetControl('Interviewer2');
      this.resetControl('Interviewer3');
      this.clearValidators('Interviewer1Tech');
      this.clearValidators('tech1InterviewBy');
      this.tech1interviewBy = false;
      this.interviewer1Ctrl = false;
    //  this.clearValidators('Interviewer2');
      this.interviewer2Ctrl = false;
      //this.clearValidators('Interviewer3');
      this.interviewer3Ctrl = false;

      this.disableFieldsForC2H();
      // this.addValidator('employeeEmail');
      this.getControl('employeeEmail').addValidators([Validators.required, Validators.pattern(COMMON_CONST.emailregex)]);
      this.getControl('employeeEmail').updateValueAndValidity();
      //this.addValidator('conversionRemarks');
      this.getControl('employeeEmail').patchValue(this.talentDetails?.C2HEmpEmail ? this.talentDetails?.C2HEmpEmail : null);
      // this.getControl('conversionRemarks').patchValue(this.talentDetails?.conversionRemarks ? this.talentDetails?.conversionRemarks : null);
      this.replacementDesignationData['EmpContractEndDate'] = this.talentDetails?.C2HEmpContractEndDate ? this.talentDetails?.C2HEmpContractEndDate : null;
      this.isProjectVisible = true;
    }


    if (this.talentDetails?.DeliveryOrFunction == 1 && this.talentDetails?.ReqTypeID == 2) {
      let joinLocID = this.talentDetails?.JoiningLocID;
      if (joinLocID == 1 || joinLocID == 4 || joinLocID == 11 || joinLocID == 16 || joinLocID == 10
        || joinLocID == 5 || joinLocID == 2) {
        this.roleCtrl = true;
        this.addValidator('role');
        //this.getControl('role').patchValue(this.talentDetails?.role_id ? this.talentDetails?.role_id : null);
      }
      else {
        this.clearValidators('role');
        this.roleCtrl = false;
      }
    }

    let accountId = this.talentDetails?.AccountID;
    if (this.talentDetails?.DeliveryOrFunction == 1 && this.talentDetails?.ReqTypeID == 2) {
      if (accountId == 427 || accountId == 1277 || accountId == 405 || accountId == 399 || accountId == 1405) {
        this.hideSFDCFields();
      }
    }


    // if (this.data?.type == 'C') {
    //   this.showHideHMforApproveNewAddition = false;
    // }
  }

  supportDefaultValue() {
    this.projectNameIdCtrl = true;
    this.addValidator('projectNameId');
    this.getControl('projectNameId').patchValue(this.talentDetails?.ProjectID ? parseInt(this.talentDetails?.ProjectID) : null);
    this.showHideHMforApproveNewAddition = true;
    this.projData['OffshorePM'] = this.talentDetails?.OffShoreHiringManager ? this.talentDetails?.OffShoreHiringManager : '';
    if (this.talentDetails?.ReqTypeID == '3') {
      // this.clearValidators('replacementReason');
      this.opportunityIdCtrl = false;
      this.replacementReasonSc = true;
      this.replacementReasonCtrl = true;
      // this.conversionForCtrl = true;

      this.addValidator('replacementReason');
      this.getControl('replacementReason').patchValue(this.talentDetails?.RepReasonID ? parseInt(this.talentDetails?.RepReasonID) : null);
      if(this.talentDetails?.RepReasonID == 13){
        this.isRotation =true
      }

      this.replacementForCtrl = true;
      this.addValidator('replacementFor');
      this.getControl('replacementFor').patchValue(this.talentDetails?.RepalcementForID ? this.talentDetails?.RepalcementForID : null);
      this.clearValidators('conversionFor');
      this.conversionForCtrl = true;
      // this.getControl('conversionFor').patchValue(this.talentDetails?.RepalcementForID ? this.talentDetails?.RepalcementForID : null);
      this.replacementDesignationData['Designation'] = this.talentDetails?.desigDescription.toString();
      this.clearValidators('employeeEmail');
      //this.clearValidators('conversionRemarks');
      this.isConversion = false;
    }
    else if (this.talentDetails?.ReqTypeID == '5') {
      this.opportunityIdCtrl = false;
      this.replacementReasonSc = false;
      this.replacementReasonCtrl = false;
      this.clearValidators('replacementReason');
      this.conversionForCtrl = false;
      this.clearValidators('conversionFor');
      this.conversionForCtrl = false;
      this.clearValidators('employeeEmail');
      // this.clearValidators('conversionRemarks');
      this.isConversion = false;
      this.clearValidators('replacementFor');
      this.replacementForCtrl = false;

    }
  }


  public demandCreationTcCtrl: UntypedFormControl = new UntypedFormControl('T');
  public isTalentCube: boolean = true;
  statusChangeFunc(e: any = null) {
    this.demandCreationTcCtrl.valueChanges.subscribe(
      get => {
        this.showHideTcANDJB(get);
      }
    )

  }

  showHideTcANDJB(get: string, from: string = 'N') {
    this.removedValidatorsForTc(from);
    this.getControl('primarySkill').reset();
    this.getControl('primarySkillTc').reset();

    // this.getControl('qualification').reset();
    //   this.getControl('employmentType').reset();
    this.salaryDetails = {};
    this.priSkillData = {};
    this.subSkillFilterData = {};
    if (get == 'T') {
      this.isTalentCube = true;
      this.addValidator('talentCubeId');
      //this.addValidator('cubeSkill1');
      // this.addValidator('cubeSkill2');
      // this.addValidator('cubeSkill3');
      this.addValidator('cubeRoleId');
      this.addValidator('cubeGradeId');
      this.addValidator('ExperienceId');
      this.addValidator('primarySkillTc');
      //  this.addValidator('cubeGradeId');
    }
    else {
      this.clearValidators('primarySkillTc');
      this.isTalentCube = false;
      this.addValidator('designationCategories');
      this.addValidator('Designation');
      this.addValidator('subSkills');
    }
  }

  removedValidatorsForTc(from: string) {
    if (from == 'N') {
      this.clearValidatorsAndValue('talentCubeId');
    }
    this.clearValidatorsAndValue('cubeSkill1');
    this.clearValidatorsAndValue('cubeSkill2');
    this.clearValidatorsAndValue('cubeSkill3');
    this.clearValidatorsAndValue('cubeRoleId');
    this.clearValidatorsAndValue('cubeGradeId');
    // this.clearValidatorsAndValue('cubeGradeId');
    this.clearValidatorsAndValue('designationCategories');
    this.clearValidatorsAndValue('Designation');
    this.clearValidatorsAndValue('subSkills');
    this.clearValidatorsAndValue('ExperienceId');
  }
  @ViewChild('select') select: MatSelect;
  public isTcNotAvaialbe: boolean = false;

  HideDropDown() {
    this.select.close();
    this.isTcNotAvaialbe = true;
    this.searchInputTC = '';
    this.demandCreationTcCtrl.patchValue('J');
  }

  talentCubeReferenceGuide(elm: any = {}) {
    elm['title'] = "Talent Cube List"
    if (elm['type'] = 'skill') {
      // elm['title'] = "Please select Talent Cube available against selected skills."
    }

    const dialogRef = this.dialog.open(TalentCubeRefrenceGridComponent, {
      panelClass: ['ats-model-wrap', 'candidate-connect-view-modal', 'tc-ref-modal'],
      data: elm,
      width: '700px'
    });
    dialogRef.afterClosed().subscribe(
      res => {
        if (res) {
          this.filterCubeList = this.talentCubeList.filter(r => r.CubeId == res.CubeId)[0];
          this.getRoleAndSkillByTalentCube(res.CubeId);
          this.demandCreationTcCtrl.patchValue('T');
          this.searchInputTC = '';
          setTimeout(() => {
            this.getControl('talentCubeId').patchValue(res.CubeId);
            this.getPrimarySkillsByTc(res.CubeId);
            this.TalentCubeListBySkill = [];
          }, 1000);
        }
      }
    );
  }

  /**
   * 
   * @param e get Cub Cluster Id
   */
  public filterCubeList: any = {};
  getCubeClusterID(e: any): any {
    if (e.value == '0') {
      this.showHideTcANDJB('J', 'D');
    }
    else {
      this.showHideTcANDJB('T', 'D');
    }
    this.filterCubeList = this.talentCubeList.filter(r => r.CubeId == e.value)[0];
    this.getControl('cubeSkill1').reset();
    this.getControl('cubeSkill2').reset();
    this.getControl('cubeSkill3').reset();
    this.getControl('primarySkill').reset();
    if (e.value != '-1') {
      this.getRoleAndSkillByTalentCube(e.value);
      this.PracticeData = {};
    }
    this.getControl('jobDescription').reset();
    this.getControl('jobSummary').reset();
    this.getPrimarySkillsByTc(e.value);
  }

  /**
 * 
 * @param data 
 */
  public TalentCubeListBySkill: any = [];
  public CudeRefSkillData: any = {};
  getTalentCubeById(PrimarySkillId: number = null, SkillIds: string = null) {
    if (this.priSkillData?.skillid) {
      PrimarySkillId = this.priSkillData?.skillid
    }
    if (this.subSkillFilterData?.skillid && this.additionSkill.length != 0) {
      let ToStr = this.additionSkill.toString();
      SkillIds = ToStr + ',' + this.subSkillFilterData?.skillid.toString();

    }
    else if (this.subSkillFilterData?.skillid) {
      SkillIds = this.subSkillFilterData?.skillid
    }
    else if (this.additionSkill.length != 0) {
      let ToStr = this.additionSkill.toString();
      SkillIds = ToStr
    }
    this._globalServe.getTalentCubeBySkill(PrimarySkillId, SkillIds).subscribe(
      res => {
        this.TalentCubeListBySkill = [];
        this.TalentCubeListBySkill = res['data'];
        if (this.TalentCubeListBySkill.length >= 1) {
          this.previewConfirmFunc(this.TalentCubeListBySkill);
          // this._share.showAlertErrorMessage.next('Talent Cube available against selected skill.')
          this.CudeRefSkillData = {
            type: 'skill',
            prSkillId: PrimarySkillId,
            skillIds: SkillIds
          }

        }
      }
    )
  }

  previewConfirmFunc(data: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      panelClass: 'ats-confirm',
      data: {
        headerText: 'Talent Cube available',
        message: `${data.length} Talent Cube available against selected skills. Please click yes to view  Talent Cube List.`,
        buttonText: {
          ok: "Yes",
          cancel: "No"
        },
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.talentCubeReferenceGuide(this.CudeRefSkillData)
      }
    });
  }

  /** reset talent cube section - when cloning old thid without talent cube  */
  resetTalentCubeSection() {
    //  this._globalServe.getTalentCubeList()
    this.getControl('talentCubeId').reset();
    this.getControl('cubeRoleId').reset();
    this.getControl('cubeGradeId').reset();
    this.getControl('ExperienceId').reset();
    this.getControl('primarySkill').reset();
    this.getControl('cubeSkill1').reset();
    this.getControl('cubeSkill2').reset();
    this.getControl('cubeSkill3').reset();
    this.getControl('qualification').reset();
    this.getControl('employmentType').reset();
    this.getControl('primarySkillTc').reset();


  }

  getCubPrimrySkillId(event: any) {
    const selectedValue = event.value;
    this.getPracticeByPrimarySkill(selectedValue);
    // this.getControl('primarySkill').patchValue(selectedValue);
  }

  public PracticeData: any = {};
  getPracticeByPrimarySkill(primarySkill: number) {
    this._globalServe.getPracticeByPrimarySkill(primarySkill).subscribe(
      res => {
        this.PracticeData = res['data'][0];
      }
    )

  }

  //get 
  public RoleTalentCubeList: any = [];
  public talentCubeSkills: any = [];
  public mergedCubeSkills: any = [];
  getRoleAndSkillByTalentCube(talentCubeCode: number = null, gradeId: number = null, SkillDefault: string = 'Y') {
    forkJoin([
      this._globalServe.getRoleByTalentCube(talentCubeCode, gradeId),
      this._globalServe.getSkillByTalentCube(talentCubeCode)
    ]).subscribe(
      res => {
        this.RoleTalentCubeList = res[0]['data'];
        this.talentCubeSkills = res[1]['data'][0];
        this.getControl('primarySkill').patchValue(this.talentCubeSkills?.PrimaryCubeSkill);
        this.isInitCallAPISubSkill = true;
        if (SkillDefault == 'Y') {
          if (this.talentCubeSkills?.CubeSkillId1 != null && this.talentCubeSkills?.CubeSkillId1 != '') {
            let CubeSkillId1 = this.talentCubeSkills?.CubeSkillId1.split(",").map(Number);
            if (CubeSkillId1.length != 0) {
              this.mergedCubeSkills = this.mergedCubeSkills.concat(CubeSkillId1);
            }

            //  this.getControl('cubeSkill1').patchValue(CubeSkillId1.length != 0 ? CubeSkillId1 : null);
          }
          if (this.talentCubeSkills?.CubeSkillId2 != null && this.talentCubeSkills?.CubeSkillId2 != '') {
            let CubeSkillId2 = this.talentCubeSkills?.CubeSkillId2.split(",").map(Number);
            if (CubeSkillId2.length != 0) {
              this.mergedCubeSkills = this.mergedCubeSkills.concat(CubeSkillId2);
            }
            // this.getControl('cubeSkill2').patchValue(CubeSkillId2.length != 0 ? CubeSkillId2 : null);
          }
          if (this.talentCubeSkills?.CubeSkillId3 != null && this.talentCubeSkills?.CubeSkillId3 != '') {
            let CubeSkillId3 = this.talentCubeSkills?.CubeSkillId3.split(",").map(Number);
            if (CubeSkillId3.length != 0) {
              this.mergedCubeSkills = this.mergedCubeSkills.concat(CubeSkillId3);
            }
            //  this.getControl('cubeSkill3').patchValue(CubeSkillId3.length != 0 ? CubeSkillId3 : null);
          }
          if (this.talentCubeSkills?.CubeSkillId4 != null && this.talentCubeSkills?.CubeSkillId4 != '') {
            let CubeSkillId4 = this.talentCubeSkills?.CubeSkillId4.split(",").map(Number);
            if (CubeSkillId4.length != 0) {
              this.mergedCubeSkills = this.mergedCubeSkills.concat(CubeSkillId4);
            }

            // this.getControl('cubeSkill4').patchValue(CubeSkillId4.length != 0 ? CubeSkillId4 : null);
          }
        }

      }
    )
  }

  GetExperienceByGradeID(GradeID: number) {
    this._talentServ.GetExperienceByGradeID(GradeID)
      .subscribe(
        res => {
          this.ExperienceList = res['data'];
        });
  }



  /**
   * 
   * @param e GET ROLE ID
   */
  public ExperienceList: any = [];
  public filterCubeRole: any = {};
  getCubeRoleId(e: any) {
    debugger

    this.filterCubeRole = this.RoleTalentCubeList.filter(r => r.RoleId == e.value)[0];
    if (this.requirementTypeID == 3) {
      if (this.talentDetails?.EmpGradeLevel != null && this.talentDetails?.EmpGradeLevel != '') {
        if ((this.filterCubeRole?.GradeLevelId > this.talentDetails?.EmpGradeLevel + 1) && !this.isRotation) {
          this._share.showAlertErrorMessage.next('The selected grade should not exceed the grade of employee by more than one level.')
          // this._share.showAlertErrorMessage.next('Grade cant be greater than the existing grade ' + this.talentDetails?.gradeLevel + ' + 1.')
          this.filterCubeRole['gradeName'] = '';
          this.getControl('cubeRoleId').reset();
          this.getControl('cubeGradeId').reset();
          this.getControl('ExperienceId').reset();
          this.filterCubeRole['PracticeName'] = '';
        } else {
          this.getControl('cubeGradeId').patchValue(this.filterCubeRole?.GradeId ? this.filterCubeRole?.GradeId : null);
          this.getJDByTCROLE(this.getControl('talentCubeId').value, e.value);
          this.getControl('ExperienceId').reset();
          this.GetExperienceByGradeID(this.filterCubeRole?.GradeId ? this.filterCubeRole?.GradeId : null);
          this.checkGradeChange(
            this.talentDetails?.TCGradeLevelId ? this.talentDetails?.TCGradeLevelId : this.talentDetails?.EmpGradeLevel,
            this.filterCubeRole?.GradeLevelId
          );


        }
      }
      else if (this.replacementEmpGradeLevel != null && this.replacementEmpGradeLevel != '') {

        if ((this.filterCubeRole?.GradeLevelId > this.replacementEmpGradeLevel + 1) && !this.isRotation) {
          this._share.showAlertErrorMessage.next('The selected grade should not exceed the grade of employee by more than one level.')
          // this._share.showAlertErrorMessage.next('Grade cant be greater than the existing grade ' + this.talentDetails?.TCGradeName + ' + 1.')
          this.filterCubeRole['gradeName'] = '';
          this.getControl('cubeRoleId').reset();
          this.getControl('cubeGradeId').reset();
          this.getControl('ExperienceId').reset();
          this.filterCubeRole['PracticeName'] = '';
        } else {
          this.getControl('cubeGradeId').patchValue(this.filterCubeRole?.GradeId ? this.filterCubeRole?.GradeId : null);
          this.getJDByTCROLE(this.getControl('talentCubeId').value, e.value);
          this.getControl('ExperienceId').reset();
          this.GetExperienceByGradeID(this.filterCubeRole?.GradeId ? this.filterCubeRole?.GradeId : null);

        }
      }
      else {
        this.getControl('cubeGradeId').patchValue(this.filterCubeRole?.GradeId ? this.filterCubeRole?.GradeId : null);
        this.getJDByTCROLE(this.getControl('talentCubeId').value, e.value);
        this.getControl('ExperienceId').reset();
        this.GetExperienceByGradeID(this.filterCubeRole?.GradeId ? this.filterCubeRole?.GradeId : null);
      }
    } else {
      this.getControl('cubeGradeId').patchValue(this.filterCubeRole?.GradeId ? this.filterCubeRole?.GradeId : null);

      if (this.requirementTypeID != 6) {
        this.getJDByTCROLE(this.getControl('talentCubeId').value, e.value);
      }
      this.getControl('ExperienceId').reset();
      this.GetExperienceByGradeID(this.filterCubeRole?.GradeId ? this.filterCubeRole?.GradeId : null);
    }
  }

  public tcJDDetails: any = {};
  getJDByTCROLE(TalentCubeCode: number, TCRole: number) {
    this._globalServe.getJDByTCAndRole(TalentCubeCode, TCRole).subscribe(
      res => {
        this.tcJDDetails = res['data'][0];
        // this.getControl('jobDescription').patchValue(null);
        let jdDmMain: string = '';
        if (this.tcJDDetails?.CoreSkills) {
          let CoreSkillsD = this.tcJDDetails?.CoreSkills.replace(/\r\n/g, "<br/>");
          let jdCore = `
         <p><strong>Core Skills</strong></p>
         ${this.tcJDDetails?.CoreSkills}
        `
          jdDmMain = jdDmMain + jdCore
        }
        if (this.tcJDDetails?.SecondarySkills) {
          let CoreSkillsD = this.tcJDDetails?.SecondarySkills.replace(/\r\n/g, "<br/>");
          let jdCore = `
         <p><strong >Secondary Skills</strong></p>
         ${CoreSkillsD}
        `
          jdDmMain = jdDmMain + jdCore
        }
        if (this.tcJDDetails?.SoftSkillsandProfessionalAttributes) {
          let CoreSkillsD = this.tcJDDetails?.SoftSkillsandProfessionalAttributes.replace(/\r\n/g, "<br/>");
          let jdCore = `
         <p><strong >Soft Skills and Professional Attributes </strong></p>
         ${CoreSkillsD}
        `
          jdDmMain = jdDmMain + jdCore
        }
        if (this.tcJDDetails?.EngineeringSkills) {
          let CoreSkillsD = this.tcJDDetails?.EngineeringSkills.replace(/\r\n/g, "<br/>");
          let jdCore = `
         <p><strong >Engineering Skills </strong></p>
         ${CoreSkillsD}
        `
          jdDmMain = jdDmMain + jdCore
        }

        if (this.tcJDDetails?.JobResponsibilities) {
          let CoreSkillsD = this.tcJDDetails?.JobResponsibilities.replace(/\r\n/g, "<br/>");
          let jdCore = `
         <p><strong>Job Responsibilities </strong></p>
         ${CoreSkillsD}
        `
          jdDmMain = jdDmMain + jdCore
        }
        jdDmMain = jdDmMain

        this.getControl('jobDescription').patchValue(jdDmMain);

        if (this.tcJDDetails?.RoleDesc) {
          let RoleDesc = this.tcJDDetails?.RoleDesc.replace(/\r\n/g, "<br/>");
          this.getControl('jobSummary').patchValue(RoleDesc);
        }
      }
    )

    if (this.getControl('requirementType').value == 6) {

      this.resetControl('jobSummary');
      this.resetControl('jobDescription');
    }
  }

  modelJDTcList(elm: any = {}) {
    elm['title'] = "JD List";
    elm['TalentCubeCode'] = this.getControl('talentCubeId').value;
    elm['TCRole'] = this.getControl('cubeRoleId').value;
    if (elm['TalentCubeCode'] && elm['TCRole']) {
      const dialogRef = this.dialog.open(JDListModalTcComponent, {
        panelClass: ['ats-model-wrap', 'candidate-connect-view-modal', 'tc-ref-modal'],
        data: elm,
        width: '700px'
      });
      dialogRef.afterClosed().subscribe(
        res => {
          if (res) {

          }
        }
      );
    }
    else {
      this._share.showAlertErrorMessage.next('Please select Talent Cube and Role.')
    }

  }

  public locationList: any = [];

  public employeeUnitType: any = [];
  public stateList: any = [];
  public citiesList: any = [];
  public designationCategoriesList: any = [];
  public qualificationsList: any = [];
  public primarySkillsList: any = [];
  public employementTypelist: any = [];
  public filterCtrlPrimarySkill: UntypedFormControl = new UntypedFormControl();
  public searchInputPrimarySkill: string;
  public filterCtrlAccount: UntypedFormControl = new UntypedFormControl();
  public searchCtrlAccount: string;
  public filterCtrlDesigCategory: UntypedFormControl = new UntypedFormControl();
  public searchCtrlDesigCatgory: string;
  public filterCtrlJoiningLocation: UntypedFormControl = new UntypedFormControl();
  public searchCtrlJoiningLocation: string;
  public filterCtrlQualification: UntypedFormControl = new UntypedFormControl();
  public searchCtrlQualification: string;
  public divisionList: any = [];
  public filterCtrlDivision: UntypedFormControl = new UntypedFormControl();
  public searchCtrlDivision: string;
  public replacementReason: any = [];
  public filterCtrlReplacementReason: UntypedFormControl = new UntypedFormControl();
  public searchCtrlReplacementReason: string;
  public bidTypeList: any = [];
  public coderByteAssessmentList: any = [];
  public conversionEmpList: any = []
  public filterCtrlConversionEmp: UntypedFormControl = new UntypedFormControl();
  public searchCtrlConversionEmp: string;
  public talentCubeList: any = [];
  public FilterCtrlTC: UntypedFormControl = new UntypedFormControl();
  public FilterCtrlCoderBytAssesment: UntypedFormControl = new UntypedFormControl();
  public searchInputCoderBytAssesment: string;
  public searchInputTC: string;
  public gradeList: any = [];
  public additionalSkillList: any = [];
  public tech1InterviewByList: any = [];
  public reasonOptingNotOptingList: any = [];
  public externalReasonOptingNotOptingList: any = [];
  public OnlineAssesmentAgencyList: any = [];
  public resignEmployeeListForReplacement: any = [];
  public filterCtrlReplacementResignEmp: UntypedFormControl = new UntypedFormControl();
  public searchCtrlReplacementResignEmp: string;
  public ReplGradeChangeReason: any = [];
  /**getting data from apis */
  excuteAllAPI() {
    forkJoin([
      //this._globalServe.getLocationList(),
      this._globalServe.getBillingTypeList(),
      this._globalServe.getEmployeeUnitList(),
      // this._talentServ.getDuList(this.empUnitId),
      this._talentServ.GetDesignationCategories(),
      this._talentServ.GetQualifications(),
      this._talentServ.GetPrimarySkills(),
      this._talentServ.GetEmployeeType(),
      // this._talentServ.GetDivisionDetails(),
      this._talentServ.GetReplacementReason(),
      this._talentServ.GetBidType(),
      this._talentServ.getConverstionEmpList(6),
      this._globalServe.getTalentCubeList(),
      // this._globalServe.getGradeList(),
      this._talentServ.GetSubSkills(0),
      this._globalServe.GetTech1InterviewByMaster(),
      this._globalServe.GetOnlineAssesmentAgencyMaster(),
      this._globalServe.getCoderByteAssessments(),
      // this._globalServe.getResignReplamentEmp(),
      this._talentServ.GetClientWorkRequirements(),
      this._talentServ.GetSubClientWorkRequirements(),
      this._talentServ.getReplGradeChangeReason(),

    ]).subscribe(
      res => {
        //   this.locationList = res[0]['data'];
        this.employeeUnitType = res[1]['data'];
        // this.duList = res[2]['data'];
        this.designationCategoriesList = res[2]['data'];
        this.qualificationsList = res[3]['data'];
        this.primarySkillsList = res[4]['data'];
        this.employementTypelist = res[5]['data'];
        // this.divisionList = res[6]['data'];
        this.replacementReason = res[6]['data'];
        this.bidTypeList = res[7]['data'];
        this.conversionEmpList = res[8]['data'];
        this.talentCubeList = res[9]['data'];
        this.additionalSkillList = res[10]['data'];
        // this.gradeList= res[10]['data'];
        this.tech1InterviewByList = res[11]['data'];
        this.OnlineAssesmentAgencyList = res[12]['data'];
        this.coderByteAssessmentList = res[13]['data'];
        // this.resignEmployeeListForReplacement = res[14]['data'];
        this.clientWorkRequirementOptions = res[14]['data'];
        this.locationTypeOptions = res[15]['data'];
        this.BillingTypeList = res[0]['data'];
        this.ReplGradeChangeReason = res[16]['data'];
        debugger
      }
    )

    /**primary skill */
    this.filterCtrlPrimarySkill.valueChanges.subscribe(
      val => {
        this.searchInputPrimarySkill = val;
      }
    )

    /**accouny search */
    this.filterCtrlAccount.valueChanges.subscribe(
      val => {
        this.searchCtrlAccount = val;
      }
    )
    /**search designation category */
    this.filterCtrlDesigCategory.valueChanges.subscribe(
      val => {
        this.searchCtrlDesigCatgory = val;
      }
    )
    /**search qualification */
    this.filterCtrlQualification.valueChanges.subscribe(
      val => {
        this.searchCtrlQualification = val;
      }
    )
    /**search division */
    this.filterCtrlDivision.valueChanges.subscribe(
      val => {
        this.searchCtrlDivision = val;
      }
    )
    /**Replacement Reason */
    this.filterCtrlReplacementReason.valueChanges.subscribe(
      val => {
        this.searchCtrlReplacementReason = val;
      }
    )
    /**conversion emp  */
    this.filterCtrlConversionEmp.valueChanges.subscribe(
      val => {
        this.searchCtrlConversionEmp = val;
      }
    )
    /**replacement resign emp  */
    this.filterCtrlReplacementResignEmp.valueChanges.subscribe(
      val => {
        this.searchCtrlReplacementResignEmp = val;
      }
    )
    this.FilterCtrlTC.valueChanges.subscribe(
      val => {
        this.searchInputTC = val;
      }
    );
    /**coder byte assessment search */
    this.FilterCtrlCoderBytAssesment.valueChanges.subscribe(
      val => {
        this.searchInputCoderBytAssesment = val;
      }
    );
  }

  /**wmg can edit/change the location when its pending with wmg and applicable to edit */
  /**show same country location */
  public filteredLocation: any = [];
  locationFilterForEdit(locId: number) {
    /**India location */
    if (locId == 1 || locId == 2 || locId == 4 || locId == 5 || locId == 10 || locId == 11 || locId == 16 || locId == 21 || locId == 23) {
      this.filteredLocation = this.locationList.filter(loc => loc.LocID == 1 || loc.LocID == 2 || loc.LocID == 4 || loc.LocID == 5 || loc.LocID == 10
        || loc.LocID == 11 || loc.LocID == 16 || loc.LocID == 21 || loc.LocID == 23
      );
    }
    // US 3
    else if (locId == 3) {
      this.filteredLocation = this.locationList.filter(loc => loc.LocID == 3);
    }
    // singapore 6 
    else if (locId == 6) {
      this.filteredLocation = this.locationList.filter(loc => loc.LocID == 6);
    }
    // malaysia 7
    else if (locId == 7) {
      this.filteredLocation = this.locationList.filter(loc => loc.LocID == 7);
    }
    // UK 8
    else if (locId == 8) {
      this.filteredLocation = this.locationList.filter(loc => loc.LocID == 8);
    }
    // Middle east 9
    else if (locId == 9) {
      this.filteredLocation = this.locationList.filter(loc => loc.LocID == 9
      );
    }
    // belgium 12
    else if (locId == 12) {
      this.filteredLocation = this.locationList.filter(loc => loc.LocID == 12);
    }
    // Poland 13
    else if (locId == 13) {
      this.filteredLocation = this.locationList.filter(loc => loc.LocID == 13);
    }
    // sweden 14
    else if (locId == 14) {
      this.filteredLocation = this.locationList.filter(loc => loc.LocID == 14);
    }
    // Ireland 17
    else if (locId == 17) {
      this.filteredLocation = this.locationList.filter(loc => loc.LocID == 17);
    }
    // Uruguey 19
    else if (locId == 19) {
      this.filteredLocation = this.locationList.filter(loc => loc.LocID == 19);
    }

    // Canada 20
    else if (locId == 20) {
      this.filteredLocation = this.locationList.filter(loc => loc.LocID == 20);
    }
    // egypt 24
    else if (locId == 24) {
      this.filteredLocation = this.locationList.filter(loc => loc.LocID == 24);
    }
    // Cayman 25
    else if (locId == 25) {
      this.filteredLocation = this.locationList.filter(loc => loc.LocID == 25);
    }

    //this.getControl('joiningLocation').patchValue(this.talentDetails?.JoiningLocID ? parseInt(this.talentDetails?.JoiningLocID) : null);
    //  else {
    //   this.locationList = this.locationList;
    // }

  }

  /**get requrement  list */
  public requirementType: any = [];
  public requirmentTypeFiltered: any = [];
  getRequirementTypeList(empUnitId: number) {
    this._talentServ.getRequirementTypeList(empUnitId).subscribe(
      res => {
        /**showing all requirement type for wmg */
        // if (this.data?.type == 'N') {
        //   if (this.user?.otherRoles?.IsWMG == 'Y') {
        //     this.requirementType = res['data'];
        //   } else {
        //     /**remove replacement  in existig project  by filter for other role */
        //     var filterCandidate = res['data'].filter(user => user.ID != 3);
        //     this.requirementType = filterCandidate;
        //   }
        // } else {

        // }
        if (this.data?.type == 'C') {
          this.requirementType = res['data'];
          // if (this.talentDetails?.ReqTypeID == 1) {
          //   this.requirementType = res['data'].filter(user => user.ID == 1 || user.ID == 2);
          // } else {
          //   this.requirementType = res['data'].filter(user => user.ID == this.talentDetails?.ReqTypeID);
          // }
          /**hiding  C2H conversion 6 and Replacement in exciting project 3. */
          // this.requirementType = res['data'].filter(user => user.ID == 1 || user.ID == 2 || user.ID == 4 || user.ID == 5);
          if (empUnitId == 1) {
            this.requirementType = res['data'].filter(user => user.ID == 1 || user.ID == 2 || user.ID == 4 || user.ID == 5);
          } else {
            this.requirementType = res['data'].filter(user => user.ReqID == 2);
          }
        } else {
          this.requirementType = res['data'];
        }
      }
    )
  }


  /**joining loction list */

  getLocationList() {
    /**search joining location */
    this.filterCtrlJoiningLocation.valueChanges.subscribe(
      val => {
        this.searchCtrlJoiningLocation = val;
      }
    )
    this._globalServe.getLocationList().subscribe(
      res => {
        this.locationList = res['data'];

      }
    )
  }


  /**joining state list */
  public filterCtrlJoinState: UntypedFormControl = new UntypedFormControl();
  public searchCtrlJoinState: string;
  getStateList(stateId: number) {
    /**search */
    this.filterCtrlJoinState.valueChanges.subscribe(
      val => {
        this.searchCtrlJoinState = val;
      }
    )
    this._talentServ.getStateNameList(stateId).subscribe(
      res => {
        this.stateList = res['data'];
      }
    )
  }

  /**get joining cities */
  public filterCtrlJoiningCity: UntypedFormControl = new UntypedFormControl();
  public searchCtrlJoiningCity: string;
  getCitiesList(countryId: number, stateName: string) {
    /**search */
    this.filterCtrlJoiningCity.valueChanges.subscribe(
      val => {
        this.searchCtrlJoiningCity = val;
      }
    )
    this._talentServ.getCitiesNameList(countryId, stateName).subscribe(
      res => {
        this.citiesList = res['data'];
      }
    )
  }


  GetReasonForNotOptOnlineExternalAssessment(id: number) {
    this._globalServe.GetReasonForNotOptOnlineExternalAssessment(id).subscribe(
      res => {
        //this.reasonOptingNotOptingList = res['data'];
        let internalIds = [1, 2, 3];
        this.reasonOptingNotOptingList = res['data'].filter(r => r.id == 1 || r.id == 2 || r.id == 3);
        this.externalReasonOptingNotOptingList = res['data'].filter(r => r.id == 2 || r.id == 4);
      }
    )
  }

  /**get du list */
  public duList: any = [];
  public filterCtrlDu: UntypedFormControl = new UntypedFormControl();
  public searchCtrlDu: string;
  getDuList(id: number) {
    /**du search */
    this.filterCtrlDu.valueChanges.subscribe(
      val => {
        this.searchCtrlDu = val;
      }
    )
    this._talentServ.getDuList(id).subscribe(
      res => {
        this.duList = res['data'];
        if (this.data?.type == 'U' || this.data?.type == 'UW' || this.data?.type == 'A' || this.data?.type == 'C' || this.data?.type == 'JD' || this.data?.type == 'E') {
          this.getControl('deliveryUnit').patchValue(this.talentDetails?.DU_ID ? this.talentDetails?.DU_ID.toString() : null);

        }
      }
    );
  }

  /**get account  list */
  public accountList: any = [];
  getAccountList(reqType: number, duId: number, empUnitId: number) {
    this._talentServ.getAccountList(reqType, duId, empUnitId).subscribe(
      res => {
        this.accountList = res['data'];
        if (this.data?.type == 'U' || this.data?.type == 'UW' || this.data?.type == 'A' || this.data?.type == 'C' || this.data?.type == 'JD' || this.data?.type == 'E') {
          /**requirement type 1 piplline for sfdc account other all from aspire */
          if (this.requirementTypeID == 1) {
            this.getControl('accountId').patchValue(this.talentDetails?.SFDCAccountID ? this.talentDetails?.SFDCAccountID : null);
          } else {
            this.getControl('accountId').patchValue(this.talentDetails?.AccountID ? parseInt(this.talentDetails?.AccountID) : null);
          }

        }
      }

    );
  }

  /**get project list */
  public projectList: any = [];
  public opportunitiyList: any = [];
  public filterProjectCtrl: UntypedFormControl = new UntypedFormControl();
  public searchProjectCtrl: string;
  getProjectsList(accountId: number) {
    /**search */
    this.filterProjectCtrl.valueChanges.subscribe(
      val => {
        this.searchProjectCtrl = val;
      }
    )
    if (this.requirementTypeID == 2 || this.requirementTypeID == 3 || this.requirementTypeID == 4 || this.requirementTypeID == 6) {
      this._talentServ.getProjectsList(accountId).subscribe(
        res => {
          this.projectList = res['data'];
        }
      )
    }

  }

  /** primary skill by tc */
  public primarySkillsByTcList: any = [];
  getPrimarySkillsByTc(tcId: number) {

    this._talentServ.getPrimarySKillsListByTc(tcId).subscribe(
      res => {
        this.primarySkillsByTcList = res['data']
        if (this.primarySkillsByTcList.length === 1) {
          this.getControl('primarySkillTc').patchValue(this.primarySkillsByTcList[0]?.SkillId);
          this.getPracticeByPrimarySkill(this.primarySkillsByTcList[0]?.SkillId);
        }
        this.FilterCtrlPrimarySkillTc.valueChanges.subscribe(
          get => {
            this.searchInputPrimarySkillTc = get;
          }
        )
      }
    )

  }

  /** get opportunity list*/
  public filteredOpportunityList: any = [];
  public filterCtrlOpportunity: UntypedFormControl = new UntypedFormControl();
  public searchCtrlOppurtunity: string;
  getOpportunityList(accountId: string, reqType: number) {
    /**search */
    this.filterCtrlOpportunity.valueChanges.subscribe(
      val => {
        this.searchCtrlOppurtunity = val;
      }
    )
    this._talentServ.getOpportunityList(accountId, reqType).subscribe(
      res => {
        this.opportunitiyList = res['data'];
        //this.opportunityData =res['data'][0];
      }
    )
  }
  /** get sfdc clent list*/
  public SfdcClientList: any = [];
  getSfdcClientList(accountId: string) {

    this._talentServ.getSfdcClientList(accountId).subscribe(
      res => {
        this.SfdcClientList = res['data'];
        // this.getControl('SFDCClient').patchValue(this.SfdcClientList[0]?.AccountId);
      }
    )
  }
  /** get designation list clent list*/
  public designationList: any = [];
  public filterCtrlDesignation: UntypedFormControl = new UntypedFormControl();
  public searchCtrlDesignation: String;
  GetDesignations(desginationId: number) {
    /**search */
    this.filterCtrlDesignation.valueChanges.subscribe(
      val => {
        this.searchCtrlDesignation = val;
      }
    )
    this._talentServ.GetDesignations(desginationId).subscribe(
      res => {
        this.designationList = res['data'];
      }
    )
  }

  /** get role From Priceing list*/
  public roleFromPriceingList: any = [];
  GetTeamDetailsFromPricing(id: number) {
    this._talentServ.GetTeamDetailsFromPricing(id).subscribe(
      res => {
        this.roleFromPriceingList = res['data'];
        /**if there is no data in the api- hiding the role dropdown */
        if (res['data'].length == 0) {
          this.clearValidators('role');
          this.roleCtrl = false;
        }
        else {
          this.roleCtrl = true;
          this.addValidator('role');
        }
      }
    )
  }


  /**Get Sub Skills */
  public SubSkillsList: any = [];
  public FilterCtrlSubSkill: UntypedFormControl = new UntypedFormControl();
  public searchInputSubSkil: string;
  GetSubSkills(priSkillId: number) {

    this.FilterCtrlSubSkill.valueChanges.subscribe(
      value => {
        this.searchInputSubSkil = value;
      }
    )
    this._talentServ.GetSubSkills(priSkillId).subscribe(
      res => {
        this.SubSkillsList = res['data'];
      }
    )
  }

  /**get salary details */
  public salaryDetails: any = {};
  GetSalaryDetails(expRangeId, jobFamId) {
    this._talentServ.GetSalaryDetails(expRangeId, jobFamId).subscribe(
      res => {
        this.salaryDetails = res['data'][0];
        if (this.requirementTypeID == 3) {
          this.checkGradeChange(this.talentDetails?.EmpGradeLevel, this.salaryDetails?.GradeLevelId);
          if (this.talentDetails?.EmpGradeLevel != null && this.talentDetails?.EmpGradeLevel != '') {
            if ((this.salaryDetails?.GradeLevelId > this.talentDetails?.EmpGradeLevel + 1) && !this.isRotation) {
              this._share.showAlertErrorMessage.next('The selected grade should not exceed the grade of employee by more than one level.')
              // this._share.showAlertErrorMessage.next('Grade cant be greater than the existing grade ' + this.talentDetails?.gradeLevel + ' + 1.')
              this.salaryDetails['GRADE_LEVEL'] = '';
              this.salaryDetails['MAX_SALARY'] = '';
              this.priSkillData['JobFamily'] = '';
              this.getControl('primarySkill').reset();
            } else {

            }
          } else if (this.replacementEmpGradeLevel != null && this.replacementEmpGradeLevel != '') {
            if ((this.salaryDetails?.GradeLevelId > this.replacementEmpGradeLevel + 1) && !this.isRotation) {
              this._share.showAlertErrorMessage.next('The selected grade should not exceed the grade of employee by more than one level.')
              // this._share.showAlertErrorMessage.next('Grade cant be greater than the existing grade ' + this.talentDetails?.TCGradeName + ' + 1.')
              this.salaryDetails['GRADE_LEVEL'] = '';
              this.salaryDetails['MAX_SALARY'] = '';
              this.priSkillData['JobFamily'] = '';
              this.getControl('primarySkill').reset();
            } else {

            }
          } else {

          }
        } else {

        }
      }
    )
  }

  public gradeChangeReasonRequired: boolean = false;
  checkGradeChange(CrrGradeLevel: number, toGradeLevel: number): void {
    debugger
    const reasonCtrl = this.getControl('repGradeChangeReason');
    reasonCtrl.reset();
    reasonCtrl.clearValidators();
    this.gradeChangeReasonRequired = false;
    
    // Check for replacement demands against resignation (ReqTypeID == 3 and RepReasonID == 13)
    const isReplacementAgainstResignation = this.requirementTypeID == 3 && this.replacementReasonId == 13;
    
    if(this.talentDetails?.IsAutoGenerated == 'Y')
    {
      if (CrrGradeLevel || toGradeLevel) {
          
              // CrrGradeLevel = talent's current fixed grade, toGradeLevel = new grade that can be changed
              if (toGradeLevel >= CrrGradeLevel ) {
                this.gradeChangeReasonRequired = true;
                reasonCtrl.setValidators([Validators.required]);
              } 
            // For auto-generated demands, show reason for any grade change
            // else if (this.talentDetails?.IsAutoGenerated == 'Y' && CrrGradeLevel != toGradeLevel) {
            //   this.gradeChangeReasonRequired = true;
            //   reasonCtrl.setValidators([Validators.required]);
            // }
            else {
              this.gradeChangeReasonRequired = false;
              reasonCtrl.clearValidators();
            }
          }
    }

    reasonCtrl.updateValueAndValidity();
    // if (this.talentDetails?.EmpGradeLevel != null && this.talentDetails?.EmpGradeLevel != '') {
    //   const empGradeLevel = Number(this.talentDetails?.EmpGradeLevel);
    //    const salaryGradeLevel = Number(this.salaryDetails?.GradeLevelId);
    //       if (this.talentDetails?.EmpGradeLevel != this.salaryDetails?.GradeLevelId) {
    //         this.gradeChangeReasonRequired = true;
    //       }
    //        else{
    //         this.gradeChangeReasonRequired = false;
    //       }
    // }

  }
  /**form  init */
  public employeeUnitCont: UntypedFormControl = new UntypedFormControl([Validators.required]);
  public requirementTypeControl: UntypedFormControl = new UntypedFormControl([Validators.required]);
  formInit() {
    this.submitJobCreateForm = this._fb.group({
      //   employeeUnit: [null, [Validators.required]],
      joiningLocation: [null, [Validators.required]],
      joiningCity: [null],
      joiningState: [null],
      clientWorkRequirement: [null, [Validators.required]],
      locationType: [null],
      approvedBy: [null],
      isResourceAvailInBu: [null],
      requirementType: [null, [Validators.required]],
      deliveryUnit: [null, [Validators.required]],
      accountId: [null, [Validators.required]],
      projectNameId: [null],
      role: [null,],
      SFDCClient: [null],
      opportunityId: [null],
      exclusiveInfogain: [null, Validators.required],
      // divisionId: [null, [Validators.required]],
      jobSummary: [null, [Validators.required]],
      jobDescription: [null, [Validators.required]],
      designationCategories: [null],
      Designation: [null],
      //experinceYears: [null, [Validators.required]],
      qualification: [null, [Validators.required]],
      primarySkill: [null, [Validators.required]],
      subSkills: [null],
      additionalSkills: [null],
      talentCubeId: [null, [Validators.required]],
      cubeRoleId: [null, [Validators.required]],
      cubeGradeId: [null, [Validators.required]],
      ExperienceId: [null, [Validators.required]],
      cubePractice: [null],
      cubeSkill1: [null, [Validators.required]],
      cubeSkill2: [null, [Validators.required]],
      cubeSkill3: [null, [Validators.required]],
      cubeSkill4: [null],
      primarySkillTc: [null, [Validators.required]],
      // jobFamilyDetails: [null, [Validators.required]],
      employmentType: [null, [Validators.required]],
      // activeEmployee: [null, [Validators.required]],
      Interviewer1Tech: [null, [Validators.required]],
      Interviewer2: [null],
      Interviewer3: [null],
      tech1InterviewBy: [null, [Validators.required]],
      AcccesmentLink: [null],
      onlineAssesment: [null],
      coderBytesAssesments: [null],
      techInternalPanel: [null],
      techExternalPanel: [null],
      Billable: [null],
      BillingType: [null],
      expectedMargin: [null],
      billableRates: [null],
      BillableHours: [null],
      plannedBillingStartDate: [null],
      plannedOnBoardingDate: [null, [Validators.required]],
      isClientInterviewRequired: ['N', [Validators.required]],
      visaReady: ['N', [Validators.required]],
      Remarks: [null],
      fileUpload: [null],
      THIDApprovalAttachment: [null],
      conversionFor: [null],
      replacementFor: [null],
      replacementReason: [null],
      bidTypeDropdown: [null],
      approveRejectstatus: [null],
      rejectRemarks: [null],
      reasonCategory: [null],
      subReason: [null],
      employeeEmail: [null],
      Frequency: [null],
      repGradeChangeReason: [null]
    })

    if (this.data?.type == 'N') {
      this.submitJobCreateForm.disable();
    }
  }

  /** date filter exclude sat/sun */
  myFilterDate = (d: Date): boolean => {
    const day = d?.getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  }

  /** date filter: exclude past dates and weekends (Sat/Sun) */
  excludePastAndWeekendDates = (d: Date): boolean => {
    const day = d?.getDay();

    // Normalize today's date to midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Normalize selected date
    const selected = new Date(d);
    selected.setHours(0, 0, 0, 0);

    // Disallow past dates and weekends
    return selected >= today && day !== 0 && day !== 6;
  }
  excludePastAndWeekendDatesBill = (d: Date | null): boolean => {
    if (!d) return false;

    const day = d.getDay();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selected = new Date(d);
    selected.setHours(0, 0, 0, 0);

    const existingValue = this.submitJobCreateForm.get('plannedBillingStartDate')?.value;
    const minDate = this.minDatebilling
      ? new Date(this.minDatebilling)
      : today; // fallback to today
    minDate.setHours(0, 0, 0, 0);

    // ✅ Allow existing past value if unchanged
    if (this.isUpdateMode && !this.isDateManuallyChangedBill && existingValue) {
      const normalizedExisting = new Date(existingValue);
      normalizedExisting.setHours(0, 0, 0, 0);
      if (selected.getTime() === normalizedExisting.getTime()) {
        return true;
      }
    }

    // ✅ Enforce: billing date must be on or after onboarding date (minDatebilling)
    // ✅ Also ensure: weekday & not before today
    return selected >= minDate && day !== 0 && day !== 6;
  };



  /**validate email */
  validateEmail(event) {

    let emailText = event.target.value;
    let msg = event.target.nextElementSibling;
    msg.innerHTML = " ";
    let pattern = /^[a-zA-Z0-9\-_]+(\.[a-zA-Z0-9\-_]+)*@[a-z0-9]+(\-[a-z0-9]+)*(\.[a-z0-9]+(\-[a-z0-9]+)*)*\.[a-z]{2,4}$/;
    let uniqEmail = /@infogain.com\s*$/;
    if (uniqEmail.test(emailText)) {
      //  msg.innerHTML = "You cannot enter Infogain Email ID";
      this._share.showAlertErrorMessage.next('You cannot enter Infogain Email ID');
      this.resetControl('employeeEmail');
      return false;
    }

    if (pattern.test(emailText)) {
      return true;
    }
    else if (emailText == "") {
      //  this.isAlertDanger = true;
      // this.errorMsg = "Please enter Email Id";
      // msg.innerHTML = "Please enter Email ID";
      this._share.showAlertErrorMessage.next('Please enter Email ID');
      //this.resetControl('employeeEmail');
      return false;
    }

    // else {
    //   // msg.innerHTML = "Please enter valid  Email ID";
    //   this._share.showAlertErrorMessage.next('Please enter valid  Email ID');
    //   return false;
    // }
  }
  /***
   * control show/hide delivery
   */
  public deliveryUnitCtrl: boolean = false;
  public accountIdCtrl: boolean = false;
  public projectNameIdCtrl: boolean = false;
  public roleCtrl: boolean = false;
  public opportunityIdCtrl: boolean = false;
  public isfdcIdCtrl: boolean = false;
  public opportunityTypeCtrl: boolean = false;
  public oddsOfWinningPercentCtrl: boolean = false;
  public bookingDgmPercentCtrl: boolean = false;
  public projectEndDateCtrl: boolean = false;
  public bidTypeCtrl: boolean = false;
  public bidTypeDropDownCtrl: boolean = false;
  public exclusiveInfogainCtrl: boolean = false;
  public BillableCtrl: boolean = false;
  public isClientIntReqCtrl: boolean = false;
  public visaReadyCtrl: boolean = false;
  // public divisionIdCtrl: boolean = false;
  public onsiteHiringManagerCtrl: boolean = false;
  public conversionForCtrl: boolean = false;
  public replacementForCtrl: boolean = false;
  public replacementReasonCtrl: boolean = false;
  public interviewer1Ctrl: boolean = true;
  public tech1interviewBy: boolean = true;
  public interviewer2Ctrl: boolean = true;
  public interviewer3Ctrl: boolean = true;
  public plannnedOnboardingDateCtrl: boolean = true;
  public attechmentfileUploadCtrl: boolean = true;

  public isProjectVisible: boolean = false;
  empUnitDeliveryActionFunc(val: boolean = false) {

    if (!val) {
      // this.clearValidators('deliveryUnit');
      this.clearValidators('accountId');
      this.clearValidators('projectNameId');
      //this.clearValidators('bidType');
      this.clearValidators('exclusiveInfogain');
      // this.exclusiveInfogainCtrl = false;
      this.clearValidators('Billable');
      this.clearValidators('isClientInterviewRequired');
      this.clearValidators('visaReady');
      this.clearValidators('opportunityId');
      //this.clearValidators('divisionId');
    }
    // this.deliveryUnitCtrl = val;
    // this.divisionIdCtrl = val;
    this.accountIdCtrl = val;
    this.projectNameIdCtrl = val;
    this.roleCtrl = val;
    this.opportunityIdCtrl = val;
    this.isfdcIdCtrl = val;
    this.opportunityTypeCtrl = val;
    this.oddsOfWinningPercentCtrl = val;
    this.bookingDgmPercentCtrl = val;
    this.projectEndDateCtrl = val;
    this.bidTypeCtrl = val;
    this.bidTypeDropDownCtrl = val;
    this.exclusiveInfogainCtrl = val;
    this.BillableCtrl = val;
    this.isClientIntReqCtrl = val;
    this.visaReadyCtrl = val;
    this.onsiteHiringManagerCtrl = val;
    this.conversionForCtrl = val;
    this.replacementForCtrl = val;
    this.replacementReasonCtrl = val;
    //this.getControl('exclusiveInfogain').patchValue('N');
    this.getControl('isClientInterviewRequired').patchValue('N');
    this.getControl('visaReady').patchValue('N');
    this.getControl('Billable').patchValue('N');
    if (val) {
      // this.addValidator('deliveryUnit');
      // this.addValidator('divisionId');
      this.addValidator('accountId');
      this.addValidator('projectNameId');
      //this.addValidator('bidType');
      this.addValidator('exclusiveInfogain');
      this.addValidator('Billable');
      this.addValidator('isClientInterviewRequired');
      this.addValidator('visaReady');
      this.addValidator('opportunityId');
    }
  }

  /***
  * control show/hide support
  */
  public subDepartmentCtrl: boolean = false;
  public functionNameCtrl: boolean = false;
  public DepartmentCtrl: boolean = false;
  empUnitSupportActiveFunc(val: boolean = false) {
    if (!val) {
      // this.clearValidators('Department');
      //this.clearValidators('subDepartment');
      //this.clearValidators('functionName');
      // this.clearValidators('qualification');
      this.clearValidators('projectNameId');
      // this.clearValidators('deliveryUnit');
      // this.clearValidators('accountId');   
    }

    this.subDepartmentCtrl = val;
    this.functionNameCtrl = val;
    this.DepartmentCtrl = val;
    this.projectNameIdCtrl = val;
    this.exclusiveInfogainCtrl = !val;
    // this.BillableCtrl = val
    if (val) {
      // this.addValidator('Department');
      //this.addValidator('subDepartment');
      // this.addValidator('functionName');
      // this.addValidator('qualification');
      this.addValidator('projectNameId');
      // this.addValidator('deliveryUnit');
      this.addValidator('accountId');

    }
  }

  /**control */
  getControl(name: string) {
    return this.submitJobCreateForm.get(name);
  }

  public isJobDescriAndJobVisible: boolean = true;
  geResourceAvailableType(data: any) {

    this.geResourceAvailableFields(data);
  }
  /**for all fileds which are dependend on is resource type bu internal */
  geResourceAvailableFields(data) {
    this.resetControl('Interviewer1Tech');
    this.resetControl('tech1InterviewBy');
    this.resetControl('Interviewer2');
    this.resetControl('Interviewer3');

    this.resetControl('isClientInterviewRequired');
    this.resetControl('plannedOnBoardingDate');
    if (this.data?.type != 'C') {
      /** while change req type for cloning only account details reseting   */
      this.resetControl('jobDescription');
      this.resetControl('jobSummary');

    }
    if (data.value == 'Y') {
      this.clearValidators('jobSummary');
      this.clearValidators('jobDescription');
      this.isJobDescriAndJobVisible = false;
      this.clearValidators('Interviewer1Tech');
      this.clearValidators('tech1InterviewBy');
      this.interviewer1Ctrl = false;
      this.tech1interviewBy = false;
     // this.clearValidators('Interviewer2');
      this.interviewer2Ctrl = false;
     // this.clearValidators('Interviewer3');
      this.interviewer3Ctrl = false;
      this.clearValidators('plannedOnBoardingDate');
      this.plannnedOnboardingDateCtrl = false;
      this.clearValidators('isClientInterviewRequired');
      this.isClientIntReqCtrl = false;
      this.clearValidators('visaReady');
      this.visaReadyCtrl = false;
      // this.clearValidators('fileUpload');
      // this.attechmentfileUploadCtrl = false;
      // this.isClientIntReqCtrl = false;
      // this.clearValidators('qualification');
      // this.qualificationCTRL = false;
      // this.clearValidators('subSkills');
      // this.subSkillCTRL = false;
    } else {
      this.isJobDescriAndJobVisible = true;
      // this.addValidator('jobSummary');
      this.minLengthMaxLengthValidator('jobSummary', 'min', 10);
      this.minLengthMaxLengthValidator('jobDescription', 'min', 100)
      // this.addValidator('jobDescription');
      this.interviewer1Ctrl = true;

      this.addValidator('Interviewer1Tech');

      this.interviewer2Ctrl = true;
    //  this.addValidator('Interviewer2');
      this.interviewer3Ctrl = true;
     // this.addValidator('Interviewer3');
      this.plannnedOnboardingDateCtrl = true;
      this.addValidator('plannedOnBoardingDate');
      this.isClientIntReqCtrl = true;
      this.addValidator('isClientInterviewRequired');
      this.getControl('isClientInterviewRequired').patchValue('N');
      this.visaReadyCtrl = true;
      this.addValidator('visaReady');
      this.getControl('visaReady').patchValue('N');
      // this.attechmentfileUploadCtrl = true;
      // this.addValidator('fileUpload');
      // this.qualificationCTRL = true;
      // this.addValidator('qualification');
      //this.subSkillCTRL = true;
      // this.addValidator('subSkills');

      // if (thiws.joiningLocId) {
      //   // this.isLocationIndia = true;
      //   this.tech1interviewBy = true;

      //   this.addValidator('tech1InterviewBy');
      // }
      // else {
      //   //  this.isLocationIndia = false;

      //   this.clearValidators('tech1InterviewBy');
      //   this.tech1interviewBy = false;
      // }
      this.getControl('joiningLocation').value;
      this.showHideLocWise(this.getControl('joiningLocation').value);
    }

  }
  /**get employee unit id */
  public empUnitId: number;
  public isDeliveryActive: boolean = false;
  public showGDLCtrl: boolean = false;
  public showClientWorkRequirement: boolean = false;
  getEmployeeUnitId(data: any) {
    this.empUnitId = data.value;
    if (this.data?.type == 'N') {
      let locJoin = this.getControl('joiningLocation').value;
      let locJoinState = this.getControl('joiningState').value;
      let locJoinCIty = this.getControl('joiningCity').value;
      this.submitJobCreateForm.reset();
      this.getControl('joiningLocation').enable();
      this.getControl('requirementType').enable();
      this.getControl('joiningState').enable();
      this.getControl('joiningCity').enable();
      // this.getControl('clientWorkRequirement').enable();

      /**not reseting location on unit change */
      this.getControl('joiningLocation').patchValue(locJoin ? locJoin : null);
      this.getControl('joiningState').patchValue(locJoinState ? locJoinState : null);
      this.getControl('joiningCity').patchValue(locJoinCIty ? locJoinCIty : null);
      // this.getControl('employeeUnit').patchValue(data.value);
      // this.submitJobCreateForm.reset();
      this.replacementReasonSc = false;
      this.resetControl('isResourceAvailInBu');
      this.clearValidators('isResourceAvailInBu');
      this.isResourceAvailInBu = false;
      this.replacementReasonSc = false;
      this.resetControl('approvedBy');
      this.clearValidators('approvedBy');
      this.isApprovedByVisible = false;

      /** 1 for delivery.
       *  5 for support */
      if (data.value === 1) {
        //  this.submitJobCreateForm.enable();
        //  this.isEmpUnitSupportActive = false;
        this.empUnitDeliveryActionFunc(true);
        this.empUnitSupportActiveFunc(false)
        //  this.isEmpUnitDeliveryActive = true;
        //  this.deliveryEmpUnit();
        this.isDeliveryActive = true;
        this.clearValidators('deliveryUnit');
        this.showGDLCtrl = false;
        this.showClientWorkRequirement = true;
        this.addValidator('clientWorkRequirement');
      } else if (data.value === 5) {
        // this.submitJobCreateForm.enable();
        // this.isEmpUnitSupportActive = true;
        // this.isEmpUnitDeliveryActive = false;
        // this.supportEmpUnit();
        this.isDeliveryActive = false;
        this.showGDLCtrl = true;
        this.addValidator('deliveryUnit');
        this.closedDateCtrl = false;
        this.empUnitDeliveryActionFunc(false);
        this.empUnitSupportActiveFunc(true)
        this.clearValidators('SFDCClient');
        this.SFDCClientCtrl = false;
        this.showClientWorkRequirement = false;
        this.clearValidators('clientWorkRequirement');

      }
      this.getDuList(data?.value);
      this.getRequirementTypeList(data.value);
      this.getLoginName = [];
    }
    else {
      this.submitJobCreateForm.reset();
      this.replacementReasonSc = false;
      this.resetControl('isResourceAvailInBu');
      this.clearValidators('isResourceAvailInBu');
      this.isResourceAvailInBu = false;
      this.replacementReasonSc = false;
      this.resetControl('approvedBy');
      this.clearValidators('approvedBy');
      this.isApprovedByVisible = false;

      /** 1 for delivery.
       *  5 for support */
      if (data.value === 1) {
        this.empUnitDeliveryActionFunc(true);
        this.empUnitSupportActiveFunc(false)
        this.isDeliveryActive = true;
        this.clearValidators('deliveryUnit');
        this.showGDLCtrl = false;
        this.showClientWorkRequirement = true;
        this.addValidator('clientWorkRequirement');

      } else if (data.value === 5) {
        this.isDeliveryActive = false;
        this.showGDLCtrl = true;
        this.addValidator('deliveryUnit');
        this.closedDateCtrl = false;
        this.empUnitDeliveryActionFunc(false);
        this.empUnitSupportActiveFunc(true)
        this.clearValidators('SFDCClient');
        this.SFDCClientCtrl = false;
        this.showClientWorkRequirement = false;
        this.clearValidators('clientWorkRequirement');

      }
      this.getDuList(data?.value);
      this.getRequirementTypeList(data.value);
      this.getLoginName = [];
    }
  }
  /**getting location id and hiding cities based on location - 
     * only visible for US 3 and poland 13 */

  public isCitiesActive: boolean = false;
  public isStateActive: boolean = false;
  public joiningLocationId: number;
  public countryId: number;
  public joiningLocId: number;
  public isLocationIndia: boolean = false;
  getSelectLocId(data: any) {
    this.resetControl('joiningCity');
    this.resetControl('joiningState');
    this.joiningLocId = data?.value;
    this.showHideLocWise(data?.value);
    this.GetTeamDetailsFromPricing(this.getControl('opportunityId').value);
    if (this._getLocInfo.isLocationIndiaById(data?.value)) {
      this.isLocationIndia = true;

    }
    else {
      this.isLocationIndia = false;
    }


    /**US */
    if (data.value == 3) {
      this.isStateActive = true;
      this.addValidator('joiningState');
      this.clearValidators('joiningCity');
      this.isCitiesActive = false;
      this.getStateList(data.value);
      this.countryId = data.value;
      this.clearValidators('role');
      this.roleCtrl = false;
    }
    /**poland */
    else if (data.value == 13) {
      this.isCitiesActive = true;
      this.addValidator('joiningCity');
      this.clearValidators('joiningState');
      this.isStateActive = false;
      this.getCitiesList(data.value, '');
      this.clearValidators('role');
      this.roleCtrl = false;
      this.stateId = 175
    }

    else {
      this.clearValidators('joiningState');
      this.isStateActive = false;
      this.clearValidators('joiningCity');
      this.isCitiesActive = false;
      this.clearValidators('role');
      this.roleCtrl = false;
    }

    this.hideShowRole();
  }
  /**show hide role  */
  hideShowRole() {
    let requrementType = this.getControl('requirementType').value;
    let joinLocID = this.getControl('joiningLocation').value;
    /** showing for loc id bangu 4, chenn 11, gurg 16, hyd 10,  mum 5, noida 1, pune 2,   */
    if (this.empUnitId == 1 && requrementType == 2) {
      if ((joinLocID == 1 || joinLocID == 4 || joinLocID == 11 || joinLocID == 16 || joinLocID == 10
        || joinLocID == 5 || joinLocID == 2) && (this.getControl('accountId')?.value != 427 && this.getControl('accountId')?.value != 1277 && this.getControl('accountId')?.value != 405 && this.getControl('accountId')?.value != 399)) {
        this.roleCtrl = true;
        this.addValidator('role');
      }
      else {
        this.clearValidators('role');
        this.resetControl('role');
        this.roleCtrl = false;
      }
    } else {
      this.clearValidators('role');
      this.roleCtrl = false;
    }
  }

  public stateId: number = 0;
  /**on change of state - reseting talent cube and salary details */
  getStateId(e) {
    this.stateId = e;
    if (e) {
      this.isCitiesActive = true;
      this.addValidator('joiningCity');
      //  this.getCitiesList(this.countryId, data.value);
    } else {
      this.clearValidators('joiningCity');
      this.isCitiesActive = false;
    }

  }
  /**get joining state name */
  getJoiningStateId(data: any) {
    if (data.value) {
      this.isCitiesActive = true;
      this.addValidator('joiningCity');
      this.getCitiesList(this.countryId, data.value);
    } else {
      this.clearValidators('joiningCity');
      this.isCitiesActive = false;
    }
  }
  /**getting requrement type id*/
  public requirementTypeID: number;
  public isResourceAvailInBu: boolean = false;
  public isApprovedByVisible: boolean = false;
  public replacementReasonSc: boolean = false;

  public closedDateCtrl: boolean = false;
  public SFDCClientCtrl: boolean = false;
  public isOffshoreHMpipelineVisibl: boolean = false;
  public showHideHMforApproveNewAddition: boolean = false;
  public getLoginName: any = []
  public qualificationCTRL: boolean = true;
  public subSkillCTRL: boolean = true;

  public isConversion: boolean = false;
  public isReplacement: boolean = false;
  getReqType(e) {
    this.isRotation =false;
    this.requirementTypeID = e.value;
    this.submitJobCreateForm.enable();
    // this.getControl('deliveryUnit').reset();
    // this.getControl('accountId').reset();
    // this.getControl('approvedBy').reset();
    // this.getControl('isResourceAvailInBu').reset();
    // this.isResourceAvailInBu = false;
    // this.isApprovedByVisible = false;
    this.labelInterviewBiling = 'Position & Interview Details'
    let locJoin = this.getControl('joiningLocation').value;
    let requirementTypeId = this.getControl('requirementType').value;
    let joiningStateId = this.getControl('joiningState').value;
    let joiningCityId = this.getControl('joiningCity').value;
    if (this.data?.type != 'C') {
      /** while change req type for cloning only account details reseting   */
      this.submitJobCreateForm.reset();
      this.resetControl('jobDescription');
      this.resetControl('jobSummary');

    }
    this.getControl('role').reset();
    this.getControl('joiningLocation').patchValue(locJoin ? locJoin : null);
    this.getControl('requirementType').patchValue(requirementTypeId ? requirementTypeId : null);
    this.getControl('joiningState').patchValue(joiningStateId ? joiningStateId : null);
    this.getControl('joiningCity').patchValue(joiningCityId ? joiningCityId : null);
    this.replacementReasonSc = false;
    this.getAccountList(this.getReqTypeIdByEmpUnit(), 0, this.employeeUnitCont.value);
    // this.addValidator('jobSummary');
    this.minLengthMaxLengthValidator('jobSummary', 'min', 10)
    this.minLengthMaxLengthValidator('jobDescription', 'min', 100)
    //this.addValidator('jobDescription');
    this.resetControl('accountId');

    this.resetControl('isResourceAvailInBu');
    this.clearValidators('isResourceAvailInBu');
    //   this.resetControl('Billable');
    this.isResourceAvailInBu = false;
    this.isJobDescriAndJobVisible = true;
    this.interviewer1Ctrl = true;
    this.tech1interviewBy = true;
    this.interviewer2Ctrl = true;
    this.interviewer3Ctrl = true;
    this.plannnedOnboardingDateCtrl = true;
    this.addValidator('plannedOnBoardingDate');
    this.isClientIntReqCtrl = true;
    this.addValidator('isClientInterviewRequired');
    this.getControl('isClientInterviewRequired').patchValue('N');
    this.visaReadyCtrl = true;
    this.addValidator('visaReady');
    this.getControl('visaReady').patchValue('N');
    this.accountList = [];
    this.opportunitiyList = [];
    this.opportunityData = [];
    this.projData = [];
    this.SfdcClientList = [];
    this.projectList = [];
    this.replacementDesignationData = [];
    this.getControl('employeeEmail')?.reset();
    //this.isOffshoreHMpipelineVisibl = false;
    /***
     * pipeline opportunity
     */
    if (e.value === 1) {
      if (this.employeeUnitCont?.value == 1) {
        this.exclusiveInfogainCtrl = true;
        // this.addValidator('exclusiveInfogain');
        //   this.getControl('exclusiveInfogain').patchValue('N');
      }
      this.showHideHMforApproveNewAddition = false;
      this.isOffshoreHMpipelineVisibl = true;
      this.getLoginName = this.user.FullName;
      this.clearValidators('isResourceAvailInBu');
      this.isResourceAvailInBu = false;
      this.clearValidators('approvedBy');
      this.isApprovedByVisible = false;
      this.clearValidators('projectNameId');
      this.projectNameIdCtrl = false;
      this.clearValidators('role');
      this.roleCtrl = false;

      this.opportunityTypeCtrl = true;
      //this.addValidator('opportunityType');
      // this.clearValidators('divisionId');
      // this.divisionIdCtrl = false;

      this.opportunityIdCtrl = true;
      this.addValidator('opportunityId');
      this.isfdcIdCtrl = true;
      // this.addValidator('isfdcId');
      this.oddsOfWinningPercentCtrl = true;
      // this.addValidator('oddsOfWinningPercent');
      this.bookingDgmPercentCtrl = true;
      //this.addValidator('bookingDgmPercent');
      this.closedDateCtrl = true;
      // this.addValidator('closedDate');
      this.projectEndDateCtrl = true;
      // this.addValidator('projectEndDate');
      this.clearValidators('SFDCClient');
      this.SFDCClientCtrl = false;
      this.isOffshoreHMpipelineVisibl = true;

      this.onsiteHiringManagerCtrl = false;
      this.clearValidators('conversionFor');
      this.conversionForCtrl = false;
      this.clearValidators('replacementFor');
      this.replacementForCtrl = false;
      this.clearValidators('replacementReason');
      this.replacementReasonCtrl = false;

      // this.addValidator('qualification')
      this.isSpecialBidTypeAndProjectDateVisi = false;
      this.clearValidators('bidTypeDropdown');
      this.bidTypeDropDownCtrl = false;
      this.bidTypeCtrl = true;
      this.clearValidators('employeeEmail');
      // this.clearValidators('conversionRemarks');
      this.isConversion = false;
      this.isReplacement = false;
      this.isDisabledFieldsForC2h = false;

      this.isProjectVisible = false;
    }
    /***
     * New Addition for Existing Project
     */
    else if (e.value === 2) {
      if (this.employeeUnitCont?.value == 1) {
        this.exclusiveInfogainCtrl = true;
        // this.addValidator('exclusiveInfogain');
        //   this.getControl('exclusiveInfogain').patchValue('N');
      }
      this.clearValidators('conversionFor');
      this.conversionForCtrl = false;
      this.clearValidators('replacementFor');
      this.replacementForCtrl = false;
      this.clearValidators('replacementReason');
      this.replacementReasonCtrl = false;
      this.showHideHMforApproveNewAddition = true;
      this.clearValidators('employeeEmail');
      // this.clearValidators('conversionRemarks');
      this.isConversion = false;
      this.isReplacement = false;
      if (this.empUnitId == 1 || this.talentDetails?.DeliveryOrFunction == 1) {
        this.showHideHMforApproveNewAddition = true;
        this.isOffshoreHMpipelineVisibl = false;
        this.isResourceAvailInBu = true;
        this.addValidator('isResourceAvailInBu');
        this.clearValidators('approvedBy');
        this.isApprovedByVisible = false;
        this.projectNameIdCtrl = true;
        this.addValidator('projectNameId');
        this.roleCtrl = true;
        this.addValidator('role');
        this.opportunityTypeCtrl = true;
        // this.addValidator('opportunityType');
        //this.divisionIdCtrl = true;
        //this.addValidator('divisionId');
        this.opportunityIdCtrl = true;
        this.addValidator('opportunityId');
        this.isfdcIdCtrl = true;
        // this.addValidator('isfdcId');
        this.oddsOfWinningPercentCtrl = true;
        // this.addValidator('oddsOfWinningPercent');
        this.bookingDgmPercentCtrl = true;
        // this.addValidator('bookingDgmPercent');
        this.closedDateCtrl = true;
        //this.addValidator('closedDate');
        this.projectEndDateCtrl = true;
        // this.addValidator('projectEndDate');
        this.SFDCClientCtrl = true;
        this.addValidator('SFDCClient');
        this.onsiteHiringManagerCtrl = true;

        this.isSpecialBidTypeAndProjectDateVisi = false;
        this.clearValidators('bidTypeDropdown');
        this.bidTypeDropDownCtrl = false;
        this.bidTypeCtrl = true;
      }
      this.isDisabledFieldsForC2h = false;
      this.isProjectVisible = true;
    }

    /***
    * Replacement in Existing Project
    */
    else if (e.value === 3) {
      if (this.employeeUnitCont?.value == 1) {
        this.exclusiveInfogainCtrl = true;
        //this.addValidator('exclusiveInfogain');
        // this.getControl('exclusiveInfogain').patchValue('N');
      }
      // this.clearValidators('replacementReason');
      this.conversionForCtrl = true;
      this.replacementReasonSc = true;
      this.replacementReasonCtrl = true;
      // this.isDeliveryActive = false;
      this.addValidator('replacementReason');
      this.clearValidators('conversionFor');
      this.replacementForCtrl = true;
      this.addValidator('replacementFor');


      this.showHideHMforApproveNewAddition = true;
      this.isOffshoreHMpipelineVisibl = false;
      this.clearValidators('employeeEmail');
      // this.clearValidators('conversionRemarks');
      this.isConversion = false;
      this.isReplacement = true;
      //new code 
      if (this.empUnitId == 1 || this.talentDetails?.DeliveryOrFunction == 1) {
        this.showHideHMforApproveNewAddition = true;
        this.isOffshoreHMpipelineVisibl = false;
        this.clearValidators('approvedBy');
        this.isApprovedByVisible = false;
        this.isResourceAvailInBu = true;
        this.addValidator('isResourceAvailInBu');
        this.clearValidators('projectNameId');
        this.projectNameIdCtrl = false;
        this.clearValidators('role');
        this.roleCtrl = false;
        this.projectNameIdCtrl = true;
        this.addValidator('projectNameId');
        // this.clearValidators('opportunityType');
        this.opportunityTypeCtrl = false;
        // this.divisionIdCtrl = true;
        // this.addValidator('divisionId');
        this.clearValidators('opportunityId');
        this.opportunityIdCtrl = false;
        // this.clearValidators('isfdcId');
        this.isfdcIdCtrl = false;
        // this.clearValidators('oddsOfWinningPercent');
        this.oddsOfWinningPercentCtrl = false;
        // this.clearValidators('bookingDgmPercent');
        this.bookingDgmPercentCtrl = false;
        //this.clearValidators('closedDate');
        this.closedDateCtrl = false;
        this.projectEndDateCtrl = true;
        //this.addValidator('projectEndDate');
        this.clearValidators('SFDCClient');
        this.SFDCClientCtrl = false;
        this.onsiteHiringManagerCtrl = false;

        // this.clearValidators('conversionFor');
        // this.conversionForCtrl = false;
        ///this.clearValidators('replacementReason');
        //this.replacementReasonCtrl = false;

        this.isSpecialBidTypeAndProjectDateVisi = true;
        this.clearValidators('bidTypeDropdown');
        this.bidTypeDropDownCtrl = false;
        this.bidTypeCtrl = true;
      }
      this.isDisabledFieldsForC2h = false;
      this.isProjectVisible = true;
    }
    /***
    * Approved Investment
    */
    else if (e.value === 4) {
      if (this.employeeUnitCont?.value == 1) {
        this.exclusiveInfogainCtrl = true;
        //   this.addValidator('exclusiveInfogain');
        // this.getControl('exclusiveInfogain').patchValue('N');
      }
      this.showHideHMforApproveNewAddition = true;
      this.isOffshoreHMpipelineVisibl = false;
      this.isApprovedByVisible = true;
      this.addValidator('approvedBy');
      this.clearValidators('isResourceAvailInBu');
      this.isResourceAvailInBu = false;
      this.clearValidators('projectNameId');
      this.projectNameIdCtrl = false;
      this.clearValidators('role');
      this.roleCtrl = false;
      this.projectNameIdCtrl = true;
      this.addValidator('projectNameId');
      // this.clearValidators('opportunityType');
      this.opportunityTypeCtrl = false;
      // this.divisionIdCtrl = true;
      // this.addValidator('divisionId');
      this.clearValidators('opportunityId');
      this.opportunityIdCtrl = false;
      // this.clearValidators('isfdcId');
      this.isfdcIdCtrl = false;
      // this.clearValidators('oddsOfWinningPercent');
      this.oddsOfWinningPercentCtrl = false;
      // this.clearValidators('bookingDgmPercent');
      this.bookingDgmPercentCtrl = false;
      //this.clearValidators('closedDate');
      this.closedDateCtrl = false;
      this.projectEndDateCtrl = true;
      //this.addValidator('projectEndDate');
      this.clearValidators('SFDCClient');
      this.SFDCClientCtrl = false;
      this.onsiteHiringManagerCtrl = true;

      this.clearValidators('conversionFor');
      this.conversionForCtrl = false;
      this.clearValidators('replacementFor');
      this.replacementForCtrl = false;

      this.clearValidators('replacementReason');
      this.replacementReasonCtrl = false;

      this.isSpecialBidTypeAndProjectDateVisi = true;
      this.clearValidators('bidTypeDropdown');
      this.bidTypeDropDownCtrl = false;
      this.bidTypeCtrl = true;
      this.clearValidators('employeeEmail');
      // this.clearValidators('conversionRemarks');
      this.isConversion = false;
      this.isReplacement = false;

      this.isDisabledFieldsForC2h = false;
      this.isProjectVisible = true;
    }

    /***
   * Proactive Requirement
   */
    else if (e.value === 5) {
      if (this.employeeUnitCont?.value == 1) {
        this.exclusiveInfogainCtrl = true;
        // this.addValidator('exclusiveInfogain');
        //  this.getControl('exclusiveInfogain').patchValue('N');
      }
      this.showHideHMforApproveNewAddition = false;
      this.isOffshoreHMpipelineVisibl = true;
      this.getLoginName = this.user.FullName;
      this.clearValidators('approvedBy');
      this.isApprovedByVisible = false;
      this.clearValidators('isResourceAvailInBu');
      this.isResourceAvailInBu = false;
      this.clearValidators('projectNameId');
      this.projectNameIdCtrl = false;
      this.clearValidators('role');
      this.roleCtrl = false;
      //this.clearValidators('opportunityType');
      this.opportunityTypeCtrl = false;

      //this.clearValidators('divisionId');
      //this.divisionIdCtrl = false;
      this.clearValidators('opportunityId');
      this.opportunityIdCtrl = false;
      // this.clearValidators('isfdcId');
      this.isfdcIdCtrl = false;
      // this.clearValidators('oddsOfWinningPercent');
      this.oddsOfWinningPercentCtrl = false;
      // this.clearValidators('bookingDgmPercent');
      this.bookingDgmPercentCtrl = false;
      //this.clearValidators('closedDate');
      this.closedDateCtrl = false;
      // this.clearValidators('projectEndDate');
      this.projectEndDateCtrl = false;
      this.clearValidators('SFDCClient');
      this.SFDCClientCtrl = false;
      this.onsiteHiringManagerCtrl = false;

      this.clearValidators('conversionFor');
      this.conversionForCtrl = false;
      this.clearValidators('replacementFor');
      this.replacementForCtrl = false;
      this.clearValidators('replacementReason');
      this.replacementReasonCtrl = false;
      this.replacementReasonSc = false;

      this.isSpecialBidTypeAndProjectDateVisi = true;
      this.bidTypeDropDownCtrl = true;
      this.addValidator('bidTypeDropdown');
      this.bidTypeCtrl = false;

      this.replacementReasonSc = false;
      this.replacementReasonCtrl = false;
      this.clearValidators('replacementReason');
      this.conversionForCtrl = false;
      this.clearValidators('employeeEmail');
      //this.clearValidators('conversionRemarks');
      this.isConversion = false;
      this.isReplacement = false;
      /**for proactive no billable */
      this.getControl('Billable').patchValue('N');

      this.clearValidators('BillingType');
      this.clearValidators('expectedMargin');
      this.clearValidators('billableRates');
      this.clearValidators('BillableHours');

      this.clearValidators('plannedBillingStartDate');

      this.resetControl('BillingType');
      this.resetControl('expectedMargin');
      this.resetControl('billableRates');
      this.resetControl('BillableHours');
      this.resetControl('plannedBillingStartDate');
      this.getControl('Billable').disable();
      this.isBillableYes = false;
      this.isBillingDateVisib = false;

      this.isDisabledFieldsForC2h = false;
      this.isProjectVisible = false;
    }
    /**C2H Conversion */
    else if (e.value === 6) {
      if (this.employeeUnitCont?.value == 1) {
        this.exclusiveInfogainCtrl = true;
        //this.addValidator('exclusiveInfogain');
        //  this.getControl('exclusiveInfogain').patchValue('N');
      }
      this.clearValidators('approvedBy');
      this.isApprovedByVisible = false;
      this.isResourceAvailInBu = true;
      this.addValidator('isResourceAvailInBu');
      this.replacementReasonSc = true;
      this.showHideHMforApproveNewAddition = true;
      //  this.divisionIdCtrl = true;
      // this.addValidator('divisionId');
      //
      this.projectNameIdCtrl = true;
      this.addValidator('projectNameId');
      this.clearValidators('SFDCClient');
      this.SFDCClientCtrl = false;
      this.clearValidators('opportunityId');
      this.opportunityIdCtrl = false;
      this.clearValidators('role');
      this.isOffshoreHMpipelineVisibl = false;
      this.roleCtrl = false;
      this.isfdcIdCtrl = false;
      this.opportunityTypeCtrl = false;
      this.oddsOfWinningPercentCtrl = false;
      this.bookingDgmPercentCtrl = false;
      this.closedDateCtrl = false;
      // this.roleCtrl = true;
      // this.addValidator('role');
      this.onsiteHiringManagerCtrl = true;
      this.projectEndDateCtrl = true;

      this.conversionForCtrl = true;
      this.addValidator('conversionFor');
      this.clearValidators('replacementFor');
      this.replacementForCtrl = false;
      this.clearValidators('replacementReason');
      this.replacementReasonCtrl = false;
      this.isSpecialBidTypeAndProjectDateVisi = true;
      this.clearValidators('bidTypeDropdown');
      this.bidTypeDropDownCtrl = false;
      this.bidTypeCtrl = true;
      this.isConversion = true;
      // this.addValidator('employeeEmail');
      this.getControl('employeeEmail').addValidators([Validators.required, Validators.pattern(COMMON_CONST.emailregex)]);
      this.getControl('employeeEmail').updateValueAndValidity();
      // this.addValidator('conversionRemarks');
      this.isReplacement = false;

      this.c2hTypeMethod(this.getControl('requirementType').value, []);
      this.getControl('Billable').patchValue('Y');
      let data = {};
      data['value'] = 'Y'
      this.billableHideShow(data);
      this.clearValidators('isClientInterviewRequired');
      this.resetControl('isClientInterviewRequired');
      this.isClientIntReqCtrl = false;
      this.isProjectVisible = true;
    }
    else {
      this.clearValidators('employeeEmail');
      // this.clearValidators('conversionRemarks');
      this.isDisabledFieldsForC2h = false;
    }
    // else if (e.value === 'R') {
    //   // this.clearValidators('replacementReason');
    //   this.replacementReasonSc = true;
    //   this.replacementReasonCtrl = true;
    //   this.conversionForCtrl = true;
    //   this.addValidator('replacementReason');
    //   this.conversionForCtrl = true;
    //   this.addValidator('conversionFor');
    // }
    // else if (e.value === 'N') {
    //   this.replacementReasonSc = false;
    //   this.replacementReasonCtrl = false;
    //   this.clearValidators('replacementReason');
    //   this.conversionForCtrl = false;
    //   this.clearValidators('conversionFor');
    //   this.conversionForCtrl = false;
    // }

    this.hideShowRole();
    //this.getControl('exclusiveInfogain').patchValue('N');
    //this.getControl('Billable').patchValue('N');
    this.getControl('accountId').reset();

    setTimeout(() => {
      if (this.data?.type == 'C') {
        this.getControl('accountId').reset();
      }
    }, 1000);

  }


  /**to set defult value and non editable for c2h conversion requrement type */
  public isC2hConversion: boolean = false;
  c2hTypeMethod(id: number, conversionEmployee: any) {

    if (id == 6) {
      this.labelInterviewBiling = 'Billing Details'
      // let internal = {};
      // internal['value'] = this.getControl('isResourceAvailInBu').value
      // this.geResourceAvailableFields(internal);
      this.isC2hConversion = true;
      this.getControl('isResourceAvailInBu').patchValue('N');

      //  if (this.data?.type == 'N' ) {
      this.getControl('accountId').patchValue(this.C2hEmployeeAccountDetails?.account_id ? parseInt(this.C2hEmployeeAccountDetails?.account_id) : null);
      this.getControl('projectNameId').patchValue(this.C2hEmployeeAccountDetails?.project_id ? this.C2hEmployeeAccountDetails?.project_id : null)
      //this.getControl('exclusiveInfogain').patchValue('N');
      this.projData['ProjectEndDate'] = this.C2hEmployeeAccountDetails?.projectenddate;
      this.projData['ProjectType'] = this.C2hEmployeeAccountDetails?.bidtype;
      this.projData['PROJECT_TYPE_ID'] = this.C2hEmployeeAccountDetails?.bidtypeid;
      this.getControl('employmentType').patchValue(1);
      this.projData['OffshorePM'] = this.C2hEmployeeAccountDetails?.offshorepm;
      this.projData['OnsitePM'] = this.C2hEmployeeAccountDetails?.onsitepm;
      this.replacementDesignationData['EmpContractEndDate'] = this.C2hEmployeeAccountDetails?.EmpContractEndDate;
      this.getControl('employeeEmail').patchValue(this.C2hEmployeeTalentCubeDetails?.EmployeeMailID ? this.C2hEmployeeTalentCubeDetails?.EmployeeMailID : null);
      this.getControl('plannedBillingStartDate').patchValue(this.C2hEmployeeAccountDetails?.contractEndDate ? this.C2hEmployeeAccountDetails?.contractEndDate : null);
      this.getControl('plannedOnBoardingDate').patchValue(this.C2hEmployeeAccountDetails?.contractEndDate ? this.C2hEmployeeAccountDetails?.contractEndDate : null);
      // this.getControl('talentCubeId').patchValue(this.C2hEmployeeTalentCubeDetails?.cubecodeid ? parseInt(this.C2hEmployeeTalentCubeDetails?.cubecodeid) : null);
      // this.getControl('cubeRoleId').patchValue(this.C2hEmployeeTalentCubeDetails?.RoleId ? parseInt(this.C2hEmployeeTalentCubeDetails?.RoleId) : null);
      // this.filterCubeRole['gradeName'] = this.C2hEmployeeTalentCubeDetails?.grade_name;
      // this.filterCubeRole['cubeGradeId'] = this.C2hEmployeeTalentCubeDetails?.GRADE_ID;
      //    this.getControl('cubeGradeId').patchValue(this.C2hEmployeeTalentCubeDetails?.GRADE_ID ? this.C2hEmployeeTalentCubeDetails?.GRADE_ID : null);
      //  this.filterCubeRole['PracticeName'] = this.C2hEmployeeTalentCubeDetails?.practicename;

      // this.getControl('ExperienceId').patchValue(this.C2hEmployeeTalentCubeDetails?.ExperienceID ? this.C2hEmployeeTalentCubeDetails?.ExperienceID : null)
      // this.getControl('cubeRoleId').patchValue(this.C2hEmployeeTalentCubeDetails?.RoleId ? this.C2hEmployeeTalentCubeDetails?.RoleId :null)

      this.resetControl('Interviewer1Tech');
      this.resetControl('tech1InterviewBy');
      this.resetControl('Interviewer2');
      this.resetControl('Interviewer3');
      this.clearValidators('Interviewer1Tech');
      this.clearValidators('tech1InterviewBy');
      this.interviewer1Ctrl = false;
      this.tech1interviewBy = false;
     // this.clearValidators('Interviewer2');
      this.interviewer2Ctrl = false;
     // this.clearValidators('Interviewer3');
      this.interviewer3Ctrl = false;

      this.resetControl('jobSummary');
      this.resetControl('jobDescription');
      this.clearValidators('jobSummary');
      this.clearValidators('jobDescription');

      this.isJobDescriAndJobVisible = false;
      //  }
      this.disableFieldsForC2H();

    } else {
      this.isC2hConversion = false;
    }
  }
  /**disable field for c2h */
  public isDisabledFieldsForC2h: boolean = false;
  disableFieldsForC2H() {
    this.getControl('isResourceAvailInBu').disable();
    this.isResourceAvailInBu = false;
    // this.getControl('accountId').disable();
    // this.getControl('projectNameId').disable();
    // this.getControl('exclusiveInfogain').disable();
    // this.getControl('employmentType').disable();
    this.isDisabledFieldsForC2h = true;
  }
  /**get c2h conversion employee details api */
  public C2hEmployeeAccountDetails: any = [];
  public C2hEmployeeTalentCubeDetails: any = [];
  getConversionEmployeDetails(empId: string) {
    this._talentServ.GetAllDetailsOfContractualEmployee(empId).subscribe(
      res => {
        this.C2hEmployeeAccountDetails = res['AccountDetails'][0];
        this.C2hEmployeeTalentCubeDetails = res['TalentCubeDetails'][0];
        this.getProjectsList(this.C2hEmployeeAccountDetails?.account_id);

        // if (this.C2hEmployeeTalentCubeDetails?.cubecodeid) {
        //   this.getRoleAndSkillByTalentCube(this.C2hEmployeeTalentCubeDetails?.cubecodeid);

        // }
        // if (this.C2hEmployeeTalentCubeDetails?.GRADE_ID) {
        //   this.GetExperienceByGradeID(this.C2hEmployeeTalentCubeDetails?.GRADE_ID ? this.C2hEmployeeTalentCubeDetails?.GRADE_ID : null);
        // }

        setTimeout(() => {
          this.c2hTypeMethod(this.getControl('requirementType').value, []);
        }, 1000);
      }
    )
  }
  /**get du id */
  public getDuId: number;
  getDuID(data: any) {
    this.getDuId = data.value;
    /**if emp unit support we are sending hard coded requrement id for account list  */
    this.requirementTypeID = this.employeeUnitCont.value === 1 ? this.requirementTypeID : 2;
    this.getAccountList(this.getReqTypeIdByEmpUnit(), this.getDuId, this.employeeUnitCont.value);
    this.getControl('accountId').reset();
    this.getControl('opportunityId').reset();
    this.opportunityData = [];
    this.opportunitiyList = [];
    this.projectList = [];
  }
  /**getting project data onchange offshore onshore etc */
  public projData: any = [];
  /**anayt  */
  getProject(data: any) {
    let projFilteredData = this.projectList.filter(x => x.ProjectID === data.value);
    this.projData = projFilteredData[0];
    // this.opportunityData['ProjEndDate'] = this.projData?.ProjectEndDate;
    this.opportunityData
    this.opportunityData['ProjEndDateNew'] = this.projData?.ProjectEndDate;
  }


  /**getting accountid */
  public filteredAccountList: any = [];
  public filteredSfdcAccount: string;
  getAccountId(data: any) {
    const accountId = data.value;
    this.getControl('opportunityId').reset();
    this.getControl('projectNameId').reset();
    this.getControl('SFDCClient').reset();
    /**filtering data for accoutnt  sfdc */
    this.filteredAccountList = this.accountList.filter(x => x.AccountID === data.value);
    this.filteredSfdcAccount = this.filteredAccountList[0]?.SFDCAccountID;
    // this.getControl('DateOfJoining').setValue(this.filteredEmpList[0].EMP_DATEOFJOINING || '');
    this.getProjectsList(accountId);
    this.getOpportunityList(this.filteredSfdcAccount, this.requirementTypeID);
    this.getSfdcClientList(this.filteredSfdcAccount);
    this.opportunityData = [];
    if (this.employeeUnitCont?.value == 1 && this.getControl('requirementType')?.value == 2) {
      if (accountId == 427 || accountId == 1277 || accountId == 405 || accountId == 399 || accountId == 1405) {
        this.hideSFDCFields();
      } else {
        // if(this.getControl('employeeUnitCont')?.value == 1){
        this.showSFDCFields();
        // }
      }
    }

  }

  hideSFDCFields() {
    this.opportunityTypeCtrl = false;
    this.clearValidators('opportunityId');
    this.resetControl('opportunityId');
    this.opportunityIdCtrl = false;
    this.isfdcIdCtrl = false;
    this.oddsOfWinningPercentCtrl = false;
    this.bookingDgmPercentCtrl = false;
    this.closedDateCtrl = false;
    this.projectEndDateCtrl = false;
    this.roleCtrl = false;
    this.clearValidators('role');
    this.resetControl('role');
    this.clearValidators('SFDCClient');
    this.resetControl('SFDCClient');
    this.SFDCClientCtrl = false;
    this.bidTypeCtrl = false;
    this.isSpecialBidTypeAndProjectDateVisi = false;
    // if(this.getControl('requirementType')?.value == 2){
    this.exclusiveInfogainCtrl = false;
    this.clearValidators('exclusiveInfogain');
    this.resetControl('exclusiveInfogain');
    // }
  }

  showSFDCFields() {
    this.opportunityTypeCtrl = true;
    this.addValidator('opportunityId');
    this.resetControl('opportunityId');
    this.opportunityIdCtrl = true;
    this.isfdcIdCtrl = true;
    this.oddsOfWinningPercentCtrl = true;
    this.bookingDgmPercentCtrl = true;
    this.closedDateCtrl = true;
    this.projectEndDateCtrl = true;
    let joiningLoc = this.getControl('joiningLocation')?.value;
    if (joiningLoc == 1 || joiningLoc == 4 || joiningLoc == 11 || joiningLoc == 16 || joiningLoc == 10
      || joiningLoc == 5 || joiningLoc == 2) {
      this.roleCtrl = true;
      this.addValidator('role');
    }
    this.addValidator('SFDCClient');
    this.SFDCClientCtrl = true;
    this.bidTypeCtrl = true;
    this.isSpecialBidTypeAndProjectDateVisi = true;
    // if(this.getControl('requirementType')?.value != 2){
    this.exclusiveInfogainCtrl = true;
    //    this.addValidator('exclusiveInfogain');
    // this.resetControl('exclusiveInfogain');
    //  this.getControl('exclusiveInfogain').patchValue('N');
    // }
  }

  /**for opportunity data */
  public opportunityData: any = [];
  getOpportunity(data: any) {
    this.filteredOpportunityList = this.opportunitiyList.filter(x => x.OppID === data.value);
    this.opportunityData = this.filteredOpportunityList[0];
    this.getControl('role').reset();
    this.GetTeamDetailsFromPricing(this.opportunityData?.OppID);
  }

  /**get role id */
  public rolePricingData: any = [];
  getRoleId(data: any) {
    let filteredRoleData = this.roleFromPriceingList.filter(x => x.RoleID === data.value);
    this.rolePricingData = filteredRoleData[0];

  }
  /**designation categories id on change  */
  getDesigCategoriesId(data: any) {
    this.GetDesignations(data?.value);
    // this.resetControl('primarySkill');
  }

  /**designation list and data */
  public desigData: any = [];
  getDesignationId(data: any) {
    let FilteredData = this.designationList.filter(x => x.DesigID === data.value);
    this.desigData = FilteredData[0];
    this.primarySkillsList = [];
    this.salaryDetails = [];
    // this.resetControl('primarySkill');
    this._talentServ.GetPrimarySkills().subscribe(
      res => {
        this.primarySkillsList = res['data']
        this.getControl('primarySkill').patchValue(null);
      }
    )
  }

  /**get Primary Skill Id */
  public priSkillData: any = [];
  public gradeSalCtrl: boolean = false;
  getPriSkillId(data: any) {
    let projFilteredData = this.primarySkillsList.filter(x => x.skillid === data.value);
    this.priSkillData = projFilteredData[0];
    this.GetSubSkills(data.value);
    this.getTalentCubeById();
    this.resetControl('subSkills');
    /**if job family exists then call api for data */
    if (this.priSkillData?.JFID != null && this.desigData?.ExpRangeID != null) {
      this.GetSalaryDetails(this.desigData?.ExpRangeID, this.priSkillData?.JFID);
      this.gradeSalCtrl = true;
    } else {
      this.gradeSalCtrl = false;
    }
    /**reseting on change of skill */
    this.SubSkillsList = [];
    this.subSkillFilterData = [];
  }

  /** getting subskill list and filtering data on change */
  public subSkillFilterData: any = [];
  getSubSkillId(data: any) {
    let FilteredData = this.SubSkillsList.filter(x => x.skillid === data.value);
    this.subSkillFilterData = FilteredData[0];
    this.getTalentCubeById();
  }

  public additionSkill: any = [];
  getAdditionSkillId(data: any) {
    this.additionSkill = data;
    this.getTalentCubeById();

  }

  getCubeSkill4Id(data: any) {
    // this.additionSkill = data;
  }

  /**conersion candidate description */
  public replacementDesignationData: any = []
  //public conversionEmpDetails: any = [];

  getConersionCandidateData(data: any) {
    let selectedEmpData = this.conversionEmpList.filter(x => x.empid === data.value);
    this.replacementDesignationData = selectedEmpData[0];
    let conversionEmpDetails = selectedEmpData[0];

    this.clearValidators('jobDescription');
    this.getConversionEmployeDetails(conversionEmpDetails?.empnewid);
    // this.c2hTypeMethod(this.getControl('requirementType').value, conversionEmpDetails);
  }

  /**get tech 1 interview data onchange */

  getTech1Data(data: any) {
    this.showHideTech1InterviewBy(data);
    this.GetReasonForNotOptOnlineExternalAssessment(data.value)
  }

  /**get internal panel  data onchange */
  gettechInternalPanelData(data: any) {

  }

  /**show hide tech 1 interview by fields method */
  public isTechRoundAssesment: boolean = false;
  public isAssesmentLink: boolean = false;
  public isTechRoundInternalPanel: boolean = false;
  public isTechRoundExternalPanel: boolean = false;
  public isCoderByteAssesments: boolean = false;
  showHideTech1InterviewBy(data: any) {
    this.resetControl('techInternalPanel');
    this.resetControl('techExternalPanel');
    // this.resetControl('AcccesmentLink');
    this.resetControl('onlineAssesment');
    this.resetControl('coderBytesAssesments');
    this.clearValidators('coderBytesAssesments');
    this.isCoderByteAssesments = false;

    this.resetControl('AcccesmentLink');
    this.clearValidators('AcccesmentLink')
    this.isAssesmentLink = false;
    /** O for Online assesment */
    if (data.value == 1) {
      this.isTechRoundAssesment = true;
      //  this.addValidator('AcccesmentLink');
      this.addValidator('onlineAssesment');
      this.clearValidators('techInternalPanel');
      this.isTechRoundInternalPanel = false;

      this.clearValidators('techExternalPanel');
      this.isTechRoundExternalPanel = false;
    }
    /** I for Internal pannel */
    else if (data.value == 2) {
      // this.clearValidators('AcccesmentLink');
      this.clearValidators('onlineAssesment');
      this.isTechRoundAssesment = false;
      this.isTechRoundInternalPanel = true;
      this.addValidator('techInternalPanel');
      this.clearValidators('techExternalPanel');
      this.isTechRoundExternalPanel = false;
    }
    /**E for external - and showing both reason dropdown here */
    else if (data?.value == 3) {
      //this.clearValidators('AcccesmentLink');
      this.clearValidators('onlineAssesment');
      this.isTechRoundAssesment = false;
      // this.isTechRoundInternalPanel = true;
      // this.addValidator('techInternalPanel');
      this.clearValidators('techInternalPanel');
      this.isTechRoundInternalPanel = false;

      this.isTechRoundExternalPanel = true;
      this.addValidator('techExternalPanel');
    } else {

    }
  }
  /**getting assesment by id o change */
  getAssessmentById(e: any) {
    this.showHideOnlineAssesment(e);
  }

  showHideOnlineAssesment(e: any) {
    this.resetControl('AcccesmentLink');
    this.resetControl('coderBytesAssesments');
    if (e.value == 1) {
      this.isCoderByteAssesments = true;
      this.addValidator('coderBytesAssesments');
      this.clearValidators('AcccesmentLink')
      this.isAssesmentLink = false;
    } else {
      this.isAssesmentLink = true;
      this.addValidator('AcccesmentLink');
      this.isCoderByteAssesments = false;
      this.clearValidators('coderBytesAssesments')

    }
  }


  /**getting coderByte assessment on change */
  public selectedCoderByteAssessment: any = [];
  getCoderByteAssesmentID(data: any) {

    let currentAssesment = this.coderByteAssessmentList?.filter(x => x.test_id === data.value);
    this.selectedCoderByteAssessment = currentAssesment[0];
  }
  /**replacement candidate description */
  public replacementEmpGradeLevel: any = [];
  getDataReplacement(data: any) {
    let selectedEmpData = this.resignEmployeeListForReplacement.filter(x => x.empnewid === data.value);
    this.replacementDesignationData = selectedEmpData[0];
    this.replacementEmpGradeLevel = selectedEmpData[0].GradeLevel;
    if(this.replacementReasonId == 13){
     this.checkReplacementRorationIdCreated(data.value);
    }
    else{
      this.checkReplacementIdCreated(data.value);
    }
    
  }

  /***
   * get data on change of employee id
   */

  checkReplacementIdCreated(empId: string) {
    this._talentServ.CheckReplacementIdCreated(empId).subscribe(
      res => {

        let data = res['data'][0];
        if (data?.IsExist == 1) {
          this.getControl('replacementFor').reset();
          this._share.showAlertErrorMessage.next(data?.Msg);
        }
      }
    )
  }

   /***
   * get data on change of employee id
   */

  checkReplacementRorationIdCreated(empId: string) {
    this._talentServ.CheckReplacementRotationIdCreated(empId).subscribe(
      res => {

        let data = res['data'][0];
        if (data?.IsExist == 1) {
          this.getControl('replacementFor').reset();
          this._share.showAlertErrorMessage.next(data?.Msg);
        }
      }
    )
  }
  public isLoadedIntEmp: boolean = true;
  getEmpListLoaded(e: any) {
    if (e) {
      if (this.data?.type == 'U' ||
        this.data?.type == 'JD' ||
        this.data?.type == 'C' ||
        this.data?.type == 'A' ||
        this.data?.type == 'E' ||
        this.data?.type == 'UW'
      ) {
        if (this.isLoadedIntEmp) {
          setTimeout(() => {
          /**for multi interviwers patching - filtering with interview  type */
        const interviewer1Ids = this.interviewersListOfThId.filter(x => x.IntType === 1).map(x => x.EmpId);
        const interviewer2Ids = this.interviewersListOfThId.filter(x => x.IntType === 2).map(x => x.EmpId);
        const interviewer3Ids = this.interviewersListOfThId.filter(x => x.IntType === 3).map(x => x.EmpId);
            // this.getControl('Interviewer1Tech').patchValue(this.talentDetails?.Interviewer1ID ? this.talentDetails?.Interviewer1ID : null);
            // this.getControl('Interviewer2').patchValue(this.talentDetails?.Interviewer2ID ? this.talentDetails?.Interviewer2ID : null);
            // this.getControl('Interviewer3').patchValue(this.talentDetails?.Interviewer3ID ? this.talentDetails?.Interviewer3ID : null);
            this.getControl('Interviewer1Tech').patchValue(interviewer1Ids.length ? interviewer1Ids : null);
            this.getControl('Interviewer2').patchValue(interviewer2Ids.length ? interviewer2Ids : null);
            this.getControl('Interviewer3').patchValue(interviewer3Ids.length ? interviewer3Ids : null);
            this.isLoadedIntEmp = false;
          }, 1000);

        }
        this.isLoadedIntEmp = false;

      }

    }

  }
  /**get interviewer  data on change */
  getDataInt(data: any[], type: number) {
    // Extract emp IDs from selection (multi-select array of objects)
    let empNewIds = (data || []).map(d => d.empnewid);
    if (!empNewIds.length) return;
    // Dropdown control mapping
    const interviewerControls = {
      1: 'Interviewer1Tech',
      2: 'Interviewer2',
      3: 'Interviewer3'
    };
    //  alert msg labels
    const interviewerLabels = {
      'Interviewer1Tech': 'Interviewer 1 ( Technical )',
      'Interviewer2': 'Interviewer 2 ( Technical )',
      'Interviewer3': 'Managerial/ Management Round Panel'
    };

    let currentControl = interviewerControls[type];
    let otherControls = Object.values(interviewerControls).filter(c => c !== currentControl);

    // Current selected interviewer IDs
    let currentValues = this.getControl(currentControl).value || [];

    // validate against every control 
    otherControls.forEach(controlName => {
      let otherValues = this.getControl(controlName).value || [];

      // if overlap
      let conflict = empNewIds.some(id => otherValues.includes(id));

      if (conflict) {
        this.removeMultipleFromMultiSelect(currentControl, empNewIds);
        this._share.showAlertErrorMessage.next(
          `${interviewerLabels[currentControl]} cannot be same as ${interviewerLabels[controlName]}`
        );
      }
    });
  }

  /** remove duplicate selection only */
  removeMultipleFromMultiSelect(controlName: string, empIds: any[]) {
    let control = this.getControl(controlName);
    let currentValues = control.value || [];

    if (Array.isArray(currentValues)) {
      // Sirf unhi IDs ko remove karo jo conflict kar rahi hain
      let updated = currentValues.filter((id: any) => !empIds.includes(id));

      // Agar koi change hua ho tabhi setValue karo
      if (updated.length !== currentValues.length) {
        control.setValue(updated);
      }
    }
  }




  /**billable val - show/hide based on billable field*/
  public isBillableYes: boolean = false;
  public isAttechmentRequired: boolean = false;
  public isBillingDateVisib: boolean = false;
  public isAttechmentRequiredAppr: boolean = false;
  getBilableVal(data: any) {
    this.resetControl('BillingType');
    this.resetControl('expectedMargin');
    this.resetControl('billableRates');
    this.resetControl('BillableHours');

    this.resetControl('plannedBillingStartDate');

    this.billableHideShow(data);
  }

  billableHideShow(data) {

    if (data?.value == 'Y') {
      this.isBillableYes = true;
      this.isAttechmentRequired = false;
      this.addValidator('BillingType');
      this.addValidator('expectedMargin');
      this.addValidator('billableRates');
      this.addValidator('BillableHours');

      //  this.getControl('billableRates').patchValue(0.0);
     // this.clearValidators('fileUpload');
      this.disablePastDateOnBoadring = this.getControl('plannedOnBoardingDate').value;
      /**if requirement type is pipeline - we are removing billing start date in case of bilable yes */
      if (this.requirementTypeID == 5) {
        this.isBillingDateVisib = false;
        this.clearValidators('plannedBillingStartDate');
      } else {
        this.isBillingDateVisib = true;
        //  this.addValidator('plannedBillingStartDate');
        if (!this.isUpdateMode) {
          this.addValidator('plannedBillingStartDate');
        }
      }

      if (this.requirementTypeID == 6) {
        this.getControl('plannedBillingStartDate').patchValue(this.C2hEmployeeAccountDetails?.contractEndDate);
      }
    } else {
      this.clearValidators('BillingType');
      this.clearValidators('expectedMargin');
      this.clearValidators('billableRates');
      this.clearValidators('BillableHours');

      this.clearValidators('plannedBillingStartDate');
      this.isBillableYes = false;
      this.isBillingDateVisib = false;
      /**file upload optional in case of U update and A approve */
      if (this.data?.type == 'U' || this.data?.type == 'UW' || this.data?.type == 'A' || this.data?.type == 'C' || this.data?.type == 'JD' || this.data?.type == 'E') {
      //  this.clearValidators('fileUpload');
      } else {
        this.isAttechmentRequired = true;
      //  this.addValidator('fileUpload');
      }
    }
  }

  /***
* change date
*/
  changeDate(type: string, event: any) {
    // this.toDate?.reset();
    //this.getControl('plannedBillingStartDate').reset();
    this.resetControl('plannedBillingStartDate');
    //this.getControl('plannedBillingStartDate').enable();
    // this.toDate?.enable();
    let date = new Date(event.value);
    // date.setDate(date.getDate()+1);
    this.minDatebilling = new Date(event.value);
  }

  /**method for add validators */
  addValidator(name: string) {
    let ctrl = this.getControl(name);
    //  ctrl.setValidators([Validators.required]);
    ctrl.setValidators([Validators.required]);
    ctrl.updateValueAndValidity();
  }



  /**method for clear validators */
  clearValidators(name: string) {
    let ctrl = this.getControl(name);
    ctrl?.clearValidators();
    ctrl?.updateValueAndValidity();
  }
  /**method for clear validators */
  clearValidatorsAndValue(name: string) {
    let ctrl = this.getControl(name);
    ctrl.reset();
    ctrl.clearValidators();
    ctrl.updateValueAndValidity();
  }
  /**method for add min and max length validators */
  minLengthMaxLengthValidator(name: string, type?: string, min: number = 0, max: number = 0) {
    let ctrl = this.getControl(name);
    if (type == 'min') {
      ctrl.setValidators([Validators.required, Validators.minLength(min)]);
    }
    ctrl.updateValueAndValidity();
  }

  /**method for reset value */
  resetControl(name: string) {
    let ctrl = this.getControl(name);
    ctrl?.reset();
  }

  /**to prevent greater than 100 - expected margin */
  keyUp(event) {
    if (event.target.value > 100 || event.target.value < 1) {
      let length = event.target.value.length;
      event.target.value = event.target.value.slice(0, length - 1);
      this.getControl('expectedMargin').reset();
      return false;
    }
  }

  /**zero is prevent for bill rates */
  keyUpBillRate(event) {
    if (event.target.value < 1) {
      this.getControl('billableRates').reset();
      return false;
    }
  }

  /** clone no of talent  */
  keyUpNoOfTalent(event) {
    if (event?.target?.value < 1) {
      this.getControl('Frequency').reset();
      return false;
    }
  }



  get fileUploadCtrl() { return this.submitJobCreateForm.get('fileUpload'); }
  /***
     * Doc upload  
     */
  public fileAttechment: any = '';
  fileUp(event) {
    this.fileAttechment = '';
    let allowedExtensions = /(\.jpg|\.jpeg|\.png|\.txt|\.pdf|\.doc|\.docx|\.rtf|\.msg|\.xlsx)$/i;
    let files = event.target.files[0];

    let fileName = files.name;
    if (!allowedExtensions.exec(fileName)) {
      this._share.showAlertErrorMessage.next(fileName + 'is not  valid document type. Please upload file type  jpeg/jpg/png/txt/pdf/doc/docx/rtf/msg/xlsx only.');
      event.target.value = "";
      this.fileAttechment = '';
      return false;
    }
    else if (files.size > FILE_UPLOAD.FILE_SIZE) {
      this._share.showAlertErrorMessage.next('Image  uploaded cannot be greater than 15MB.');
      event.target.value = "";
      this.fileAttechment = '';
      return false;

    }
    else {
      this.fileAttechment = files;
    }
  }

  /***
     * Doc upload  
     */
  public fileAttechmentAppr: any = '';
  fileUpApprovalAttachement(event) {
    this.fileAttechmentAppr = '';
    let allowedExtensions = /(\.jpg|\.jpeg|\.png|\.txt|\.pdf|\.doc|\.docx|\.rtf|\.msg|\.xlsx)$/i;
    let files = event.target.files[0];

    let fileName = files.name;
    if (!allowedExtensions.exec(fileName)) {
      this._share.showAlertErrorMessage.next(fileName + 'is not  valid document type. Please upload file type  jpeg/jpg/png/txt/pdf/doc/docx/rtf/msg/xlsx only.');
      event.target.value = "";
      this.fileAttechmentAppr = '';
      return false;
    }
    else if (files.size > FILE_UPLOAD.FILE_SIZE) {
      this._share.showAlertErrorMessage.next('File cannot be greater than 15MB.');
      event.target.value = "";
      this.fileAttechmentAppr = '';
      return false;

    }
    else {
      this.fileAttechmentAppr = files;
    }
  }

  /* submit form */
  submitFormHandler(form: any) {
    debugger
    // let formData = form.value;
    // this.submitJobCreateForm.markAsTouched();
    form.markAllAsTouched();
    let pOnbDate = new Date(this.getControl('plannedOnBoardingDate')?.value);
    if (this.getControl('plannedOnBoardingDate')?.value && !this.isRejectTalent) {
      this.addValidator('plannedOnBoardingDate');
      let today = new Date();
      // if ( (pOnbDate < today)  && !this.isUpdateMode) {
      //   this.getControl('plannedOnBoardingDate').setErrors({ 'invalid': true })
      // }
    }
    this.JobSecHtml;
    debugger
    if (form.valid) {
      /**condtion to be added for max salary and grade */
      // if (this.salaryDetails?.MAX_SALARY && this.salaryDetails?.GRADE_LEVEL) {

      let formData = form.value;
      /**converting grade string in intger removing string */
      let gradeBySkill = this.salaryDetails?.GLevel;
      let gradeByRole = this.rolePricingData?.GradeLevel;
      /**for other case  */
      let formDataDs = form.getRawValue();

      // get Value from All tc skill Control
      let controls = [formDataDs.cubeSkill1, formDataDs.cubeSkill2, formDataDs.cubeSkill3];

      // Check if at least one control is filled 
      let isAnyControlFilled = controls.some(control => control && control.length > 0);

      if (!isAnyControlFilled && this.isTalentCube) {
        // Show an error message or handle the error
        this._share.showAlertErrorMessage.next(' Please ensure you select at least one skill from Additional Skill 1 or  Additional Skill 2 or Additional Skill 3.');
        return false
      }

      //  IF Talent cube available against any TC
      else if (this.TalentCubeListBySkill.length >= 1 && formData?.talentCubeId == 0) {
        this.previewConfirmFunc(this.TalentCubeListBySkill);
      }

      else if (formData.role == 9999) {
        formData['msg'] = 'Resource count level deviation from RLS!';
        this.confirmAlertSubmit(formData);
      }

      else if (this.rolePricingData?.GradeLevel == '' || this.rolePricingData?.GradeLevel == null) {
        this.validationCheckBeforeSubmit(formData);
      }
      /**if gradeRole is less than gradeSkill case  */
      else if (gradeByRole < gradeBySkill) {
        formData['msg'] = 'Grade level deviation from RLS!';
        this.confirmAlertSubmit(formData);
      }
      // else if(gradeByRole < gradeBySkill){
      //   formData['msg'] = 'Grade level deviation from RLS!';
      //  this.confirmAlertSubmit(formData);
      // }
      else {
        if (this.data?.type == 'A' && formData?.approveRejectstatus == 'R') {
          this.submitFormTalentToServer(formData);
        } else {
          this.validationCheckBeforeSubmit(formData);
        }
      }


      // }
      // else {
      //   this._share.showAlertErrorMessage.next('Cannot process this request without grade and salary.');
      // }

    } else {
      if (this.getControl('cubeGradeId').invalid) {
        this._share.showAlertErrorMessage.next('Grade not found.');
      }
      else {
        this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
      }
    }
  }

  /***
   * check for talent tc skill
   */
  validationCheckBeforeSubmit(formData: any) {
    debugger
    // && this.data?.type != 'A' && this.talentDetails?.MandatorySkillsId

    if ((this.data?.type == 'N' ||
      this.data?.type == 'C' ||
      this.data?.type == 'JD' ||
      this.data?.type == 'E' ||
      this.data?.type == 'U' ||
      this.data?.type == 'UW' ||
      (this.data?.type == 'A' && formData?.approveRejectstatus == 'A' && this.talentDetails?.MandatorySkillsId)
    )) {
      let formDataDs = this.submitJobCreateForm.getRawValue();
      let selectedSkills = [formDataDs?.cubeSkill1, formDataDs?.cubeSkill2, formDataDs?.cubeSkill3, formDataDs?.cubeSkill4, formDataDs?.additionalSkills];
      if (!this.isTalentCube) {
        selectedSkills.push(formDataDs?.subSkills);
      }
      // let isNoControlNull = selectedSkills.every(control => control !== null);
      // let mergedSelectedSkills: any = [];
      // if (isNoControlNull) {
      //   // Merge all control arrays into one
      //    mergedSelectedSkills = [].concat(...selectedSkills);
      //   console.log(mergedSelectedSkills);
      // }

      // this.previewConfirmFunc(this.TalentCubeListBySkill);
      ;

      let element = {};
      let mandateSkill = this.MandatorySkills;
      let goodToHaveSkill = this.GoodToHaveSkills;
      element['title'] = "Mandatory skills selection";
      element['mergedCubeSkills'] = this.mergedCubeSkills;
      element['mergedSelectedSkills'] = selectedSkills;
      element['mandateSkill'] = this.MandatorySkills.length != 0 ? this.MandatorySkills : [];
      element['goodToHaveSkill'] = this.GoodToHaveSkills.length != 0 ? this.GoodToHaveSkills : [];
      element['data'] = this.data;
      element['formDataDs'] = formDataDs;
      debugger
      const dialogRef = this.dialog.open(MandateskillConfirmationComponent, {
        width: '500px',
        panelClass: ['ats-model-wrap', 'talent-mandateSkill-rating-selection'],
        data: element,
        disableClose: true
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          formData['SkillRatingType'] = result?.selectedSkillsRating;
          formData['Probability'] = result?.Probability || null;
          debugger
         // formData['goodToHaveSkill'] = result?.goodToHaveSkill;
          // formData['goodToHaveSkill'] = result?.goodToHaveSkill;
          this.submitFormTalentToServer(formData);
        }
      });
    }
    else {

      this.submitFormTalentToServer(formData);
    }
  }

  /**submit form for talent creation */
  submitFormTalentToServer(data: any) {

    let formData = new FormData();
    //formData['cid'] = this.data.cid;
    // if (formData.DateOfDecline) {
    //   formData.DateOfDecline = GlobalMethod.formatDate(formData.DateOfDecline);
    // }
    formData.append('TimeZoneIana', GlobalMethod.getTimezone());
    if (this.employeeUnitCont?.value) {
      formData.append('EmployeeUnitID', this.employeeUnitCont?.value);
    }
    if (data.joiningLocation) {
      formData.append('JoinLocID', data.joiningLocation);
    }
    if (data.joiningState) {
      formData.append('StateID', data.joiningState);
    }
    if (data.joiningCity) {
      formData.append('CityID', data.joiningCity);
    }
    if (data.clientWorkRequirement) {
      formData.append('ClientWorkRequirementId', data.clientWorkRequirement);
    }
    if (data.locationType) {
      formData.append('SubWorkRequirementId', data.locationType);
    }
    if (data.requirementType) {
      formData.append('ReqTypeID', data.requirementType);
    }
    if (data.approvedBy) {
      formData.append('InvestmentApproved', data.approvedBy);
    }
    if (data.isResourceAvailInBu) {
      formData.append('IsInternalMovement', data.isResourceAvailInBu);
    }
    /**division removed on requirement */
    // if (data.divisionId) {
    //   formData.append('DivisionID', data.divisionId);
    // }
    /**du/gdl removed for delivery requirement - only available for support */
    if (data.deliveryUnit) {
      formData.append('DUID', data.deliveryUnit);
    }

    /**not pipeline  requirment type - sending accountid */
    // if (this.requirementTypeID.toString() != '1' || this.requirementTypeID.toString() != '5') {
    //   if (data.accountId) {
    //     formData.append('AccountID', data.accountId);
    //   }
    // }
    // || this.C2hEmployeeAccountDetails.length > 0

    if (this.requirementTypeID == 2 || this.requirementTypeID == 3 || this.requirementTypeID == 4 || this.requirementTypeID == 5 || this.requirementTypeID == 6) {
      if (data.accountId) {
        formData.append('AccountID', data.accountId);
      }

    }


    if (data.projectNameId) {
      formData.append('ProjectID', data.projectNameId);
    }
    /**for c2c conversion on change of employee */
    // if (this.requirementTypeID == 6) {
    //   if (this.C2hEmployeeAccountDetails?.account_id) {
    //     formData.append('AccountID', this.C2hEmployeeAccountDetails?.account_id);
    //   }
    //   if (this.C2hEmployeeAccountDetails?.project_id) {
    //     formData.append('ProjectID', this.C2hEmployeeAccountDetails?.project_id);
    //   }
    //     formData.append('EmploymentTypeID', '1');
    //       formData.append('ExclusiveInfogain', 'N');

    // }

    /**for pipeline requirment type - sending accountid in sfdcaccount */
    // if (this.requirementTypeID.toString() == '1' || this.requirementTypeID.toString() == '5') {
    //   if (data.accountId) {
    //     formData.append('SFDCClientID', data.filteredSfdcAccountList);
    //   }
    // }
    /**|| this.requirementTypeID == 5 */
    if (this.requirementTypeID == 1) {
      if (data.accountId) {
        formData.append('SFDCClientID', data?.accountId);
        //formData.append('SFDCClientID', this.filteredSfdcAccount);
      }
    }

    /** addtion req type */
    if (this.requirementTypeID == 2) {
      if (data.SFDCClient) {
        formData.append('SFDCClientID', data.SFDCClient);
      }
    }


    if (data.opportunityId) {
      formData.append('OppID', data.opportunityId);
    }
    if (this.desigData?.ExpRangeID) {
      formData.append('ExpRangeID', this.desigData?.ExpRangeID);
    }


    /**condition for bidType and proj-end-date  delivery */
    if (this.empUnitId == 1 || this.talentDetails?.DeliveryOrFunction == 1) {
      /**if opportunity dropdown - data will get from opportunity API */
      //  
      // this.opportunityIdCtrl
      if (!this.isProjectVisible) {
        // if (this.data?.type == 'N' ) {
        if (!this.bidTypeDropDownCtrl) {
          formData.append('BidType', this.opportunityData?.BidTypeID);
        }

        /**if requirement type not equal to proactive requirement  */
        if (this.requirementTypeID != 5 && (data.accountId != 427 && data.accountId != 1277 && data.accountId != 405 && data.accountId != 399)) {
          formData.append('ProjectEndDate', GlobalMethod.formatDate(this.opportunityData?.ProjEndDate));
        }
        //  }
        // else {
        //   formData.append('BidType', this.talentDetails.BidTypeID);
        // }
      }
      /**if  opportunity dropdown not availble then getting data from project API*/
      // !this.opportunityIdCtrl isProjectVisible
      if (this.isProjectVisible) {
        /**bidType will not send for req type "New" or "Replace" in support*/
        if (this.requirementTypeID == 1 || this.requirementTypeID == 2 || this.requirementTypeID == 3 ||
          this.requirementTypeID == 4 || this.requirementTypeID == 5 || this.requirementTypeID == 6) {

          if (this.projectNameIdCtrl) {

            if (!this.bidTypeDropDownCtrl) {
              formData.append('BidType', this.projData?.PROJECT_TYPE_ID);
            }
            /**if requirement type not equal to proactive requirement  */
            if (this.requirementTypeID != 5 && (data.accountId != 427 && data.accountId != 1277 && data.accountId != 405 && data.accountId != 399)) {
              formData.append('ProjectEndDate', GlobalMethod.formatDate(this.projData?.ProjectEndDate));
            }
          }
          /**if requirement type == proactive requirement*/
          else {
            formData.append('BidType', data.bidTypeDropdown);
          }
          // } else {
          //   formData.append('BidType', this.talentDetails.BidTypeID);
          // }
        }
      }
    }
    /**when bidtype visible on screen - send dropdown bidtype  */
    if (this.bidTypeDropDownCtrl) {
      formData.append('BidType', this.getControl('bidTypeDropdown').value);
    }
    if (this.opportunityData?.OddsOfWinning) {
      formData.append('OddsOfWinning', this.opportunityData?.OddsOfWinning);
    }
    if (this.opportunityData?.CloseDate) {
      formData.append('ClosedDate', GlobalMethod.formatDate(this.opportunityData?.CloseDate));
    }

    if (this.opportunityData?.OppType) {
      formData.append('OppType', this.opportunityData?.OppType);
    }
    if (this.opportunityData?.ISFDCID) {
      formData.append('ISFDCID', this.opportunityData?.ISFDCID);
    }
    if (this.opportunityData?.BookingMargin) {
      formData.append('BookingDGM', this.opportunityData?.BookingMargin)
    }
    //
    if (data.role) {
      formData.append('PricingRoleID', data.role);
    }
    if (data.exclusiveInfogain) {
      formData.append('ExclusiveInfogain', data.exclusiveInfogain);
    }

    if (this.requirementTypeID != 6) {
      if (data.jobSummary) {
        formData.append('JobSummary', data.jobSummary);
      }
      if (data.jobDescription) {
        formData.append('JobDesc', GlobalMethod.htmlEscape(this.JobSecHtml));
      }
    }

    if (data.Designation) {
      formData.append('DesignationID', data.Designation);
    }
    if (data.qualification) {
      formData.append('QualificationID', data.qualification);
    }
    if (data.subSkills) {
      formData.append('SubSkillID', data.subSkills);
    }
    if (data.additionalSkills) {
      formData.append('AdditionalSkills', data.additionalSkills.toString());
    }
    if (data.employmentType) {
      formData.append('EmploymentTypeID', data.employmentType);
    }
    debugger
    if (data.Interviewer1Tech) {
      //formData.append('Interviewer1', data.Interviewer1Tech);
      formData.append('Interviewer1EmpIds', data.Interviewer1Tech.toString());
    }
    if (data.Interviewer2) {
      //formData.append('Interviewer2', data.Interviewer2);
      formData.append('Interviewer2EmpIds', data.Interviewer2.toString());
    }
    if (data.Interviewer3) {
      //formData.append('Interviewer3', data.Interviewer3);
      formData.append('Interviewer3EmpIds', data.Interviewer3.toString());
    }
    /**online assesment tech 1 interview by */
    if (data.tech1InterviewBy) {
      formData.append('Tech1InterviewBy', data.tech1InterviewBy);
    }
    if (data.onlineAssesment) {
      formData.append('OnlineAssesmentBy', data.onlineAssesment);
    }
    if (data.AcccesmentLink) {
      formData.append('assessmentLink', data.AcccesmentLink);
    }

    if (data.coderBytesAssesments) {
      formData.append('codeByteTestId', this.selectedCoderByteAssessment?.test_id);
      formData.append('coderBytePublicKey', this.selectedCoderByteAssessment?.public_url);
      formData.append('coderByteDisplayName', this.selectedCoderByteAssessment?.display_name);
    }

    if (data.techInternalPanel) {
      formData.append('ReasonForNotOptOnlineAssessment', data.techInternalPanel);
    }
    if (data.techExternalPanel) {
      formData.append('ReasonForOptExternal', data.techExternalPanel);
    }
    // end online assesment

    if (data.Billable) {
      formData.append('IsBillable', data.Billable);
    }
    if (data.BillingType) {
      formData.append('BillingType', data.BillingType);
    }
    if (data.expectedMargin) {
      formData.append('ExpectedMarginPer', data.expectedMargin);
    }
    if (data.billableRates) {
      formData.append('BillableRate', data.billableRates);
    }
    if (data.BillableHours) {
      formData.append('BillableHours', data.BillableHours.toString());
    }

    if (data.plannedBillingStartDate) {
      formData.append('pBillingStartDate', GlobalMethod.formatDate(data.plannedBillingStartDate));
      formData.append('pBillingStartDateUTC', GlobalMethod.convertToUTCDate(data.plannedBillingStartDate));
    }
    if (data.plannedOnBoardingDate) {
      formData.append('pOnboardDate', GlobalMethod.formatDate(data.plannedOnBoardingDate));
      formData.append('pOnboardDateUTC', GlobalMethod.convertToUTCDate(data.plannedOnBoardingDate));
    }
    if (data.isClientInterviewRequired) {
      formData.append('IsClientIntReq', data.isClientInterviewRequired);
    }
    if (data.visaReady) {
      formData.append('IsVisaReady', data.visaReady);
    }
    if (data.Remarks) {
      formData.append('SpecialRequest', data.Remarks);
    }
    /**sending conversion emp for conversion from contractor list */
    if (this.isConversion) {
      formData.append('ReplacementFor', data.conversionFor);
    }
    /**sending replacement  emp for replacment from all emp list */
    if (this.replacementForCtrl) {
      formData.append('ReplacementFor', data.replacementFor);
    }

    if (data.replacementReason) {
      formData.append('ReplacementReasonID', data.replacementReason);
    }
    if (data.employeeEmail) {
      formData.append('C2HEmpEmail', data.employeeEmail);
    }

    // if (this.replacementDesignationData?.EmpContractEndDate) {
    //   formData.append('C2HEmpContractEndDate',  this.replacementDesignationData?.EmpContractEndDate);
    // }

    // if (data.conversionRemarks) {
    //   formData.append('C2HEmpRemarks', data.conversionRemarks);
    // }
    if (this.fileAttechment) {
      formData.append('Attachment', this.fileAttechment);
    }
    if (this.fileAttechmentAppr) {
      formData.append('THIDApprovalAttachment', this.fileAttechmentAppr);
    }

    if (data.talentCubeId) {
      formData.append('TalentCubeId', data.talentCubeId);
    }
    if (data.cubeRoleId) {
      formData.append('TalentCubeRoleId', data.cubeRoleId);
    }
    /**new skills for tc */
    if (data.primarySkillTc) {
      formData.append('CubePrimaySkillId', data.primarySkillTc);
    }

    if (data.cubeGradeId) {
      formData.append('TalentCubeGradeId', data.cubeGradeId);
    }
    if (data.ExperienceId) {
      formData.append('TalentExperienceId', data.ExperienceId);
    }

    if (data.cubeSkill1) {
      if (this.data?.type == 'C') {
        formData.append('TCSkill1', data.cubeSkill1.toString());
      }
      else {
        formData.append('TCSkill1', data.cubeSkill1.toString());
        // let prevData: string = '';
        // if (this.talentDetails?.TCSkill1) {
        //   prevData = this.talentDetails?.TCSkill1.replace(/\s/g, "");
        // }
        // if (prevData != data.cubeSkill1.toString()) {
        //   formData.append('TCSkill1', data.cubeSkill1.toString());
        // }
      }

    }
    if (data.cubeSkill2) {
      if (this.data?.type == 'C') {
        formData.append('TCSkill2', data.cubeSkill2.toString());
      }
      else {
        formData.append('TCSkill2', data.cubeSkill2.toString());
        // let prevData: string = '';
        // if (this.talentDetails?.TCSkill2) {
        //   prevData = this.talentDetails?.TCSkill2.replace(/\s/g, "");
        // }
        // if (prevData != data.cubeSkill2.toString()) {
        //   formData.append('TCSkill2', data.cubeSkill2.toString());
        // }
      }
    }
    if (data.cubeSkill3) {
      if (this.data?.type == 'C') {
        formData.append('TCSkill3', data.cubeSkill3.toString());
      }
      else {
        formData.append('TCSkill3', data.cubeSkill3.toString());
        // let prevData: string = '';
        // if (this.talentDetails?.TCSkill3) {
        //   prevData = this.talentDetails?.TCSkill3.replace(/\s/g, "");
        // }
        // if (prevData != data.cubeSkill3.toString()) {
        //   formData.append('TCSkill3', data.cubeSkill3.toString());
        // }
      }

    }

    if (data.cubeSkill4) {
      if (this.data?.type == 'C') {
        formData.append('TCSkill4', data.cubeSkill4.toString());
      }
      else {
        // let prevData: string = '';
        // if (this.talentDetails?.TCSkill3) {
        //   prevData = this.talentDetails?.TCSkill3.replace(/\s/g, "");
        // }
        // if (prevData != data.cubeSkill4.toString()) {
        //   formData.append('TCSkill4', data.cubeSkill4.toString());
        // }
        formData.append('TCSkill4', data.cubeSkill4.toString());
      }

    }
    if (data.MandatorySkills) {
      formData.append('MandatorySkills', data.MandatorySkills);
    }

    if (data.goodToHaveSkill) {
      formData.append('goodToHaveSkill', data.goodToHaveSkill);
    }

    if (data.SkillRatingType?.length > 0) {
      formData.append('SkillRatingType', JSON.stringify(data.SkillRatingType));
    }
    
    // Demand Quality and Probability Metrics
    if (data.Probability) {
      if (data.Probability?.HTc != null) {
        formData.append('HTC', data.Probability.HTc.toString());
      }
      if (data.Probability?.HTe != null) {
        formData.append('HTE', data.Probability.HTe.toString());
      }
      if (data.Probability?.HTi != null) {
        formData.append('HTI', data.Probability.HTi.toString());
      }
      if (data.Probability?.JDQ != null) {
        formData.append('JDQ', data.Probability.JDQ.toString());
      }
      if (data.Probability?.P_c_prime != null) {
        formData.append('P_c_prime', data.Probability.P_c_prime.toString());
      }
      if (data.Probability?.P_e_prime != null) {
        formData.append('P_e_prime', data.Probability.P_e_prime.toString());
      }
      if (data.Probability?.P_i_prime != null) {
        formData.append('P_i_prime', data.Probability.P_i_prime.toString());
      }
      if (data.Probability?.P_cancelled != null) {
        formData.append('Pcancelled', data.Probability.P_cancelled.toString());
      }
      if (data.Probability?.P_external != null) {
        formData.append('Pexternal', data.Probability.P_external.toString());
      }
      if (data.Probability?.P_internal != null) {
        formData.append('Pinternal', data.Probability.P_internal.toString());
      }
      if (data.Probability?.P_i_percent != null) {
        formData.append('P_i_percent', data.Probability.P_i_percent.toString());
      }
      if (data.Probability?.P_e_percent != null) {
        formData.append('P_e_percent', data.Probability.P_e_percent.toString());
      }
      if (data.Probability?.P_c_percent != null) {
        formData.append('P_c_percent', data.Probability.P_c_percent.toString());
      }
      if (data.Probability?.RMCount != null) {
        formData.append('RMCount', data.Probability.RMCount.toString());
      }
      if (data.Probability?.K != null) {
        formData.append('TotalEmpCountK', data.Probability.K.toString());
      }
      if (data.Probability.NormalizeStatus) {
        formData.append('NormalizeStatus', data.Probability.NormalizeStatus);
      }
      if (data.Probability?.demandCountTotal != null) {
        formData.append('demandCountTotal', data.Probability.demandCountTotal.toString());
      }
      if (data.Probability?.demandCount != null) {
        formData.append('demandCount', data.Probability.demandCount.toString());
      }
      if (data.Probability?.P_total != null) {
        formData.append('P_total', data.Probability.P_total.toString());
      }
      debugger
      // if (data.Probability?.JDReason != null) {
      //   formData.append('JDReason', JSON.stringify(data.Probability.JDReason));
      // }
      if (data.Probability?.JDReason && data.Probability.JDReason.length > 0) {
           data.Probability.JDReason.forEach(reason => {
           formData.append('JDReason', reason);
        });
    }

    }
    
    // if (data.conversionFor) {
    //   formData.append('ReplacementFor', data.conversionFor);
    // }
    if (data.repGradeChangeReason) {
      formData.append('repGradeChangeReason', data?.repGradeChangeReason);
    }

    /** 'N' for new create api and S for save/create */
    if (this.data?.type == 'N' || this.data?.type == 'C') {
      formData.append('ActionTaken', 'S');
      /**clone multi if Frequency no. is greater than 1.
       * else single clone
       */
      if (this.data?.type == 'C' && this.getControl('Frequency').value > 1) {
        formData.append('Frequency', data.Frequency);
        formData.append('thId', this.data?.TH_ID);
        formData.append('IsCache', 'H');
        this._talentServ.multipleTalentIDClone(formData).subscribe(
          res => {
            this._share.showAlertSuccessMessage.next(res);
            this.dialogRef.close(true);
          }
        )
      } else {
        formData.append('IsCache', 'H');
        this._talentServ.AddUpdateTalentIDDetails(formData).subscribe(
          res => {
            this._share.showAlertSuccessMessage.next(res);
            this.dialogRef.close(true);
          }
        );
      }
    }

    /** Edit Talent Details  submit API*/
    else if (this.data?.type == 'UW' || this.data?.type == 'E' || this.data?.type == 'JD') {
      //  formData.append('ActionTaken', 'S');
      formData.append('IsCache', 'H');
      formData.append('THID', this.talentDetails?.TH_ID);
      this._talentServ.updateTalentIDDetails(formData).subscribe(
        res => {
          this._share.showAlertSuccessMessage.next(res);
          this.dialogRef.close(true);
        }
      );
    }

    // else if(this.data?.type == 'A') {
    //   formData.append('THID', this.talentDetails?.TH_ID);
    //   this._talentServ.AddUpdateTalentIDDetails(formData).subscribe(
    //     res => {
    //       this._share.showAlertSuccessMessage.next(res);
    //       this.dialogRef.close(true);
    //     }
    //   );
    // }
    /**update  api with Approve  */
    else {
      /**A for approve S for Submit/update and save */
      if (this.data?.type == 'A') {
        // formData.append('ActionTaken', 'A');
        formData.append('IsCache', 'H');
        //new formdata in case of reject talent id         
        if (data.approveRejectstatus == 'R') {
          let newformData = {};
          if (data.approveRejectstatus) {
            newformData['ActionTaken'] = data.approveRejectstatus;
          }
          if (data.rejectRemarks) {
            newformData['Remark'] = data.rejectRemarks;
          }

          if (data.subReason) {
            newformData['SubCateID'] = data.subReason;
          }
          newformData['THID'] = this.talentDetails?.TH_ID;
          //to reject talent id while approval
          this._talentServ.RejectTalentId(newformData).subscribe(
            res => {
              this._share.showAlertSuccessMessage.next(res);
              this.dialogRef.close(true);
            }
          );
        } else if (data.approveRejectstatus == 'A') {
          if (data.approveRejectstatus) {
            formData.append('ActionTaken', data.approveRejectstatus);
          }
          if (data.rejectRemarks) {
            formData.append('Remark', data.rejectRemarks);
          }

          if (data.subReason) {
            formData.append('SubCateID', data.subReason);
          }
          formData.append('THID', this.talentDetails?.TH_ID);
          this._talentServ.AddUpdateTalentIDDetails(formData).subscribe(
            res => {
              this._share.showAlertSuccessMessage.next(res);
              this.dialogRef.close(true);
            }
          );
        }
      }
      else {
        formData.append('IsCache', 'H');
        formData.append('ActionTaken', 'S');
        formData.append('THID', this.talentDetails?.TH_ID);
        this._talentServ.AddUpdateTalentIDDetails(formData).subscribe(
          res => {
            this._share.showAlertSuccessMessage.next(res);
            this.dialogRef.close(true);
          }
        );
      }
    }
  }

  /***
   * confirmation before sumbit
   */
  confirmAlertSubmit(form: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      panelClass: 'ats-confirm',
      data: {
        headerText: 'Alert',
        message: form.msg,
        buttonText: {
          ok: "Yes",
          cancel: "No"
        },
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.validationCheckBeforeSubmit(form);
      }
    });
  }

  /***
   * download file 
   */
  // dwnloadFileSingle(data) {
  //   this.http.get(`${environment.apiMainUrlNet}Dashboard/downloadFile?filelocation=${data.Path}`, { responseType: 'blob' }).subscribe(
  //     res => {
  //       saveAs(res, data.testAttachment);
  //     }
  //   )
  // }
  dwnloadFileSingle(data: any) {
    this._GlobCommon.downloadFileCommon(data?.AttachmentPath, data?.ATTACHMENT);
  }


  closeModal(): void {
    this.dialogRef.close();
  }
 public isRotation: boolean = false;
 public replacementReasonId: number = 0;

  getReplacementReason(e: any) {
   let  reasonId = e.value;
   this.replacementReasonId =reasonId;
   let replForCtrl = this.getControl('replacementFor');
   if(reasonId == 13){
    this.isRotation = true;
    replForCtrl.clearValidators();
    this.getEmpListForRoation();
   }
   else{
     this.isRotation = false;
     replForCtrl.addValidators([Validators.required]);
     this.getResignReplamentEmp(e.value);
   }

   replForCtrl.updateValueAndValidity();

  }

  getResignReplamentEmp(value: number = 0) {
    this._globalServe.getResignReplamentEmp(value).subscribe(
      res => {
        this.resignEmployeeListForReplacement = res['data'];
      }
    )
  }
   getEmpListForRoation(value: number = 0) {
    this._globalServe.getEmpListForRoation(value).subscribe(
      res => {
        this.resignEmployeeListForReplacement = res['data'];
      }
    )
  }

  /**approve for dp/pdl/sdp code starts */
  /**reason fields are required on select of reject */
  public isRemarkRequired: boolean = false;
  public isRejectTalent: boolean = false;
  statusChange(e) {
    debugger
    this.getControl('reasonCategory').reset();
    this.getControl('subReason').reset();
    if (e.value == 'A') {
      if (this.isRejectTalent) {
        this.employeeUnitCont?.addValidators([Validators.required]);
        this.requirementTypeControl?.addValidators([Validators.required]);
        this.addValidator('joiningLocation');
        this.addValidator('clientWorkRequirement');
        if (this.getControl('clientWorkRequirement')?.value == 2 || this.getControl('clientWorkRequirement')?.value == 3) {

          this.addValidator('locationType');
        }
        this.addValidator('requirementType');
        this.addValidator('deliveryUnit');
        this.addValidator('accountId');
        this.addValidator('jobSummary');
        this.addValidator('jobDescription');
        // this.addValidator('qualification');
        // this.addValidator('primarySkill');
        this.addValidator('talentCubeId');
        // this.addValidator('cubeRoleId');
        // this.addValidator('cubeGradeId');
        // this.addValidator('ExperienceId');
        // this.addValidator('cubeSkill1');
        // this.addValidator('cubeSkill2');
        // this.addValidator('cubeSkill3');
        // this.addValidator('employmentType');
        if (this.interviewer1Ctrl) {
          this.addValidator('Interviewer1Tech');
        }
        // if (this.interviewer2Ctrl) {
        //   this.addValidator('Interviewer2');
        // }

        // if (this.interviewer3Ctrl) {
        //   this.addValidator('Interviewer3');
        // }
        if (this.tech1interviewBy && this.isVisibleForIndia) {
          this.addValidator('tech1InterviewBy');
        }
        if (this.interviewer1Ctrl && this.isTechRoundAssesment && this.isVisibleForIndia) {
          this.addValidator('onlineAssesment');
        }
        if (this.interviewer1Ctrl && this.isCoderByteAssesments && this.isVisibleForIndia) {
          this.addValidator('coderBytesAssesments');
        }
        if (this.interviewer1Ctrl && this.isAssesmentLink && this.isVisibleForIndia) {
          this.addValidator('AcccesmentLink');
        }
        if (this.interviewer1Ctrl && this.isTechRoundInternalPanel && this.isVisibleForIndia) {
          this.addValidator('techInternalPanel');
        }
        if (this.interviewer1Ctrl && this.isTechRoundExternalPanel && this.isVisibleForIndia) {
          this.addValidator('techExternalPanel');
        }
        if (this.plannnedOnboardingDateCtrl && !this.isUpdateMode) {
          this.addValidator('plannedOnBoardingDate');
          let today = new Date();
          let pOnbDate = new Date(this.getControl('plannedOnBoardingDate')?.value);
          if (pOnbDate < today) {
            this.getControl('plannedOnBoardingDate').setErrors({ 'invalid': true })
          }
        }
        if (this.isBillingDateVisib && !this.isUpdateMode) {
          this.addValidator('plannedBillingStartDate');
          let today = new Date();
          let pBilSDate = new Date(this.getControl('plannedBillingStartDate')?.value);
          if (pBilSDate < today) {
            this.getControl('plannedBillingStartDate').setErrors({ 'invalid': true })
          }
        }
        if (this.isClientIntReqCtrl) {
          this.addValidator('isClientInterviewRequired');
        }
        if (this.visaReadyCtrl) {
          this.addValidator('visaReady');
        }
        if (this.isStateActive) {
          this.addValidator('joiningState');
        }
        if (this.isCitiesActive) {
          this.addValidator('joiningCity');
        }
        if (this.isResourceAvailInBu) {
          this.addValidator('isResourceAvailInBu');
        }
        if (this.isApprovedByVisible) {
          this.addValidator('approvedBy');
        }
        if (this.replacementReasonCtrl) {
          this.addValidator('replacementReason');
        }
        if (this.replacementForCtrl) {
          this.addValidator('replacementFor');
        }
        if (this.isConversion) {
          this.addValidator('conversionFor');
        }
        if (this.isConversion) {
          this.addValidator('conversionFor');
        }
        if (this.showGDLCtrl) {
          this.addValidator('deliveryUnit');
        }
        if (this.projectNameIdCtrl) {
          this.addValidator('projectNameId');
        }
        if (this.SFDCClientCtrl) {
          this.addValidator('SFDCClient');
        }
        if (this.opportunityIdCtrl) {
          this.addValidator('opportunityId');
        }
        if (this.exclusiveInfogainCtrl) {
          this.addValidator('exclusiveInfogain');
        }
        if (!this.isTalentCube) {
          this.addValidator('designationCategories');
          this.addValidator('Designation');
          this.addValidator('qualification');
          this.addValidator('primarySkill');
          if (this.subSkillCTRL) {
            this.addValidator('subSkills');
          }
          // this.addValidator('additionalSkills');
          this.addValidator('employmentType');
        }
        if (this.isTalentCube) {
          this.addValidator('cubeRoleId');
          this.addValidator('qualification');
          // this.addValidator('cubeSkill1');
          // this.addValidator('cubeSkill2');
          // this.addValidator('cubeSkill3');    
          this.addValidator('ExperienceId');
          this.addValidator('employmentType');
        }
        if (this.BillableCtrl) {
          this.addValidator('Billable');
        }
        if (this.isBillableYes) {
          this.addValidator('BillingType');
          this.addValidator('expectedMargin');
          this.addValidator('billableRates');
          this.addValidator('BillableHours');
        }
        // if (this.isAttechmentRequired) {
        //   this.addValidator('fileUpload');
        // }
        if (this.isAttechmentRequiredAppr) {
          this.addValidator('THIDApprovalAttachment');
        }

      }
      this.clearValidators('reasonCategory')
      this.clearValidators('subReason');
      this.isRejectTalent = false;
    }
    else {
      this.isRejectTalent = true;
      this.addValidator('reasonCategory');
      this.addValidator('subReason');
      this.clearAllValidators();
    }
  }

  /**get cancel reason category */
  public reasonCategList: any = [];
  getCancelTalentReasonCateg() {
    this._talentServ.cancelTalentReasonCateg().subscribe(
      res => {
        if (this.talentDetails?.ReqTypeID == 3) {
          let filterById = [1, 2, 3];
          let dataRes = res['data'];
          /**showing category Opportunity Lost - 1, Opportunity Scaled Down -2,  Requirement/Scope Change- 3 
           * for replacement type*/
          let filterByStatus = dataRes.filter(t => {
            return filterById.indexOf(t.CateID) === -1;
          });
          this.reasonCategList = filterByStatus;
        } else {
          //  this.reasonCategList = res['data'];
          let filterById = [5];
          let dataRes = res['data'];
          let filterByStatus = dataRes.filter(t => {
            return filterById.indexOf(t.CateID) === -1;
          });
          this.reasonCategList = filterByStatus
        }
      }
    )
  }

  /**getting current id of dropdown on selection */
  // public projData: any = [];
  getReasonCategId(data: any) {
    //let reasonCategFilteredData = this.reasonCategList.filter(x => x.ProjectID === data.value);
    //this.projData = reasonCategFilteredData[0];
    this.getCancelTalentReason(data?.value);
  }

  /**get cancel reason */
  public reasonList: any = [];
  getCancelTalentReason(id) {
    this._talentServ.cancelTalentReason(id).subscribe(
      res => {
        //  this.reasonList = res['data'];
        let filterById = [6];
        let dataRes = res['data'];
        let filterByStatus = dataRes.filter(t => {
          return filterById.indexOf(t.SubCateID) === -1;
        });
        this.reasonList = filterByStatus;
      }
    )
  }
  // public ApprovalActionForm: FormGroup = new FormGroup({});
  // //form setup for approve
  // ApprovalActionSubmitForm() {
  //   this.ApprovalActionForm = this._fb.group({
  //     status: [null, [Validators.required]],
  //     remarks: [null]
  //   })
  // }

  clearAllValidators() {
    this.employeeUnitCont?.clearValidators();
    this.requirementTypeControl?.clearValidators();
    this.employeeUnitCont?.updateValueAndValidity();
    this.requirementTypeControl?.updateValueAndValidity();
    this.clearValidators('joiningLocation');
    this.clearValidators('joiningState');
    this.clearValidators('joiningCity');
    this.clearValidators('requirementType');
    this.clearValidators('clientWorkRequirement');
    this.clearValidators('locationType');
    this.clearValidators('isResourceAvailInBu');
    this.clearValidators('replacementReason');
    this.clearValidators('replacementFor');
    this.clearValidators('conversionFor');
    this.clearValidators('employeeEmail');
    this.clearValidators('deliveryUnit');
    this.clearValidators('accountId');
    this.clearValidators('projectNameId');
    this.clearValidators('SFDCClient');
    this.clearValidators('opportunityId');
    this.clearValidators('role');
    this.clearValidators('bidTypeDropdown');
    this.clearValidators('exclusiveInfogain');
    this.clearValidators('talentCubeId');
    this.clearValidators('primarySkill');
    this.clearValidators('cubeRoleId');
    this.clearValidators('cubeGradeId');
    this.clearValidators('ExperienceId');
    this.clearValidators('cubePractice');
    this.clearValidators('qualification');
    this.clearValidators('employmentType');
    this.clearValidators('designationCategories');
    this.clearValidators('Designation');
    this.clearValidators('qualification');
    this.clearValidators('primarySkill');
    this.clearValidators('subSkills');
    this.clearValidators('employmentType');
    this.clearValidators('jobSummary');
    this.clearValidators('jobDescription');
    this.clearValidators('tech1InterviewBy');
    this.clearValidators('onlineAssesment');
    this.clearValidators('coderBytesAssesments');
    this.clearValidators('AcccesmentLink');
    this.clearValidators('techInternalPanel');
    this.clearValidators('techExternalPanel');
    this.clearValidators('Billable');
    this.clearValidators('BillingType');
    this.clearValidators('expectedMargin');
    this.clearValidators('billableRates');
    this.clearValidators('BillableHours');
    this.clearValidators('plannedOnBoardingDate');
    this.clearValidators('plannedBillingStartDate');
    this.clearValidators('isClientInterviewRequired');
    this.clearValidators('visaReady');
    this.clearValidators('Remarks');
   // this.clearValidators('fileUpload');
    this.clearValidators('THIDApprovalAttachment');
    this.clearValidators('Interviewer1Tech');
  //  this.clearValidators('Interviewer2');
   // this.clearValidators('Interviewer3');
  }
  onClientWorkRequirementChange(event: any): void {
    const selectedValue = event.value;
    this.submitJobCreateForm.get('locationType')?.reset();
    this.isLocationTypeVisible = selectedValue === 2 || selectedValue === 3;
    if (!this.isLocationTypeVisible) {
      this.getControl('locationType').clearValidators();
      this.getControl('locationType').updateValueAndValidity();
    }
  }
}

