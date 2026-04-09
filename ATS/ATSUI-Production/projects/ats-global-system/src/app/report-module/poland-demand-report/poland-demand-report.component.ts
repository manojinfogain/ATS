import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { AtsCommonPrefix } from '../../core/constant/common.const';
import { MatSort } from '@angular/material/sort';
import { GetSetStorageService } from '../../core/services/get-set-storage.service';
import { ReportService } from '../report.service';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { DatePipe } from '@angular/common';
import { ExcelService } from '../../core/common/excel.service';
import { ActivatedRoute } from '@angular/router';
import { GlobalMethod } from '../../core/common/global-method';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { GlobalCommonMethodService } from '../../core/common/global-common-method.service';
@Component({
  selector: 'app-poland-demand-report',
  templateUrl: './poland-demand-report.component.html',
  styleUrls: ['./poland-demand-report.component.scss'],
  providers: [DatePipe]
})
export class PolandDemandReportComponent implements OnInit {
  displayedColumns: string[] = [
    'talentId',
    //'thId',
    'candidateName',
    'EmployeeID',
    'offerDate',
    'tentativeJoiningDate',
    'source',
    'sourceName',
    'referrerName',
    'employmentType',
    'offerStatus',
    'talentStatus',
    'designation',
    'grade',
    'reportingManager',
    'primarySkill',
    'skills',
    'accountName',
    'MU',
     'requisitionCreatedDate',
    'experienceYears',
    'experienceMonths',
    'offeredCtc',
    'annualCtc',
    'annualSalaryCost',
    'joiningBonus',
    'retentionBonus',
    'relocationExpense',
    'travelExpense',
    'billingCurrency',
    'billingRatePerHour',
    'billableHoursPerDay',
    'annualBillableHours',
    'annualRevenue',
    'benefits',
  //  'projectBufferPercent',
   // 'projectBuffer',
   // 'nonReimbursableTravelCost',
    //'projectSpecificCost',
    'dgmCost',
    'dgmPercent',
  //  'dateOfDecline',
   // 'declineCategory',
  //  'declineRemarks',
    'isRehire',
    'noticePeriod',
    'comment',
    'localCurrency',
   
  ];

