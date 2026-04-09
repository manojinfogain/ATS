import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatSort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { ExcelService } from 'projects/ats-global-system/src/app/core/common/excel.service';
import { CONSTANTS } from 'projects/ats-global-system/src/app/core/constant/constants';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { ReportService } from '../report.service';
import { saveAs } from "file-saver";
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { UntypedFormBuilder } from '@angular/forms';
import { AtsCommonPrefix, GET_DEFAULT_DATE } from 'projects/ats-global-system/src/app/core/constant/common.const';
import { ReportDetailsModalComponent } from '../modals/report-details-modal/report-details-modal.component';
import { ActivatedRoute } from '@angular/router';
import { AtsCommonFuncService } from '../../core/common/ats-common-func.service';
@Component({
  selector: 'app-interview-process-report',
  templateUrl: './interview-process-report.component.html',
  styleUrls: ['./interview-process-report.component.scss'],
  providers: [DatePipe]
})
export class InterviewProcessReportComponent implements OnInit {

  displayedColumns = ['tId', 'Cid', 'candName', 'candiEmail', 'PrimarySkill', 'subSkill', 'accountName', 'DU', 'practice','subPractice', 'practiceCommunity',  'source', 'MarkedExternalHiring','candidateInterview', 'LastModifiedDate', 'recruName', 'recruRMName', 'canidateStatus', 'action'
  ];
  public candidateList: any = [];
  public searchInput: string;
  public paginationData: any;
  public pazeOption: any = [10, 20, 50, 100];
  public pazeSize: any = 10;
  public thId: string = '';
  public jumpFirstPage: boolean = false;
  public isResetSearch: boolean = false;
  public isResetFilter: boolean = false;
  public sortParam: any = '';
  public DateDate = ''
  public dateMin: any = '';
  public cidColName: string = AtsCommonPrefix.CidColName;
  public cidPrefix: string = AtsCommonPrefix.CidPrefix;
  @ViewChild(MatSort) sort: MatSort;
  public sortTable: string = '';
  @ViewChild('paginatorRef', { static: true }) paginatorCompRef;
  constructor(
    private _reportServe: ReportService,
    public dialog: MatDialog,
    public datepipe: DatePipe,
    public _excelService: ExcelService,
    private http: HttpClient,
    private _share: ShareService,
    private _fb: UntypedFormBuilder,
    private _act:ActivatedRoute

  ) { }

  ngOnInit() {
    this.filterFormInit();
  }
  ngAfterViewInit() {
    //this.sortParam = '&startDate=' + this.getPastdate();
    this.getInterviewProcessReport(1, this.pazeSize, null, { startDate: this.getPastdate() });
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
    this.getInterviewProcessReport(1, this.pazeSize, this.searchInput, data);

  }
  //paste date
  getPastdate() {
    let currentDate = new Date();
    // let pastDate = new Date(currentDate);
    /**
     * 8 days before
     */
    // pastDate.setDate(pastDate.getDate() - 7);
    // let firstDayMonth = new Date(currentDate.getFullYear(), 0, 1);
    // let dateParse = GlobalMethod.formatDate(firstDayMonth);
    let dateParse = GlobalMethod.formatDate(GET_DEFAULT_DATE.fromDate);
    return dateParse;
  }

  //form for filter
  public sortFormFilter: any
  filterFormInit() {
    this.sortFormFilter = this._fb.group({
      dateFrom: [new Date(this.getPastdate())],
      dateTo: [{ value: null }],
      dateStart: [null],
      dateEnd: [{ value: null, disabled: true }],
      dateStartThree: [null],
      dateEndThree: [{ value: null, disabled: true }],
      deliveryUnit: [[]],
      accountType: [[]],
      recruiterId: [[]],
      primarySkill: [[]],
      practiceId: [[]],
      prCommunityId: [[]],
      subPracticeId: [[]],
      source: [[]],
    })
    this.dateMin = new Date(this.getPastdate());
  }

