import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatSort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { ExcelService } from 'projects/ats-global-system/src/app/core/common/excel.service';
import { CONSTANTS } from 'projects/ats-global-system/src/app/core/constant/constants';
import { ReportService } from '../report.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { UntypedFormBuilder } from '@angular/forms';
import { AtsCommonPrefix, GET_DEFAULT_DATE } from 'projects/ats-global-system/src/app/core/constant/common.const';


@Component({
  selector: 'app-candidate-int-to-onboar-video-com',
  templateUrl: './candidate-int-to-onboar-video-com.component.html',
  styleUrls: ['./candidate-int-to-onboar-video-com.component.scss'],
  providers: [DatePipe]
})
export class CandidateIntToOnboarVideoComComponent implements OnInit {

  displayedColumns = [
    "cid",
    'talentId',
    "c_name",
    "c_email",
    'accountName',
    "Tech_1_Date",
    "Tech_1_VideoMatchPercent",
    "Tech_1_VideoMatch",
    "Tech_1_updateVidScoreBackend",
    "Tech_2_Date",
    "Tech_2_VideoMatchPercent",
    "Tech_2_VideoMatch",
    "Tech_2_updateVidScoreBackend",
    "Tech_3_Date",
    "Tech_3_VideoMatchPercent",
    "Tech_3_VideoMatch",
    "Tech_3_updateVidScoreBackend",
    "Managerial_Date",
    "Managerial_VideoMatchPercent",
    "Managerial_VideoMatch",
    "Managerial_updateVidScoreBackend",
    "Management_Date",
    "Management_VideoMatchPercent",
    "Management_VideoMatch",
    "Management_updateVidScoreBackend",
    "HR_Offer_Date",
    "HR_Offer_VideoMatchPercent",
    "HR_Offer_VideoMatch",
    "HR_Offer_updateVidScoreBackend",
    "VideoCampareConsentByRec",
    "LOCATION_NAME",
    "DateOfJoining",
    "HRDay1Verification",
    "HRDay1Score",
    "HRDay1VideoMatch",
    "ISSDay1Verification",
    "ISSDay1Score",
    "ISSDay1VideoMatch",
    "RMDay1Verification",
    "RMDay1Score",
    "RMDay1VideoMatch",
    "HRDay7Verification",
    "HRDay7Score",
    "HRDay7VideoMatch"
  ]
  
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
    private _share: ShareService,
    private _fb: UntypedFormBuilder,

  ) { }

  ngOnInit() {
    this.filterFormInit();
  }
  ngAfterViewInit() {
    //this.sortParam = '&startDate=' + this.getPastdate();
    this.CandidateInterviewToOnboardingVideoCompReport(1, this.pazeSize, null, { startDate: this.getPastdate() });
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
    this.CandidateInterviewToOnboardingVideoCompReport(1, this.pazeSize, this.searchInput, data);

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
  CandidateInterviewToOnboardingVideoCompReport(page: number, pageSize: number, search: string, sortParam: any) {
    this.bodyParam = {};
    let body = {
      page: page,
      pageSize: pageSize
    }
    
    if (search) {
      body['search'] = search;
    }
    this.bodyParam = body;
    this._reportServe.CandidateInterviewToOnboardingVideoCompReport(body).subscribe(
      res => {
        this.candidateList = new MatTableDataSource(res['data']);
        this.paginationData = res['pagination'][0];
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
    this.CandidateInterviewToOnboardingVideoCompReport(1, this.pazeSize, this.searchInput, this.sortParam);
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
    this.CandidateInterviewToOnboardingVideoCompReport(pageEvent.pageIndex + 1, pageEvent.pageSize, this.searchInput, this.sortParam);
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
    this.CandidateInterviewToOnboardingVideoCompReport(1, CONSTANTS.PAGE_SIZE, e, this.sortParam);
  }

  

  exportAsXLSX(): void {
  let bodyData = {
      ...this.bodyParam,
      page: 1,
      pageSize: this.paginationData?.Total,
    }
    this._reportServe.CandidateInterviewToOnboardingVideoCompReport(bodyData).subscribe(
      res => {
        let candidateList = res['data'];
        let filterDataExcel = [];
        for (var key in candidateList) {
          let selectedData = {
            'CID': candidateList[key].cid,
            'Talent Id': candidateList[key].talent_id,
            'Name': candidateList[key].c_name,
            'Email': candidateList[key].c_email,
            'Account': candidateList[key].accountName,
            'Tech 1 Interview Date':  this.datepipe.transform(candidateList[key].Tech_1_Date, 'yyyy/MM/dd  h:mm a'),
            'Tech 1 Video Match Score': candidateList[key].Tech_1_VideoMatchPercent,
            'Tech 1 Video Match': candidateList[key].Tech_1_VideoMatch,
            'Tech 1 Score Updated from Backend': candidateList[key].Tech_1_updateVidScoreBackend,
            'Tech 2 Interview Date':  this.datepipe.transform(candidateList[key].Tech_2_Date, 'yyyy/MM/dd  h:mm a'),
            'Tech 2 Video Match Score': candidateList[key].Tech_2_VideoMatchPercent,
            'Tech 2 Video Match': candidateList[key].Tech_2_VideoMatch,
            'Tech 2 Score Updated from Backend': candidateList[key].Tech_2_updateVidScoreBackend,
            'Tech 3 Interview Date':  this.datepipe.transform(candidateList[key].Tech_3_Date, 'yyyy/MM/dd  h:mm a'),
            'Tech 3 Video Match Score': candidateList[key].Tech_3_VideoMatchPercent,
            'Tech 3 Video Match': candidateList[key].Tech_3_VideoMatch,
            'Tech 3 Score Updated from Backend': candidateList[key].Tech_3_updateVidScoreBackend,
            'Managerial Round Interview Date':this.datepipe.transform(candidateList[key].Managerial_Date, 'yyyy/MM/dd  h:mm a'),
            'Managerial Round Video Match Score': candidateList[key].Managerial_VideoMatchPercent,
            'Managerial Round Video Match': candidateList[key].Managerial_VideoMatch,
            'Managerial Score Updated from Backend': candidateList[key].Managerial_updateVidScoreBackend,
            'Management Round Interview Date':this.datepipe.transform(candidateList[key].Management_Date, 'yyyy/MM/dd  h:mm a'),
            'Management Round Video Match Score': candidateList[key].Management_VideoMatchPercent,
            'Management Round Video Match': candidateList[key].Management_VideoMatch,
            'Management Score Updated from Backend': candidateList[key].Management_updateVidScoreBackend,
            'HR Offer Discussion Round Interview Date':  this.datepipe.transform(candidateList[key].HR_Offer_Date, 'yyyy/MM/dd  h:mm a'),
            'Final Consent By Recruiter': candidateList[key].VideoCampareConsentByRec,
            'HR Offer Discussion Round Video Match Score': candidateList[key].HR_Offer_VideoMatchPercent,
            'HR Offer Discussion Round Video Match': candidateList[key].HR_Offer_VideoMatch,
            'HR Offer Discussion Round Score Updated from Backend': candidateList[key].HR_Offer_updateVidScoreBackend,
            'Joining Location': candidateList[key].LOCATION_NAME,
            'Date of Joining': this.datepipe.transform(candidateList[key].DateOfJoining , 'yyyy/MM/dd'),
            'HR Day 1 Verification': candidateList[key].HRDay1Verification,
            'HR Day 1 Score': candidateList[key].HRDay1Score,
            'HR Day 1 Video Match': candidateList[key].HRDay1VideoMatch,
            'ISS Day 1 Verification': candidateList[key].ISSDay1Verification,
            'ISS Day 1 Score': candidateList[key].ISSDay1Score,
            'ISS Day 1 Video Match': candidateList[key].ISSDay1VideoMatch,
            'RM Day 1 Verification': candidateList[key].RMDay1Verification,
            'RM Day 1 Score': candidateList[key].RMDay1Score,
            'RM Day 1 Video Match': candidateList[key].RMDay1VideoMatch,
            'HR Day 7 Verification': candidateList[key].HRDay7Verification,
            'HR Day 7 Score': candidateList[key].HRDay7Score,
            'HR Day 7 Video Match': candidateList[key].HRDay7VideoMatch,
          };
          filterDataExcel.push(selectedData);

        }
        let sn = filterDataExcel;
        this._excelService.exportAsExcelFile(filterDataExcel, 'candidate-interview-onboarding-video-Report');
      }
    );
  }

}
