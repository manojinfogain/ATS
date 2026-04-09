// ...existing code...
import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { AtsCommonPrefix } from '../../core/constant/common.const';
import { CONSTANTS } from '../../core/constant/constants';
import { GetSetStorageService } from '../../core/services/get-set-storage.service';
import { TalentService } from '../talent.service';
import { CreateJobPositionModalComponent } from './modals/create-job-position-modal/create-job-position-modal.component';
import { InternalJobPostingModalComponent } from './modals/internal-job-posting-modal/internal-job-posting-modal.component';
import { OfferedCandidateListModalComponent } from './modals/offered-candidate-list-modal/offered-candidate-list-modal.component';
import { ProposeEmployyeeModalComponent } from './modals/propose-employyee-modal/propose-employyee-modal.component';
import { UpdateTalentStatusModalComponent } from './modals/update-talent-status-modal/update-talent-status-modal.component';
import { ViewIjpApplicantListComponent } from './modals/view-ijp-applicant-list/view-ijp-applicant-list.component';
import { ViewReferedEmpModalComponent } from './modals/view-refered-emp-modal/view-refered-emp-modal.component';
import { ViewTalentFullDetailsModalComponent } from './modals/view-talent-full-details-modal/view-talent-full-details-modal.component';
import { ConfirmationDialogComponent } from '../../shared/shared-app/components/confirmation-dialog/confirmation-dialog.component';
import { ShareService } from '../../core/services/share.service';
import { CancelTalentidModalComponent } from './modals/cancel-talentid-modal/cancel-talentid-modal.component';
import { UpdateFulfillmentDateModalComponent } from './modals/update-fulfillment-date-modal/update-fulfillment-date-modal.component';
import { UpdateTalentIdDetailsTagModalComponent } from './modals/update-talent-id-details-tag/update-talent-id-details-tag.component';
import { ViewTalentHistoryModalComponent } from './modals/view-talent-history-modal/view-talent-history-modal.component';
import { AddMoreTalentDetailsModalComponent } from './modals/add-more-talent-details-modal/add-more-talent-details-modal.component';
import { CloneMultiTalentidModalComponent } from './modals/clone-multi-talentid-modal/clone-multi-talentid-modal.component';
import { JDListModalTcComponent } from './modals/jd-list-modal-tc/jd-list-modal-tc.component';
import { GlobalMethod } from '../../core/common/global-method';
import { DatePipe } from '@angular/common';
import { ExcelService } from '../../core/common/excel.service';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { MatSort, Sort } from '@angular/material/sort';
import { FullfillmentdataUpdateModalComponent } from './modals/fullfillmentdata-update-modal/fullfillmentdata-update-modal.component';
import { UpdateTalentAssigneeModalComponent } from './modals/update-talent-assignee-modal/update-talent-assignee-modal.component';
import { ReopenTalentIdModalComponent } from './modals/reopen-talent-id-modal/reopen-talent-id-modal.component';
import { DashboardService } from '../../dashboard-module/dashboard.service';
import { GlobalCommonMethodService } from '../../core/common/global-common-method.service';
import { PanelSelfNominationService } from '../../panel-self-nomination-module/panel-self-nomination.service';
import { GetLocationInfo } from '../../core/common/getLocationInfo';
import { PublishJobsModalComponent } from '../../panel-self-nomination-module/Modal-Screen/publish-jobs-modal/publish-jobs-modal.component';
import { Subscription } from 'rxjs';
import { ActivateDormantTidModalComponent } from './modals/activate-dormant-tid-modal/activate-dormant-tid-modal.component';
import { PostJobToNaukriModalComponent } from './modals/post-job-to-naukri-modal/post-job-to-naukri-modal.component';
import { ViewPostedJobDetailsModalComponent } from './modals/view-posted-job-details-modal/view-posted-job-details-modal.component';
import { NaukriService } from '../naukri.service';
import { ConfirmationDailogNaukriComponent } from './modals/confirmation-dailog-naukri/confirmation-dailog-naukri.component';
import { BulkApproveRejectModalComponent } from './modals/bulk-approve-reject-modal/bulk-approve-reject-modal.component';
import { EditBillingOnboardingDatesModalComponent } from './modals/edit-billing-onboarding-dates-modal/edit-billing-onboarding-dates-modal.component';
import { DemandQualityProbComponent } from './modals/demand-quality-prob/demand-quality-prob.component';
import { DemandProbabiltyViewComponent } from './modals/demand-probabilty-view/demand-probabilty-view.component';
@Component({
  selector: 'app-job-requisition-list',
  templateUrl: './job-requisition-list.component.html',
  styleUrls: ['./job-requisition-list.component.scss'],
  providers: [DatePipe],
})
export class JobRequisitionListComponent implements OnInit {
  // editBillingOnboardingDatesForSelected() {
  //   const selectedIds = Array.from(this.selectedRecordIds);
  //   // Open a modal or dialog for editing billing/onboarding dates for these IDs
  //   // Example: this.dialog.open(EditBillingOnboardingDatesModalComponent, { data: { talentIds: selectedIds } });
  //   console.log('Edit billing/onboarding dates for:', selectedIds);
  //   // TODO: Implement actual modal/dialog logic as needed
  // }

  displayedColumns = [
    'RequisitionId', 'RequisitionType', 'PrimarySkill', 'account', 'Designation', 'Location', 'CreatedDate', 'CreatedBy',
    'approverName', 'THIDAge',
    'wmgCommitDate', 'fulfillmentDate',
    'isTidReopened', 'naukriJobStatus', 'dormantStatus', 'status',
    'action'
  ];

  /**
   * Update displayedColumns to include 'select' only when filtering by opportunityId
   */
  updateDisplayedColumnsForOpportunityIdFilter(sortParam: any) {
    const hasOpportunityIdFilter = !!(sortParam?.oppId && Array.isArray(sortParam.oppId) && sortParam.oppId.length > 0 && sortParam.oppId.some(id => id));
    const selectIndex = this.displayedColumns.indexOf('select');
    if (hasOpportunityIdFilter) {
      if (selectIndex === -1) {
        this.displayedColumns = ['select', ...this.displayedColumns];
      }
    } else {
      if (selectIndex !== -1) {
        this.displayedColumns = this.displayedColumns.filter(col => col !== 'select');
      }
    }
  }
  private thId: string;
  public userData: any = {};
  public searchInput: string = '';
  public sortParam: string = '';
  public paginationData: any;
  public candidateList: any = [];
  public sortFormFilter: UntypedFormGroup = new UntypedFormGroup({});
  public isResetSearch: boolean = false;
  public isResetFilter: boolean = false;
  public raisedTHIDList: any = [];
  public isTidDormant: number = 1;

  // Bulk approval properties
  public selectedRecords: Set<any> = new Set();
  public selectedRecordIds: Set<string> = new Set(); // Store IDs for cross-page persistence
  public isAllSelected: boolean = false;
  public isBulkActionsVisible: boolean = false;
  public totalEligibleRecordsCount: number = 0;
  public isBulkApproveRejectVisible: boolean = false;
  public isBulkEditVisible: boolean = false;
  /** Paginator Reference */
  @ViewChild('paginatorRef', { static: true }) paginatorCompRef;
  @ViewChild(MatSort) sort: MatSort;
  public sortTable: any = [];
  private refreshSubscription: Subscription;
  constructor(
    public dialog: MatDialog,
    private _fb: UntypedFormBuilder,
    private _talentServ: TalentService,
    private _storage: GetSetStorageService,
    private _share: ShareService,
    public datepipe: DatePipe,
    private _excelService: ExcelService,
    public _dashServe: DashboardService,
    private _globalCommonMethod: GlobalCommonMethodService,
    private _PanelServe: PanelSelfNominationService,
    private getLocInfo: GetLocationInfo,
    private _naukriServ: NaukriService
  ) {}

