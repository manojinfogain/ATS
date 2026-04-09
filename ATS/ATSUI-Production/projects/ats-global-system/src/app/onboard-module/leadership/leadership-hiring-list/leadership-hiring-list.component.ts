import { Component, OnInit, ViewChild } from '@angular/core';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { AddLeadershipModalComponent } from '../modals/add-leadership-modal/add-leadership-modal.component';
import { OnboardService } from '../../onboard.service';
import { GetSetStorageService } from '../../../core/services/get-set-storage.service';
import { ShareService } from '../../../core/services/share.service';
import { GlobalMethod } from '../../../core/common/global-method';
import { CONSTANTS } from '../../../core/constant/constants';
import { LeadershipUploadOfferDetailsModalComponent } from '../modals/leadership-upload-offer-details-modal/leadership-upload-offer-details-modal.component';
import { PreviewLeadershipOfferModalComponent } from '../modals/preview-leadership-offer-modal/preview-leadership-offer-modal.component';
import { ViewAllCandidateDetailsOnboardHrComponent } from '../../modals/view-all-candidate-details-onboard-hr/view-all-candidate-details-onboard-hr.component';
import { ViewAllCandidateDetailsOnboardComponent } from '../../modals/view-all-candidate-details-onboard/view-all-candidate-details-onboard.component';
import { SendPreonbFormsModalComponent } from '../../modals/send-preonb-forms-modal/send-preonb-forms-modal.component';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { CandidateOnboardFormsComponent } from '../../onboard-forms/modals/candidate-onboard-forms/candidate-onboard-forms.component';
import { PendingDocumentModalComponent } from '../../modals/pending-document-modal/pending-document-modal.component';
import { AssignDelegatorForLeadershipModalComponent } from '../modals/assign-delegator-for-leadership-modal/assign-delegator-for-leadership-modal.component';
import { CandidateIdentityVerificationModalHrComponent } from '../../modals/candidate-identity-verification-modal-hr/candidate-identity-verification-modal-hr.component';
import { AssignIssDelegatorModalComponent } from '../modals/assign-iss-delegator-modal/assign-iss-delegator-modal.component';
import { CreateEmployeeIdModalComponent } from '../../modals/create-employee-id-modal/create-employee-id-modal.component';
import { CandidateDay1FormsDocComponent } from '../../onboard-forms/modals/candidate-day1-forms-doc/candidate-day1-forms-doc.component';
import { UploadSendAppointmentLetterModalComponent } from '../../modals/upload-send-appointment-letter-modal/upload-send-appointment-letter-modal.component';
import { SendPreviewAppointmentLetterComponent } from '../../modals/send-preview-appointment-letter/send-preview-appointment-letter.component';
import { ConfirmationDialogComponent } from '../../../shared/shared-app/components/confirmation-dialog/confirmation-dialog.component';
import { ViewCandidateBgvDetailsComponent } from '../../modals/view-candidate-bgv-details/view-candidate-bgv-details.component';

@Component({
  selector: 'app-leadership-hiring-list',
  templateUrl: './leadership-hiring-list.component.html',
  styleUrls: ['./leadership-hiring-list.component.scss']
})
export class LeadershipHiringListComponent implements OnInit {


  displayedColumns = ['Cid', 'leaderName', 'EmailID', 'joiningLoc', 'doj', 'grade', 'skills', 'RecruiterName', 'delegatorName',
    'cifStatus','isBGVSubmitted', 'candiSubStatus', 'day1Status',
    'profileStatus',
    'action'
  ];
  public searhByTitle: string = 'Search By Name/ Email';
  public thId: string;
  public userData: any = {};
  public searchInput: string = '';
  public sortParam: any = '';
  public paginationData: any;
  public candidateList: any = new MatTableDataSource<any>();
  public sortFormFilter: UntypedFormGroup = new UntypedFormGroup({});
  public isResetSearch: boolean = false;
  public isResetFilter: boolean = false;
  selection = new SelectionModel<any>(true, []);
  /** Paginator Reference */
  @ViewChild('paginatorRef', { static: true }) paginatorCompRef;
  constructor(
    public dialog: MatDialog,
    private _fb: UntypedFormBuilder,
    private _onboardserve: OnboardService,
    private _storage: GetSetStorageService,
    public _share: ShareService
  ) {
  }
  public specialLogin: boolean = false;
  public topFirstDateStart: string;
  public topFirstDateEnd: string;
  ngOnInit() {
    this.userData = this._storage.getSetUserData();
        if (
          this.userData?.RoleId == 1 ||
          this.userData?.otherRoles?.IsHRAccess == 'Y'
        ) {
          const index = this.displayedColumns.indexOf('isBGVSubmitted');
          if (
            index !== -1 &&
            !this.displayedColumns.includes('isCaseInitiated')
          ) {
            this.displayedColumns.splice(index + 1, 0, 'isCaseInitiated');
          }
        }
    const today = new Date()
    let tomorrow = new Date()
    tomorrow.setDate(today.getDate() + 3);
    this.topFirstDateStart = GlobalMethod.convertToUTCDateTime(GlobalMethod.formatDate(tomorrow) + ' ' + '00:00:00');
    this.topFirstDateEnd = GlobalMethod.convertToUTCDateTime(GlobalMethod.formatDate(tomorrow) + ' ' + '23:59:00')
    this.filterFormInit();
    // this.viewAllDetailsOnboard(null)
    if (this.userData?.RoleId == 1 || this.userData?.otherRoles?.IsHRAccess == 'Y') {
      this.displayedColumns.splice(2, 0, 'EmployeeId', 'OfficialEmail');
    }
  }




