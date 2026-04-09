import { Component, OnInit, ViewChild } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { TalentService } from '../../../talent.service';
import { ShareService } from '../../../../core/services/share.service';
import { CONSTANTS } from '../../../../core/constant/constants';
import { MyApplicationDetailsModalComponent } from '../../modals/my-application-details-modal/my-application-details-modal.component';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MyApplicationHistoryModalComponent } from '../../modals/my-application-history-modal/my-application-history-modal.component';
import { ExcelService } from '../../../../core/common/excel.service';
import { GlobalMethod } from '../../../../core/common/global-method';
import { debounceTime, distinctUntilChanged, filter, map, Observable, startWith, switchMap } from 'rxjs';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';

@Component({
  selector: 'app-my-applications-dashboard',
  templateUrl: './my-applications-dashboard.component.html',
  styleUrls: ['./my-applications-dashboard.component.scss'],
})
export class MyApplicationsDashboardComponent implements OnInit {
  // Dashboard stats
  public applicationStats: any = {
    total: 0,
    proposed: 0,
    interview: 0,
    selected: 0,
    rejected: 0,
    wmgPending: 0,
    trainDeploy: 0,
  };

  // Application history list
  public applicationHistoryList: any[] = [];
  public sortFormFilter: UntypedFormGroup = new UntypedFormGroup({});

  // Table columns
  displayedColumns = [
    'requisitionId',
    'ijpName',
    'positionRole',
    'account',
    'grade',
    'prSkill',
    'location',
    'appliedDate',
    'sourceType',
    'status',
    // 'rejectionReason',
    // 'wmgStatus',
    'action',
  ];

  public searchInput: string = '';
  public sortParam: any = {};
  public paginationData: any;
  public isResetSearch: boolean = false;
  public isResetFilter: boolean = false;
  public bodyParam: any = {};

  @ViewChild('paginatorRef', { static: true }) paginatorCompRef;

  constructor(
    public dialog: MatDialog,
    private _talentServ: TalentService,
    private _share: ShareService,
    private _fb: UntypedFormBuilder,
    private _excelService: ExcelService,
    private _storage: GetSetStorageService,
  ) {}
  employeeCtrl = new UntypedFormControl();
  employees: any[] = [];
  public userData: any = {};
  public isWmgUser: boolean = false;
  public isRightsViewIJP: boolean = false;
  public logginUserEmpId: string = this._storage.getUserEmpId();
  // Add property
filteredEmployees$: Observable<any[]>;
selectedEmployeeId: string = '';
  ngOnInit() {
    this.userData = this._storage.getSetUserData();
    this.selectedEmployeeId = this.logginUserEmpId;
  if (this.userData?.otherRoles?.IsWMG == 'Y') {
    debugger
    this.isWmgUser = true;
    this.isRightsViewIJP = true;
    this.setDefaultEmployee(); // Set default employee on load for WMG users
  }
  
  // Setup filtered employees observable
  this.filteredEmployees$ = this.employeeCtrl.valueChanges.pipe(
    startWith(''),
    debounceTime(500),
    distinctUntilChanged(),
    filter((v) => typeof v === 'string' && v.length >= 4),
    switchMap((value) =>
      this._talentServ.SearchEmployeeByEmpId({
        search: value,
        pageSize: 20,
      })
    ),
    map((res) => res.data || [])
  );

    this.loadApplicationStats();
    this.filterFormInit();
  }

  /**
 * Set default employee (logged-in user) at load time
 */
setDefaultEmployee(): void {
  if (this.logginUserEmpId) {
    // Search for logged-in user details
    this._talentServ.SearchEmployeeByEmpId({
      search: this.logginUserEmpId,
      pageSize: 1,
    }).subscribe((res) => {
      if (res.data && res.data.length > 0) {
        const currentUser = res.data[0];
        // Patch the form control with user object
        this.employeeCtrl.patchValue(currentUser, { emitEvent: false });
        
        // Optionally, load applications for this user automatically
        // this.loadApplicationHistoryForEmployee(currentUser.empNewId);
      }
    }, (err) => {
      console.error('Error loading default employee:', err);
    });
  }
}

