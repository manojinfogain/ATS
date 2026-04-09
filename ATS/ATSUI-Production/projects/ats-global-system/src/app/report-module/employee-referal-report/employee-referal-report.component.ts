import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { ExcelService } from 'projects/ats-global-system/src/app/core/common/excel.service';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { ReportService } from '../report.service';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { CONSTANTS } from 'projects/ats-global-system/src/app/core/constant/constants';
import { HttpClient } from '@angular/common/http';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { saveAs } from "file-saver";
import { AtsCommonPrefix } from 'projects/ats-global-system/src/app/core/constant/common.const';



@Component({
  selector: 'app-employee-referal-report',
  templateUrl: './employee-referal-report.component.html',
  styleUrls: ['./employee-referal-report.component.scss'],
  providers: [DatePipe]
})
export class EmployeeReferalReportComponent implements OnInit {

  displayedColumns = ['refId','cid','refLocation','tId', 'accountName','candLocation', 'candName','candPhone', 'candiEmail','empExperience', 'PrimarySkill', 'subSkill','currentStatus', 'empRefeLoc' , 'recruName' , 'refName' , 'refEmpId' , 'refDu' , 'refAccount' , 'refBaseLoc' , 'refGrade' , 'screeningDate'
  , 'techRound1', 'techRound2', 'techRound3', 'customerRound1', 'customerRound2',
    'managerialRound', 'HRRoundDate', 'offrAprrovSentDate', 'offrReceivTagDate',
    'approvalReceDeliveryHead', 'approvalReceSvp', 'approvalReceCoo',
    'offrGeneration','offerAcceptancDate','status','ScreenStatus','ScreenRejectReason','resTimeAdher','slaCompl','modifiedOn','modifiedBy'
  ];
  public cid = AtsCommonPrefix.CidColName;
  public prefixCid =AtsCommonPrefix.CidPrefix;
  public userData: any = {};
  public candidateList: any = [];
  public searchInput: string;
  public paginationData: any;
  public pazeOption: any = [10, 25, 50, 100];
  public pazeSize: any = 10;
  public thId: string = '';
  public jumpFirstPage: boolean = false;
  public sortFormFilter: UntypedFormGroup = new UntypedFormGroup({});
  public isResetSearch: boolean = false;
  public isResetFilter: boolean = false;
  public sortParam: string = '';
  @ViewChild(MatSort) sort: MatSort;
  public sortTable: string = '';
  @ViewChild('paginatorRef', { static: true }) paginatorCompRef;
  constructor(
    private _storage: GetSetStorageService,
    private _fb: UntypedFormBuilder,
    private _reportServe: ReportService,
    public dialog: MatDialog,
    public datepipe: DatePipe,
    private http: HttpClient,
    private _share: ShareService,
    public _excelService:ExcelService
  ) {
  }

  ngOnInit() {
    /**remove transfer option */
    this.userData = this._storage.getSetUserData();
    this.filterFormInit();
  }
  ngAfterViewInit() {
    /**
         * get List Profile
         */
    this.sortParam = '&startDate=' + this.getPastdate();
    this.getEmployeeReferralReport(1, this.pazeSize, null, { startDate: null });
  }

  /***
   * reset paging
   */
  resetPagination() {
    this.paginatorCompRef.paginator.pageIndex = 0;
  }

  getSortData(data: string) {
    this.isResetSearch = true;
    this.isResetFilter = false;
    this.searchInput = '';
    this.sortParam = data;
    this.resetPagination();
    this.getEmployeeReferralReport(1, this.pazeSize, this.searchInput, data);

  }

  /**
 * reset filter and search
 */
  resetSortFilter() {
    this.isResetSearch = true;
    this.isResetFilter = true;
    this.searchInput = '';
    this.sortParam = '';
    //this.sortTable = '';
  }

  /**
* get filter value
* @param data
*/  

  //paste date
  getPastdate() {
    let currentDate = new Date();
    // let pastDate = new Date(currentDate);
    /**
     * 8 days before
     */
    // pastDate.setDate(pastDate.getDate() - 7);
    let firstDayMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    let dateParse = GlobalMethod.formatDate(firstDayMonth);
    return dateParse;
  }

  //form for filter
  filterFormInit() {
    this.sortFormFilter = this._fb.group({
      dateFrom: [null],
      dateTo: [{ value: null, disabled:true }],
      deliveryUnit: [[]],
      accountType: [[]],
      recruiterId: [[]],
      primarySkill: [[]],
      practiceId: [[]],
    })
  }

