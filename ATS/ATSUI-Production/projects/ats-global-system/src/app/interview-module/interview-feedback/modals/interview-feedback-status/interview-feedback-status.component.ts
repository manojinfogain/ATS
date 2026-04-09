import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { InterviewStatusService } from 'projects/ats-global-system/src/app/core/services/interview-status.service';
import { Observable, forkJoin } from 'rxjs';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { FILE_UPLOAD, salaryMinMaxLoc } from 'projects/ats-global-system/src/app/core/constant/common.const';
import { InterviewCommonService } from 'projects/ats-global-system/src/app/core/services/interview-common.service';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { CONSTANTS } from 'projects/ats-global-system/src/app/core/constant/constants';
import { GetLocationInfo } from 'projects/ats-global-system/src/app/core/common/getLocationInfo';
import { ViewCalenderHistoryComponent } from 'projects/ats-global-system/src/app/shared/shared-app/components/view-calender-history/view-calender-history.component';
import { ViewProfilePicsComponent } from '../../../../common-sharing/interview/view-profile-pics/view-profile-pics.component';
import { InrerviewsService } from 'projects/ats-global-system/src/app/interview-module/inrerviews.service';
import { ImageCropperMopComponent } from 'projects/ats-global-system/src/app/shared/shared-app/components/image-cropper-mop/image-cropper-mop.component';
import { GlobalCommonMethodService } from 'projects/ats-global-system/src/app/core/common/global-common-method.service';
import { FeedbackRoundDetailsComponent } from '../feedback-round-details/feedback-round-details.component';
import { PreviewMediaFileModalComponent } from 'projects/ats-global-system/src/app/shared/shared-app/components/preview-media-file-modal/preview-media-file-modal.component';
import { OnboardService } from 'projects/ats-global-system/src/app/onboard-module/onboard.service';
import { CandidateCommonApiService } from 'projects/ats-global-system/src/app/core/services/candidate-common-api.service';
import { InterviewFeedbackQuesionnaireModalComponent } from '../interview-feedback-quesionnaire-modal/interview-feedback-quesionnaire-modal.component';
import * as internal from 'stream';
import { ConfirmationDialogComponent } from 'projects/ats-global-system/src/app/shared/shared-app/components/confirmation-dialog/confirmation-dialog.component';
import { ViewCoderbyteReportComponent } from '../view-coderbyte-report/view-coderbyte-report.component';
import { AtsCommonFuncService } from 'projects/ats-global-system/src/app/core/common/ats-common-func.service';
import { PanelSlotListThidComponent } from 'projects/ats-global-system/src/app/panel-self-nomination-module/Modal-Screen/panel-slot-list-thid/panel-slot-list-thid.component';
import { CustomValidation } from 'projects/ats-global-system/src/app/core/validators/custom-validator';
@Component({
  selector: 'app-interview-feedback-status',
  templateUrl: './interview-feedback-status.component.html',
  styleUrls: ['./interview-feedback-status.component.scss']
})
export class InterviewFeedbackStatusComponent implements OnInit {
  interviewStatus: UntypedFormGroup;
  statusList: any = [];
  isCandidateSelected = false;
  isRequired = false;
  isTimeZero = true;
  isHideAttachment = true;
  formVal: any;
  getTalentS: number;
  intModeData: any = [];
  intLocationList: any = [];
  getAllEmp: any;
  filteredIntForce: Observable<any>;
  minDate = new Date();
  public minDateMettle: any;
  public InterviewTypeData: any = [];
  public RatingList: any = ['1', '2', '3', '4', '5'];
  public iSCurrentStatusHr: boolean = false;
  public candidateDetailsData: any = [];
  public isInterviewSchedule: boolean = false;
  public isRequiredInt: boolean = false;
  public isSubmitForm: boolean = false;
  public candidateGlobalStatusId: number;
  public isExternalAgency: boolean = false;
  /**interview type list */
  public interviewByTypeList: any = CONSTANTS.InterViewByListData;
  public externalAgencyList: any = [];
  public interviewByLabel: any = CONSTANTS.InterViewByKeyName;
  /***
   *  technical feedback
   */
  public isTechnicalFeedback: boolean = false;
  public isTechnicalMettlFeedback: boolean = false;
  public isTechnicalExternalFeedback: boolean = false;
  public isRequiredTechnical: boolean = false;
  public iSCurrentStatusTech: boolean = false;

  public isCoderByteActive: boolean = false;
  public isInternalActive: boolean = false;

  /**
   * questionnaire technical
   */
  public feedbackDetails: any = [];
  public base64file: string;

  public feedbackQuestionnaireForm: UntypedFormGroup = new UntypedFormGroup({});
  public isHideAll: boolean = true;
  public offerTemplates: any = [];
  public maxTextLength: number = 1000;
  public minTextLength: number = 100;
  public minCharacError: string = 'Please enter minimum 100 characters.';

  /**new view detailed feedback total 3 section starts */
  public NewallQuestionnaireDetails: any = CONSTANTS.NewquesionnaireIntFeedback;
  /**sec label  */
  public newLabel2: string = this.NewallQuestionnaireDetails.labelOne?.name;
  public newLabel3: string = this.NewallQuestionnaireDetails.labelTwo?.name;
  public newlabel5: string = this.NewallQuestionnaireDetails.labelThree?.name;
 /** questions  */
 public assessRoleKnowledgLabelNew: string = this.NewallQuestionnaireDetails.labelOne?.question1;
 public candidatePrblmSolvingApprochLabelNew: string = this.NewallQuestionnaireDetails.labelTwo?.question1;
 public candidateFitForInfogainLabelNew: string = this.NewallQuestionnaireDetails.labelThree?.question1;
/**new view detailed feedback total 3 section  ends*/
  public allQuestionnaireDetails: any = CONSTANTS.NewquesionnaireIntFeedback;
  public label1: string = this.allQuestionnaireDetails.label1?.name;
  public label2: string = this.allQuestionnaireDetails.label2?.name;
  public label3: string = this.allQuestionnaireDetails.label3?.name;;
  public label4: string = this.allQuestionnaireDetails.label4?.name;
  public label5: string = this.allQuestionnaireDetails.label5?.name;

  public familiarProgramTechnologLabel: string = this.allQuestionnaireDetails.label1?.question1;
  public technicalSkillsEvaluatLabel: string = this.allQuestionnaireDetails.label1?.question2;
  public candidateCodingChallengeLabel: string = this.allQuestionnaireDetails.label1?.question3;

  public assessRoleKnowledgLabel: string = this.allQuestionnaireDetails.label2?.question1;

  public candidateApprochComplexPrblmLabel: string = this.allQuestionnaireDetails.label3?.question1;
  public candidatePrblmSolvingApprochLabel: string = this.allQuestionnaireDetails.label3?.question1;

  public candidatePossesIndustryDomExpLabel: string = this.allQuestionnaireDetails.label4?.question1;

  public candidateFitForInfogainLabel: string = this.allQuestionnaireDetails.label5?.question1;
  public candidateAbilityToAdoptChangeWorkLabel: string = this.allQuestionnaireDetails.label5?.question2;
  /***
   *  HR feedback
   */
  public isHrFeedback: boolean = false;
  public isHrFeedbackFinal: boolean = false;
  public isHrFeedbackDiscussion: boolean = false;
  public isRequiredHr: boolean = false;
  public isRequiredHrFinal: boolean = false;

  public isGroomable: boolean = false;
  public isGroomRequired: boolean = false;

  public candidateData: any = [];
  public roundListFor: any = []
  public candidteRoundDetails: any = [];
  public primarySkillDataList: any = [];
  public designationListData: any = [];
  public isloader: boolean = false;
  public isManagementRound: boolean = false;
  public isCientRound: boolean = false;
  public candidateStatusPlaceholder: string = 'Candidate Status';
  public techRoundFilter: any = [];
  public techRoundFilterByInternal: any = [];
  public hrDiscussionRound: any = [];
  public screenRoundFilter: any = [];
  public managerialRoundFilter: any = [];
  @ViewChild('ratingsMp1') ratingsMp1 = { value: 15 };
  public isIdProof: boolean = false;
  public idProofReq: boolean = false;
  public HRDocReq: boolean = false;
  public isHRDocVisible: boolean = false;
  public idTypeData: any = [];
  public techManagerialCtrl: boolean = false;
  public durationData: any[] = CONSTANTS.interviewDuration;
  public screenRejectReason: any = [];