  talentCubeReferenceGuide(elm: any = {}) {
    elm['title'] = 'JD List';
    if ((elm['type'] = 'skill')) {
      // elm['title'] = "Please select Talent Cube available against selected skills."
    }

    const dialogRef = this.dialog.open(JDListModalTcComponent, {
      panelClass: [
        'ats-model-wrap',
        'candidate-connect-view-modal',
        'tc-ref-modal',
      ],
      data: elm,
      width: '700px',
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
      }
    });
  }
  ngOnInit() {
    // const dialogRef = this.dialog.open(DemandProbabiltyViewComponent, {
    //         width: '500px',
    //         panelClass: ['ats-model-wrap','talent-mandateSkill-rating-selection'],
    //         data: {
    //           title: 'Demand Quality',
    //           type:9
    //         },
    //         disableClose: true
    //       });
    // this.talentCubeReferenceGuide();
    this.userData = this._storage.getSetUserData();
    this.getCountStatusWise();
    this.filterFormInit();
    /**showing  for tag */
    if (this.userData?.otherRoles?.IsTAG == 'Y') {
      this.displayedColumns.splice(10, 0, 'priRecruiter', 'secRecruiter');
      this.displayedColumns.splice(9, 0, 'tagAge');
      // this.displayedColumns.splice(3, 0, 'account');
    }
    this.showHideLocWise();
    this.refreshSubscription = this._share.detectSwitchLoc.subscribe((get) => {
      this.showHideLocWise();
    });
  }

  public isVisibleForIndia: boolean = false;
  showHideLocWise() {
    if (this.getLocInfo.isLocationIndia()) {
      this.isVisibleForIndia = true;
    } else {
      this.isVisibleForIndia = false;
    }
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.sortTable = `&sortColumn=applyDate&sortDir=desc`;
    this.GetRaisedTHIDDetails(1, CONSTANTS.PAGE_SIZE, null, null);
  }
  /***
   * table sort by column
   */
  sortData(sort: Sort) {
    this.resetPagination();
    if (sort.direction == '') {
      this.sortTable = '';
    } else {
      // this.sortTable = `&sortColumn=${sort.active}&sortDir=${sort.direction}`;
      this.sortTable = sort;
    }
    //this.getProfileCandList(1, this.pazeSize, this.searchInput, this.sortParam, this.sortTable);
    this.GetRaisedTHIDDetails(1, CONSTANTS.PAGE_SIZE, null, null);
  }

  /***
   * reset paging
   */
  resetPagination() {
    this.paginatorCompRef.paginator.pageIndex = 0;
  }

  /**
   * reset filter and search
   */
  resetSortFilter() {
    this.isResetSearch = true;
    this.isResetFilter = true;
    this.searchInput = '';
    this.sortParam = '';
    this.clearAllSelections();
  }
  /***
   * GetRaisedTHIDDetailsCount
   */
  public CountDetails: any = {};
  public CountDetailsStatus: any = {};
  getCountStatusWise() {
    this._talentServ.GetRaisedTHIDDetailsCount().subscribe((res) => {
      this.CountDetails = res['data'][0];
      this.CountDetailsStatus = res['FilteredStatus'][0];
    });
  }
  /**
   *
   * @param event
   */
  public filterBoxCtrl: UntypedFormControl = new UntypedFormControl();
  getFilterValueFunc(event: any) {
    let crrVal = event.value;
    let data: any = {};
    //Pending for Approval
    if (crrVal == '1') {
      //PENDING FOR GDH APPROVAL -10
      //PENDING WITH BU SPOC - 4
      //PENDING WITH DP/PDL/SDP -2
      let strArray =
        this.CountDetailsStatus?.PendingForApprovalCountStatusId?.split(',');

      data = { talentStatusID: strArray };
    }
    //Open Request
    else if (crrVal == '2') {
      //PENDING WITH TAG -3
      //PENDING WITH WMG-1
      let strArray = this.CountDetailsStatus?.OpenTHIDCountStatusId?.split(',');
      data = { talentStatusID: strArray };
    }
    //Fulfilled
    else if (crrVal == '3') {
      //FULFILLED EXTERNALLY=6
      //INTERNALLY FULFILLED-8
      let strArray =
        this.CountDetailsStatus?.FulfiledTHIDCountStatusId?.split(',');
      data = { talentStatusID: strArray };
    } else {
    }
    this.isResetSearch = true;
    this.isResetFilter = false;
    this.searchInput = '';
    this.sortParam = data;
    this.updateDisplayedColumnsForOpportunityIdFilter(data);
    this.paginatorCompRef;
    let pageSizeSelected: number = this.paginatorCompRef?.paginator?.pageSize;
    this.paginatorCompRef.paginator.pageIndex = 0;
    this.GetRaisedTHIDDetails(1, pageSizeSelected, this.searchInput, data);
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
    this.filterBoxCtrl.reset();
     this.clearAllSelections();
    this.updateDisplayedColumnsForOpportunityIdFilter(data);
    this.paginatorCompRef.paginator.pageIndex = 0;
    let pageSizeSelected: number = this.paginatorCompRef?.paginator?.pageSize;
    this.GetRaisedTHIDDetails(1, pageSizeSelected, this.searchInput, data);
  }

  /**
   * get selected talent Id
   * @param data
   */
  // getDataTalent(data) {
  //   this.resetSortFilter();
  //   this.thId = data.TH_ID;
  //   this.paginatorCompRef.paginator.pageIndex = 0;
  //   this.GetRaisedTHIDDetails(1, CONSTANTS.PAGE_SIZE, this.searchInput, this.sortParam)
  // }

  /**
   * pagination method
   */
  getPagingData(pageEvent: any) {
    // Show notification if user has selections when navigating pages
    // if (this.selectedRecordIds.size > 0) {
    //   console.log(`User navigating with ${this.selectedRecordIds.size} selections - maintaining across pages`);
    // }
     this.clearAllSelections();

    this.GetRaisedTHIDDetails(pageEvent.pageIndex + 1, pageEvent.pageSize, this.searchInput ? this.searchInput : null, this.sortParam);
  }  /***
   * search
   */
  getSearchValueKey(e: any) {
    this.isResetFilter = true;
    this.isResetSearch = false;
    this.sortParam = '';
    this.searchInput = e;
    this.paginatorCompRef.paginator.pageIndex = 0;
    // this.filterBoxCtrl.reset();
    let pageSizeSelected: number = this.paginatorCompRef?.paginator?.pageSize;
    this.GetRaisedTHIDDetails(1, pageSizeSelected, e, this.sortParam);
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
      talentStatusID: [[]],
      accountType: [[]],
      location: [[]],
      dateFrom: [null],
      dateTo: [{ value: null, disabled: true }],
      recruiterId: [[]],
      practiceId: [[]],
      oppId: [[]],
      bizOpsLead: [[]],
      isBillable: [[]]
    })
  }

  public bodyParam: any = {};
  //public bodyParam: any = {};
  GetRaisedTHIDDetails(
    page: number,
    pageSize: number,
    search: any,
    sortParam: any
  ) {
    this.bodyParam = {};
    let body = {
      page: page,
      pageSize: pageSize,
    };
    if (search) {
      body['search'] = search;
    }
    if (sortParam?.talentStatusID && sortParam?.talentStatusID.length !== 0) {
      let Ids = sortParam?.talentStatusID.filter((n) => n);
      body['StatusID'] = Ids.toString();
    }
    if (sortParam?.StatusID && sortParam?.StatusID.length !== 0) {
      //  let Ids = sortParam?.StatusID.filter(n => n);
      body['StatusID'] = sortParam?.StatusID.toString();
    }

    if (sortParam?.accountType && sortParam?.accountType.length !== 0) {
      let Ids = sortParam?.accountType.filter((n) => n);
      body['AccountIDs'] = Ids.toString();
    }

    if (sortParam?.location && sortParam?.location.length !== 0) {
      let Ids = sortParam?.location.filter((n) => n);
      body['LocationIDs'] = Ids.toString();
    }
    if (sortParam?.LocationIDs) {
      body['LocationIDs'] = sortParam?.LocationIDs;
    }
    if (sortParam?.dateFrom) {
      body['StartDate'] = GlobalMethod.formatDate(sortParam?.dateFrom);
    }
    if (sortParam?.dateTo) {
      body['EndDate'] = GlobalMethod.formatDate(sortParam?.dateTo);
    }

    if (sortParam?.recruiterId && sortParam?.recruiterId?.length !== 0) {
      let recIds = sortParam.recruiterId?.filter((n) => n);
      body['recruiterId'] = recIds?.toString();
    }

    if (this.sortTable?.direction) {
      body['sortDir'] = this.sortTable?.direction;
    }

    if (this.sortTable?.active) {
      body['sortColumn'] = this.sortTable?.active;
    }
    if (sortParam?.practiceId && sortParam?.practiceId.length !== 0) {
      let Ids = sortParam?.practiceId.filter((n) => n);
      body['practiceId'] = Ids.toString();
    }
    if (sortParam?.oppId && sortParam?.oppId.length !== 0) {
      let Ids = sortParam?.oppId.filter((n) => n);
      body['oppId'] = Ids.toString();
    }
    if (sortParam?.isBillable) {
      body['isBillable'] = sortParam?.isBillable == 'Y' ? 1 : sortParam?.isBillable == 'N' ? 0 : null;
    }
    if (sortParam?.bizOpsLead && sortParam?.bizOpsLead.length !== 0) {
      let Ids = sortParam.bizOpsLead
        .map((n) => n?.trim()) // Trim each value
        .filter((n) => n); // Remove empty/null/undefined strings
      body['bizOpsLead'] = Ids.toString();
    }
    debugger
    this.bodyParam = body;
    this._talentServ.GetRaisedTHIDDetails(body).subscribe(
      res => {
        this.raisedTHIDList = new MatTableDataSource(res['data'] || []);
        this.paginationData = res['pagination'][0];
        this.candidateList.sort = this.sort;

        // Update total eligible records count (you might need to add this to your API)
        this.updateTotalEligibleRecordsCount();

        // Restore selections for current page data
        this.restoreCurrentPageSelections();

        // Update selection states
        this.updateSelectionStates();
      }
    )

    this.getCountStatusWise();
  }
  /**show hide - cancel talent button */
  // cancelTalentShowButton(element: any, userData: any): boolean {
  //   return (
  //     (
  //       (element?.SubStatusID == 2 || element?.SubStatusID == 4 || element?.SubStatusID == 5 || element?.SubStatusID == 13)
  //       && userData?.otherRoles?.IsHiringManager == 'Y'
  //       && element?.SubStatusID != 7
  //       && element?.CreatedBy == userData?.EmpNewId) 
  //     //   &&
  //     // element?.isTidDormant != 'D'
  //     )
  //     // userData?.otherRoles?.IsAO === 'Y' && element?.isTidDormant != 'D'
  // }