  /**
 * Display function for autocomplete
 */
displayEmployee(employee: any): string {
  return employee ? `${employee.fullName} (${employee.empNewId})` : '';
}

/**
 * Handle employee selection
 */
onEmployeeSelected(event: any): void {
  const selectedEmployee = event.option.value;
  if (selectedEmployee) {
    this.selectedEmployeeId = selectedEmployee.empNewId;
     this.refreshData();
    // Reload data with selected employee filter
    //this.loadApplicationHistoryForEmployee(selectedEmployee.empNewId);
  }
}

/**
 * Clear employee selection
 */
clearEmployee(): void {
  this.employeeCtrl.setValue('');
  this.selectedEmployeeId = '';
  // Reload original data
  //this.refreshData();
}

  ngAfterViewInit() {
    this.loadApplicationHistory(
      1,
      CONSTANTS.PAGE_SIZE,
      null,
      null,
      this.viewType,
    );
  }

  /**
   * Load application statistics
   */
  loadApplicationStats() {
    let body: any = {};

    // Add viewType to the request body
    if (this.viewType) {
      body['SourceType'] = this.viewType;
    }
    if (this.selectedEmployeeId) {
      body['SelectedEmpId'] = this.selectedEmployeeId;
    }
    this._talentServ.getMyApplicationStats(body).subscribe(
      (res) => {
        if (res && res['data'] && res['data'].length > 0) {
          const stats = res['data'][0];
          // this.applicationStats = {
          //   total: stats.TotalApplications || 0,
          //   pending: stats.PendingReview || 0,
          //   rejected: stats.Rejected || 0,
          //   shortlisted: stats.Shortlisted || 0,
          //   interview: stats.Interview || 0,
          //   selected: stats.Selected || 0
          // };
          this.applicationStats = {
            total: stats.applied || 0,
            interview: stats.ClientInterview || 0,
            proposed: stats.Proposed || 0,
            rejected: stats.Rejected || 0,
            selected: stats.Selected || 0,
            pending: stats.ProposalPending || 0,
            trainDeploy: stats.TrainDeploy || 0,
            wmgPending: stats.PendingWMGApproval || 0,
          };
        }
      },
      (err) => {
        console.error('Error loading application stats:', err);
      },
    );
  }

  /**
   * Load application history with pagination, search, and filters
   */
  loadApplicationHistory(
    page: number,
    pageSize: number,
    search: any,
    sortParam: any,
    viewType?: string,
  ) {
    let body: any = {
      page: page,
      pageSize: pageSize,
    };

    // Add viewType to the request body
    if (viewType) {
      body['SourceType'] = viewType;
    }
     if (this.selectedEmployeeId) {
      body['SelectedEmpId'] = this.selectedEmployeeId;
    }

    if (search) {
      body['search'] = search;
    }
    if (sortParam?.grade) {
      let Ids = sortParam?.grade.filter((n) => n);
      body['GradeIDs'] = Ids.toString();
    }

    if (
      sortParam?.DashBaordStatusFilter ||
      sortParam?.DashBaordStatusFilter == 0
    ) {
      body['StatusId'] = sortParam?.DashBaordStatusFilter;
    }
    if (sortParam?.ijpStatus && sortParam?.ijpStatus.length !== 0) {
      let Ids = sortParam?.ijpStatus.filter((n) => n);
      body['StatusId'] = Ids.toString();
    }

    if (sortParam?.accountType && sortParam?.accountType.length !== 0) {
      let Ids = sortParam?.accountType.filter((n) => n);
      body['AccountIDs'] = Ids.toString();
    }

    if (sortParam?.location && sortParam?.location.length !== 0) {
      let Ids = sortParam?.location.filter((n) => n);
      body['LocationIDs'] = Ids.toString();
    }

    // Store body parameters for export
    this.bodyParam = body;

    this._talentServ.getMyApplicationHistory(body).subscribe(
      (res) => {
        this.applicationHistoryList = res['data'] || [];
        if (res['DashBoardCount'] && res['DashBoardCount'].length > 0) {
          const stats = res['DashBoardCount'][0];
          this.applicationStats = {
            total: stats.TotalApplied || 0,
            proposed: stats.TotalProposed || 0,
            interview: stats.TotalClientInterview || 0,
            selected: stats.TotalSelected || 0,
            rejected: stats.TotalRejected || 0,
            wmgPending: stats.TotalPendingWithWMG || 0,
            trainDeploy: stats.TotalTrainAndDeploy || 0,
          };
        }
        this.paginationData = res['pagination'] ? res['pagination'][0] : null;
      },
      (err) => {
        console.error('Error loading application history:', err);
      },
    );
  }

