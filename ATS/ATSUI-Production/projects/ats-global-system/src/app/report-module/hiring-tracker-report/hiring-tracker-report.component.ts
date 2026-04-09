import { Component, OnInit, ViewChild } from '@angular/core';
import { GlobalMethod } from '../../core/common/global-method';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { GetSetStorageService } from '../../core/services/get-set-storage.service';
import { ReportService } from '../report.service';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { AtsCommonPrefix } from '../../core/constant/common.const';
import { MatSort } from '@angular/material/sort';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { DatePipe } from '@angular/common';
import { ExcelService } from '../../core/common/excel.service';
import { HttpClient } from '@angular/common/http';
import { ShareService } from '../../core/services/share.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { saveAs } from "file-saver";
@Component({
  selector: 'app-hiring-tracker-report',
  templateUrl: './hiring-tracker-report.component.html',
  styleUrls: ['./hiring-tracker-report.component.scss'],
  providers: [DatePipe]
})
export class HiringTrackerReportComponent implements OnInit {

  displayedColumns = ['tId', 'RoleName', 'RequirementType', 'Grade', 'Experience', 'Practice', 'AccountName',
    'PrimarySkill', 'Location', 'TagAgeStartDate', 'TagAgeing', 'HiringRequestor', 'PrimaryRecruiter', 'SecondaryRecruiter'
    , 'TotalProfilesPresented', 'TotalActiveProfiles', 'ScreenReject', 'ScreenPending', 'WithdrawalbyCandidate',
    'Candidatet1stLevelInterview',
    'Candidatesat2ndLevelInterview', 'Candidatesat3rdLevelInterview', 'InterviewReject', 'FinalLevel',
    'candidatesShortlist', 'OfferedCandidates', 'OfferDeclined', 'cJoined', 'YTJ', 'ApprovalDeclined', 'Interviewers'
    , 'Cid', 'candName', 'Gender', 'profSource', 'DateOfJoining',
    'DateOfOffer', 'Status'
  ];
  public userData: any = {};
  public sortFormFilter: UntypedFormGroup = new UntypedFormGroup({});
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
  public cidColName: string = AtsCommonPrefix.CidColName;
  public cidPrefix: string = AtsCommonPrefix.CidPrefix;
  @ViewChild(MatSort) sort: MatSort;
  public sortTable: string = '';
  @ViewChild('paginatorRef', { static: true }) paginatorCompRef;
  public isSubList: boolean = true;
  constructor(
    private _storage: GetSetStorageService,
    private _reportServe: ReportService,
    public dialog: MatDialog,
    public datepipe: DatePipe,
    public _excelService: ExcelService,
    private _fb: UntypedFormBuilder,
    private http: HttpClient,
    private _share: ShareService,
    private _act: ActivatedRoute

  ) { }

  ngOnInit() {
    /**remove transfer option */
    this.userData = this._storage.getSetUserData();
    this.filterFormInit();
  }
  ngAfterViewInit() {
    // this.sortParam = '&startDate=' + this.getPastdate();
    this.getCandidateOffer(1, this.pazeSize, null, { startDate: null });
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
      location: [[]],
      dateFrom: [null],
      dateTo: [{ value: null, disabled: true }],
       requisitionType: [[]],
       accountType: [[]],
      recruiterId: [[]],
      primarySkill: [[]],
      talentStatusID: [[]],
    })

  }


  //getting data
  public bodyParam: any = {};
  getCandidateOffer(page: number, pageSize: number, search: string, sortParam: any) {
    // console.log(sortParam);
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
      body['search'] = search
    }

    // if (sortParam.offerstatus && sortParam.offerstatus.length !== 0) {
    //   let offerstatusIds = sortParam.offerstatus.filter(n => n);
    //   body['offerstatus'] = offerstatusIds.toString();
    // }

    if (sortParam.recruiterId && sortParam.recruiterId.length !== 0) {
      let recIds = sortParam.recruiterId.filter(n => n);
      body['recruiterId'] = recIds.toString();
    }

    if (sortParam.location && sortParam.location.length !== 0) {
      let locationIds = sortParam.location.filter(n => n);
      body['location'] = locationIds.toString();
    }

    if (sortParam.accountType && sortParam.accountType.length !== 0) {
      let accountTypeIds = sortParam.accountType.filter(n => n);
      body['accountId'] = accountTypeIds.toString();
    }

       
    if (sortParam.requisitionType && sortParam.requisitionType.length !== 0) {
      let reqisitionIds = sortParam.requisitionType.filter(n => n);
      body['requisitionType'] = reqisitionIds.toString();
    }
    if (sortParam.primarySkill && sortParam.primarySkill.length !== 0) {
      let Ids = sortParam.primarySkill.filter(n => n);
      body['primarySkill'] = Ids.toString();
    }
    
    if (sortParam?.talentStatusID && sortParam?.talentStatusID.length !== 0) {
      let Ids = sortParam?.talentStatusID.filter(n => n);
      body['talentStatus'] = Ids.toString();
    }
    this.bodyParam = body;
    let _apiUrl: string = 'Report/GetTalentIdReportRenuTeam';
    this._reportServe.getHiringDetailsReport(body, _apiUrl).subscribe(
      res => {
        this.candidateList = new MatTableDataSource(res['data']);
        this.paginationData = res['Paging'][0];
      }
    )
  }


  /**
  * pagination method
  * @param pageEvent 
  */
  getPagingData(pageEvent: any) {
    this.getCandidateOffer(pageEvent.pageIndex + 1, pageEvent.pageSize, this.searchInput, this.sortParam);
  }

  /***
     * search
     */
  getSearchValueKey(e: any) {
    //this.isResetFilter = true;
    this.isResetSearch = false;
    //  this.sortParam = '';
    this.searchInput = e;
    this.jumpFirstPage = false;
    this.jumpFirstPage = true;
    this.getCandidateOffer(1, this.pazeSize, e, this.sortParam);
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
    this.resetPagination();
    this.getCandidateOffer(1, this.pazeSize, this.searchInput, data);
  }


  /***
   * get PAst Date
   */
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

  /***
* download report excel
*/
downloadReportAsExel() {
    let bodyData = {
      ...this.bodyParam,
      page: 1,
      pageSize: this.paginationData?.Total,
    }
    let _apiUrl: string = 'Report/ExportToExcelTalentIdReportRenuTeam';
    this.http.post(`${environment.apiMainUrlNet}${_apiUrl}`,bodyData, { responseType: 'blob' }).subscribe(
      res => {
        saveAs(res, 'Hiring_Tracker_Report.xls');
      },
      (error) => {
        this._share.showAlertErrorMessage.next('Something went wrong');
      }
    )
  }

}