  ngAfterViewInit(): void {
    this.sortParam = {}
    this.getLeadersList(1, 50, null, this.sortParam);
  }

  /**
   * reset filter and search
   */
  resetSortFilter() {
    this.isResetSearch = true;
    this.isResetFilter = true;
    this.searchInput = '';
    this.sortParam = null;
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
    this.getLeadersList(1, CONSTANTS.PAGE_SIZE, this.searchInput, data);
  }

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

  /**
   * get selected talent Id
   * @param data 
   */
  getDataTalent(data) {
    this.resetSortFilter();
    this.thId = data.TH_ID;
    this.paginatorCompRef.paginator.pageIndex = 0;
    this.getLeadersList(1, CONSTANTS.PAGE_SIZE, null, null)
  }

  /**
 * pagination method
 * @param pageEvent 
 */
  getPagingData(pageEvent: any) {
    this.getLeadersList(pageEvent.pageIndex + 1, pageEvent.pageSize, this.searchInput ? this.searchInput : null, this.sortParam);
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
    this.getLeadersList(1, CONSTANTS.PAGE_SIZE, e, this.sortParam);
  }
  /**
   * get candidate list
   * @param page 
   * @param pageSize 
   * @param search 
   */
  getLeadersList(page: number, pageSize: number, search: any, sortParam: any) {
    let Body = {
      page: page,
      pageSize: pageSize
    }
    if (search) {
      Body['search'] = search;
    }
    if (sortParam?.dateStart) {
      Body['startDate2'] = GlobalMethod.formatDate(sortParam?.dateStart);
    }

    if (sortParam?.dateEnd) {
      Body['endDate2'] = GlobalMethod.formatDate(sortParam?.dateEnd);
    }
    if (sortParam.onboardstatus && sortParam.onboardstatus.length !== 0) {
      let onboardstatusIds = sortParam.onboardstatus.filter(n => n);
      Body['onboardstatus'] = onboardstatusIds.toString();
    }

    if (sortParam.onboardsubstatus && sortParam.onboardsubstatus.length !== 0) {
      let onboardsubstatusIds = sortParam.onboardsubstatus.filter(n => n);
      Body['onboardsubstatus'] = onboardsubstatusIds.toString();
    }
    if (sortParam.day1SubStatus && sortParam.day1SubStatus.length !== 0) {
      let day1SubStatusId = sortParam.day1SubStatus.filter(n => n);
      Body['day1SubStatus'] = day1SubStatusId.toString();
    }
    if (sortParam.recruiterId && sortParam.recruiterId.length !== 0) {
      let recIds = sortParam.recruiterId.filter(n => n);
      Body['recruiterId'] = recIds.toString();
    }

    if (sortParam.location && sortParam.location.length !== 0) {
      let locationIds = sortParam.location.filter(n => n);
      Body['location'] = locationIds.toString();
    }

    this._onboardserve.getAllLeadershipOnboardCandidateListMethod(Body).subscribe(
      res => {
        this.candidateList = res['data'];
        //    let a  = this.candidateList;
        //  this.candidateList =    a[0]['Is7daysCompleted'] = 1

        this.paginationData = res['pagination'][0];
        //this.createEmpEmailDomain(this.candidateList.data[0])
      }
    )

  }
  /**show hide details for hr 1, created by recruiter, super admin 5 */
  showviewAllDetailsOnboardButton(element: any) {
    if (
      element?.ShouldVisibleToUser == 1 &&
      (this.userData?.RoleId == 1  ||
        this.userData?.otherRoles?.IsHRAccess == 'Y' ||
        this.userData?.EmpNewId == element?.addedByEmpID ||
        // this.userData?.EmpNewId == element?.addedByEmpID ||
        this.userData?.RoleId == 5)
    ) {
      return true
    } else {
      return false
    }
  }

