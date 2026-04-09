import { Component, OnInit, ViewChild } from '@angular/core';
import { CONSTANTS } from 'projects/ats-global-system/src/app/core/constant/constants';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { FeedbackRoundDetailsComponent } from 'projects/ats-global-system/src/app/interview-module/interview-feedback/modals/feedback-round-details/feedback-round-details.component';
import { SendForApprovalModalComponent } from '../modals/send-for-approval-modal/send-for-approval-modal.component';
import { OfferService } from '../offer.service';
import { ApprovalActionModalComponent } from '../modals/approval-action-modal/approval-action-modal.component';
import { ViewOfferApprovalDetailsComponent } from '../modals/view-offer-approval-details/view-offer-approval-details.component';
import { AtsCommonPrefix, SPECIALACCESSUSER } from 'projects/ats-global-system/src/app/core/constant/common.const';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { SelectedCandidateTransferModalComponent } from '../modals/selected-candidate-transfer-modal/selected-candidate-transfer-modal.component';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { saveAs } from "file-saver";
import { OfferReasonForDropComponent } from '../modals/offer-reason-for-drop/offer-reason-for-drop.component';
import { ConfirmationDialogComponent } from 'projects/ats-global-system/src/app/shared/shared-app/components/confirmation-dialog/confirmation-dialog.component';
import { InterviewCommonService } from '../../core/services/interview-common.service';
import { GlobalCommonMethodService } from '../../core/common/global-common-method.service';
import { ResendOrReviseOfferConfirmModalComponent } from './modals/resend-or-revise-offer-confirm-modal/resend-or-revise-offer-confirm-modal.component';
import { ResendOfferApprovalDetailsComponent } from './modals/resend-offer-approval-details/resend-offer-approval-details.component';
import { Subscription } from 'rxjs';
import { SendForApprovalModalUsComponent } from '../modals/send-for-approval-modal-us/send-for-approval-modal-us.component';
import { GetLocationInfo } from '../../core/common/getLocationInfo';
import { SelectedCandidateTransferWithTcModalComponent } from '../modals/selected-candidate-transfer-with-tc-modal/selected-candidate-transfer-with-tc-modal.component';
import { SendForApprovalModalSupportComponent } from '../modals/send-for-approval-modal-support/send-for-approval-modal-support.component';
import { OnboardingSendCredConfirmationDialogComponent } from '../../shared/shared-app/components/onboarding-send-cred-confirmation-dialog/onboarding-send-cred-confirmation-dialog.component';
import { CandidateCommonApiService } from '../../core/services/candidate-common-api.service';
import { VideoComparisonConsnetModalComponent } from '../modals/video-comparison-consnet-modal/video-comparison-consnet-modal.component';

