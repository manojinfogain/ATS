import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CONSTANTS } from 'projects/ats-global-system/src/app/core/constant/constants';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { PartnerService } from '../partner.service';
import { ConfirmationDialogComponent } from 'projects/ats-global-system/src/app/shared/shared-app/components/confirmation-dialog/confirmation-dialog.component';
import { UserActiveDeactiveComponent } from '../modals/user-active-deactive/user-active-deactive.component';
import { Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { saveAs } from "file-saver";
import { MatSort, Sort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { DatePipe } from '@angular/common';
import { ApproveRejectTalentidReqComponent } from './approve-reject-talentid-req/approve-reject-talentid-req.component';
import { ResendApprovalTalentidAssignComponent } from './resend-approval-talentid-assign/resend-approval-talentid-assign.component';
import { GlobalMethod } from '../../core/common/global-method';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ShareService } from '../../core/services/share.service';
import { ApprovePendingWithMeTalentModalComponent } from './approve-pending-with-me-talent-modal/approve-pending-with-me-talent-modal.component';
import { Subscription } from 'rxjs';
import { GetLocationInfo } from '../../core/common/getLocationInfo';
import { ExcelService } from '../../core/common/excel.service';
@Component({
  selector: 'app-partner-talentid-details',
  templateUrl: './partner-talentid-details.component.html',
  styleUrls: ['./partner-talentid-details.component.scss'],
  providers: [DatePipe]
})
export class PartnerTalentidDetailsComponent implements OnInit, AfterViewInit {
  displayedColumns = ['talent_id', 'partnerName', 'primaryRecruiter', 'secondaryRecruiter', 'contractType',
    'AccountName', 'Practice', 'reasonForAssing', 'Approver', 'approvalStatus', 'status','dormantStatus', 'assignBy', 'assignOn', 'Remarks', 'action'];
  public userData: any = {};
  public searchInput: string = '';
  public paginationData: any;
  public candidateList: any = [];
  public jumpFirstPage: boolean = false;
  public isResetSearch: boolean = false;
  public isResetFilter: boolean = false;
  public sortParam: string = '';
  public sortFormFilter: UntypedFormGroup = new UntypedFormGroup({});
  @ViewChild(MatSort) sort: MatSort;
  public sortTable:any  = [];
  /** Paginator Reference */
  @ViewChild('paginatorRef', { static: true }) paginatorCompRef;
  private refreshSubscription: Subscription = new Subscription();
  constructor(
    public dialog: MatDialog,
    private _storage: GetSetStorageService,
    private _partnerserve: PartnerService,
    private _router: Router,
    private _fb: UntypedFormBuilder,
    public datepipe: DatePipe,
    private http: HttpClient,
    private _share: ShareService,
    private getLocInfo: GetLocationInfo,
    private _excelService: ExcelService
  ) {
  }

  ngOnInit() {
    this.userData = this._storage.getSetUserData();
   
    this.filterFormInit();
  }

  // location wise check
  public isLocationUS: boolean = false;
  public isLocationIndia: boolean = false;
  showHideLocWise() {
   if (this.getLocInfo.isLocationIndia()) {
     this.isLocationIndia = true;
     this.isLocationUS = false;
   } else if (this.getLocInfo.isLocationUS()) {
     this.isLocationIndia = false;
     this.isLocationUS = true;
   }
   
   this.getVenderTalentIdList(1, CONSTANTS.PAGE_SIZE, null, null, '');

 }

  ngAfterViewInit() {
    /**
         * get List 
         */
    this.showHideLocWise();
    this.refreshSubscription = this._share.detectSwitchLoc.subscribe(
      get => {
        this.showHideLocWise();
      }
    )
    // this.getVenderTalentIdList(1, CONSTANTS.PAGE_SIZE, null, null, '');
  }

  ngOnDestroy(): void {
    if(this.refreshSubscription){
      this.refreshSubscription.unsubscribe();
    }
  }

  /***
     * table sort by column
     */
  sortData(sort: Sort) {
    this.resetPagination();
    if (sort.direction == '') {
      this.sortTable = '';
    }
    else {
      // this.sortTable = `&sortColumn=${sort.active}&sortDir=${sort.direction}`;
      this.sortTable = sort;
    }
    this.getVenderTalentIdList(1, CONSTANTS.PAGE_SIZE, this.searchInput, this.sortParam, this.sortTable);
  }

  /***
  * reset paging
  */
  resetPagination() {
    this.paginatorCompRef.paginator.pageIndex = 0;
  }

  /***
 * filter form Init
 */
  filterFormInit() {
    this.sortFormFilter = this._fb.group({
      PartnerID: [[]],
      statusAssignId: ['all'],
      practiceId: [[]],
      accountType: [[]],
      dateFrom: [null],
      pendingWithMe: [null],
      dateTo: [{ value: null, disabled: true }]
    })
  }

  /**
   * reset filter and search
   */
  resetSortFilter() {
    this.isResetSearch = true;
    this.isResetFilter = true;
    this.searchInput = '';
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
    this.jumpFirstPage = false;
    this.jumpFirstPage = true;
    this.getVenderTalentIdList(1, CONSTANTS.PAGE_SIZE, this.searchInput, data, this.sortTable);
  }


  /**
 * pagination method
 * @param pageEvent 
 */
  getPagingData(pageEvent: any) {
    this.getVenderTalentIdList(pageEvent.pageIndex + 1, pageEvent.pageSize, this.searchInput ? this.searchInput : null, this.sortParam, this.sortTable);
  }

  /***
   * search
   */
  getSearchValueKey(e: any) {
    this.isResetFilter = true;
    this.isResetSearch = false;
    this.sortParam = '';
    this.searchInput = e;
    this.jumpFirstPage = false;
    this.jumpFirstPage = true;
    this.getVenderTalentIdList(1, CONSTANTS.PAGE_SIZE, e, this.sortParam, this.sortTable);
  }

  public bodyParam: any = {};
  getVenderTalentIdList(page: number, pageSize: number, search: any, sortParam: any, sortTable:any) {
    //  let queryString = `EmpID=${this._storage.getUserEmpId()}&page=${page}&pageSize=${pageSize}&search=${search ? search.trim() : ''}${sortParam ? sortParam : ''}${sortTable ? sortTable : ''}`;
    this.bodyParam = {};
    let body = {
      page: page,
      pageSize: pageSize,
    }
    if (sortParam?.dateFrom) {
      body['startDate'] = GlobalMethod.formatDate(sortParam?.dateFrom);
    }
    if (sortParam?.dateTo) {
      body['endDate'] = GlobalMethod.formatDate(sortParam?.dateTo);
    }

    if (search) {
      body['search'] = search;
    }
    // if (sortTable) {
    //   body['sortDir'] = sortTable;
    // }
    if (sortTable?.direction) {
      body['sortDir'] = sortTable?.direction;
    }

    if (sortTable?.active) {
      body['sortColumn'] = sortTable?.active;
    }

    // if (sortParam?.PartnerID) {
    //   body['partnerId'] = sortParam.PartnerID;
    // }
    if (sortParam?.PartnerID && sortParam?.PartnerID.length !== 0) {
      let Ids = sortParam?.PartnerID.filter(n => n);
      body['partnerId'] = Ids.toString();
    }
    /**0 for unassign / 1 for assign  */
    if (sortParam?.statusAssignId =='0' || sortParam?.statusAssignId =='1') {
      body['statusID'] = sortParam?.statusAssignId;
    }
   
    if (sortParam?.pendingWithMe== true) {
      body['pendingWithMe'] = 1;
    }
    if (sortParam?.practiceId && sortParam?.practiceId.length !== 0) {
      let Ids = sortParam?.practiceId.filter(n => n);
      body['practiceId'] = Ids.toString();
    }

    if (sortParam?.accountType && sortParam?.accountType.length !== 0) {
      let Ids = sortParam?.accountType.filter(n => n);
      body['accountId'] = Ids.toString();
    }
    this.bodyParam = body;
    this._partnerserve.getPartnerTalentIdList(body).subscribe(
      res => {
        this.candidateList = new MatTableDataSource(res['data']);
        this.paginationData = res['pagination'][0];
        this.candidateList.sort = this.sort;
      }
    )
  }



  /***
   * active/deactive  conform modal
   */

  confirmAlertActiveDeactive(event: any, data: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      panelClass: 'ats-confirm',
      data: {
        headerText: 'Alert',
        message: ` Are you sure you want to ${data.status == 1 ? 'Unassign ' + data?.talent_id + ' from' : 'Reassign ' + data?.talent_id + ' to'}  <span class='u-name'>${data?.PartnerName}</span> ?`,
        buttonText: {
          ok: "Yes",
          cancel: "No"
        },
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.changeStatus(data, event)
      }
      else {
        event.source.checked = data?.status === 1;
      }
    });
  }
  /***
   * open modal for status remark
   */
  changeStatus(elm: any, event: any) {
    elm['title'] = event.source.checked === true ? 'Reassign ' + elm?.talent_id + ' to' : 'Unassign ' + elm?.talent_id + ' from';
    elm['statusForUpdate'] = event.source.checked === true ? 1 : 0;
    elm['type'] = 3;
    const dialogRef = this.dialog.open(UserActiveDeactiveComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'talent-transfers-mod', 'active-inc-modal'],
      data: elm,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.jumpFirstPage = true;
        this.paginatorCompRef.paginator.pageIndex = 0;
        this.getVenderTalentIdList(1, CONSTANTS.PAGE_SIZE, this.searchInput, this.sortParam, this.sortTable);
      }
      else {
        event.source.checked = elm?.status === 1;
      }
    });
  }


  gotoUser(): void {
    this._router.navigate(['assign-talentId-partner'])
  }

  // Talent Id Assign To Partner Approval 
  approvalTalentIdAssign(elm: any): void {
    elm['title'] = "Talent Id assign to partner approval";
    elm['type'] = 'A';
    const dialogRef = this.dialog.open(ApproveRejectTalentidReqComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'update-interview-feedback', 'partner-update-modal', 'partner-status-modal'],
      data: elm,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.jumpFirstPage = true;
        this.paginatorCompRef.paginator.pageIndex = 0;
        this.getVenderTalentIdList(1, CONSTANTS.PAGE_SIZE, this.searchInput, this.sortParam, this.sortTable);
      }
    });
  }

  // ChangeApprover 
  changeApprover(elm: any): void {
    elm['title'] = "Change Approver";
    elm['type'] = 'C';
    const dialogRef = this.dialog.open(ApproveRejectTalentidReqComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'update-interview-feedback', 'partner-update-modal', 'partner-status-modal'],
      data: elm,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.jumpFirstPage = true;
        this.paginatorCompRef.paginator.pageIndex = 0;
        this.getVenderTalentIdList(1, CONSTANTS.PAGE_SIZE, this.searchInput, this.sortParam, this.sortTable);
      }
    });
  }

  // Talent Id Assign To Partner Approval 
  sendForApproval(elm: any): void {
    elm['title'] = "Resend for Approval"
    const dialogRef = this.dialog.open(ResendApprovalTalentidAssignComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'update-interview-feedback', 'partner-update-modal', 'partner-resend-apr'],
      data: elm,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.jumpFirstPage = true;
        this.paginatorCompRef.paginator.pageIndex = 0;
        this.getVenderTalentIdList(1, CONSTANTS.PAGE_SIZE, this.searchInput, this.sortParam, this.sortTable);
      }
    });
  }
