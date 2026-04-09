import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { GlobalMethod } from '../../core/common/global-method';
import { AtsCommonPrefix, SPECIALACCESSUSER } from '../../core/constant/common.const';
import { CONSTANTS } from '../../core/constant/constants';
import { GetSetStorageService } from '../../core/services/get-set-storage.service';
import { CandidateIdentityVerificationModalHrComponent } from '../modals/candidate-identity-verification-modal-hr/candidate-identity-verification-modal-hr.component';
import { CreateEmployeeIdModalComponent } from '../modals/create-employee-id-modal/create-employee-id-modal.component';
import { ReferBackMailToCandidateModalComponent } from '../modals/refer-back-mail-to-candidate-modal/refer-back-mail-to-candidate-modal.component';
import { SendPreonbFormsModalComponent } from '../modals/send-preonb-forms-modal/send-preonb-forms-modal.component';
import { UploadItineraryModalComponent } from '../modals/upload-itinerary-modal/upload-itinerary-modal.component';
import { UploadSendAppointmentLetterModalComponent } from '../modals/upload-send-appointment-letter-modal/upload-send-appointment-letter-modal.component';
import { ViewAllCandidateDetailsOnboardComponent } from '../modals/view-all-candidate-details-onboard/view-all-candidate-details-onboard.component';
import { CandidateOnboardFormsComponent } from '../onboard-forms/modals/candidate-onboard-forms/candidate-onboard-forms.component';
import { OnboardService } from '../onboard.service';
import { ViewAllCandidateDetailsOnboardHrComponent } from '../modals/view-all-candidate-details-onboard-hr/view-all-candidate-details-onboard-hr.component';
import { CandidateDay1FormsDocComponent } from '../onboard-forms/modals/candidate-day1-forms-doc/candidate-day1-forms-doc.component';
import { ShareAccountLinkComponent } from '../modals/share-account-link/share-account-link.component';
import { ShareService } from '../../core/services/share.service';
import { ConfirmationDialogComponent } from '../../shared/shared-app/components/confirmation-dialog/confirmation-dialog.component';
import { PendingDocumentModalComponent } from '../modals/pending-document-modal/pending-document-modal.component';
import { formatDate } from '@angular/common';
import { SendPreviewOfferModalComponent } from '../../offer-module/modals/send-preview-offer-modal/send-preview-offer-modal.component';
import { SendPreviewAppointmentLetterComponent } from '../modals/send-preview-appointment-letter/send-preview-appointment-letter.component';
import { SendInductionSessionsInviteModalComponent } from '../modals/send-induction-sessions-invite-modal/send-induction-sessions-invite-modal.component';
import { UpdateOnboardingModeModalComponent } from '../modals/update-onboarding-mode-modal/update-onboarding-mode-modal.component';
import { UploadOlAcceptanceDocModalComponent } from '../modals/upload-ol-acceptance-doc-modal/upload-ol-acceptance-doc-modal.component';
import { ICandidateOfferListDetails } from '../../core/models/offer-model';
import { ViewOfferApprovalDetailsComponent } from '../../offer-module/modals/view-offer-approval-details/view-offer-approval-details.component';
import { ViewCandidateBgvDetailsComponent } from '../modals/view-candidate-bgv-details/view-candidate-bgv-details.component';
import { ApproveInitiateBGVModalComponent } from '../modals/approve-initiate-bgv-modal/approve-initiate-bgv-modal.component';
import { BgvApprovedByRecModalComponent } from '../modals/bgv-approved-by-rec-modal/bgv-approved-by-rec-modal.component';

@Component({
  selector: 'app-onboard-candidate-list',
  templateUrl: './onboard-candidate-list.component.html',
  styleUrls: ['./onboard-candidate-list.component.scss']
})
export class OnboardCandidateListComponent implements OnInit {
  displayedColumns = ['talentId', 'Cid', 'CandidateName', 'EmailID', 'PhoneNo', 'primarySkill', 'priRecruiter',
    'secondRecruiter', 'offerDate', 'joiningDate', 'joiningLocation', 'cifStatus', 'candiSubStatus', 'day1Status', 'appStatusProg',
    //'recVerification','hrVerification',
    'approveStatus', 'dormantStatus', 'action'];
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
  /** Paginator Reference */
  @ViewChild('paginatorRef', { static: true }) paginatorCompRef;
  constructor(
    public dialog: MatDialog,
    private _storage: GetSetStorageService,
    private _fb: UntypedFormBuilder,
    private _onboard: OnboardService,
    private _share: ShareService

  ) {
  }

