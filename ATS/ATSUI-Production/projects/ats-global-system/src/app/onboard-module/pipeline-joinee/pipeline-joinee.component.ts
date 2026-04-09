import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CONSTANTS } from 'projects/ats-global-system/src/app/core/constant/constants';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { OnboardService } from '../onboard.service';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { SelectionModel } from '@angular/cdk/collections';
import { UpdateCandidateJoiningStatusComponent } from '../modals/update-candidate-joining-status/update-candidate-joining-status.component';
import { AddEmpEmailDomainComponent } from '../modals/add-emp-email-domain/add-emp-email-domain.component';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { ConfirmationDialogComponent } from 'projects/ats-global-system/src/app/shared/shared-app/components/confirmation-dialog/confirmation-dialog.component';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { ViewAllCandidateDetailsOnboardComponent } from '../modals/view-all-candidate-details-onboard/view-all-candidate-details-onboard.component';
import { UpdateDay1PiplineStatusComponent } from '../modals/update-day1-pipline-status/update-day1-pipline-status.component';
import { MailerDayStatusModalComponent } from '../modals/mailer-day-status-modal/mailer-day-status-modal.component';
import { ManualPipelineMailModalComponent } from '../modals/manual-pipeline-mail-modal/manual-pipeline-mail-modal.component';
import { ATSCONFIG } from 'projects/ats-global-system/src/config';

