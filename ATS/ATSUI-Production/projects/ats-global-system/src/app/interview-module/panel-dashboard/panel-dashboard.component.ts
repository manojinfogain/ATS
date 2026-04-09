import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { InterviewStatusService } from 'projects/ats-global-system/src/app/core/services/interview-status.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { ExcelService } from 'projects/ats-global-system/src/app/core/common/excel.service';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { Subscription } from 'rxjs';
import { FeedbackRoundDetailsComponent } from '../interview-feedback/modals/feedback-round-details/feedback-round-details.component';
import { el } from '@fullcalendar/core/internal-common';

@Component({
  selector: 'app-panel-dashboard',
  templateUrl: './panel-dashboard.component.html',
  styleUrls: ['./panel-dashboard.component.scss']
})
export class PanelDashboardComponent implements OnInit, OnDestroy {
  public isAdmin: boolean = false;
  public panelList: any[] = [];
  public selectedPanel: string[] = [];
  public userData: any = {};
  public panelSearchCtrl: UntypedFormControl = new UntypedFormControl('');
  public panelListFiltered: any[] = [];
  public dashboardStats: any = {
    scheduled: 0,
    feedbackPending: 0,
    cancelled: 0,
    shortlisted: 0,
    rejected: 0,
    total: 0
  };
  
 
  public interviewList: any = [];
  public filteredList: any = [];
  public selectedFilter: string = 'all';
  public searchInput: string = '';
  public paginationData: any = {
    Page: 1,
    PageSize: 10,
    Total: 0
  };
  public currentPage: number = 1;
  public pageSize: number = 10;
  public pageSizeOptions: number[] = [5, 10, 25, 50, 100];
  private refreshSubscription: Subscription;
  
  public roundFilter: UntypedFormControl = new UntypedFormControl('all');
  public statusFilter: UntypedFormControl = new UntypedFormControl('all');
  
  // Filter form for app-filter-sort component
  public sortFormFilter: UntypedFormGroup;
  public isResetFilter: boolean = false;
  
  // Store current filters to apply to count API
  private currentFilters: any = {};
  private statusFilterValue: string = ''; // Store status filter separately
  
  public displayedColumns: string[] = [
    'talentId',
    'candidateName',
    'email', 
    'primarySkill',
    'GroupAccount',
    'round',
    'interviewDate',
    'primaryInterviewer',
    'status',
    'actions'
  ];
  
  constructor(
    private _interviewStatus: InterviewStatusService,
    private _share: ShareService,
    private _storage: GetSetStorageService,
    private _excelService: ExcelService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.userData = this._storage.getSetUserData();
    this.selectedPanel = this.userData?.EmpNewId ? [this.userData.EmpNewId] : [];
    this.initFilterForm();

    if (this.userData.RoleId === 5) {
      this.isAdmin = true;
    }

    if (this.isAdmin) {
      this.fetchPanelList();
      this.updateDisplayedColumns();
      this.loadDashboardData();
      this.panelSearchCtrl.valueChanges
        .pipe(startWith(''))
        .subscribe(search => {
          this.filterPanelList(search);
        });
    } else {
      this.selectedPanel = this.userData?.EmpNewId ? [this.userData.EmpNewId] : [];
      this.updateDisplayedColumns();
      this.loadDashboardData();
    }

    // Subscribe to location changes
    this.refreshSubscription = this._share.detectSwitchLoc.subscribe(
      () => {
        this.loadDashboardData();
      }
    );
  }

  getInterviewDetailsTitle(): string {
    if (!this.isAdmin || (this.selectedPanel.length === 1 && this.selectedPanel[0] === this.userData?.EmpNewId)) {
      return 'My Interview Details';
    }
    if (this.selectedPanel.length === 0) {
      return 'Interview Details';
    }
    if (this.selectedPanel.length === 1) {
      const panel = this.panelListFiltered?.find(p => p.empnewid === this.selectedPanel[0]);
      return (panel?.fullName || 'Panel') + ' Interview Details';
    }
    return `Interview Details (${this.selectedPanel.length} Panels Selected)`;
  }

