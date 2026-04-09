import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { GlobalMethod } from '../../core/common/global-method';
import { AtsCommonPrefix, SPECIALACCESSUSER } from '../../core/constant/common.const';
import { CONSTANTS } from '../../core/constant/constants';
import { GetSetStorageService } from '../../core/services/get-set-storage.service';
import { ShareService } from '../../core/services/share.service';
import { BgvServiceService } from '../bgv-service.service';
import { ExcelService } from '../../core/common/excel.service';
import { ConfirmationDialogComponent } from '../../shared/shared-app/components/confirmation-dialog/confirmation-dialog.component';
import { ViewCheckWiseReportHistoryComponent } from '../modals/view-check-wise-report-history/view-check-wise-report-history.component';

@Component({
  selector: 'app-bgv-candidates-list',
  templateUrl: './bgv-candidates-list.component.html',
  styleUrls: ['./bgv-candidates-list.component.scss']
})
export class BgvCandidatesListComponent implements OnInit {
  public displayedColumns: string[] = [];
  //  displayedColumns = ['talentId', 'Cid', 'CandidateName', 'EmailID', 'PhoneNo', 'primarySkill', 'priRecruiter',
  //    'secondRecruiter', 'offerDate', 'joiningDate', 'joiningLocation', 'cifStatus', 'candiSubStatus', 'day1Status', 'appStatusProg',
  //    //'recVerification','hrVerification',
  //    'approveStatus', 'dormantStatus', 'action'];
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
    private _bgvServ: BgvServiceService,
    private _excelService: ExcelService,
    private _share: ShareService,

  ) {
  }

  ngOnInit() {
    this.userData = this._storage.getSetUserData();
    this.filterFormInit();
    if (this.userData?.RoleId == 1) {
      this.displayedColumns = [
        'ReferenceId',
        'Cid',
        'CandidateName',
        'employeeId',
        'designation',
        'grade',
        'doj',
        'location',
        'joiningStatus',
        'BGVInitiatedDate',
        'bgvType',
        'Report1Status',
        // 'Report1ColorCode',
        'Report1Remark',
        'Report1ReceivedDate',
        'Report2Status',
        // 'Report2ColorCode',
        'Report2Remark',
        'Report2ReceivedDate',
        'FinalReportStatus',
        'FinalReportColorCode',
        'FinalReportRemark',
        'FinalReportReceivedDate',
        'checksCompleted',
        'checksWIP',
        'action'
      ];
      //  } else if (this.userData?.RoleId == 2) {
      //    this.displayedColumns = ['talentId', 'Cid', 'CandidateName', 'EmailID', 'PhoneNo', 'primarySkill', 'priRecruiter',
      //      'secondRecruiter', 'offerDate', 'joiningDate', 'joiningLocation', 'cifStatus',
      //      // 'candiSubStatus','day1Status',
      //      'appStatusProg', 'approveStatus', 'dormantStatus', 'action'];
    } else {
      this.displayedColumns = [
        'ReferenceId',
        'Cid',
        'CandidateName',
        'location',
        'BGVInitiatedDate',
        'Report1Status',
        // 'Report1ColorCode',
        'Report1Remark',
        'Report1ReceivedDate',
        'Report2Status',
        // 'Report2ColorCode',
        'Report2Remark',
        'Report2ReceivedDate',
        'FinalReportStatus',
        'FinalReportColorCode',
        'FinalReportRemark',
        'FinalReportReceivedDate',
        // 'action'
      ];
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
      offerstatus: [[]],
      dateStart: [null],
      dateEnd: [{ value: null, disabled: true }],
      bgvFinalStatus: [[]],
    })
  }


  public bodyParam: any = {};
  getOnboardingCandidateList(page: number, pageSize: number, search: any, sortParam: any) {
    this.bodyParam = {};
    let body = {
      page: page,
      pageSize: pageSize
    }
    if (sortParam?.dateStart) {
      body['StartDOJ'] = GlobalMethod.formatDate(sortParam?.dateStart);
    }
    if (sortParam?.dateEnd) {
      body['EndDOJ'] = GlobalMethod.formatDate(sortParam?.dateEnd);
    }
    if (sortParam?.offerstatus && sortParam?.offerstatus.length !== 0) {
      let offerstatusIds = sortParam.offerstatus.filter(n => n);
      body['OfferStatusId'] = offerstatusIds.toString();
    }
    if (sortParam?.bgvFinalStatus && sortParam?.bgvFinalStatus.length !== 0) {
      body['FinalBGVStatus'] = sortParam?.bgvFinalStatus.toString();
    }
    if (search) {
      body['search'] = search;
    }
    if (sortParam.location && sortParam.location.length !== 0) {
      let locationIds = sortParam.location.filter(n => n);
      body['JoiningLocation'] = locationIds.toString();
    }

    this.bodyParam = body;
    this._bgvServ.GetAllBGVCandidateDetails(body).subscribe(
      res => {
        this.candidateList = res['data'];
        this.paginationData = res['Paging'][0];
      }
    )
  }

  /***
  * export excel
  */
  exportAsXLSX(): void {
    let bodyData = {
      ...this.bodyParam,
      page: 1,
      pageSize: this.paginationData?.Total,
    }
    this._bgvServ.GetAllBGVCandidateDetails(bodyData).subscribe(
      res => {
        let candidateList = res['data'];
        let filterDataExcel = [];
        for (var key in candidateList) {
          let selectedData = {};
          let columnsToExport: string[] = [];

          // Define mapping for display names if needed
          const displayNameMap = {
            ReferenceId: 'Reference Id',
            CandidateName: 'Candidate Name',
            Cid: 'Cid',
            employeeId: 'Employee Id',
            Designation: 'Designation',
            Grade: 'Grade',
            DOJ: 'Date of Joining',
            JoiningLocation: 'Location',
            JoiningStatus: 'Joining Status',
            BGVInitiatedDate: 'BGV Initiated Date',
            BGVType: 'BGV Type',
            Report1Status: 'Interim Report 1 Status',
            Report1ColorCode: 'Interim Report 1 Color Code',
            Report1Remark: 'Interim Report 1 Remark',
            Report1ReceivedDate: 'Interim Report 1 Received Date',
            Report2Status: 'Interim Report 2 Status',
            Report2ColorCode: 'Interim Report 2 Color Code',
            Report2Remark: 'Interim Report 2 Remark',
            Report2ReceivedDate: 'Interim Report 2 Received Date',
            FinalReportStatus: 'Final Report Status',
            FinalReportColorCode: 'Final Report Color Code',
            FinalReportRemark: 'Final Report Remark',
            FinalReportReceivedDate: 'Final Report Received Date',
            Checks_Completed: 'Checks Completed',
            Checks_WIP: 'Checks WIP',
            // Add more mappings as needed
          };

          if (this.userData?.RoleId == 1) {
            columnsToExport = [
              'ReferenceId',
              'Cid',
              'CandidateName',
              'employeeId',
              'Designation',
              'Grade',
              'DOJ',
              'JoiningLocation',
              'JoiningStatus',
              'BGVInitiatedDate',
              'BGVType',
              'Report1Status',
              // 'Report1ColorCode',
              'Report1Remark',
              'Report1ReceivedDate',
              'Report2Status',
              // 'Report2ColorCode',
              'Report2Remark',
              'Report2ReceivedDate',
              'FinalReportStatus',
              'FinalReportColorCode',
              'FinalReportRemark',
              'FinalReportReceivedDate',
              'Checks_Completed',
              'Checks_WIP',
              // 'action' // usually not exported
            ];
          } else {
            columnsToExport = [
              'ReferenceId',
              'Cid',
              'CandidateName',
              'location',
              'BGVInitiatedDate',
              'Report1Status',
              // 'Report1ColorCode',
              'Report1Remark',
              'Report1ReceivedDate',
              'Report2Status',
              // 'Report2ColorCode',
              'Report2Remark',
              'Report2ReceivedDate',
              'FinalReportStatus',
              'FinalReportColorCode',
              'FinalReportRemark',
              'FinalReportReceivedDate',
              // 'action'
            ];
          }

          columnsToExport.forEach(col => {
            // Skip commented columns
            if (col.startsWith('//')) return;
            // Use display name if available, else use the column key
            const displayName = displayNameMap[col] || col;
            if (col === 'DOJ' || col.endsWith('Date')) {
              selectedData[displayName] = candidateList[key][col] ? GlobalMethod?.formatDate(candidateList[key][col]) : '-';
            } else {
              selectedData[displayName] = candidateList[key][col] || '-';
            }
          });

          filterDataExcel.push(selectedData);
        }
        this._excelService.exportAsExcelFile(filterDataExcel, 'BGV-Candidates-List');
      }
    )

  }
  /**
   * view all details of BGV candidate
   * @param element 
   */
  approveToShowDetailsToRM(element: any) {
    /***
             * confirmation dailog
             */
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      panelClass: 'ats-confirm',
      data: {
        headerText: 'Alert',
        message: ` Are you sure you want to show <b> ${element?.CandidateName || '-'}</b> details to Reporting Manager?`,
        buttonText: {
          ok: "Yes",
          cancel: "No"
        },
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._bgvServ.GiveBGVCandidateAccess(element?.Candidateid).subscribe(
          res => {
            this._share.showAlertSuccessMessage.next(res);
            // this.paginatorCompRef.paginator.pageIndex = 0;
            this.getOnboardingCandidateList(1, CONSTANTS.PAGE_SIZE, this.searchInput, this.sortParam)
            // this.dialogRef.close(true);
          }
        );
      }
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


  openViewCheckWiseReportHistoryModal(element: any): void {
    element['title'] = "Proposed Employees Details"
    const dialogRef = this.dialog.open(ViewCheckWiseReportHistoryComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'view-proposed-candidate'],
      data: element,
    });
    dialogRef.afterClosed().subscribe(
      res => {
        if (res) {
          // this.GetRaisedTHIDDetails(1, CONSTANTS.PAGE_SIZE, null, null);
          // let pageCount: PageCount = this.getPageCount({});
          // this.GetRaisedTHIDDetails(pageCount?.Page, pageCount?.pageSize, this.searchInput, this.bodyParam);
        }
      }
    );
  }
}