@Component({
  selector: 'app-pipeline-joinee',
  templateUrl: './pipeline-joinee.component.html',
  styleUrls: ['./pipeline-joinee.component.scss'],
  providers: [DatePipe],
})
export class PipelineJoineeComponent implements OnInit, AfterViewInit {
  displayedColumns = [];
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
  ) {}
  public specialLogin: boolean = false;
  public topFirstDateStart: string;
  public topFirstDateEnd: string;
  public showManualPipelineButton: boolean = false;
  
  ngOnInit() {
    this.userData = this._storage.getSetUserData();
    if (this.userData) {
      if (this.userData.RoleId === 7) {
        this.displayedColumns = [
          'talentId',
          'Cid',
          'CandidateName',
          'EmailID',
          'joiningLoc',
          'doj',
          'cDoj',
          'isEmpCreated',
          'emailIdOrg',
          'domainId',
          'dormantStatus',
          'offerStatus',
          'action',
        ];
      } else if (this.userData.RoleId === 1 || this.userData?.otherRoles?.IsHRAccess == 'Y') {
        this.displayedColumns = [
          'talentId',
          'Cid',
          'CandidateName',
          'EmailID',
          'joiningLoc',
          'PhoneNo',
          'doj',
          'cDoj',
          'offerNum',
          'isEmpCreated',
          'emailIdOrg',
          'domainId',
          'dormantStatus',
          'offerStatus',
        ];
      } else {
        this.displayedColumns = [
          'talentId',
          'Cid',
          'CandidateName',
          'EmailID',
          'joiningLoc',
          'PhoneNo',
          'doj',
          'cDoj',
          'offerNum',
          'isEmpCreated',
          'emailIdOrg',
          'domainId',
          'dormantStatus',
          'primaryrecruiter',
          'offerStatus',
          'action',
        ];
      }
    }
    const today = new Date();
    let tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 3);
    this.topFirstDateStart = GlobalMethod.convertToUTCDateTime(
      GlobalMethod.formatDate(tomorrow) + ' ' + '00:00:00'
    );
    this.topFirstDateEnd = GlobalMethod.convertToUTCDateTime(
      GlobalMethod.formatDate(tomorrow) + ' ' + '23:59:00'
    );
    this.filterFormInit();
    this.checkManualPipelineButtonVisibility();
    // this.viewAllDetailsOnboard(null)
  }

  /**
   * Check if Manual Pipeline Mail button should be visible
   * Based on configuration in config.ts
   * Uses IST timezone
   */
  checkManualPipelineButtonVisibility(): void {
    const now = new Date();
    
    // Convert to IST (UTC+5:30)
    const istOffset = 5.5 * 60; // IST offset in minutes
    const localOffset = now.getTimezoneOffset(); // Local offset from UTC in minutes
    const istTime = new Date(now.getTime() + (istOffset + localOffset) * 60 * 1000);
    
    const dayOfWeek = istTime.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
    const hours = istTime.getHours();
    const minutes = istTime.getMinutes();
    const currentTimeInMinutes = hours * 60 + minutes;
    
    // Get schedule from config
    const scheduleConfig = ATSCONFIG.MANUAL_PIPELINE_MAIL_BUTTON.schedule;
    
    // Check each schedule rule
    let isVisible = false;
    for (const rule of scheduleConfig) {
      // Check if current day matches any configured day
      if (rule.days.includes(dayOfWeek)) {
        const startTimeInMinutes = rule.startTime.hours * 60 + rule.startTime.minutes;
        const endTimeInMinutes = rule.endTime.hours * 60 + rule.endTime.minutes;
        
        // Check if current time is within the configured range
        if (currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes <= endTimeInMinutes) {
          isVisible = true;
          break;
        }
      }
    }
    
    this.showManualPipelineButton = isVisible;
  }

  viewAllDetailsOnboard(elm: any) {
    const dialogRef = this.dialog.open(
      ViewAllCandidateDetailsOnboardComponent,
      {
        panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
        data: elm,
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100%',
        width: '100%',
      }
    );
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
      }
    });
  }

  ngAfterViewInit(): void {
    this.sortParam = {};
    this.getCandidateListByTalentId(1, 50, null, this.sortParam);
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
    this.getCandidateListByTalentId(
      1,
      CONSTANTS.PAGE_SIZE,
      this.searchInput,
      data
    );
  }

  /***
   * filter form Init
   */
  filterFormInit() {
    this.sortFormFilter = this._fb.group({
      offerstatus: ['all'],
      dateFrom: [null],
      dateTo: [{ value: null, disabled: true }],
      location: [[]],
    });
  }

  /**
   * get selected talent Id
   * @param data
   */
  getDataTalent(data) {
    this.resetSortFilter();
    this.thId = data.TH_ID;
    this.paginatorCompRef.paginator.pageIndex = 0;
    this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, null, null);
  }

  /**
   * pagination method
   * @param pageEvent
   */
  getPagingData(pageEvent: any) {
    this.getCandidateListByTalentId(
      pageEvent.pageIndex + 1,
      pageEvent.pageSize,
      this.searchInput ? this.searchInput : null,
      this.sortParam
    );
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
  getCandidateListByTalentId(
    page: number,
    pageSize: number,
    search: any,
    sortParam: any
  ) {
    let Body = {
      PageNo: page,
      PageSize: pageSize,
    };
    if (search) {
      Body['search'] = search;
    }
    if (sortParam['dateFrom'] == null) {
      Body['startDateFirstUTC'] = this.topFirstDateStart;
      Body['endDateFirstUTC'] = this.topFirstDateEnd;
    }
    if (sortParam['dateFrom']) {
      // Body['startDate'] = GlobalMethod.convertToUTCDateTime(GlobalMethod.formatDate(sortParam['dateFrom']) + ' ' + '00:00:00')
      Body['startDate'] = GlobalMethod.formatDate(sortParam['dateFrom']);
    }
    if (sortParam['dateTo']) {
      // Body['endDate'] = GlobalMethod.convertToUTCDateTime(GlobalMethod.formatDate(sortParam['dateTo']) + ' ' + '23:59:00')
      Body['endDate'] = GlobalMethod.formatDate(sortParam['dateTo']);
    }
    if (sortParam['offerstatus']) {
      Body['offerStatusId'] = sortParam['offerstatus'];
    }
    if (sortParam.location && sortParam.location.length !== 0) {
      let locationIds = sortParam.location.filter((n) => n);
      Body['location'] = locationIds.toString();
    }

    this._onboardserve.getPipelineJoineeCandidateList(Body).subscribe((res) => {
      this.candidateList = new MatTableDataSource<any>(res['data']);
      this.paginationData = res['Paging'][0];
      //this.createEmpEmailDomain(this.candidateList.data[0])
    });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.candidateList.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.candidateList.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position + 1
    }`;
  }

  updateCandidateJoinStatus(element: any): void {
    element['title'] = 'Confirm Candidate Joining Status';
    const dialogRef = this.dialog.open(UpdateCandidateJoiningStatusComponent, {
      width: '500px',
      panelClass: [
        'ats-model-wrap',
        'request-transfers-candidate',
        'ats-header-text-cap',
      ],
      data: element,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getCandidateListByTalentId(
          1,
          CONSTANTS.PAGE_SIZE,
          null,
          this.sortParam
        );
      }
    });
  }

  updateDay1CandidateJoinStatus(element: any): void {
    element['title'] = 'Update Status';
    const dialogRef = this.dialog.open(UpdateDay1PiplineStatusComponent, {
      width: '500px',
      panelClass: [
        'ats-model-wrap',
        'request-transfers-candidate',
        'ats-header-text-cap',
      ],
      data: element,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getCandidateListByTalentId(
          1,
          CONSTANTS.PAGE_SIZE,
          null,
          this.sortParam
        );
      }
    });
  }

  SendemailDay1(element: any = {}): void {
    element['title'] = 'Today’s Joining Status Email';
    const dialogRef = this.dialog.open(MailerDayStatusModalComponent, {
      width: '500px',
      panelClass: [
        'ats-model-wrap',
        'email-send-prv-modal'
      ],
      data: element,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getCandidateListByTalentId(
          1,
          CONSTANTS.PAGE_SIZE,
          null,
          this.sortParam
        );
      }
    });
  }

  SendManualPipelineMail(element: any = {}): void {
    element['title'] = 'Send Manual Pipeline Mail';
    const dialogRef = this.dialog.open(ManualPipelineMailModalComponent, {
      width: '90%',
      maxWidth: '1200px',
      panelClass: [
        'ats-model-wrap',
        'email-send-prv-modal'
      ],
      data: element,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getCandidateListByTalentId(
          1,
          CONSTANTS.PAGE_SIZE,
          null,
          this.sortParam
        );
      }
    });
  }

  createEmpEmailDomain(element: any): void {
    element['title'] = 'Update Candidate Email/Domain ID';
    if (element?.orgEmail) {
      element['key'] = 1;
    }
    debugger
    element['candidateId'] = element.candidateId;
    const dialogRef = this.dialog.open(AddEmpEmailDomainComponent, {
      width: '500px',
      panelClass: [
        'ats-model-wrap',
        'request-transfers-candidate',
        'ats-header-text-cap',
      ],
      data: element,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getCandidateListByTalentId(
          1,
          CONSTANTS.PAGE_SIZE,
          null,
          this.sortParam
        );
      }
    });
  }

  deleteEmpEmailDomain(element: any): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      panelClass: 'ats-confirm',
      data: {
        headerText: 'Alert',
        message: ` Are you sure you want to delete <span class='u-name'>${element?.Name}</span> Email/Domain ID?`,
        buttonText: {
          ok: 'Yes',
          cancel: 'No',
        },
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this._onboardserve
          .deleteJoineeCandidateDetails(element.cid)
          .subscribe((res) => {
            this._share.showAlertSuccessMessage.next(res);
            this.getCandidateListByTalentId(
              1,
              CONSTANTS.PAGE_SIZE,
              null,
              this.sortParam
            );
          });
      }
    });
  }
  /***
   * confirmation before sumbit
   */

 isActionAllowed(userData: any, element: any): boolean {
  // Role 5 or 10 and pipelineStatus not 4
  if ((userData.otherRoles?.IsPipeLineAdmin === 'Y') && element?.pipelineStatus !== 4) {
    return true;
  }

  // Role 2, pipelineStatus not 4, and user is primary or secondary recruiter
  if (
    userData.RoleId === 2 &&
    element?.pipelineStatus !== 4 &&
    (element?.primaryrecruiterEmp === userData?.EmpNewId ||
     element?.secondaryrecruiterEmp === userData?.EmpNewId)
  ) {
    return true;
  }

  return false; // Otherwise, action not allowed
}


   viewActionRights(element: any): boolean {
  // Role 5 or 10 → always allowed
  if (this.userData.otherRoles?.IsPipeLineAdmin === 'Y') {
    return true;
  }

  // Role 2 → only if primary or secondary recruiter matches
  if (
    this.userData.RoleId === 2 &&
    (element?.primaryrecruiterEmp === this.userData?.EmpNewId ||
     element?.secondaryrecruiterEmp === this.userData?.EmpNewId)
  ) {
    return true;
  }

  return false; // Otherwise
}

}