  /**
   * Get formatted display text for multi-select panel dropdown
   */
  getSelectedPanelsDisplay(): string {
    if (!this.selectedPanel || this.selectedPanel.length === 0) {
      return 'Select Panels';
    }
    if (this.selectedPanel.length === 1) {
      const panel = this.panelList?.find(p => p.empnewid === this.selectedPanel[0]);
      return panel?.fullName || this.selectedPanel[0];
    }
    const firstPanel = this.panelList?.find(p => p.empnewid === this.selectedPanel[0]);
    const firstName = firstPanel?.fullName || this.selectedPanel[0];
    const othersCount = this.selectedPanel.length - 1;
    return `${firstName} and ${othersCount} other${othersCount > 1 ? 's' : ''}`;
  }
  /**
   * Fetch all panels for admin dropdown
   */
  fetchPanelList(): void {
    this._interviewStatus.GetPanelMembersByInterviewDetails().subscribe(
      (res: any) => {
        if (res && res.data) {
          this.panelList = res.data ? [...res.data] : [];
          // Ensure current user is in the list for 'Me' selection
          const selfId = this.userData?.EmpNewId;
          if (selfId && !this.panelList.some(p => p.empnewid === selfId)) {
            this.panelList.unshift({
              empnewid: selfId,
              fullName: this.userData?.fullName || 'Me'
            });
          }
          this.panelListFiltered = [...this.panelList];
          this.sortPanelsBySelection();
        }
      },
      err => {
        this._share.showAlertErrorMessage.next('Failed to load panel list');
      }
    );
  }

  filterPanelList(search: string): void {
    if (!search) {
      this.panelListFiltered = this.panelList;
    } else {
      const searchLower = search.toLowerCase();
      
      // Filter panels that match the search
      const matchedPanels = this.panelList.filter(panel =>
        (panel.fullName && panel.fullName.toLowerCase().includes(searchLower)) ||
        (panel.empnewid && panel.empnewid.toLowerCase().includes(searchLower))
      );
      
      // Always include selected panels in the filtered list, even if they don't match search
      const selectedPanels = this.panelList.filter(panel => 
        this.selectedPanel.includes(panel.empnewid) && 
        !matchedPanels.some(m => m.empnewid === panel.empnewid)
      );
      
      // Combine selected panels with matched panels
      this.panelListFiltered = [...selectedPanels, ...matchedPanels];
    }
    this.sortPanelsBySelection();
  }

  /**
   * Check if Primary Interviewer column should be shown
   */
  shouldShowPrimaryInterviewer(): boolean {
    if (!this.isAdmin) {
      return false;
    }
    
    // Show if multiple panels selected OR if single panel selected that is not the current user
    if (this.selectedPanel.length > 1) {
      return true;
    }
    
    if (this.selectedPanel.length === 1 && this.selectedPanel[0] !== this.userData?.EmpNewId) {
      return true;
    }
    
    return false;
  }

  /**
   * Update displayed columns based on admin/panel selection
   */
  updateDisplayedColumns(): void {
    const baseColumns = [
      'talentId',
      'candidateName',
      'email', 
      'GroupAccount',
      'round',
      'interviewDate'
    ];
    
    if (this.shouldShowPrimaryInterviewer()) {
      this.displayedColumns = [...baseColumns, 'primaryInterviewer', 'status', 'actions'];
    } else {
      this.displayedColumns = [...baseColumns, 'status', 'actions'];
    }
  }

  /**
   * Handle panel selection change (admin only)
   */
  onPanelChange(panelEmpIds: string[]): void {
    this.selectedPanel = panelEmpIds || [];
    this.sortPanelsBySelection();
    this.updateDisplayedColumns();
    this.loadDashboardData();
  }