  ngOnInit() {
    this.userData = this._storage.getSetUserData();
    this.filterFormInit();
    if (this.userData?.RoleId == 1 || this.userData?.otherRoles?.IsHRAccess == 'Y') {
      this.displayedColumns = ['talentId', 'Cid', 'CandidateName', 'EmployeeID', 'OfficialEmailID', 'EmailID', 'PhoneNo', 'primarySkill', 'candidateType', 'priRecruiter',
        'secondRecruiter', 'offerDate', 'joiningDate', 'joiningLocation', 'onboardingMode', 'cifStatus', 'candiSubStatus', 'day1Status',
        'isBGVSubmitted','isCaseInitiated','approveStatus', 'dormantStatus', 'action'];
    } else if (this.userData?.RoleId == 2) {
      this.displayedColumns = ['talentId', 'Cid', 'CandidateName', 'EmailID', 'PhoneNo', 'primarySkill', 'priRecruiter',
        'secondRecruiter', 'offerDate', 'joiningDate', 'joiningLocation', 'cifStatus',
        // 'candiSubStatus','day1Status',
        'appStatusProg','isBGVSubmitted', 'approveStatus', 'dormantStatus', 'action'];
    } else {
       this.displayedColumns = ['talentId', 'Cid', 'CandidateName', 'EmailID', 'PhoneNo', 'primarySkill', 'priRecruiter',
        'secondRecruiter', 'offerDate', 'joiningDate', 'joiningLocation', 'cifStatus',
        // 'candiSubStatus','day1Status',
        'appStatusProg','isBGVSubmitted', 'approveStatus', 'dormantStatus', 'action'];
    }

  }

  ngAfterViewInit() {
    this.getOnboardingCandidateList(1, CONSTANTS.PAGE_SIZE, null, { startDate: null });
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
    this.getOnboardingCandidateList(1, CONSTANTS.PAGE_SIZE, this.searchInput, data);
  }


  /**
   * get selected talent Id
   * @param data 
   */
  getDataTalent(data) {
    this.resetSortFilter();
    this.thId = data.TH_ID;
    this.paginatorCompRef.paginator.pageIndex = 0;
    this.getOnboardingCandidateList(1, CONSTANTS.PAGE_SIZE, this.searchInput, this.sortParam)
  }

