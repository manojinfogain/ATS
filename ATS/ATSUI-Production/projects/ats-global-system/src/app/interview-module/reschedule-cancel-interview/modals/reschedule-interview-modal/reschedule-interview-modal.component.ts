import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { CONSTANTS } from 'projects/ats-global-system/src/app/core/constant/constants';
import { InterviewCommonService } from 'projects/ats-global-system/src/app/core/services/interview-common.service';
import { InterviewStatusService } from 'projects/ats-global-system/src/app/core/services/interview-status.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { InrerviewsService } from 'projects/ats-global-system/src/app/interview-module/inrerviews.service';
import { ViewCalenderHistoryComponent } from 'projects/ats-global-system/src/app/shared/shared-app/components/view-calender-history/view-calender-history.component';
import * as moment from 'moment';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { GetLocationInfo } from 'projects/ats-global-system/src/app/core/common/getLocationInfo';
import { FILE_UPLOAD, salaryMinMaxLoc } from 'projects/ats-global-system/src/app/core/constant/common.const';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { GlobalCommonMethodService } from 'projects/ats-global-system/src/app/core/common/global-common-method.service';
import { Observable, forkJoin } from 'rxjs';
import { CandidateCommonApiService } from 'projects/ats-global-system/src/app/core/services/candidate-common-api.service';
import { ConfirmationDialogComponent } from 'projects/ats-global-system/src/app/shared/shared-app/components/confirmation-dialog/confirmation-dialog.component';
import { PanelSlotListThidComponent } from 'projects/ats-global-system/src/app/panel-self-nomination-module/Modal-Screen/panel-slot-list-thid/panel-slot-list-thid.component';
@Component({
  selector: 'app-reschedule-interview-modal',
  templateUrl: './reschedule-interview-modal.component.html',
  styleUrls: ['./reschedule-interview-modal.component.scss']
})
export class RescheduleInterviewModalComponent implements OnInit {
  public isloader: boolean = false;
  public candidateData: any = [];
  public candidteRoundDetails: any = [];
  minDate = new Date();
  isTimeZero = true;
  intModeData: any = [];
  intRescheduleForm: UntypedFormGroup;
  isHideJoinDate: boolean = true;
  public intLocationList: any = [];
  public screenRoundFilter: any = []
  public managerialRoundFilter: any = []
  public isCancelledStatus: boolean = false;
  public techRoundFilter: any = [];
  public techRoundFilterByInternal: any = [];
  public hrDiscussionRound: any = [];
  public durationData: any[] = CONSTANTS.interviewDuration;
  public isExternalAgency: boolean = false;
  public interviewByTypeList: any = CONSTANTS.InterViewByListData;
  public externalAgencyList: any = [];
  public isIdProof: boolean = false;
  public idProofReq: boolean = false;
  public idTypeData: any = [];
  public rescheduleReasons: any = [];
  public entityList: any = [];
  constructor(
    public dialogRef: MatDialogRef<RescheduleInterviewModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _interviewStatus: InterviewStatusService,
    private _fb: UntypedFormBuilder,
    private _share: ShareService,
    private _InterviewServe: InrerviewsService,
    private _intCommonServe: InterviewCommonService,
    private dialog: MatDialog,
    private _storage: GetSetStorageService,
    public getLocInfo: GetLocationInfo,
    private globalApiServe: GlobalApisService,
    private _commonMethodServe: GlobalCommonMethodService,
    private _candidateCommon: CandidateCommonApiService
  ) { }
  public locationData: any = {};
  ngOnInit(): void {
    this.isloader = true;
    this.locationData = this.getLocInfo;
    if (this.data?.IsRenuTeam == 'Y') {
      this.IsRenuTeam = true;
    }
    else {
      this.IsRenuTeam = false;
    }
    this.getIntMode();
    this.getIntLocationsList();
    this.formSetup();
    this.getRoundDetails();
    this.getExternalAgencyLists();
    this.getCoderByteAssessments();
    this.GetAssessmentReasonMaster();
    //this.getInterviewRescheduleReasonsReason();
    this.getInterviewRescheduleReasonsReason();
    this.getIdType();
    /**coder byte assessment search */
    this.FilterCtrlCoderBytAssesment.valueChanges.subscribe(
      val => {
        this.searchInputCoderBytAssesment = val;
      }
    );
  }
  /***
    * get Interview Type
    */
  public listData: any = [];
  getIntType() {
    this._intCommonServe.getInterviewType().subscribe(
      res => {

        if (this.data?.requirementTypeId == 6) {
          this.listData = res['data'].filter(t => t.id == 4 || t.id == 6);
        } else {
          if (!this.isG4Hiring || this.getLocInfo.isLocationUS(null)) {
            this.listData = res['data'].filter(t => t.id != 7);
          }
          else {

            this.listData = res['data'];
          }
        }

      }
    );
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


  //geting external agency list
  getExternalAgencyLists() {
    this.globalApiServe.getExternalAgencyList().subscribe(
      res => {
        this.externalAgencyList = res['data'];
      }
    )
  }

  //geting rechedule reason list list
  getInterviewRescheduleReasonsReason() {
    this.globalApiServe.getInterviewCancelReason().subscribe(
      res => {
        this.rescheduleReasons = res['data'];
      }
    )
  }

  /**reason for internal and externa;l */
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
  /***
   * check if tech 1 round 
   */
  tech1RoundExist() {
    debugger
    this.isInterviewByVisible = true;
    this.interviewByControl.setValidators([Validators.required]);
    this.interviewByControl.patchValue('I');
    // if (this.techRoundFilter.length === 0) {
    //   this.isInterviewByVisible = true;
    //   this.interviewByControl.setValidators([Validators.required]);
    //   this.interviewByControl.patchValue('I');
    // }
    // else {
    //   this.isInterviewByVisible = false;
    //   this.interviewByControl.clearValidators();
    //   this.interviewByControl.patchValue('I');
    // }
    this.interviewByControl.updateValueAndValidity();
  }


  /**hide show tech 1 default */
  hideShowTech1Default(type: number) {
    this.candidateOtherDetails;
    debugger
    if (this.candidateOtherDetails?.Tech1InterviewById) {
      // this.techRoundFilter.length === 0 &&
      if (type == 2) {
        if (this.techRoundFilter.length === 0) {
          this.isInterviewByVisible = true;
          this.interviewByControl.setValidators([Validators.required]);

          // this.CTCControl.patchValue(this.candidteRoundDetails.CTC);
          //this.getControl('candidateStatuslog').patchValue(1);
          //  this.getControl('interviewTypeId').patchValue(2);
          this.interviewTypeIdControl.patchValue(this.currentInterviewTypeId)
          // 1 online assesment

          // this.GetReasonForNotOptOnlineExternalAssessment()
          this.GetReasonForNotOptOnlineExternalAssessment(this.candidateOtherDetails?.Tech1InterviewById);
          if (this.candidateOtherDetails?.Tech1InterviewById == 1) {
            this.interviewByControl.patchValue(this.candidateOtherDetails.OnlineAssesmentByShort);
            this.InterbyShowHideFunc(this.candidateOtherDetails.OnlineAssesmentByShort);
            this.getControl('InterviewDetails').patchValue(this.candidateOtherDetails?.AssessmentLink);
            if (this.candidateOtherDetails?.OnlineAssesmentByShort == 'C') {
              this.selectedCoderByteAssessment['test_id'] = this.candidateOtherDetails?.codeByteTestId;
              this.selectedCoderByteAssessment['public_url'] = this.candidateOtherDetails?.coderBytePublicKey;
              this.selectedCoderByteAssessment['display_name'] = this.candidateOtherDetails?.coderByteDisplayName;
              this.getControl('coderBytesAssesments').patchValue(this.candidateOtherDetails?.codeByteTestId);
            }
          }
          // 2 internal
          else if (this.candidateOtherDetails?.Tech1InterviewById == 2) {
            this.InterbyShowHideFunc(this.candidateOtherDetails.Tech1InterviewByShort);
            this.interviewByControl.patchValue(this.candidateOtherDetails.Tech1InterviewByShort);
            this.getControl('techInternalPanel').patchValue(this.candidateOtherDetails?.ReasonNotOptId);
          }
          /**external */
          else {
            this.interviewByControl.patchValue(this.candidateOtherDetails.Tech1InterviewByShort);
            this.InterbyShowHideFunc(this.candidateOtherDetails.Tech1InterviewByShort);

            // this.getControl('techInternalPanel').patchValue(this.candidateOtherDetails?.ReasonNotOptId);
            this.getControl('techExternalPanel').patchValue(this.candidateOtherDetails?.ReasonforOptId);
          }
        }
        else {
          debugger
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
      } else {
        this.interviewByControl.clearValidators();
        this.isInterviewByVisible = false;
      }
      this.interviewByControl.updateValueAndValidity();
      this.getControl('techInternalPanel').updateValueAndValidity();
    }

  }

  resetInterviewBy() {
    this.isInterviewByVisible = false;
    this.interviewByControl.clearValidators();
    this.interviewByControl.updateValueAndValidity();
    this.interviewByControl.patchValue('I');
    this.externalAgencyControl.clearValidators();
    this.externalAgencyControl.reset();
    this.isExternalAgency = false;
    this.isMettleReq = false;
    setTimeout(() => {
      this.isMettleSch = false;
    }, 500);
    this.externalAgencyControl.updateValueAndValidity();
  }
  /**managing  "interview by" dropdown here*/
  public isMettleInterviewSchedule: boolean = false;
  public isInterviewByVisible: boolean = false;
  public isMettleReq: boolean = false;
  public isMettleSch: boolean = false;

  interviewByType(event: any) {
    let id = event.value;

    this.InterbyShowHideFunc(id);
    this.GetReasonForNotOptOnlineExternalAssessment(id);


    let currentVal = this.interviewByTypeList.filter(list => list.id == id);

    /**condtion to show alert for changing option and showing reason dropdown */
    if (id == 'C' || id == 'G' || id == 'M') {
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
    }
    else {
      this.showHideReasonFunc(false);
    }
    this.hideshowApprovalAttachment(currentVal, id)
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
        //message: `You are changing the requirement ${data?.name}.`,
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
  public coderByteAssessmentList: any = [];
  public FilterCtrlCoderBytAssesment: UntypedFormControl = new UntypedFormControl();
  public searchInputCoderBytAssesment: string;
  getCoderByteAssessments() {
    this.globalApiServe.getCoderByteAssessments().subscribe(
      res => {
        this.coderByteAssessmentList = res['data'];
      })
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
  /**getting coderByte assessment on change */
  public selectedCoderByteAssessment: any = [];
  getCoderByteAssesmentID(data: any) {
    let currentAssesment = this.coderByteAssessmentList?.filter(x => x.test_id === data.value);
    this.selectedCoderByteAssessment = currentAssesment[0];

    /**popup alert when coderbyte change and reason to be captured */
    if (this.candidateOtherDetails?.OnlineAssesmentByShort != 'C') {
      this.showHideReasonFunc(true);
    }
    else {
      if (this.isChangeDropdownAsses == false) {
        if (this.candidateOtherDetails.codeByteTestId != '' &&
          this.candidateOtherDetails.codeByteTestId != null &&
          this.selectedCoderByteAssessment?.test_id != this.candidateOtherDetails.codeByteTestId) {
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
    }


  }

  public IsLinkVisible: boolean = false;
  public IsLinkRequired: boolean = false;
  public isCoderByteAssessment: boolean = false;
  public isCoderByteAssessmentReq: boolean = false;

  public isTechInternal: boolean = false;
  public isTechExternal: boolean = false;
  InterbyShowHideFunc(id: string) {
    this.getControl('techExternalPanel').reset();
    this.getControl('techInternalPanel').reset();
    /**
      * external agency
      */
    if (id === 'E') {
      this.addValidatorsSch();
      this.isExternalAgency = true;
      this.externalAgencyControl.setValidators([Validators.required]);
      this.venueControl.clearValidators();
      this.venueControl.reset();
      this.externalAgencyControl.reset();
      this.isMettleReq = false;

      this.getControl('coderBytesAssesments').clearValidators();
      this.getControl('coderBytesAssesments').reset();
      this.isCoderByteAssessment = false;
      this.isTechExternal = true;
      this.getControl('techExternalPanel').setValidators([Validators.required]);
      // this.isTechInternal = true;
      // this.getControl('techInternalPanel').setValidators([Validators.required]);
      this.getControl('techInternalPanel').clearValidators();
      this.isTechInternal = false;
      setTimeout(() => {
        this.isMettleSch = false;
      }, 500);
    }
    /**
     * coder byte 
     */
    else if (id === 'C') {
      this.removeValidatorsSch();
      let empId = this._storage.getUserEmpId();
      this.externalAgencyControl.clearValidators();
      this.externalAgencyControl.reset();
      this.isExternalAgency = false;
      this.isMettleReq = true;
      //   this.panelControl.patchValue(empId);
      this.venueControl.clearValidators();
      this.venueControl.reset();

      this.isCoderByteAssessment = true;
      this.getControl('coderBytesAssesments').setValidators([Validators.required]);
      this.getControl('techExternalPanel').clearValidators();
      this.isTechExternal = false;
      this.getControl('techInternalPanel').clearValidators();
      this.isTechInternal = false;

      // this.getControl('InterviewDetails').clearValidators();
      setTimeout(() => {
        this.isMettleSch = true;
      }, 500);
    }
    /**mettl , glider */
    else if (id === 'M' || id === 'G') {
      this.removeValidatorsSch();
      let empId = this._storage.getUserEmpId();
      this.externalAgencyControl.clearValidators();
      this.externalAgencyControl.reset();
      this.isExternalAgency = false;
      this.isMettleReq = true;
      //   this.panelControl.patchValue(empId);
      this.venueControl.setValidators([Validators.required]);

      this.getControl('coderBytesAssesments').clearValidators();
      this.getControl('coderBytesAssesments').reset();
      this.isCoderByteAssessment = false;
      this.getControl('techExternalPanel').clearValidators();
      this.isTechExternal = false;
      this.getControl('techInternalPanel').clearValidators();
      this.isTechInternal = false;

      //this.getControl('InterviewDetails').clearValidators();
      setTimeout(() => {
        this.isMettleSch = true;
      }, 500);
    }
    else {
      this.addValidatorsSch();
      this.externalAgencyControl.clearValidators();
      this.venueControl.clearValidators();
      this.venueControl.reset();
      this.externalAgencyControl.reset();
      this.isExternalAgency = false;
      this.isMettleReq = false;

      this.getControl('coderBytesAssesments').clearValidators();
      this.getControl('coderBytesAssesments').reset();
      this.isCoderByteAssessment = false;
      this.isTechInternal = true;
      this.getControl('techInternalPanel').setValidators([Validators.required]);
      this.getControl('techExternalPanel').clearValidators();
      this.isTechExternal = false;
      setTimeout(() => {
        this.isMettleSch = false;
      }, 500);
    }
    this.externalAgencyControl.updateValueAndValidity();
    this.venueControl.updateValueAndValidity();
    this.getControl('techInternalPanel').updateValueAndValidity();
    this.getControl('techExternalPanel').updateValueAndValidity();
  }

  addValidatorsSch() {
    this.interviewDateControl.addValidators([Validators.required]);
    this.getControl('interviewTimeHours').addValidators([Validators.required]);
    this.getControl('interviewTimeMint').addValidators([Validators.required]);
    this.getControl('InterviewMode').addValidators([Validators.required]);
    this.getControl('interviewDuration').addValidators([Validators.required]);
    this.interviewDateTimeZoneCtrl.addValidators([Validators.required]);

    this.getControl('interviewDuration').updateValueAndValidity();
    this.getControl('InterviewMode').updateValueAndValidity();
    this.getControl('interviewTimeHours').updateValueAndValidity();
    this.getControl('interviewTimeMint').updateValueAndValidity();
    this.interviewDateControl.updateValueAndValidity();
    this.interviewDateTimeZoneCtrl.updateValueAndValidity();

  }

  removeValidatorsSch() {
    this.interviewDateControl.clearValidators();
    this.interviewDateControl.reset();
    this.getControl('interviewTimeHours').reset();
    this.getControl('interviewTimeHours').clearValidators();
    this.getControl('interviewTimeMint').reset();
    this.getControl('interviewTimeMint').clearValidators();
    this.getControl('InterviewMode').reset();
    this.getControl('InterviewMode').clearValidators();
    this.getControl('interviewDuration').reset();
    this.getControl('interviewDuration').clearValidators();
    this.interviewDateTimeZoneCtrl.clearValidators();
    this.interviewDateTimeZoneCtrl.reset();

    this.getControl('interviewDuration').updateValueAndValidity();
    this.interviewDateControl.updateValueAndValidity();
    this.getControl('interviewTimeHours').updateValueAndValidity();
    this.getControl('interviewTimeMint').updateValueAndValidity();
    this.getControl('InterviewMode').updateValueAndValidity();
    this.interviewDateTimeZoneCtrl.updateValueAndValidity();
  }

  getControl(name: string) {
    return this.intRescheduleForm.get(name);
  }
  /***
   * get Details
   */
  public candidateOtherDetails: any = {};
  public isG4Hiring: boolean = false;
  public filterByIdIntType: any = [];
  public IsRenuTeam: boolean = false;
  getRoundDetails() {
    if (this.data) {
      this.isloader = true;
      forkJoin([
        this._interviewStatus.getCandidateDetails(this.data.cid),
        this._candidateCommon.getCandidateDetailsProfile(this.data?.cid, null, null),
        // this.globalApiServe.getDivisionList(),
        this.globalApiServe.getLegalEntityList(),
      ]).subscribe(
        res => {
          this.isloader = false;
          this.candidateData = res[0];
          this.candidateOtherDetails = res[1]['data'][0];

          let entityListData = res[2]['data'];
          if (this.getLocInfo.isLocationUS()) {
            // this.entityList = entityListData.filter(list => list?.ID == 22);
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
          this.getIntType();
          if (this.candidateData?.roundList.length != 0) {
            let crrInt = this.candidateData?.roundList.filter(list => list.IsCurrentRound == 'Y');
            this.candidteRoundDetails = crrInt[0];
            this.techRoundFilter = this.candidateData?.roundList.filter(d => d?.interviewType?.Id === 2 && d?.InterViewStatus?.Id === 7 || d?.interviewType?.Id === 2 && d?.InterViewStatus?.Id === 10);
            this.techRoundFilterByInternal = this.candidateData?.roundList.filter(d => (d?.interviewType?.Id === 2 && d?.InterViewStatus?.Id === 7 || d?.interviewType?.Id === 2 && d?.InterViewStatus?.Id === 10) && d?.interviewBy == 'I');
            this.screenRoundFilter = this.candidateData?.roundList.filter(d => d?.interviewType?.Id === 1 && d?.InterViewStatus?.Id === 7 || d?.interviewType?.Id === 1 && d?.InterViewStatus?.Id === 10);
            this.managerialRoundFilter = this.candidateData?.roundList.filter(d => d?.interviewType?.Id === 6 && d?.InterViewStatus?.Id === 7 || d?.interviewType?.Id === 6 && d?.InterViewStatus?.Id === 10);
            this.hrDiscussionRound = this.candidateData?.roundList.filter(d => (d?.interviewType?.Id === 7 && d?.InterViewStatus?.Id === 7 || d?.interviewType?.Id === 7 && d?.InterViewStatus?.Id === 10));
            let InterViewStatusId = this.candidteRoundDetails.InterViewStatus.Id;
            let intType = this.candidteRoundDetails.interviewType.Id;

            this.setDefaultVale(crrInt);
            if (InterViewStatusId == 2) {

              // this.isHideJoinDate = false;
              this.isCancelledStatus = true;
              // this.interviewTypeIdControl.patchValue('4');
              if (intType == 4) {

                if (this.getLocInfo.isLocationIndia(null)) {
                  // if (this.getLocInfo.isLocationIndia(null)) {
                  this.isIdProof = true;
                  this.idProofReq = true;
                  this.addValidUploadIdVid();
                  if (this.candidateData?.Identity?.ID) {
                    this.idTypeControl.patchValue(this.candidateData?.Identity?.ID);
                    // this.idTypeControl.disable();
                    this.getSelectedIdType(this.candidateData?.Identity?.ID);
                    this.idNumberControl.patchValue(this.candidateData?.IdentityNo);
                    // this.idNumberControl.disable();
                  }
                  this.isHRDocVisible = true;
                  if (this.candidateData?.EmploymentTypeId != 2) {
                    //  this.HRDocReq = true;
                    if (this.IsRenuTeam == false) {
                      this.HRDocReq = true;
                      this.fileUploadHRCtrl.setValidators([Validators.required]);
                    } else {
                      this.fileUploadHRCtrl.clearValidators();
                    }
                    //     this.fileUploadHRCtrl.setValidators([Validators.required]);
                    this.isOfferInHandCtrl.setValidators([Validators.required]);
                  } else {
                    this.isOfferInHandCtrl.clearValidators();
                    this.HRDocReq = false;
                    this.fileUploadHRCtrl.clearValidators();

                  }
                }
                else {
                  this.resetIDControlType();
                  this.clearValidUploadIdVid();
                  this.isOfferInHandCtrl.clearValidators();
                  this.isHRDocVisible = false;
                  this.HRDocReq = false;
                  this.fileUploadHRCtrl.clearValidators();
                }
                this.isOfferInHandCtrl.updateValueAndValidity();
                this.fileUploadHRCtrl.updateValueAndValidity();
              }
              if (intType == 2) {

                if (this.getLocInfo.isLocationIndia()) {
                  // this.hideShowTech1Default();
                  this.hideShowTech1Default(2);
                }

              }

            }
            else {
              // this.isHideJoinDate = true;

              this.isIdProof = false;
              this.idProofReq = false;
              this.clearValidUploadIdVid();
              this.resetIDControlType();
              this.isCancelledStatus = false
            }

            //method for default value

            // this.setDefaultVale(crrInt);

          }
        },
        (error) => {
          this.isloader = false;
        }
      )
    }
  }

  getENtity(e: any) {
    debugger
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

  IsDocOption: boolean = false;
  IsConsentVis: boolean = false;
  IsDocOfferVis: boolean = false;

  getOfferId(event: any) {
    this.offerConsnetCtrl.clearValidators();
    this.fileUploadOfferCtrl.clearValidators();
    this.IsDocOfferVis = false;
    this.IsConsentVis = false;
    if (event.value == 'Y') {
      this.IsDocOption = true;
    //  this.docOptCtrl.reset();
      this.docOptCtrl.addValidators([Validators.required]);
     // this.OfferInHandAmountCtrl.addValidators([Validators.required]);
     this.OfferInHandControlValidation();
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
  public salRange: any = salaryMinMaxLoc;
  OfferInHandControlValidation() {
    if (this.candidateData?.currency?.Id == 2) {
      this.OfferInHandAmountCtrl.setValidators([Validators.required, Validators.min(this.salRange?.usdMin), Validators.max(this.salRange?.usdMax)]);
    } else {
      this.OfferInHandAmountCtrl.setValidators([Validators.required, Validators.min(this.salRange?.inrMin), Validators.max(this.salRange?.inrMax)]);
    }
    this.OfferInHandAmountCtrl.updateValueAndValidity();
    // if (this.candidateData?.OfferInHandCTC != null || this.candidateData?.OfferInHandCTC != "") {
    //   this.OfferInHandAmountCtrl.patchValue(this.candidateData?.OfferInHandCTC);
    // }
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


  //set default value in form for reschedule
  public interviwerImpId: number;
  public showSelectedValue: boolean = false;
  public currentInterviewTypeId: number;
  setDefaultVale(crrInt: any) {
    this.showSelectedValue = true;
    this.interviwerImpId = crrInt[0].interviewer.Id;
    this.currentInterviewTypeId = crrInt[0].interviewType?.Id;
    let arrayAdInt: any = [];
    if (crrInt[0].AdditionalInterviewer.length != 0) {
      let adInt = crrInt[0].AdditionalInterviewer;
      for (let i = 0; i < adInt.length; i++) {
        arrayAdInt.push(adInt[i].Id);
      }
    }
    let inType = crrInt[0]?.interviewType?.Id;
    let intStatusId = this.candidteRoundDetails.InterViewStatus.Id;
    if (intStatusId === 1 || intStatusId === 3 || intStatusId === 2) {
      if (inType == 2) {
        this.tech1RoundExist();
      }
      this.intRescheduleForm.patchValue({
        InterviewDate: new Date(crrInt[0].InterviewDate),
        InterviewMode: crrInt[0].InterviewMode.id,
        JoiningDate: new Date(this.candidateData.joiningDate),
        InterviewDetails: crrInt[0].vanueOrLink,
        interviewDuration: crrInt[0].InterviewDuration,
        AdditionalInterviewer: arrayAdInt,
        interviewDateTimeZone: crrInt[0]?.interviewTimeZone ? crrInt[0]?.interviewTimeZone : null
      })
      this.onSelectModeInt(crrInt[0].InterviewMode.id);
      setTimeout(() => {
        if (crrInt[0].InterviewMode?.id == 2) {
          // if(crrInt[0].InterviewLocationId != null){
          //   this.onSelectInterviewLoc(crrInt[0].InterviewLocationId);
          // }
          if (crrInt[0].InterviewLocationId == '0') {
            this.InterviewLocationId.patchValue(crrInt[0].InterviewLocationId);
            this.onSelectInterviewLoc(crrInt[0].InterviewLocationId);
          } else {
            this.InterviewLocationId.patchValue(parseInt(crrInt[0].InterviewLocationId));
            this.onSelectInterviewLoc(parseInt(crrInt[0].InterviewLocationId));
          }
        }
        this.venueControl.patchValue(crrInt[0].vanueOrLink);
      }, 1000);
      // }
    }

    if (intStatusId === 2) {
      this.interviewTypeIdControl.patchValue(crrInt[0].interviewType?.Id)
    }


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

  public uploadDocLabelHR: string = 'Upload Salary Supporting Documents';
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
  /**just to clear validator and reset reasons to change  */
  clearValidatorAndResetReasons() {
    debugger
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
  // get interview Type
  public isHRDocVisible: boolean = false;
  public HRDocReq: boolean = false;
  getSelectedIntTypeId(e: any) {
    debugger
    let event = e.value;
    this.removeValidationForInhandOffer();
    //hr final round
    this.fileUploadHRCtrl.clearValidators();
    this.isOfferInHandCtrl.clearValidators();
    this.HRDocReq = false;
    this.isHRDocVisible = false;
    this.clearValidatorAndResetReasons();
    this.getControl('techInternalPanel').reset();
    this.getControl('techExternalPanel').reset();
    if (event === 4) {
      this.resetInterviewBy();
      /**check not valid for c2h */
      if (this.getLocInfo.isLocationIndia(null)) {
        if (this.screenRoundFilter.length === 0 && this.data?.requirementTypeId != 6) {
          this._share.showAlertErrorMessage.next("HR Final Round can not schedule before atleast 1 Screening round.");
          this.interviewTypeIdControl.reset();
        }
        else if (this.techRoundFilterByInternal?.length === 0 && this.data?.requirementTypeId != 6) {
          this._share.showAlertErrorMessage.next("HR Final Round can not schedule before atleast 1 Technical round with Internal Panel.");
          this.interviewTypeIdControl.reset();
        }
        else if (this.managerialRoundFilter?.length === 0 && this.data?.requirementTypeId == 6) {
          this._share.showAlertErrorMessage.next("HR Final Round can not schedule before atleast 1 Managerial round.");
          this.interviewTypeIdControl.reset();
        }
        else {
          let shortlistTech = this.techRoundFilter.filter(d => d.InterViewStatus.Id === 7 || d.InterViewStatus.Id === 10);
          if (shortlistTech.length === 0 && this.data?.requirementTypeId != 6) {
            /**check not valid for c2h */
            // if (this.data?.requirementTypeId != 6) {
            this._share.showAlertErrorMessage.next("HR Final Round can not schedule before submit  Technical Round feedback or shortlisted in Technical Round.");
            this.interviewTypeIdControl.reset();
            //  }
          }
          // else if(this.isG4Hiring === true && this.hrDiscussionRound?.length === 0){
          //   this._share.showAlertErrorMessage.next("HR Final Round can not schedule before HR Discussion Round.");
          //   this.interviewTypeIdControl.reset();

          // }
          else if (this.getLocInfo.isLocationIndia(null)) {
            // if (this.getLocInfo.isLocationIndia(null)) {
            this.isIdProof = true;
            this.idProofReq = true;
            this.addValidUploadIdVid();
            if (this.candidateData?.Identity?.ID) {
              this.idTypeControl.patchValue(this.candidateData?.Identity?.ID);
              // this.idTypeControl.disable();
              this.getSelectedIdType(this.candidateData?.Identity?.ID);
              this.idNumberControl.patchValue(this.candidateData?.IdentityNo);
              // this.idNumberControl.disable();
            }
            this.isHRDocVisible = true;
            if (this.candidateData?.EmploymentTypeId != 2) {
              //  this.HRDocReq = true;
              if (this.IsRenuTeam == false) {
                this.HRDocReq = true;
                this.fileUploadHRCtrl.setValidators([Validators.required]);
              } else {
                this.fileUploadHRCtrl.clearValidators();
              }
              // this.fileUploadHRCtrl.setValidators([Validators.required]);
              this.isOfferInHandCtrl.setValidators([Validators.required]);
            } else {
              this.HRDocReq = false;
              this.isOfferInHandCtrl.clearValidators();
              this.fileUploadHRCtrl.clearValidators();
            }
          }
          else {
            this.resetIDControlType();
            this.clearValidUploadIdVid();
            this.isOfferInHandCtrl.clearValidators();
            this.isHRDocVisible = false;
            this.HRDocReq = false;
            this.fileUploadHRCtrl.clearValidators();
          }


        }

      } else if (this.getLocInfo.isLocationUS(null)) {
        if (this.screenRoundFilter.length === 0 && this.data?.requirementTypeId != 6) {
          this._share.showAlertErrorMessage.next("HR Final Round can not schedule before atleast 1 Screening round.");
          this.interviewTypeIdControl.reset();
        }
        else if (this.techRoundFilterByInternal?.length === 0 && this.data?.requirementTypeId != 6) {
          // this._share.showAlertErrorMessage.next("HR Final Round can not schedule before atleast 1 Technical round with Internal Panel.");
          // this.interviewTypeIdControl.reset();
          if (this.managerialRoundFilter?.length === 0 && this.data?.requirementTypeId != 6) {
            this._share.showAlertErrorMessage.next("HR Final Round can not schedule before atleast 1 Technical round with Internal Panel or Managerial round.");
            this.interviewTypeIdControl.reset();
          }
        }
        // else if (this.managerialRoundFilter?.length === 0 && this.data?.requirementTypeId == 6) {
        //   this._share.showAlertErrorMessage.next("HR Final Round can not schedule before atleast 1 Managerial round.");
        //   this.interviewTypeIdControl.reset();
        // }
        else {
          debugger
          let shortlistTech = this.techRoundFilter.filter(d => d.InterViewStatus.Id === 7 || d.InterViewStatus.Id === 10);
          if (shortlistTech.length === 0 && this.data?.requirementTypeId != 6) {
            /**check not valid for c2h */
            // if (this.data?.requirementTypeId != 6) {
            this._share.showAlertErrorMessage.next("HR Final Round can not schedule before submit  Technical Round feedback or shortlisted in Technical Round.");
            this.interviewTypeIdControl.reset();
            //  }
          }
          // else if(this.isG4Hiring === true && this.hrDiscussionRound?.length === 0){
          //   this._share.showAlertErrorMessage.next("HR Final Round can not schedule before HR Discussion Round.");
          //   this.interviewTypeIdControl.reset();

          // }

          this.resetIDControlType();
          this.clearValidUploadIdVid();
          this.isOfferInHandCtrl.clearValidators();
          this.isHRDocVisible = false;
          this.HRDocReq = false;
          this.fileUploadHRCtrl.clearValidators();
        }
      }


    }

    else if (event === 7) {
      this.resetInterviewBy();
      if (this.isG4Hiring === false) {
        this._share.showAlertErrorMessage.next("HR Discussion not applicable for below G4.");
        this.interviewTypeIdControl.reset();
      }
      else if (this.screenRoundFilter.length === 0) {
        this._share.showAlertErrorMessage.next("HR Discussion Round can not schedule before atleast 1 Screening round.");
        this.interviewTypeIdControl.reset();
      }
      else if (this.techRoundFilterByInternal?.length === 0) {
        this._share.showAlertErrorMessage.next("HR Discussion Round can not schedule before atleast 1 Technical round with Internal Panel.");
        this.interviewTypeIdControl.reset();
      }

      this.resetIDControlType();
      this.clearValidUploadIdVid();
    }
    //managerial round
    else if (event === 6) {

      this.resetIDControlType();
      this.clearValidUploadIdVid();
      this.resetInterviewBy();

      if (this.screenRoundFilter.length === 0 && this.data?.requirementTypeId != 6) {
        /**check not valid for c2h */
        //   if (this.data?.requirementTypeId != 6) {
        this._share.showAlertErrorMessage.next("Managerial Round can not schedule before atleast 1 Screening round.");
        this.interviewTypeIdControl.reset();
        //   }
      }
      else if (this.techRoundFilterByInternal?.length === 0 && this.data?.requirementTypeId != 6 && this.getLocInfo.isLocationIndia(null)) {
        /**check not valid for c2h */
        //  if (this.data?.requirementTypeId != 6) {
        this._share.showAlertErrorMessage.next("Managerial Round can not schedule before atleast 1 Technical round with Internal Panel.");
        this.interviewTypeIdControl.reset();
        //  }
      }
    }

    //technical round
    else if (event === 2) {

      this.resetIDControlType();
      this.clearValidUploadIdVid();
      this.resetInterviewBy();
      if (this.screenRoundFilter.length === 0) {
        this._share.showAlertErrorMessage.next("Technical Round can not schedule before atleast 1 Screening round. ");
        this.interviewTypeIdControl.reset();
      }
      else {
        this.tech1RoundExist();
      }
    }
    //client round
    else if (event === 3) {
      this.resetIDControlType();
      this.clearValidUploadIdVid();
      this.resetInterviewBy();
      if (this.screenRoundFilter.length === 0) {
        this._share.showAlertErrorMessage.next("Client Round can not schedule before atleast 1 Screening round.")
        this.interviewTypeIdControl.reset();
      }
    }
    //managment round
    else if (event === 5) {
      this.resetIDControlType();
      this.clearValidUploadIdVid();
      this.resetInterviewBy();
      if (this.screenRoundFilter.length === 0) {
        this._share.showAlertErrorMessage.next("Management Round can not schedule before atleast 1 Screening round.")
        this.interviewTypeIdControl.reset();
      }
    }
    else {
      this.resetIDControlType();
      this.clearValidUploadIdVid();
      this.resetInterviewBy();
    }
    if (this.getLocInfo.isLocationIndia()) {
      debugger
      this.hideShowTech1Default(this.getControl('interviewTypeId').value);
    }
    this.isOfferInHandCtrl.updateValueAndValidity();
    this.fileUploadHRCtrl.updateValueAndValidity();
  }


  hoursValid(event) {
    if (event.value == "00") {
      this.isTimeZero = false;
      this.interviewTimeMintControl.patchValue("-1");
    }
    else {
      this.isTimeZero = true;
      this.interviewTimeMintControl.patchValue("00");
    }
  }

  /***
   * formSetup
   */
  formSetup() {
    this.intRescheduleForm = this._fb.group({
      InterviewDate: [null, [Validators.required]],
      interviewDateTimeZone: [null, [Validators.required]],
      JoiningDate: [null],
      InterviewMode: [null, [Validators.required]],
      interviewDuration: [null, [Validators.required]],
      interviewTypeId: [null],
      Interviewer: [null, [Validators.required]],
      AdditionalInterviewer: [null],
      Remarks: [null],
      InterviewDetails: [null],
      InterviewLocationId: [null],
      interviewTimeHours: [null, [Validators.required]],
      interviewTimeMint: [null, [Validators.required]],
      interviewBy: [null],
      externalAgency: [null],
      fileUploadHR: [null],
      UploadCandId: [null],
      idType: [null],
      idNumber: [null],
      isOfferInHand: [null],
      OfferInHandAmount: [null],
      fileUploadOffer: [null],
      offerCompnay: [null],
      offerConsnet: [null],
      docOpt: [null],
      coderBytesAssesments: [null],
      techInternalPanel: [null],
      techExternalPanel: [null],
      requirementChangeReason: [null],
      approvalFile: [null],
      EntityId: [null],
      // recheduleReason: [null,[Validators.required]]
      recheduleReason: [null]
    })
  }
  get interviewDateTimeZoneCtrl() { return this.intRescheduleForm.get('interviewDateTimeZone'); }
  get interviewDateControl() { return this.intRescheduleForm.get('InterviewDate') }
  get JoiningDateControl() { return this.intRescheduleForm.get('JoiningDate') }
  get InterviewerControl() { return this.intRescheduleForm.get('Interviewer') }
  get adPanelControl() { return this.intRescheduleForm.get('AdditionalInterviewer') }

  get interviewTimeHoursControl() { return this.intRescheduleForm.get('interviewTimeHours') }
  get interviewTimeMintControl() { return this.intRescheduleForm.get('interviewTimeMint') }
  get venueControl() { return this.intRescheduleForm.get('InterviewDetails'); }
  get InterviewLocationId() { return this.intRescheduleForm.get('InterviewLocationId'); }
  get interviewTypeIdControl() { return this.intRescheduleForm.get('interviewTypeId'); }
  get interviewModeControl() { return this.intRescheduleForm.get('InterviewMode'); }
  get interviewByControl() { return this.intRescheduleForm.get('interviewBy') }
  get externalAgencyControl() { return this.intRescheduleForm.get('externalAgency') }
  get fileUploadHRCtrl() { return this.intRescheduleForm.get('fileUploadHR'); }
  get idTypeControl() { return this.intRescheduleForm.get('idType'); }
  get idNumberControl() { return this.intRescheduleForm.get('idNumber'); }
  get UploadCandId() { return this.intRescheduleForm.get('UploadCandId'); }
  get isOfferInHandCtrl() { return this.intRescheduleForm.get('isOfferInHand'); }
  get fileUploadOfferCtrl() { return this.intRescheduleForm.get('fileUploadOffer'); }
  get offerCompnayCtrl() { return this.intRescheduleForm.get('offerCompnay'); }
  get offerConsnetCtrl() { return this.intRescheduleForm.get('offerConsnet'); }
  get docOptCtrl() { return this.intRescheduleForm.get('docOpt'); }
  get OfferInHandAmountCtrl() { return this.intRescheduleForm.get('OfferInHandAmount'); }

  get approvalFileUpCtrl() { return this.intRescheduleForm.get('approvalFile'); }
  get EntityIdCtrl() { return this.intRescheduleForm.get('EntityId'); }
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
      this._InterviewServe.addCandVideo(body).subscribe(
        res => {
          // this._share.showAlertSuccessMessage.next(res);
        },
        (error) => {
          ctrl.reset();
          this._share.showAlertErrorMessage.next(error.error.Message);
        }
      )
    } else if (type == 2) {
      this._InterviewServe.uplaodVideoToSharePointInt(body).subscribe(
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
 * on mode change 
 */
  // onSelectModeInt(event: any): void {
  //   this.venueControl.reset();
  //   let id = event;
  //   if (id == "6" || id == '3') {
  //     this.venueControl.disable();
  //   }
  //   else {
  //     this.venueControl.enable();

  //   }
  // }

  /***
 * on mode change 
 */
  public isInterviewLocVisible: boolean = false;
  onSelectModeInt(event: any): void {
    this.venueControl.reset();
    this.InterviewLocationId.reset();
    this.venueControl.clearValidators();
    let id = event;
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
   * submit form
   */
  submitReschuleData(form: any) {
    let tDOJ = this.JoiningDateControl?.value;
    let intDate = this.interviewDateControl?.value;
    if (tDOJ < intDate) {
      this._share.showAlertErrorMessage.next(`Interview Date can not be greater than Tentative Joining Date.`);
      return false;
    }
    if (this.intRescheduleForm.valid) {

      let formData = form.value;
      this.isloader = true;
      let intStatusId = this.candidteRoundDetails.InterViewStatus.Id;
      if (intStatusId === 1 || intStatusId === 3) {
        this.rescheduleSameRound(formData);
      }
      else {
        this.NextRoundSchedule(formData);
      }

    }
    else {
      this.intRescheduleForm.markAllAsTouched();
      this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
    }
  }

  /***
   * reschdule same round
   */
  rescheduleSameRound(formData) {
    const getTokenEmp = this._storage.getUserEmpId();
    let intDate = GlobalMethod.formatDate(formData.InterviewDate) + " " + formData.interviewTimeHours + ":" + formData.interviewTimeMint + ":00";
    let body = {
      RoundId: this.candidteRoundDetails.RoundId,
      cid: this.data.cid,
      InterviewDate: intDate,
      interviewTimeZone: formData.interviewDateTimeZone,
      offsetDate: GlobalMethod.getOffset(),
      interviewDateUTC: GlobalMethod.convertToUTCDateTimeByTimzone(intDate, formData.interviewDateTimeZone),
      InterviewStatus: 3,
      InterviewMode: formData.InterviewMode,
      interviewDuration: formData.interviewDuration,
      Interviewer: formData.Interviewer,
      InterviewDetails: formData.InterviewDetails,
      UpdatedBy: getTokenEmp
    }
    if (formData.JoiningDate) {
      body['JoiningDate'] = GlobalMethod.formatDate(formData.JoiningDate);
    }
    if (formData.Remarks) {
      body['Remarks'] = formData.Remarks;
    }
    if (formData.InterviewDetails) {
      body['InterviewDetails'] = formData.InterviewDetails;
    }
    if (formData.AdditionalInterviewer) {
      body['AdditionalInterviewer'] = formData.AdditionalInterviewer.toString();
    }

    if (formData.recheduleReason) {
      body['rescheduleCancelReason'] = formData.recheduleReason;
    }

    if (formData.InterviewLocationId) {
      body['InterviewLocationId'] = formData.InterviewLocationId;
    }
    if (formData.InterviewDetails) {
      body['InterviewDetails'] = formData.InterviewDetails;
    }

    this._InterviewServe.reschedulingInterview(body).subscribe(
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

  changeCheckHROffer(e: any) {
    if (e.checked == false) {
      this.offerConsnetCtrl.reset();
    }

  }

  /***
* form next round schedule
*/
  NextRoundSchedule(data: any) {
    const getTokenEmp = this._storage.getUserEmpId();
    let intDate = GlobalMethod.formatDate(data.InterviewDate) + " " + data.interviewTimeHours + ":" + data.interviewTimeMint + ":00";
    let formData = new FormData();
    formData.append('cid', this.data.cid);
    formData.append('StatusId', '1');
    if (data.interviewType) {
      formData.append('interviewTypeId', data.interviewType);
    }
    if (data?.InterviewDate) {
      formData.append('interviewDate', intDate);
      formData.append('interviewDateUTC', GlobalMethod.convertToUTCDateTimeByTimzone(intDate, data.interviewDateTimeZone));
    }
    if (data.externalAgency) {
      formData.append('ExternalAgency', data.externalAgency);
    }
    if (data.InterviewMode) {
      formData.append('interviewModeId', data.InterviewMode);
    }
    if (data.interviewDuration) {
      formData.append('interviewDuration', data.interviewDuration);
    }
    if (data.interviewDateTimeZone) {
      formData.append('interviewTimeZone', data.interviewDateTimeZone);
    }
    // formData.append('interviewDate', intDate);
    //  formData.append('interviewDateUTC', GlobalMethod.convertToUTCDateTime(intDate));
    //  formData.append('interviewTimeZone', data.interviewDateTimeZone);
    //  formData.append('interviewModeId', data.InterviewMode);
    //  formData.append('interviewDuration', data.interviewDuration)
    formData.append('interviewerEmpId', data.Interviewer);
    formData.append('interviewTypeId', data.interviewTypeId);
    formData.append('offsetDate', GlobalMethod.getOffset().toString());
    formData.append('interviewBy', data?.interviewBy ? data?.interviewBy : 'I');
    if (data.InterviewDetails) {
      formData.append('vanueOrLink', data.InterviewDetails);
    }
    if (data.InterviewLocationId) {
      formData.append('InterviewLocationId', data.InterviewLocationId);
    }
    if (data.Remarks) {
      formData.append('remarks', data.Remarks);
    }
    if (data.AdditionalInterviewer) {
      formData.append('AdditionalInterviewer', data.AdditionalInterviewer.toString())

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
    if (this.imgFileHR.length != 0) {
      for (var i = 0; i < this.imgFileHR?.length; i++) {
        formData.append('HRDoc', this.imgFileHR[i]);
      }
    }

    if (this.imgFileOffer) {
      formData.append('OfferLetterAtt', this.imgFileOffer);
    }
    if (data.EntityId) {
      formData.append('EntityId', data.EntityId);
    }
    formData.append('AddedBy', getTokenEmp);
    formData.append('IsCache', 'T');
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
   * additional Emp
   */

  public EmpListData: any = [];
  getEmpList(data: any) {
    this.EmpListData = data;
  }
  /***
   * view panel calender
   */
  viewCalender() {
    let empIdArr = [];
    let panelControl = this.InterviewerControl.value;
    let adpanelControl = this.adPanelControl.value;
    let date: string = this.interviewDateControl.value;
    if (adpanelControl) {
      empIdArr = adpanelControl;
    }
    if (panelControl) {
      empIdArr.push(panelControl)
    }
    let filterData: any = [];
    if (this.interviewDateControl.invalid) {
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

  //add validation to upload video and id proof
  public flagScreeningIdPicVidMandat: boolean = true;
  public isUploadIdShow: boolean = false;
  // public isUploadVideoShow: boolean = false;
  addValidUploadIdVid() {
    this.isUploadIdShow = true;
    if (this.flagScreeningIdPicVidMandat) {
      this.UploadCandId.addValidators([Validators.required]);
      this.UploadCandId.updateValueAndValidity();
    }
  }


  //clear validation to upload video and id proof
  clearValidUploadIdVid() {
    this.isUploadIdShow = false;
    this.UploadCandId.clearValidators();
    this.UploadCandId.updateValueAndValidity();
  }

  //open slot list modal
  openSlotListModal(data: any = {}): void {
    this.data;
    debugger;
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

  /***
 * close dialog
 */
  closeModal(): void {
    this.dialogRef.close();
  }

  /***
 * on selectoin of interview location 
 */
  onSelectInterviewLoc(event: any): void {
    if (this.getLocInfo.isLocationIndia(null)) {
      if (event == '0') {
        this.venueControl.reset();
        this.venueControl.addValidators([Validators.required]);
      } else {
        this.venueControl.clearValidators();
        let venueDetails = this.intLocationList.filter(t => t.LocID == event)[0]?.ShortAddress;
        this.venueControl.patchValue(venueDetails);
      }
      this.venueControl.updateValueAndValidity();
    }
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


}