  /**
   * Sort panel list to keep selected panels at the top
   */
  sortPanelsBySelection(): void {
    if (!this.panelListFiltered || this.panelListFiltered.length === 0) {
      return;
    }
    this.panelListFiltered.sort((a, b) => {
      const aSelected = this.selectedPanel.includes(a.empnewid);
      const bSelected = this.selectedPanel.includes(b.empnewid);
      
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      return 0; // Keep original order for items in same category
    });
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  /**
   * Initialize filter form
   */
  initFilterForm(): void {
    this.sortFormFilter = new UntypedFormGroup({
      //candidateStatusNew: new FormControl([]),
      interviewTypeIdNew: new UntypedFormControl([]),
      dateFrom: new UntypedFormControl(null),
      dateTo: new UntypedFormControl({ value: null, disabled: true }),
      accountType: new UntypedFormControl([[]])
    });
  }

  /**
   * Get filter/sort data from app-filter-sort component
   */
  getSortData(filterData: any): void {
    if (!filterData) {
      return;
    }

    // Reset to first page when applying filters
    this.currentPage = 1;

    // Build filter object matching API format
    const filterObj: any = {};

    // Extract filter values - map to API property names
    if (filterData.candidateStatusNew && filterData.candidateStatusNew.length > 0) {
      const statusIds = filterData.candidateStatusNew.filter((n: any) => n);
      filterObj.IntStatus = statusIds.toString();
    }
    
    if (filterData.interviewTypeIdNew && filterData.interviewTypeIdNew.length > 0) {
      const typeIds = filterData.interviewTypeIdNew.filter((n: any) => n);
      filterObj.IntType = typeIds.toString();
    }

    // Handle date range - map to API property names
    if (filterData.dateFrom) {
      filterObj.StartDate = GlobalMethod.formatDate(filterData.dateFrom);
    }

    if (filterData.dateTo) {
      filterObj.EndDate = GlobalMethod.formatDate(filterData.dateTo);
    }

    if (filterData?.accountType && filterData.accountType.length !== 0) {
      let Ids = filterData.accountType.filter(n => n);
      filterObj['AccountIDs'] = Ids.toString();
    }
    
    // Store current filters (excluding selectedPanel and status)
    this.currentFilters = { ...filterObj };
    
    // Preserve status filter if it exists
    if (this.statusFilterValue) {
      this.currentFilters.IntStatus = this.statusFilterValue;
    }
    
    // Reload dashboard data with combined filters
    this.loadDashboardData();
  }

  /**
   * Load interview list with filters object
   */
  loadInterviewListWithFilters(filters: any): void {
    const filterData: any = {
      page: this.currentPage,
      pageSize: this.pageSize,
      search: this.searchInput || '',
      selectedPanel: this.selectedPanel.join(','),
      ...this.currentFilters,
      ...filters
    };

    this._interviewStatus.getInterviewListRoundwise(filterData).subscribe(
      res => {
        if (res && res['data']) {
          this.interviewList = res['data'];
          this.filteredList = [...this.interviewList];
        }
        
        // Extract pagination data
        if (res && res['Pagination'] && res['Pagination'].length > 0) {
          this.paginationData = res['Pagination'][0];
          this.currentPage = this.paginationData.Page;
          this.pageSize = this.paginationData.PageSize;
        }
      },
      err => {
        this._share.showAlertErrorMessage.next('Failed to load interview list');
      }
    );
  }

  /**
   * Load panel dashboard data
   */
  loadDashboardData(): void {
    debugger
    // Use selectedPanel for admin, else self
    
    // Build filter params for count API (exclude search)
    const countFilters: any = {
      selectedPanel: this.selectedPanel.join(','),
      search: '', // Always empty for count API as per requirement
      ...this.currentFilters
    };
    
    // Load counts with filters
    this._interviewStatus.getPanelDashboardData(countFilters).subscribe(
      res => {
        if (res && res['Counts'] && res['Counts'].length > 0) {
          // Extract counts from first result set
          const counts = res['Counts'][0];
          this.dashboardStats.total = counts.TotalInterviews || 0;
          this.dashboardStats.scheduled = counts.ScheduledInterviews || 0;
          this.dashboardStats.feedbackPending = counts.PendingFeedback || 0;
          this.dashboardStats.shortlisted = counts.ShortlistedInterviews || 0;
          this.dashboardStats.rejected = counts.RejectedInterviews || 0;
          this.dashboardStats.cancelled = counts.CancelledInterviews || 0;
        }
      },
      err => {
        this._share.showAlertErrorMessage.next('Failed to load dashboard counts');
      }
    );

    // Load interview list roundwise
    let filterObj: any = {
      pageSize: this.pageSize,
      page: this.currentPage,
      selectedPanel: this.selectedPanel.join(',') // Pass selected panel's EmpNewIds as comma-separated for filtering
    };
    this.loadInterviewListWithFilters(filterObj);
  }

  /**
   * Load interview list with optional filters
   */
  loadInterviewList(statusFilter?: string, roundFilter?: string, page?: number, pageSize?: number): void {
    const currentPage = page || this.currentPage;
    const currentPageSize = pageSize || this.pageSize;

    // Build filter object
    const filterData: any = {
      page: currentPage,
      pageSize: currentPageSize,
      search: this.searchInput || ''
    };

    // Add optional filters if provided
    if (statusFilter) {
      filterData.status = statusFilter;
    }
    if (roundFilter) {
      filterData.round = roundFilter;
    }

    this._interviewStatus.getInterviewListRoundwise(filterData).subscribe(
      res => {
        if (res && res['data']) {
          this.interviewList = res['data'];
          this.filteredList = [...this.interviewList];
        }
        
        // Extract pagination data
        if (res && res['Pagination'] && res['Pagination'].length > 0) {
          this.paginationData = res['Pagination'][0];
          this.currentPage = this.paginationData.Page;
          this.pageSize = this.paginationData.PageSize;
        }
      },
      err => {
        this._share.showAlertErrorMessage.next('Failed to load interview list');
      }
    );
  }

  /**
   * Calculate dashboard statistics (not needed anymore as we get from API)
   */
  calculateStats(): void {
    // Stats are now calculated from API response
    // Keeping this method for backward compatibility
  }

  /**
   * Filter interviews by status
   */
  filterByStatus(status: string): void {
    this.selectedFilter = status;
    
    // Store status filter value
    if (status === 'scheduled') {
      this.statusFilterValue = '1,3';
    } else if (status === 'shortlisted') {
      this.statusFilterValue = '7,4,10';
    } else if (status === 'rejected') {
      this.statusFilterValue = '5';
    } else if (status === 'cancelled') {
      this.statusFilterValue = '2';
    } else {
      this.statusFilterValue = ''; // 'all' case
    }
    
    // Update currentFilters with status
    if (this.statusFilterValue) {
      this.currentFilters.IntStatus = this.statusFilterValue;
    } else {
      delete this.currentFilters.IntStatus;
    }
    
    // Reset to first page and reload with combined filters
    this.currentPage = 1;
    this.loadDashboardData();
  }

  /**
   * Search interviews - now done server-side
   */
  searchInterviews(searchValue?: string): void {
    // Update search input
    if (searchValue !== undefined) {
      this.searchInput = searchValue;
    }
    
    // Reset to first page when searching
    this.currentPage = 1;
    
    // Clear all filters when searching
    this.currentFilters = {};
    this.statusFilterValue = '';
    this.selectedFilter = 'all';
    this.isResetFilter = true;
    
    // Reset the sort form
    this.sortFormFilter.reset({
      interviewTypeIdNew: [],
      dateFrom: null,
      dateTo: null,
      accountType: []
    });
    
    setTimeout(() => {
      this.isResetFilter = false;
    }, 100);
    
    // Load data with search term only
    this.loadDashboardData();
  }

  /**
   * Apply filters
   */
  applyFilters(): void {
    const statusValue = this.statusFilter.value !== 'all' ? this.statusFilter.value : undefined;
    const roundValue = this.roundFilter.value !== 'all' ? this.roundFilter.value : undefined;
    
    // Reset to first page when applying filters
    this.currentPage = 1;
    
    // Load filtered data from API
    this.loadInterviewList(statusValue, roundValue, 1, this.pageSize);
  }

  /**
   * Reset filters
   */
  resetFilters(): void {
    this.roundFilter.setValue('all');
    this.statusFilter.setValue('all');
    this.searchInput = '';
    this.selectedFilter = 'all';
    this.currentPage = 1;
    this.currentFilters = {};
    this.statusFilterValue = '';
    this.isResetFilter = true;
    
    // Reset the sort form
    this.sortFormFilter.reset({
      interviewTypeIdNew: [],
      dateFrom: null,
      dateTo: null,
      accountType: []
    });
    
    setTimeout(() => {
      this.isResetFilter = false;
    }, 100);
    
    this.loadDashboardData();
  }

  /**
   * View feedback details
   */
  viewFeedback(element: any): void {
    debugger
    element['isPanelView'] = true;
    element['RoundId'] = element?.RoundID;
    const dialogRef = this.dialog.open(FeedbackRoundDetailsComponent, {
    //  width: '800px',
      panelClass: ['ats-model-wrap', 'ats-model-feedback',,'ats-model-full-screen'],
      data: element,
      disableClose: true,
        maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadDashboardData();
      }
    });
  }

