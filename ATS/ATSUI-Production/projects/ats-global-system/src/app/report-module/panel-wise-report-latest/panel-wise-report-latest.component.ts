import { Component, OnInit, ViewChild } from '@angular/core';
import { GlobalMethod } from '../../core/common/global-method';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { AtsCommonPrefix } from '../../core/constant/common.const';
import { MatSort } from '@angular/material/sort';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { GetSetStorageService } from '../../core/services/get-set-storage.service';
import { ReportService } from '../report.service';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { DatePipe } from '@angular/common';
import { ExcelService } from '../../core/common/excel.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ShareService } from '../../core/services/share.service';
import { saveAs } from "file-saver";
@Component({
  selector: 'app-panel-wise-report-latest',
  templateUrl: './panel-wise-report-latest.component.html',
  styleUrls: ['./panel-wise-report-latest.component.scss'],
  providers: [DatePipe]
})
export class PanelWiseReportLatestComponent implements OnInit {

  displayedColumns = ['PanelID', 'PanelName', 'Skill', 'account', 'grade', 'roundId', 'cid',
    'candidateName', 'candidateGrade', 'tId', 'PrimarySkillTID', 'subSkillTID', 'AccountTID', 'interviewDate', 'interviewRound',
    'interviewStatus', 'tech1Internal', 'CurrentStatus', 'recruiterName',

  ];
  public sortFormFilter: UntypedFormGroup = new UntypedFormGroup({});
  public userData: any = {};
  public candidateList: any = [];
  public searchInput: string;
  public paginationData: any;
  public pazeOption: any = [10, 20, 50, 100];
  public pazeSize: any = 10;
  public thId: string = '';
  public jumpFirstPage: boolean = false;
  public isResetSearch: boolean = false;
  public isResetFilter: boolean = false;
  public sortParam: string = '';
  public cidColName: string = AtsCommonPrefix.CidColName;
  public cidPrefix: string = AtsCommonPrefix.CidPrefix;
  @ViewChild(MatSort) sort: MatSort;
  public sortTable: string = '';
  @ViewChild('paginatorRef', { static: true }) paginatorCompRef;
  constructor(
    private _storage: GetSetStorageService,
    private _reportServe: ReportService,
    public dialog: MatDialog,
    public datepipe: DatePipe,
    public _excelService: ExcelService,
    private http: HttpClient,
    private _share: ShareService,
    private _fb: UntypedFormBuilder,
    private _act: ActivatedRoute

  ) { }

  ngOnInit() {
    this.filterFormInit();
    this.userData = this._storage.getSetUserData();
  }
  ngAfterViewInit() {
    this.sortParam = '&startDate=' + this.getPastdate();
    this.getPanelReportDetails(1, this.pazeSize, { startDate: this.getPastdate() });
  }

  resetSortFilter() {
    this.isResetSearch = true;
    this.isResetFilter = true;
    this.searchInput = '';
    this.sortParam = '';
  }
  /***
   * reset paging
   */
  resetPagination() {
    this.paginatorCompRef.paginator.pageIndex = 0;
  }

  /* filter form Init
  */
  filterFormInit() {
    this.sortFormFilter = this._fb.group({
      dateFrom: [null],
      dateTo: [{ value: null, disabled: true }]
    })

  }

  //getting data by parameter ids by filter
  public bodyParam: any = {}
  getPanelReportDetails(page: number, pageSize: number, sortParam: any) {
    this.bodyParam = {};
    let body = {
      page: page,
      pageSize: pageSize,
      startDate: sortParam.startDate
    }
    if (sortParam?.dateFrom) {
      body['StartDate'] = GlobalMethod.formatDate(sortParam?.dateFrom);
    }

    if (sortParam?.dateTo) {
      body['EndDate'] = GlobalMethod.formatDate(sortParam?.dateTo);
    }
    this.bodyParam = body;
    this._reportServe.getPanelWiseReportNew(body).subscribe(
      res => {
        this.candidateList = new MatTableDataSource(res['data']);
        this.paginationData = res['Paging'][0];
      }
    )
  }

  // public selectedDate: any = {};
  // getDateRange(data: any) {
  //   if (data.startDate || data.endDate) {
  //     this.selectedDate['startDate'] = data.startDate ? data.startDate : new Date(this.getPastdate());
  //     this.selectedDate['endDate'] = data.endDate;
  //   }
  //   else {
  //     this.selectedDate['startDate'] = new Date(this.getPastdate());
  //     this.selectedDate['endDate'] = null;
  //   }
  // }
  /**
  * pagination method
  * @param pageEvent 
  */
  getPagingData(pageEvent: any) {
    this.getPanelReportDetails(pageEvent.pageIndex + 1, pageEvent.pageSize, this.sortParam);
  }

  /***
     * search
     */
  getSearchValueKey(e: any) {
    this.isResetSearch = false;
    this.searchInput = e;
    this.jumpFirstPage = false;
    this.jumpFirstPage = true;
    // this.getPanelReportDetails(1, this.pazeSize, e, this.sortParam);
  }

  getSortData(data: string) {
    this.isResetSearch = true;
    this.isResetFilter = false;
    this.searchInput = '';
    this.sortParam = data;
    this.resetPagination();
    this.getPanelReportDetails(1, this.pazeSize, data);
  }


  /***
  * get Paste Date
  */
  getPastdate() {
    /**default date financial year */
    const today = new Date();
    const fiscalYearStart = new Date(today.getFullYear(), 3, 1);
    let dateParseFiscal = GlobalMethod.formatDate(fiscalYearStart);
    
    return dateParseFiscal;
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
    const _url = this._act?.snapshot?.url[1]?.path;
    let _apiUrl: string = 'Report/ExportToExcelPanelWiseReportNew';
    // if(_url == "salary-deviation-report-uat"){
    //   _apiUrl = 'UAT/ExportToExcelSalaryDeviationReport';
    // }

    this.http.post(`${environment.apiMainUrlNet}${_apiUrl}`, bodyData, { responseType: 'blob' }).subscribe(
      res => {
        saveAs(res, 'panel_wise-report.xls');
      },
      (error) => {
        this._share.showAlertErrorMessage.next('Something went wrong');
      }
    )
  }

}
