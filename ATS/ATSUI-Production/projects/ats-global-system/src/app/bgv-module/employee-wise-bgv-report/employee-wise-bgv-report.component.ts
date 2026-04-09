import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { GlobalMethod } from '../../core/common/global-method';
import { AtsCommonPrefix, SPECIALACCESSUSER } from '../../core/constant/common.const';
import { CONSTANTS } from '../../core/constant/constants';
import { GetSetStorageService } from '../../core/services/get-set-storage.service';
import { BgvServiceService } from '../bgv-service.service';
import { ExcelService } from '../../core/common/excel.service';

@Component({
  selector: 'app-employee-wise-bgv-report',
  templateUrl: './employee-wise-bgv-report.component.html',
  styleUrls: ['./employee-wise-bgv-report.component.scss']
})
export class EmployeeWiseBgvReportComponent implements OnInit {
  public displayedColumns: string[] = [];
  //  displayedColumns = ['talentId', 'Cid', 'CandidateName', 'EmailID', 'PhoneNo', 'primarySkill', 'priRecruiter',
  //    'secondRecruiter', 'offerDate', 'joiningDate', 'joiningLocation', 'cifStatus', 'candiSubStatus', 'day1Status', 'appStatusProg',
  //    //'recVerification','hrVerification',
  //    'approveStatus', 'dormantStatus', 'action'];
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
    public dialog: MatDialog,
    private _storage: GetSetStorageService,
    private _fb: UntypedFormBuilder,
    private _bgvServ: BgvServiceService,
    private _excelService: ExcelService,
  ) {
  }

  ngOnInit() {
    this.userData = this._storage.getSetUserData();
    this.filterFormInit();
    //  if (this.userData?.RoleId == 1) {
    //  this.displayedColumns = ['talentId', 'Cid', 'CandidateName', 'EmployeeID', 'OfficialEmailID', 'EmailID', 'PhoneNo', 'primarySkill', 'candidateType', 'priRecruiter',
    //    'secondRecruiter', 'offerDate', 'joiningDate', 'joiningLocation', 'onboardingMode', 'cifStatus', 'candiSubStatus', 'day1Status',
    //    'approveStatus', 'dormantStatus', 'action'];
    this.displayedColumns = [
      'srNo',
      'talentID',
      'employeeId',
      'employeeName',
      'designation',
      'grade',
      'doj',
      'legalEntity',
      'location',
      'bgvType',
      'initiationDate',
      'status',
      'colorCode',
      'completionDate',
      'slaInDays',
      'slaStatus'
    ];
    //  } else if (this.userData?.RoleId == 2) {
    //    this.displayedColumns = ['talentId', 'Cid', 'CandidateName', 'EmailID', 'PhoneNo', 'primarySkill', 'priRecruiter',
    //      'secondRecruiter', 'offerDate', 'joiningDate', 'joiningLocation', 'cifStatus',
    //      // 'candiSubStatus','day1Status',
    //      'appStatusProg', 'approveStatus', 'dormantStatus', 'action'];
    //  } else {

    //  }

  }

  ngAfterViewInit() {
    this.getOnboardingCandidateList(1, CONSTANTS.PAGE_SIZE, null, { startDate: null });
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
    this.getOnboardingCandidateList(1, CONSTANTS.PAGE_SIZE, this.searchInput, data);
  }


  /**
   * get selected talent Id
   * @param data 
   */
  getDataTalent(data) {
    this.resetSortFilter();
    this.thId = data.TH_ID;
    this.paginatorCompRef.paginator.pageIndex = 0;
    this.getOnboardingCandidateList(1, CONSTANTS.PAGE_SIZE, this.searchInput, this.sortParam)
  }

  /**
 * pagination method
 * @param pageEvent 
 */
  getPagingData(pageEvent: any) {
    this.getOnboardingCandidateList(pageEvent.pageIndex + 1, pageEvent.pageSize, this.searchInput ? this.searchInput : null, this.sortParam);
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
    this.getOnboardingCandidateList(1, CONSTANTS.PAGE_SIZE, e, this.sortParam);
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
      offerstatus: [[]],
      bgvFinalStatus: [[]]
    })
  }


  public bodyParam: any = {};
  getOnboardingCandidateList(page: number, pageSize: number, search: any, sortParam: any) {
     this.bodyParam = {};
     let body = {
       page: page,
       pageSize: pageSize
     }
     //
     if (sortParam?.dateStart) {
      body['StartDOJ'] = GlobalMethod.formatDate(sortParam?.dateStart);
    }
    if (sortParam?.dateEnd) {
      body['EndDOJ'] = GlobalMethod.formatDate(sortParam?.dateEnd);
    }

    if (sortParam?.offerstatus && sortParam?.offerstatus.length !== 0) {
      let offerstatusIds = sortParam.offerstatus.filter(n => n);
      body['OfferStatusId'] = offerstatusIds.toString();
    }
    if (sortParam?.bgvFinalStatus && sortParam?.bgvFinalStatus.length !== 0) {
      body['FinalBGVStatus'] = sortParam?.bgvFinalStatus.toString();
    }
    if (search) {
      body['search'] = search;
    }
    if (sortParam.location && sortParam.location.length !== 0) {
      let locationIds = sortParam.location.filter(n => n);
      body['JoiningLocation'] = locationIds.toString();
    }
     this.bodyParam = body;
    this._bgvServ.GetBGVEmployeeReport(body).subscribe(
      res => {
        this.candidateList = res['data'];
        this.paginationData = res['Paging'][0];
      }
    )
  }

  /***
  * export excel
  */
  exportAsXLSX(): void {
    let bodyData = {
      ...this.bodyParam,
      page: 1,
      pageSize: this.paginationData?.Total,
    }
    this._bgvServ.GetBGVEmployeeReport(bodyData).subscribe(
      res => {
        let candidateList = res['data'];
        let filterDataExcel = [];
        for (var key in candidateList) {
          let selectedData = {
            'Sr. No.': (parseInt(key, 10) + 1),
            'Talent ID': candidateList[key].TalentId,
            'Employee ID': candidateList[key].EmplID,
            'Employee Name': candidateList[key].EmplName,
            'Designation': candidateList[key].Designation,
            'Grade': candidateList[key].Grade,
            'DOJ': GlobalMethod?.formatDate(candidateList[key].DOJ),
            'Legal Entity': candidateList[key].LegalEntity,
            'Location': candidateList[key].Location,
            'BGV Type': candidateList[key].BGVType,
            'Initiation Date': GlobalMethod?.formatDate(candidateList[key].InitiationDate),
            'Status': candidateList[key].FinalBGVStatus,
            'Colour Code': candidateList[key].FinalColourCode,
            'Completion Date': candidateList[key].CompletionDate,
            'SLA in Days': candidateList[key].WithinSLA,
            'SLA Status': candidateList[key].SLAStatus
          };
          filterDataExcel.push(selectedData);
        }

        this._excelService.exportAsExcelFile(filterDataExcel, 'Employee-Wise-BGV-Report');
      }
    )

  }
}
