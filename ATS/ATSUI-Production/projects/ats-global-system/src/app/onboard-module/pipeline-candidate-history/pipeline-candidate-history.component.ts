import { SelectionModel, } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { OnboardService } from '../onboard.service';
import { GetSetStorageService } from '../../core/services/get-set-storage.service';
import { ShareService } from '../../core/services/share.service';
import { GlobalMethod } from '../../core/common/global-method';
import { ATSCONFIG } from 'projects/ats-global-system/src/config';
import { CONSTANTS } from '../../core/constant/constants';
import { DatePipe } from '@angular/common';
import { ExcelService } from '../../core/common/excel.service';
import { GlobalCommonMethodService } from '../../core/common/global-common-method.service';
import { saveAs } from "file-saver";
import { el } from '@fullcalendar/core/internal-common';
@Component({
  selector: 'app-pipeline-candidate-history',
  templateUrl: './pipeline-candidate-history.component.html',
  styleUrls: ['./pipeline-candidate-history.component.scss'],
   providers: [DatePipe]
})
export class PipelineCandidateHistoryComponent implements OnInit {
  public displayedColumns = [
    'talentId',
    'Cid',
    'CandidateName',
    'EmailID',
    'EmailSentOn',
    'EmailStatus',
    'doj',
    'joiningLoc',
    'PhoneNo',
    'offerNum',
   // 'emailIdOrg',
    'primaryrecruiter',
    'action',
  ];
  public thId: string;
  public userData: any = {};
  public searchInput: string = '';
  public sortParam: any = '';
  public paginationData: any;
  public candidateHistoryList: MatTableDataSource<any> = new MatTableDataSource<any>();
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
    public _share: ShareService,
    public datepipe: DatePipe,
    private _excelService: ExcelService,
    private GlobalCommonMethod: GlobalCommonMethodService
  ) { }
  public specialLogin: boolean = false;
  public topFirstDateStart: string;
  public topFirstDateEnd: string;
  public showManualPipelineButton: boolean = false;

  ngOnInit() {
    this.userData = this._storage.getSetUserData();

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


  ngAfterViewInit(): void {
    this.sortParam = {};
    this.getPipelineHistoryMethod(1, 10, null, this.sortParam);
  }

  

  downloadDocument(element: any): void {
    this._onboardserve.DownloadPipelineDocument(element?.Id).subscribe((res) => {
      saveAs(res, this.GlobalCommonMethod.removeLastExtension(element?.AttachmentFileName));
 
    });
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
    this.getPipelineHistoryMethod(
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
      // offerstatus: ['all'],
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
    this.getPipelineHistoryMethod(1, CONSTANTS.PAGE_SIZE, null, null);
  }

  /**
   * pagination method
   * @param pageEvent
   */
  getPagingData(pageEvent: any) {
    this.getPipelineHistoryMethod(
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
    this.getPipelineHistoryMethod(1, CONSTANTS.PAGE_SIZE, e, this.sortParam);
  }
  /**
   * get candidate list
   * @param page
   * @param pageSize
   * @param search
   */
  public bodyParam: any = {};
  getPipelineHistoryMethod(
    page: number,
    pageSize: number,
    search: any,
    sortParam: any
  ) {
      this.bodyParam = {};
    let Body = {
      PageNo: page,
      PageSize: pageSize,
    };
    if (search) {
      Body['search'] = search;
    }
    // if (sortParam['dateFrom'] == null) {
    //   Body['startDateFirstUTC'] = this.topFirstDateStart;
    //   Body['endDateFirstUTC'] = this.topFirstDateEnd;
    // }
    if (sortParam['dateFrom']) {
      // Body['startDate'] = GlobalMethod.convertToUTCDateTime(GlobalMethod.formatDate(sortParam['dateFrom']) + ' ' + '00:00:00')
      Body['startDate'] = GlobalMethod.formatDate(sortParam['dateFrom']);
    }
    if (sortParam['dateTo']) {
      // Body['endDate'] = GlobalMethod.convertToUTCDateTime(GlobalMethod.formatDate(sortParam['dateTo']) + ' ' + '23:59:00')
      Body['endDate'] = GlobalMethod.formatDate(sortParam['dateTo']);
    }
  
    if (sortParam.location && sortParam.location.length !== 0) {
      let locationIds = sortParam.location.filter((n) => n);
      Body['location'] = locationIds.toString();
    }
    
     this.bodyParam = Body;
    this._onboardserve.GetPipelineMailSentList(Body).subscribe((res) => {
      this.candidateHistoryList = new MatTableDataSource<any>(res['data']);
      this.paginationData = res['Paging'];
    });
  }


/***
   * export excel
   */
  public dateFormat: string = 'yyyy/MM/dd';
exportAsXLSX(): void {
  this.bodyParam['PageNo'] = 1;
  this.bodyParam['PageSize'] = this.paginationData?.Total;
  this._onboardserve.GetPipelineMailSentList(this.bodyParam).subscribe(
    res => {
      let candidateList = res['data'];
      let filterDataExcel = [];
      for (var key in candidateList) {
        let selectedData = {
          'Talent ID': candidateList[key].talentID,
          'CID': candidateList[key].candidateId ? (candidateList[key].candidateId |candidateList[key].ProfileId) : '',
          'Candidate Name': candidateList[key].Name,
          'Candidate Personal Email ID': candidateList[key].email,
          'Email Sent On': this.datepipe.transform(candidateList[key].EmailSentOn, this.dateFormat ),
          //  candidateList[key].EmailSentOn,
          'Email Status': candidateList[key].EmailStatus,
          'Date of Joining': this.datepipe.transform(candidateList[key].joiningDate, this.dateFormat ),
          'Joining Location': candidateList[key].JoiningLocationName,
          'Phone Number': candidateList[key].phone,
          'Offer Number': candidateList[key].OfferNo,
       //   'Email ID (Org)': candidateList[key].emailIdOrg,
          'Primary Recruiter': candidateList[key].primaryrecruiterName,
      
        };
        filterDataExcel.push(selectedData);
      }
      this._excelService.exportAsExcelFile(filterDataExcel, 'Manual Pipeline Candidate History');
    }
  );
}
 
}