  // getEmployReferralList(page: number, pageSize: number, search: string, sortParam: string, sortTable: string) {
  //   // let queryString = `page=${page}&pageSize=${pageSize}&search=${search ? search.trim():''}${sortParam?sortParam:''}`;
  //   let queryString = `PageNo=${page}&PageSize=${pageSize}${search ? '&search=' + search : ''}${this.thId ? 'thid' + this.thId : ''}${sortParam ? sortParam : ''}${sortTable ? sortTable : ''}`;
  //   this._reportServe.getEmployeReferalReport(queryString).subscribe(
  //     res => {
  //       this.candidateList = new MatTableDataSource(res['data']);
  //       this.paginationData = res['Paging'][0];
  //       this.candidateList.sort = this.sort;
  //     }
  //   )
  // }
  //getting data 
  public bodyParam: any = {};
  getEmployeeReferralReport(page: number, pageSize: number, search: string, sortParam: any) {
    this.bodyParam = {};
    let body = {
      page: page,
      pageSize: pageSize,
      // startDate: sortParam.startDate
    }
    if (sortParam?.dateFrom) {
      body['startDate'] = GlobalMethod.formatDate(sortParam?.dateFrom);
    }
    // if (sortParam?.dateFrom == null) {
    //   body['startDate'] = this.getPastdate();
    // }
    if (sortParam?.dateTo) {
      body['endDate'] = GlobalMethod.formatDate(sortParam?.dateTo);
    }
    // if (this.thId) {
    //   body['thid'] = this.thId
    // }
    if (search) {
      body['search'] = search;
    }
    if (sortParam.accountType && sortParam.accountType.length !== 0) {
      let Ids = sortParam.accountType.filter(n => n);
      body['accountId'] = Ids.toString();
    }
    if (sortParam.deliveryUnit && sortParam.deliveryUnit.length !== 0) {
      let Ids = sortParam.deliveryUnit.filter(n => n);
      body['DUIDs'] = Ids.toString();
    }

    if (sortParam.recruiterId && sortParam.recruiterId.length !== 0) {
      let Ids = sortParam.recruiterId.filter(n => n);
      body['recruiterId'] = Ids.toString();
    }
    if (sortParam.primarySkill && sortParam.primarySkill.length !== 0) {
      let Ids = sortParam.primarySkill.filter(n => n);
      body['primarySkill'] = Ids.toString();
    }
    if (sortParam?.practiceId && sortParam?.practiceId.length !== 0) {
      let Ids = sortParam?.practiceId.filter(n => n);
      body['practiceId'] = Ids.toString();
    }
    this.bodyParam = body;
    this._reportServe.getEmployeeReferralReport(body).subscribe(
      res => {
        this.candidateList = new MatTableDataSource(res['data']);
        this.paginationData = res['Paging'][0];
        this.candidateList.sort = this.sort;
      }
    )
  }

  /**
 * pagination method
 * @param pageEvent 
 */
  getPagingData(pageEvent: any) {
    this.getEmployeeReferralReport(pageEvent.pageIndex + 1, pageEvent.pageSize, this.searchInput, this.sortParam);
  }

  /***
     * search
     */

  getSearchValueKey(e: any) {
    //this.isResetFilter = true;
    this.isResetSearch = false;
    this.searchInput = e;
    this.jumpFirstPage = false;
    this.jumpFirstPage = true;
    this.getEmployeeReferralReport(1, CONSTANTS.PAGE_SIZE, e, this.sortParam);
  }


  //export excel
  
 exportAsXLSX(): void {
  let bodyData = {
    ...this.bodyParam,
    page: 1,
    pageSize: this.paginationData?.Total,
  }
  this.http.post(`${environment.apiMainUrlNet}Report/ExportToExcelReferralReport`, bodyData, { responseType: 'blob' }).subscribe(
    res => {
      saveAs(res, 'Referral_Report.xls');
    },
    (error) => {
      this._share.showAlertErrorMessage.next('Something went wrong');
    }
  )

  //  let queryString = `PageNo=1&PageSize=${this.paginationData?.Total}${this.searchInput ? '&search=' + this.searchInput : ''}${this.sortParam ? this.sortParam : ''}${this.sortTable ? this.sortTable : ''}`;
  //  //  let queryString = `page=1&pageSize=${this.paginationData?.Total}`;
  //  this._reportServe.getEmployeReferalReport(queryString).subscribe(
  //    res => {
  //      let candidateList = res['data'];
  //      let filterDataExcel = [];
  //      for (var key in candidateList) {
  //        let selectedData = {
  //         'Referral ID': candidateList[key].ReferralID,
  //          'Name': candidateList[key].Candidate_EmailId,
  //          'Email': candidateList[key].Candidate_Name,
  //          ' Phone No.': candidateList[key].Candidate_MobileNo,
  //          'Skill': candidateList[key].SecondarySkill,
  //          'Total Experience ': candidateList[key].Experience_Year + ' Year ' + candidateList[key].Experience_Month+ ' Month',
  //          'Notice Period (Days)': candidateList[key].NoticePeriod_Days,
  //          'Referral Location': candidateList[key].ReferralLocation,
  //          'Status': candidateList[key].Status
  //        };
  //        filterDataExcel.push(selectedData);
  //      }

  //      this._excelService.exportAsExcelFile(filterDataExcel, 'Employee Referral Report');
  //    }
  //  )

 }

}