@Component({
  selector: 'app-approval-screen',
  templateUrl: './approval-screen.component.html',
  styleUrls: ['./approval-screen.component.scss']
})
export class ApprovalScreenComponent implements OnInit {
  displayedColumns = ['talentId', 'Cid', 'CandidateName', 'primarySkill', 'EmailID', 'PhoneNo', 'recruiter',
  'dormantStatus','approveStatus', 'action'];
  private thId: string;
  public userData: any = {};
  public searchInput: string = '';
  public sortParam: string = '';
  public paginationData: any;
  public candidateList: any = [];
  public sortFormFilter: UntypedFormGroup = new UntypedFormGroup({});
  public isResetSearch: boolean = false;
  public isResetFilter: boolean = false;
  public cidColName: string = AtsCommonPrefix.CidColName;
  public cidPrefix: string = AtsCommonPrefix.CidPrefix;
  public isVisibleForIndia: boolean = false;
  public isVisibleForUS: boolean = false;
  public isTransEnableForIndia: boolean = false;
  public isTransEnableForUS: boolean = false;
  private refreshSubscription: Subscription;
  /** Paginator Reference */
  @ViewChild('paginatorRef', { static: true }) paginatorCompRef;
  constructor(
    public dialog: MatDialog,
    private _storage: GetSetStorageService,
    private _fb: UntypedFormBuilder,
    private _offerServe: OfferService,
    private _globalApiServe: GlobalApisService,
    private _share: ShareService,
    private _http: HttpClient,
    private _interCommon: InterviewCommonService,
    private _globalCommonMethod: GlobalCommonMethodService,
    private _candCommServe: CandidateCommonApiService,
    private getLocInfo: GetLocationInfo
  ) {
  }
  public specialLogin: boolean = false;
  public talentIdControl: UntypedFormControl = new UntypedFormControl();
  ngOnInit() {
    this.showHideLocWise();
    this.userData = this._storage.getSetUserData();
    let empId = this._storage.getUserEmpId();
    let isUserValid = SPECIALACCESSUSER.offerAccesRight.filter(r => r.empId === parseInt(empId));
    if (isUserValid.length !== 0) {
      this.specialLogin = true;
    }
    else {
      this.specialLogin = false;
    }

    if (this.userData) {
      if (this.userData.RoleId === 0 && this.userData?.otherRoles?.IsApprover === 'Y' || this.userData.RoleId === 4 && this.userData?.otherRoles?.IsApprover === 'Y') {
        this.displayedColumns = ['talentId', 'Cid', 'CandidateName', 'accountName', 'projectName', 'recruiter', 'primarySkill',
          'offerDate', 'joiningDate',
          'isTidReopened','dormantStatus', 'approveStatus', 'dropReason', 'action'];
      }
      else {
        this.displayedColumns = ['talentId', 'Cid', 'CandidateName', 'EmailID', 'PhoneNo', 'recruiter', 'prmRecruiter', 'primarySkill',
          'offerDate', 'joiningDate',
          'isTidReopened','dormantStatus', 'approveStatus', 'dropReason', 'action'];
      }
    }
    this.sortParam = '&intStatus=4'
    // this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, null,this.sortParam);
    this.filterFormInit();
    //  this.sendForApproval(null)

    this.refreshSubscription = this._share.detectSwitchLoc.subscribe(
      get => {
        this.resetSortFilter();
        this.talentIdControl.patchValue('all');
        this.thId = null;
        this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, null, null);
        this.showHideLocWise();
      }
    )


  }

  showHideLocWise() {
    if (this.getLocInfo.isLocationIndia()) {
      this.isTransEnableForIndia = true;
      this.isTransEnableForUS = false;
      this.isVisibleForIndia = true;
    } else if (this.getLocInfo.isLocationUS()) {
      this.isVisibleForIndia = false;
      this.isTransEnableForIndia = false;
      this.isTransEnableForUS = false;
    }
    else {
      this.isVisibleForIndia = false;
      this.isTransEnableForIndia = false;
      this.isTransEnableForUS = false;
    }
  }

  ngAfterViewInit() {
    //this.sortParam = '&startDate=' + this.getPastdate();
    this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, null, { startDate: null });
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
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
  }
  /**
* get filter value
* @param data
*/
  getSortData(data: string) {
    this.isResetSearch = true;
    this.isResetFilter = false;
    this.searchInput = '';
    this.sortParam = data;
    this.paginatorCompRef.paginator.pageIndex = 0;
    this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, this.searchInput, data);
  }


  /**
   * get selected talent Id
   * @param data 
   */
  getDataTalent(data) {
    this.resetSortFilter();
    this.thId = data.TH_ID;
    this.paginatorCompRef.paginator.pageIndex = 0;
    this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, this.searchInput, this.sortParam)
  }

  /**
 * pagination method
 * @param pageEvent 
 */
  getPagingData(pageEvent: any) {
    this.getCandidateListByTalentId(pageEvent.pageIndex + 1, pageEvent.pageSize, this.searchInput ? this.searchInput : null, this.sortParam);
  }

  /***
   * search
   */
  getSearchValueKey(e: any) {
    this.isResetFilter = true;
    this.isResetSearch = false;
    this.sortParam = '';
    this.searchInput = e;
    this.paginatorCompRef.paginator.pageIndex = 0;
    this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, e, this.sortParam);
  }
  /**
   * get candidate list
   * @param page 
   * @param pageSize 
   * @param search 
   */

  /***
 * filter form Init
 */
  filterFormInit() {
    this.sortFormFilter = this._fb.group({
      offerstatus: [[]],
      primarySkill: [[]],
      pendingWithMe: [null],
      dateFrom: [null],
      dateTo: [{ value: null, disabled: true }],
      dateStart: [null],
      dateEnd: [{ value: null, disabled: true }],
      recruiterId: [[]],
      subListType: [[]],
      practiceId: [[]],
    })
  }


  public bodyParam: any = {};
  getCandidateListByTalentId(page: number, pageSize: number, search: any, sortParam: any) {
    // let queryString = `${this.thId?'thid='+this.thId+'&':''}page=${page}&pageSize=${pageSize}&search=${search ? search.trim():''}${sortParam?sortParam:''}`;
    this.bodyParam = {};
    let body = {
      page: page,
      pageSize: pageSize
    }
    if (sortParam?.dateFrom) {
      body['startDate'] = GlobalMethod.formatDate(sortParam?.dateFrom);
    }
    if (sortParam?.pendingWithMe == true) {
      body['pendingWithMe'] = '1';
    }
    if (sortParam?.dateTo) {
      body['endDate'] = GlobalMethod.formatDate(sortParam?.dateTo);
    }

    //
    if (sortParam?.dateStart) {
      body['startDate2'] = GlobalMethod.formatDate(sortParam?.dateStart);
    }

    if (sortParam?.dateEnd) {
      body['endDate2'] = GlobalMethod.formatDate(sortParam?.dateEnd);
    }
    if (this.thId) {
      body['thid'] = this.thId
    }
    if (search) {
      body['search'] = search;
    }
    if (sortParam?.offerstatus && sortParam?.offerstatus.length !== 0) {
      let offerstatusIds = sortParam.offerstatus.filter(n => n);
      body['offerStatus'] = offerstatusIds.toString();
    }
    if (sortParam?.recruiterId && sortParam?.recruiterId.length !== 0) {
      let recIds = sortParam.recruiterId.filter(n => n);
      body['recruiterId'] = recIds.toString();
    }

    if (sortParam?.primarySkill && sortParam?.primarySkill.length !== 0) {
      let Ids = sortParam.primarySkill.filter(n => n);
      body['primarySkill'] = Ids.toString();
    }

    //sub status
    if (sortParam?.subListType && sortParam?.subListType.length !== 0) {
      let offerstatusIds = sortParam.subListType.filter(n => n);
      body['dropResonId'] = offerstatusIds.toString();
    }
    if (sortParam?.practiceId && sortParam?.practiceId.length !== 0) {
      let Ids = sortParam?.practiceId.filter(n => n);
      body['practiceId'] = Ids.toString();
    }
    this.bodyParam = body;
    const locId = this._globalCommonMethod.getSetLocation().locId;
    
    if (this.getLocInfo?.isLocationUS()) {
      this._offerServe.getSelectedCandidateListForUS(body).subscribe(
        res => {
          this.candidateList = res['data'];
          this.paginationData = res['pagination'][0];
        }
      );
    }
    else {
      this._offerServe.getSelectedCandidateList(body).subscribe(
        res => {
          this.candidateList = res['data'];
          this.paginationData = res['pagination'][0];
        }
      );
    }
  }

  //resend or revise offer confirmation modal
  resendReviseConfirmModal(element: any) {
    const dialogRef = this.dialog.open(ResendOrReviseOfferConfirmModalComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'confirmation-offer-m'],
      data: element,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result === 'RS') {
          if (element?.OfferStatusID == 30 || element?.OfferStatusID == 35 || element?.OfferStatusID == 50 || element?.OfferStatusID == 55
            || element?.OfferStatusID == 70 || element?.OfferStatusID == 90 || element?.OfferStatusID == 155 || element?.OfferStatusID == 75) {
            element['callType'] = 1;
            this.openModaltoResendOfferApprovalDetails(element);
            // this._share.showAlertErrorMessage.next('Video comparison final round is in progress.Please check after sometime.')
          } else {
            this._globalCommonMethod.showMessagedisplay({
              title: 'Offer Approval Alert',
              autoHide: false,
              msg: `
             <p>Offer Approval can be resend only if it is referred back by approvers.</p>`
            });
          }
        }
        else {
          this.sendForApproval(element);
        }
      }
    });
  }

  approvalSend(elm: any) {
    debugger
    const locId = this._globalCommonMethod.getSetLocation().locId;
    if (this.getLocInfo?.isLocationUS()) {
      this.sendForApproval(elm);
    }
    else {
      this._interCommon.getCandidateFeebackEnableStatusByCid(elm.cid).subscribe(
        vidRes => {
          let vidData = vidRes['VideoInt'][0];
          let statusData = vidRes['data'][0];
          if (statusData?.IsExceptionVideo == 'N') {
            if (vidData?.IsVideoMatchExist == 'N') {
              if(vidData?.IsConsemtreq == 'Y'){
                this.openConsetModelVideoComparison(elm);
              }
              else{
                this._globalCommonMethod.showMessagedisplay({
                                title: 'Video image  comparison processing in progress',
                                autoHide: false,
                                msg: `
                               <p>Video comparison HR final round is in progress.Please check after sometime.</p>`
                              });
              }
             
              
              // this._share.showAlertErrorMessage.next('Video comparison final round is in progress.Please check after sometime.')
            }
            else if (vidData?.IsIntScheduleEnable == 'Y' && vidData?.IsVideoMatchExist == 'Y') {
              if (
                // elm.OfferStatusID === 20 || 
                // elm.OfferStatusID === 25 || s
                // elm.OfferStatusID === 40 || 
                // elm.OfferStatusID === 45 || 
                // elm.OfferStatusID === 60 || 
                // elm.OfferStatusID === 80 || 

                (elm.OfferStatusID === 30 ||
                elm.OfferStatusID === 35 ||
                elm.OfferStatusID === 50 ||
                elm.OfferStatusID === 55 ||
                elm.OfferStatusID === 70 ||
                elm.OfferStatusID === 75 ||
                elm.OfferStatusID === 90) &&
                elm?.isSupportHiring == 'N'

                // elm.OfferStatusID === 120 ||
                // elm.OfferStatusID === 140 ||
                // elm.OfferStatusID === 160 ||
                // elm.OfferStatusID === 180 ||
                // elm.OfferStatusID === 100 ||
                // elm.OfferStatusID === 220
              ) {
                this.resendReviseConfirmModal(elm);
              }
              else {
                this.sendForApproval(elm);
              }

              // this.resendReviseConfirmModal(elm);
            }
            else {
              this._globalCommonMethod.showMessagedisplay({
                title: 'Alert',
                autoHide: false,
                msg: `
               <p>Candidate HR final round video not aligned with previous round video.</p>`
              });
              // this._share.showAlertErrorMessage.next('Candidate HR final round video not aligned with previous round video.')
            }
          } else {
           this.openApprvolaModal(elm);
          }
        }
      )
    }


  }

  //open apprvola Modal function
  openApprvolaModal(elm: any) {
    if (
      // elm.OfferStatusID === 20 || 
      // elm.OfferStatusID === 25 || 
      // elm.OfferStatusID === 40 || 
      // elm.OfferStatusID === 45 || 
      // elm.OfferStatusID === 60 || 
      // elm.OfferStatusID === 80 || 

      (elm.OfferStatusID === 30 ||
      elm.OfferStatusID === 35 ||
      elm.OfferStatusID === 50 ||
      elm.OfferStatusID === 55 ||
      elm.OfferStatusID === 70 ||
      elm.OfferStatusID === 75 ||
      elm.OfferStatusID === 90 ||
      elm.OfferStatusID === 155) && 
      elm?.isSupportHiring == 'N'
    ) {
      this.resendReviseConfirmModal(elm);
    }
    else {
      this.sendForApproval(elm);
    }
  }


   //
   openConsetModelVideoComparison(element: any = {}) {
    //this.jumpFirstPage = false;
    element['title'] = "Consent for Video Comparison";
    const dialogRef = this.dialog.open(VideoComparisonConsnetModalComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'ats-model-full-screenss', 'video-comp-modal',],
      data: element,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.openApprvolaModal(element);
      }
    });
  }


  /***
   * send approval by recruiter
   */
  sendForApproval(elm: any) {
    // elm['title'] = "Send For Approval";
    if (
      elm.OfferStatusID === 20 ||
      elm.OfferStatusID === 25 ||
      elm.OfferStatusID === 40 ||
      elm.OfferStatusID === 45 ||
      elm.OfferStatusID === 60 ||
      elm.OfferStatusID === 65 ||
      elm.OfferStatusID === 80 ||

      elm.OfferStatusID === 30 ||
      elm.OfferStatusID === 35 ||
      elm.OfferStatusID === 50 ||
      elm.OfferStatusID === 55 ||
      elm.OfferStatusID === 70 ||
      elm.OfferStatusID === 75 ||
      elm.OfferStatusID === 90 ||

      elm.OfferStatusID === 120 ||
      elm.OfferStatusID === 140 ||
      elm.OfferStatusID === 160 ||
      elm.OfferStatusID === 180 ||
      elm.OfferStatusID === 100 ||
      elm.OfferStatusID === 220
    ) {
      elm['title'] = "Revise offer letter";
    } else if (elm.OfferStatusID === 270) {
      elm['title'] = "Re-Initiate offer Approval";
    } else {
      elm['title'] = "Send For Approval";
    }
    this._globalApiServe.checkTalentIdStatus(elm.th_id).subscribe(
      res => {
        if (res['data'][0].status === 'closed') {
          this._share.showAlertErrorMessage.next(elm.talent_id + ' Talent Id is closed.Please transfer candidate to other active talent Id to create offer.')
        }
        else {
          

          const locId = this._globalCommonMethod.getSetLocation().locId;
          let dialogRef: any;
          if (locId == 3) {
            dialogRef = this.dialog.open(SendForApprovalModalUsComponent, {
              panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
              data: elm,
              maxWidth: '100vw',
              maxHeight: '100vh',
              height: '100%',
              width: '100%'
            });
          }
          else {
            if(res['talent'][0].isSupportHiring == 'Y'){
              dialogRef = this.dialog.open(SendForApprovalModalSupportComponent, {
                panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
                data: elm,
                maxWidth: '100vw',
                maxHeight: '100vh',
                height: '100%',
                width: '100%'
              });

            }
            else{
              dialogRef = this.dialog.open(SendForApprovalModalComponent, {
                panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
                data: elm,
                maxWidth: '100vw',
                maxHeight: '100vh',
                height: '100%',
                width: '100%'
              });
            }
            

          }

          dialogRef.afterClosed().subscribe(
            result => {
              if (result) {
                this.paginatorCompRef.paginator.pageIndex = 0;
                this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, null, this.sortParam);
              }
            }
          )

        }
      }
    )


  }

  /***
   * send approval by recruiter
   */
  sendForApprovalSupport(elm: any) {
    // elm['title'] = "Send For Approval";
    if (
      elm.OfferStatusID === 20 ||
      elm.OfferStatusID === 25 ||
      elm.OfferStatusID === 40 ||
      elm.OfferStatusID === 45 ||
      elm.OfferStatusID === 60 ||
      elm.OfferStatusID === 65 ||
      elm.OfferStatusID === 80 ||

      elm.OfferStatusID === 30 ||
      elm.OfferStatusID === 35 ||
      elm.OfferStatusID === 50 ||
      elm.OfferStatusID === 55 ||
      elm.OfferStatusID === 70 ||
      elm.OfferStatusID === 75 ||
      elm.OfferStatusID === 90 ||

      elm.OfferStatusID === 120 ||
      elm.OfferStatusID === 140 ||
      elm.OfferStatusID === 160 ||
      elm.OfferStatusID === 180 ||
      elm.OfferStatusID === 100 ||
      elm.OfferStatusID === 220
    ) {
      elm['title'] = "Revise offer letter";
    } else if (elm.OfferStatusID === 270) {
      elm['title'] = "Re-Initiate offer Approval";
    } else {
      elm['title'] = "Send For Approval";
    }
    this._globalApiServe.checkTalentIdStatus(elm.th_id).subscribe(
      res => {
        if (res['data'][0].status === 'closedd') {
          this._share.showAlertErrorMessage.next(elm.talent_id + ' Talent Id is closed.Please transfer candidate to other active talent Id to create offer.')
        }
        else {
          

          const locId = this._globalCommonMethod.getSetLocation().locId;
          let dialogRef: any;
          if (locId == 3) {
            dialogRef = this.dialog.open(SendForApprovalModalUsComponent, {
              panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
              data: elm,
              maxWidth: '100vw',
              maxHeight: '100vh',
              height: '100%',
              width: '100%'
            });
          }
          else {
            dialogRef = this.dialog.open(SendForApprovalModalSupportComponent, {
              panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
              data: elm,
              maxWidth: '100vw',
              maxHeight: '100vh',
              height: '100%',
              width: '100%'
            });

          }

          dialogRef.afterClosed().subscribe(
            result => {
              if (result) {
                this.paginatorCompRef.paginator.pageIndex = 0;
                this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, null, this.sortParam);
              }
            }
          )

        }
      }
    )


  }

  // open modal to change pending approver by admin
  openModalTochangeApprover(ele: any) {
    ele['callType'] = 2;
    this.openModaltoResendOfferApprovalDetails(ele);
  }

  /***
   * action by approver
   */
  approvalAction(elm: any) {
    
    const dialogRef = this.dialog.open(ApprovalActionModalComponent, {
      panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
      data: elm,
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%'
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.paginatorCompRef.paginator.pageIndex = 0;
          this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, null, this.sortParam);
        }
      }
    )
  }

  tooltipCandidtionWise(elm: any) {
    if (this.getLocInfo.isLocationIndia()) {
      if(elm?.isSupportHiring == 'Y'){
        if (
          elm.OfferStatusID === 20 ||
          elm.OfferStatusID === 25 ||
          elm.OfferStatusID === 40 ||
          elm.OfferStatusID === 45 ||
          elm.OfferStatusID === 60 ||
          elm.OfferStatusID === 65 ||
          elm.OfferStatusID === 80 ||
  
          elm.OfferStatusID === 120 ||
          elm.OfferStatusID === 140 ||
          elm.OfferStatusID === 160 ||
          elm.OfferStatusID === 180 ||
          elm.OfferStatusID === 100 ||
          elm.OfferStatusID === 220) {
          return 'Revise offer details'
          // return 'Resend / Revise offer details'
        } else if (
          elm.OfferStatusID === 30 ||
          elm.OfferStatusID === 35 ||
          elm.OfferStatusID === 50 ||
          elm.OfferStatusID === 55 ||
          elm.OfferStatusID === 70 ||
          elm.OfferStatusID === 75 ||
          elm.OfferStatusID === 90
        ) {
          return 'Revise offer details'
        } else if (
          elm.OfferStatusID === 270
        ) {
          return 'Re-Initiate offer'
        }
        else {
          return 'Send for Approval'
        }
      }
      else {
        if (
        elm.OfferStatusID === 20 ||
        elm.OfferStatusID === 25 ||
        elm.OfferStatusID === 40 ||
        elm.OfferStatusID === 45 ||
        elm.OfferStatusID === 60 ||
        elm.OfferStatusID === 65 ||
        elm.OfferStatusID === 80 ||

        elm.OfferStatusID === 120 ||
        elm.OfferStatusID === 140 ||
        elm.OfferStatusID === 160 ||
        elm.OfferStatusID === 180 ||
        elm.OfferStatusID === 100 ||
        elm.OfferStatusID === 220) {
        return 'Revise offer details'
        // return 'Resend / Revise offer details'
      } else if (
        elm.OfferStatusID === 30 ||
        elm.OfferStatusID === 35 ||
        elm.OfferStatusID === 50 ||
        elm.OfferStatusID === 55 ||
        elm.OfferStatusID === 70 ||
        elm.OfferStatusID === 75 ||
        elm.OfferStatusID === 90
      ) {
        return 'Resend / Revise offer details'
      } else if (
        elm.OfferStatusID === 270
      ) {
        return 'Re-Initiate offer'
      }
      else {
        return 'Send for Approval'
      }
    }
    } else {
      if (
        elm.OfferStatusID === 100 ||
        elm.OfferStatusID === 120 ||
        elm.OfferStatusID === 135 ||
        elm.OfferStatusID === 140 ||
        elm.OfferStatusID === 160 ||
        elm.OfferStatusID === 180 ||
        elm.OfferStatusID === 220
      ) {
        return 'Revise offer details'
      } else if (
        elm.OfferStatusID === 270
      ) {
        return 'Re-Initiate offer'
      }
      else {
        return 'Send for Approval'
      }
    }
  }

  disableSendOfferBtnCandidtionWise(elm: any) {
    if (this.getLocInfo.isLocationIndia()) {
      if (elm?.OfferStatusID == 200 || this.showActionBtnFrReopened(elm)) {
        return true
      } else {
        return false;
      }
    }
    else {
      if (elm?.OfferStatusID == 20 ||
        elm?.OfferStatusID == 40 ||
        elm?.OfferStatusID == 45 ||
        elm?.OfferStatusID == 60 ||
        elm?.OfferStatusID == 65 ||
        elm?.OfferStatusID == 80 ||
        elm?.OfferStatusID == 25 ||
        // elm?.OfferStatusID == 100 ||
        elm?.OfferStatusID == 125 ||
        elm?.OfferStatusID == 130 ||
        elm?.OfferStatusID == 200) {
        return true;
      } else {
        return false;
      }
    }
  }

  /**
   * transfer talent Id Method
   * @param element 
   */

  transferCandidateToTalent(element: any) {

  }

  downloadPDF(elm: any) {

  }
  /***
   * view offer/approval Details
   */

  openofferApprovalDetailsModal(elm: any) {
    elm['title'] = 'View Offer / Approver Details';
    const dialogRef = this.dialog.open(ViewOfferApprovalDetailsComponent, {
      panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
      data: elm,
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%'
    });
  }

  openModaltoResendOfferApprovalDetails(elm: any) {
    elm['title'] = elm?.callType == 1 ? 'Resend Offer for Approval' : 'Change Pending Approvers';
    const dialogRef = this.dialog.open(ResendOfferApprovalDetailsComponent, {
      panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
      data: elm,
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%'
    });

    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {

          this.paginatorCompRef.paginator.pageIndex = 0;
          this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, null, this.sortParam);
        }
      }
    )
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

  transferScheduledCandidate(element: any) {
    // condition wise transfer
    if (element?.OfferStatusID == 200) {
      this._share.showAlertErrorMessage.next('You can not transfer candidate after Candidate Joined.');
    }
    else {
      element['title'] = "Transfer to Other Talent ID";
      
      if (this.isTransEnableForIndia && element?.isSupportHiring == 'N') {
        // const dialogRef = this.dialog.open(SelectedCandidateTransferModalComponent, {        
        const dialogRef = this.dialog.open(SelectedCandidateTransferWithTcModalComponent, {
          panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
          maxWidth: '100vw',
          maxHeight: '100vh',
          height: '100%',
          width: '100%',
          // panelClass: ['ats-model-wrap', 'update-interview-feedback', 'talent-transfers', 'talent-transfers-mod'],
          data: element,
          disableClose: true
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result?.flag) {
            this.paginatorCompRef.paginator.pageIndex = 0;
            this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, null, this.sortParam);
            if(result?.isReinitiationRequired == 1){
              element['th_id'] = result?.target_thid;
              element['talent_id'] = result?.target_talentId;
              element['title'] = 'Re-Initiate Offer Approval';
              this.confirmReinitiationDialogBox(element);
            }
          }
        });
      } else {
        const dialogRef = this.dialog.open(SelectedCandidateTransferModalComponent, {
          panelClass: ['ats-model-wrap', 'update-interview-feedback', 'talent-transfers', 'talent-transfers-mod'],
          data: element,
          disableClose: true
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.paginatorCompRef.paginator.pageIndex = 0;
            this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, null, this.sortParam);
          }
        });
      }


    }
  }

  //export offer generation report in  excel
  exportAsXLSX() {
    let bodyData = {
      ...this.bodyParam,
      page: 1,
      pageSize: this.paginationData?.Total,
    }
    this._http.post(`${environment.apiMainUrlNet}Offer/ExportToExcelSelectedCandidatesList`, bodyData, { responseType: 'blob' }).subscribe(
      res => {
        saveAs(res, 'Candidate_Records.xls');
      },
      (error) => {
        this._share.showAlertErrorMessage.next('Something went wrong');
      }
    )
  }

  //offer reason for drop
  openOfferReasonForDropModal(element: any, type: number) {
    //this.jumpFirstPage = false;
    element['title'] = "Reason for Drop";
    element['type'] = type;
    const dialogRef = this.dialog.open(OfferReasonForDropComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'ats-model-full-screenss', 'request-transfers-candidate',],
      data: element,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, null, { startDate: null });
      }
    });
  }

  /***
   * Credentials SendTo Candidate
   */
  public candiData: any = {};
  confirmCredentialsSendToCandidate(element: any) {
    // // const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    //   const dialogRef = this.dialog.open(OnboardingSendCredConfirmationDialogComponent, {
    //   panelClass: 'ats-confirm',
    //   // panelClass: ['ats-model-wrap', 'ats-model-full-screenss', 'request-transfers-candidate',],
    //   data: {
    //     joiningLocationId: element?.JoiningLocationID,
    //     divisionId: element?.DivisionId,
    //     headerText: 'Alert',
    //     message: ` Please choose the joining location and confirm if you want to send credentials to <span class='u-name'>${element?.Name}</span> ?`,
    //     buttonText: {
    //       ok: "Yes",
    //       cancel: "No"
    //     },
    //   },
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result?.flag) {
    //     let body: any = {
    //       cid: element.cid,
    //       joiningLocation: result?.locationId,
    //       DivisionId: result?.divisionId
    //     }
    //     this._offerServe.CreateCandidateUser(body).subscribe(
    //       res => {
    //         this._share.showAlertSuccessMessage.next(res);
    //         this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, null, { startDate: null });
    //       }
    //     )
    //   }

    // });

    this._candCommServe.getCandidateDetailsProfile(element?.cid).subscribe(
      res => {
        this.candiData = res['data'][0];
      // const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        const dialogRef = this.dialog.open(OnboardingSendCredConfirmationDialogComponent, {
          panelClass: 'ats-confirm',
          data: {
            joiningLocationId: this.candiData?.JoiningLocationId,
            candidateId: element?.CandidateId,
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
              Candidateid: element.candidateId,
              JoiningLocationId: result?.locationId,
              PackageId: result?.packageId,
              BGVVenderId: result?.vendorId,
            }
            this._offerServe.CreateCandidateUser(body).subscribe(
              res => {
                this._share.showAlertSuccessMessage.next(res);
                this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, null, { startDate: null });
              }
            )
          }
    
        });
      }
    )
  }

  // get offer status to show change approvers btn
  getOfferStatus(elm: any) {
    if (elm.OfferStatusID === 20 ||
      elm.OfferStatusID === 25 ||
      elm.OfferStatusID === 40 ||
      elm.OfferStatusID === 45 ||
      elm.OfferStatusID === 60 ||
      elm.OfferStatusID === 65 ||
      elm.OfferStatusID === 80) {
      return true;
    }
    else {
      return false;
    }
  }

  /***
   * export excel
   */
  //    exportAsXLSX():void {
  //     let queryString = `${this.thId?'thid='+this.thId+'&':''}page=1&pageSize=${this.paginationData?.Total}&search=${this.searchInput ? this.searchInput.trim():''}${this.sortParam?this.sortParam:''}`;
  //     this._offerServe.getSelectedCandidateList(queryString).subscribe(
  //       res => {
  //         let candidateList = res['data'];
  //         let filterDataExcel = [];
  //         for (var key in candidateList) {
  //           let selectedData = {
  //             'Talent ID': candidateList[key].talent_id,
  //             'Skill': candidateList[key].primaryskill,
  //             'Candidate Name': candidateList[key].Name,
  //             'Phone No.': candidateList[key].phone,
  //             'Email ID': candidateList[key].email,
  //             'Recruiter': candidateList[key].recruiter,
  //             'Offer Status': candidateList[key].OfferStatusName,
  //           };
  //           filterDataExcel.push(selectedData);

  //         }
  //         this._excelService.exportAsExcelFile(filterDataExcel,'CandidateRecords');
  //       }
  //     );
  //  }

  //confirmation to re-initiate offer right now
  confirmReinitiationDialogBox(elm:any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      panelClass: 'ats-confirm',
      data: {
        headerText: 'Alert',
        message: ` Do you want to Re-Initiate Offer Approval right now ?`,
        buttonText: {
          ok: "Yes",
          cancel: "No"
        },
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {       
        this.sendForApproval(elm);
      }
    });
  }

  showActionBtnFrReopened(element:any){
    if ( element?.IsTidReopened == 1 && this.getLocInfo.isLocationIndia()){
      return true
    }
    else {
      return false
    }
  }


}