  /**
   * Get status label (not needed as we get StatusName from API)
   */
  getStatusLabel(statusId: number): string {
    const statusMap: any = {
      1: 'Scheduled',
      2: 'Cancelled',
      3: 'Feedback Pending',
      4: 'Selected',
      5: 'Rejected',
      7: 'Shortlisted'
    };
    return statusMap[statusId] || 'Unknown';
  }

  /**
   * Get status class for styling
   */
  getStatusClass(statusId: number): string {
    const statusClassMap: any = {
      1: 'status-scheduled',
      2: 'status-cancelled',
      3: 'status-pending',
      4: 'status-shortlisted',
      5: 'status-rejected',
      7: 'status-shortlisted'
    };
    return statusClassMap[statusId] || '';
  }

  /**
   * Handle page change
   */
  onPageChange(event: any): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    
    const statusValue = this.statusFilter.value !== 'all' ? this.statusFilter.value : undefined;
    const roundValue = this.roundFilter.value !== 'all' ? this.roundFilter.value : undefined;
    
    this.loadInterviewList(statusValue, roundValue, this.currentPage, this.pageSize);
  }

  /**
   * Get total pages
   */
  getTotalPages(): number {
    return Math.ceil(this.paginationData.Total / this.pageSize);
  }

  /**
   * Export data to Excel
   */
