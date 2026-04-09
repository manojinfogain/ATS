import { Component, OnDestroy, OnInit } from '@angular/core';
import { CONSTANTS } from 'projects/ats-global-system/src/app/core/constant/constants';
import { InterviewStatusService } from 'projects/ats-global-system/src/app/core/services/interview-status.service';
import { InterviewFeedbackStatusComponent } from './modals/interview-feedback-status/interview-feedback-status.component';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { FeedbackRoundDetailsComponent } from './modals/feedback-round-details/feedback-round-details.component';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { TalentTransferComponent } from './modals/talent-transfer/talent-transfer.component';
import { saveAs } from "file-saver";
import { HttpClient } from '@angular/common/http';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { ExcelService } from 'projects/ats-global-system/src/app/core/common/excel.service';
import { DatePipe } from '@angular/common';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { UpdateInterviewerModalComponent } from './modals/update-interviewer-modal/update-interviewer-modal.component';
import { ReasonForDropModalComponent } from './modals/reason-for-drop-modal/reason-for-drop-modal.component';
import { JdPanelConfirmationModalComponent } from '../modals/jd-panel-confirmation-modal/jd-panel-confirmation-modal.component';
import { InterviewCommonService } from 'projects/ats-global-system/src/app/core/services/interview-common.service';
import { Subscription, forkJoin } from 'rxjs';
import { AtsCommonPrefix, COMMON_CONST } from 'projects/ats-global-system/src/app/core/constant/common.const';
import { CandidateDetailsModalComponent } from './modals/candidate-details-modal/candidate-details-modal.component';
import { ActivatedRoute } from '@angular/router';
import { CidPrefixPipe } from 'projects/ats-global-system/src/app/shared/pipes-directives/pipes/cid-prefix.pipe';
import { UploadCandidatePicVideoByTagComponent } from '../modals/upload-candidate-pic-video-by-tag/upload-candidate-pic-video-by-tag.component';
import { MessageDisplayComponent } from '../../common-sharing/modals/message-display/message-display.component';
import { GlobalCommonMethodService } from '../../core/common/global-common-method.service';
import { ConfirmationDialogComponent } from '../../shared/shared-app/components/confirmation-dialog/confirmation-dialog.component';
import { OfferService } from '../../offer-module/offer.service';
import { GetLocationInfo } from '../../core/common/getLocationInfo';
import { SendAssesmentToCandidateModalComponent } from './modals/send-assesment-to-candidate-modal/send-assesment-to-candidate-modal.component';
import { ViewCoderbyteReportComponent } from './modals/view-coderbyte-report/view-coderbyte-report.component';
import { AtsCommonFuncService } from '../../core/common/ats-common-func.service';
import { OnboardingSendCredConfirmationDialogComponent } from '../../shared/shared-app/components/onboarding-send-cred-confirmation-dialog/onboarding-send-cred-confirmation-dialog.component';
import { Console } from 'console';
import { CandidateCommonApiService } from '../../core/services/candidate-common-api.service';
import { ViewAllTechAiAssesmentComponent } from './modals/view-all-tech-ai-assesment/view-all-tech-ai-assesment.component';
@Component({
  selector: 'app-interview-feedback',
  templateUrl: './interview-feedback.component.html',
  styleUrls: ['./interview-feedback.component.scss'],
  providers: [DatePipe, CidPrefixPipe]
})
export class InterviewFeedbackComponent implements OnInit, OnDestroy {
  displayedColumns = [];
  private thId: string;
  public userData: any = {};
  public searchInput: string;
  public paginationData: any;
  public assessmentSendTitle = 'Assessment to Candidate'
  public candidateList: any = [];
  public jumpFirstPage: boolean = false;
  public sortFormFilter: UntypedFormGroup = new UntypedFormGroup({});
  public isResetSearch: boolean = false;
  public isResetFilter: boolean = false;
  public sortParam: string = '';
  public cidColName: string = AtsCommonPrefix.CidColName;
  public cidPrefix: string = AtsCommonPrefix.CidPrefix;
  public date = '2022-06-03T03:59:08Z';
  private refreshSubscription: Subscription;
  public isTalenLocationIndia: boolean = false;
  public talentIdControl: UntypedFormControl = new UntypedFormControl();
  public cust = 0x0000AEC200046C08;
  public interviewByLabel: any = CONSTANTS.InterViewByKeyName;
  constructor(
    private _interviewStatus: InterviewStatusService,
    public dialog: MatDialog,
    private _storage: GetSetStorageService,
    private http: HttpClient,
    private _share: ShareService,
    private _excelService: ExcelService,
    public datepipe: DatePipe,
    private _fb: UntypedFormBuilder,
    private _interCommon: InterviewCommonService,
    private _activateRoute: ActivatedRoute,
    private _cidPrefix: CidPrefixPipe,
    private _globalCommonMethod: GlobalCommonMethodService,
    private _offerServe: OfferService,
    private _candCommServe: CandidateCommonApiService,
    private getLocInfo: GetLocationInfo
  ) {
  }
  public isRedirect: boolean = false;
  public defaultValueSearch: string = null;
  /**
   * auto open feedback form check
   */
  feedbackAndListOpenMethod() {
    let queryParam = this._activateRoute['snapshot']?.queryParams?.cid;
    if (queryParam) {
      this._interviewStatus.checkInterviewStatus(queryParam).subscribe(
        res => {
          let data = res['data'][0];
          if ((data?.statusId == 1 || data?.statusId == 3) && data?.interviewerEmpId == this.userData?.EmpNewId) {
            let element: any = {};
            element['cid'] = queryParam;
            element['th_id'] = data?.th_id;
            //this.isRedirect = true;
            this.searchInput = data?.Email;
            this.defaultValueSearch = data?.Email;
            this.modalforFeedbackAndSchedule(element);
            this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, this.searchInput, null);
          }
          else {
            this._share.showAlertErrorMessage.next('You are not authorized to update feedback for ' + data?.Name);
            this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, null, null);
          }
        }
      )

    }
    else {
      this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, null, null);
    }
  }
  public isVisibleForIndia: boolean = false;
  showHideLocWise() {
    if (this.getLocInfo.isLocationIndia()) {

      this.isVisibleForIndia = true;
    } else {
      this.isVisibleForIndia = false;
    }
  }
  ngOnInit() {
    this.showHideLocWise();
    // this._globalCommonMethod.showMessagedisplay({
    //   title: 'Video image processing comparison started',
    //   autoHide:false,
    //   msg: `
    //   <p>video comparison processing has been started. It will take 5 -10 minutes. Thanks for your patience.</p>`
    // });
    /**remove transfer option */
    // this.displayedColumns.pop();
    this.userData = this._storage.getSetUserData();
    if (this.userData) {
      if (this.userData.RoleId === 4) {
        this.displayedColumns = ['talentId', 'Cid', 'CandidateName', 'primarySkill', 'EmailID', 'PhoneNo', 'intDate', 'recruiter', 'primaryInterviewer', 'additionalInterviewers', 'InterviewRound', 'CandidateStatus', 'ReasonForDrop', 'DropRemark', 'PrimaryRecruiter', 'ProfileSource','dormantStatus','isTidReopened', 'UpdateCurrentStatus'];
      }
      else {
        this.displayedColumns = ['talentId', 'Cid', 'CandidateName', 'primarySkill', 'EmailID', 'PhoneNo', 'intDate', 'recruiter', 'primaryInterviewer', 'additionalInterviewers', 'InterviewRound', 'InterviewBy', 'AssessmentDate', 'CandidateStatus', 'ReasonForDrop', 'DropRemark', 'PrimaryRecruiter', 'Notice', 'ProfileSource','dormantStatus','isTidReopened', 'UpdateCurrentStatus'];
      }
    }

    this.feedbackAndListOpenMethod();
    this.filterFormInit();
    this.refreshSubscription = this._share.detectSwitchLoc.subscribe(
      get => {
        this.resetSortFilter();
        this.talentIdControl.patchValue('all');
        this.thId = null;
        this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, null, null);
        this.showHideLocWise();
      }
    )
    this.compareCurrentInterviewDate();
  }

  /**comparing current time and date with interview time and date */
  compareCurrentInterviewDate() {
    let currentDate = new Date();
    if (this.candidateList?.interviewDate) {
      let assessmentDate = new Date(this.candidateList?.AssessmentDate);

      let date1 = new Date();
      let date2 = new Date('2022-12-31'); // replace with your second date

      let differenceInTime = date2.getTime() - date1.getTime();

      let differenceInDays = differenceInTime / (1000 * 3600 * 24);
      let differenceInHours = differenceInTime / (1000 * 3600);
      let differenceInMinutes = differenceInTime / (1000 * 60);
      let differenceInSeconds = differenceInTime / 1000;

      console.log(`Difference in Days: ${differenceInDays}`);
      console.log(`Difference in Hours: ${differenceInHours}`);
      console.log(`Difference in Minutes: ${differenceInMinutes}`);
      console.log(`Difference in Seconds: ${differenceInSeconds}`);
    }

  }

  /**
  * reset filter and search
  */
  resetSortFilter() {
    this.isResetSearch = true;
    this.isResetFilter = true;
    this.searchInput = '';
    this.sortParam = '';
    this.defaultValueSearch = null;
  }
  /**
* get filter value
* @param data
*/
  getSortData(data: string) {
    this.defaultValueSearch = null;
    this.isResetSearch = true;
    this.isResetFilter = false;
    this.searchInput = '';
    this.sortParam = data;
    this.jumpFirstPage = false;
    this.jumpFirstPage = true;
    this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, this.searchInput, data);
  }

  /***
 * filter form Init
 */
  filterFormInit() {
    this.sortFormFilter = this._fb.group({
      interviewByIdNew: [[]],
      primarySkill: [[]],
      dateFrom: [null],
      dateTo: [{ value: null, disabled: true }],
      subListType: [[]],
      candidateStatusNew: [[]],
      interviewTypeIdNew: [[]],
      practiceId: [[]],
    })
  }


  /**
   * get selected talent Id
   * @param data
   */
  getDataTalent(data) {
    this.defaultValueSearch = null;
    this.resetSortFilter();
    this.thId = data.TH_ID;
    this.jumpFirstPage = false;
    this.jumpFirstPage = true;
    this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, null, null)
  }

  /**
 * pagination method
 * @param pageEvent
 */
  getPagingData(pageEvent: any) {
    // this.getCandidateListByTalentId(pageEvent.pageIndex + 1, pageEvent.pageSize, this.searchInput ? this.searchInput : null);
    this.getCandidateListByTalentId(pageEvent.pageIndex + 1, pageEvent.pageSize, this.searchInput ? this.searchInput : null, this.sortParam);
  }

  /***
   * search
   */
  getSearchValueKey(e: any) {
    this.defaultValueSearch = null;
    this.isResetFilter = true;
    this.isResetSearch = false;
    this.sortParam = '';
    this.searchInput = e;
    this.jumpFirstPage = false;
    this.jumpFirstPage = true;
    this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, e, this.sortParam);
  }
  /**
   * get candidate list
   * @param page
   * @param pageSize
   * @param search
   */
  // getCandidateListByTalentId(page: number, pageSize: number, search: any) {
  //   let queryString = `page=${page}&pageSize=${pageSize}&search=${search ? search : ''}`;
  //   this._interviewStatus.viewCandidateListById(this.thId, queryString).subscribe(
  //     res => {
  //       this.candidateList = res['data'];
  //       this.paginationData = res['pagination'][0];
  //     }
  //   )
  // }

  public bodyParam: any = {};
  getCandidateListByTalentId(page: number, pageSize: number, search: any, sortParam: any) {
    this.bodyParam = {};
    let body = {
      page: page,
      pageSize: pageSize
    }

    if (sortParam?.dateFrom) {
      body['startDate'] = GlobalMethod.formatDate(sortParam?.dateFrom);
    }

    if (sortParam?.dateTo) {
      body['endDate'] = GlobalMethod.formatDate(sortParam?.dateTo);
    }

    if (this.thId) {
      body['thid'] = this.thId
    }
    if (search) {
      body['search'] = search;
    }
    if (sortParam?.candidateStatusNew && sortParam?.candidateStatusNew?.length !== 0) {
      let Ids = sortParam?.candidateStatusNew?.filter(n => n);
      body['intStatus'] = Ids.toString();
    }

    if (sortParam?.primarySkill && sortParam?.primarySkill?.length !== 0) {
      let Ids = sortParam?.primarySkill?.filter(n => n);
      body['primarySkill'] = Ids.toString();
    }
    if (sortParam?.interviewTypeIdNew && sortParam?.interviewTypeIdNew?.length !== 0) {
      let Ids = sortParam?.interviewTypeIdNew?.filter(n => n);
      body['IntType'] = Ids.toString();
    }
    if (sortParam?.interviewByIdNew && sortParam?.interviewByIdNew?.length !== 0) {
      let Ids = sortParam?.interviewByIdNew?.filter(n => n);
      body['IntBy'] = Ids.toString();
    }
    if (sortParam?.practiceId && sortParam?.practiceId.length !== 0) {
      let Ids = sortParam?.practiceId.filter(n => n);
      body['practiceId'] = Ids.toString();
    }
    this.bodyParam = body;
    this._interviewStatus.viewCandidateListByIdNew(body).subscribe(
      res => {
        this.candidateList = res['data'];
        this.paginationData = res['pagination'][0];
        // if(){

        //   this.isTalenLocationIndia = true;
        // }else{
        //   this.isTalenLocationIndia = false;

        // }
      }
    )
  }

  /**
   * transfer talent Id Method
   * @param element
   */

  transferCandidateToTalent(element: any) {
    const dialogRef = this.dialog.open(TalentTransferComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'update-interview-feedback', 'talent-transfers'],
      data: element,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.jumpFirstPage = false;
        this.jumpFirstPage = true;
        // this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, null);
        this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, this.searchInput, this.sortParam);
      }
    });
  }

  InrerviewScheduleFucn(data) {
    this._interCommon.getJDPanelAvailableDetails(data.th_id).subscribe(
      res => {
        let dataJd = res['data'][0];
        if (dataJd.JDAvailable == 'Y' && dataJd.PanelAvailable == 'Y') {
          //redirecting to schedule and feedback page
          this.modalforFeedbackAndSchedule(data);
        }
        else {
          //redirecting to jd and panel confirmation page
          this.openConfirmationModal(data)
        }

      }
    )
  }
  /**
   *  method for update feedback/ next round schedule
   * @param data
   */
  openModalForUpdateFeedback(data: any) {
    if (data?.statusid == 7 ||
      data?.statusid == 10 ||
      (data?.statusid == 6 && data?.interviewTypeId == 1 || data?.isTransfer == 1) ||
      data?.statusid == 4 && data?.isTransfer == 1 ||
      data?.statusid == 4 ||
      data?.statusid == 5 && data?.isTransfer == 1 ||
      data?.statusid == 2 && data?.isTransfer == 1) {
      //js clarification and panel avl api
      forkJoin([
        this._interviewStatus.GetRoundByCid(data.cid),
        this._interCommon.getCandidateFeebackEnableStatusByCid(data.cid)
      ]).subscribe(
        vidRes => {
          let roundDetails = vidRes[0];
          let vidData = vidRes[1]['VideoInt'][0];
          let statusData = vidRes[1]['data'][0];
          if (statusData?.OfferStatus == 20 ||
            statusData?.OfferStatus == 30 ||
            statusData?.OfferStatus == 40 ||
            statusData?.OfferStatus == 50 ||
            statusData?.OfferStatus == 60 ||
            statusData?.OfferStatus == 70 ||
            statusData?.OfferStatus == 80 ||
            statusData?.OfferStatus == 90) {
            this._share.showAlertErrorMessage.next('Interview cannot schedule during Offer Process.');
          }
          else if (statusData?.OfferStatus == 200) {

            this._share.showAlertErrorMessage.next('Candidate Joined.Interview cannot schedule.');
          }else if (data?.IsTidReopened == 1) {

            this._share.showAlertErrorMessage.next('Interview cannot schedule after re-openning of Talent Id.');
          }else if (data?.HiringLocationId == 3 || statusData?.IsExceptionVideo == 'Y') {
            this.InrerviewScheduleFucn(data);
          }
          else if (roundDetails.PrevSharePointIdVideo && vidData?.IsVideoMatchExist == 'N') {
            this._globalCommonMethod.showMessagedisplay({
              title: 'Video image  comparison processing in progress',
              autoHide: false,
              msg: `
             <p>Video image comparison is in progress.Please check after sometime.</p>`
            });
          }
          else if (vidData?.IsIntScheduleEnable == 'Y' || data?.VideoMatch == null) {
            this.InrerviewScheduleFucn(data);
          }
          else {
            this._globalCommonMethod.showMessagedisplay({
              title: 'Alert',
              msg: 'Candidate video not aligned with previous round video.'
            });
          }
        }
      )

    } else {
      //redirecting to schedule and feedback page
      /****  if Status Scheduled/Reschedule  ****/
      if ((data?.statusid == 1 || data?.statusid == 3) &&
        (
          data?.interviewTypeId == 2 ||
          data?.interviewTypeId == 4 ||
          data?.interviewTypeId == 5 ||
          data?.interviewTypeId == 6 ||
          data?.interviewTypeId == 7
        )) {
        /**** check if  recruiter required to upload video before panel feedback  ****/
        this._interCommon.getCandidateFeebackEnableStatusByCid(data.cid).subscribe(
          res => {
            let statusData = res['data'][0];
            data['IsExceptionVideo'] = statusData?.IsExceptionVideo;
            data['IsVideoMatchExist'] = res['VideoInt'][0]?.IsVideoMatchExist;
            data['IsUplaodVideoEXist'] = statusData?.IsUplaodVideoEXist;

            /**** allow to update feedback ****/
            // if(statusData?.IsFeedbackEnable == 'Y' && statusData?.IsUplaodVideoEXist == 'Y'){
            //   this.modalforFeedbackAndSchedule(data);
            // }
            if (statusData?.IsTech1Round == 'N' || data?.HiringLocationId == 3 || statusData?.IsExceptionVideo == 'Y') {
              this.modalforFeedbackAndSchedule(data);
            }
            else if (statusData?.IsFeedbackEnable == 'Y' && statusData?.IsUplaodVideoEXist == 'Y') {
              this.modalforFeedbackAndSchedule(data);
            }
            /**** not  allow to update feedback till recruiter uplaod video ****/
            else {
              //latest comment from here
              // this._globalCommonMethod.showMessagedisplay({
              //   title: 'Alert',
              //   msg: 'Please wait till recruiter uploads candidate video.'
              // });
              this.modalforFeedbackAndSchedule(data);
            }
          }
        )
      }
      else {
        this.modalforFeedbackAndSchedule(data);
      }
    }

  }

  //open jd panel confirmation modal
  openConfirmationModal(element: any) {
    const dialogRef = this.dialog.open(JdPanelConfirmationModalComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'ats-model-full-screenss', 'request-transfers-candidate',],
      data: element,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.modalforFeedbackAndSchedule(element);
      }
    });
  }
  //feedback shedule modal


  modalforFeedbackAndSchedule(data: any) {
    const dialogRef = this.dialog.open(InterviewFeedbackStatusComponent, {
    //  width: '500px',
      panelClass: ['ats-model-wrap', 'update-interview-feedbackzz','ats-model-full-screen'],
      data: data,
      disableClose: true,
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.jumpFirstPage = false;
        this.jumpFirstPage = true;
        // this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, this.searchInput);
        this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, this.searchInput, this.sortParam);
      }
      else {
        if (this.isRedirect) {
          this.jumpFirstPage = false;
          this.jumpFirstPage = true;
          this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, this.searchInput, this.sortParam);
          this.isRedirect = false;
        }
      }
    });
  }
  /**
   * show interview round details
   * @param data
   */
  openfeedbackInfoModal(data: any) {
    const dialogRef = this.dialog.open(FeedbackRoundDetailsComponent, {
      //width: '500px',
      panelClass: ['ats-model-wrap', 'update-interview-feedback','ats-model-full-screen'],
      data: data,
      disableClose: true,
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }

  ViewGenAiTEchFeedback(data: any) {
   const dialogRef = this.dialog.open(ViewAllTechAiAssesmentComponent, {
       //  width: '500px',
         panelClass: ['ats-model-wrap', 'update-interview-feedback','ats-model-full-screen'],
         data: data,
         disableClose: true,
         maxWidth: '100vw',
         maxHeight: '100vh',
         height: '100%',
         width: '100%'
       });

       dialogRef.afterClosed().subscribe(result => {
         if (result) {
         }
       });
  }

  /**
  *open candidate details modal
  *
  */
  // openCandidateDetailsModal(data: any) {
  //   const dialogRef = this.dialog.open(CandidateDetailsModalComponent, {
  //     width: '500px',
  //     panelClass: ['ats-model-wrap', 'update-interview-feedback'],
  //     data: data,
  //     disableClose: true
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //     }
  //   });
  // }

  openCandidateDetailsModal(elm: any) {
    elm['title'] = elm?.Name + '';
    const dialogRef = this.dialog.open(CandidateDetailsModalComponent, {
      panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
      data: elm,
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%'
    });
  }
  openReportModal(elm: any) {
    const dialogRef = this.dialog.open(ViewCoderbyteReportComponent, {
      panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
      data: elm,
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%'
    });
  }

  /***
   * open reason for drop modal
   */
  openReasonForDropModal(element: any, type: number) {
    this.jumpFirstPage = false;
    element['title'] = "Reason for Drop";
    element['type'] = type;
    const dialogRef = this.dialog.open(ReasonForDropModalComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'ats-model-full-screenss', 'request-transfers-candidate',],
      data: element,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, null, null);
      }
    });
  }

  /***
   * open uplaod video/picture by Recruiter
   */
  openUploadVideoFormModal(element: any) {
    if ((element?.statusid == 1 || element?.statusid == 3) &&
      (element?.interviewTypeId == 2 && element?.interviewBy == 'I' ||
        element?.interviewTypeId == 4 ||
        element?.interviewTypeId == 5 ||
        element?.interviewTypeId == 6 ||
        element?.interviewTypeId == 7
      )) {
      /**** check if  recruiter required to upload video before panel feedback  ****/
      this._interCommon.getCandidateFeebackEnableStatusByCid(element.cid).subscribe(
        res => {
          let statusData = res['data'][0];
          element['statusData'] = statusData;
          /****  ****/
          // if(statusData?.IsUplaodVideoEXist == 'Y'){
          //   this._share.showAlertErrorMessage.next('Video already uploaded.')
          // }
          // else
          if (statusData?.IsTech1Round == 'N' && element?.interviewBy == 'M') {
            this._share.showAlertErrorMessage.next('Video can not  upload  against Mettl Round.')
          }
          else if (statusData?.IsTech1Round == 'N' && element?.interviewBy == 'E') {
            this._share.showAlertErrorMessage.next('Video can not  upload  against Technical Round with External Agency.')
          }
          // else if (statusData?.IsTech1Round == 'N') {
          //   this._share.showAlertErrorMessage.next('Candidate video can be uploaded only in first tech round (internal).')
          // }
          else if (statusData?.IsUplaodVideoEnable == 'Y') {
            this.openUploadVideoByTag(element);
          }
          /****  ****/
          else {
            this._share.showAlertErrorMessage.next('Invalid Request.')
          }
        }
      )
    }
  }

  /***
   * uplaod video by tag Form
   */

  openUploadVideoByTag(element: any) {
    this.jumpFirstPage = false;
    element['pageTitle'] = "Upload Candidate Video";
    const dialogRef = this.dialog.open(UploadCandidatePicVideoByTagComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'request-transfers-candidate'],
      data: element,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, null, null);
      }
    });
  }

  /**
   *
   * @param element
   * @returns
   */
  public showResendButtion(element: any){
    if((element?.statusid == 1 || element?.statusid == 3) &&
      (this.userData?.RoleId == 5 ||
        this.userData?.RoleId == 10 ||
        element?.primaryrecruiter == this.userData?.EmpNewId ||
        element?.secondaryrecruiter == this.userData?.EmpNewId) ){
      return true
    }
    else{
      return false
    }

  }

  public sendInviteCal(element: any){
    if(element?.statusid == 1 || element?.statusid == 3){
      this._interviewStatus.reSendInviteCal(element?.cid,'I').subscribe(
        res=>{
          this._share.showAlertSuccessMessage.next('Invite sent successfully.');
        }
      )
    }


  }
  /**
   *
   * @param element shpw hidebutton
   * @returns
   */
  public tooltipLabel: string = 'Upload Candidate Video';
  public tooltipFlag: boolean = false;
  showVideoUploadActionButton(element: any) {
    if (element?.fileNameVideo) {
      this.tooltipLabel = 'Video Uploaded';
      this.tooltipFlag = true;
    } else {
      this.tooltipLabel = 'Upload Candidate Video';
      this.tooltipFlag = false;
    }
    if ((element?.statusid == 1 || element?.statusid == 3) &&
      (element?.interviewTypeId == 2 && element?.interviewBy == 'I' ||
        element?.interviewTypeId == 4 ||
        element?.interviewTypeId == 5 ||
        element?.interviewTypeId == 6 ||
        element?.interviewTypeId == 7
      ) &&
      (this.userData?.RoleId == 5 ||
        this.userData?.RoleId == 10 ||
        element?.primaryrecruiter == this.userData?.EmpNewId ||
        element?.secondaryrecruiter == this.userData?.EmpNewId) &&
      element?.IsExceptionVideo == 'N'
    ) {
      return true
    }
    else {
      return false
    }
  }

  /***
   * download feedback
   */
  downloadPDF(elm: any) {
    let today = new Date();
    let todayDate = GlobalMethod.formatDate(today);
    this.http.get(`${environment.apiMainUrlNet}Interview/InterviewFeedbackpdf?cid=${elm.cid}`, { responseType: 'blob' }).subscribe(
      res => {
        saveAs(res, 'interview feedback (' + elm?.Name + ') ' + elm?.talent_id + '.pdf');
        this._share.showAlertSuccessMessage.next('Interview Feedback downloaded successfully.')
      }
    )
  }

  // updateInterviwer

  updateInterviewer(element: any) {
    element['title'] = "Transfer to Talent ID";
    const dialogRef = this.dialog.open(UpdateInterviewerModalComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'update-interview-feedback', 'upd-int-modal'],
      data: element,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.jumpFirstPage = true;
        this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, this.searchInput, this.sortParam);
      }
    });
  }

  /***
  * download file
  */
  dwnloadFileSingle(data) {
    if (data?.ProfileId == 3) {
      this._globalCommonMethod.downloadFileCskill(data?.resume_path, data?.c_resume);
    }
    else {

      data.cid ? this._globalCommonMethod.downloadResume(data.cid,"") : this._globalCommonMethod.downloadResume("",data.id)
     // this._globalCommonMethod.downloadFileCommon(data?.resume_path, data?.c_resume);
    }
  }
  /***
    * Credentials SendTo Candidate
    */

  public candiData: any = {};
  confirmCredentialsSendToCandidate(element: any) {
    this._candCommServe.getCandidateDetailsProfile(element?.cid).subscribe(
      res => {
        this.candiData = res['data'][0];

      // const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        const dialogRef = this.dialog.open(OnboardingSendCredConfirmationDialogComponent, {
          panelClass: 'ats-confirm',
          data: {
            joiningLocationId: this.candiData?.JoiningLocationId,
            packageId: this.candiData?.packageId,
            IsNewCaseForBGV: this.candiData?.IsNewCaseForBGV,
            BGVVender: this.candiData?.BGVVender,
             freezeVendor: this.candiData?.freezeVendor,
            headerText: 'Send Credentials',
            message: ` Please select joining location and BGV package for <span class='u-name'>${element?.Name}</span> and click send`,
            buttonText: {
              ok: "Send",
              cancel: "Cancel"
            },
          }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result?.flag) {
            let body: any = {
           //   cid: element.cid,
           Candidateid: element.candidateId,
              JoiningLocationId: result?.locationId,
              DivisionId: result?.divisionId,
              PackageId: result?.packageId,
              BGVVenderId: result?.vendorId,
            }
            this._offerServe.CreateCandidateUser(body).subscribe(
              res => {
                this._share.showAlertSuccessMessage.next(res);
                // this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, null, { startDate: null });
                this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, this.searchInput, this.sortParam);
              }
            )
          }

        });
      }
    )
  }

  /*** send assesment modal */
  sendAssessmentModal(element: any) {
    element['title'] = "Send Assessment to Candidate.";
    const dialogRef = this.dialog.open(SendAssesmentToCandidateModalComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'update-interview-feedback', 'talent-transfers', 'talent-transfers-mod'],
      data: element,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        //  this.paginatorCompRef.paginator.pageIndex = 0;
        //  this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, null, this.sortParam);
        this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, null, null);
      }
    });

  }

  /***
   * export excel
   */
  exportAsXLSX(): void {
    let queryString = `page=1&pageSize=${this.paginationData?.Total}&search=${this.searchInput ? this.searchInput.trim() : ''}${this.sortParam ? this.sortParam : ''}`;
    let bodyData = {
      ...this.bodyParam,
      page: 1,
      pageSize: this.paginationData?.Total,
    }
    this._interviewStatus.getCandidateListByIDReport(bodyData).subscribe(
      res => {
        let candidateList = res['data'];
        let filterDataExcel = [];
        for (var key in candidateList) {
          if (this.userData.RoleId === 4) {
            let selectedData = {
              'Talent ID': candidateList[key].talent_id,
              'CID': this._cidPrefix.transform(candidateList[key].cid, candidateList[key].ProfileId),
              'Skill': candidateList[key].primaryskill,
              'Candidate Name': candidateList[key].Name,
              'Gender': candidateList[key].Gender,
              'Phone No.': candidateList[key].phone,
              'Email ID': candidateList[key].email,
              'Panel': candidateList[key].Interviewer,
              'Interview Round': candidateList[key].interviewTypeId == 2 ? candidateList[key].interviewType + '-' + candidateList[key].CurrentRoundCount : candidateList[key].interviewType,
              'Candidate  Status': candidateList[key].statusid == 240 || candidateList[key].statusid == 260 ? candidateList[key].PrevStatusName + ' /' + candidateList[key].StatusName :  this.getInterviewStatus(candidateList[key].statusid,candidateList[key].StatusName, candidateList[key]?.IsExceptionVideo, candidateList[key]?.fileNameVideo),
              'Reason for Drop': candidateList[key].ReasonForDrop,
              'Drop Remark': candidateList[key].DropRemark,
              'interview Date': this.datepipe.transform(candidateList[key].interviewDate, 'yyyy/MM/dd  h:mm a'),
              'Recruiter': candidateList[key].recruiter,
              'Primary Recruiter': candidateList[key].primaryrecruiterName,
              'Notice Period': candidateList[key].c_notice_period,
              // 'Curreny Salary': candidateList[key].curSalary,
              //'Expected Salary': candidateList[key].expSalary,
              'Current Company': candidateList[key].currentCompany,
              'Profile Source': candidateList[key].ProfileSource,
              'Source Name': candidateList[key].SourceName,
              'Account Name': candidateList[key].AccountName,
              //'Experience': candidateList[key].totalexp + ' Year '+candidateList[key].totalexpMonth + ' Month ',
              // 'Location': candidateList[key].city_name +'('+candidateList[key].country_name+')',
              // 'Offer In Hand': candidateList[key].OfferInHand,
              // 'Offer In Hand CTC': candidateList[key].OfferInHandCTC,
            };
            filterDataExcel.push(selectedData);
          }
          else {
            let selectedData = {
              'Talent ID': candidateList[key].talent_id,
              'CID': this._cidPrefix.transform(candidateList[key].cid, candidateList[key].ProfileId),
              'Skill': candidateList[key].primaryskill,
              'Candidate Name': candidateList[key].Name,
              'Gender': candidateList[key].Gender,
              'Phone No.': candidateList[key].phone,
              'Email ID': candidateList[key].email,
              'Panel': candidateList[key].Interviewer,
              'Interview Round': candidateList[key].interviewTypeId == 2 ? candidateList[key].interviewType + '-' + candidateList[key].CurrentRoundCount : candidateList[key].interviewType,
              'Candidate  Status': candidateList[key].statusid == 240 || candidateList[key].statusid == 260 ? candidateList[key].PrevStatusName + ' /' + candidateList[key].StatusName :  this.getInterviewStatus(candidateList[key].statusid,candidateList[key].StatusName, candidateList[key]?.IsExceptionVideo, candidateList[key]?.fileNameVideo),
              'Reason for Drop': candidateList[key].ReasonForDrop,
              'Drop Remark': candidateList[key].DropRemark,
              'interview Date': this.datepipe.transform(candidateList[key].interviewDate, 'yyyy/MM/dd  h:mm a'),
              'Recruiter': candidateList[key].recruiter,
              'Primary Recruiter': candidateList[key].primaryrecruiterName,
              'Notice Period': candidateList[key].c_notice_period,
              'Current Salary': candidateList[key].curSalary,
              'Expected Salary': candidateList[key].expSalary,
              'Current Company': candidateList[key].currentCompany,
              'Profile Source': candidateList[key].ProfileSource,
              'Source Name': candidateList[key].SourceName,
              'Account Name': candidateList[key].AccountName,
              'Experience': candidateList[key].totalexp + ' Year ' + candidateList[key].totalexpMonth + ' Month ',
              'Location': candidateList[key].city_name + '(' + candidateList[key].country_name + ')',
              'Interview By': this.getintByName(candidateList[key]),
              'External Agency': candidateList[key].externalAgencyName,
              'Assessment Date': this.datepipe.transform(candidateList[key].AssessmentDate, 'yyyy/MM/dd'),
              'Offer In Hand': candidateList[key].OfferInHand,
              'Offer in Hand (Annual CTC)': candidateList[key].OfferInHandCTC
            };
            filterDataExcel.push(selectedData);
          }

        }
        let sn = filterDataExcel;
        this._excelService.exportAsExcelFile(filterDataExcel, 'CandidateRecords');
      }
    );
  }

  getintByName(element: any) {
    let name = '';
    switch (element?.interviewBy) {
      case 'M':
        name = this.interviewByLabel.mettl;
        break;
      case 'C':
        name = this.interviewByLabel.Coderbyte;
        break;
      case 'G':
        name = this.interviewByLabel.Glider;
        break;
      case 'E':
        name = this.interviewByLabel.externalAgency;
        break;
      case 'I':
        name = this.interviewByLabel.internalPanel;
        break;
      default:
        name = 'NA';
    }
    return name;
  }
  // isHideReasonForDrop(element: any) {
  //   if ((element?.statusid != 240) || (element?.statusid != 260)) {
  //      return true;
  //   }else{
  //     return false;
  //   }

  // }

  //Get interview status for if video is uploaded
  getInterviewStatus(StatusId:number,StatusName:string, IsExceptionVideo:string, fileNameVideo:string){
    return (AtsCommonFuncService.getInterviewStatus(StatusId, StatusName, IsExceptionVideo, fileNameVideo));
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  showActionBtnFrReopened(element:any){
    if (element?.IsTidReopened == 1 ){
      return true
    }
    else {
      return false
    }
  }
}
