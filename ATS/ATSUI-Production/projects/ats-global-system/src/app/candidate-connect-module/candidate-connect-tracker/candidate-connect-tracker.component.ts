import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatSort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { ExcelService } from 'projects/ats-global-system/src/app/core/common/excel.service';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { TableUtil } from 'projects/ats-global-system/src/app/core/common/tableUtil';
import { AtsCommonPrefix } from 'projects/ats-global-system/src/app/core/constant/common.const';
import { CONSTANTS } from 'projects/ats-global-system/src/app/core/constant/constants';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { CandidateConnectService } from '../candidate-connect.service';

@Component({
  selector: 'app-candidate-connect-tracker',
  templateUrl: './candidate-connect-tracker.component.html',
  styleUrls: ['./candidate-connect-tracker.component.scss'],
  providers: [DatePipe]
})
export class CandidateConnectTrackerComponent implements OnInit {

  displayedColumns = ['sNo', 'Cid', 'candName',  
    'email','phone','pskills','subskill','experience',
    'pRecruiter', 'sRecruiter','offerDate', 'joiningDate',
    'statusUp15', 'hiringUp15', 'datedays15',
    'statusUp30', 'hiringUp30', 'datedays30', 'statusUp30R', 'hiringUp30R', 'datedays30R',
    //
    'h1statusUp45', 'hiring1Up45', 'h1datedays45', 'statusUp45', 'recFollowUp45', 'datedays45R', 'statusUp45R', 'h2hiringUp45', 'h2datedays45',
    //
    'h1statusUp60', 'hiring1Up60', 'h1Connecteddate60', 'r1statusUp60', 'r1FollowUp60'
    , 'r1ConnectDate60', 'aStatusUp60', 'aProjDuHead60', 'aConnectDate60'
    , 'h2statusUp60', 'hiring2Up60', 'h2Connecteddate60',
    'r2statusUp60', 'r2FollowUp45', 'r2ConnectDate60',
    //
    'h1statusUp90', 'hiring1Up90', 'h1Connecteddate90', 'r1statusUp90', 'r1FollowUp90', 'r1ConnectDate90', 'aStatusUp90',
    'aProjDuHead90', 'aConnectDate90', 'r2statusUp90', 'r2FollowUp90', 'r2ConnectDate90', 'h2statusUp90', 'hiring2Up90'
    , 'h2Connecteddate90', 'r3statusUp90', 'r3FollowUp90', 'r3ConnectDate90', 'rStatusUp90', 'rFollowUp90', 'rConnectDate90'
  ];
  public grTotalHd: any = [
    'grandTotSchedL1', 'grandTotIntervL1', 'grandTotSelectL1', 'grandOffered'
    , 'grandselectPer', 'NoOfCandidateJoined'
  ]
  public sortFormFilter: UntypedFormGroup = new UntypedFormGroup({});
  public displayedColumnsAll: any = [];
  public groupAll: any = [];
  public headGroup: any = [];
  public userData: any = {};
  public pazeSize: any = 10;
  public paginationData: any;
  public pazeOption: any = [10, 20, 50, 100];
  public jumpFirstPage: boolean = false;
  getmonths: any;
  public candidateList: any = [];
  public sortParam: string ='';
  public MonthList: any = CONSTANTS.MonthList;
  public MonthListAll: any = CONSTANTS.MonthList;
  public isResetSearch: boolean = false;
  public isResetFilter: boolean = false;
  public searchInput: string = '';
  public cidColName:string = AtsCommonPrefix.CidColName;
  public cidPrefix:string = AtsCommonPrefix.CidPrefix;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginatorRef', { static: true }) paginatorCompRef;
  constructor(
    private _storage: GetSetStorageService,
    public dialog: MatDialog,
    public datepipe: DatePipe,
    public _excelService: ExcelService,
    private _cdr: ChangeDetectorRef,
    private _candiConnectServe: CandidateConnectService,
    private _fb:UntypedFormBuilder
  ) {

    //showing heading in table
    for (let i = 0; i <= 6; i++) {
      this.headGroup.push('day' + i)
    }
    this.groupAll = this.headGroup;
    this.displayedColumnsAll = this.displayedColumns;
  }