  public sortFormFilter: UntypedFormGroup = new UntypedFormGroup({});
  public userData: any = {};
  public polandDemandList: any = [];
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
    private _fb: UntypedFormBuilder,
    private globalMethod: GlobalCommonMethodService
  ) { }

  public isSalaryVisible: boolean = false;
  ngOnInit() {
    this.filterFormInit();
    /**remove transfer option */
    this.userData = this._storage.getSetUserData();

  }
  ngAfterViewInit() {
    // this.getsalaryDeviationList(1, this.pazeSize, '', '');
    // this.sortParam = '&startDate=' + this.getPastdate();
    let userData = this._storage.getSetUserData();
    debugger
    if (userData?.otherRoles?.IsReportSalaryMask == 'Y') {
      this.isSalaryVisible = true;
    }
    this.getPolandDemandList(1, this.pazeSize, null, { startDate: null });
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
      talentStatusID: [[]],
      accountType: [[]],
      offerstatus: [[]],
      isMuAllocation: ['all'],
      dateStart: [null],
      dateEnd: [{ value: null, disabled: true }],
    })

  }

  //getting data by parameter ids by filter
  public bodyParam: any = {}
  getPolandDemandList(page: number, pageSize: number, search: string, sortParam: any) {
    debugger
    this.bodyParam = {};
    let body = {
      page: page,
      pageSize: pageSize
    }

    if (sortParam?.dateFrom) {
      body['fromJoinDate'] = GlobalMethod.formatDate(sortParam?.dateFrom);
    }

    if (sortParam?.dateTo) {
      body['toJoinDate'] = GlobalMethod.formatDate(sortParam?.dateTo);
    }
    //date 2
    if (sortParam?.dateStart) {
      body['fromCreateDate'] = GlobalMethod.formatDate(sortParam?.dateStart);
    }

    if (sortParam?.dateEnd) {
      body['toCreateDate'] = GlobalMethod.formatDate(sortParam?.dateEnd);
    }

    if (search) {
      body['search'] = search
    }

    if (sortParam.talentStatusID && sortParam.talentStatusID.length !== 0) {
      let ids = sortParam.talentStatusID.filter(n => n);
      body['statusID'] = ids.toString();
    }

    if (sortParam.accountType && sortParam.accountType.length !== 0) {
      let ids = sortParam.accountType.filter(n => n);
      body['accountIDs'] = ids.toString();
    }
    if (sortParam.offerstatus && sortParam.offerstatus.length !== 0) {
      let offerstatusIds = sortParam.offerstatus.filter(n => n);
      body['offerStatusId'] = offerstatusIds.toString();
    }
    if (sortParam?.isMuAllocation) {
      //let Ids = sortParam?.isMuAllocation.filter(n => n);
      body['withinBu'] = sortParam?.isMuAllocation;
    }
    this.bodyParam = body;
    let finalBody = { ...body };
    this._reportServe.GetTalentPolandLocationReport(finalBody).subscribe(
      res => {
        this.polandDemandList = new MatTableDataSource(res['data']);
        this.paginationData = res['Table1'][0];
        this.polandDemandList.sort = this.sort;
      }
    )
  }

  /**
 * pagination method
 */
  getPagingData(pageEvent: any) {
    this.getPolandDemandList(pageEvent.pageIndex + 1, pageEvent.pageSize, this.searchInput, this.sortParam);
  }

  /***
     * search
     */
  getSearchValueKey(e: any) {
    this.isResetSearch = false;
    this.searchInput = e;
    this.jumpFirstPage = false;
    this.jumpFirstPage = true;
    this.getPolandDemandList(1, this.pazeSize, e, this.sortParam);
  }

  getSortData(data: string) {
    this.isResetSearch = true;
    this.isResetFilter = false;
    this.searchInput = '';
    this.sortParam = data;
    this.resetPagination();
    //this.getCandidateOffer(1, this.pazeSize, this.searchInput, data, this.sortTable);
    this.getPolandDemandList(1, this.pazeSize, this.searchInput, data);
  }


  /***
 * get Paste Date
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



  //export report in  excel
  exportAsXLSX(): void {
    let bodyData = {
      ...this.bodyParam,
      page: 1,
      pageSize: this.paginationData?.Total,
    }
    this._reportServe.GetTalentPolandLocationReport(bodyData).subscribe(
      res => {
        let candidateList = res['data'];
        let filterDataExcel = [];
        let dateFormat = 'dd-MMM-yy'
        for (var key in candidateList) {
          let selectedData = {
            "Talent Id": candidateList[key].TalentID,
           // "TH Id": candidateList[key].THID,
            "Status": candidateList[key].Status,
            "Candidate Name": candidateList[key].CandidateName,
            "Employee ID": candidateList[key].EmployeeID,
            "Offer Status": candidateList[key].OfferStatus,
           // "Offer Date": this.datepipe.transform(candidateList[key].OfferDate, dateFormat),
            'Offer Date': this.globalMethod.convertToExcelDateWithoutTime(candidateList[key].OfferDate),
            "Tentative Joining Date": this.globalMethod.convertToExcelDateWithoutTime(candidateList[key].TentativeJoiningDate),
            // 'Offer Date': this.globalMethod.convertToExcelDateWithoutTime(candidateList[key].OfferDate),
            "Source": candidateList[key].Source,
            "Source Name": candidateList[key].SourceName,
            "Referrer Name": candidateList[key].ReferrerName,
            "Employment Type": candidateList[key].EmploymentType,
            "Designation": candidateList[key].Designation,
            "Grade": candidateList[key].Grade,
            "Reporting Manager": candidateList[key].ReportingManager,
            "Primary Skill": candidateList[key].PrimarySkill,
            "Skills": candidateList[key].Skills,
            "Account Name": candidateList[key].accountName,
            "MU": candidateList[key].MU,
             "Requisition Created Date": this.globalMethod.convertToExcelDateWithoutTime(candidateList[key].RequisitionCreatedDate),
            "Experience Years": candidateList[key].ExperienceYears,
            "Experience Months": candidateList[key].ExperienceMonths,
            "Offered CTC (PLN)": candidateList[key].OfferedCTC,
            "Annual CTC (PLN)": candidateList[key].AnnualCTC,
            "Annual Salary (USD)": candidateList[key].AnnualSalaryCost,
            "Joining Bonus (PLN)": candidateList[key].JoiningBonus,
            "Joining Bonus USD": candidateList[key].JoiningBonusUSD,
            "Retention Bonus (PLN)": candidateList[key].RetentionBonus,
            "Relocation Expense (PLN)": candidateList[key].RelocationExpense,
            "Travel Expense (PLN)": candidateList[key].TravelExpense,
            "Billing Currency": candidateList[key].BillingCurrency,
            "Billing Rate Per Hour (PLN)": candidateList[key].BillingRatePerHour,
            "Billing Rate Per Hour USD": candidateList[key].BillingRatePerHourUSD,
            "Billable Hours Per Day": candidateList[key].BillableHoursPerDay,
            "Annual Billable Hours": candidateList[key].AnnualBillableHours,
            "Annual Revenue (USD)": candidateList[key].AnnualRevenue,
            "Benefits (USD)": candidateList[key].Benefits,
          //  "Project Buffer Percent": candidateList[key].ProjectBufferPercent,
          //  "Project Buffer": candidateList[key].ProjectBuffer,
          //  "Non Reimbursable Travel Cost": candidateList[key].NonReimbursableTravelCost,
          //  "Project Specific Cost": candidateList[key].ProjectSpecificCost,
            "DGM Cost (USD)": candidateList[key].DGMCost,
            "DGM Percent": candidateList[key].DGMPercent,
          //  "Date Of Decline": this.datepipe.transform(candidateList[key].DateOfDecline, dateFormat),
          //  "Decline Category": candidateList[key].DeclineCategory,
        //    "Decline Remarks": candidateList[key].DeclineRemarks,
            "Is Rehire": candidateList[key].IsRehire,
            "Notice Period": candidateList[key].NoticePeriod,
            "Comment": candidateList[key].Comment,
            "Local Currency": candidateList[key].LocalCurrency,
           
          };


          filterDataExcel.push(selectedData);
        }

        const dateKeys: string[] = [
              'Offer Date',
              'Tentative Joining Date',
              'Requisition Created Date'
            ];

        //this._excelService.exportAsExcelFile(filterDataExcel, 'Poland Demand Report');
        this._excelService.exportAsExcelFileDateOnly(filterDataExcel, 'Poland Demand Report', dateKeys);
      }
    )
  }




}