  visbileCandidateVerificationButton(element: any) {
    if (
        element?.ShouldVisibleToUser == 1 &&
      (element?.offerStatus == 140 || element?.offerStatus == 200) &&
      (!element?.IsConsent && (this.userData?.RoleId == 1 || this.userData?.otherRoles?.IsHRAccess == 'Y'))
    ) {
      return true
    } else {
      return false
    } 
  }
  visibleempVerificationButton(element: any) {
    if (
        element?.ShouldVisibleToUser == 1 &&  
      (element?.Is7daysCompleted == 1 && element?.IsFinalVideoUploaded == 0 && 
        (this.userData?.RoleId == 1 || this.userData?.otherRoles?.IsHRAccess == 'Y'))
    ) {
      return true
    } else {
      return false
    }
  }
  
  
  // show show SendPreOnb FormsButton button 
  // &&
  //     (element?.offerstatus == 200 || 
  //       element?.offerstatus == 140)
  showSendPreOnbFormsButton(element: any) {
    if (
    element?.ShouldVisibleToUser == 1 &&
    (
        element?.onboardStatus == 60 ||
        element?.onboardStatus == 70 ||
        element?.onboardStatus == 80 ||
        element?.onboardStatus == 90
    ) &&
    (
        element?.onboardFormStatus == 110 ||
        element?.onboardFormStatus == 130 ||
        element?.onboardFormStatus == null
    ) &&
    // this.is7DaysFromDoj(element?.DateOfJoining) &&  // uncomment if needed
    (this.userData?.RoleId == 1 || this.userData?.otherRoles?.IsHRAccess == 'Y')
){
      return true
    } else {
      return false
    }
  }