  /**
   * Search functionality
   */
  getSearchValueKey(e: any) {
    this.isResetFilter = true;
    this.isResetSearch = false;
    this.sortParam = {};
    this.searchInput = e;
    if (this.paginatorCompRef) {
      this.paginatorCompRef.paginator.pageIndex = 0;
    }
    let pageSizeSelected: number =
      this.paginatorCompRef?.paginator?.pageSize || CONSTANTS.PAGE_SIZE;
    this.loadApplicationHistory(
      1,
      pageSizeSelected,
      e,
      this.sortParam,
      this.viewType,
    );
  }

  /**
   * Filter/Sort functionality
   */
  getSortData(data: any) {
    this.isResetSearch = true;
    this.isResetFilter = false;
    this.searchInput = '';
    this.sortParam = data;
    // Reset selected tile label when filter is applied
    this.selectedTileLabel = '';
    if (this.paginatorCompRef) {
      this.paginatorCompRef.paginator.pageIndex = 0;
    }
    let pageSizeSelected: number =
      this.paginatorCompRef?.paginator?.pageSize || CONSTANTS.PAGE_SIZE;
    this.loadApplicationHistory(
      1,
      pageSizeSelected,
      this.searchInput,
      data,
      this.viewType,
    );
  }

  /**
   * Pagination method
   */
  getPagingData(pageEvent: any) {
    this.loadApplicationHistory(
      pageEvent.pageIndex + 1,
      pageEvent.pageSize,
      this.searchInput ? this.searchInput : null,
      this.sortParam,
      this.viewType,
    );
  }