/**
 * Export all filtered data to Excel
 */
exportAsXLSX(): void {
  // Build filter object with all current filters
  const filterData: any = {
    page: 1,
    pageSize: 999999, // Large number to get all records
    search: this.searchInput || '',
    selectedPanel: this.selectedPanel.join(','),
    ...this.currentFilters
  };

  // Show loading indicator
 //this._share.showAlertLoadingMessage.next('Preparing export...');

  // Fetch all data with filters
  this._interviewStatus.getInterviewListRoundwise(filterData).subscribe(
    res => {
      if (res && res['data'] && res['data'].length > 0) {
        const allData = res['data'];

        // Prepare data for export with all columns
        const exportData = allData.map((item: any) => {
          const exportRow: any = {
            'Talent ID': item.talent_id || '',
            'Candidate Name': item.Name || '',
            'Email': item.email || '',
            'Primary Skill': item.primarySkill || item.PrimarySkill || '',
            'Group Account': item.GroupAccountName || item.GroupAccount || '',
            'Round': item.interviewType || '',
            'Interview Date': item.interviewDate || ''
          };

          // Add Primary Interviewer column if visible in UI
          if (this.shouldShowPrimaryInterviewer()) {
            exportRow['Primary Interviewer'] = item.primaryInterviewer || item.PrimaryInterviewer || '';
          }

          exportRow['Status'] = item.StatusName || '';

          return exportRow;
        });

        // Generate filename with context
        const filename = this.generateExportFilename();

        // Export to Excel
        this._excelService.exportAsExcelFile(exportData, filename);
        
        // Show success message
        this._share.showAlertSuccessMessage.next(`Successfully exported ${exportData.length} record(s)`);
      } else {
        this._share.showAlertErrorMessage.next('No data to export');
      }
    },
    err => {
      this._share.showAlertErrorMessage.next('Failed to fetch data for export');
      console.error('Export error:', err);
    }
  );
}

/**
 * Generate dynamic filename for export based on filters
 */
private generateExportFilename(): string {
  const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  return `Panel_Interview_Dashboard_${date}`;
}

}