  showviewAllDetailsOnboardButtonRec(element: any) {
    if (
      this.userData?.EmpNewId == element?.primaryrecruiter ||
      this.userData?.EmpNewId == element?.secondaryrecruiter ||
      this.userData?.RoleId == 10) {
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
  // show showVerifDay1Forms button to HR
  showVerifDay1FormsButton(element: any) {
    if (
      element?.ShouldVisibleToUser == 1 &&
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

  // show showVerifOnbForms button to HR
  showVerifOnbFormsButton(element: any) {
    if (
      element?.ShouldVisibleToUser == 1 &&
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

  // show showVerifyPendingDocButton 
  showVerifyPendingDocButton(element: any) {
    if (
      element?.ShouldVisibleToUser == 1 &&
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



  viewAllDetailsDay1Forms(elm: any) {
    elm['candidateId'] = elm?.CandidateId;
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
          this.getLeadersList(1, CONSTANTS.PAGE_SIZE, null, this.sortParam);
        }
      }
    );
  }

  //open modal to create emp id
  openModalCreateEmpId(elm: any) {
    elm['candidateId'] = elm?.CandidateId;
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
          this.getLeadersList(1, CONSTANTS.PAGE_SIZE, null, this.sortParam);
        }
      }
    );
  }

  // show showSendDay1FormsButton button 
  showSendDay1FormsButton(element: any) {
    if (
    element?.ShouldVisibleToUser == 1 &&
    (
        element?.onboardStatus == 60 ||
        element?.onboardStatus == 70 ||
        element?.onboardStatus == 80 ||
        element?.onboardStatus == 90
    ) &&
    (element?.OfficialEmailId != null && element?.OfficialEmailId != '') &&
    // element?.day1FormStatus != 100 &&
    (
        element?.day1FormStatus == 110 ||
        element?.day1FormStatus == 130 ||
        element?.day1FormStatus == null
    ) &&
    element?.onboardFormStatus != null &&
    // this.is1DaysFromDoj(element?.DateOfJoining) &&
    this.userData?.RoleId == 1
) {
      return true
    } else {
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
  //open modal to select pre onb forms for candidate
  openModalToSendPreOnbForms(elm: any, type) {
    elm['title'] = `Select Pre-Onboarding Forms For Candidate - ${elm?.Name}`;
    elm['formType'] = 1;
    elm['candidateId'] = elm?.CandidateId;
    elm['candidateTypeLead'] = type;
    const dialogRef = this.dialog.open(SendPreonbFormsModalComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'candidate-connect-view-modal'],
      data: elm,
    });
    dialogRef.afterClosed().subscribe(
      res => {
        if (res) {
          this.getLeadersList(1, CONSTANTS.PAGE_SIZE, null, this.sortParam);
        }
      }
    );
  }

  viewAllDetailsOnboardForms(elm: any) {
    elm['candidateId'] = elm?.CandidateId;
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
          this.getLeadersList(1, CONSTANTS.PAGE_SIZE, null, this.sortParam);
        }
      }
    );
  }

  //open modal to select pre onb forms for candidate
  openModalPendingDocs(elm: any) {
    elm['title'] = `Candidate Pending Documents- ${elm?.Name}`;
    elm['formType'] = 2;
    elm['candidateId'] = elm?.CandidateId;
    elm['candicandidateTypeLead'] = 'LS';

    const dialogRef = this.dialog.open(PendingDocumentModalComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'candidate-connect-view-modal'],
      data: elm,
    });
    dialogRef.afterClosed().subscribe(
      res => {
        if (res) {
          this.getLeadersList(1, CONSTANTS.PAGE_SIZE, null, this.sortParam);
        }
      }
    );
  }
  //open modal to select pre onb forms for candidate
  openModalToSendDay1OnbForms(elm: any) {
    elm['title'] = `Select Day 1 Forms For Candidate - ${elm?.Name}`;
    elm['formType'] = 2;
    elm['candidateId'] = elm?.CandidateId;
    const dialogRef = this.dialog.open(SendPreonbFormsModalComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'candidate-connect-view-modal'],
      data: elm,
    });
    dialogRef.afterClosed().subscribe(
      res => {
        if (res) {
          this.getLeadersList(1, CONSTANTS.PAGE_SIZE, null, this.sortParam);
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
    if (type === 'IS') {
      elm['title'] = 'Employee Verification (ISS)';
    }
    if (type === 'RM') {
      elm['title'] = 'Employee Verification (RM Connect)';
    }
    elm['IsLeadership'] = 1;

    elm['isLeadershipActive'] = 'Y';

    elm['candidateTypeLead'] = 'LS';
    elm['type'] = type;
    elm['candidateId'] = elm?.CandidateId;
    debugger
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
          this.getLeadersList(1, CONSTANTS.PAGE_SIZE, null, this.sortParam);
        }
      }
    );
  }
  /***
     * open verifcation form 
     */
  viewAllDetailsOnboardPic(elm: any) {
    elm['title'] = 'Candidate Verification Details';
    // elm['isLeadership'] = 'Y'
    elm['candidateTypeLead'] = 'LS';
    elm['IsLeadership'] = 1;

    elm['isLeadershipActive'] = 'Y';
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
          this.getLeadersList(1, CONSTANTS.PAGE_SIZE, null, this.sortParam);
        }
      }
    );
  }
  addLeadershipModal(elm: any, type: string) {
    elm['IsEditable'] = false;
    if (elm?.onboardStatus == null ||
      elm?.onboardStatus == 10 ||
      elm?.onboardStatus == 30 ||
      elm?.CandidateSubmissionStatus == 'D') {
      elm['IsEditable'] = true
    }
    elm['type'] = type
    elm['title'] = type == 'N' ? 'Add Candidate' : 'Update Candidate Details';
    const dialogRef = this.dialog.open(AddLeadershipModalComponent, {
      panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
      data: elm,
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%'
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.getLeadersList(1, CONSTANTS.PAGE_SIZE, null, this.sortParam);
      }
    }
    );
  }

  /**open upload offer modal */
  openUploadOfferLetterModal(elm: any) {
    elm['title'] = 'Upload Offer Documents';
    const dialogRef = this.dialog.open(LeadershipUploadOfferDetailsModalComponent, {
      panelClass: ['ats-model-wrap', 'ats-model-full-screenss'],
      data: elm,
    });
    dialogRef.afterClosed().subscribe(
      res => {
        if (res) {
          this.getLeadersList(1, CONSTANTS.PAGE_SIZE, null, this.sortParam);
        }
      }
    );

  }
  /**preview /send/ pdf offer modal for india */
  previewOfferOptionForIndia(elm: any) {
    elm['title'] = 'Preview Offer';
    const dialogRef = this.dialog.open(PreviewLeadershipOfferModalComponent, {
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
          //  this.paginatorCompRef.paginator.pageIndex = 0;
          this.getLeadersList(1, CONSTANTS.PAGE_SIZE, null, this.sortParam);
        }
      }
    );
  }

  viewAllDetailsOnboard12211(elm: any, type: string) {
    elm['typeLeader'] = type
    elm['candidateId'] = elm?.CandidateId;
    // if (this.userData?.RoleId == 1 || this.userData?.otherRoles?.IsHRAccess == 'Y') {
    //   const dialogRef = this.dialog.open(ViewAllCandidateDetailsOnboardHrComponent, {
    //     panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
    //     data: elm,
    //     maxWidth: '100vw',
    //     maxHeight: '100vh',
    //     height: '100%',
    //     width: '100%'
    //   });
    //   dialogRef.afterClosed().subscribe(
    //     res => {
    //       if (res) {
    //         this.getLeadersList(1, CONSTANTS.PAGE_SIZE, null, this.sortParam);
    //       }
    //     }
    //   );
    // }
    // else {
    //   const dialogRef = this.dialog.open(ViewAllCandidateDetailsOnboardComponent, {
    //     panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
    //     data: elm,
    //     maxWidth: '100vw',
    //     maxHeight: '100vh',
    //     height: '100%',
    //     width: '100%'
    //   });
    //   dialogRef.afterClosed().subscribe(
    //     res => {
    //       if (res) {
    //         this.getLeadersList(1, CONSTANTS.PAGE_SIZE, null, this.sortParam);
    //       }
    //     }
    //   );
    // }


  }

  // recruiter
  // recruiter
  viewAllDetailsOnboardRec(elm: any, type: string) {
     elm['typeLeader'] = type
    elm['candidateId'] = elm?.CandidateId;
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
          this.getLeadersList(1, CONSTANTS.PAGE_SIZE, null, this.sortParam);
        }
      }
    );
  }
  /**hr  */
  viewAllDetailsOnboardHr(elm: any, type: string) {
     elm['typeLeader'] = type
    elm['candidateId'] = elm?.CandidateId;
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
            this.getLeadersList(1, CONSTANTS.PAGE_SIZE, null, this.sortParam);
          }
        }
      );
  }
  DelegateUser(elm: any) {
    let body = {
      CandidateId: elm.CandidateId,
    }

    this._onboardserve.delegateRecruiterAuth(body).subscribe(
      res => {
        let token = res['token'];
        const url: string = `${environment.IOnboardAppURl}?token=${encodeURIComponent(token)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    )
  }

  /**delegat assign modal */
  delegateToRecruiterOpenModal(element: any) {
    element['title'] = element?.isDelegatorHrAssigned == 'Y' ? 'Update Onboarding Spoc' : 'Assign Onboarding Spoc';
    element['isUpdate'] = element?.isDelegatorHrAssigned == 'Y' ? 'Y' : 'N';
    // element['delegatType'] = 'H'; //for hr
    const dialogRef = this.dialog.open(AssignDelegatorForLeadershipModalComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'update-interview-feedback', 'talent-transfers', 'talent-transfers-mod'],
      data: element,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getLeadersList(1, CONSTANTS.PAGE_SIZE, null, this.sortParam);
      }
    });
  }


  // show SendAppointLtrButton button 
  showSendAppointLtrButton(element: any) {
    if (element?.onboardFormStatus == 100 &&
      element?.day1FormStatus == 100 &&
      this.userData?.RoleId == 9 &&
      element?.isAppoinmentUp == 'Y') {
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
      element?.isAppoinmentUp == 'Y' &&
      element?.AppLetterFileName != null) {
      return true
    }
    else {
      return false
    }
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
          this.getLeadersList(1, CONSTANTS.PAGE_SIZE, null, this.sortParam);
        }
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

  confirmCredentialsSendToCandidate(data: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      panelClass: 'ats-confirm',
      data: {
        headerText: 'Alert',
        message: ` Are you sure you want to resend the credentials to <span class='u-name'>${data?.Name}</span> ?`,
        buttonText: {
          ok: "Yes",
          cancel: "No"
        },
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._onboardserve.ResendCredential(data?.CandidateId).subscribe(
          res => {
            this._share.showAlertSuccessMessage.next(res);
          }
        )

      }
      else {
      }
    });
  }

        delegationVisiblity(element:any){
          if((element?.isDelegationbuttonVisible == 'Y')
          && (element?.CandidateSubmissionStatus !='D' && (this.userData?.RoleId == 2 || this.userData?.RoleId == 10))){
            return true
          }
          else{
            return false
          }
        }

      //open modal to view bgv details link
        viewAllDetailsBGV(elm: any) {
          debugger
          elm['candidateId'] = elm?.CandidateId;
          elm['cid'] = elm?.LCid;
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
               // this.getOnboardingCandidateList(1, CONSTANTS.PAGE_SIZE, null, { startDate: null });
               this.getLeadersList(1, CONSTANTS.PAGE_SIZE, null, this.sortParam);
              }
            }
          );
        }


}
