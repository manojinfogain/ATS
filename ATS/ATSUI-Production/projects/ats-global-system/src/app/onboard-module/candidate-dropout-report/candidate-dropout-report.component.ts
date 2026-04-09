import { Component, OnInit, ViewChild } from '@angular/core';
import { GlobalMethod } from '../../core/common/global-method';
import { CONSTANTS } from '../../core/constant/constants';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { AtsCommonPrefix } from '../../core/constant/common.const';
import { OnboardService } from '../onboard.service';
import { GetSetStorageService } from '../../core/services/get-set-storage.service';
import { ExcelService } from '../../core/common/excel.service';
import { DatePipe } from '@angular/common';
import { GlobalCommonMethodService } from '../../core/common/global-common-method.service';
import { CidPrefixPipe } from '../../shared/pipes-directives/pipes/cid-prefix.pipe';

@Component({
  selector: 'app-candidate-dropout-report',
  templateUrl: './candidate-dropout-report.component.html',
  styleUrls: ['./candidate-dropout-report.component.scss'],
  providers: [DatePipe,CidPrefixPipe],
})
export class CandidateDropoutReportComponent implements OnInit {
  displayedColumns = [
    'Talent_ID',
    'Cid',
    'EmployeeName',
    'empPersonalEmail',
    'contactNo',
    'priRecruiterName',
    'secRecruiterName',
    'joiningDate',
    'joininingLocation',
    'offerStatus',
  ];
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
    private _fb: UntypedFormBuilder,
    private _onboard: OnboardService,
    private _storage: GetSetStorageService,
    private _excelService: ExcelService,
    public datepipe: DatePipe,
    private globalMethod: GlobalCommonMethodService,
    private _cidPrefix: CidPrefixPipe
  ) {}

  ngOnInit() {
    this.filterFormInit();
    this.userData = this._storage.getSetUserData();
  }

  ngAfterViewInit() {
    this.getDropoutCandidateList(1, CONSTANTS.PAGE_SIZE, null, {
      startDate: null,
    });
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
    this.getDropoutCandidateList(
      1,
      CONSTANTS.PAGE_SIZE,
      this.searchInput,
      data
    );
  }

  /**
   * get selected talent Id
   * @param data
   */
  getDataTalent(data) {
    this.resetSortFilter();
    this.thId = data.TH_ID;
    this.paginatorCompRef.paginator.pageIndex = 0;
    this.getDropoutCandidateList(
      1,
      CONSTANTS.PAGE_SIZE,
      this.searchInput,
      this.sortParam
    );
  }

  /**
   * pagination method
   * @param pageEvent
   */
  getPagingData(pageEvent: any) {
    this.getDropoutCandidateList(
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
    this.getDropoutCandidateList(1, CONSTANTS.PAGE_SIZE, e, this.sortParam);
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
      dateStart: [null],
      dateEnd: [{ value: null, disabled: true }],
    });
  }

  public bodyParam: any = {};
  getDropoutCandidateList(
    page: number,
    pageSize: number,
    search: any,
    sortParam: any
  ) {
    this.bodyParam = {};
    let body = {
      page: page,
      pageSize: pageSize,
    };
    if (sortParam?.dateStart) {
      body['startDate'] = GlobalMethod.formatDate(sortParam?.dateStart);
    }
    if (sortParam?.dateEnd) {
      body['endDate'] = GlobalMethod.formatDate(sortParam?.dateEnd);
    }

    if (this.thId) {
      body['thid'] = this.thId;
    }
    if (search) {
      body['search'] = search;
    }
    if (sortParam.location && sortParam.location.length !== 0) {
      let locIds = sortParam.location.filter((n) => n);
      body['location'] = locIds.toString();
    }
    // if (sortParam.offerstatus && sortParam.offerstatus.length !== 0) {
    //   let offerstatusIds = sortParam.offerstatus.filter(n => n);
    //   body['offerStatus'] = offerstatusIds.toString();
    // }

    this.bodyParam = body;
    this._onboard.GetdropoutCandidateReport(body).subscribe((res) => {
      this.candidateList = res['data'];
      this.paginationData = res['pagination'][0];
    });
  }

  /***
   * export excel
   */
  exportAsXLSX(): void {
    let queryString = `page=1&pageSize=${this.paginationData?.Total}&search=${
      this.searchInput ? this.searchInput.trim() : ''
    }${this.sortParam ? this.sortParam : ''}`;
    this.bodyParam['page'] = 1;
    this.bodyParam['pageSize'] = this.paginationData?.Total;
    this._onboard.GetdropoutCandidateReport(this.bodyParam).subscribe((res) => {
      let candidateList = res['data'];
      let filterDataExcel = [];
      for (let key in candidateList) {
        let row = candidateList[key];
        let selectedData = {
          'Talent ID': row.TalentID,
          // 'CID': row.CID,
          CID: this._cidPrefix.transform(row.CID, row.ProfileId),
          'Candidate Name': row.CandidateName,
          'Personal Email': row.PersonalEmailID,
          'Contact No': row.PhoneNo,
          'Primary Recruiter': row.PrimaryRecruiter,
          'Secondary Recruiter': row.SecondaryRecruiter,
          // 'Date of Joining': this.datepipe.transform(row.DateOfJoining, 'yyyy/MM/dd'),
          'Date of Joining': this.globalMethod.convertToExcelDate(
            row.DateOfJoining
          ),
          'Joining Location': row.JoiningLocation,
          'Offer Status': row.OfferStatus,
        };
        filterDataExcel.push(selectedData);
      }
      this._excelService.exportAsExcelFile(
        filterDataExcel,
        'Candidate Dropout Report'
      );
    });
  }
}