  /**
   * View application details
   */
  viewApplicationDetails(element: any) {
    element['selectedEmployeeId'] = this?.isWmgUser ? this.selectedEmployeeId : this.userData?.EmpNewId; // Pass selected employee ID to the modal
    const dialogRef = this.dialog.open(MyApplicationDetailsModalComponent, {
      panelClass: ['ats-model-wrap', 'ats-ijp-model-my-application'],
      data: element,
      maxWidth: '100vw',
      maxHeight: '100vh',
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        // Refresh data if needed
        this.refreshData();
      }
    });
  }

  /**view ijp history modal */
  viewFeedbackHistory(elm: any) {
    elm['title'] = '';
    const dialogRef = this.dialog.open(MyApplicationHistoryModalComponent, {
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

  /**
   * Refresh data
   */
  refreshData() {
    // Reset selected tile label on refresh
    this.selectedTileLabel = '';
    this.loadApplicationStats();
    let pageSizeSelected: number =
      this.paginatorCompRef?.paginator?.pageSize || CONSTANTS.PAGE_SIZE;
    this.loadApplicationHistory(
      1,
      pageSizeSelected,
      this.searchInput,
      this.sortParam,
      this.viewType,
    );
  }

  /**
   * Handle stat card click to filter applications
   * @param filterType - Type of filter: 'total', 'rejected', 'shortlisted', 'interview', 'selected'
   */
  public selectedTileLabel: string = '';
  onStatCardClick(filterType: any) {
    // Reset search and pagination
    this.isResetSearch = true;
    this.isResetFilter = false;
    this.searchInput = '';
    this.selectedTileLabel = '';

    // Reset ijpStatus filter in the form when stat card is clicked
    if (this.sortFormFilter) {
      this.sortFormFilter.patchValue({
        ijpStatus: null,
      });
    }

    if (this.paginatorCompRef) {
      this.paginatorCompRef.paginator.pageIndex = 0;
    }

    // Map filter types to status filter values
    let dashboardStatusFilter = null;
    switch (filterType) {
      case 11:
        dashboardStatusFilter = 11; // All applications
        this.selectedTileLabel = '( Due Proposals )';
        break;
      case 1:
        dashboardStatusFilter = 1; // Proposed
        this.selectedTileLabel = '( Proposed )';
        break;
      case 3:
        dashboardStatusFilter = 3; // Interview Stage
        this.selectedTileLabel = '( Client Interview Stage )';
        break;
      case 2:
        dashboardStatusFilter = 2; // Selected
        this.selectedTileLabel = '( Selected )';
        break;
      case 5:
        dashboardStatusFilter = 5; // Pending with WMG
        this.selectedTileLabel = '( Pending with WMG Approval )';
        break;
      case 4:
        dashboardStatusFilter = 4; // Train & Deploy
        this.selectedTileLabel = '( Train & Deploy )';
        break;
      case 0:
        dashboardStatusFilter = 0; // Train & Deploy
        this.selectedTileLabel = '( Rejected )';
        break;
      default:
        dashboardStatusFilter = null;
        this.selectedTileLabel = '';
    }

    // Update sort param with dashboard filter and remove status-related filters
    const { status, ijpStatus, ...otherFilters } = this.sortParam;
    this.sortParam = {
      ...otherFilters,
      DashBaordStatusFilter: dashboardStatusFilter,
    };

    let pageSizeSelected: number =
      this.paginatorCompRef?.paginator?.pageSize || CONSTANTS.PAGE_SIZE;
    this.loadApplicationHistory(
      1,
      pageSizeSelected,
      null,
      this.sortParam,
      this.viewType,
    );
  }
  /**
   * Filter form Init
   */
  filterFormInit() {
    this.sortFormFilter = this._fb.group({
      accountType: [[]],
      location: [[]],
      // primarySkill: [[]],
      grade: [[]],
      ijpStatus: [null],
      practiceId: [[]],
    });
  }

  public dtData: any = '';
  public title: string = '';
  public viewType: string = 'ALL'; // Default to All view

  openPop(data: any, title: string): void {
    if (data) {
      this.title = title;
      this.dtData = data;
    }
  }

  /**
   * Handle view type change (IJP/Proposals)
   */
  onViewTypeChange(viewType: string): void {
    this.viewType = viewType;
    // Reset filters and refresh data based on view type
    this.isResetSearch = true;
    this.isResetFilter = true;
    this.searchInput = '';
    this.sortParam = {};
    this.selectedTileLabel = '';

    if (this.paginatorCompRef) {
      this.paginatorCompRef.paginator.pageIndex = 0;
    }

    let pageSizeSelected: number =
      this.paginatorCompRef?.paginator?.pageSize || CONSTANTS.PAGE_SIZE;

    this.loadApplicationStats();
    // Reload data with the new view type
    this.loadApplicationHistory(1, pageSizeSelected, null, null, this.viewType);
  }

  /**
   * Export excel with all data
   */
  exportAsXLSX(): void {
    let bodyData = {
      ...this.bodyParam,
      page: 1,
      pageSize: this.paginationData?.Total || 1000,
    };

    this._talentServ.getMyApplicationHistory(bodyData).subscribe(
      (res) => {
        let applicationList = res['data'];
        let filterDataExcel = [];

        // Define mapping for display names
        const displayNameMap = {
          TalentId: 'Requisition ID',
          ijpName: 'Job Summary',
          IJPdesignation: 'Designation (Role)',
          accountName: 'Account',
          GradeName: 'Grade',
          PrimaryskillName: 'Primary Skill',
          locationName: 'Location',
          AppliedOn: 'Applied Date',
          statusName: 'Application Status',
          RejectReason: 'Rejection Reason',
          RejectionRemarks: 'Rejection Remarks',
          WMGStatus: 'WMG Status',
        };

        // Columns to export (matching displayed columns)
        const columnsToExport = [
          'TalentId',
          'ijpName',
          'IJPdesignation',
          'accountName',
          'GradeName',
          'PrimaryskillName',
          'locationName',
          'AppliedOn',
          'statusName',
        ];

        for (let key in applicationList) {
          let selectedData = {};

          columnsToExport.forEach((col) => {
            const displayName = displayNameMap[col] || col;

            // Format date columns
            if (col === 'AppliedOn' && applicationList[key][col]) {
              selectedData[displayName] = GlobalMethod.formatDate(
                applicationList[key][col],
              );
            } else {
              selectedData[displayName] = applicationList[key][col] || '-';
            }
          });

          // Add rejection details if rejected
          if (applicationList[key]['RejectReason']) {
            selectedData['Rejection Reason'] =
              applicationList[key]['RejectReason'] || '-';
          }
          if (applicationList[key]['RejectionRemarks']) {
            selectedData['Rejection Remarks'] =
              applicationList[key]['RejectionRemarks'] || '-';
          }

          filterDataExcel.push(selectedData);
        }

        this._excelService.exportAsExcelFile(
          filterDataExcel,
          (this.isWmgUser ? 'Applications-List' : 'My-Applications-List'),
        );
      },
      (err) => {
        console.error('Error exporting data:', err);
        this._share.showAlertErrorMessage.next('Failed to export data');
      },
    );
  }
}
