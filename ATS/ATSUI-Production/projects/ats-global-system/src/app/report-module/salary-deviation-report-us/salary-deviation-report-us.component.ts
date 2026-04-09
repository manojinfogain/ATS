import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatSort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { ExcelService } from 'projects/ats-global-system/src/app/core/common/excel.service';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { ReportService } from '../report.service';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { saveAs } from "file-saver";
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { AtsCommonPrefix } from 'projects/ats-global-system/src/app/core/constant/common.const';
import { ActivatedRoute } from '@angular/router';
import { CidPrefixPipe } from '../../shared/pipes-directives/pipes/cid-prefix.pipe';
import { GlobalCommonMethodService } from '../../core/common/global-common-method.service';

@Component({
  selector: 'app-salary-deviation-report-us',
  templateUrl: './salary-deviation-report-us.component.html',
  styleUrls: ['./salary-deviation-report-us.component.scss'],
  providers: [DatePipe, CidPrefixPipe],
})
export class SalaryDeviationReportUsComponent implements OnInit {
  displayedColumns = [
    'talentId', 'offerNumber', 'status', 'cid', 'candidateName', 'gender', 'email', 'employeeId', 'contactNumber',
    'positionType','updatedEmploymentType', 'employmentType', 'transfer', 'dateOfRequisition', 'initialMarkToHiringTagDate',
    'externalMarkedTagDate', 'initialPlannedOnboardingDate', 'plannedOnboardingDate', 'l1InterviewDate',
    'finalSelectionDate', 'finalApprovalDate', 'dateOfOffer', 'revisedDateOfOffer', 'dateOfJoining', 'dateOfDecline',
    'declineCategory', 'reasonForDecline', 'candidatePrimarySkill', 'candidateSubSkill', 'thidPrimarySkill',
    'thidSubSkill', 'totalExperience', 'expBucketing', 'mu', 'globalDeliveryLead', 'gdlName', 'division',
    'groupAccountName', 'accountName', 'projectName', 'designation', 'offshoreOnsite', 'joiningLocation',
    'education', 'currentEmployer', 'currentLocation','PayTypeExp', 'expectedCtc', 'payType', 'baseCtc', 'annualVariableCtc',
    'talentCube', 'cluster',

    'grade', 'gridLimitMin', 'gridLimitMedianP50', 'exceptionFromMedianP50',
    'exceptionPercentFromMedianP50', 'gridLimitMaxP75', 'exceptionFromMaxP75', 'exceptionPercentFromMaxP75',
    'gridBucketing', 'joiningBonus', 'retentionBonus', 'relocationExpense', 'travelExpense', 'noticePeriod',
    'primaryRecruiter', 'secondaryRecruiter', 'offerReleasedBy', 'sourceType', 'sourceName', 'reHire',
    'billingRate', 'perHourCostRate', 'dgmPercent', 'studioPractice', 'practiceCommunity', 'offerReleasedFor',
    'remark', 'isTalentIdReopened', 'previousTalentId', 'previousTalentIdAccount', 'talentIsReopenReason',
    'i9Representative', 'i9RepresentativeEmployeeName', 'yearsOfExperienceInPrimarySkill', 'medicalBenefitEligible',
    'flsaJobClassification'
  ];
  public dateFormat: string = 'MM-dd-yyyy';
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
    private _act: ActivatedRoute,
   private _cidPrefix: CidPrefixPipe,
   private globalMethod: GlobalCommonMethodService,
   private cdr: ChangeDetectorRef

  ) { }

  public isSalaryVisible: boolean = false;
  ngOnInit() {
    this.filterFormInit();
    /**remove transfer option */
    this.userData = this._storage.getSetUserData();
  }
  ngAfterViewInit() {
    let userData = this._storage.getSetUserData();
    debugger
    if (userData?.otherRoles?.IsReportSalaryMask == 'Y') {
      this.isSalaryVisible = true;
    }
    this.getsalaryDeviationList(1, this.pazeSize, null, { startDate: null });
    this.cdr.detectChanges();
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
      dateTo: [{ value: null, disabled: true }],
      dateStart: [null],
      dateEnd: [{ value: null, disabled: true }],
      offerstatus: [[]],
      deliveryUnit: [[]],
      requisitionType: [[]],
      accountType: [[]],
      recruiterId: [[]],
      ContractTypeUS: [[]],
      source: [[]],
      practiceId: [[]],
      CheckBoxFilter: [null],
    })

  }

  //getting data by parameter ids by filter
  public bodyParam: any = {}
  getsalaryDeviationList(page: number, pageSize: number, search: string, sortParam: any) {
    debugger
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
    //date 2
    if (sortParam?.dateStart) {
      body['startDate2'] = GlobalMethod.formatDate(sortParam?.dateStart);
    }

    if (sortParam?.dateEnd) {
      body['endDate2'] = GlobalMethod.formatDate(sortParam?.dateEnd);
    }

    if (search) {
      body['search'] = search
    }
    debugger
    if (sortParam?.CheckBoxFilter == true || sortParam?.CheckBoxFilter == 1) {
      body['IsReportSalaryMask'] = 'Y';
    }
    if (sortParam.deliveryUnit && sortParam.deliveryUnit.length !== 0) {
      let ids = sortParam.deliveryUnit.filter(n => n);
      body['DUIDs'] = ids.toString();
    }

    if (sortParam.requisitionType && sortParam.requisitionType.length !== 0) {
      let ids = sortParam.requisitionType.filter(n => n);
      body['requisitionType'] = ids.toString();
    }

    if (sortParam.accountType && sortParam.accountType.length !== 0) {
      let ids = sortParam.accountType.filter(n => n);
      body['accountId'] = ids.toString();
    }

    if (sortParam.recruiterId && sortParam.recruiterId.length !== 0) {
      let ids = sortParam.recruiterId.filter(n => n);
      body['recruiterId'] = ids.toString();
    }

    if (sortParam.ContractTypeUS && sortParam.ContractTypeUS.length !== 0) {
      let ids = sortParam.ContractTypeUS.filter(n => n);
      body['contractType'] = ids.toString();
    }

    if (sortParam.source && sortParam.source.length !== 0) {
      let sourceIds = sortParam.source.filter(n => n);
      body['source'] = sourceIds.toString();
    }

    if (sortParam.offerstatus && sortParam.offerstatus.length !== 0) {
      let offerstatusIds = sortParam.offerstatus.filter(n => n);
      body['offerStatus'] = offerstatusIds.toString();
    }
    if (sortParam?.practiceId && sortParam?.practiceId.length !== 0) {
      let Ids = sortParam?.practiceId.filter(n => n);
      body['practiceId'] = Ids.toString();
    }
    this.bodyParam = body;
    const _url = this._act?.snapshot?.url[1]?.path;
    let _apiUrl: string = 'Report/CandidateUSSalaryDeviationReport';
    // if (_url == "salary-deviation-report-uat") {
    //   _apiUrl = 'UAT/GetSalaryDeviationReport_UAT';
    // }
    let finalBody = { ...body };
    this._reportServe.CandidateUSSalaryDeviationReport(finalBody, _apiUrl).subscribe(
      res => {
        this.candidateList = new MatTableDataSource(res['data']);
        this.paginationData = res['Paging'][0];
        this.candidateList.sort = this.sort;
         this.cdr.detectChanges();
      }
    )
  }

  /***
 * pagination method
 * @param pageEvent 
 */
  getPagingData(pageEvent: any) {
    this.getsalaryDeviationList(pageEvent.pageIndex + 1, pageEvent.pageSize, this.searchInput, this.sortParam);
  }

  /***
     * search
     */
  getSearchValueKey(e: any) {
    this.isResetSearch = false;
    this.searchInput = e;
    this.jumpFirstPage = false;
    this.jumpFirstPage = true;
    this.getsalaryDeviationList(1, this.pazeSize, e, this.sortParam);
  }

  getSortData(data: string) {
    this.isResetSearch = true;
    this.isResetFilter = false;
    this.searchInput = '';
    this.sortParam = data;
    this.resetPagination();
    this.getsalaryDeviationList(1, this.pazeSize, this.searchInput, data);
  }

  /***
 * get Paste Date
 */
  getPastdate() {
    let currentDate = new Date();
    let firstDayMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    let dateParse = GlobalMethod.formatDate(firstDayMonth);
    return dateParse;
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
    let _apiUrl: string = 'Report/ExportToExcelSalaryDeviationReport';
    if (_url == "salary-deviation-report-uat") {
      _apiUrl = 'UAT/ExportToExcelSalaryDeviationReport';
    }
    this.http.post(`${environment.apiMainUrlNet}${_apiUrl}`, bodyData, { responseType: 'blob' }).subscribe(
      res => {
        saveAs(res, 'Salary_Deviation_Report.xls');
      },
      (error) => {
        this._share.showAlertErrorMessage.next('Something went wrong');
      }
    )
  }
  
 public maskIfRequired(value: any): any {
  return value === -1 || value === -1.00 ? 'XXXXXXXX' : value;
}


  //export report excel
  exportAsXLSX(): void {
    let bodyData = {
      ...this.bodyParam,
      page: 1,
      pageSize: this.paginationData?.Total,
    }
     let _apiUrl: string = 'Report/CandidateUSSalaryDeviationReport';
    this._reportServe.CandidateUSSalaryDeviationReport(bodyData, _apiUrl).subscribe(
      res => {
        let candidateList = res['data'];
        let filterDataExcel = [];
        for (var key in candidateList) {
          let selectedData = {
            'Talent ID': candidateList[key].talentId,
            'Offer Number': candidateList[key].offerNumber,
            'Status': candidateList[key].status,
          //  'CID': candidateList[key].cid ,
            'CID': this._cidPrefix.transform(candidateList[key].cid, candidateList[key]?.ProfileId),
            'Candidate Name': candidateList[key].candidateName,
            'Gender': candidateList[key].gender,
            'Email': candidateList[key].email,
            'Employee ID': candidateList[key].employeeId,
            'Contact Number': candidateList[key].contactNumber,
            'Position Type': candidateList[key].positionType,
            'Updated Employment Type': candidateList[key].updatedEmploymentType,
            'Employment Type': candidateList[key].employmentType,
            'Transfer': candidateList[key].transfer,
            'Date of Requisition': this.globalMethod.convertToExcelDateWithoutTime(candidateList[key].dateOfRequisition),
            'Initial Mark to Hiring(TAG) date': this.globalMethod.convertToExcelDateWithoutTime(candidateList[key].initialMarkToHiringTagDate),
            'External Marked TAG Date': this.globalMethod.convertToExcelDateWithoutTime(candidateList[key].externalMarkedTagDate),
            'Initial Planned Onboarding date': this.globalMethod.convertToExcelDateWithoutTime(candidateList[key].initialPlannedOnboardingDate),
            'Planned Onboarding date': this.globalMethod.convertToExcelDateWithoutTime(candidateList[key].plannedOnboardingDate),
            'L1 Interview Date': this.globalMethod.convertToExcelDateWithoutTime(candidateList[key].l1InterviewDate),
            'Final Selection Date': this.globalMethod.convertToExcelDateWithoutTime(candidateList[key].finalSelectionDate),
            'Final Approval Date': this.globalMethod.convertToExcelDateWithoutTime(candidateList[key].finalApprovalDate),
            'Date Of Offer': this.globalMethod.convertToExcelDateWithoutTime(candidateList[key].dateOfOffer),
            'Revised Date Of Offer': this.globalMethod.convertToExcelDateWithoutTime(candidateList[key].revisedDateOfOffer),
            'Date Of Joining': this.globalMethod.convertToExcelDateWithoutTime(candidateList[key].dateOfJoining),
            'Date Of Decline': this.globalMethod.convertToExcelDateWithoutTime(candidateList[key].dateOfDecline),
            'Decline Category': candidateList[key].declineCategory,
            'Reason for Decline': candidateList[key].reasonForDecline,
            'Candidate Primary Skill': candidateList[key].candidatePrimarySkill,
            'Candidate Sub Skill': candidateList[key].candidateSubSkill,
            'THID Primary Skill': candidateList[key].thidPrimarySkill,
            'THID Sub Skill': candidateList[key].thidSubSkill,
            'Total Experience': candidateList[key].totalExperience,
            'Exp Bucketing': candidateList[key].expBucketing,
            'MU': candidateList[key].mu,
            'Global Delivery Lead': candidateList[key].globalDeliveryLead,
            'GDL Name': candidateList[key].gdlName,
            'Division': candidateList[key].division,
            'Group Account Name': candidateList[key].groupAccountName,
            'Account Name': candidateList[key].accountName,
            'Project Name': candidateList[key].projectName,
            'Designation': candidateList[key].designation,
            'Offshore / Onsite': candidateList[key].offshoreOnsite,
            'Joining Location': candidateList[key].joiningLocation,
            'Education': candidateList[key].education,
            'Current Employer': candidateList[key].currentEmployer,
            'Current Location': candidateList[key].currentLocation,
            'Pay Type (Hourly / Monthly / Annual)-Screening Round ': candidateList[key].payTypeExpected,
            'Expected CTC':  this.maskIfRequired(candidateList[key].expectedCtc),
            'Pay Type (Hourly / Monthly / Annual)': candidateList[key].payType,
            'Base CTC':  this.maskIfRequired(candidateList[key].baseCtc),
            'Annual Variable CTC': this.maskIfRequired(candidateList[key].annualVariableCtc),
            'Talent Cube': candidateList[key].talentCube,
            'Cluster': candidateList[key].cluster,
            'Grade': candidateList[key].grade,
            'Grid Limit (Min)': this.maskIfRequired(candidateList[key].gridLimitMin),
            'Grid Limit (Median P-50)':  this.maskIfRequired(candidateList[key].gridLimitMedianP50),
            'Exception Yes/No (From Median P-50)': this.maskIfRequired(candidateList[key].exceptionFromMedianP50),
            'Exception % from Median P-50': this.maskIfRequired(candidateList[key].exceptionPercentFromMedianP50),
            'Grid Limit (Max P-75)': this.maskIfRequired(candidateList[key].gridLimitMaxP75),
            'Exception Yes/No (From Max P-75)': this.maskIfRequired(candidateList[key].exceptionFromMaxP75),
            'Exception % from (Max P-75)':  this.maskIfRequired(candidateList[key].exceptionPercentFromMaxP75),
            'Grid Bucketing': this.maskIfRequired(candidateList[key].gridBucketing),
            'Joining Bonus':  this.maskIfRequired(candidateList[key].joiningBonus),
              'Retention Bonus': this.maskIfRequired(candidateList[key].retentionBonus),
           'Relocation Expense': this.maskIfRequired(candidateList[key].relocationExpense),
            'Travel Expense': this.maskIfRequired(candidateList[key].travelExpense),
            'Notice Period': candidateList[key].noticePeriod,
            'Primary Recruiter': candidateList[key].primaryRecruiter,
            'Secondary Recruiter': candidateList[key].secondaryRecruiter,
            'Offer Released By': candidateList[key].offerReleasedBy,
            'Source Type': candidateList[key].sourceType,
            'Source Name': candidateList[key].sourceName,
            'Re-hire': candidateList[key].reHire,
            'Billing Rate ($)': this.maskIfRequired(candidateList[key].billingRate),
            'Per Hour Cost Rate': this.maskIfRequired(candidateList[key].perHourCostRate),
            'DGM Percent ($)': this.maskIfRequired(candidateList[key].dgmPercent),
            'Studio/Practice': candidateList[key].studioPractice,
            'Practice Community': candidateList[key].practiceCommunity,
            'Offer Released For': candidateList[key].offerReleasedFor,
            'Remark': candidateList[key].remark,
            'Is Talent Id Reopened': candidateList[key].isTalentIdReopened,
            'Previous Talent Id': candidateList[key].previousTalentId,
            'Previous Talent Id Account': candidateList[key].previousTalentIdAccount,
            'Talent Is Reopen Reason': candidateList[key].talentIsReopenReason,
            'I9 Representative': candidateList[key].i9Representative,
            'I9 Representative Employee Name': candidateList[key].i9RepresentativeEmployeeName,
            'Years of experience in Primaryskill': candidateList[key].yearsOfExperienceInPrimarySkill,
            'Medical Benefit Eligible': candidateList[key].medicalBenefitEligible,
            'FLSA job Classification': candidateList[key].flsaJobClassification
          };
          filterDataExcel.push(selectedData);
        }
const dateKeys: string[] = [
  'Date of Requisition',
  'Initial Mark to Hiring(TAG) date',
  'External Marked TAG Date',
  'Initial Planned Onboarding date',
  'Planned Onboarding date',
  'L1 Interview Date',
  'Final Selection Date',
  'Final Approval Date',
  'Date Of Offer',
  'Revised Date Of Offer',
  'Date Of Joining',
  'Date Of Decline'
];
        debugger
        this._excelService.exportAsExcelFileDateOnly(filterDataExcel, 'Salary_Deviation_Report_(US)', dateKeys);
      }
    )

  }


}