  public entityList: any = [];
  public isDraftFeedback: boolean = false;
  public isDetailedFeedbackDisableForAccount: string = '';
  public isAIQuestionFeedbackEnable: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<InterviewFeedbackStatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _interviewStatus: InterviewStatusService,
    private _fb: UntypedFormBuilder,
    private globalApiServe: GlobalApisService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private _share: ShareService,
    private _intCommonServe: InterviewCommonService,
    private _storage: GetSetStorageService,
    private getLocInfo: GetLocationInfo,
    private dialog: MatDialog,
    private _intServe: InrerviewsService,
    private _commonMethodServe: GlobalCommonMethodService,
    private _onboardServ: OnboardService,
    private _candidateCommon: CandidateCommonApiService,
  ) { }
  public locationData: any = {};
  ngOnInit() {
    const today = new Date()
    let pastDate = new Date()
    pastDate.setDate(today.getDate() - 7);
    this.minDateMettle = pastDate;
    if (this.data?.IsRenuTeam == 'Y') {
      this.IsRenuTeam = true;
    }
    else {
      this.IsRenuTeam = false;
    }
    if (this.data?.IsRenuTeam == 'Y' || this.data?.IsExceptionVideo == 'Y' || this.getLocInfo.isLocationUS(null)) {
      this.isDraftFeedback = false;
    } else if ((this.data?.IsExceptionVideo == 'N' && this.data?.IsUplaodVideoEXist == 'N') && this.getLocInfo.isLocationIndia(null) && this.data?.interviewBy == 'I') {
      this.isDraftFeedback = true;
    } else if ((this.data?.IsExceptionVideo == 'N' && this.data?.IsUplaodVideoEXist == 'Y') && this.getLocInfo.isLocationIndia(null)) {
      this.isDraftFeedback = false;
    }
    // else if(this.data?.IsExceptionVideo == 'N' && this.data?.IsUplaodVideoEXist == 'Y' && this.data?.IsVideoMatchExist == 'Y'){
    //   this.isDraftFeedback = true;
    // }
    this.getTalentTCAdditionalSkillByThId();
    this.formInit();
    this.isloader = true;
    this.feedbackHideShowSetion();
    this.getIdType();
    this.locationData = this.getLocInfo;
    this.getScreenRejectReasonList('');
    this.getVideoIdPath(this.data?.cid);
    this.candidteRoundDetails?.interviewBy
    // this.addValidationMinMax();
    //ar
    // this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, null, null)
    /**coder byte assessment search */
    this.FilterCtrlCoderBytAssesment.valueChanges.subscribe(
      val => {
        this.searchInputCoderBytAssesment = val;
      }
    );
    console.log(this.techRatingCtrlControl)

  }


  ngAfterViewInit() {

  }
  public talentTCAdditionalSkillByThId: any = [];
  public talentTCSkillsByThId: any = [];
  getTalentTCAdditionalSkillByThId() {
    this.globalApiServe.getTalentTCAdditionalSkillByThId(this.data?.th_id).subscribe(
      res => {

        this.talentTCAdditionalSkillByThId = res['data'];
        this.talentTCSkillsByThId = res['AllSkills']
      }
    )
  }

  intSchedulingFunc() {
    this.getIntMode();
    this.getIntLocationsList();
    this.getIntType();
    this.getExternalAgencyList();
    this.getCoderByteAssessments();
    this.GetAssessmentReasonMaster();
  }

  public coderByteAssessmentList: any = [];
  public FilterCtrlCoderBytAssesment: UntypedFormControl = new UntypedFormControl();
  public searchInputCoderBytAssesment: string;
  getCoderByteAssessments() {
    this.globalApiServe.getCoderByteAssessments().subscribe(
      res => {
        this.coderByteAssessmentList = res['data'];
      })
  }

  //validation for final ctc min max salary
  public salRange: any = salaryMinMaxLoc;
  addValidationMinMax() {
    if (this.getLocInfo.isLocationIndia()) {
      if (this.candidateData?.currency?.Id == 2) {
        this.CTCControl.setValidators([Validators.required, Validators.min(this.salRange?.usdMin), Validators.max(this.salRange?.usdMax)]);
      } else {
        this.CTCControl.setValidators([Validators.required, Validators.min(this.salRange?.inrMin), Validators.max(this.salRange?.inrMax)]);
      }
    }
    else {
      this.CTCControl.setValidators([Validators.required]);
    }
    this.CTCControl.updateValueAndValidity();
  }



  //geting external agency list
  getExternalAgencyList() {
    this.globalApiServe.getExternalAgencyList().subscribe(
      res => {
        this.externalAgencyList = res['data'];
      }
    )
  }

  /**interview by and assessment change reason */
  public changeTypeReason: any = [];
  GetAssessmentReasonMaster() {
    this.globalApiServe.GetAssessmentReasonMaster().subscribe(
      res => {
        this.changeTypeReason = res['data'];
      }
    )
  }
  /**managing  "interview by" dropdown here*/
  public isMettleInterviewSchedule: boolean = false;
  interviewByType(event: any) {
    debugger
    let id = event.value;

    this.InterbyShowHideFunc(id);
    this.GetReasonForNotOptOnlineExternalAssessment(id);

    let currentVal = this.interviewByTypeList.filter(list => list.id == id);
    if (id == 'C' || id == 'G' || id == 'M') {
      /**condtion to show alert for changing option and showing reason dropdown */
      if (this.candidateOtherDetails?.Tech1InterviewById == 1) {
        if (this.candidateOtherDetails.OnlineAssesmentByShort != '' &&
          this.candidateOtherDetails.OnlineAssesmentByShort != null &&
          currentVal[0].id != this.candidateOtherDetails.OnlineAssesmentByShort) {
          this.previewWarningFunc({
            name: 'Interview By',
            curValue: currentVal[0].interviewByName,
            oldVal: this.candidateOtherDetails?.OnlineAssesmentByName
          });
          this.showHideReasonFunc(true);
        }
        else {
          this.showHideReasonFunc(false);
        }
      }
      else {
        if (this.candidateOtherDetails.Tech1InterviewByShort != '' &&
          this.candidateOtherDetails.Tech1InterviewByShort != null &&
          currentVal[0].id != this.candidateOtherDetails.Tech1InterviewByShort) {
          this.previewWarningFunc({
            name: 'Interview By',
            curValue: currentVal[0].interviewByName,
            oldVal: this.candidateOtherDetails?.Tech1InterviewByName
          });
          this.showHideReasonFunc(true);
        }
        else {
          this.showHideReasonFunc(false);
        }
      }
    } else {
      // this.getControl('requirementChangeReason').clearValidators();
      // this.getControl('requirementChangeReason').reset();
      // this.isChangeDropdownAsses = false;
      this.showHideReasonFunc(false);
    }
    this.hideshowApprovalAttachment(currentVal, id)
    this.hideShowInerviewLocation(id);
  }

  hideShowInerviewLocation(loc:any) {
    this.venueControl.reset();
    if(loc  == 'I' || loc == 'E') {
      this.isInterviewLocVisible = true;
       this.InterviewLocationId?.setValidators([Validators.required]);
    
    }
    else{
        this.InterviewLocationId?.reset();
         this.InterviewLocationId?.clearValidators();
         this.isInterviewLocVisible = false; this.isInterviewLocVisible = false;
      
    }
      this.InterviewLocationId?.updateValueAndValidity();
  }

  public isApprovalAttachment: boolean = false;
  /**hide show approval attachmetn in case of assessment type change to  */
  hideshowApprovalAttachment(currdata: any, currentId: string) {
    this.getControl('approvalFile').reset();
    // if (val) {
    //   this.isApprovalAttachment = false;
    // } else {
    //   this.isApprovalAttachment = true;
    // }

    if (currentId == 'I' || currentId == 'E') {
      if (this.candidateOtherDetails?.Tech1InterviewById == 1) {
        if (this.candidateOtherDetails.OnlineAssesmentByShort != '' &&
          this.candidateOtherDetails.OnlineAssesmentByShort != null &&
          currdata[0].id != this.candidateOtherDetails.OnlineAssesmentByShort) {
          if (this.candidateOtherDetails.OnlineAssesmentByShort == 'C'
            || this.candidateOtherDetails.OnlineAssesmentByShort == 'G'
            || this.candidateOtherDetails.OnlineAssesmentByShort == 'M') {
            this.isApprovalAttachment = true;
            this.addValidator('approvalFile');
          }
          else {
            this.clearValidators('approvalFile');
            this.isApprovalAttachment = false;

          }
        }
        else {
          this.clearValidators('approvalFile');
          this.isApprovalAttachment = false;

        }
      }
      else {
        if (this.candidateOtherDetails.Tech1InterviewByShort != '' &&
          this.candidateOtherDetails.Tech1InterviewByShort != null &&
          currdata[0].id != this.candidateOtherDetails.Tech1InterviewByShort) {
          if (this.candidateOtherDetails.Tech1InterviewByShort == 'C'
            || this.candidateOtherDetails.Tech1InterviewByShort == 'G'
            || this.candidateOtherDetails.Tech1InterviewByShort == 'M') {
            this.isApprovalAttachment = true;
            this.addValidator('approvalFile');
          }
          else {
            this.clearValidators('approvalFile');
            this.isApprovalAttachment = false;
          }

        }
        else {
          this.clearValidators('approvalFile');
          this.isApprovalAttachment = false;
        }
      }
    } else {
      this.clearValidators('approvalFile');
      this.isApprovalAttachment = false;
    }
  }

  /**show hide reason of changing interview by and coderbyte assessment  */
  public isChangeDropdownAsses: boolean = false;
  public isInterviewByValChange: boolean = false;
  showHideReasonFunc(val: boolean) {
    this.getControl('requirementChangeReason').reset();
    if (val) {
      this.isChangeDropdownAsses = true;
      this.getControl('requirementChangeReason').setValidators([Validators.required]);
    } else {

      this.getControl('requirementChangeReason').clearValidators();
      this.getControl('requirementChangeReason').reset();
      this.isChangeDropdownAsses = false;
    }

    this.getControl('requirementChangeReason').updateValueAndValidity();

  }
  previewWarningFunc(data: any) {

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      panelClass: 'ats-confirm',
      data: {
        headerText: `Changing the ${data?.name} selection`,
        message: `You are changing the ${data?.name} <br> from "${data?.oldVal}" <br> To "${data?.curValue}".`,
        isHideCancel: 0,
        buttonText: {
          ok: 'Ok',
          cancel: "Cancel"
        },
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        //this.talentCubeReferenceGuide(this.CudeRefSkillData)
      }
    });
  }



  public IsLinkVisible: boolean = false;
  public IsLinkRequired: boolean = false;
  public isCoderByteAssessment: boolean = false;
  public isCoderByteAssessmentReq: boolean = false;

  public isTechInternal: boolean = false;
  public isTechExternal: boolean = false;

  InterbyShowHideFunc(id: string) {
    /**
     * external 
     */
    this.getControl('techExternalPanel').reset();
    this.getControl('techInternalPanel').reset();
    if (id === 'E') {
      this.isExternalAgency = true;
      this.externalAgencyControl.setValidators([Validators.required]);
      this.venueControl.clearValidators();
      this.venueControl.reset();
      this.externalAgencyControl.reset();
      this.isMettleFeedbackReq = false;

      if (this.locationData.isLocationIndia(null)) {
        this.getControl('coderBytesAssesments').clearValidators();
        this.getControl('coderBytesAssesments').reset();
        this.isCoderByteAssessment = false;

        this.isTechExternal = true;
        this.getControl('techExternalPanel').setValidators([Validators.required]);
        // this.isTechInternal = true;
        // this.getControl('techInternalPanel').setValidators([Validators.required]);
        this.getControl('techInternalPanel').clearValidators();
        this.isTechInternal = false;
      }

      // this.getControl('techInternalPanel').clearValidators();

      setTimeout(() => {
        this.isMettleFeedback = false;
      }, 500);
    }
    /**
     * coder byte
     */
    else if (id === 'C') {
      let empId = this._storage.getUserEmpId();
      this.externalAgencyControl.clearValidators();
      this.externalAgencyControl.reset();
      this.venueControl.clearValidators();
      this.venueControl.reset();
      this.IsLinkVisible = false;
      this.isExternalAgency = false;
      this.isMettleFeedbackReq = true;
      this.panelControl.patchValue(empId);
      if (this.locationData.isLocationIndia(null)) {
        this.isCoderByteAssessment = true;
        this.getControl('coderBytesAssesments').setValidators([Validators.required]);


        this.getControl('techExternalPanel').clearValidators();
        this.isTechExternal = false;
        this.getControl('techInternalPanel').clearValidators();
        this.isTechInternal = false;
      }
      setTimeout(() => {
        this.isMettleFeedback = true;
      }, 500);
    }
    /**
     * mettl, 
     * glider changed to DoSelect
     */
    else if (id === 'M' || id === 'G') {
      let empId = this._storage.getUserEmpId();
      this.externalAgencyControl.clearValidators();
      this.externalAgencyControl.reset();
      this.isExternalAgency = false;
      this.isMettleFeedbackReq = true;
      this.panelControl.patchValue(empId);
      this.IsLinkVisible = true;
      this.venueControl.setValidators([Validators.required])
      if (this.locationData.isLocationIndia(null)) {
        this.getControl('coderBytesAssesments').clearValidators();
        this.getControl('coderBytesAssesments').reset();
        this.isCoderByteAssessment = false;

        this.getControl('techExternalPanel').clearValidators();
        this.isTechExternal = false;
        this.getControl('techInternalPanel').clearValidators();
        this.isTechInternal = false;
      }
      setTimeout(() => {
        this.isMettleFeedback = true;
      }, 500);
    }
    else {
      this.externalAgencyControl.clearValidators();
      this.venueControl.clearValidators();
      this.venueControl.reset();
      this.IsLinkVisible = false;
      this.externalAgencyControl.reset();
      this.isExternalAgency = false;
      this.isMettleFeedbackReq = false;
      if (this.locationData.isLocationIndia(null)) {
        this.getControl('coderBytesAssesments').clearValidators();
        this.getControl('coderBytesAssesments').reset();
        this.isCoderByteAssessment = false;

        this.isTechInternal = true;
        this.getControl('techInternalPanel').setValidators([Validators.required]);
        this.getControl('techExternalPanel').clearValidators();
        this.isTechExternal = false;
      }
      setTimeout(() => {
        this.isMettleFeedback = false;
      }, 500);
    }
    this.externalAgencyControl.updateValueAndValidity();
    this.venueControl.updateValueAndValidity();
    this.getControl('coderBytesAssesments').updateValueAndValidity();
    this.getControl('techInternalPanel').updateValueAndValidity();
    this.getControl('techExternalPanel').updateValueAndValidity();
  }
  /***
   * setup and hide/show  control  dynamically
   */


  public uploadDocLabel: string = 'Upload Document (if applicable)';
  public mettlScoreLabel: string = 'Mettl Score  (if applicable)';
  public uploadDocLabelHR: string = 'Upload Salary Supporting Documents';
  public intTypeId: number = 0;
  public candidateOtherDetails: any = {};
  public isG4Hiring: boolean = false;
  public isG4AboveHiring: boolean = false;
  public isDetailedFeedbackDraft: boolean = false;
  public isDetailedFeedbackEnable: boolean = false;
  public isDetailedFeedbackEnableRemark: boolean = false;
  public IsRenuTeam: boolean = false;
  feedbackHideShowSetion() {
    if (this.data) {
      this.isloader = true;
      forkJoin([
        this._interviewStatus.getCandidateDetails(this.data.cid),
        this._candidateCommon.getCandidateDetailsProfile(this.data?.cid, null, null),
        this.globalApiServe.getLegalEntityList(),

      ]).subscribe(
        res => {
          this.isloader = false;
          this.candidateData = res[0];
          this.candidateOtherDetails = res[1]['data'][0];
          let entityListData = res[2]['data'];


          if (this.getLocInfo.isLocationUS()) {
            //this.entityList = entityListData.filter(list => list?.ID == 22);
            this.entityList = entityListData
            setTimeout(() => {
              this.EntityIdCtrl.patchValue(this.candidateData?.EntityId);
            }, 1000);
          } else {
            this.entityList = res[2]['data'];
            this.EntityIdCtrl.reset();
          }

          if (this.candidateOtherDetails?.IsRenuTeam == 'Y') {
            this.IsRenuTeam = true;
          }
          else {
            this.IsRenuTeam = false;
          }

          this.isG4Hiring = this._commonMethodServe.validationGradeAboveG4AndAbove(this.candidateOtherDetails?.gradeId);
          this.isG4AboveHiring = this._commonMethodServe.validationGradeAboveG4Above(this.candidateOtherDetails?.gradeId);
          if (this.candidateData?.roundList.length != 0) {
            //active round
            let crrInt = this.candidateData?.roundList.filter(list => list.IsCurrentRound == 'Y');
            this.candidteRoundDetails = crrInt[0];

            // find tech round
            this.techRoundFilter = this.candidateData?.roundList.filter(d => d?.interviewType?.Id === 2 && d?.InterViewStatus?.Id === 7 || d?.interviewType?.Id === 2 && d?.InterViewStatus?.Id === 10);
            this.techRoundFilterByInternal = this.candidateData?.roundList.filter(d => (d?.interviewType?.Id === 2 && d?.InterViewStatus?.Id === 7 || d?.interviewType?.Id === 2 && d?.InterViewStatus?.Id === 10) && d?.interviewBy == 'I');
            this.screenRoundFilter = this.candidateData?.roundList.filter(d => d?.interviewType?.Id === 1 && d?.InterViewStatus?.Id === 7 || d?.interviewType?.Id === 1 && d?.InterViewStatus?.Id === 10);

            this.managerialRoundFilter = this.candidateData?.roundList.filter(d => d?.interviewType?.Id === 6 && d?.InterViewStatus?.Id === 7 || d?.interviewType?.Id === 6 && d?.InterViewStatus?.Id === 10);
            this.hrDiscussionRound = this.candidateData?.roundList.filter(d => (d?.interviewType?.Id === 7 && d?.InterViewStatus?.Id === 7 || d?.interviewType?.Id === 7 && d?.InterViewStatus?.Id === 10));
            let InterViewStatusId = this.candidteRoundDetails.InterViewStatus.Id;
            let intType = this.candidteRoundDetails.interviewType.Id;
            this.intTypeId = intType;
            /***
             * if status scheduled
             */
            if (InterViewStatusId === 1 || InterViewStatusId === 3) {
              /***
               * if HR Round
               */

              if (intType === 1) {
                this.isHrFeedback = true;
                this.isTechnicalFeedback = false;
                this.isHrFeedbackFinal = false;
                this.isRequiredHrFinal = false;
                this.feedbackFormHideShow();
                this.isSchedRemarkShow = true;
                // this.clearValidUploadIdVid();
                // this.resetIDControlType();
                // if (this.getLocInfo.isLocationIndia(null)) {
                //   this.isIdProof = true;
                //   this.idProofReq = this.flagScreeningIdPicVidMandat ? true : false;
                //   this.addValidUploadIdVid();
                // } else {
                //   this.resetIDControlType();
                //   this.clearValidUploadIdVid();
                // }
              }
              /**
               * if Tech Round/Management/Client. managerial
               */
              else if (intType === 2 || intType === 5 || intType === 3 || intType === 6) {
                // this.clearValidUploadIdVid();
                // this.resetIDControlType();
                //DetailedFeedback questionnare enable disable

                if (intType === 2) {
                  debugger
                  if(this.locationData.isLocationUS(null)){
                    this.isDetailedFeedbackEnableRemark = true;
                  }
                  if (this.candidateOtherDetails?.IsRenuTeam == 'Y')
                  {
                    this.isDetailedFeedbackEnableRemark = true; 
                  }
                  
                  //if G4 or less than G4
                  if (!this.isG4AboveHiring) {
                    if (this.locationData.isLocationIndia(null) && this.candidateData?.IsDetailedFeedbackDisableForAccount == 'Y') {
                      if (this.candidteRoundDetails?.isDetailedFeedbackSaveOrDraft == 'D'
                        || this.candidteRoundDetails?.isDetailedFeedbackSaveOrDraft == 'P'
                        || (this.candidteRoundDetails?.isDetailedFeedbackSaveOrDraft == 'S' && (InterViewStatusId == 1 || InterViewStatusId == 3))
                      ) {
                        if (this.candidteRoundDetails.interviewBy == 'M' || this.candidteRoundDetails.interviewBy == 'C' || this.candidteRoundDetails.interviewBy == 'G') {
                          this.isDetailedFeedbackDraft = false;
                        }
                        else if (this.candidteRoundDetails.interviewBy == 'E') {
                          this.isDetailedFeedbackDraft = false;
                          this.isDetailedFeedbackEnable = false;
                          /**for details feedback technical quesnionnaire */
                          this.addRemoveValidationForQuestionnaire(false);
                        }
                        else {
                          this.isDetailedFeedbackEnableRemark = false;
                          this.isDetailedFeedbackEnable = true;
                          /**for details feedback technical quesnionnaire */
                          this.addRemoveValidationForQuestionnaire(true);
                          if (this.candidteRoundDetails?.isDetailedFeedbackSaveOrDraft == 'D'
                            || this.candidteRoundDetails?.isDetailedFeedbackSaveOrDraft == 'P') {
                            this.isDetailedFeedbackDraft = true;
                          } else {
                            this.isDetailedFeedbackDraft = false;
                          }
                        }

                      }
                    } else if (this.candidateData?.IsDetailedFeedbackDisableForAccount == 'N' || this.locationData.isLocationUS(null)) {
                      this.isDetailedFeedbackEnable = false;
                      /**for details feedback technical quesnionnaire */
                      this.addRemoveValidationForQuestionnaire(false);
                      this.isDetailedFeedbackDraft = false;
                    } else {

                    }
                  }
                  else{
                    this.isDetailedFeedbackEnableRemark = true;
                    this.isDetailedFeedbackEnable = false;
                    /**for details feedback technical quesnionnaire */
                    this.addRemoveValidationForQuestionnaire(false);
                    if (this.candidteRoundDetails?.isDetailedFeedbackSaveOrDraft == 'D'
                      || this.candidteRoundDetails?.isDetailedFeedbackSaveOrDraft == 'P') {
                      this.isDetailedFeedbackDraft = true;
                    } else {
                      this.isDetailedFeedbackDraft = false;
                    }
                  }

                  //enable AI Question FeedBACK SECTION

                  if (this.candidteRoundDetails.interviewBy == 'I' && this.candidteRoundDetails?.IsAIQuestionFeedbackEnable == 'Y') {
                    this.isAIQuestionFeedbackEnable = true;
                  }
                }


                this.isSchedRemarkShow = false;
                if (intType === 5 || intType === 3) {
                  this.isManagementRound = true;
                  this.isDetailedFeedbackEnableRemark = true;
                }
                //client round
                if (intType === 3) {
                  this.isCientRound = true;
                  this.isDetailedFeedbackEnableRemark = true;
                  this.remarksTech.setValidators([Validators.minLength(0)]);
                }
                // if tech round
                if (intType === 2 || intType === 6) {
                  /**
                   * for magerial round
                   */
                  if (intType === 6) {
                    this.isDetailedFeedbackEnableRemark = true;
                  }
                 
                  this.techManagerialCtrl = true;
                }

                this.isHrFeedback = false;
                this.isHrFeedbackFinal = false;
                this.isRequiredHrFinal = false;
                if (this.candidteRoundDetails.interviewBy == 'M' || this.candidteRoundDetails.interviewBy == 'C' || this.candidteRoundDetails.interviewBy == 'G') {
                  this.isTechnicalFeedback = false;
                  this.isTechnicalMettlFeedback = true;
                  this.scoreControl.setValidators([Validators.required])
                  this.scoreControl.updateValueAndValidity();
                  this.fileUpload.setValidators([Validators.required]);
                  this.fileUpload.updateValueAndValidity();

                  if (this.candidteRoundDetails.interviewBy == 'C') {
                    this.uploadDocLabel = 'Upload Coderbyte Document';
                    this.mettlScoreLabel = 'Assessment Score (%)';
                    this.isCoderByteActive = true;
                    //  this.getControl('score').disable();

                    this.getControl('AssessmentDate').patchValue(this.candidateOtherDetails?.coderByteAssessmentDate);
                    this.getControl('score').patchValue(this.candidateOtherDetails?.coderByteFinalScore);
                    this.fileUpload.clearValidators();
                    this.fileUpload.updateValueAndValidity();

                    // this.isInternalActive = true;
                  }
                  else if (this.candidteRoundDetails.interviewBy == 'G') {
                    this.uploadDocLabel = 'Upload DoSelect Document';
                    this.mettlScoreLabel = 'DoSelect Score';
                  }
                  else {
                    this.uploadDocLabel = 'Upload Mettl Document';
                    this.mettlScoreLabel = 'Mettl Score';
                  }

                }
                else if (this.candidteRoundDetails.interviewBy == 'E') {
                  this.isTechnicalFeedback = true;
                  this.isTechnicalExternalFeedback = true;
                  this.fileUpload.setValidators([Validators.required]);
                  this.fileUpload.updateValueAndValidity();
                  this.uploadDocLabel = 'Upload Document';

                  this.isCoderByteActive = true;
                  this.remarksTech.setValidators([Validators.minLength(0)]);
                }
                else {
                  this.isTechnicalFeedback = true;
                  this.isInternalActive = true;
                }
                this.feedbackFormHideShow();
              }
              //  HR discussion
              else if (intType === 7) {
                this.isHrFeedback = false;
                this.isSchedRemarkShow = false;
                this.isHrFeedbackFinal = true;
                this.isRequiredHrFinal = true;
                this.isTechnicalFeedback = false;
                this.isHrFeedbackDiscussion = true;
                this.hrFinal_RemarksControl.setValidators([Validators.required, Validators.minLength(this.IsRenuTeam ? 300 : 450)])
                //  this.CTCControl.reset();
                //  this.candidateStatusPlaceholder = 'Final Decision';
                this.feedbackFormHideShow();
                // this.addValidationMinMax();
                setTimeout(() => {
                  this.offeredOnControl.clearValidators();
                  this.offeredOnControl.updateValueAndValidity
                }, 1000);

              }
              /***
               * if HR Final Round
               */
              else if (intType === 4) {
                // if (this.getLocInfo.isLocationIndia(null)) {
                //   this.isIdProof = true;
                //   this.idProofReq = this.flagScreeningIdPicVidMandat ? true : false;
                //   this.addValidUploadIdVid();
                //   if (this.candidateData?.Identity?.ID) {
                //     this.idTypeControl.patchValue(this.candidateData?.Identity?.ID);
                //     // this.idTypeControl.disable();
                //     this.idNumberControl.patchValue(this.candidateData?.IdentityNo);
                //     // this.idNumberControl.disable();
                //   }
                // }
                // else {
                //   this.resetIDControlType();
                //   this.clearValidUploadIdVid();
                // }
                // this.resetIDControlType();
                // this.clearValidUploadIdVid()
                this.isHrFeedback = false;
                this.isSchedRemarkShow = false;
                this.isHrFeedbackFinal = true;
                this.isRequiredHrFinal = true;
                this.isTechnicalFeedback = false;
                this.candidateStatusPlaceholder = 'Final Decision';
                this.feedbackFormHideShow();
                this.addValidationMinMax();
              }
            }
            /**
             * if shortlist or trainable
             */

            else if (InterViewStatusId === 10 || InterViewStatusId === 7 || InterViewStatusId === 240 || InterViewStatusId === 260 || InterViewStatusId === 15) {
              this.isHrFeedback = false;
              this.isTechnicalFeedback = false;
              this.isHrFeedbackFinal = false;
              this.isRequiredHrFinal = false;
              this.isInterviewSchedule = true;
              this.isRequiredInt = true;
              this.isSchedRemarkShow = true;
              this.intSchedulingFunc();

              if (this.getLocInfo.isLocationIndia()) {
                // if(this.screenRoundFilter.length > 0){
                //   this.hideShowTech1Default(2);
                // }
                if (this.techRoundFilter?.length == 0) {
                  this.hideShowTech1Default(2);
                }
                // &&intType === 2
              } else {

              }

            }
            // if selected
            else if (InterViewStatusId === 4) {
              /**
               * if transfer true
               */
              // if (this.data.isTransfer === 1) {
              //   this.isHrFeedback = false;
              //   this.isTechnicalFeedback = false;
              //   this.isHrFeedbackFinal = false;
              //   this.isRequiredHrFinal = false;
              //   this.isInterviewSchedule = true;
              //   this.isRequiredInt = true;
              //   this.isSchedRemarkShow = true;
              // }
              // else {
              //   this.isHrFeedback = false;
              //   this.isTechnicalFeedback = false;
              //   this.isHrFeedbackFinal = true;
              //   this.isRequiredHrFinal = true;
              //   this.isInterviewSchedule = false;
              //   this.isRequiredInt = false;
              //   this.isSchedRemarkShow = false;
              // }
              this.isHrFeedback = false;
              this.isTechnicalFeedback = false;
              this.isHrFeedbackFinal = false;
              this.isRequiredHrFinal = false;
              this.isInterviewSchedule = true;
              this.isRequiredInt = true;
              this.isSchedRemarkShow = true;
              this.intSchedulingFunc();
            }
            /***
             * if on hold
             */
            else if (InterViewStatusId === 6) {
              /**
               * if interview type Hr Round
               */
              if (intType === 1 || this.data.isTransfer === 1) {
                this.isHrFeedback = false;
                this.isTechnicalFeedback = false;
                this.isHrFeedbackFinal = false;
                this.isRequiredHrFinal = false;
                this.isInterviewSchedule = true;
                this.isRequiredInt = true;
                this.isSchedRemarkShow = true;
              }
              /**
               * other
               */
              else {
                this.isHrFeedback = false;
                this.isTechnicalFeedback = false;
                this.isHrFeedbackFinal = true;
                this.isRequiredHrFinal = true;
                this.isInterviewSchedule = false;
                this.isRequiredInt = false;
                this.isSchedRemarkShow = false;
              }
              this.intSchedulingFunc();
            }

            /***
            * if on rejected
            */
            else if (InterViewStatusId === 5 || InterViewStatusId === 15) {
              /**
               * if transfer 
               */
              if (this.data.isTransfer === 1) {
                this.isHrFeedback = false;
                this.isTechnicalFeedback = false;
                this.isHrFeedbackFinal = false;
                this.isRequiredHrFinal = false;
                this.isInterviewSchedule = true;
                this.isRequiredInt = true;
                this.isSchedRemarkShow = true;
              }
              else {

                this.isSchedRemarkShow = false;
              }
              this.intSchedulingFunc();
            }

            /***
            * if cancel
            */
            else if (InterViewStatusId === 2) {
              /**
               * if transfer 
               */
              if (this.data.isTransfer === 1) {
                this.isHrFeedback = false;
                this.isTechnicalFeedback = false;
                this.isHrFeedbackFinal = false;
                this.isRequiredHrFinal = false;
                this.isInterviewSchedule = true;
                this.isRequiredInt = true;
                this.isSchedRemarkShow = true;
              }
              this.intSchedulingFunc();
            }

            else {
              this.isHrFeedback = false;
              this.isTechnicalFeedback = false;
              this.isHrFeedbackFinal = false;
              this.isRequiredHrFinal = false;
              this.isInterviewSchedule = false;
              this.isRequiredInt = false;
              this.isSchedRemarkShow = false;
            }
            /**
             * get status list
             */
            debugger
            this.getCandidateStatusList();
            this.SetDefaultValue();
            if (this.getLocInfo?.isLocationIndia(null)) {
              this.SetDefaultValueForFeedback()
            }
            this.setDynamicFormData();
            this.getautoQuestiotList()
          }

          else {
            //  alert('not work')
          }

        },
        (error) => {
          this.isloader = false;
        }
      )

    }
  }

  public isInterviewByVisible: boolean = false;
  public isMettleFeedback: boolean = false;
  public isMettleFeedbackReq: boolean = false;
  /***
   * check if tech 1 round  
   */
  tech1RoundExist() {
    if (this.techRoundFilter.length === 0) {
      this.isInterviewByVisible = true;
      this.interviewByControl.setValidators([Validators.required]);
    }
    else {
      this.isInterviewByVisible = false;
      this.interviewByControl.clearValidators();
      // this.interviewByControl.patchValue('I');

      //  this.InterbyShowHideFunc('I');
    }
    this.interviewByControl.updateValueAndValidity();
  }

  getControl(controlName) {
    return this.interviewStatus.get(controlName);
  }

  public coderByteReportUrl: string;
  /**hide show tech 1 default */
  hideShowTech1Default(type: number) {
    this.candidateOtherDetails;
    if (this.candidateOtherDetails?.Tech1InterviewById) {
      //  

      if (type == 2) {

        if (this.techRoundFilter.length === 0) {
          this.isInterviewByVisible = true;
          this.interviewByControl.setValidators([Validators.required]);

          // this.CTCControl.patchValue(this.candidteRoundDetails.CTC);
          this.getControl('candidateStatuslog').patchValue(1);
          this.getControl('interviewType').patchValue(2);
          //online assesment
          this.GetReasonForNotOptOnlineExternalAssessment(this.candidateOtherDetails?.Tech1InterviewById);

          // 1 online
          if (this.candidateOtherDetails?.Tech1InterviewById == 1) {
            this.interviewByControl.patchValue(this.candidateOtherDetails.OnlineAssesmentByShort);
            this.getControl('Venue').patchValue(this.candidateOtherDetails?.AssessmentLink);
            this.InterbyShowHideFunc(this.candidateOtherDetails.OnlineAssesmentByShort);
            if (this.candidateOtherDetails?.OnlineAssesmentByShort == 'C') {

              this.selectedCoderByteAssessment['test_id'] = this.candidateOtherDetails?.codeByteTestId;
              this.selectedCoderByteAssessment['public_url'] = this.candidateOtherDetails?.coderBytePublicKey;
              this.selectedCoderByteAssessment['display_name'] = this.candidateOtherDetails?.coderByteDisplayName;
              this.getControl('coderBytesAssesments').patchValue(this.candidateOtherDetails?.codeByteTestId);

              // this.coderByteReportUrl = this.candidateOtherDetails?.coderByteReportUrl;

            }
          }
          // 2 internal
          else if (this.candidateOtherDetails?.Tech1InterviewById == 2) {
            this.InterbyShowHideFunc(this.candidateOtherDetails.Tech1InterviewByShort);
            this.interviewByControl.patchValue(this.candidateOtherDetails.Tech1InterviewByShort);
            this.getControl('techInternalPanel').patchValue(this.candidateOtherDetails?.ReasonNotOptId);
          }
          // 3 external 
          else {
            this.interviewByControl.patchValue(this.candidateOtherDetails.Tech1InterviewByShort);
            this.InterbyShowHideFunc(this.candidateOtherDetails.Tech1InterviewByShort);
            // this.getControl('techInternalPanel').patchValue(this.candidateOtherDetails?.ReasonNotOptId);
            this.getControl('techExternalPanel').patchValue(this.candidateOtherDetails?.ReasonforOptId);
          }


        }
        else {
          this.interviewByControl.clearValidators();
          this.isInterviewByVisible = false;
          this.interviewByControl.patchValue('I');
          this.InterbyShowHideFunc('I');
          this.getControl('techInternalPanel').clearValidators();
          this.isTechInternal = false;
          this.getControl('techExternalPanel').clearValidators();
          this.isTechExternal = false;
          this.getControl('requirementChangeReason').clearValidators();
          this.isChangeDropdownAsses = false;


        }
        this.isInterviewByVisible = true;
        this.interviewByControl.setValidators([Validators.required]);

        // this.CTCControl.patchValue(this.candidteRoundDetails.CTC);
        this.getControl('candidateStatuslog').patchValue(1);
        this.getControl('interviewType').patchValue(2);
        //online assesment
        this.GetReasonForNotOptOnlineExternalAssessment(this.candidateOtherDetails?.Tech1InterviewById);

        // 1 online
        if (this.candidateOtherDetails?.Tech1InterviewById == 1) {
          this.interviewByControl.patchValue(this.candidateOtherDetails.OnlineAssesmentByShort);
          this.getControl('Venue').patchValue(this.candidateOtherDetails?.AssessmentLink);
          this.InterbyShowHideFunc(this.candidateOtherDetails.OnlineAssesmentByShort);
          if (this.candidateOtherDetails?.OnlineAssesmentByShort == 'C') {

            this.selectedCoderByteAssessment['test_id'] = this.candidateOtherDetails?.codeByteTestId;
            this.selectedCoderByteAssessment['public_url'] = this.candidateOtherDetails?.coderBytePublicKey;
            this.selectedCoderByteAssessment['display_name'] = this.candidateOtherDetails?.coderByteDisplayName;
            this.getControl('coderBytesAssesments').patchValue(this.candidateOtherDetails?.codeByteTestId);

            // this.coderByteReportUrl = this.candidateOtherDetails?.coderByteReportUrl;

          }
        }
        // 2 internal
        else if (this.candidateOtherDetails?.Tech1InterviewById == 2) {
          this.InterbyShowHideFunc(this.candidateOtherDetails.Tech1InterviewByShort);
          this.interviewByControl.patchValue(this.candidateOtherDetails.Tech1InterviewByShort);
          this.getControl('techInternalPanel').patchValue(this.candidateOtherDetails?.ReasonNotOptId);
        }
        // 3 external 
        else {
          this.interviewByControl.patchValue(this.candidateOtherDetails.Tech1InterviewByShort);
          this.InterbyShowHideFunc(this.candidateOtherDetails.Tech1InterviewByShort);
          // this.getControl('techInternalPanel').patchValue(this.candidateOtherDetails?.ReasonNotOptId);
          this.getControl('techExternalPanel').patchValue(this.candidateOtherDetails?.ReasonforOptId);
        }


      }
      else {

        this.isInterviewByVisible = false;
        this.interviewByControl.clearValidators();
        this.isInterviewByVisible = false;

      }
      this.interviewByControl.updateValueAndValidity();
      this.getControl('techInternalPanel').updateValueAndValidity();
      this.getControl('techExternalPanel').updateValueAndValidity();
      this.getControl('requirementChangeReason').updateValueAndValidity();
    }

  }

  //   <mat-option [value]="'0'">
  //   Other
  // </mat-option>

  /**coder byte details - assesment date and score */
  public coderByteDetails: any = [];
  getCoderByteDetails(id: number) {
    this.globalApiServe.getCoderByteDetails(id).subscribe(
      res => {
        this.coderByteDetails = res['data'];
      }
    )
  }
  /**internalexternal reason */
  public reasonOptingNotOptingList: any = [];
  public externalReasonOptingNotOptingList: any = [];
  GetReasonForNotOptOnlineExternalAssessment(id: number) {
    this.globalApiServe.GetReasonForNotOptOnlineExternalAssessment(id).subscribe(
      res => {
        //this.reasonOptingNotOptingList = res['data'];
        let internalIds = [1, 2, 3];
        this.reasonOptingNotOptingList = res['data'].filter(r => r.id == 1 || r.id == 2 || r.id == 3);
        this.externalReasonOptingNotOptingList = res['data'].filter(r => r.id == 2 || r.id == 4);
      }
    )
  }
  resetInterviewBy() {
    this.isInterviewByVisible = false;
    this.interviewByControl.clearValidators();
    this.interviewByControl.updateValueAndValidity();
    this.interviewByControl.patchValue('I');
    this.externalAgencyControl.clearValidators();
    this.externalAgencyControl.reset();
    this.isExternalAgency = false;
    this.isMettleFeedbackReq = false;
    setTimeout(() => {
      this.isMettleFeedback = false;
    }, 500);
    this.externalAgencyControl.updateValueAndValidity();
  }

  /***
   * getIdTYpe
   */
  getIdType() {
    this._intCommonServe.getIdType().subscribe(
      res => {
        this.idTypeData = res;
      }
    )
  }

  public getterMethod(val) {
    if (val <= 2 || val == 3 || val >= 3) {
      return true;
    }
    else {
      return false;
    }
  }


  public isSchedRemarkShow: boolean = false;
  /***
   * get candidate status list
   */
  getCandidateStatusList() {
    this.isloader = true;
    let candSt = this.candidteRoundDetails.InterViewStatus.Id;
    let intType = this.candidteRoundDetails.interviewType.Id;
    this._intCommonServe.getIntStatusList().subscribe(
      res => {
        this.isloader = false;
        let filterById;
        /**
         * if shorlisted or trainable
         */
        if (candSt === 7 || candSt === 10 || candSt === 240 || candSt === 260 || candSt === 15) {
          filterById = [1];
          // this.isSchedRemarkShow = true;
        }
        /***
         * if scheduled
         */
        else if (candSt === 1 || candSt === 3) {
          /***
           * if HR final Round
           */
          if (intType === 4) {
            filterById = [4, 5, 6];
          }
          /***
          * if  tech Round or mangerial round
          */
          else if (intType === 2 || intType === 6) {
            filterById = [5, 7, 10];
            if (this.candidteRoundDetails.interviewBy == 'M' || this.candidteRoundDetails.interviewBy == 'C') {
              filterById = [5, 7, 15];
            }
          }
          /***
         * if  management/client Round
         */
          else if (intType === 5 || intType === 3 || intType === 7) {
            filterById = [5, 7];
          }
          /***
          * if HR  Round
          */
          else if (intType === 1) {
            filterById = [5, 7, 6];
          }
          else {
            filterById = [5, 6, 7];
          }
        }
        /***
         * selected
         */
        else if (candSt === 4) {
          // if (this.data?.isTransfer === 1) {
          //   filterById = [1];
          // }
          // else {
          //   filterById = [4, 5, 6];
          // }
          filterById = [1];
        }
        /***
           * rejected
           */
        else if (candSt === 5 || candSt === 15 || candSt === 2) {
          // if transfer
          if (this.data?.isTransfer === 1) {
            filterById = [1];
            // this.isSchedRemarkShow = true;
          }
          else {
            filterById = [4, 5, 6];
          }
        }


        /**
         * on hold
         */
        else if (candSt === 6) {
          if (intType === 1 || this.data?.isTransfer === 1) {
            filterById = [1];
          }
          else {
            filterById = [4, 5];
          }
        }

        else {
          filterById = [6];
        }
        let filterByStatus = res.filter(t => {
          return filterById.indexOf(t.statusId) !== -1;
        });
        this.statusList = filterByStatus;
      },
      (error) => {
        this.isloader = false;
      }
    );
  }

  /***
   * get Interview Mode
   */
  getIntMode() {
    this.isloader = true;
    this._intCommonServe.getIntMode().subscribe(
      res => {
        this.intModeData = res;
        this.isloader = false;
      },
      (error) => {
        this.isloader = false;
      }
    );
  }
  /***
  * get Interview Locations For India
  */
  getIntLocationsList() {
    this.isloader = true;
    this.globalApiServe.getLocationList().subscribe(
      res => {
        let ids = [];
        // if (this.divisionID == 7 || this.divisionID == 1) {
        ids = [1, 2, 4, 5, 16,23];
        // } else {
        //   ids = [1, 2, 4, 5];
        // }
        let filterLocation = res['data'].filter(loc => {
          return ids.indexOf(loc.LocID) !== -1;
        })
        this.intLocationList = filterLocation;
      }
    );
  }
  /**
   * get interview Type
   */
  public isC2hProfile: boolean = true;
  getIntType() {
    this.isloader = true;
    this.globalApiServe.getIntType().subscribe(
      res => {
        this.data

        this.InterviewTypeData = res['data'];
        /**only managerial round and hr offer discussion rond for c2h */
        if (this.data?.requirementTypeId == 6) {
          this.InterviewTypeData = res['data'].filter(t => t.id == 4 || t.id == 6);
        } else {
          if (!this.isG4Hiring || this.getLocInfo.isLocationUS(null)) {
            this.InterviewTypeData = res['data'].filter(t => t.id != 7);
          }
          else {

            this.InterviewTypeData = res['data'];
          }

        }

        this.isloader = false;
      }
    ),
      (error) => {
        this.isloader = false;
      }
  }



  /***
   * form Init
   */
  formInit() {
    this.interviewStatus = this._fb.group({
      candidateStatuslog: [null, [Validators.required]],
      screenRejectId: [null],
      interviewType: [null],
      interviewDate: [null],
      AssessmentDate: [null],
      interviewDateTimeZone: [null],
      interviewTimeHours: [null],
      interviewTimeMint: [null],
      IntModeType: [null],
      InterviewLocationId: [null],
      interviewDuration: [null],
      Venue: [null],
      panel: [null],
      AdditionalInterviewer: [null],
      RoundDetails: [null],
      fileUpload: [null],
      UploadProfilePic: [null],
      UploadVideo: [null],
      UploadCandId: [null],
      iConfirmedCheckBox: [null, [Validators.required]],
      iConfirmedVidExcepCheckBox: [null],
      remarks: [null,],
      score: [null],
      idType: [null],
      fileUploadHR: [null],
      isOfferInHand: [null],
      OfferInHandAmount: [null],
      fileUploadOffer: [null],
      offerCompnay: [null],
      offerConsnet: [null],
      docOpt: [null],
      interviewBy: [null],
      externalAgency: [null],
      //
      idNumber: [null],
      hrFinal_Remarks: [null],
      coderBytesAssesments: [null],
      techInternalPanel: [null],
      techExternalPanel: [null],
      requirementChangeReason: [null],
      approvalFile: [null],
      EntityId: [null],
      hrForm: this._fb.group({

        skillsRatingDetails: this._fb.array([]),
        hrRatings: this._fb.group({
          communication: this._fb.group({
            comments: [null],
            ratings: [null]
          }),
          personalityAndPresentability: this._fb.group({
            comments: [null],
            ratings: [null]
          }),
          learnAndGrowthPotential: this._fb.group({
            comments: [null],
            ratings: [null]
          }),
          adaptability: this._fb.group({
            comments: [null],
            ratings: [null]
          }),
          attitude: this._fb.group({
            comments: [null],
            ratings: [null]
          }),
          stability: this._fb.group({
            comments: [null],
            ratings: [null]
          }),
          technicalS: this._fb.group({
            comments: [null],
            ratings: [null]
          }),
        }),
        finalDecision: [null],
        DesignationId: [null],
        CTC: [null],
        joiningBonus: [null],
        annualVariablePay: [null],
        NoticeBuyOut: [null],
        TravelExp: [null],
        RelocationExp: [null],
        RetentionBonus: [null],
        // salary: [null],
        primarySkillId: [null],
        offeredBy: [null],
        offeredOn: [new Date()],
        recruiterId: [null],
        // hrFinal_Remarks: [null]
      }),
      technicalForm: this._fb.group({
        techRatingDetails: this._fb.array([]),
        remarkNextLevel: [null],
        strengths: [null],
        limitations: [null],
        technical: [null],
        nonTechnical: [null],
        evaulation: [null],
        remarks: [null],
        // remarks: [null, [Validators.minLength(this.IsRenuTeam ? 300 : 450)]],
        // groomable: ['N'],
        GroomableArea1: [null],
        GroomableArea2: [null],
        GroomableArea3: [null],
        // groomableSkills: this._fb.array([]),
        autoQuestionDetails: this._fb.array([]),
        fundamentalKnowledgForm: this._fb.group({
          assessRoleKnowledg: [null],
        }),
        prblmSolvingSkillForm: this._fb.group({
          // candidateApprochComplexPrblm: [null],
          candidatePrblmSolvingApproch: [null],
        }),
        // industryDomainKnowledgForm: this._fb.group({
        //   candidatePossesIndustryDomExp: [null],
        // }),
        CulturatFitAdaptabilityForm: this._fb.group({
          candidateFitForInfogain: [null],
          // candidateAbilityToAdoptChangeWork: [null],
        }),
      }),

    });


    if (this.data?.requirementTypeId == 6) {
      if (this.data?.IsDetailedFeedbackDisableForAccount == 'Y' || this.getLocInfo.isLocationUS(null)) {
        this.getControl('technicalForm').get('remarks').setValidators([Validators.minLength(200)]);
      } else {
        this.getControl('technicalForm').get('remarks').setValidators([Validators.minLength(250)]);
      }
    } else {
      if (this.data?.IsDetailedFeedbackDisableForAccount == 'Y' || this.getLocInfo.isLocationUS(null)) {
        this.getControl('technicalForm').get('remarks').setValidators([Validators.minLength(this.IsRenuTeam ? 300 : 200)]);
      } else {
        this.getControl('technicalForm').get('remarks').setValidators([Validators.minLength(this.IsRenuTeam ? 300 : 450)]);
      }
    }
  }
  public isAddSkillFrom: string = '';
  setDynamicFormData() {
    let intType = this.candidteRoundDetails.interviewType.Id;
    // || ( !this.isInterviewSchedule && !this.isHrFeedbackFinal )
    if ((this.isHrFeedback && !this.IsRenuTeam) || (!this.isInterviewSchedule && !this.isHrFeedbackFinal && !this.isTechnicalMettlFeedback && !this.isTechnicalExternalFeedback && !this.isCientRound)) {
      if (intType == 3 || intType == 5) {
        let formDefaultRatingData;
        if (this.getLocInfo.isLocationIndia(null)) {
          formDefaultRatingData = ['Communication', 'Confidence', 'Role Compatability', 'Domain Knowledge', 'Leadership Quality', 'Technical Knowledge', 'Overall Rating',];
        } else {
          formDefaultRatingData = ['Communication', 'Confidence', 'Role Compatibility', 'Domain Knowledge', 'Leadership Quality', 'Technical Knowledge', 'Overall Rating',];
        }
        if (this.candidteRoundDetails?.IsFeedbackSaveOrDraft == 'D' && this.candidteRoundDetails?.areas?.length != 0) {
          let DraftedRatingData = this.candidteRoundDetails.areas;
          this.techDynamicFormForDraftedFeedback(DraftedRatingData, 'ORound');
        } else {
          this.techDynamicForm(formDefaultRatingData);
        }
        this.isAddSkillFrom = 'ORound';
      } else if (intType == 1) {
        let formDefaultRatingData = ['',];
        this.techDynamicForm(formDefaultRatingData, 'SRound');
        this.isAddSkillFrom = 'SRound';
      }
      else {
        let formDefaultRatingData;
        // let formDefaultRatingData = ['Role Fitment', 'Communication', 'Confidence', 'Skill1', 'Skill2', 'Skill3', 'Overall Rating'];        
        if (this.getLocInfo.isLocationIndia(null)) {
           formDefaultRatingData = [ 'Communication', 'Confidence', 'Role Compatability','Aggregate Skill Rating', 'Overall Rating'];
         // formDefaultRatingData = ['Role Compatability', 'Communication', 'Confidence', 'Aggregate Skill Rating', 'Overall Rating'];
        } else {
           formDefaultRatingData = [ 'Communication', 'Confidence', 'Role Compatability','Aggregate Skill Rating', 'Overall Rating'];
         // formDefaultRatingData = ['Role Compatibility', 'Communication', 'Confidence', 'Aggregate Skill Rating', 'Overall Rating'];
        }
        if (this.candidteRoundDetails?.IsFeedbackSaveOrDraft == 'D' && this.candidteRoundDetails?.areas?.length != 0) {
          let DraftedRatingData = this.candidteRoundDetails.areas;
          this.techDynamicFormForDraftedFeedback(DraftedRatingData, 'TRound');
        } else {
          this.techDynamicForm(formDefaultRatingData, 'TRound');
        }
        this.isAddSkillFrom = 'TRound';
      }
    }

  }

  /***
 * on mode change 
 */
  public isInterviewLocVisible: boolean = false;
  onSelectModeInt(event: any): void {
    this.venueControl.reset();
    this.InterviewLocationId.reset();
    this.venueControl.clearValidators();
    let id = event.value;
    if (id == "6" || id == '3') {
      this.venueControl.disable();
      this.isInterviewLocVisible = false;
      this.InterviewLocationId?.clearValidators();
    } else if (id == '2' && this.getLocInfo.isLocationIndia(null)) {
      this.venueControl.enable();
      this.isInterviewLocVisible = true;
      this.InterviewLocationId?.addValidators([Validators.required]);
    }
    else {
      this.isInterviewLocVisible = false;
      this.InterviewLocationId?.clearValidators();
      this.venueControl.enable();
    }
    this.venueControl.updateValueAndValidity();
    this.InterviewLocationId?.updateValueAndValidity();
  }

  /***
 * on selectoin of interview location 
 */
  onSelectInterviewLoc(event: any): void {
    if (this.getLocInfo.isLocationIndia(null)) {
      if (event.value == '0') {
        this.venueControl.reset();
        this.venueControl.addValidators([Validators.required]);
      } else {
        this.venueControl.clearValidators();
        let venueDetails = this.intLocationList.filter(t => t.LocID == event.value)[0]?.ShortAddress;
        this.venueControl.patchValue(venueDetails);
      }
      this.venueControl.updateValueAndValidity();
    }
  }

  public showSelectedValueOfferBy: boolean = false;
  public SelectedValueOfferBy: string = '';
  public isConsentSign: boolean = true;
  public isConsentSignVidExcep: boolean = false;
  SetDefaultValue() {
    if (this.getLocInfo.isLocationIndia(null)) {
      this.interviewDateTimeZoneCtrl.patchValue('Asia/Kolkata');
    }
    this.primarySkillIdControl.patchValue(this.candidateData.primarySkill.Id);
    this.CTCControl.patchValue(this.candidateData.SalaryExp);
    this.recruiterIdControl.patchValue(this.candidateData.recruiter.Name);
    let InterViewStatusId = this.candidteRoundDetails.InterViewStatus.Id;
    let intType = this.candidteRoundDetails.interviewType.Id;
    //  this.primarySkillIdControl.patchValue(this.candidateData.primarySkill.Id);
    if (intType === 4) {
      if (InterViewStatusId === 4 || InterViewStatusId === 6) {
        setTimeout(() => {
          this.showSelectedValueOfferBy = true;
          this.SelectedValueOfferBy = this.candidteRoundDetails.offeredby.Id;
        }, 500);
        this.CTCControl.patchValue(this.candidteRoundDetails.CTC);
        this.joiningBonusControl.patchValue(this.candidteRoundDetails.joiningBonus);
        this.annualVariablePayControl.patchValue(this.candidteRoundDetails?.AnnualVariablePay);
        this.NoticeBuyOutControl.patchValue(this.candidteRoundDetails.NoticeBuyOut);
        this.TravelExpControl.patchValue(this.candidteRoundDetails.TravelExp);
        this.RelocationExpControl.patchValue(this.candidteRoundDetails.RelocationExp);
        this.RetentionBonusExpControl.patchValue(this.candidteRoundDetails.RetentionBonus);
        this.designationIdControl.patchValue(this.candidteRoundDetails._designation.Id);
        // this.salaryControl.patchValue(this.candidteRoundDetails.salary);
        this.offeredOnControl.patchValue(this.candidteRoundDetails.offeredOn ? new Date(this.candidteRoundDetails.offeredOn) : '');
        this.hrFinal_RemarksControl.patchValue(this.candidteRoundDetails.hrFinal_Remarks);
        // this.offeredByControl.patchValue(this.candidteRoundDetails.offeredby.Id);
        this.primarySkillIdControl.patchValue(this.candidteRoundDetails.primarySkill.Id);
      }
      else {
        setTimeout(() => {
          this.showSelectedValueOfferBy = true;
          this.SelectedValueOfferBy = this._storage.getUserEmpId();
        }, 500);
      }
    }
    if (intType === 7) {
      this.CTCControl.reset();
      this.primarySkillIdControl.reset();
      this.recruiterIdControl.reset();
      this.offeredOnControl.reset();
    }

    if ((this.isTechnicalFeedback === true || this.isHrFeedbackFinal) && this.candidteRoundDetails?.IsPicturePresent != 'Y' && this.isCientRound === false && this.data?.IsExceptionVideo == 'N' && this.getLocInfo.isLocationIndia(null)) {
      if (!this.isTechnicalMettlFeedback) {
        this.UploadProfilePic.setValidators([Validators.required]);
      }
      if (this.isTechnicalExternalFeedback) {
        this.UploadProfilePic.clearValidators();
      }
      if (InterViewStatusId == 4 || InterViewStatusId == 6) {
        this.UploadProfilePic.clearValidators();
      }
    }
    else {
      this.UploadProfilePic.clearValidators();
    }
    this.UploadProfilePic.updateValueAndValidity();

    if (!this.getLocInfo.isLocationIndia(null) || (this.isInterviewSchedule === true || this.isCientRound || this.isHrFeedback
      || this.isTechnicalMettlFeedback || this.isTechnicalExternalFeedback || (this.isHrFeedbackFinal && (InterViewStatusId == 4 || InterViewStatusId == 6))
      || this.data?.IsExceptionVideo == 'Y' || this.candidteRoundDetails?.IsPicturePresent == 'Y')) {
      this.validatorCheckBoxConsent(false);
      this.isConsentSign = false;
    }
    /*  if (this.isTechnicalFeedback === true) {
        this.UploadProfilePic.setValidators([Validators.required]);
      }*/
    if (this.data?.IsExceptionVideo == 'Y' && this.profileVid?.length != 0 &&
      (!this.isCientRound && !this.isHrFeedback
        && !this.isTechnicalMettlFeedback && !this.isTechnicalExternalFeedback && !(this.isHrFeedbackFinal && (InterViewStatusId == 4 || InterViewStatusId == 6)))) {
      this.validatorCheckBoxConsent(true);
      this.isConsentSignVidExcep = true;
    } else {
      this.validatorCheckBoxConsent(false);
      this.isConsentSignVidExcep = false;
    }
  }

  SetDefaultValueForFeedback() {

    let intType = this.candidteRoundDetails.interviewType.Id;
    let interviewBy = this.candidteRoundDetails.interviewBy;
    let intStatusId = this.candidteRoundDetails.InterViewStatus.Id;
    setTimeout(() => {
      if (intStatusId == 1 || intStatusId == 3) {
        if ((intType == 2 && interviewBy == 'I') || intType == 5 || intType == 6) {
          if (this.candidteRoundDetails?.TempStatusId != 0) {
            this.getControl('candidateStatuslog').patchValue(this.candidteRoundDetails?.TempStatusId);
          } else {
            this.getControl('candidateStatuslog').patchValue(null)
          }
          this.remarksTech.patchValue(this.candidteRoundDetails?.techRemarks);
          this.strengthsControl.patchValue(this.candidteRoundDetails?.strengths)
          this.limitationsControl.patchValue(this.candidteRoundDetails?.limitations)
          this.technicalControl.patchValue(this.candidteRoundDetails?.technical)
          this.nonTechnicalControl.patchValue(this.candidteRoundDetails?.nonTechnical)
        }
        else if (intType == 4 || intType == 7) {
          if (this.candidteRoundDetails?.TempStatusId != 0) {
            this.getControl('candidateStatuslog').patchValue(this.candidteRoundDetails?.TempStatusId);
          } else {
            this.getControl('candidateStatuslog').patchValue(null)
          }
          this.hrFinal_RemarksControl.patchValue(this.candidteRoundDetails?.hrFinal_Remarks ? this.candidteRoundDetails?.hrFinal_Remarks : null);
          this.designationIdControl.patchValue(this.candidteRoundDetails._designation.Id ? this.candidteRoundDetails._designation.Id : null);
          this.CTCControl.patchValue(this.candidteRoundDetails.CTC ? this.candidteRoundDetails.CTC : null);
          this.joiningBonusControl.patchValue(this.candidteRoundDetails.joiningBonus);
          this.NoticeBuyOutControl.patchValue(this.candidteRoundDetails.NoticeBuyOut);
          this.TravelExpControl.patchValue(this.candidteRoundDetails.TravelExp);
          this.RelocationExpControl.patchValue(this.candidteRoundDetails.RelocationExp);
          this.RetentionBonusExpControl.patchValue(this.candidteRoundDetails.RetentionBonus);
          this.primarySkillIdControl.patchValue(this.candidteRoundDetails.primarySkill.Id ? this.candidteRoundDetails.primarySkill.Id : null);
          setTimeout(() => {
            this.showSelectedValueOfferBy = true;
            this.SelectedValueOfferBy = this.candidteRoundDetails.offeredby.Id;
          }, 500);
          // this.offeredByControl.patchValue(this.candidteRoundDetails.offeredby.Id ? this.candidteRoundDetails.offeredby.Id : null);
          if (this.candidteRoundDetails.offeredOn != null || this.candidteRoundDetails.offeredOn != '') {
            this.offeredOnControl.patchValue(this.candidteRoundDetails.offeredOn != null || this.candidteRoundDetails.offeredOn != '' ? new Date(this.candidteRoundDetails.offeredOn) : 'null');
          }
          this.recruiterIdControl.patchValue(this.candidteRoundDetails.recruiter.Name);

        } else {
        }
      }
    }, 1000);

  }
  /**
   * 
   * @param val 
   */

  validatorCheckBoxConsent(val: boolean) {
    if (val) {
      // this.iConfirmedCheckBoxCtrl.setValidators([Validators.required]);
    }
    else {
      this.iConfirmedCheckBoxCtrl.clearValidators();
    }
    this.iConfirmedCheckBoxCtrl.updateValueAndValidity();
  }

  validatorCheckBoxConsentVidExcep(val: boolean) {
    if (val) {
      this.iConfirmedVidExcepCheckBoxCtrl.setValidators([Validators.required]);
    }
    else {
      this.iConfirmedVidExcepCheckBoxCtrl.clearValidators();
    }
    this.iConfirmedVidExcepCheckBoxCtrl.updateValueAndValidity();
  }


  /**questionnaire code stars */
  public step: number = 0;
  setStep(index: number) {
    this.step = index;
  }

  // public isHideNextButton: boolean = false;
  nextStep() {
    this.step++;

  }

  prevStep() {
    this.step--;
  }
  public countNonSpaceChars(str: string): number {
    const noSpaces = str.replace(/\s/g, '');
    return noSpaces.length;
  }
  get fundamentalKnowledgFormControl() { return <UntypedFormArray>this.interviewStatus['controls'].technicalForm['controls'].fundamentalKnowledgForm };
  //get prblmSolvingSkillFormControl() { return <FormArray>this.interviewStatus['controls'].technicalForm['controls'].prblmSolvingSkillForm; };
  get prblmSolvingSkillFormControl() { return <UntypedFormArray>this.interviewStatus['controls'].technicalForm['controls'].prblmSolvingSkillForm };
  get CulturatFitAdaptabilityFormControl() { return <UntypedFormArray>this.interviewStatus['controls'].technicalForm['controls'].CulturatFitAdaptabilityForm };


  /**method to add/remove validation for details feedback technical quesnionnaire */
  addRemoveValidationForQuestionnaire(isActive: boolean) {
    // this.candidteRoundDetails;
    // RoundId
    // this.data.cid
    this.getFeedbackDetails(this.data?.cid, this.candidteRoundDetails?.RoundId);
    let assessRoleKnowledg = this.fundamentalKnowledgFormControl.get("assessRoleKnowledg");
    // let candidateApprochComplexPrblm = this.prblmSolvingSkillFormControl.get("candidateApprochComplexPrblm");
    let candidatePrblmSolvingApproch = this.prblmSolvingSkillFormControl.get("candidatePrblmSolvingApproch");
    let candidateFitForInfogain = this.CulturatFitAdaptabilityFormControl.get("candidateFitForInfogain");
    // let candidateAbilityToAdoptChangeWork = this.CulturatFitAdaptabilityFormControl.get("candidateAbilityToAdoptChangeWork");
    if (isActive && !this.isTechnicalExternalFeedback) {
      assessRoleKnowledg.addValidators([Validators.required, CustomValidation.minLenNoWhitespace(100)]);
      // candidateApprochComplexPrblm.addValidators([Validators.required, CustomValidation.minLenNoWhitespace(100)]);
      candidatePrblmSolvingApproch.addValidators([Validators.required, CustomValidation.minLenNoWhitespace(100)]);
      candidateFitForInfogain.addValidators([Validators.required, CustomValidation.minLenNoWhitespace(100)]);
      // candidateAbilityToAdoptChangeWork.addValidators([Validators.required, CustomValidation.minLenNoWhitespace(100)]);
  
      if (this.fundamentalKnowledgFormControl?.invalid) {
        this.step = 0;
        this._share.showAlertErrorMessage.next('Please fill the (Tab 0) - Fundamental Knowledge.');
      }
      else if (this.prblmSolvingSkillFormControl?.invalid) {
        this.step = 1;
        this._share.showAlertErrorMessage.next('Please fill the (Tab 1) - Problem Solving and Logical Thinking.');
      }
      else if (this.CulturatFitAdaptabilityFormControl?.invalid) {
        this.step = 2;
        this._share.showAlertErrorMessage.next('Please fill the (Tab 5) - Cultural Fit & Adaptability.');
      }
    } else {
      assessRoleKnowledg.clearValidators();
      // candidateApprochComplexPrblm.clearValidators();
      candidatePrblmSolvingApproch.clearValidators();
      candidateFitForInfogain.clearValidators();
      // candidateAbilityToAdoptChangeWork.clearValidators();
    }
    assessRoleKnowledg.updateValueAndValidity();
    // candidateApprochComplexPrblm.updateValueAndValidity();
    candidatePrblmSolvingApproch.updateValueAndValidity();
    candidateFitForInfogain.updateValueAndValidity();
    // candidateAbilityToAdoptChangeWork.updateValueAndValidity();

  }

  /**getting detailed feedback quesionnaire draft data  */
  public questionnaireFeedbackDetails: any = [];
  getFeedbackDetails(cid: number, roundId: number) {
    this._intServe.getFeedbackQuesionnaire(cid, roundId).subscribe(
      res => {
        this.questionnaireFeedbackDetails = res['data'][0];
        this.setDefaultValueToQuestionnaire(this.questionnaireFeedbackDetails);
      }
    )
  }

  /**set draft value to quesionnaire detailed feedback */
  setDefaultValueToQuestionnaire(data: any = {}) {
    this.fundamentalKnowledgFormControl.get('assessRoleKnowledg').patchValue(data?.assessRoleKnowledg ? data?.assessRoleKnowledg : '');
    // this.prblmSolvingSkillFormControl.get('candidateApprochComplexPrblm').patchValue(data?.candidateApprochComplexPrblm ? data?.candidateApprochComplexPrblm : '');
    this.prblmSolvingSkillFormControl.get('candidatePrblmSolvingApproch').patchValue(data?.candidatePrblmSolvingApproch ? data?.candidatePrblmSolvingApproch : '');
    this.CulturatFitAdaptabilityFormControl.get('candidateFitForInfogain').patchValue(data?.candidateFitForInfogain ? data?.candidateFitForInfogain : '');
    // this.CulturatFitAdaptabilityFormControl.get('candidateAbilityToAdoptChangeWork').patchValue(data?.candidateAbilityToAdoptChangeWork ? data?.candidateAbilityToAdoptChangeWork : '');
  }

  /**questionnaire code ends */
  get techRatingCtrlControl() {
    return this.techRatingDetails['controls']
  }
  get skillsRatingCtrlControl() {
    return this.skillsRatingDetails['controls']
  }
  get techRatingDetails() { return <UntypedFormArray>this.interviewStatus['controls'].technicalForm['controls'].techRatingDetails; };
  get autoQuestionDetailsCtrl() {
    return this.autoQuestionDetailsCt['controls']
  }

  get autoQuestionDetailsCt() { return <UntypedFormArray>this.interviewStatus['controls'].technicalForm['controls'].autoQuestionDetails; };

  // get autoQuestionDetailsCt() {
  //   return <FormArray>this.interviewStatus['controls'].technicalForm['controls'].autoQuestionDetails;
  // }
  get skillsRatingDetails() { return <UntypedFormArray>this.interviewStatus['controls'].hrForm['controls'].skillsRatingDetails; };
  get hrForm() { return this.interviewStatus.get('hrForm') }
  get technicalForm() { return this.interviewStatus.get('technicalForm') }
  get hrRating() { return this.hrForm.get('hrRatings') }
  get recruiterIdControl() { return this.hrForm.get('recruiterId') }
  get offeredByControl() { return this.hrForm.get('offeredBy') }
  get primarySkillIdControl() { return this.hrForm.get('primarySkillId') }
  get designationIdControl() { return this.hrForm.get('DesignationId') }
  get CTCControl() { return this.hrForm.get('CTC') }
  get joiningBonusControl() { return this.hrForm.get('joiningBonus') }
  get annualVariablePayControl() { return this.hrForm.get('annualVariablePay') }
  get NoticeBuyOutControl() { return this.hrForm.get('NoticeBuyOut') }
  get TravelExpControl() { return this.hrForm.get('TravelExp') }
  get RelocationExpControl() { return this.hrForm.get('RelocationExp') }
  get RetentionBonusExpControl() { return this.hrForm.get('RetentionBonus') }
  get iConfirmedCheckBoxCtrl() { return this.interviewStatus.get('iConfirmedCheckBox') }
  get iConfirmedVidExcepCheckBoxCtrl() { return this.interviewStatus.get('iConfirmedVidExcepCheckBox') }
  // get salaryControl() { return this.hrForm.get('salary') }
  get offeredOnControl() { return this.hrForm.get('offeredOn') }
  get hrFinal_RemarksControl() { return this.interviewStatus.get('hrFinal_Remarks') }
  get hrRatingcommunication() { return this.hrRating.get('communication') }
  get personalityAndPresentability() { return this.hrRating.get('personalityAndPresentability') }
  get learnAndGrowthPotential() { return this.hrRating.get('learnAndGrowthPotential') }
  get adaptability() { return this.hrRating.get('adaptability') }
  get attitude() { return this.hrRating.get('attitude') }
  get stability() { return this.hrRating.get('stability') }
  get technicalS() { return this.hrRating.get('technicalS') }
  get finalDecisionHr() { return this.hrForm.get('finalDecision') }
  get groomableSkills() { return <UntypedFormArray>this.interviewStatus['controls'].technicalForm['controls'].groomableSkills; }
  // get autoQuestionDetailsCtrl() { return <FormArray>this.interviewStatus['controls'].technicalForm['controls'].autoQuestionDetails; }
  get interviewType() { return this.interviewStatus.get('interviewType'); }
  get interviewDate() { return this.interviewStatus.get('interviewDate'); }
  get interviewDateTimeZoneCtrl() { return this.interviewStatus.get('interviewDateTimeZone'); }

  get interviewTimeHours() { return this.interviewStatus.get('interviewTimeHours'); }
  get IntModeType() { return this.interviewStatus.get('IntModeType'); }
  get InterviewLocationId() { return this.interviewStatus.get('InterviewLocationId'); }
  get interviewDurationCtrl() { return this.interviewStatus.get('interviewDuration'); }
  get venueControl() { return this.interviewStatus.get('Venue'); }
  get panelControl() { return this.interviewStatus.get('panel'); }
  get scoreControl() { return this.interviewStatus.get('score'); }
  get adpanelControl() { return this.interviewStatus.get('AdditionalInterviewer'); }
  get RoundDetails() { return this.interviewStatus.get('RoundDetails'); }
  get fileUpload() { return this.interviewStatus.get('fileUpload'); }
  //
  get UploadProfilePic() { return this.interviewStatus.get('UploadProfilePic'); }
  get UploadVideo() { return this.interviewStatus.get('UploadVideo'); }
  get UploadCandId() { return this.interviewStatus.get('UploadCandId'); }
  get remarks() { return this.interviewStatus.get('remarks'); }
  get GroomableArea1() { return this.technicalForm.get('GroomableArea1') }
  get GroomableArea2() { return this.technicalForm.get('GroomableArea2') }
  get GroomableArea3() { return this.technicalForm.get('GroomableArea3') }
  get remarksTech() { return this.technicalForm.get('remarks'); }
  get remarkNextLevel() { return this.technicalForm.get('remarkNextLevel'); }
  get idTypeControl() { return this.interviewStatus.get('idType'); }
  get idNumberControl() { return this.interviewStatus.get('idNumber'); }
  get strengthsControl() { return this.technicalForm.get('strengths'); }
  get limitationsControl() { return this.technicalForm.get('limitations'); }
  get technicalControl() { return this.technicalForm.get('technical'); }
  get nonTechnicalControl() { return this.technicalForm.get('nonTechnical'); }
  //
  get interviewByControl() { return this.interviewStatus.get('interviewBy') }
  get externalAgencyControl() { return this.interviewStatus.get('externalAgency') }
  get screenRejectIdCtrl() { return this.interviewStatus.get('screenRejectId') }
  get fileUploadHRCtrl() { return this.interviewStatus.get('fileUploadHR'); }
  get isOfferInHandCtrl() { return this.interviewStatus.get('isOfferInHand'); }
  get fileUploadOfferCtrl() { return this.interviewStatus.get('fileUploadOffer'); }
  get offerCompnayCtrl() { return this.interviewStatus.get('offerCompnay'); }
  get offerConsnetCtrl() { return this.interviewStatus.get('offerConsnet'); }
  get docOptCtrl() { return this.interviewStatus.get('docOpt'); }
  get OfferInHandAmountCtrl() { return this.interviewStatus.get('OfferInHandAmount'); }

  get approvalFileUpCtrl() { return this.interviewStatus.get('approvalFile'); }
  get EntityIdCtrl() { return this.interviewStatus.get('EntityId'); }
  compareFn: ((f1: any, f2: any) => boolean) | null = this.compareByValue;

  compareByValue(f1: any, f2: any) {
    return f1 && f2 && f1.SkillId === f2.SkillId;
  }

  // getControl(name:string){
  //   return this.ApprovalActionForm.get(name);
  // }
  /***
   * upload option
   */
  public imgFile: any;
  fileUp(event) {
    let allowedExtensions = /(\.jpg|\.jpeg|\.png|\.txt|\.pdf|\.doc|\.msg|\.docx|\.rtf|\.csv|\.xls|\.xlsx)$/i;
    let file = event.target.files[0];
    let fileName = file.name;
    if (!allowedExtensions.exec(fileName)) {
      this._share.showAlertErrorMessage.next('Please upload file type  jpeg/jpg/png/txt/pdf/doc/docx/rtf/csv/xls/xlsx only.');
      event.target.value = "";
      this.imgFile = '';
      return false;
    }
    else if (file.size > FILE_UPLOAD.FILE_SIZE) {
      this._share.showAlertErrorMessage.next('file  cannot be greater than 15MB.');
      event.target.value = "";
      this.imgFile = '';
      return false;
    }
    else {
      this.imgFile = file;
    }
  }

  /***
   * upload approval file when interview by change from demand creation
   */
  public approvalFile: any;
  approvalFileUp(event) {

    let allowedExtensions = /(\.jpg|\.jpeg|\.png|\.txt|\.pdf|\.doc|\.msg|\.docx|\.rtf|\.csv|\.xls|\.xlsx)$/i;
    let file = event.target.files[0];
    let fileName = file.name;
    if (!allowedExtensions.exec(fileName)) {
      this._share.showAlertErrorMessage.next('Please upload file type  jpeg/jpg/png/txt/pdf/doc/docx/rtf/csv/xls/xlsx only.');
      event.target.value = "";
      this.approvalFile = '';
      return false;
    }
    else if (file.size > FILE_UPLOAD.FILE_SIZE) {
      this._share.showAlertErrorMessage.next('file  cannot be greater than 15MB.');
      event.target.value = "";
      this.approvalFile = '';
      return false;
    }
    else {

      this.approvalFile = file;
    }
  }

  /***
   *sal supporting Doc upload option for Hr round
   */
  public imgFileHR: any = [];
  fileUpHR(event) {
    this.imgFileHR = [];
    let allowedExtensions = /(\.jpg|\.jpeg|\.png|\.txt|\.pdf|\.doc|\.docx|\.rtf|\.msg|\.xlsx)$/i;
    let files = event.target.files;
    if (files.length > 3) {
      this._share.showAlertErrorMessage.next('You can upload max of 3 Documents.');
      this.fileUploadHRCtrl.reset();
    } else {
      for (let i = 0; i < files.length; i++) {
        let fileName = files[i].name;
        if (!allowedExtensions.exec(fileName)) {
          this._share.showAlertErrorMessage.next(fileName + 'is not  valid document type. Please upload file type  jpeg/jpg/png/txt/pdf/doc/docx/rtf/msg/xlsx only.');
          event.target.value = "";
          this.imgFileHR = [];
          return false;
        }
        else if (files[i].size > FILE_UPLOAD.FILE_SIZE) {
          this._share.showAlertErrorMessage.next('Image  uploaded cannot be greater than 15MB.');
          event.target.value = "";
          this.imgFileHR = [];
          return false;

        }
        else {
          this.imgFileHR.push(files[i]);
        }

      }

      this.imgFileHR = [...this.imgFileHR];
    }
  }

  /***
   *
   */
  public imgFileOffer: any;

  fileUpHROffer(event) {
    let allowedExtensions = /(\.jpg|\.jpeg|\.png|\.txt|\.pdf|\.doc|\.msg|\.docx|\.rtf|\.csv|\.xls|\.xlsx)$/i;
    let file = event.target.files[0];
    let fileName = file.name;
    if (!allowedExtensions.exec(fileName)) {
      this._share.showAlertErrorMessage.next('Please upload file type  jpeg/jpg/png/txt/pdf/doc/docx/rtf/csv/xls/xlsx only.');
      event.target.value = "";
      this.imgFileOffer = '';
      return false;
    }
    else if (file.size > FILE_UPLOAD.FILE_SIZE) {
      this._share.showAlertErrorMessage.next('file  cannot be greater than 15MB.');
      event.target.value = "";
      this.imgFileOffer = '';
      return false;
    }
    else {
      this.imgFileOffer = file;
    }
  }

  /***
  * upload option
  */
  public profileImg: any;
  fileUpProfilePic(event) {
    this.profileImg = '';
    let allowedExtensions = /(\.jpg|\.jpeg|\.JPEG|\.png)$/i;
    let file = event.target.files[0];
    let fileName = file?.name;
    //this.validatorCheckBoxConsent(false);
    this.isConsentSign = false;

    this.UploadProfilePic.markAsTouched();
    if (!allowedExtensions.exec(fileName)) {
      this._share.showAlertErrorMessage.next('Please upload file type  jpeg/jpg/png only.');
      event.target.value = "";
      this.profileImg = '';
      this.UploadProfilePic?.reset();
      return false;
    }
    else if (file.size > FILE_UPLOAD.FILE_SIZE) {
      this._share.showAlertErrorMessage.next('file  cannot be greater than 15MB.');
      event.target.value = "";
      this.profileImg = '';
      this.UploadProfilePic?.reset();
      return false;
    }
    else {
      this.profileImg = file;
      this.validatorCheckBoxConsent(true);
      this.isConsentSign = true;

      //crop picture
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const blob = this._commonMethodServe.base64toBlob(reader.result);
        let data = {
          file: reader.result,
          cropperType: 'profileImg',
          displayName: file.name
        }
        this.cropperModalOpen(data, event);
      }

    }
  }

  public uploadVideoData = {};
  public candVideo: any;
  fileUpVideo(event) {
    this.candVideo = '';
    let allowedExtensions = /(\.mp4|\.MP4)$/i;
    let file = event.target.files[0];
    let fileName = file?.name;
    //this.validatorCheckBoxConsent(false);
    // this.isConsentSign = false;

    this.UploadVideo.markAsTouched();
    if (!allowedExtensions.exec(fileName)) {
      this._share.showAlertErrorMessage.next('Please upload file type mp4 only.');
      event.target.value = "";
      this.candVideo = '';
      return false;
    }
    else if (file.size > FILE_UPLOAD.FILE_SIZE) {
      this._share.showAlertErrorMessage.next('file  cannot be greater than 15MB.');
      event.target.value = "";
      this.candVideo = '';
      return false;
    }
    else {
      //duration get
      let videoDur = document.createElement('video');
      videoDur.src = window.URL.createObjectURL(file);
      videoDur.preload = 'metadata';
      videoDur.onloadedmetadata = () => {
        if (videoDur.duration > 60) {
          this._share.showAlertErrorMessage.next('Video Duration cannot be greater than 60 sec.');
          event.target.value = "";
          this.candVideo = '';
          return false;
        }
        else {
          this.candVideo = file;
          this.validatorCheckBoxConsent(true);
          this.isConsentSign = true;
          //crop picture
          var reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            let base64File = reader.result.toString().replace(/^data:.+;base64,/, '');
            this.uploadVideoData = {
              cid: this.data.cid,
              RoundId: this.candidteRoundDetails.RoundId,
              fileVideo: base64File,
              FileNameVideo: file.name,
              FileSizeVideo: file.size
            }
            let data = {
              fileName: fileName,
              fileType: 'V',
              interviewType: '',
              isUpload: true,
              file: reader.result,
              //src type 1 = interview feedback & 2 =  from onbording module 
              srcType: 1
            }
            let reqType = 2;
            this.previewImageVideo(data, reqType);
            // this.uploadCandIdVideoToServer(data,this.UploadVideo);
          }
        }
      }
    }
  }

  public candidateID: any;
  fileUpCandId(event) {
    this.candidateID = '';
    let allowedExtensions = /(\.jpg|\.jpeg|\.png|\.pdf)$/i;
    let file = event.target.files[0];
    let fileName = file?.name;
    //this.validatorCheckBoxConsent(false);
    // this.isConsentSign = false;

    this.UploadCandId.markAsTouched();
    if (!allowedExtensions.exec(fileName)) {
      this._share.showAlertErrorMessage.next('Please upload file type jpg/jpeg/png/pdf only.');
      event.target.value = "";
      this.candidateID = '';
      return false;
    }
    else if (file.size > FILE_UPLOAD.FILE_SIZE) {
      this._share.showAlertErrorMessage.next('file  cannot be greater than 15MB.');
      event.target.value = "";
      this.candidateID = '';
      return false;
    }
    else {
      this.candidateID = file;
      //
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const blob = this._commonMethodServe.base64toBlob(reader.result);
        let base64File = reader.result.toString().replace(/^data:.+;base64,/, '');
        let data = {
          cid: this.data.cid,
          // RoundId: this.candidteRoundDetails.RoundId,
          fileID: base64File,
          FileNameID: file.name,
          IdType: this.idTypeControl?.value,
          IdNumber: this.idNumberControl?.value
        }
        let reqType = 1;
        this.uploadCandIdVideoToServer(data, this.UploadCandId, reqType);
      }
    }
  }

  //upload video/ Candidate Id proof 
  uploadCandIdVideoToServer(body: any, ctrl: any, type: number) {
    if (type == 1) {
      this._intServe.addCandVideo(body).subscribe(
        res => {
          // this._share.showAlertSuccessMessage.next(res);
        },
        (error) => {
          ctrl.reset();
          this._share.showAlertErrorMessage.next(error.error.Message);
        }
      )
    } else if (type == 2) {
      this._intServe.uplaodVideoToSharePointInt(body).subscribe(
        res => {
          // this._share.showAlertSuccessMessage.next(res);
          // this.isloader = false;
        },
        (error) => {
          ctrl.reset();
          this._share.showAlertErrorMessage.next(error.error.Message);
          // this.isloader = false;
        }
      )
    }
  }

  /***
  * 
  */
  previewImageVideo(data: any = {}, type: number) {
    let pClass: any = [];
    if (data?.fileType == 'P') {
      pClass = ['ats-model-wrap', 'ats-preview-media-model', 'ats-preview-media-model-img']
    }
    else {
      pClass = ['ats-model-wrap', 'ats-preview-media-model']
    }

    const dialogRef = this.dialog.open(PreviewMediaFileModalComponent,
      {
        data: data,
        // disableClose: true,
        width: '500px',
        height: 'auto',
        panelClass: pClass,
        backdropClass: 'mop-image-crop-modal-overlay'
      }
    );
    dialogRef.afterClosed().subscribe(results => {
      if (results) {
        this.uploadCandIdVideoToServer(this.uploadVideoData, this.UploadVideo, type);
      } else {
        this.UploadVideo?.reset();
      }
    });
  }



  changeCheck(e: any) {
    //  let x = this.UploadProfilePic.value;
    if (this.getLocInfo?.isLocationIndia(null) && (this.isInterviewSchedule === true || this.isHrFeedback || this.isHrFeedbackFinal || this.isCientRound)) {
      if (this.profileImg) {
        this.isConsentSign = false;
        this.isConsentSign = true;
      }
    }

  }

  /***
    * cropper modal open method
    */
  cropperModalOpen(data: any, event?: any) {
    data['isCropImg'] = false;
    const dialogRef = this.dialog.open(ImageCropperMopComponent,
      {
        data: data,
        disableClose: true,
        width: '500px',
        height: 'auto',
        panelClass: ['ats-model-wrap', 'mop-image-crop-modal'],
        backdropClass: 'mop-image-crop-modal-overlay'
      }
    );
    dialogRef.afterClosed().subscribe(results => {
      if (results) {
        if (data['cropperType'] == "profileImg") {
          this.profileImg = this._commonMethodServe.dataURLtoFile(results.file, results.displayName);
        }

      }
      else {
        event.target.value = "";
        this.profileImg = '';
      }
    });
  }

  /**
   * rating Change
   */

  RatingChange(ievent: any, ind: number) {
    if (this.isAddSkillFrom == 'TRound') {
      this.calcAggregateSkillRating();
    }
    else {
      this.calcOverAllRating();
    }
  }
  /**
   * calculate Aggregate Skill Rating
   */
  calcAggregateSkillRating() {
    const ratingList = this.techRatingDetails.value.filter(x => (x.type == 'S' || x.type == 'SD') && x.rating != null);
    if (ratingList.length != 0) {
      let aggrSkillRatingIndex = this.techRatingDetails.value.findIndex(x => x.Area == 'Aggregate Skill Rating');
      let totalRating = 0;
      let fiveStarRating = ratingList.filter(x => x.rating == 5).length;
      let fourStarRating = ratingList.filter(x => x.rating == 4).length;
      let threeStarRating = ratingList.filter(x => x.rating == 3).length;
      let twoStarRating = ratingList.filter(x => x.rating == 2).length;
      let oneStarRating = ratingList.filter(x => x.rating == 1).length;
      totalRating = (fiveStarRating * 5) + (fourStarRating * 4) + (threeStarRating * 3) + (twoStarRating * 2) + (oneStarRating * 1);
      let totalRatingCount = fiveStarRating + fourStarRating + threeStarRating + twoStarRating + oneStarRating;
      let avgRating = totalRating / totalRatingCount;

      this.techRatingDetails.controls[aggrSkillRatingIndex]?.get('rating').patchValue(avgRating.toFixed(1));
      this.calcOverAllRatingTech(avgRating);
    }

  }

  /**
  * calculate Overall Rating
  */
  calcOverAllRating() {
    const ratingList = this.techRatingDetails.value.filter(x => (x.type == 'O') && x.rating != null);
    let OverallRatingIndex = this.techRatingDetails.value.findIndex(x => x.Area == 'Overall Rating');
    if (ratingList.length != 0) {
      let totalRating = 0;
      let fiveStarRating = ratingList.filter(x => x.rating == 5).length;
      let fourStarRating = ratingList.filter(x => x.rating == 4).length;
      let threeStarRating = ratingList.filter(x => x.rating == 3).length;
      let twoStarRating = ratingList.filter(x => x.rating == 2).length;
      let oneStarRating = ratingList.filter(x => x.rating == 1).length;
      totalRating = (fiveStarRating * 5) + (fourStarRating * 4) + (threeStarRating * 3) + (twoStarRating * 2) + (oneStarRating * 1);
      let totalRatingCount = fiveStarRating + fourStarRating + threeStarRating + twoStarRating + oneStarRating;
      let avgRating = totalRating / totalRatingCount;

      this.techRatingDetails.controls[OverallRatingIndex]?.get('rating').patchValue(avgRating.toFixed(1));

    }

  }

  /**
* calculate Overall Rating
*/
  calcOverAllRatingTech(agrSkillRating: number) {
    const ratingList = this.techRatingDetails.value.filter(x => (x.type == 'O') && x.rating != null);
    let OverallRatingIndex = this.techRatingDetails.value.findIndex(x => x.Area == 'Overall Rating');
    if (ratingList.length != 0) {
      let totalRating = 0;
      let fiveStarRating = ratingList.filter(x => x.rating == 5).length;
      let fourStarRating = ratingList.filter(x => x.rating == 4).length;
      let threeStarRating = ratingList.filter(x => x.rating == 3).length;
      let twoStarRating = ratingList.filter(x => x.rating == 2).length;
      let oneStarRating = ratingList.filter(x => x.rating == 1).length;
      totalRating = (fiveStarRating * 5) + (fourStarRating * 4) + (threeStarRating * 3) + (twoStarRating * 2) + (oneStarRating * 1);
      let totalRatingCount = fiveStarRating + fourStarRating + threeStarRating + twoStarRating + oneStarRating;
      let avgRating = totalRating / totalRatingCount;
      let avgRatingFinal = (avgRating + agrSkillRating) / 2;

      this.techRatingDetails.controls[OverallRatingIndex]?.get('rating').patchValue(avgRatingFinal.toFixed(2));
    }

  }
  /***
 * set Dynamic data  for HR Rating
 * 
 */
  public SkillSequence: number = 0;
  public isChangeInCtrl: boolean = false;
  techDynamicForm(data: any, type: string = 'MRound') {

    const control = this.techRatingDetails;
    const control2 = this.skillsRatingDetails
    if (type != 'SRound') {
      for (let i = 0; i < data.length; i++) {

        if (data[i] == 'Aggregate Skill Rating' || data[i] == 'Overall Rating') {
          // control.push(this.initItemRow(data[i],true));
          control.push(this.initItemRow(data[i], true, true, 'RT'));
        }
        else {
          control.push(this.initItemRow(data[i], true));
        }

      }
    }

    if (type == 'TRound') {
      if (this.talentTCAdditionalSkillByThId?.length > 0) {
        for (let i = 0; i < this.talentTCAdditionalSkillByThId?.length; i++) {
          this.SkillSequence = this.SkillSequence + 1;
          control.insert(control.length - 2, this.initItemRow(this.talentTCAdditionalSkillByThId[i]?.Skill, true, true, 'SD', '' + ''));
          //control.push(this.initItemRow(this.candidateData?.primarySkill?.SkillName,true));
        }
      }

    } else

      if (type == 'SRound') {
        if (this.talentTCSkillsByThId?.length > 0) {
          for (let i = 0; i < this.talentTCSkillsByThId?.length; i++) {
            this.SkillSequence = this.SkillSequence + 1;
            control2.insert(control2.length, this.initItemRow2(this.talentTCSkillsByThId[i]?.Skill, this.talentTCSkillsByThId[i]?.TCSkill, true, true, 'SR', ''));
            //control.push(this.initItemRow(this.candidateData?.primarySkill?.SkillName,true));
          }
        }

      }

    setTimeout(() => {
      this.changeDetectorRef.detectChanges();
    }, 1000);
  }

  techDynamicFormForDraftedFeedback(data: any, type: string = 'MRound') {
    const control = this.techRatingDetails;
    this.techRatingDetails.reset();
    
    // First, add all drafted skills from data
    for (let i = 0; i < data.length; i++) {
      if (data[i]?.Area == 'Aggregate Skill Rating' || data[i]?.Area == 'Overall Rating') {
        control.push(this.initItemRowForDraftedFeedback(data[i], true, true, 'RT'));
      } else if (data[i]?.Area == 'Role Fitment' || data[i]?.Area == 'Role Compatibility' || data[i]?.Area == 'Role Compatability' || data[i]?.Area == 'Communication' || data[i]?.Area == 'Confidence' ||
        data[i]?.Area == 'Domain Knowledge' || data[i]?.Area == 'Leadership Quality' || data[i]?.Area == 'Technical Knowledge'
      ) {
        control.push(this.initItemRowForDraftedFeedback(data[i], true, true, 'O'));
      } else {
        let tempList = []
        tempList = this.talentTCAdditionalSkillByThId.filter(x => x.Skill == data[i]?.Area)
        this.SkillSequence = this.SkillSequence + 1;
        if(tempList?.length > 0){
          control.push(this.initItemRowForDraftedFeedback(data[i], true, true,'SD','' + ''));
        }else{
          control.push(this.initItemRowForDraftedFeedback(data[i], true, true,'S','' + ''));
        }
      }
    }

    // Now add any new skills from talentTCAdditionalSkillByThId that aren't already in the drafted data
    if (type == 'TRound' && this.talentTCAdditionalSkillByThId?.length > 0) {
      // Get list of existing skill areas from drafted data
      const existingSkills = data.map(item => item?.Area);
      
      // Find the index where we should insert (before Aggregate Skill Rating)
      const aggregateIndex = control.length >= 2 ? control.length - 2 : control.length;
      
      // Add only new skills that don't exist in draft
      for (let i = 0; i < this.talentTCAdditionalSkillByThId?.length; i++) {
        const skillName = this.talentTCAdditionalSkillByThId[i]?.Skill;
        
        // Check if this skill already exists in drafted data
        if (!existingSkills.includes(skillName)) {
          this.SkillSequence = this.SkillSequence + 1;
          // Insert the new skill before Aggregate Skill Rating and Overall Rating
          control.insert(aggregateIndex, this.initItemRow(skillName, true, true, 'SD', '' + ''));
        }
      }
    }

    setTimeout(() => {
      this.changeDetectorRef.detectChanges();
    }, 1000);
  }

  /***
* set Dynamic data  for Groomable skill
* 
*/
  techDynamicFormGroom() {
    const control = this.groomableSkills;
    for (let i = 0; i < 2 + 1; i++) {
      control.push(this.initItemRowGroom(i + 1));
    }
  }


  /*** dynamic control for HR rating */
  initItemRow(data, isRequired: boolean = false, isDefault: boolean = true, type: string = 'O', label: string = '', actionvisible: number = 0) {
    if (isRequired) {
      return this._fb.group({
        Area: [isDefault ? data : null, [Validators.required]],
        rating: [null, Validators.required],
        tempVal: [data],
        type: [type],
        label: [label],
        actionvisible: [actionvisible]
      })
    }
    else {
      return this._fb.group({
        Area: [isDefault ? data : null],
        rating: [null],
        tempVal: [data],
        type: [type],
        label: [label],
        actionvisible: [actionvisible]
      })
    }
  }

  initItemRow2(data, TCSkill: number, isRequired: boolean = false, isDefault: boolean = true, type: string = 'O', label: string = '', actionvisible: number = 0) {
    if (isRequired) {
      return this._fb.group({
        Skill: [isDefault ? TCSkill : null, [Validators.required]],
        SkillName: [isDefault ? data : null],
        Rating: [null],
        expYear: [null],
        expMonth: [null],
        tempVal: [data],
        type: [type],
        label: [label],
        actionvisible: [actionvisible]
      })
    }
    else {
      return this._fb.group({
        Skill: [isDefault ? TCSkill : null],
        SkillName: [isDefault ? data : null],
        Rating: [null],
        expYear: [null],
        expMonth: [null],
        tempVal: [data],
        type: [type],
        label: [label],
        actionvisible: [actionvisible]
      })
    }
  }

  RatingChangeAutoFn(data: any, i: number) {

    const control = this.autoQuestionDetailsCt;
    control.at(i).get('AutoQAns').setValidators([Validators.required, minLengthIfNotEmpty(100)]);
    control.at(i).get('AutoQAns').updateValueAndValidity();
  }

  /*** dynamic control for HR rating ForDraftedFeedback */
  initItemRowForDraftedFeedback(data, isRequired: boolean = false, isDefault: boolean = true, type: string = 'O', label: string = '', actionvisible: number = 0) {
    if (isRequired) {
      return this._fb.group({
        Area: [data?.Area ? data?.Area : null, [Validators.required]],
        rating: [data?.rating ? data?.rating?.toString() : null, Validators.required],
        tempVal: [data?.Area],
        type: [type],
        label: [label],
        actionvisible: [data?.actionvisible]
      })
    }
    else {
      return this._fb.group({
        Area: [data?.Area ? data?.Area : null],
        rating: [data?.rating ? data?.rating.toString() : null],
        tempVal: [data?.Area],
        type: [type],
        label: [label],
        actionvisible: [data?.actionvisible]
      })
    }
  }

  /*** dynamic control for HR rating */
  initItemRowGroom(data) {
    return this._fb.group({
      skill: [null]
    })
  }

  getautoQuestiotList() {
    let intType = this.candidteRoundDetails.interviewType.Id;
    let intStatus = this.candidteRoundDetails.InterViewStatus.Id;
    let interviewBy = this.candidteRoundDetails.interviewBy;
    let candDate = this.candidateOtherDetails;
    const control = this.autoQuestionDetailsCt;
    let thid = this.data.th_id;
    let techRoundLen = this.techRoundFilterByInternal?.length + 1;
    let draftQuestionAuto = this.candidteRoundDetails?.autoQuestionFeedback;
    let draftQuestionAutoFinal = [];
    if (draftQuestionAuto?.length != 0) {
      if (draftQuestionAuto?.length != 0) {
        for (let i = 0; i < draftQuestionAuto.length; i++) {
          control.insert(control.length, this.autoQuestionDetailsItemRow(draftQuestionAuto[i]?.QuestionAuto, draftQuestionAuto[i]?.AutoQAns, draftQuestionAuto[i]?.rating, draftQuestionAuto[i]?.Type));
        }
      }
      for (let i = 0; i < draftQuestionAuto.length; i++) {
        draftQuestionAutoFinal.push(draftQuestionAuto[i].QuestionAuto)
      }
    }
    else {

      if ((intType == 2 && interviewBy == 'I' && (intStatus == 1 || intStatus == 3)) && !this.IsRenuTeam) {
        this._candidateCommon.getJDQuestionsByThId(this.data.cid).subscribe(
          res => {

            if (res['data']) {
              //this.questData = this.questData.filter(item => !this.draftQuestionAuto.includes(item));
              let questData = res['data'];
              let findQuestData = [];
              // if(draftQuestionAutoFinal?.length != 0){
              //   findQuestData = questData.filter(item => !draftQuestionAutoFinal.includes(item.Question));
              // }
              // else{
              //   findQuestData = questData;
              // }
              if (questData?.length != 0) {
                for (let i = 0; i < questData.length; i++) {
                  control.insert(control.length, this.autoQuestionDetailsItemRow(questData[i].Question));
                }
              }
            }
            else {
              this._share.showAlertErrorMessage.next('No question found.');
            }


          }
        )

      }
    }



  }
  // get getautoQuestionDetailsCTrL() {
  //   return this.autoQuestionDetailsItemRow['controls']
  // }
  addQuestion() {
    const control = this.autoQuestionDetailsCt;
    control.insert(control.length, this.autoQuestionDetailsItemRow(null, null, null, 1));
  }

  /**on selection of rating dropdown - setting its comments 100 charactors required  */
  selectRating(i: any) {
    // this.getautoQuestionDetailsCTrL
    const control = this.autoQuestionDetailsCtrl[i]['controls'];
    control.AutoQAns.setValidators([Validators.required, CustomValidation.minLenNoWhitespace(100)]);
    control.AutoQAns.updateValueAndValidity();
  }
  /***
  * remove row
  */
  removeQuestion(index: number) {
    const control = this.autoQuestionDetailsCt;
    control.removeAt(index);
  }


  autoQuestionDetailsItemRow(data, Ans: string = null, rating: number = null, type: number = 0) {
    return this._fb.group({
      AutoQAns: [Ans ? Ans : null],
      QuestionAuto: [data],
      Rating: [rating ? rating.toString() : null],
      type: type
    })
  }

  /***
* add row
*/
  add() {
    const control = this.techRatingDetails;
    const control2 = this.skillsRatingDetails;
    if (control.length < 15 && (this.isAddSkillFrom != 'SRound')) {
      // control.push(this.initItemRow(null));

      if (this.isAddSkillFrom == 'TRound') {
        this.SkillSequence = this.SkillSequence + 1;
        control.insert(control.length - 2, this.initItemRow(null, true, true, 'S', '' + '', 1));
      }
      else {
        control.insert(control.length - 1, this.initItemRow(null, true, true, 'O', '', 1));
      }
    } else {
      if (this.isAddSkillFrom == 'SRound') {
        this.SkillSequence = this.SkillSequence + 1;
        control2.insert(control2.length, this.initItemRow2('Skill', null, true, true, 'S', 'Skill', 1));
      }
      else {
        control2.insert(control.length, this.initItemRow2(null, null, true, true, 'O', '', 1));
      }
    }
    this.changeDetectorRef.detectChanges();

  }

  /***
  * remove row
  */
  remove(index: number) {
    const control = this.techRatingDetails;
    const control2 = this.skillsRatingDetails;
    if (control.length != 1) {
      control.removeAt(index);
      if (this.SkillSequence > 0) {
        this.SkillSequence = this.SkillSequence - 1;
      }
    }
    if (control2.length != 1) {
      control2.removeAt(index);
      if (this.SkillSequence > 0) {
        this.SkillSequence = this.SkillSequence - 1;
      }
    }
  }
  /***
   * hid/show form base of value
   */
  feedbackFormHideShow() {
    if (this.isTechnicalFeedback === true) {
      this.isRequiredTechnical = true;
      this.isRequiredHr = false;
      this.iSCurrentStatusHr = false;
      this.iSCurrentStatusTech = true;
    }
    else if (this.isHrFeedback === true) {
      this.isRequiredTechnical = false;
      this.isRequiredHr = true;
      this.iSCurrentStatusHr = true;
      this.iSCurrentStatusTech = false;
    }
    else {
      this.isRequiredTechnical = false;
      this.isRequiredHr = false;
      this.iSCurrentStatusHr = false;
      this.iSCurrentStatusTech = false;
    }
  }
  public selectedStatus: number = 0;
  public isRejectReason: boolean = false;
  /***
   * select status
   */
  getCandStatus(event) {
    // let InterViewStatusId = this.candidteRoundDetails.InterViewStatus.Id;
    // let intType = this.candidteRoundDetails.interviewType.Id;
    // if (intType === 4) {
    //   if (InterViewStatusId === 4 || InterViewStatusId === 6) {
    //     this.showSelectedValueOfferBy = true;
    //     this.SelectedValueOfferBy = this.candidteRoundDetails.offeredby.Id;
    //   } else {
    //     this.showSelectedValueOfferBy = true;
    //     this.SelectedValueOfferBy = this._storage.getUserEmpId();
    //   }
    // }
    let val = event.source.value;
    this.candidateGlobalStatusId = val;
    this.selectedStatus = val;
    if (val == 5 && this.candidteRoundDetails?.interviewType?.Id == 1) {
      this.isRejectReason = true;
      this.screenRejectIdCtrl.setValidators([Validators.required]);
    } else {
      this.isRejectReason = false;
      this.screenRejectIdCtrl.clearValidators();
      this.screenRejectIdCtrl.reset();
      if (val == 1) {
        this.isInterviewSchedule = true;
        this.isRequiredInt = true;
        //feedback
        this.isRequiredTechnical = false;
        this.isRequiredHr = false;
        this.isGroomRequired = false;
        setTimeout(() => {
          this.iSCurrentStatusHr = false;

          this.iSCurrentStatusTech = false;
        }, 500);
      }
      else {
        this.isRequiredInt = false;
        setTimeout(() => {
          this.isInterviewSchedule = false;
        }, 500);
        this.feedbackFormHideShow();

        if (val === 10) {
          this.isGroomable = true;
          this.isGroomRequired = true;
          this.scoreConrolValidation();
        }
        else {
          this.isGroomRequired = false;
          setTimeout(() => {
            this.isGroomable = false;
          }, 500);
          this.scoreConrolValidation();

        }

      }
    }
    this.screenRejectIdCtrl.updateValueAndValidity();
  }

  public isCoderByteType: boolean = false;
  scoreConrolValidation() {
    if (this.candidteRoundDetails?.interviewBy == 'M' || this.candidteRoundDetails?.interviewBy == 'C') {
      if (this.selectedStatus != 15) {
        this.isCoderByteType = false;
        this.scoreControl.setValidators([Validators.required])
        this.scoreControl.updateValueAndValidity();
        this.fileUpload.setValidators([Validators.required]);
        this.fileUpload.updateValueAndValidity();
        if (this.candidteRoundDetails?.interviewBy == 'C') {
          this.fileUpload.clearValidators();
          this.fileUpload.updateValueAndValidity();
          this.isCoderByteType = true;
        }
      }
      else {
        this.scoreControl.clearValidators();
        this.scoreControl.updateValueAndValidity();
        this.fileUpload.clearValidators();
        this.fileUpload.updateValueAndValidity();
        this.isCoderByteType = false;
      }
    }
  }
  changeCheckHROffer(e: any) {
    //  let x = this.UploadProfilePic.value;
    if (e.checked == false) {
      this.offerConsnetCtrl.reset();
    }

  }


  removeValidationForInhandOffer() {
    this.offerConsnetCtrl.clearValidators();
    this.fileUploadOfferCtrl.clearValidators();
    this.docOptCtrl.clearValidators();
    this.OfferInHandAmountCtrl.clearValidators();
    this.IsDocOfferVis = false;
    this.IsConsentVis = false;
    this.HRDocOfferReq = false;
    this.IsDocOption = false;

    this.fileUploadOfferCtrl.updateValueAndValidity();
    this.docOptCtrl.updateValueAndValidity();
    this.offerConsnetCtrl.updateValueAndValidity();
    this.fileUploadOfferCtrl.updateValueAndValidity();
  }

     OfferInHandControlValidation(){
    if (this.candidateData?.currency?.Id == 2) {
        this.OfferInHandAmountCtrl.setValidators([Validators.required, Validators.min(this.salRange?.usdMin), Validators.max(this.salRange?.usdMax)]);
      } else {
        this.OfferInHandAmountCtrl.setValidators([Validators.required, Validators.min(this.salRange?.inrMin), Validators.max(this.salRange?.inrMax)]);
      }
        this.OfferInHandAmountCtrl.updateValueAndValidity();
         if (this.candidateData?.OfferInHandCTC != null || this.candidateData?.OfferInHandCTC != "") {
         // this.OfferInHandAmountCtrl.patchValue(this.candidateData?.OfferInHandCTC);
         }
  }

  IsDocOption: boolean = false;
  IsConsentVis: boolean = false;
  IsDocOfferVis: boolean = false;
   getOfferId(event: any) {
    this.offerVisibleSch(event?.value);
   }

   offerVisibleSch(data: any) {
    this.offerConsnetCtrl.clearValidators();
    this.fileUploadOfferCtrl.clearValidators();
    this.IsDocOfferVis = false;
    this.IsConsentVis = false;
    if (data == 'Y') {
      this.IsDocOption = true;
      this.docOptCtrl.addValidators([Validators.required]);
      this.OfferInHandControlValidation();
    //  this.OfferInHandAmountCtrl.addValidators([Validators.required]);
    }
    else {
      this.docOptCtrl.reset();
      this.docOptCtrl.clearValidators();
      this.OfferInHandAmountCtrl.reset();
      this.OfferInHandAmountCtrl.clearValidators();
      this.IsDocOption = false;
    }

    this.docOptCtrl.updateValueAndValidity();
    this.offerConsnetCtrl.updateValueAndValidity();
    this.fileUploadOfferCtrl.updateValueAndValidity();
    this.OfferInHandAmountCtrl.updateValueAndValidity();

  }

  public HRDocOfferReq: boolean = false;
  getDocumentVailabel(event: any) {
    if (event.value == 'Y') {
      this.offerConsnetCtrl.clearValidators();
      this.IsDocOfferVis = true;
      this.fileUploadOfferCtrl.addValidators([Validators.required]);
      this.IsConsentVis = false;
      this.HRDocOfferReq = true;
    }
    else {
      this.fileUploadOfferCtrl.clearValidators();
      this.IsDocOfferVis = false;
      this.IsConsentVis = true;
      this.offerConsnetCtrl.addValidators([Validators.required]);
      this.HRDocOfferReq = false;
    }
    this.docOptCtrl.updateValueAndValidity();
    this.offerConsnetCtrl.updateValueAndValidity();
  }
  /**just to clear validator and reset reasons to change  */
  clearValidatorAndResetReasons() {

    this.getControl('techInternalPanel').clearValidators();
    this.getControl('techInternalPanel').reset();
    this.isTechInternal = false;
    this.getControl('techExternalPanel').clearValidators();
    this.getControl('techExternalPanel').reset();
    this.isTechExternal = false;
    this.getControl('requirementChangeReason').clearValidators();
    this.getControl('requirementChangeReason').reset();
    this.getControl('approvalFile').reset();
    this.clearValidators('approvalFile');

    this.isApprovalAttachment = false;
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

  

  /**
   * validation behalf of selected interview type
   * @param event 
   */
  getSelectedIntTypeId(event): void {
    this.getControl('techInternalPanel').reset();
    this.getControl('techExternalPanel').reset();
    let val = event.source.value;
    this.removeValidationForInhandOffer();
    //hr final round
    this.clearValidatorAndResetReasons();
    this.isChangeDropdownAsses = false;
    if (val === 4) {
      this.resetInterviewBy();
      /**check not valid for c2h */
      // if (this.screenRoundFilter.length === 0) {
      //   if (this.data?.requirementTypeId != 6) {
      //     this._share.showAlertErrorMessage.next("HR Final Round can not schedule before atleast 1 Screening round.");
      //     this.interviewType.reset();
      //   }
      // }
      // else if (this.techRoundFilterByInternal?.length === 0) {
      //   if (this.data?.requirementTypeId != 6) {
      //     this._share.showAlertErrorMessage.next("HR Final Round can not schedule before atleast 1 Technical round with Internal Panel.");
      //     this.interviewType.reset();
      //   }
      // }
      if (this.getLocInfo.isLocationIndia(null)) {
        if (this.screenRoundFilter.length === 0 && this.data?.requirementTypeId != 6) {
          this._share.showAlertErrorMessage.next("HR Final Round can not schedule before atleast 1 Screening round.");
          this.interviewType.reset();
        }
        else if (this.techRoundFilterByInternal?.length === 0 && this.data?.requirementTypeId != 6) {
          this._share.showAlertErrorMessage.next("HR Final Round can not schedule before atleast 1 Technical round with Internal Panel.");
          this.interviewType.reset();
        }
        else if (this.managerialRoundFilter?.length === 0 && this.data?.requirementTypeId == 6) {
          this._share.showAlertErrorMessage.next("HR Final Round can not schedule before atleast 1 Managerial round.");
          this.interviewType.reset();
        }
        else if (this.data?.c_proof_type == null || this.data?.c_proof_type == '0') {

          if (this.getLocInfo.isLocationIndia(null)) {
            this.isIdProof = true;
            this.isUploadIdShow = true;
            if (this.data?.requirementTypeId != 6) {
              this.idProofReq = true;

            }
            this.addValidUploadIdVid(this.data?.requirementTypeId);

            if (this.candidateData?.Identity?.ID) {
              this.idTypeControl.patchValue(this.candidateData?.Identity?.ID);
              // this.idTypeControl.disable();
              this.getSelectedIdType(this.candidateData?.Identity?.ID);
              this.idNumberControl.patchValue(this.candidateData?.IdentityNo);
              // this.idNumberControl.disable();
            }
            this.isHRDocVisible = true;
            debugger
           


            if (this.candidateData?.EmploymentTypeId != 2) {

              this.isOfferInHandCtrl.setValidators([Validators.required]);
               if(this.candidateData?.otherOffer == 1){
               this.isOfferInHandCtrl.patchValue('Y');
               this.offerVisibleSch('Y');
            }
              if (this.IsRenuTeam == false) {
                /**not valid for c2h 6 */
                if (this.data?.requirementTypeId != 6) {
                  this.HRDocReq = true;
                  this.fileUploadHRCtrl.setValidators([Validators.required]);
                }
              } else {
                this.fileUploadHRCtrl.clearValidators();
              }
            } else {
              this.HRDocReq = false;
              this.fileUploadHRCtrl.clearValidators();
              this.isOfferInHandCtrl.clearValidators();
            }
          }
          else {
            this.resetIDControlType();
            this.clearValidUploadIdVid();
            this.isHRDocVisible = false;
            this.HRDocReq = false;
            this.fileUploadHRCtrl.clearValidators();
            this.isOfferInHandCtrl.clearValidators();
          }

        }
      } else if (this.getLocInfo.isLocationUS(null)) {
        if (this.screenRoundFilter.length === 0 && this.data?.requirementTypeId != 6) {
          this._share.showAlertErrorMessage.next("HR Final Round can not schedule before atleast 1 Screening round.");
          this.interviewType.reset();
        } else if (this.techRoundFilterByInternal?.length === 0 && this.data?.requirementTypeId != 6) {
          // this._share.showAlertErrorMessage.next("HR Final Round can not schedule before atleast 1 Technical round with Internal Panel.");
          // this.interviewType.reset();
          if (this.managerialRoundFilter?.length === 0) {
            this._share.showAlertErrorMessage.next("HR Final Round can not schedule before atleast 1 Technical round with Internal Panel or Managerial round.");
            this.interviewType.reset();
          }
        }
        // else if (this.managerialRoundFilter?.length === 0 && this.data?.requirementTypeId == 6) {
        //   this._share.showAlertErrorMessage.next("HR Final Round can not schedule before atleast 1 Managerial round.");
        //   this.interviewType.reset();
        // }        
        else if (this.data?.c_proof_type == null || this.data?.c_proof_type == '0') {
          this.resetIDControlType();
          this.clearValidUploadIdVid();
          this.isHRDocVisible = false;
          this.HRDocReq = false;
          this.fileUploadHRCtrl.clearValidators();
          this.isOfferInHandCtrl.clearValidators();
        }
      }

      // else if((this.isG4Hiring === true && this.hrDiscussionRound?.length === 0 )&& this.getLocInfo.isLocationIndia(null)){
      //   this._share.showAlertErrorMessage.next("HR Final Round can not schedule before HR Discussion Round.");
      //   this.interviewType.reset();

      // }


    }

    else if (val === 7) {
      this.resetInterviewBy();
      if (this.isG4Hiring === false && this.getLocInfo.isLocationIndia(null)) {
        this._share.showAlertErrorMessage.next("HR Discussion not applicable for below G4.");
        this.interviewType.reset();
      }
      else if (this.screenRoundFilter.length === 0 && this.getLocInfo.isLocationIndia(null)) {
        this._share.showAlertErrorMessage.next("HR Discussion Round can not schedule before atleast 1 Screening round.");
        this.interviewType.reset();
      }
      else if (this.techRoundFilterByInternal?.length === 0 && this.getLocInfo.isLocationIndia(null)) {
        this._share.showAlertErrorMessage.next("HR Discussion Round can not schedule before atleast 1 Technical round with Internal Panel.");
        this.interviewType.reset();
      }
      else if (this.techRoundFilterByInternal?.length === 0 && this.getLocInfo.isLocationUS(null)) {
        if (this.managerialRoundFilter?.length === 0 && this.getLocInfo.isLocationUS(null)) {
          this._share.showAlertErrorMessage.next("HR Discussion Round can not schedule before atleast 1 Technical round with Internal Panel or Managerial round.");
          this.interviewType.reset();
        }
      }
      this.resetIDControlType();
      this.clearValidUploadIdVid();
      this.isHRDocVisible = false;
      this.HRDocReq = false;
      this.fileUploadHRCtrl.clearValidators();
      this.isOfferInHandCtrl.clearValidators();

    }
    //managerial round
    else if (val === 6) {
      this.resetIDControlType();
      this.clearValidUploadIdVid();
      this.resetInterviewBy();
      this.isHRDocVisible = false;
      this.HRDocReq = false;
      this.fileUploadHRCtrl.clearValidators();
      this.isOfferInHandCtrl.clearValidators();
      if (this.screenRoundFilter.length === 0) {
        /**check not valid for c2h */
        if (this.data?.requirementTypeId != 6) {
          this._share.showAlertErrorMessage.next("Managerial Round can not schedule before atleast 1 Screening round.");
          this.interviewType.reset();
        }
      }
      else if (this.techRoundFilterByInternal?.length === 0) {
        /**check not valid for c2h */
        if (this.data?.requirementTypeId != 6 && this.getLocInfo.isLocationIndia(null)) {
          this._share.showAlertErrorMessage.next("Managerial Round can not schedule before atleast 1 Technical round with Internal Panel.");
          this.interviewType.reset();
        }
      }

    }
    //for technical round
    else if (val === 2) {
      this.resetIDControlType();
      this.clearValidUploadIdVid();
      this.resetInterviewBy();
      this.isHRDocVisible = false;
      this.HRDocReq = false;
      this.fileUploadHRCtrl.clearValidators();
      this.isOfferInHandCtrl.clearValidators();

      if (this.screenRoundFilter.length === 0) {
        this._share.showAlertErrorMessage.next("Technical round can not schedule before atleast 1 Screening round.");
        this.interviewType.reset();
      }
      else {
        if (this.techRoundFilter?.length == 0) {
          this.isInterviewByVisible = true;
          this.interviewByControl.setValidators([Validators.required]);
        } else {

          this.isInterviewByVisible = true;
          this.interviewByControl.setValidators([Validators.required]);
          this.interviewByControl.patchValue('I');
        }
        // this.tech1RoundExist();
      }

    }
    //client round
    else if (val === 3) {
      this.resetIDControlType();
      this.clearValidUploadIdVid();
      this.resetInterviewBy();
      this.isHRDocVisible = false;
      this.HRDocReq = false;
      this.fileUploadHRCtrl.clearValidators();
      this.isOfferInHandCtrl.clearValidators();
      if (this.screenRoundFilter.length === 0) {
        this._share.showAlertErrorMessage.next("Client round can not schedule before atleast 1 Screening round.");
        this.interviewType.reset();
      }

    }
    //managment round
    else if (val === 5) {
      this.resetIDControlType();
      this.clearValidUploadIdVid();
      this.resetInterviewBy();
      this.isHRDocVisible = false;
      this.HRDocReq = false;
      this.fileUploadHRCtrl.clearValidators();
      this.isOfferInHandCtrl.clearValidators();
      if (this.screenRoundFilter.length === 0) {
        this._share.showAlertErrorMessage.next("Management round can not schedule before atleast 1 Screening round.");
        this.interviewType.reset();
      }

    }
    else {
      this.resetIDControlType();
      this.clearValidUploadIdVid();
      this.resetInterviewBy();
      this.isHRDocVisible = false;
      this.HRDocReq = false;
      this.fileUploadHRCtrl.clearValidators();
      this.isOfferInHandCtrl.clearValidators();
    }
    if (this.getLocInfo.isLocationIndia()) {
      //  this.hideShowTech1Default(val); 
      if (this.techRoundFilter?.length == 0) {
        this.hideShowTech1Default(this.getControl('interviewType')?.value);
      } else {

      }
    }
    // this.HRDocReq = false;
    this.fileUploadHRCtrl.updateValueAndValidity();
    this.isOfferInHandCtrl.updateValueAndValidity();
  }
  /***
   * reset Id control
   */
  resetIDControlType() {
    this.idProofReq = false;
    setTimeout(() => {
      this.isIdProof = false;
    }, 500);
    this.idNumberControl.clearValidators();
    this.idNumberControl.updateValueAndValidity();
    this.idTypeControl.reset();
  }
  /**
   * 
   * @param event get Id Type
   */
  public idTypeName: string;
  getSelectedIdType(e) {
    // let val = e.source.value;
    let val = e;
    let regpan = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
    let adhar = /^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/;
    this.idNumberControl.reset();
    if (val === 4) {
      this.idNumberControl.patchValue('NA');
      this.idNumberControl.clearValidators();
      this.idNumberControl.updateValueAndValidity();
      this.idNumberControl.disable({ onlySelf: true });
    }
    else if (val === 1) {
      this.idNumberControl.enable();
      this.idTypeName = "PAN No";
      this.idNumberControl.clearValidators();
      this.idNumberControl.setValidators([Validators.pattern(regpan), Validators.required]);
      this.idNumberControl.updateValueAndValidity();

    }
    else if (val === 2) {
      this.idNumberControl.enable();
      this.idTypeName = "AADHAAR Number";
      this.idNumberControl.clearValidators();
      this.idNumberControl.setValidators([Validators.pattern(adhar), Validators.required]);
      this.idNumberControl.updateValueAndValidity();

    }
    else {
      this.idNumberControl.enable();
      this.idNumberControl.clearValidators();
      this.idNumberControl.setValidators([Validators.required]);
      this.idNumberControl.updateValueAndValidity();

    }
  }

  /***
   * hours Valididation
   */
  hoursValid(event) {
    if (event.value == "00") {
      this.isTimeZero = false;
      this.interviewStatus.controls['interviewTimeMint'].patchValue("-1");
    }
    else {
      this.isTimeZero = true;
      this.interviewStatus.controls['interviewTimeMint'].patchValue("00");
    }
  }

  //   get id/video files for current round
  public profileVid = [];
  getVideoIdPath(cid: number) {
    this._onboardServ.getVideoIdentityProfilePic(`cid=${cid}`).subscribe(
      res => {
        this.profileVid = res['profileVid'];
      }
    )
  }

  /***
   * sumbit form method
   */
  submitFeedbackFrom(data: UntypedFormGroup) {
    this.interviewStatus.markAllAsTouched();
    // this.fileUploadHRCtrl.markAsTouched();
    this.isSubmitForm = true;
    /***
     * tech rounds
     */
    if (this.interviewStatus.valid) {
      if (this.isInterviewSchedule) {
        this.updateFeedback(data);
      }

      else if (this.isTechnicalFeedback && this.isCientRound == false && !this.isTechnicalExternalFeedback && this.data?.IsExceptionVideo == 'N' && this.getLocInfo.isLocationIndia(null) && this.candidteRoundDetails?.IsPicturePresent != 'Y') {
        if (this.profileImg == '' || this.profileImg == null) {
          this._share.showAlertErrorMessage.next('Please select candidate profile picture.')
        }
        else {
          this.uploadPrrofilePicToServer(this.profileImg, data);
        }
      }
      else {
        //  this.uploadPrrofilePicToServer(this.profileImg, data);
        if (this.profileImg) {
          this.uploadPrrofilePicToServer(this.profileImg, data);
        }
        else {
          this.updateFeedback(data);
        }
      }
    }

    else {
      this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
    }
    // 
  }

  /**getting coderByte assessment on change */
  public selectedCoderByteAssessment: any = [];
  getCoderByteAssesmentID(data: any) {
    let currentAssesment = this.coderByteAssessmentList?.filter(x => x.test_id === data.value);
    this.selectedCoderByteAssessment = currentAssesment[0];
    /**popup alert when coderbyte change and reason to be captured */
    //if (this.isChangeDropdownAsses == false) {
    if (this.candidateOtherDetails?.OnlineAssesmentByShort != 'C') {
      this.showHideReasonFunc(true);
    }
    else {
      if ((this.candidateOtherDetails.codeByteTestId != '' &&
        this.candidateOtherDetails.codeByteTestId != null) &&
        this.selectedCoderByteAssessment?.test_id != this.candidateOtherDetails.codeByteTestId
      ) {
        this.previewWarningFunc({
          name: 'Coderbyte Assesment',
          curValue: this.selectedCoderByteAssessment?.display_name,
          oldVal: this.candidateOtherDetails.coderByteDisplayName
        });
        this.showHideReasonFunc(true);
      }
      else {

        this.showHideReasonFunc(false);
      }
    }

    //  }
  }

  uploadPrrofilePicToServer(img: any, data: any) {
    let body = new FormData();
    body.append('cid', this.data.cid);
    body.append('RoundId', this.candidteRoundDetails.RoundId);
    body.append('IsSignOff', this.iConfirmedCheckBoxCtrl.value ? '1' : '0');
    if (img) {
      body.append('File', img);
    }

    //  body.append('ProfilePicName',img.name)
    this._intServe.addProfilePicture(body).subscribe(
      res => {
        this.updateFeedback(data);
      }
    )
  }

  /***
   * update feedback
   */
  updateFeedback(data: any) {
    let candSt = this.candidteRoundDetails.InterViewStatus.Id;
    //

    let dataForm = data.value;
    this.isloader = true;
    if (dataForm.candidateStatuslog === 1) {
      this.NextRoundSchedule(dataForm);
    }
    else {

      /**
       * tech round /Managerial round
       */
      if (this.candidteRoundDetails.interviewType.Id === 2 || this.candidteRoundDetails.interviewType.Id === 6) {
        if (candSt === 6) {
          this.onlyStatusUpdate(dataForm);
        }
        else {
          this.techSubmitForm(dataForm);
        }


      }
      /**
       * management /client rond round
       */
      else if (this.candidteRoundDetails.interviewType.Id === 5 || this.candidteRoundDetails.interviewType.Id === 3) {
        this.techSubmitForm(dataForm);
      }
      /**
   * HR round
   */
      else if (this.candidteRoundDetails.interviewType.Id === 1 || this.candidteRoundDetails.interviewType.Id === 4) {
        if (candSt === 6) {
          this.onlyStatusUpdate(dataForm);
        }
        else if (candSt === 4) {
          this.onlyFinalHrUpdate(dataForm);
        }
        else {
          this.hrSubmitForm(dataForm);
        }
      }
      /**
  * HR discussion
  */
      else if (this.candidteRoundDetails.interviewType.Id === 7) {
        this.hrDiscussionFeedbackSubmit(dataForm);
      }
      else {

      }
    }


  }

  /***
   * final HTTP Call
   */

  finalHTTpCall(formData: any) {
    /***
   * final 
   */
    formData.append('IsCache', 'T');
    this._interviewStatus.feedbackSubmission(formData).subscribe(
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

  /***
   * only status update with Remark
   */
  hrDiscussionFeedbackSubmit(data) {
    let hrRatitngData: any = [
      {
        Traits: 1,
        Comments: data.hrForm.hrRatings.communication.comments,
        hrRating: data.hrForm.hrRatings.communication.ratings
      },
      {
        Traits: 2,
        Comments: data.hrForm.hrRatings.personalityAndPresentability.comments,
        hrRating: data.hrForm.hrRatings.personalityAndPresentability.ratings
      },
      {
        Traits: 3,
        Comments: data.hrForm.hrRatings.learnAndGrowthPotential.comments,
        hrRating: data.hrForm.hrRatings.learnAndGrowthPotential.ratings
      },
      {
        Traits: 4,
        Comments: data.hrForm.hrRatings.adaptability.comments,
        hrRating: data.hrForm.hrRatings.adaptability.ratings
      },
      {
        Traits: 5,
        Comments: data.hrForm.hrRatings.attitude.comments,
        hrRating: data.hrForm.hrRatings.attitude.ratings
      },
      {
        Traits: 6,
        Comments: data.hrForm.hrRatings.stability.comments,
        hrRating: data.hrForm.hrRatings.stability.ratings
      }
    ];
    const getTokenEmp = this._storage.getUserEmpId();
    let formData = new FormData();
    formData.append('cid', this.data.cid);
    formData.append('StatusId', data.candidateStatuslog);
    formData.append('interviewTypeId', this.candidteRoundDetails.interviewType.Id);
    formData.append('roundId', this.candidteRoundDetails.RoundId);
    //  formData.append('score','1');
    formData.append('AddedBy', getTokenEmp);
    // formData.append('TestAttachment','');
    if (this.imgFile) {
      formData.append('TestAttachment', this.imgFile);
    }
    if (data.score) {
      formData.append('score', data.score);
    }
    //   if (this.candidateOtherDetails?.coderByteReportUrl) {
    //     formData.append('coderByteReportUrl', this.candidateOtherDetails?.coderByteReportUrl);
    //   }
    // 
    if (data.remarks) {
      formData.append('remarks', data.remarks);
    }
    if (data.screenRejectId) {
      formData.append('ScreenRejectReason', data.screenRejectId);
    }
    if (this.candidteRoundDetails.interviewType.Id === 1) {
      formData.append('hrTraits', JSON.stringify(hrRatitngData));
    }
    if (data.idType) {
      formData.append('identityId', data.idType);
    }
    if (data.idNumber) {
      formData.append('identityNo', data.idNumber);
    }
    if (this.candidteRoundDetails.interviewType.Id === 7) {
      if (data.hrForm.offeredOn) {
        let intDate = GlobalMethod.formatDate(data.hrForm.offeredOn);
        formData.append('offeredOn', intDate);
      }
      if (data.hrForm.DesignationId) {
        formData.append('DesignationId', data.hrForm.DesignationId);
      }
      if (data.hrForm.CTC) {
        formData.append('CTC', data.hrForm.CTC);
      }
      if (data.hrForm.primarySkillId) {
        formData.append('primarySkillId', data.hrForm.primarySkillId);
      }
      if (data.hrForm.offeredBy) {
        formData.append('offeredBy', data.hrForm.offeredBy);
      }

      if (data.hrForm.recruiterId) {
        formData.append('recruiterId', data.hrForm.recruiterId);
      }
      if (data.hrForm.recruiterId) {
        formData.append('recruiterId', data.hrForm.recruiterId);
      }
      // formData.append('finalDecision',data.hrForm.finalDecision);

      // formData.append('joiningBonus',data.hrForm.joiningBonus);
      //formData.append('salary',data.hrForm.salary);
      if (data.hrForm.joiningBonus) {
        formData.append('joiningBonus', data.hrForm.joiningBonus);
      }
      if (data.hrForm.NoticeBuyOut) {
        formData.append('NoticeBuyOut', data.hrForm.NoticeBuyOut);
      }
      if (data.hrForm.TravelExp) {
        formData.append('TravelExp', data.hrForm.TravelExp);
      }
      if (data.hrForm.RelocationExp) {
        formData.append('RelocationExp', data.hrForm.RelocationExp);
      }
      if (data.hrForm.RetentionBonus) {
        formData.append('RetentionBonus', data.hrForm.RetentionBonus);
      }
      if (data.hrFinal_Remarks) {
        formData.append('hrFinal_Remarks', data.hrFinal_Remarks);
      }
      if (data.iConfirmedVidExcepCheckBox) {
        formData.append('PanelConcent', data.iConfirmedVidExcepCheckBox?.value ? 'Y' : 'N');
      }

    }
    // if(this.isDraftFeedback){      
    formData.append('IsFeedbackSaveOrDraft', this.isDraftFeedback ? 'D' : 'S');
    // }

    /***
     * final http
     */
    this.finalHTTpCall(formData);

  }

  /***
   * only status update with Remark
   */
  onlyStatusUpdate(data) {
    const getTokenEmp = this._storage.getUserEmpId();
    let formData = new FormData();
    formData.append('cid', this.data.cid);
    formData.append('StatusId', data.candidateStatuslog);
    formData.append('interviewTypeId', this.candidteRoundDetails.interviewType.Id);
    formData.append('roundId', this.candidteRoundDetails.RoundId);
    formData.append('AddedBy', getTokenEmp);
    formData.append('IsStatusUpdate', '1');
    if (data.remarks) {
      formData.append('remarks', data.remarks);
    }
    if (data.hrFinal_Remarks) {
      formData.append('hrFinal_Remarks', data.hrFinal_Remarks);
    }
    if (data.iConfirmedVidExcepCheckBox) {
      formData.append('PanelConcent', data.iConfirmedVidExcepCheckBox?.value ? 'Y' : 'N');
    }
    // if(this.isDraftFeedback){      
    formData.append('IsFeedbackSaveOrDraft', this.isDraftFeedback ? 'D' : 'S');
    // }
    this.finalHTTpCall(formData);
  }

  /***
   * only status update with Remark
   */
  onlyFinalHrUpdate(data) {
    const getTokenEmp = this._storage.getUserEmpId();
    let formData = new FormData();
    formData.append('cid', this.data.cid);
    formData.append('StatusId', data.candidateStatuslog);
    formData.append('interviewTypeId', this.candidteRoundDetails.interviewType.Id);
    formData.append('roundId', this.candidteRoundDetails.RoundId);
    formData.append('AddedBy', getTokenEmp);
    if (data.remarks) {
      formData.append('remarks', data.remarks);
    }
    let intDate = GlobalMethod.formatDate(data.hrForm.offeredOn);
    // formData.append('finalDecision',data.hrForm.finalDecision);
    formData.append('DesignationId', data.hrForm.DesignationId);
    formData.append('CTC', data.hrForm.CTC);
    // formData.append('joiningBonus',data.hrForm.joiningBonus);
    // formData.append('salary',data.hrForm.salary);
    formData.append('primarySkillId', data.hrForm.primarySkillId);
    formData.append('offeredBy', data.hrForm.offeredBy);
    formData.append('offeredOn', intDate);
    //  formData.append('recruiterId',data.hrForm.recruiterId);
    formData.append('flag', '1');
    if (data.hrForm.joiningBonus) {
      formData.append('joiningBonus', data.hrForm.joiningBonus);
    }
    if (data.hrForm.annualVariablePay) {
      formData.append('AnnualVariablePay', data.hrForm.annualVariablePay);
    }
    if (data.hrForm.NoticeBuyOut) {
      formData.append('NoticeBuyOut', data.hrForm.NoticeBuyOut);
    }
    if (data.hrForm.TravelExp) {
      formData.append('TravelExp', data.hrForm.TravelExp);
    }
    if (data.hrForm.RelocationExp) {
      formData.append('RelocationExp', data.hrForm.RelocationExp);
    }
    if (data.hrForm.RetentionBonus) {
      formData.append('RetentionBonus', data.hrForm.RetentionBonus);
    }
    if (data.hrFinal_Remarks) {
      formData.append('hrFinal_Remarks', data.hrFinal_Remarks);
    }
    if (data.iConfirmedVidExcepCheckBox) {
      formData.append('PanelConcent', data.iConfirmedVidExcepCheckBox?.value ? 'Y' : 'N');
    }
    // if(this.isDraftFeedback){      
    formData.append('IsFeedbackSaveOrDraft', this.isDraftFeedback ? 'D' : 'S');
    // }

    this.finalHTTpCall(formData);
  }

  /***
   * form Submit for HR
   */
  hrSubmitForm(data: any) {
    let hrRatitngData: any = [
      {
        Traits: 1,
        Comments: data.hrForm.hrRatings.communication.comments,
        hrRating: data.hrForm.hrRatings.communication.ratings
      },
      {
        Traits: 2,
        Comments: data.hrForm.hrRatings.personalityAndPresentability.comments,
        hrRating: data.hrForm.hrRatings.personalityAndPresentability.ratings
      },
      {
        Traits: 3,
        Comments: data.hrForm.hrRatings.learnAndGrowthPotential.comments,
        hrRating: data.hrForm.hrRatings.learnAndGrowthPotential.ratings
      },
      {
        Traits: 4,
        Comments: data.hrForm.hrRatings.adaptability.comments,
        hrRating: data.hrForm.hrRatings.adaptability.ratings
      },
      {
        Traits: 5,
        Comments: data.hrForm.hrRatings.attitude.comments,
        hrRating: data.hrForm.hrRatings.attitude.ratings
      },
      {
        Traits: 6,
        Comments: data.hrForm.hrRatings.stability.comments,
        hrRating: data.hrForm.hrRatings.stability.ratings
      }
    ];
    if (this.IsRenuTeam) {
      let obj = {
        Traits: 7,
        Comments: data.hrForm.hrRatings.technicalS.comments,
        hrRating: data.hrForm.hrRatings.technicalS.ratings
      }
      hrRatitngData.push(obj);
    }
    let screeningRatingFormList: any = [];
    let screeningSkillsRatings = data.hrForm.skillsRatingDetails.filter(d => d.Rating !== null);
    screeningSkillsRatings?.forEach(ele => {
      let objEvent = {
        Skill: ele?.Skill,
        expYear: parseInt(ele?.expYear),
        expMonth: parseInt(ele?.expMonth),
        rating: parseInt(ele?.Rating)
      };
      screeningRatingFormList.push(objEvent);
    });
    const getTokenEmp = this._storage.getUserEmpId();
    let formData = new FormData();
    formData.append('cid', this.data.cid);
    formData.append('StatusId', data.candidateStatuslog);
    formData.append('interviewTypeId', this.candidteRoundDetails.interviewType.Id);
    formData.append('roundId', this.candidteRoundDetails.RoundId);
    //  formData.append('score','1');
    formData.append('AddedBy', getTokenEmp);
    // formData.append('TestAttachment','');
    if (this.imgFile) {
      formData.append('TestAttachment', this.imgFile);
    }
    if (data.score) {
      formData.append('score', data.score);
    }
    // if (this.candidateOtherDetails?.coderByteReportUrl) {
    //   formData.append('coderByteReportUrl', this.candidateOtherDetails?.coderByteReportUrl);
    // }

    if (data.remarks) {
      formData.append('remarks', data.remarks);
    }
    if (data.screenRejectId) {
      formData.append('ScreenRejectReason', data.screenRejectId);
    }
    if (this.candidteRoundDetails.interviewType.Id === 1) {
      formData.append('hrTraits', JSON.stringify(hrRatitngData));
    }

    if (screeningRatingFormList.length != 0 && this.candidteRoundDetails.interviewType.Id === 1 && !this.IsRenuTeam) {
      formData.append('screenRoundAdditionalSkills', JSON.stringify(screeningRatingFormList));
    }
    if (data.idType) {
      formData.append('identityId', data.idType);
    }
    if (data.idNumber) {
      formData.append('identityNo', data.idNumber);
    }
    if (this.candidteRoundDetails.interviewType.Id === 4) {
      let intDate = GlobalMethod.formatDate(data.hrForm.offeredOn);
      // formData.append('finalDecision',data.hrForm.finalDecision);
      formData.append('DesignationId', data.hrForm.DesignationId);
      formData.append('CTC', data.hrForm.CTC);
      // formData.append('joiningBonus',data.hrForm.joiningBonus);
      //formData.append('salary',data.hrForm.salary);
      formData.append('primarySkillId', data.hrForm.primarySkillId);
      formData.append('offeredBy', data.hrForm.offeredBy);
      formData.append('offeredOn', intDate);
      formData.append('recruiterId', data.hrForm.recruiterId);
      if (data.hrForm.joiningBonus) {
        formData.append('joiningBonus', data.hrForm.joiningBonus);
      }
      if (data.hrForm.annualVariablePay) {
        formData.append('AnnualVariablePay', data.hrForm.annualVariablePay);
      }
      if (data.hrForm.NoticeBuyOut) {
        formData.append('NoticeBuyOut', data.hrForm.NoticeBuyOut);
      }
      if (data.hrForm.TravelExp) {
        formData.append('TravelExp', data.hrForm.TravelExp);
      }
      if (data.hrForm.RelocationExp) {
        formData.append('RelocationExp', data.hrForm.RelocationExp);
      }
      if (data.hrForm.RetentionBonus) {
        formData.append('RetentionBonus', data.hrForm.RetentionBonus);
      }
      if (data.hrFinal_Remarks) {
        formData.append('hrFinal_Remarks', data.hrFinal_Remarks);
      }
      if (data.iConfirmedVidExcepCheckBox) {
        formData.append('PanelConcent', data.iConfirmedVidExcepCheckBox?.value ? 'Y' : 'N');
      }

    }

    // if(this.candidteRoundDetails?.interviewType.Id != 1){      
    formData.append('IsFeedbackSaveOrDraft', this.isDraftFeedback ? 'D' : 'S');
    // }
    /***
     * final http
     */
    this.finalHTTpCall(formData);

  }

  /***
   * form Submit for tech feedback
   */
  techSubmitForm(data: any) {
    this.technicalForm.markAllAsTouched();
    let techRatings = data.technicalForm.techRatingDetails.filter(d => d.rating !== null);
    let autoQuestDataPre = data.technicalForm.autoQuestionDetails.filter(d => d.Rating != 0 && d.AutoQAns != '');
    let autoQuestData = autoQuestDataPre.filter(d => d.Rating !== null && d.AutoQAns !== null && d.type == 0);
    let autoQuestDataAllData = data.technicalForm.autoQuestionDetails;
    let finalAutoQuestData = [];
    if (autoQuestDataAllData.length != 0) {
      for (let i = 0; i < autoQuestDataAllData.length; i++) {
        let bb = autoQuestDataAllData[i];
        bb['Rating'] = bb['Rating'] == null ? 0 : bb['Rating'];
        finalAutoQuestData.push(bb);
      }
    }

    const getTokenEmp = this._storage.getUserEmpId();
    let intTpe = this.candidteRoundDetails.interviewType.Id;
    let interviewBy = this.candidteRoundDetails?.interviewBy;
    let formData = new FormData();
    if (intTpe == 2 && interviewBy == 'I') {
      if (autoQuestData.length < 5 && this.isAIQuestionFeedbackEnable) {
        this._share.showAlertErrorMessage.next('Minimum 5 questions for feedback are required. Please provide feedback for at least 5 questions.');
        this.isloader = false;
        return false
      }
    }
    formData.append('cid', this.data.cid);
    formData.append('StatusId', data.candidateStatuslog);
    formData.append('interviewTypeId', this.candidteRoundDetails.interviewType.Id);
    formData.append('roundId', this.candidteRoundDetails.RoundId);
    if (data.AssessmentDate) {
      let mettlDate = GlobalMethod.formatDate(data.AssessmentDate) + " 00:00:00";
      formData.append('AssessmentDate', mettlDate);
    }
    if (techRatings.length != 0) {
      formData.append('techAreas', JSON.stringify(techRatings));
    }
    if (finalAutoQuestData.length != 0) {
      formData.append('autoQuestionFeedback', JSON.stringify(finalAutoQuestData));
    }
    if (data.score) {
      formData.append('score', data.score);
    }
    if (this.candidateOtherDetails?.coderByteReportUrl) {
      formData.append('coderByteReportUrl', this.candidateOtherDetails?.coderByteReportUrl);
    }
    if (data.iConfirmedVidExcepCheckBox) {
      formData.append('PanelConcent', data.iConfirmedVidExcepCheckBox ? 'Y' : 'N');
    }
    formData.append('AddedBy', getTokenEmp);
    // formData.append('strengths', data.technicalForm.strengths?data.technicalForm.strengths:'');
    // formData.append('limitations', data.technicalForm.limitations?data.technicalForm.limitations:'');
    //formData.append('technical', data.technicalForm.technical?data.technicalForm.technical:'');
    // formData.append('nonTechnical', data.technicalForm.nonTechnical?data.technicalForm.nonTechnical:'');
    //  formData.append('evaluation', data.technicalForm.evaulation);
    if (data.technicalForm.remarks) {
      formData.append('techRemarks', data.technicalForm.remarks);
    }

    //   formData.append('groomable', data.technicalForm.groomable);
    if (data.technicalForm.strengths) {
      formData.append('strengths', data.technicalForm.strengths);
    }
    if (data.technicalForm.remarkNextLevel) {
      formData.append('remarkNextLevel', data.technicalForm.remarkNextLevel);
    }
    if (data.technicalForm.limitations) {
      formData.append('limitations', data.technicalForm.limitations);
    }
    if (data.technicalForm.technical) {
      formData.append('technical', data.technicalForm.technical);
    }
    if (data.technicalForm.nonTechnical) {
      formData.append('nonTechnical', data.technicalForm.nonTechnical);
    }
    if (data.technicalForm.evaulation) {
      formData.append('evaluation', data.technicalForm.evaulation);
    }
    if (data.candidateStatuslog == 10) {
      if (data.technicalForm.GroomableArea1) {
        formData.append('GroomableArea1', data.technicalForm.GroomableArea1);
      }
      if (data.technicalForm.GroomableArea2) {
        formData.append('GroomableArea2', data.technicalForm.GroomableArea2);
      }
      if (data.technicalForm.GroomableArea3) {
        formData.append('GroomableArea3', data.technicalForm.GroomableArea3);
      }

    }
    //if(this.candidteRoundDetails.interviewType.Id === 5 || this.candidteRoundDetails.interviewType.Id === 3){
    if (this.imgFile) {
      formData.append('TestAttachment', this.imgFile);
    }
    // if(this.isDraftFeedback){      
    formData.append('IsFeedbackSaveOrDraft', this.isDraftFeedback ? 'D' : 'S');
    // }

    //  }
    formData.append('interviewBy', this.candidteRoundDetails.interviewBy ? this.candidteRoundDetails.interviewBy : 'I');

    /**detailed feedback questiinnaire */
    //  let technicalPracticeSkillForm = {};
    let fundamentalKnowledgForm = {};
    let prblmSolvingSkillForm = {};
    //  let industryDomainKnowledgForm = {};
    let CulturatFitAdaptabilityForm = {};
    /**fundamental Knowledg Form */
    if (data?.technicalForm?.fundamentalKnowledgForm?.assessRoleKnowledg) {
      fundamentalKnowledgForm['assessRoleKnowledg'] = data?.technicalForm?.fundamentalKnowledgForm?.assessRoleKnowledg;
    }
    /**prblm Solving Skill Form*/
    // if (data?.technicalForm?.prblmSolvingSkillForm?.candidateApprochComplexPrblm) {
    //   prblmSolvingSkillForm['candidateApprochComplexPrblm'] = data?.technicalForm?.prblmSolvingSkillForm?.candidateApprochComplexPrblm;
    // }
    if (data?.technicalForm?.prblmSolvingSkillForm?.candidatePrblmSolvingApproch) {
      prblmSolvingSkillForm['candidatePrblmSolvingApproch'] = data?.technicalForm?.prblmSolvingSkillForm?.candidatePrblmSolvingApproch;
    }

    /*CulturatFitAdaptabilityForm*/
    if (data?.technicalForm?.CulturatFitAdaptabilityForm?.candidateFitForInfogain) {
      CulturatFitAdaptabilityForm['candidateFitForInfogain'] = data?.technicalForm?.CulturatFitAdaptabilityForm?.candidateFitForInfogain;
    }
    // if (data?.technicalForm?.CulturatFitAdaptabilityForm?.candidateAbilityToAdoptChangeWork) {
    //   CulturatFitAdaptabilityForm['candidateAbilityToAdoptChangeWork'] = data?.technicalForm?.CulturatFitAdaptabilityForm?.candidateAbilityToAdoptChangeWork;
    // }
    let detailedFeedbackData: any = {};
    detailedFeedbackData['fundamentalKnowledgForm'] = fundamentalKnowledgForm;
    detailedFeedbackData['prblmSolvingSkillForm'] = prblmSolvingSkillForm;
    detailedFeedbackData['CulturatFitAdaptabilityForm'] = CulturatFitAdaptabilityForm;
    /**for detailed feedback - questionaire */
    if (this.isDetailedFeedbackEnable && this.isTechnicalExternalFeedback == false) {
      formData.append('TechnicalQuestionnaire', JSON.stringify(detailedFeedbackData));
    }
    formData.append('IsQuestionareEnable', this.isDetailedFeedbackEnable && this.isTechnicalExternalFeedback == false ? 'Y' : 'N');
    this.finalHTTpCall(formData);

  }

  /***
  * form next round schedule
  */
  NextRoundSchedule(data: any) {
    const getTokenEmp = this._storage.getUserEmpId();
    let selectboxValue = data.panel;
    let panelTrim = selectboxValue.trim();
    let panel = panelTrim.substr(panelTrim.length - 6);
    let intDate = GlobalMethod.formatDate(data.interviewDate) + " " + data.interviewTimeHours + ":" + data.interviewTimeMint + ":00";
    let formData = new FormData();
    formData.append('cid', this.data.cid);
    formData.append('StatusId', data.candidateStatuslog);
    if (data.interviewType) {
      formData.append('interviewTypeId', data.interviewType);
    }
    if (data?.interviewDate) {
      formData.append('interviewDate', intDate);
      formData.append('interviewDateUTC', GlobalMethod.convertToUTCDateTimeByTimzone(intDate, data.interviewDateTimeZone));
    }
    if (data.externalAgency) {
      formData.append('ExternalAgency', data.externalAgency);
    }
    if (data.IntModeType) {
      formData.append('interviewModeId', data.IntModeType);
    }
    if (data.InterviewLocationId) {
      formData.append('InterviewLocationId', data.InterviewLocationId);
    }
    if (data.interviewDuration) {
      formData.append('interviewDuration', data.interviewDuration);
    }

    formData.append('interviewerEmpId', data.panel);
    formData.append('offsetDate', GlobalMethod.getOffset().toString());
    formData.append('interviewBy', data?.interviewBy ? data?.interviewBy : 'I');
    if (data.interviewDateTimeZone) {
      formData.append('interviewTimeZone', data.interviewDateTimeZone);
    }
    // formData.append('interviewerEmpId', '113495');
    if (data.AdditionalInterviewer) {
      formData.append('AdditionalInterviewer', data.AdditionalInterviewer.toString());
    }
    if (data.Venue) {
      formData.append('vanueOrLink', data.Venue);
    }
    if (data.remarks) {
      formData.append('remarks', data.remarks);
    }
    if (data.idType) {
      formData.append('identityId', data.idType);
    }
    if (data.idNumber) {
      formData.append('identityNo', data.idNumber);
    }
    if (data.isOfferInHand) {
      formData.append('IsInHandOffer', data.isOfferInHand);
    }
    if (data.offerCompnay) {
      formData.append('CompanyID', data.offerCompnay);
    }
    if (data.offerConsnet) {
      formData.append('HRConcent', data.offerConsnet ? 'Y' : 'N');
    }
    if (data.OfferInHandAmount) {
      formData.append('OfferInHandAmount', data.OfferInHandAmount);
    }

    if (this.imgFileHR) {
      for (var i = 0; i < this.imgFileHR?.length; i++) {
        formData.append('HRDoc', this.imgFileHR[i]);
      }
    }

    if (this.imgFileOffer) {
      formData.append('OfferLetterAtt', this.imgFileOffer);
    }

    formData.append('AddedBy', getTokenEmp);

    if (data.coderBytesAssesments) {
      formData.append('candidateEmail', this.data?.email);
      formData.append('codeByteTestId', this.selectedCoderByteAssessment?.test_id);
      formData.append('assessment_url', this.selectedCoderByteAssessment?.public_url);
      formData.append('coderByteDisplayName', this.selectedCoderByteAssessment?.display_name);
    }
    if (data.techInternalPanel) {
      formData.append('ReasonForNotOptOnlineAssessment', data.techInternalPanel);
    }
    if (data.techExternalPanel) {
      formData.append('ReasonForOptExternal', data.techExternalPanel);
    }
    if (data.requirementChangeReason) {
      formData.append('DefaultAssessmentByChangeReason', data.requirementChangeReason);
    }

    if (this.approvalFile) {
      formData.append('TestAttachment', this.approvalFile);
    }
    /**new division for US */
    if (data.EntityId) {
      formData.append('EntityId', data.EntityId);
    }
    this.finalHTTpCall(formData);
  }
  /**
   * 
   * @param e groomable skill
   */
  groomable(e) {
    let val = e.value;
    if (val === "Y") {
      this.isGroomable = true;
      this.isGroomRequired = true;
    }
    else {
      this.isGroomRequired = false;
      setTimeout(() => {
        this.isGroomable = false;
      }, 500);
    }
  }
  /***
  * close dialog
  */
  closeModal(): void {
    this.dialogRef.close();
  }

  formatDateTime(date) {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear(),
      hh = d.getHours(),
      mm = d.getMinutes(),
      ss = d.getSeconds()

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    let dd = [year, month, day].join('-');
    let fm = dd + ' ' + hh + ':' + mm + ':' + ss;
    return fm;
  }

  public EmpListData: any = [];
  getEmpList(data: any) {
    this.EmpListData = data;
  }

  viewCalender() {
    let empIdArr = [];
    let panelControl = this.panelControl.value;
    let adpanelControl = this.adpanelControl.value;
    let date: string = this.interviewDate.value;
    if (adpanelControl) {
      empIdArr = adpanelControl;
    }
    if (panelControl) {
      empIdArr.push(panelControl)
    }
    let filterData: any = [];
    if (this.interviewDate.invalid) {
      this._share.showAlertErrorMessage.next('Please select Interview Date.')
    }
    else if (empIdArr.length === 0) {
      this._share.showAlertErrorMessage.next('Please select Panel.')
    }
    else if (empIdArr.length !== 0 && date) {

      filterData = this.EmpListData.filter(t => {
        return empIdArr.indexOf(t.empnewid) !== -1;
      });
      let data = {
        fromDate: GlobalMethod.formatDate(date),
        toDate: GlobalMethod.formatDate(date),
        empInfo: filterData
      }

      const dialogRef = this.dialog.open(ViewCalenderHistoryComponent, {
        width: '650px',
        panelClass: ['ats-model-wrap', 'ats-model-lg', , 'ats-model-cl'],
        backdropClass: 'calender-overlay',
        data: data,
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {

        }
      });
    }
  }

  //
  /***
 * open candidate pic popup
 */
  viewCandidatePictureModal() {
    const dialogRef = this.dialog.open(ViewProfilePicsComponent, {
      panelClass: ['ats-model-wrap', 'canidate-profil-picture-modal'],
      data: {
        roundId: this.candidteRoundDetails.RoundId,
        name: this.candidateData.Name
      },
      // data: {roundId:21774,
      // name:this.candidateData.Name
      // },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }

  //view all modal in submit feedback anayt
  public thId;
  getDataTalent(data) {
    //this.resetSortFilter();
    this.thId = data.TH_ID;
    this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, null, null)
  }
  public candidateList;

  getCandidateListByTalentId(page: number, pageSize: number, search: any, sortParam: any) {
    let queryString = `page=${page}&pageSize=${pageSize}&search=${search ? search.trim() : ''}${sortParam ? sortParam : ''}`;
    this._interviewStatus.viewCandidateListById(this.thId, queryString).subscribe(
      res => {
        this.candidateList = res['data'];
        //  this.paginationData = res['pagination'][0];
      }
    )
  }
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

  /**get screen reject Reason  */
  getScreenRejectReasonList(id) {
    this.globalApiServe.getScreenRejectReasonList(id).subscribe(
      res => {
        this.screenRejectReason = res['data'];
      }
    )
  }

  //add validation to upload video and id proof
  public flagScreeningIdPicVidMandat: boolean = true;
  public isUploadIdShow: boolean = false;
  // public isUploadVideoShow: boolean = false;
  public isNotC2h: boolean = false;
  addValidUploadIdVid(reqId) {
    this.isUploadIdShow = true;
    // this.isUploadVideoShow = true;
    if (reqId != 6) {
      this.isNotC2h = true;
      if (this.flagScreeningIdPicVidMandat) {
        this.UploadCandId.addValidators([Validators.required]);
        // this.UploadVideo.addValidators([Validators.required]);
        this.UploadCandId.updateValueAndValidity();
        // this.UploadVideo.updateValueAndValidity();
      }
    }

  }


  //clear validation to upload video and id proof
  clearValidUploadIdVid() {
    this.isUploadIdShow = false;
    // this.isUploadVideoShow = false;
    this.UploadCandId.clearValidators();
    // this.UploadVideo.clearValidators();
    this.UploadCandId.updateValueAndValidity();
    // this.UploadVideo.updateValueAndValidity();
  }

  /**get screen reject Reason test */
  // getScreenRejectReasonList2(id) {
  //   this.globalApiServe.getScreenRejectReasonList(id).subscribe(
  //     res => {
  //       /*filtering reject list by id*/
  //       let filterById = [1, 2, 3];
  //       let filteredRejectReason = res['data'].filter(t => {
  //         return filterById.indexOf(t.id) !== -1;
  //       });
  //       this.screenRejectReason = filteredRejectReason;
  //     }
  //   )
  // }
  openReportModal(elm: any) {
    const dialogRef = this.dialog.open(ViewCoderbyteReportComponent, {
      panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
      data: this.data,
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%'
    });
  }

  /**open quesionnaire int feedback modal */
  public isDraftQuesnnaire: boolean = false;
  intQuesionnaireModal(elm: any = {}) {
    elm['cid'] = this.data?.cid;
    elm['roundId'] = this.candidteRoundDetails?.RoundId;
    elm['name'] = this.data?.Name;
    const dialogRef = this.dialog.open(InterviewFeedbackQuesionnaireModalComponent, {
      panelClass: ['ats-model-wrap', 'int-feedback-quesionnaire', 'ats-model-full-screen'],
      data: elm,
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%'
    });
    dialogRef.afterClosed().subscribe(
      res => {
        if (res) {
          //this.feedbackHideShowSetion();
          if (res?.isValid === 1) {
            // this.remarksTech.patchValue(res?.formFeedbackData);
            this.candidteRoundDetails
            if (res.type == 'D') {
              this.isDetailedFeedbackDraft = true;
            } else {
              this.isDetailedFeedbackDraft = false;
            }
          }

        }
      }
    );
  }

  //Get interview status for if video is uploaded
  getInterviewStatus(StatusId: number, StatusName: string, IsExceptionVideo: string, fileNameVideo: string) {
    return (AtsCommonFuncService.getInterviewStatus(StatusId, StatusName, IsExceptionVideo, fileNameVideo));
  }



  getAndSelectedSkillDetails(data: any) {
    
  }
  //open slot list modal
  openSlotListModal(data: any = {}): void {

    let css = ['ats-model-wrap', 'view-slot-modal-five1'];
    data['title'] = "Panel Slot Details" + " - " + this.data?.talent_id;
    data['type'] = 'S';
    data['thid'] = this.data.th_id;


    const dialogRef = this.dialog.open(PanelSlotListThidComponent, {
      width: '650px',
      panelClass: css,
      data: data,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }
}
export function minLengthIfNotEmpty(minLength: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (control.value && control.value.length < minLength) {
      return { 'minLengthIfNotEmpty': { value: control.value } };
    }
    return null;
  };
}