  //getting data 
  public bodyParam: any = {};
  getInterviewProcessReport(page: number, pageSize: number, search: string, sortParam: any) {
    this.bodyParam = {};
    let body = {
      page: page,
      pageSize: pageSize,
      startDate: sortParam.startDate
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
    //by interview date
    if (sortParam?.dateStart) {
      body['interviewStartDate'] = GlobalMethod.formatDate(sortParam?.dateStart);
    }

    if (sortParam?.dateEnd) {
      body['interviewEndDate'] = GlobalMethod.formatDate(sortParam?.dateEnd);
    }

    /**modifed on */
    if (sortParam?.dateStartThree) {
      body['modifiedOnStartdate'] = GlobalMethod.formatDate(sortParam?.dateStartThree);
    }

    if (sortParam?.dateEndThree) {
      body['modifiedOnEnddate'] = GlobalMethod.formatDate(sortParam?.dateEndThree);
    }

    if (this.thId) {
      body['thid'] = this.thId
    }
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
    if (sortParam.practiceId && sortParam.practiceId.length !== 0) {
      let Ids = sortParam.practiceId.filter(n => n);
      body['practiceId'] = Ids.toString();
    }
    if (sortParam.prCommunityId && sortParam.prCommunityId.length !== 0) {
      let Ids = sortParam.prCommunityId.filter(n => n);
      body['practiceCommunityId'] = Ids.toString();
    }
    if (sortParam.subPracticeId && sortParam.subPracticeId.length !== 0) {
      let Ids = sortParam.subPracticeId.filter(n => n);
      body['subPracticeId'] = Ids.toString();
    }

    if (sortParam.source && sortParam.source.length !== 0) {
      let sourceIds = sortParam.source.filter(n => n);
      body['SourceType'] = sourceIds.toString();
    }

    this.bodyParam = body;
    this._reportServe.GetInterviewProcesss(body).subscribe(
      res => {
        this.candidateList = new MatTableDataSource(res['data']);
        this.paginationData = res['Paging'][0];
        this.candidateList.sort = this.sort;
      }
    )
  }

  //filter with talent id
  getDataTalent(data) {
    // this.resetSortFilter();
    this.thId = data.TH_ID;
    this.jumpFirstPage = false;
    this.jumpFirstPage = true;
    // this.getInterviewProcessReport(1, this.pazeSize, null, '&startDate=' + this.getPastdate());.
    this.getInterviewProcessReport(1, this.pazeSize, this.searchInput, this.sortParam);
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
  * pagination method
  * @param pageEvent 
  */
  getPagingData(pageEvent: any) {
    this.getInterviewProcessReport(pageEvent.pageIndex + 1, pageEvent.pageSize, this.searchInput, this.sortParam);
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
    this.getInterviewProcessReport(1, CONSTANTS.PAGE_SIZE, e, this.sortParam);
  }

  /***
 * download report  
 */
  dwnloadFileSingle() {
    let bodyData = {
      ...this.bodyParam,
      page: 1,
      pageSize: this.paginationData?.Total,
    }
    const _url= this._act?.snapshot?.url[1]?.path;
    let _apiUrl:string = 'Report/ExportToExcelInterviewProcesssReport';
    if(_url == "interview-process-report-uat"){
      _apiUrl = 'UAT/ExportToExcelInterviewProcesssReport';
    }
    this.http.post(`${environment.apiMainUrlNet}${_apiUrl}`, bodyData, { responseType: 'blob' }).subscribe(
      res => {
        saveAs(res, 'Interview_Process_Report.xls');
      },
      (error) => {
        this._share.showAlertErrorMessage.next('Something went wrong');
      }
    )
  }

  viewMoreDetailsModal(elm: any) {
    elm['title'] = elm?.CandidateName + '';
    const dialogRef = this.dialog.open(ReportDetailsModalComponent, {
      panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
      data: elm,
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%'
    });
  }
  
  //Get interview status for if video is uploaded
  getInterviewStatus(StatusId:number,StatusName:string, IsExceptionVideo:string, fileNameVideo:string){
    return (AtsCommonFuncService.getInterviewStatus(StatusId, StatusName, IsExceptionVideo, fileNameVideo));
  }
}