cancelTalentShowButton(element: any, userData: any): boolean {
  if (!element || !userData) return false;

    if(
      element?.SubStatusID != 7 &&
      (
        (element?.SubStatusID == 2 || element?.SubStatusID == 4 || element?.SubStatusID == 5 || element?.SubStatusID == 13) 
       //  && userData?.otherRoles?.IsHiringManager == 'Y'
        //  && element?.CreatedBy == userData?.EmpNewId

      ) ||
      (userData?.otherRoles?.IsAO === 'Y' && element?.isTidDormant == 'D' ||
        userData?.otherRoles?.IsBizOpsSecondary === 'Y' && element?.isTidDormant == 'D'
      )
    ){
      return true;
    }
    else{
      return false;
    }

}

  openCreateJobPositionModal(elm: any, type: string = 'N') {
    elm['type'] = type;
    //elm['title'] = type == 'N' ? 'Create Job Position' : 'Update Talent ID Details'
    const dialogRef = this.dialog.open(CreateJobPositionModalComponent, {
      panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
      data: elm,
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        let pageSizeSelected: number =
          this.paginatorCompRef?.paginator?.pageSize;
        //this.GetRaisedTHIDDetails(1,pageSizeSelected, null, null);
        let pageCount: PageCount = this.getPageCount({});
        this.GetRaisedTHIDDetails(
          pageCount?.Page,
          pageCount?.pageSize,
          this.searchInput,
          this.bodyParam
        );
      }
    });
  }

  openCloneMultiReqModal(elm: any) {
    elm['title'] = 'Clone Multiple Talent ID';
    const dialogRef = this.dialog.open(CloneMultiTalentidModalComponent, {
      panelClass: [
        'ats-model-wrap',
        'ats-model-full-screenss',
        'request-transfers-candidate',
      ],
      data: elm,
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        let pageCount: PageCount = this.getPageCount({});
        this.GetRaisedTHIDDetails(
          pageCount?.Page,
          pageCount?.pageSize,
          this.searchInput,
          this.bodyParam
        );
      }
    });
  }

  getPageCount(pageCount: PageCount) {
    let pageCountData: PageCount = {};
    pageCountData.pageSize = this.paginatorCompRef?.paginator?.pageSize;
    pageCountData.Page = this.paginatorCompRef?.paginator?.pageIndex + 1;
    return pageCountData;
  }

  /**view candidate full details modal open */
  viweTalentFullDetailsModal(elm: any) {
    elm['title'] = 'View Talent ID Details';
    const dialogRef = this.dialog.open(ViewTalentFullDetailsModalComponent, {
      panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
      data: elm,
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        // this.GetRaisedTHIDDetails(1, CONSTANTS.PAGE_SIZE, null, null);
        //  let pageSizeSelected:number = this.paginatorCompRef?.paginator?.pageSize;
        //  this.GetRaisedTHIDDetails(1,pageSizeSelected, this.searchInput, this.bodyParam);
        let pageCount: PageCount = this.getPageCount({});
        this.GetRaisedTHIDDetails(
          pageCount?.Page,
          pageCount?.pageSize,
          this.searchInput,
          this.bodyParam
        );
      }
    });
  }

  /**approval modal
   *
   */
  openApprovalModal(elm: any) {
    /**for gdl and finance - can view only and  approval or reject -  -  */
    if (
      (elm?.SubStatusID == 10 && this.userData?.otherRoles?.IsGDL == 'Y') ||
      (elm?.SubStatusID == 12 && this.userData?.otherRoles?.IsFinance == 'Y')
    ) {
      elm['title'] = 'Approve / Reject Talent Request';
      elm['type'] = 'GDL';
      const dialogRef = this.dialog.open(ViewTalentFullDetailsModalComponent, {
        panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
        data: elm,
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100%',
        width: '100%',
      });

      dialogRef.afterClosed().subscribe((res) => {
        if (res) {
          let pageSizeSelected: number =
            this.paginatorCompRef?.paginator?.pageSize;
          //this.GetRaisedTHIDDetails(1,pageSizeSelected, null, null);
          let pageCount: PageCount = this.getPageCount({});
          this.GetRaisedTHIDDetails(
            pageCount?.Page,
            pageCount?.pageSize,
            this.searchInput,
            this.bodyParam
          );
        }
      });
    } else {
      /**edit and approval for bu head/dp/pdl/sdp Account owner */
      elm['type'] = 'A';
      elm['title'] = 'Approve / Reject Talent Request';
      const dialogRef = this.dialog.open(CreateJobPositionModalComponent, {
        panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
        data: elm,
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100%',
        width: '100%',
      });

      dialogRef.afterClosed().subscribe((res) => {
        if (res) {
          let pageSizeSelected: number =
            this.paginatorCompRef?.paginator?.pageSize;
          // this.GetRaisedTHIDDetails(1,pageSizeSelected, null, null);
          let pageCount: PageCount = this.getPageCount({});
          this.GetRaisedTHIDDetails(
            pageCount?.Page,
            pageCount?.pageSize,
            this.searchInput,
            this.bodyParam
          );
        }
      });
    }
  }

  /**update talent status modal  */
  updateTalentStatus(elm: any) {
    elm['title'] = 'Update Talent ID Status';
    const dialogRef = this.dialog.open(UpdateTalentStatusModalComponent, {
      //width: '500px',
      panelClass: [
        'ats-model-wrap',
        'ats-model-full-screenss',
        'request-transfers-candidate',
      ],
      data: elm,
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        // this.paginatorCompRef.paginator.pageIndex = 0;
        // this.GetRaisedTHIDDetails(1, CONSTANTS.PAGE_SIZE, null, null);
        let pageCount: PageCount = this.getPageCount({});
        this.GetRaisedTHIDDetails(
          pageCount?.Page,
          pageCount?.pageSize,
          this.searchInput,
          this.bodyParam
        );
      }
    });
  }

  /**update details pf  talent id  modal tag  */
  updateTalentDetailsTag(elm: any) {
    elm['title'] = 'Update Details of Talent ID';
    const dialogRef = this.dialog.open(UpdateTalentIdDetailsTagModalComponent, {
      //width: '500px',
      panelClass: [
        'ats-model-wrap',
        'ats-model-full-screenss',
        'request-transfers-candidate',
      ],
      data: elm,
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        // this.paginatorCompRef.paginator.pageIndex = 0;
        // this.GetRaisedTHIDDetails(1, CONSTANTS.PAGE_SIZE, null, null);
        let pageCount: PageCount = this.getPageCount({});
        this.GetRaisedTHIDDetails(
          pageCount?.Page,
          pageCount?.pageSize,
          this.searchInput,
          this.bodyParam
        );
      }
    });
  }

  /**update talent assignee modal */

  updateTalentAssigneeModal(elm: any) {
    elm['title'] = 'Update Primary  And Secondary Recruiter.';
    const dialogRef = this.dialog.open(UpdateTalentAssigneeModalComponent, {
      //width: '500px',
      panelClass: [
        'ats-model-wrap',
        'ats-model-full-screenss',
        'request-transfers-candidate',
      ],
      data: elm,
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        // this.paginatorCompRef.paginator.pageIndex = 0;
        //  this.GetRaisedTHIDDetails(1, CONSTANTS.PAGE_SIZE, null, null);
        let pageCount: PageCount = this.getPageCount({});
        this.GetRaisedTHIDDetails(
          pageCount?.Page,
          pageCount?.pageSize,
          this.searchInput,
          this.bodyParam
        );
      }
    });
  }

  /**publish Job*/

  publishJob(elm: any) {
    debugger;
    elm['title'] = 'Publish Job';
    elm['thidM'] = elm.TH_ID;
    this._PanelServe.getPublishJobStatus(elm.TH_ID).subscribe((get) => {
      if (get['data'][0].IsJobPublish == 'Y') {
        this._share.showAlertSuccessMessage.next('Job already published.');
        return;
      } else {
        const dialogRef = this.dialog.open(PublishJobsModalComponent, {
          panelClass: ['ats-model-wrap', 'publish-job-modal'],
          data: elm,
        });
        dialogRef.afterClosed().subscribe((res) => {
          if (res) {
            // this.GetRaisedTHIDDetails(1, CONSTANTS.PAGE_SIZE, null, null);
          }
        });
      }
    });
  }

  /**update fullfillment date modal */
  updateFullfillmentDateModal(elm: any) {
    elm['title'] = 'Update Commitment Details';
    const dialogRef = this.dialog.open(FullfillmentdataUpdateModalComponent, {
      //width: '500px',
      panelClass: [
        'ats-model-wrap',
        'ats-model-full-screenss',
        'request-transfers-candidate',
        'tc-fullfillment-modal',
      ],
      data: elm,
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        // this.paginatorCompRef.paginator.pageIndex = 0;
        // this.GetRaisedTHIDDetails(1, CONSTANTS.PAGE_SIZE, null, null);
        let pageCount: PageCount = this.getPageCount({});
        this.GetRaisedTHIDDetails(
          pageCount?.Page,
          pageCount?.pageSize,
          this.searchInput,
          this.bodyParam
        );
      }
    });
  }

  /**propose employee modal open */
  proposeEmployeeModal(elm: any) {
    elm['title'] = 'Propose Candidate';
    const dialogRef = this.dialog.open(ProposeEmployyeeModalComponent, {
      panelClass: ['ats-model-wrap', 'candidate-connect-view-modal'],
      data: elm,
      width: '700px',
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        // this.GetRaisedTHIDDetails(1, CONSTANTS.PAGE_SIZE, null, null);
        let pageCount: PageCount = this.getPageCount({});
        this.GetRaisedTHIDDetails(
          pageCount?.Page,
          pageCount?.pageSize,
          this.searchInput,
          this.bodyParam
        );
      }
    });
  }

  /**view proposed employee modal open */
  viewReferredEmployeeModal(elm: any) {
    elm['title'] = 'Proposed Employees Details';
    const dialogRef = this.dialog.open(ViewReferedEmpModalComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'view-proposed-candidate'],
      data: elm,
      // maxWidth: '100vw',
      //   maxHeight: '100vh',
      // height: '100%',
      // width: '100%'
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        // this.GetRaisedTHIDDetails(1, CONSTANTS.PAGE_SIZE, null, null);
        let pageCount: PageCount = this.getPageCount({});
        this.GetRaisedTHIDDetails(
          pageCount?.Page,
          pageCount?.pageSize,
          this.searchInput,
          this.bodyParam
        );
      }
    });
  }

  /**convert to Internal job posting modal open */
  internalJobPostingModal(elm: any) {
    elm['title'] = 'Job Posting';
    const dialogRef = this.dialog.open(InternalJobPostingModalComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'view-proposed-candidate'],
      data: elm,
      // maxWidth: '100vw',
      //   maxHeight: '100vh',
      // height: '100%',
      // width: '100%'
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        // this.GetRaisedTHIDDetails(1, CONSTANTS.PAGE_SIZE, null, null);
        let pageCount: PageCount = this.getPageCount({});
        this.GetRaisedTHIDDetails(
          pageCount?.Page,
          pageCount?.pageSize,
          this.searchInput,
          this.bodyParam
        );
      }
    });
  }

  /**view applicant list modal */
  viewIjpApplicantListModal(elm: any) {
    elm['title'] = 'IJP Applicant List';
    const dialogRef = this.dialog.open(ViewIjpApplicantListComponent, {
      width: '650px',
      // max-height: '250px',
      panelClass: [
        'ats-model-wrap',
        'view-ijp-applicants-popup',
        'add-profile-popup',
      ],
      data: elm,
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        // this.GetIJPViewJobList();
      }
    });
  }

  /**view talent history modal */
  viewTalentHistoryModal(elm: any) {
    elm['title'] = '';
    const dialogRef = this.dialog.open(ViewTalentHistoryModalComponent, {
      width: '650px',
      // max-height: '250px',
      panelClass: ['ats-model-wrap', 'view-offered-candidate-popup'],
      data: elm,
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
      }
    });
  }

  /**view offered canidate list modal */
  viewOfferedCandidateListModal(elm: any, type: string) {
    debugger;
    // elm['title'] = "Offered Candidate";
    elm['title'] = 'Offered Candidate';
    elm['type'] = type;
    // elm['IsMannualOffer'] = 'Y';
    const dialogRef = this.dialog.open(OfferedCandidateListModalComponent, {
      width: '650px',
      // max-height: '250px',
      panelClass: ['ats-model-wrap', 'view-offered-candidate-popup'],
      data: elm,
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        // this.GetRaisedTHIDDetails(1, CONSTANTS.PAGE_SIZE, null, null);
        let pageCount: PageCount = this.getPageCount({});
        this.GetRaisedTHIDDetails(
          pageCount?.Page,
          pageCount?.pageSize,
          this.searchInput,
          this.bodyParam
        );
      }
    });
  }

  /**cancel talent modal */
 /**cancel talent modal */
  cancelTalentIdModal(element: any) {
    debugger
    this._talentServ.CheckCancelTHIDAuthorization(element['TH_ID']).subscribe(
      res => {
        if(res?.statusId === 1){
           element['title'] = "Cancel Talent ID";
            const dialogRef = this.dialog.open(CancelTalentidModalComponent, {
              width: '500px',
              panelClass: ['ats-model-wrap', 'update-interview-feedback', 'talent-transfers', 'talent-transfers-mod'],
              data: element,
              disableClose: true
            });

            dialogRef.afterClosed().subscribe(result => {
              if (result) {
                this.paginatorCompRef.paginator.pageIndex = 0;
                //  this.GetRaisedTHIDDetails(1, CONSTANTS.PAGE_SIZE, null, null);
                let pageCount: PageCount = this.getPageCount({});
                this.GetRaisedTHIDDetails(pageCount?.Page, pageCount?.pageSize, this.searchInput, this.bodyParam);
              }
            });
        }
        else{
          this._share.showAlertErrorMessage.next(res?.message);
          return;
        }

      }
    )
   
  }

  /**update fulfillment date */
  updateFullfilmentDateModal(element: any) {
    element['title'] = 'Update Commit Date';
    const dialogRef = this.dialog.open(UpdateFulfillmentDateModalComponent, {
      width: '500px',
      panelClass: [
        'ats-model-wrap',
        'update-interview-feedback',
        'talent-transfers',
        'talent-transfers-mod',
      ],
      data: element,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.paginatorCompRef.paginator.pageIndex = 0;
        // this.GetRaisedTHIDDetails(1, CONSTANTS.PAGE_SIZE, null, null);
        let pageCount: PageCount = this.getPageCount({});
        this.GetRaisedTHIDDetails(
          pageCount?.Page,
          pageCount?.pageSize,
          this.searchInput,
          this.bodyParam
        );
      }
    });
  }

  /**add talent details  */
  addTalentIDdetailsModal(element: any) {
    element['title'] = 'Update Requirement Type';
    const dialogRef = this.dialog.open(AddMoreTalentDetailsModalComponent, {
      width: '500px',
      panelClass: [
        'ats-model-wrap',
        'update-interview-feedback',
        'talent-transfers',
        'talent-add-talent-details-mod',
      ],
      data: element,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.paginatorCompRef.paginator.pageIndex = 0;
        // this.GetRaisedTHIDDetails(1, CONSTANTS.PAGE_SIZE, null, null);
        let pageCount: PageCount = this.getPageCount({});
        this.GetRaisedTHIDDetails(
          pageCount?.Page,
          pageCount?.pageSize,
          this.searchInput,
          this.bodyParam
        );
      }
    });
  }

  /**remove job from website by tag */
  confirmDeleteFromWebsite(elm: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      panelClass: 'ats-confirm',
      data: {
        headerText: 'Alert',
        message: ` Are you sure to remove this opportunity from the website ?`,
        buttonText: {
          ok: 'Yes',
          cancel: 'No',
        },
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result) {
          this._talentServ
            .AddOrRemoveFromWebsite(elm.TH_ID, 'D')
            .subscribe((res) => {
              this._share.showAlertSuccessMessage.next(res);
              // this.GetRaisedTHIDDetails(1, CONSTANTS.PAGE_SIZE, null, null);
              let pageCount: PageCount = this.getPageCount({});
              this.GetRaisedTHIDDetails(
                pageCount?.Page,
                pageCount?.pageSize,
                this.searchInput,
                this.bodyParam
              );
              //this._router.navigate(['Update History'])
              // this.dialogRef.close();
            });
        }
      }
    });
  }

  isApprovalBtnShow(element: any) {
    return false;
  }

  /***
   * export excel
   */
  exportAsXLSX(): void {
    let param = {
      page: 1,
      pageSize: this.paginationData?.Total,
    };
    this.bodyParam['page'] = 1;
    this.bodyParam['pageSize'] = this.paginationData?.Total;
    this._talentServ
      .getRaisedTHIDDetailsReport(this.bodyParam)
      .subscribe((res) => {
        let requisitionList = res['data'];
        let filterDataExcel = [];
        for (var key in requisitionList) {
          let selectedData = {
            'Requisition ID': requisitionList[key].CTHID,
            'Requisition Type': requisitionList[key].ReqType,
            Skill: requisitionList[key].PriSkill,
            'Account Name': requisitionList[key].AccountName,
            Designation: requisitionList[key].DesigName,
            Location: requisitionList[key].JoiningLocation,
            'Created Date': this.datepipe.transform(
              requisitionList[key].CreatedOn,
              'yyyy/M/dd'
            ),
            //  'Created Date': requisitionList[key].CreatedOn,
            'Created By': requisitionList[key].CreatedByName,
            Age: requisitionList[key].THIDAge,
            'Tag Age': requisitionList[key].TAGAge,
            'DP / PDL / SDP': requisitionList[key].ApproverDP,
            'Commit Date (TAG)': this.datepipe.transform(
              requisitionList[key].fulfilmentDate,
              'yyyy/MM/dd'
            ),
            //'Commit Date <br> (TAG)':requisitionList[key].fulfilmentDate,
            'Primary Recruiter': requisitionList[key].PrimaryRecruiter,
            'Secondary Recruiter': requisitionList[key].SecondaryRecruiter,
            'Commit Date (WMG)': this.datepipe.transform(
              requisitionList[key]?.wmgFulfilmentDate,
              'yyyy/MM/dd'
            ),
            // 'Commit Date <br> (WMG)': requisitionList[key].wmgFulfilmentDate,
            Status: requisitionList[key]?.SubStatus,
            // 🔽 New columns added
            'BizOps Lead': requisitionList[key].BizOpsLead,
            'Opp Id': requisitionList[key].OppId,
            'Opp Name': requisitionList[key].OppName,
            Stage: requisitionList[key].Stage,
            'Confidance Level': requisitionList[key].ConfidanceLevel,
            'Billing Rate': requisitionList[key].BillingRateTH,
            Grade: requisitionList[key].Grade,
            'Planned Onboarding date': requisitionList[key].PlanedOnboardingDate
              ? this.datepipe.transform(
                  requisitionList[key].PlanedOnboardingDate,
                  'yyyy/MM/dd'
                )
              : '',
            'Planned Billing date': requisitionList[key].PlanedBillingDate
              ? this.datepipe.transform(
                  requisitionList[key].PlanedBillingDate,
                  'yyyy/MM/dd'
                )
              : '',
            'Billing Loss (Yes/No)': requisitionList[key].BillingLoss,
            'Offshore/Onshore': requisitionList[key].OffshoreOnsSite,
            JD: requisitionList[key].JD,
            'Replacement For': requisitionList[key].ReplacementFor,
            'Is billable (Yes/No)': requisitionList[key].IsBillable,
            'Billing type': requisitionList[key].BillingType,
            'TAG remarks': requisitionList[key].TAGRemarks,
            'Emp Name': requisitionList[key].EmpName,
            'Emp Id': requisitionList[key].EmpId,
          };
          filterDataExcel.push(selectedData);
        }
        this._excelService.exportAsExcelFile(
          filterDataExcel,
          'Job-Requisitions'
        );
      });
  }

  public dtData: any = '';
  public title: string = '';
  openPop(data: any, title: string): void {
    if (data) {
      this.title = title;
      this.dtData = data;
    }
  }

  //oepn model for reopening of talent id
  openModelForReopeningofTalentId(data: any) {
    this._dashServe.getTalentIdInfo(data.TH_ID).subscribe((res) => {
      let statusData = res[0];
      data['IsAllocated'] = statusData?.IsAllocated;
      if (statusData?.IsAllocated == 1) {
        this._globalCommonMethod.showMessagedisplay({
          title: 'Alert',
          autoHide: false,
          msg: `
           <p>Talent Id can not be reopened as allocation is already done.</p>`,
        });
      } else {
        data['title'] = `${'Re-open Talent ID'}`;
        const dialogRef = this.dialog.open(ReopenTalentIdModalComponent, {
          //width: '500px',
          panelClass: [
            'ats-model-wrap',
            'ats-model-full-screenss',
            'request-transfers-candidate',
          ],
          data: data,
        });

        dialogRef.afterClosed().subscribe((res) => {
          if (res) {
            // this.paginatorCompRef.paginator.pageIndex = 0;
            // this.GetRaisedTHIDDetails(1, CONSTANTS.PAGE_SIZE, null, null);
            let pageCount: PageCount = this.getPageCount({});
            this.GetRaisedTHIDDetails(
              pageCount?.Page,
              pageCount?.pageSize,
              this.searchInput,
              this.bodyParam
            );
          }
        });
      }
    });
  }

  activateDormantTid(elm: any) {
    elm['title'] = 'Activate Dormant Talent ID';
    const dialogRef = this.dialog.open(ActivateDormantTidModalComponent, {
      //width: '500px',
      panelClass: [
        'ats-model-wrap',
        'ats-model-full-screenss',
        'request-transfers-candidate',
      ],
      data: elm,
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        // this.paginatorCompRef.paginator.pageIndex = 0;
        // this.GetRaisedTHIDDetails(1, CONSTANTS.PAGE_SIZE, null, null);
        let pageCount: PageCount = this.getPageCount({});
        this.GetRaisedTHIDDetails(
          pageCount?.Page,
          pageCount?.pageSize,
          this.searchInput,
          this.bodyParam
        );
      }
    });
  }

  /**publish Job to naukri*/

  publishJobToNaukri(elm: any) {
    if (
      elm?.PostedStatus == 'CREATED' ||
      elm?.PostedStatus == 'CREATE_PENDING' ||
      elm?.PostedStatus == 'UPDATED' ||
      elm?.PostedStatus == 'UPDATE_PENDING' ||
      elm?.PostedStatus == 'REFRESHED' ||
      elm?.PostedStatus == 'REFRESH_PENDING' ||
      elm?.PostedStatus == 'CREATE_FAILED' ||
      elm?.PostedStatus == 'UPDATE_FAILED'
    ) {
      elm['title'] = `Update Naukri Job Posting ( ${elm?.CTHID} )`;
    } else {
      elm['title'] = `Naukri Job Posting ( ${elm?.CTHID} )`;
    }
    elm['thidM'] = elm.TH_ID;
    const dialogRef = this.dialog.open(PostJobToNaukriModalComponent, {
      panelClass: ['ats-model-wrap', 'publish-job-modal'],
      data: elm,
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.GetRaisedTHIDDetails(1, CONSTANTS.PAGE_SIZE, null, null);
      }
    });
  }

  // Add this method to job-requisition-list.component.ts
  viewPostedJobDetails(element: any): void {
    const jobId = element?.JobId;
    if (!jobId) {
      this._share.showAlertErrorMessage.next(
        'Job ID not found. Cannot view job details.'
      );
      return;
    }

    this.dialog.open(ViewPostedJobDetailsModalComponent, {
      // width: '800px',
      data: {
        jobId: jobId,
        PostedStatus: element?.PostedStatus,
        UnpublishDate: element?.UnpublishDate,
      },
      panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
      // data: elm,
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
    });
  }

  unpublishJobConfirmation(element: any): void {
    const jobId = element?.JobId;
    if (!jobId) {
      this._share.showAlertErrorMessage.next(
        'Job ID not found. Cannot unpublish job.'
      );
      return;
    }

    // const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    //   width: '400px',
    //   data: {
    //     title: 'Unpublish Job',
    //     message: 'Do you really want to unpublish this job from Naukri? This action cannot be undone.',
    //     confirmButtonText: 'Unpublish'
    //   }
    const dialogRef = this.dialog.open(ConfirmationDailogNaukriComponent, {
      panelClass: 'ats-confirm',
      data: {
        headerText: `Unpublish Job`,
        message:
          'Do you really want to unpublish this job from Naukri? This action cannot be undone.',
        // message: `You are changing the ${data?.name} <br> from "${data?.oldVal}" <br> To "${data?.curValue}".`,
        isHideCancel: 0,
        buttonText: {
          ok: 'Ok',
          cancel: 'Cancel',
        },
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.unpublishJob(jobId);
      }
    });
  }

  unpublishJob(jobId: string): void {
    // this._share.showLoader.next(true);

    this._naukriServ.unpublishJob(jobId).subscribe(
      (response) => {
        // this._share.showLoader.next(false);

        if (response) {
          this._share.showAlertSuccessMessage.next(
            response || 'Job successfully unpublished from Naukri.'
          );
          // Refresh the job list to update the status
          this.GetRaisedTHIDDetails(1, CONSTANTS.PAGE_SIZE, null, null);
        } else {
          this._share.showAlertErrorMessage.next(
            response || 'Failed to unpublish job. Please try again.'
          );
        }
      },
      (error) => {
        // this._share.showLoader.next(false);
        console.error('Error unpublishing job:', error);
        this._share.showAlertErrorMessage.next(
          'An error occurred while unpublishing the job. Please try again later.'
        );
      }
    );
  }

  refreshJobConfirmation(element: any): void {
    const jobId = element?.JobId;
    if (!jobId) {
      this._share.showAlertErrorMessage.next(
        'Job ID not found. Cannot refresh job.'
      );
      return;
    }

    // const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    //   width: '400px',
    //   data: {
    //     title: 'Refresh Job',
    //     message: 'Do you really want to refresh this job on Naukri? This action will update the job posting.',
    //     confirmButtonText: 'Refresh'
    //   }
    const dialogRef = this.dialog.open(ConfirmationDailogNaukriComponent, {
      panelClass: 'ats-confirm',
      data: {
        headerText: `Refresh Job`,
        message:
          'Do you really want to refresh this job on Naukri? This action will update the job posting.',
        // message: `You are changing the ${data?.name} <br> from "${data?.oldVal}" <br> To "${data?.curValue}".`,
        isHideCancel: 0,
        buttonText: {
          ok: 'Ok',
          cancel: 'Cancel',
        },
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.refreshJob(jobId);
      }
    });
  }

  refreshJob(jobId: string): void {
    // this._share.showLoader.next(true);

    this._naukriServ.refreshJob(jobId).subscribe(
      (response) => {
        // this._share.showLoader.next(false);

        if (response) {
          this._share.showAlertSuccessMessage.next(
            response || 'Job successfully refreshed on Naukri.'
          );
          // Refresh the job list to update the status
          this.GetRaisedTHIDDetails(1, CONSTANTS.PAGE_SIZE, null, null);
        } else {
          this._share.showAlertErrorMessage.next(
            response || 'Failed to refresh job. Please try again.'
          );
        }
      },
      (error) => {
        // this._share.showLoader.next(false);
        console.error('Error refreshing job:', error);
        this._share.showAlertErrorMessage.next(
          'An error occurred while refreshing the job. Please try again later.'
        );
      }
    );
  }

  isHiringLocationIndia(element: any) {
    if (
      element?.LocationID == 21 ||
      element?.LocationID == 1 ||
      element?.LocationID == 2 ||
      element?.LocationID == 4 ||
      element?.LocationID == 5 ||
      element?.LocationID == 16 ||
      element?.LocationID == 23
    ) {
      return true;
    } else {
      return false;
    }
  }

  // Bulk Selection Methods

  /**
   * Toggle selection of all records
   */
  toggleAllSelection(): void {
    this.isAllSelected = !this.isAllSelected;

    if (this.isAllSelected) {
      // Select all eligible records on current page
      this.raisedTHIDList.data.forEach(record => {
        if (this.isRecordEligibleForBulkAction(record)) {
          this.selectedRecords.add(record);
          this.selectedRecordIds.add(record.TH_ID || record.CTHID);
        }
      });
    } else {
      // Deselect all records on current page
      this.raisedTHIDList.data.forEach(record => {
        this.selectedRecords.delete(record);
        this.selectedRecordIds.delete(record.TH_ID || record.CTHID);
      });
    }

    this.updateBulkActionsVisibility();
  }

  /**
   * Toggle selection of individual record
   */
  toggleRecordSelection(record: any): void {
    const recordId = record.TH_ID || record.CTHID;

    if (this.selectedRecords.has(record)) {
      this.selectedRecords.delete(record);
      this.selectedRecordIds.delete(recordId);
    } else {
      this.selectedRecords.add(record);
      this.selectedRecordIds.add(recordId);
    }

    this.updateSelectionStates();
    this.updateBulkActionsVisibility();
  }

  /**
   * Check if record is selected
   */
  isRecordSelected(record: any): boolean {
    return this.selectedRecords.has(record) || this.selectedRecordIds.has(record.TH_ID || record.CTHID);
  }

  /**
   * Update total eligible records count
   */
  updateTotalEligibleRecordsCount(): void {
    if (!this.raisedTHIDList?.data) {
      this.totalEligibleRecordsCount = 0;
      return;
    }

    // For now, calculate from current page data
    // Ideally, this should come from the API
    this.totalEligibleRecordsCount = this.raisedTHIDList.data.filter(record =>
      this.isRecordEligibleForBulkAction(record)
    ).length;
  }

  /**
   * Restore selections for current page based on stored IDs
   */
  restoreCurrentPageSelections(): void {
    this.selectedRecords.clear();

    if (this.raisedTHIDList?.data && this.selectedRecordIds.size > 0) {
      this.raisedTHIDList.data.forEach(record => {
        const recordId = record.TH_ID || record.CTHID;
        if (this.selectedRecordIds.has(recordId)) {
          this.selectedRecords.add(record);
        }
      });
    }
  }

  /**
   * Update selection states (all selected, indeterminate, etc.)
   */
  updateSelectionStates(): void {
    const eligibleRecordsOnPage = this.raisedTHIDList.data.filter(r => this.isRecordEligibleForBulkAction(r));
    const selectedEligibleOnPage = eligibleRecordsOnPage.filter(r => this.isRecordSelected(r));

    this.isAllSelected = eligibleRecordsOnPage.length > 0 &&
      selectedEligibleOnPage.length === eligibleRecordsOnPage.length;
  }

  /**
   * Check if record is eligible for bulk approval/rejection
   */
  isRecordEligibleForBulkAction(record: any): boolean {
    // Only allow bulk actions for records pending approval
    const eligibleStatuses = [1, 2, 3,  5, 13]; // Pending statuses
    const isEligible = eligibleStatuses.includes(record?.SubStatusID) &&
      record?.isTidDormant !== 'D' &&
      this.hasApprovalPermission(record);

    // New validation: if any record is selected, only allow records with the same opportunityId (OppId)
    if (!isEligible) return false;
    if (this.selectedRecords.size === 0) return true;
    // Get the opportunityId of the first selected record
    const firstSelected = this.selectedRecords.values().next().value;
    if (!firstSelected) return true;
    return record?.opportunityId === firstSelected?.opportunityId;
  }

  /**
   * Check if user has permission to approve/reject the record
   */
  hasApprovalPermission(record: any): boolean {
    return (
      // BU SPOC/DP/PDL/SDP approval
      ((record?.SubStatusID === 2 || record?.SubStatusID === 5 || record?.SubStatusID === 13 || record?.SubStatusID === 3) &&
        this.userData?.otherRoles?.IsAO === 'Y') ||
      // GDL approval
      // (record?.SubStatusID === 10 && this.userData?.otherRoles?.IsGDL === 'Y') ||
      // Finance approval
      // (record?.SubStatusID === 12 && this.userData?.otherRoles?.IsFinance === 'Y') ||
      //WMG Edit
      ((record?.SubStatusID === 1) &&
        this.userData?.otherRoles?.IsWMG === 'Y')
    );
  }

  /**
   * Update bulk actions visibility
   */
  public editBtnLabel: string = 'Edit Onboarding / Billing Dates';
  updateBulkActionsVisibility(): void {
    this.isBulkActionsVisible = this.selectedRecords.size > 0;
    const currentPageSelected = Array.from(this.selectedRecords);
    
    // Check isBillable for all selected records
    const billableRecords = currentPageSelected.filter(rec => rec.isBillable === 'Y');
    const unBillableRecords = currentPageSelected.filter(rec => rec.isBillable === 'N');
    if (billableRecords.length === currentPageSelected.length) {
      this.editBtnLabel = 'Edit Onboarding / Billing Dates';
    } else if (unBillableRecords.length === currentPageSelected.length) {
      this.editBtnLabel = 'Edit Onboarding Date';
    } else {
      this.editBtnLabel = 'Edit Onboarding / Billing Dates';
    }

    // Update bulk approve/reject visibility
    this.isBulkApproveRejectVisible = false;
    if (currentPageSelected.length > 0) {
      this.isBulkApproveRejectVisible = currentPageSelected.every(element => 
        (this.userData?.otherRoles?.IsAO === 'Y' && (element?.SubStatusID === 13 || element?.SubStatusID === 5 || element?.SubStatusID === 2))
        // (this.userData?.otherRoles?.IsGDL === 'Y' && (element?.SubStatusID === 10 || element?.SubStatusID === 2)) ||
        // this.userData?.otherRoles?.IsFinance === 'Y'
      );
    }

    // Update bulk edit visibility
    this.isBulkEditVisible = false;
    if (currentPageSelected.length > 0) {
      this.isBulkEditVisible = currentPageSelected.every(element => 
        (this.userData?.otherRoles?.IsAO === 'Y' && (element?.SubStatusID === 3 || element?.SubStatusID === 2)) ||
        // (this.userData?.otherRoles?.IsGDL === 'Y' && (element?.SubStatusID === 3)) ||
        // this.userData?.otherRoles?.IsFinance === 'Y' || 
        this.userData?.otherRoles?.IsWMG === 'Y'
      );
    }
  }

  /**
   * Get count of selected records
   */
  getSelectedCount(): number {
    return this.selectedRecordIds.size; // Use persistent IDs count
  }

  /**
   * Get count of eligible records for bulk actions
   */
  getEligibleRecordsCount(): number {
    if (!this.raisedTHIDList?.data) return 0;
    return this.raisedTHIDList.data.filter(record => this.isRecordEligibleForBulkAction(record)).length;
  }

  /**
   * Check if any records are eligible for bulk actions
   */
  hasEligibleRecords(): boolean {
    return this.getEligibleRecordsCount() > 0;
  }

  /**
   * Bulk approve selected records
   */
  bulkApproveRecords(): void {
    if (this.selectedRecordIds.size === 0) return;

    // Get current page selected records for display
    const currentPageSelected = Array.from(this.selectedRecords);
    const totalSelectedCount = this.selectedRecordIds.size;

    const dialogRef = this.dialog.open(BulkApproveRejectModalComponent, {
      width: '600px',
      maxWidth: '90vw',
      panelClass: ['ats-model-wrap', 'bulk-approve-reject-modal'],
      data: {
        actionType: 'approve',
        selectedRecords: currentPageSelected,
        recordCount: totalSelectedCount
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // result contains: { actionType, remarks, recordCount, selectedRecords }
        this.performBulkActionWithIds('approve', Array.from(this.selectedRecordIds), result.remarks);
      }
    });
  }

  /**
   * Bulk reject selected records
   */
  bulkRejectRecords(): void {
    if (this.selectedRecordIds.size === 0) return;

    // Get current page selected records for display
    const currentPageSelected = Array.from(this.selectedRecords);
    const totalSelectedCount = this.selectedRecordIds.size;

    const dialogRef = this.dialog.open(BulkApproveRejectModalComponent, {
      width: '600px',
      maxWidth: '90vw',
      panelClass: ['ats-model-wrap', 'bulk-approve-reject-modal'],
      data: {
        actionType: 'reject',
        selectedRecords: currentPageSelected,
        recordCount: totalSelectedCount
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // result contains: { actionType, remarks, recordCount, selectedRecords }
        this.performBulkActionWithIds('reject', Array.from(this.selectedRecordIds), result.remarks, result?.subReason);
      }
    });
  }

  /**
   * Perform bulk action using record IDs (cross-page support)
   */
  performBulkActionWithIds(action: 'approve' | 'reject', recordIds: string[], remarks?: string, subReason?: string): void {
    // This method works with IDs instead of full records for cross-page support

    let successCount = 0;
    let totalCount = recordIds.length;
    debugger
    // TODO: Replace with actual bulk API call
    // For now, simulate the API response
    // setTimeout(() => {

    //   successCount = totalCount; // Simulate all successful

    //   if (successCount === totalCount) {
    //     this._share.showAlertSuccessMessage.next(`Successfully ${action}ed ${successCount} records across all pages.`);
    //   } else {
    //     this._share.showAlertSuccessMessage.next(`${action}ed ${successCount} out of ${totalCount} records. Some records may have failed.`);
    //   }TalentIDApprovalActionBulk



    //   // Clear selections and refresh data
    //   this.clearAllSelections();
    //   this.refreshTableData();
    // }, 1000);


    // TODO: Replace the above simulation with actual bulk API call:

    const bulkData = {
      ActionTaken: action === 'approve' ? 'A' : 'R',
      ThidList: recordIds?.toString(), // Use IDs instead of full records
      SubCateID: subReason || null, // Include sub-reason for rejection if provided
      Remark: remarks, // Include user remarks
      // comments: `Bulk ${action} action performed across multiple pages: ${remarks}`
    };

    this._talentServ.TalentIDApprovalActionBulk(bulkData).subscribe(
      response => {
        if (response) {
          // this._share.showAlertSuccessMessage.next(`Successfully ${action}ed ${recordIds.length} records across all pages.`);
          this._share.showAlertSuccessMessage.next(response?.Message || `Successfully ${action}ed ${recordIds.length} records across all pages.`);
          this.clearAllSelections();
          this.refreshTableData();
        } else {
          this._share.showAlertErrorMessage.next(`Failed to ${action} records. Please try again.`);
        }
      },
      error => {
        console.error(`Error during bulk ${action}:`, error);
        this._share.showAlertErrorMessage.next(`An error occurred during bulk ${action}. Please try again.`);
      }
    );

  }

  /**
   * Clear all selections
   */
  clearAllSelections(): void {
    this.selectedRecords.clear();
    this.selectedRecordIds.clear(); // Clear persistent IDs as well
    this.isAllSelected = false;
    this.isBulkActionsVisible = false;
  }

  /**
   * Refresh table data after bulk operations
   */
  refreshTableData(): void {
    let pageCount: PageCount = this.getPageCount({});
    this.GetRaisedTHIDDetails(pageCount?.Page, pageCount?.pageSize, this.searchInput, this.bodyParam);
  }

  editBillingOnboardingDatesForSelected(): void {
    if (this.selectedRecordIds.size === 0) return;

    // Get current page selected records for display
    const currentPageSelected = Array.from(this.selectedRecords);
    const totalSelectedCount = this.selectedRecordIds.size;
    const selectedIds = Array.from(this.selectedRecordIds);

    // Check isBillable for all selected records
    const billableRecords = currentPageSelected.filter(rec => rec.isBillable === 'Y');
    const unBillableRecords = currentPageSelected.filter(rec => rec.isBillable === 'N');
    if (billableRecords.length !== currentPageSelected.length && unBillableRecords.length !== currentPageSelected.length) {
      this._share.showAlertErrorMessage.next('Please select the filter for Billable or Non-Billable Talent Ids first.');
      return;
    }
    let isBillableSelected = '';
    if (billableRecords.length === currentPageSelected.length) {
      isBillableSelected = 'Y';
    } else if (unBillableRecords.length === currentPageSelected.length) {
      isBillableSelected = 'N';
    }
    const dialogRef = this.dialog.open(EditBillingOnboardingDatesModalComponent, {
      width: '500px',
      maxWidth: '95vw',
      panelClass: ['ats-model-wrap', 'edit-billing-onboarding-dates-modal'],
      data: {
        // talentIds: selectedIds,
        actionType: 'Update',
        selectedRecords: currentPageSelected,
        recordCount: totalSelectedCount,
        isBillableSelected: isBillableSelected
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Optionally refresh data or show a success message
        // this.refreshTableData();
        // this._share.showAlertSuccessMessage.next('Billing and Onboarding dates updated successfully for selected records.');
        const bulkData = {
          BILLING_DATE: result?.BILLING_DATE,
          BILLING_DATE_UTC: result?.BILLING_DATE_UTC,
          ONBOARDING_DATE: result?.ONBOARDING_DATE,
          ONBOARDING_DATE_UTC: result?.ONBOARDING_DATE_UTC,
          TimeZoneIana: result?.TimeZoneIana,
          TH_IDS: selectedIds?.toString(),
        };

        this._talentServ.UpdateTalentBillingOnboardingDate(bulkData).subscribe(
          response => {
            if (response) {
              // this._share.showAlertSuccessMessage.next(`Successfully ${action}ed ${recordIds.length} records across all pages.`);
              this._share.showAlertSuccessMessage.next(response?.Message || `Billing and Onboarding dates updated successfully for selected records.`);
              this.clearAllSelections();
              this.refreshTableData();
            } else {
              this._share.showAlertErrorMessage.next(`Failed to update records. Please try again.`);
            }
          },
          error => {
            console.error(`Error during bulk update:`, error);
            this._share.showAlertErrorMessage.next(`An error occurred during bulk update. Please try again.`);
          }
        );
      }
    });
  }

  viewProbabilityDemandModal(elm: any) {
    const dialogRef = this.dialog.open(DemandProbabiltyViewComponent, {
      //  width: '500px',
      panelClass: ['ats-model-wrap', 'ats-model-full-screen','talent-mandateSkill-rating-selection1'],
      data: elm,
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
    });
  }

}


export interface PageCount {
  Page?: number;
  pageSize?: number
}