/** approve pending with me modal multi select*/
  pendingWithMeModal(elm: any): void {
    elm['title'] = "Approve/ Referred Back Talent IDs";
   // elm['type'] = 'A';
    const dialogRef = this.dialog.open(ApprovePendingWithMeTalentModalComponent, {
      width: '650px',
      panelClass: ['ats-model-wrap', 'partner-pending-with-me', 'view-profile-popup', 'add-profile-popup'],
      data: elm,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.jumpFirstPage = true;
        this.paginatorCompRef.paginator.pageIndex = 0;
        this.getVenderTalentIdList(1, CONSTANTS.PAGE_SIZE, this.searchInput, this.sortParam, this.sortTable);
      }
    });
  }


    /***
* download report  
*/
exportExcelServerSide() {
  let bodyData = {
    ...this.bodyParam,
    page: 1,
    pageSize: this.paginationData?.Total,
  }
  this.http.post(`${environment.apiMainUrlNet}Partner/ExportToExcelPartnerTalentReport`, bodyData, { responseType: 'blob' }).subscribe(
    res => {
      saveAs(res, 'Partner-Talent-ID-List-Report.xls');
    },
    (error) => {
      this._share.showAlertErrorMessage.next('Something went wrong');
    }
  )
  
}

   /***
* download report  
*/
exportExcelClientEnd() {
  let bodyData = {
    ...this.bodyParam,
    page: 1,
    pageSize: this.paginationData?.Total,
  }
  this._partnerserve.getPartnerTalentIdList(bodyData).subscribe(
    res => {
      let talentList = res['data'];
        let filterDataExcel = [];
        for (var key in talentList) {
          let dataColumn = {
            'Talent ID': talentList[key].talent_id,
            'Partner Name': talentList[key].PartnerName,
            'Account': talentList[key].AccountName,
            'Practice': talentList[key].Practice,
            'Global Delivery Lead': talentList[key].DeliveryUnit,
            'Primary Recruiter': talentList[key].PrimaryRecruiterName,
            'Primary Recruiter Email': talentList[key].primaryrecruiterEmail,
            'Secondary Recruiter': talentList[key].SecondaryRecruiterName,
            'Secondary Recruiter Email': talentList[key].secondaryrecruiterEmail,
            'Assigned By': talentList[key].addedByName,
            'Assigned On': this.datepipe.transform(talentList[key].AssignedOn, 'yyyy/MM/dd  h:mm a'),
            'Reason for Assign': talentList[key].Reason,
            'Contract Type(s)': talentList[key].ContractType,
            'Remarks': talentList[key].Remarks,
            'Status': talentList[key].Status == 1?'Assigned':talentList[key].Status == 0?'Not Assigned':'',
            'Approval Status': talentList[key].ApprovalStatusLabel,
            'Approver': talentList[key].ApproverName,
          }
          filterDataExcel.push(dataColumn);
        }

       
        this._excelService.exportAsExcelFile(filterDataExcel, 'Partner-Talent-ID-List-Report');
    }
  )
  
}
 
}
