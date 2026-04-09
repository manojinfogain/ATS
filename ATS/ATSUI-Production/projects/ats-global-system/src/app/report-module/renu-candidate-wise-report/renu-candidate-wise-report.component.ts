import { Component, OnInit, ViewChild } from '@angular/core';
import { GlobalMethod } from '../../core/common/global-method';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { AtsCommonPrefix, GET_DEFAULT_DATE } from '../../core/constant/common.const';
import { MatSort } from '@angular/material/sort';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { GetSetStorageService } from '../../core/services/get-set-storage.service';
import { ReportService } from '../report.service';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { DatePipe } from '@angular/common';
import { ExcelService } from '../../core/common/excel.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { saveAs } from "file-saver";
import { ShareService } from '../../core/services/share.service';
@Component({
  selector: 'app-renu-candidate-wise-report',
  templateUrl: './renu-candidate-wise-report.component.html',
  styleUrls: ['./renu-candidate-wise-report.component.scss'],
  providers: [DatePipe]
})
export class RenuCandidateWiseReportComponent implements OnInit {

  displayedColumns = ['tId', 'createdOn', 'finalApprovedDate', 'Cid', 'CandidateName', 'EmployeeId',
    'Gender', 'Email', 'MobileNumber', 'Dob', 'CurrentEmployer', 'CurrentLocation', 'Experience', 'prSkillCandidate'
    , 'subSkillCandidate', 'prSkillCThid', 'subSkillThid', 'AccountName', 'DepartmentUnit',
    'BU', 'Designation', 'CurrentSalary', 'ExpectedSalary', 'pendingWithLeaderHiringDate',
    'JdClarification', 'PanelAvailable', 'OffshoreOnshore', 'EmploymentType', 'TalentCubeCandidate', 'TalentCubeTHID', 'CandidateGrade'
    , 'talentGrade', 'SourcingDate', 'sreenRoundApprovalHmDate', 'sreenRoundStatus', 'profileApproevedBy'
    , 'techRound1Date', 'techRound1Status', 'techRound2Date', 'techRound2Status', 'techRound3Date', 'techRound3Status',
    'managerialRoundDate', 'managerialRoundStatus',
    'ManagementRoundDate', 'ManagementRoundStatus',  'hrDiscussionDate', 'hrDiscussionStatus',
    'OfferApprovalInitiationDate', 'TagLeadApprovalDate', 'FirstApproverName', 'FirstOfferApproverDate', 'secondApproverName',
    'secondOfferApproverDate', 'thirdofferApproverName', 'thirdOfferApproverDate', 'offeredDate', 'candidateRevertDate',
     'PrimaryRecruiterName', 'secondryRecruiterName', 'recruiterRmName', 'doj',
    'Source', 'SourceName', 'status','Status', 'reasonForDrop'
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
    private _share: ShareService
    // private _act: ActivatedRoute

  ) { }

  ngOnInit() {
    /**remove transfer option */
    this.userData = this._storage.getSetUserData();
    this.filterFormInit();
  }
  ngAfterViewInit() {
    // this.sortParam = '&startDate=' + this.getPastdate();
    this.getCandidateWiseReport(1, this.pazeSize, null, { startDate: null });
  }

  /***
   * reset paging
   */
  resetPagination() {
    this.paginatorCompRef.paginator.pageIndex = 0;
  }

  //form for filter
  //public sortFormFilter: any
  filterFormInit() {
    this.sortFormFilter = this._fb.group({
      dateFrom: [new Date(this.getPastdate())],
      dateTo: [{ value: null }],
      dateStart: [null],
      dateEnd: [{ value: null, disabled: true }],
      deliveryUnit: [[]],
      accountType: [[]],
      recruiterId: [[]],
      primarySkill: [[]],
      // practiceId: [[]],
      // prCommunityId: [[]],
      subPracticeId: [[]],
      source: [[]],
      talentStatusID: [[]],
    })
    // this.dateMin = new Date(this.getPastdate());
  }

  //getting data 
  public bodyParam: any = {};
  getCandidateWiseReport(page: number, pageSize: number, search: string, sortParam: any) {
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
    // if (sortParam.practiceId && sortParam.practiceId.length !== 0) {
    //   let Ids = sortParam.practiceId.filter(n => n);
    //   body['practiceId'] = Ids.toString();
    // }
    // if (sortParam.prCommunityId && sortParam.prCommunityId.length !== 0) {
    //   let Ids = sortParam.prCommunityId.filter(n => n);
    //   body['practiceCommunityId'] = Ids.toString();
    // }
    // if (sortParam.subPracticeId && sortParam.subPracticeId.length !== 0) {
    //   let Ids = sortParam.subPracticeId.filter(n => n);
    //   body['subPracticeId'] = Ids.toString();
    // }

    if (sortParam.source && sortParam.source.length !== 0) {
      let sourceIds = sortParam.source.filter(n => n);
      body['SourceType'] = sourceIds.toString();
    }
    if (sortParam?.talentStatusID && sortParam?.talentStatusID.length !== 0) {
      let Ids = sortParam?.talentStatusID.filter(n => n);
      body['talentStatus'] = Ids.toString();
    }
    this.bodyParam = body;
    let _apiUrl: string = 'Report/GetCandidateWiseReport';
    this._reportServe.GetCandidateWiseReport(body, _apiUrl).subscribe(
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
    this.getCandidateWiseReport(pageEvent.pageIndex + 1, pageEvent.pageSize, this.searchInput, this.sortParam);
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
    this.getCandidateWiseReport(1, this.pazeSize, e, this.sortParam);
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
    this.getCandidateWiseReport(1, this.pazeSize, this.searchInput, data);
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
  

  /***
* download report excel
*/
  downloadReportAsExel() {
    let bodyData = {
      ...this.bodyParam,
      page: 1,
      pageSize: this.paginationData?.Total,
    }
    let _apiUrl: string = 'Report/ExportToExcelCandidateWiseReport';
    this.http.post(`${environment.apiMainUrlNet}${_apiUrl}`, bodyData, { responseType: 'blob' }).subscribe(
      res => {
        saveAs(res, 'Candidate_wise_Report.xls');
      },
      (error) => {
        this._share.showAlertErrorMessage.next('Something went wrong');
      }
    )
  }


}