  /**
 * pagination method
 * @param pageEvent 
 */
  getPagingData(pageEvent: any) {
    this.getOnboardingCandidateList(pageEvent.pageIndex + 1, pageEvent.pageSize, this.searchInput ? this.searchInput : null, this.sortParam);
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
    this.getOnboardingCandidateList(1, CONSTANTS.PAGE_SIZE, e, this.sortParam);
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
      location: [[]],
      onboardstatus: [[]],
      onboardsubstatus: [[]],
      day1SubStatus: [[]],
      dateStart: [null],
      dateEnd: [{ value: null, disabled: true }],
      recruiterId: [[]]
    })
  }


  public bodyParam: any = {};
  getOnboardingCandidateList(page: number, pageSize: number, search: any, sortParam: any) {
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
    if (sortParam.location && sortParam.location.length !== 0) {
      let locationIds = sortParam.location.filter(n => n);
      body['location'] = locationIds.toString();
    }
    if (sortParam.onboardstatus && sortParam.onboardstatus.length !== 0) {
      let onboardstatusIds = sortParam.onboardstatus.filter(n => n);
      body['onboardstatus'] = onboardstatusIds.toString();
    }

    if (sortParam.onboardsubstatus && sortParam.onboardsubstatus.length !== 0) {
      let onboardsubstatusIds = sortParam.onboardsubstatus.filter(n => n);
      body['onboardsubstatus'] = onboardsubstatusIds.toString();
    }
    if (sortParam.day1SubStatus && sortParam.day1SubStatus.length !== 0) {
      let day1SubStatusId = sortParam.day1SubStatus.filter(n => n);
      body['day1SubStatus'] = day1SubStatusId.toString();
    }
    if (sortParam.recruiterId && sortParam.recruiterId.length !== 0) {
      let recIds = sortParam.recruiterId.filter(n => n);
      body['recruiterId'] = recIds.toString();
    }

    this.bodyParam = body;
    this._onboard.getAllOnboardCandidateList(body).subscribe(
      res => {
        this.candidateList = res['data'];
        this.paginationData = res['pagination'][0];
      }
    )
  }

  /**recruter */
  viewAllDetailsOnboardRec(elm: any) {
    const dialogRef = this.dialog.open(ViewAllCandidateDetailsOnboardComponent, {
      panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
      data: elm,
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%'
    });
    dialogRef.afterClosed().subscribe(
      res => {
        if (res) {
          this.getOnboardingCandidateList(1, CONSTANTS.PAGE_SIZE, null, { startDate: null });
        }
      }
    );
  }
  // hr
  viewAllDetailsOnboardHr(elm: any) {
    const dialogRef = this.dialog.open(ViewAllCandidateDetailsOnboardHrComponent, {
      panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
      data: elm,
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%'
    });
    dialogRef.afterClosed().subscribe(
      res => {
        if (res) {
          this.getOnboardingCandidateList(1, CONSTANTS.PAGE_SIZE, null, { startDate: null });
        }
      }
    );
  }

  viewAllDetailsOnboardForms(elm: any) {
    const dialogRef = this.dialog.open(CandidateOnboardFormsComponent, {
      panelClass: ['ats-model-wrap', 'ats-model-full-screen', 'ats-model-full-screen-p'],
      data: elm,
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%'
    });
    dialogRef.afterClosed().subscribe(
      res => {
        if (res) {
          this.getOnboardingCandidateList(1, CONSTANTS.PAGE_SIZE, null, { startDate: null });
        }
      }
    );
  }

  viewAllDetailsDay1Forms(elm: any) {
    const dialogRef = this.dialog.open(CandidateDay1FormsDocComponent, {
      panelClass: ['ats-model-wrap', 'ats-model-full-screen', 'ats-model-full-screen-p'],
      data: elm,
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%'
    });
    dialogRef.afterClosed().subscribe(
      res => {
        if (res) {
          this.getOnboardingCandidateList(1, CONSTANTS.PAGE_SIZE, null, { startDate: null });
        }
      }
    );
  }


  openModalToReferBack(elm: any) {
    elm['title'] = 'Candidate referred back by HR'
    elm['status'] = 0;
    const dialogRef = this.dialog.open(ReferBackMailToCandidateModalComponent, {
      width: '500px',
      height: '500px',
      panelClass: ['ats-model-wrap', 'talent-transfers-mod', 'active-inc-modal'],
      // panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
      data: elm,

    });
    dialogRef.afterClosed().subscribe(
      res => {
        if (res) {
          this.getOnboardingCandidateList(1, CONSTANTS.PAGE_SIZE, null, { startDate: null });
        }
      }
    );
  }

  ResendDay1FormEmail(element: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      panelClass: 'ats-confirm',
      data: {
        headerText: 'Alert',
        message: ` Are you sure you want to send day 1 form again <span class='u-name'>${element.OfficialEmailId}</span> ?`,
        buttonText: {
          ok: "Yes",
          cancel: "No"
        },
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {


        this._onboard.ResendDay1FormEmail(element?.candidateId).subscribe(
          res => {

            this._share.showAlertSuccessMessage.next(res);
          }
        )
      }
      else {
      }
    });
  }

  // show refer back button to candidate refered back by hr to recruiter
  showReferBackActionButton(element: any) {
    if (element?.onboardStatus == 50 &&
      (this.userData?.EmpNewId == element?.primaryrecruiter ||
        this.userData?.EmpNewId == element?.secondaryrecruiter)) {
      return true
    }
    else {
      return false
    }
  }

  // show showSendPreOnbFormsButton button 
  showSendPreOnbFormsButton(element: any) {
    if (((element?.onboardStatus == 60 ||
      element?.onboardStatus == 70 ||
      element?.onboardStatus == 80 ||
      element?.onboardStatus == 90) &&
      (element?.offerstatus == 200 ||
        element?.offerstatus == 140)) &&
      (element?.onboardFormStatus == 110 || element?.onboardFormStatus == 130 || element?.onboardFormStatus == null) &&
      // this.is7DaysFromDoj(element?.DateOfJoining) &&
      (this.userData?.RoleId == 1 || this.userData?.otherRoles?.IsHRAccess == 'Y')) {
      return true
    } else {
      return false
    }
  }

  showviewAllDetailsOnboardButtonRec(element: any) {
    if (
      this.userData?.EmpNewId == element?.primaryrecruiter ||
      this.userData?.EmpNewId == element?.secondaryrecruiter ||
      this.userData?.RoleId == 5) {
      return true
    } else {
      return false
    }
  }
  showviewAllDetailsOnboardButtonHr(element: any) {
    if (this.userData?.RoleId == 1 || this.userData?.otherRoles?.IsHRAccess == 'Y') {
      return true
    } else {
      return false
    }
  }


  // show showSendDay1FormsButton button 
  showSendDay1FormsButton(element: any) {
    if (((element?.onboardStatus == 60 || element?.onboardStatus == 70 ||
      element?.onboardStatus == 80 || element?.onboardStatus == 90) &&
      (element?.offerstatus == 200 || element?.offerstatus == 140)) &&
      (element?.OfficialEmailId != null && element?.OfficialEmailId != '') &&
      // element?.day1FormStatus != 100 &&
      (element.OfficialEmailId != null && element.OfficialEmailId != '') &&
      (element?.day1FormStatus == 110 || element?.day1FormStatus == 130 || element?.day1FormStatus == null) &&
      element?.onboardFormStatus != null &&
      // this.is1DaysFromDoj(element?.DateOfJoining) &&
      (this.userData?.RoleId == 1 || this.userData?.otherRoles?.IsHRAccess == 'Y')) {
      return true
    } else {
      return false
    }
  }

  // show showVerifOnbForms button to HR
  showVerifOnbFormsButton(element: any) {
    if (
      (element?.onboardFormStatus == 100 ||
        element?.onboardFormStatus == 120 ||
        element?.onboardFormStatus == 130) &&
      (this.userData?.RoleId == 1 || this.userData?.otherRoles?.IsHRAccess == 'Y')) {
      return true
    }
    else {
      return false
    }
  }

  // show showVerifDay1Forms button to HR
  showVerifDay1FormsButton(element: any) {
    if (
      (element?.day1FormStatus == 100 ||
        element?.day1FormStatus == 120 ||
        element?.day1FormStatus == 130) &&
      (this.userData?.RoleId == 1 || this.userData?.otherRoles?.IsHRAccess == 'Y')) {
      return true
    }
    else {
      return false
    }
  }

  // show create Employee Id button 
  showCreateEmployeeIdButton(element: any) {
    if (element?.IsEmployeeIdCreated !== 1 &&
      // element?.onboardFormStatus === 100 &&
      element?.onboardFormStatus != null &&
      // this.isJoiningDay(element?.DateOfJoining) &&
      (this.userData?.RoleId === 1 || this.userData?.otherRoles?.IsHRAccess == 'Y')) {
      return true
    } else {
      return false
    }
  }

  // show SendAppointLtrButton button 
  showSendAppointLtrButton(element: any) {
    if (element?.onboardFormStatus == 100 &&
      element?.day1FormStatus == 100 &&
      this.userData?.RoleId == 9) {
      return true
    }
    else {
      return false
    }
  }

  // show preview button appointment letter
  showSendAppointLtrPreview(element: any) {
    if (element?.onboardFormStatus == 100 &&
      element?.day1FormStatus == 100 &&
      this.userData?.RoleId == 9 &&
      element?.AppLetterFileName != null) {
      return true
    }
    else {
      return false
    }
  }

  // show AccountLinkSendButton 
  // showAccountLinkSendButton(element: any) {
  //   if (
  //     (element?.onboardFormStatus === 100 ||
  //       element?.onboardFormStatus === 120 ||
  //       element?.onboardFormStatus === 130) &&
  //   //  this.isJoiningDay(element?.DateOfJoining) &&
  //     this.userData?.RoleId === 1) {
  //     return true
  //   } else {
  //     return false
  //   }
  // }

  // show showVerifyPendingDocButton 
  showVerifyPendingDocButton(element: any) {
    if (
      (element?.onboardFormStatus === 100 ||
        element?.onboardFormStatus === 120 ||
        element?.onboardFormStatus === 130) &&
      // this.isJoiningDay(element?.DateOfJoining) &&
      (this.userData?.RoleId === 1 || this.userData?.otherRoles?.IsHRAccess == 'Y')) {
      return true
    } else {
      return false
    }
  }

  //is diff from doj is 7 days check
  is7DaysFromDoj(joinDate: string) {
    let DOJ = new Date(joinDate).getTime();
    let todayDate = new Date().getTime();
    let diff = Math.floor((DOJ - todayDate) / (1000 * 3600 * 24));
    if (diff <= 6) {
      return true;
    } else {
      return false;
    }
  }

  //is diff from doj is 1 days check
  is1DaysFromDoj(joinDate: string) {
    let DOJ = new Date(joinDate).getTime();
    let todayDate = new Date().getTime();
    let diff = Math.floor((DOJ - todayDate) / (1000 * 3600 * 24));
    if (diff < 1) {
      return true;
    } else {
      return false;
    }
  }

  //is today joining day
  isJoiningDay(joiningDate: string) {
    let DOJ = new Date(joiningDate).getTime();
    let todayDate = new Date().getTime();
    if (todayDate >= DOJ) {
      return true
    } else {
      return false;
    }
  }

  /**
   * preview and send offer modal
   * @param elm 
   */
  previewandSendOffer(elm: any) {
    elm['title'] = 'Preview Offer';
    elm['isOfferPayroll'] = "Y";
    const dialogRef = this.dialog.open(SendPreviewOfferModalComponent, {
      panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
      data: elm,
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%'
    });
    dialogRef.afterClosed().subscribe(
      res => {
      }
    );
  }

  /**
   * preview and send offer modal
   * @param elm 
   */
  previewandSendAppointmentLetter(elm: any) {
    elm['title'] = 'Preview and Send Appointment Letter';
    elm['isOfferHr'] = "Y";
    const dialogRef = this.dialog.open(SendPreviewAppointmentLetterComponent, {
      panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
      data: elm,
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%'
    });
    dialogRef.afterClosed().subscribe(
      res => {
      }
    );
  }

  // show showVSendInductionInviteButton 
  showVSendInductionInviteButton(element: any) {
    if (
      element?.IsEmployeeIdCreated == 1 &&
      (element?.offerstatus == 200 || element?.offerstatus == 140) &&
      (this.userData?.RoleId === 1 || this.userData?.otherRoles?.IsHRAccess == 'Y')) {
      return true
    } else {
      return false
    }
  }

  //open modal to select pre onb forms for candidate
  openModalToSendPreOnbForms(elm: any) {
    elm['title'] = `Select Pre-Onboarding Forms For Candidate - ${elm?.Name}`;
    elm['formType'] = 1;
    const dialogRef = this.dialog.open(SendPreonbFormsModalComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'candidate-connect-view-modal'],
      data: elm,
    });
    dialogRef.afterClosed().subscribe(
      res => {
        if (res) {
          this.getOnboardingCandidateList(1, CONSTANTS.PAGE_SIZE, null, { startDate: null });
        }
      }
    );
  }

  //open modal to select pre onb forms for candidate
  openModalToSendDay1OnbForms(elm: any) {
    elm['title'] = `Select Day 1 Forms For Candidate - ${elm?.Name}`;
    elm['formType'] = 2;
    const dialogRef = this.dialog.open(SendPreonbFormsModalComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'candidate-connect-view-modal'],
      data: elm,
    });
    dialogRef.afterClosed().subscribe(
      res => {
        if (res) {
          this.getOnboardingCandidateList(1, CONSTANTS.PAGE_SIZE, null, { startDate: null });
        }
      }
    );
  }

  //open modal to select pre onb forms for candidate
  openModalPendingDocs(elm: any) {
    elm['title'] = `Candidate Pending Documents- ${elm?.Name}`;
    elm['formType'] = 2;
    const dialogRef = this.dialog.open(PendingDocumentModalComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'candidate-connect-view-modal'],
      data: elm,
    });
    dialogRef.afterClosed().subscribe(
      res => {
        if (res) {
          this.getOnboardingCandidateList(1, CONSTANTS.PAGE_SIZE, null, { startDate: null });
        }
      }
    );
  }

  //open modal to send appointment letter for candidate
  openModalToSendAppointLetter(elm: any) {
    elm['title'] = `Upload  Appointment Letter For - ${elm?.Name}`;
    // elm['formType']=1; 
    const dialogRef = this.dialog.open(UploadSendAppointmentLetterModalComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'candidate-connect-view-modal'],
      data: elm,
    });
    dialogRef.afterClosed().subscribe(
      res => {
        if (res) {
          this.getOnboardingCandidateList(1, CONSTANTS.PAGE_SIZE, null, { startDate: null });
        }
      }
    );
  }

  //open modal to create emp id
  openModalCreateEmpId(elm: any) {
    const dialogRef = this.dialog.open(CreateEmployeeIdModalComponent, {
      panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
      data: elm,
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%'
    });
    dialogRef.afterClosed().subscribe(
      res => {
        if (res) {
          this.getOnboardingCandidateList(1, CONSTANTS.PAGE_SIZE, null, { startDate: null });
        }
      }
    );
  }



  openModalForItinerary() {
    const dialogRef = this.dialog.open(UploadItineraryModalComponent, {
      width: '300px',
      panelClass: ['ats-model-wrap', 'request-transfers-candidate', 'ats-header-text-cap',],
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
        }
      }
    )
  }

  //open modal to send invite to candidate for induction sessions
  openModaltoSendInvite(elm: any) {
    const dialogRef = this.dialog.open(SendInductionSessionsInviteModalComponent, {
      panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
      data: elm,
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%'
    });
    dialogRef.afterClosed().subscribe(
      res => {
        if (res) {
          this.getOnboardingCandidateList(1, CONSTANTS.PAGE_SIZE, null, { startDate: null });
        }
      }
    );
  }

  // show update onboardign mode button 
  showUpdateOnboardingModeButton(element: any) {
    if
      (((
        element?.onboardStatus == 70 ||
        element?.onboardStatus == 80 ||
        element?.onboardStatus == 100 ||
        element?.onboardStatus == 90) &&
        // (element?.offerstatus == 200 || 
        //   element?.offerstatus == 140)) &&
        (element?.onboardFormStatus == 110 || element?.onboardFormStatus == 120 || element?.onboardFormStatus == 130 || element?.onboardFormStatus == null) &&
        // this.is7DaysFromDoj(element?.DateOfJoining) &&
        (this.userData?.RoleId == 1 || this.userData?.otherRoles?.IsHRAccess == 'Y'))
      || this.userData?.RoleId == 2
    ) {
      return true
    } else {
      return false
    }
  }

  // show upload OL Accept doc button 
  showUploadOLAcceptDocButton(element: any) {
    // console.log(element.onboardStatus);
    if (((element?.onboardStatus == 40 ||
      element?.onboardStatus == 50 ||
      element?.onboardStatus == 60 ||
      element?.onboardStatus == 70 ||
      element?.onboardStatus == 80 ||
      element?.onboardStatus == 90) &&
      (element?.offerstatus == 200 ||
        element?.offerstatus == 140)) &&
      this.userData?.RoleId == 2) {
      return true
    } else {
      return false
    }
  }

  //open modal to select pre onb forms for candidate
  openModalUpdateOnboardingMode(elm: any) {
    elm['title'] = `Update Onboarding Mode For Candidate - ${elm?.Name}`;
    // elm['formType'] = 1;
    const dialogRef = this.dialog.open(UpdateOnboardingModeModalComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'ats-model-full-screenss'],
      // ['ats-model-wrap', 'candidate-connect-view-modal'],
      data: elm,
    });
    dialogRef.afterClosed().subscribe(
      res => {
        if (res) {
          this.getOnboardingCandidateList(1, CONSTANTS.PAGE_SIZE, null, { startDate: null });
        }
      }
    );
  }

  /***
   * open verifcation form 
   */
  viewAllDetailsOnboardPic(elm: any) {
    elm['title'] = 'Candidate Verification Details';
    const dialogRef = this.dialog.open(CandidateIdentityVerificationModalHrComponent, {
      panelClass: ['ats-model-wrap', 'ats-model-full-screen', 'ats-header-text-cap'],
      data: elm,
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%'
    });
    dialogRef.afterClosed().subscribe(
      res => {
        if (res) {
          this.getOnboardingCandidateList(1, CONSTANTS.PAGE_SIZE, null, this.sortParam);
        }
      }
    );
  }

  /***
   * open verifcation form 
   */
  empVerificationOnboardPic(elm: any, type: string) {
    if (type === 'C') {
      elm['title'] = 'Candidate Verification (HR)';
    }
    if (type === 'E') {
      elm['title'] = 'Employee Verification (Post 7 Days)';
    }
    elm['type'] = type;
    const dialogRef = this.dialog.open(CandidateIdentityVerificationModalHrComponent, {
      panelClass: ['ats-model-wrap', 'ats-model-full-screen', 'ats-header-text-cap'],
      data: elm,
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%'
    });
    dialogRef.afterClosed().subscribe(
      res => {
        if (res) {
          this.getOnboardingCandidateList(1, CONSTANTS.PAGE_SIZE, null, this.sortParam);
        }
      }
    );
  }

  //open modal to upload OL Accept doc
  openModalUploadOLAcceptDocModal(elm: any) {
    elm['title'] = `Upload  Offer Letter Acceptance Document For - ${elm?.Name}`;
    const dialogRef = this.dialog.open(UploadOlAcceptanceDocModalComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'candidate-connect-view-modal'],
      data: elm,
    });
    dialogRef.afterClosed().subscribe(
      res => {
        if (res) {
          this.getOnboardingCandidateList(1, CONSTANTS.PAGE_SIZE, null, { startDate: null });
        }
      }
    );
  }

  /***
  * view offer/approval Details
  */

  openofferApprovalDetailsModal(elm: ICandidateOfferListDetails) {
    elm['title'] = 'View Offer / Approver Details';
    elm['th_id'] = elm?.thid;
    const dialogRef = this.dialog.open(ViewOfferApprovalDetailsComponent, {
      panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
      data: elm,
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%'
    });
  }
  //open modal to view bgv details link
  viewAllDetailsBGV(elm: any) {
    const dialogRef = this.dialog.open(ViewCandidateBgvDetailsComponent, {
      panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
      data: elm,
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%'
    });
    dialogRef.afterClosed().subscribe(
      res => {
        if (res) {
          this.getOnboardingCandidateList(1, CONSTANTS.PAGE_SIZE, null, { startDate: null });
        }
      }
    );
  }

  openApproveInitiateBGVModal(element: any) {
    // Open your modal here, passing candidate info
    const dialogRef = this.dialog.open(ApproveInitiateBGVModalComponent, {
      panelClass: ['ats-model-wrap', 'ats-model-full-screenss', 'request-transfers-candidate'],
      data: {
        candidate: element
      }
    });
    dialogRef.afterClosed().subscribe(result => {
        if (result) {
              this.getOnboardingCandidateList(1, CONSTANTS.PAGE_SIZE, null, this.sortParam);
        }
      });
  }

  // sendApprovalForBGV(element: any) {
  //     /***
  //       * confirmation dailog
  //       */
  //      element['title'] = `Send BGV Approval For - ${element?.Name}`;
  //     const dialogRef = this.dialog.open(BgvApprovedByRecModalComponent, {
  //       panelClass: ['ats-model-wrap', 'ats-model-full-screenss'],
  //       data: element,
  //     });
  
  //     dialogRef.afterClosed().subscribe(result => {
  //       if (result) {
  //         // this._onboard.SaveBGVConsentByRecruiter(element?.cid, 1).subscribe(
  //         //   res => {
  //         //     this._share.showAlertSuccessMessage.next(res);
  //         //     this.paginatorCompRef.paginator.pageIndex = 0;
  //             this.getOnboardingCandidateList(1, CONSTANTS.PAGE_SIZE, null, this.sortParam);
  //             // this.dialogRef.close(true);
  //         //   }
  //         // );
  //       }
  //     });
  //   }
}