  ngOnInit() {
    this.filterFormInit();
    /**remove transfer option */
    this.userData = this._storage.getSetUserData();
  }

  ngAfterViewInit() {
    this.getCandidateConnectTracker(1, this.pazeSize, null, null);
    this._cdr.detectChanges();
  }

  getPagingData(pageEvent: any) {
    this.getCandidateConnectTracker(pageEvent.pageIndex + 1, pageEvent.pageSize,this.searchInput, this.sortParam);
  }


      /***
 * filter form Init
 */
       filterFormInit() {
        this.sortFormFilter = this._fb.group({
          recruiterId: [[]],
          dateFrom: [null],
          dateTo: [{ value: null, disabled: true }],
          dateStart: [null],
          dateEnd: [{ value: null, disabled: true }],
          
        })
      }
  

  //getting productivity data
  public bodyParam: any = {};
  getCandidateConnectTracker(page: number, pageSize: number, search:string, sortParam: any) { 
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
    if (sortParam?.dateStart) {
      body['startDate2'] = GlobalMethod.formatDate(sortParam?.dateStart);
    }
    if (sortParam?.dateEnd) {
      body['endDate2'] = GlobalMethod.formatDate(sortParam?.dateEnd);
    }
    if (search) {
      body['search'] = search;
    } 
    if (sortParam?.recruiterId && sortParam?.recruiterId.length !== 0) {
      let Ids = sortParam?.recruiterId.filter(n => n);
      body['RecruiterId'] = Ids.toString();
    }  
    this.bodyParam = body;
    // let queryString = `page=${page}&pageSize=${pageSize}&search=${search?search:''}${sortParam ? sortParam : ''}`;
    this._candiConnectServe.getCandidateConnectTracker(body).subscribe(
      res => {
        this.candidateList = new MatTableDataSource(res['data']);
        this.paginationData = res['Table1'][0]
      //  this.paginationData = res['Paging'][0];
        this.candidateList.sort = this.sort;
        this.pazeOption = [...[10, 20, 50, 100],this.paginationData.Total]
       // this.pazeOption.push(this.paginationData.Total)
      }
    )
  }

  getSortData(data: string) {
    this.isResetSearch = true;
    this.isResetFilter = false;
    this.searchInput = '';
    this.sortParam = data;
    this.paginatorCompRef.paginator.pageIndex = 0;
    this.getCandidateConnectTracker(1, CONSTANTS.PAGE_SIZE, this.searchInput, data);
  }

  /***
   * search
   */
   getSearchValueKey(e: any) {
    this.isResetFilter = true;
    this.isResetSearch = false;
    //this.sortParam = '';
    this.searchInput = e;
    this.paginatorCompRef.paginator.pageIndex = 0;
    this.getCandidateConnectTracker(1, CONSTANTS.PAGE_SIZE, e, this.sortParam);
  }


  //total count showing
  sumTotal(data: any = [], Type) {
    if (data.length != 0) {
      let total = data.reduce((total, line) => total + line[Type], 0)
      return total
    }
  }



  //export data as excel
  exportAsXLSX(): void {
    TableUtil.exportTableToExcel("exportTable", 'Candidate-Connect-Tracking-Report', `Candidate Connect Tracker`);
    // let queryString = `Month=1&Year=2222`;
    // this._reportServe.RecruiterProductivityReport(queryString).subscribe(
    //   res => {
    //     let candidateList = res['data'];
    //     let filterDataExcel = [];
    //     for (let key = 0; key < candidateList.length+1; key++) {
    //       console.log('ar',candidateList[key]?.RecruiterName?candidateList[key].RecruiterName:'Total')
    //       let selectedData = {
    //         'Recruiter Name': candidateList[key]?.RecruiterName?candidateList[key].RecruiterName:'Total',
    //         'Scheduled L1': candidateList[key]?.Day_1_L1_Interviewed?candidateList[key].Day_1_L1_Interviewed:this.sumTotal(candidateList,''),
    //         //'Scheduled L1': candidateList[key].Day_1_L1_Interviewed,


    //       };

    //       filterDataExcel.push(selectedData);
    //     }

    //     this._excelService.exportAsExcelFile(filterDataExcel, 'Employee Referral Report');
    //   }
    // )

  }

}
