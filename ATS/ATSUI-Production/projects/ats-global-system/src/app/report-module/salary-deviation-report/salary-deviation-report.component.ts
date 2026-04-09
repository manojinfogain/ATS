import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { Component, OnInit, ViewChild } from '@angular/core';
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


@Component({
  selector: 'app-salary-deviation-report',
  templateUrl: './salary-deviation-report.component.html',
  styleUrls: ['./salary-deviation-report.component.scss'],
  providers: [DatePipe]
})
export class SalaryDeviationReportComponent implements OnInit {
  displayedColumns = ['tId', 'Cid', 'candName', 'candEmail', 'contactNum', 'status', 'EmploymentType',
    'dateRequistion', 'FinalApprovalDate', 'finalSelectDate','DateOfOffer'
    , 'DateOfJoining', 'ReqToOfferDays', 'ReqToJoining','JoiningLocation','SourceType','ReqirementType','PrimaryRecruiter',
    'DeliveryUnit','AccountName'
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
  public cidColName:string = AtsCommonPrefix.CidColName;
  public cidPrefix:string = AtsCommonPrefix.CidPrefix;
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
    private _act:ActivatedRoute

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
    if(userData?.otherRoles?.IsReportSalaryMask == 'Y'){
      this.isSalaryVisible = true;
    }
    this.getsalaryDeviationList(1, this.pazeSize, null, { startDate: null });
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
      dateStart: [null],
      dateEnd: [{ value: null, disabled: true }],
      offerstatus: [[]],
      deliveryUnit: [[]],
      requisitionType: [[]],
      accountType: [[]],
      recruiterId: [[]],
      ContractType: [[]],
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
    if (sortParam?.CheckBoxFilter == true || sortParam?.CheckBoxFilter == 1) {
      body['IsReportSalaryMask'] = 'Y';
    }

    if (sortParam.location && sortParam.location.length !== 0) {
      let locationIds = sortParam.location.filter(n => n);
      body['location'] = locationIds.toString();
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

    if (sortParam.ContractType && sortParam.ContractType.length !== 0) {
      let ids = sortParam.ContractType.filter(n => n);
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
    //let queryString = `page=${page}&pageSize=${pageSize}&search=${search?search:''}`;
    const _url= this._act?.snapshot?.url[1]?.path;
    let _apiUrl:string = 'Report/GetSalaryDeviationReport';
    if(_url == "salary-deviation-report-uat"){
      _apiUrl = 'UAT/GetSalaryDeviationReport_UAT';
    }
    let finalBody = {...body};
    finalBody['IsReportSalaryMask'] = 'N';
    this._reportServe.getSalaryDeviationReport(finalBody,_apiUrl).subscribe(
      res => {
        this.candidateList = new MatTableDataSource(res['data']);
        this.paginationData = res['Paging'][0];
        this.candidateList.sort = this.sort;
      }
    )
  }

  /**
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
    //this.getCandidateOffer(1, this.pazeSize, this.searchInput, data, this.sortTable);
    this.getsalaryDeviationList(1, this.pazeSize, this.searchInput, data);
    // if (data == '') {
    //   this.sortParam = '&startDate=' + this.getPastdate();
    //   this.sortFormFilter.get('dateFrom').patchValue(new Date(this.getPastdate()));
    //   this.getCandidateOffer(1, this.pazeSize, this.searchInput, '&startDate=' + this.getPastdate());
    // }
    // else {
    //   this.sortParam = data;
    //   this.getCandidateOffer(1, this.pazeSize, this.searchInput, data);
    // }
    //
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
  // exportAsXLSX(): void {
  //   let queryString = `page=1&pageSize=${this.paginationData?.Total}`;
  //   this._reportServe.getSalaryDeviationReport(this.bodyParam).subscribe(
  //     res => {
  //       let candidateList = res['data'];
  //       let filterDataExcel = [];
  //       let dateFormat = 'dd-MMM-yy'
  //       //  let dateFormat = 'dd-MM-yy'
  //       for (var key in candidateList) {
  //         let selectedData = {
  //           'Talent ID': candidateList[key].TalentId,
  //           'Offer No': candidateList[key].OfferNumber,
  //           'Status': candidateList[key].Status,
  //           'Candidate Name': candidateList[key].CandidateName,
  //           'Email': candidateList[key].Emailid,
  //           'Contact Number': candidateList[key].MobileNumber,
  //           'Employment Type': candidateList[key].EmploymentType,
  //           'Date Of Requisition': this.datepipe.transform(candidateList[key].DateOfRequisition, dateFormat),
  //           'External Marked TAG Date': this.datepipe.transform(candidateList[key].ExternalMarkedTAGDate, dateFormat),
  //           'L1 Interview Date': this.datepipe.transform(candidateList[key].L1InterviewDate, dateFormat),
  //           'Final Selection Date': this.datepipe.transform(candidateList[key].FinalSelectionDate, dateFormat),
  //           'Final Approval Date': this.datepipe.transform(candidateList[key].FinalApprovalDate, dateFormat),
  //           'Date Of Offer': this.datepipe.transform(candidateList[key].DateOfOffer, dateFormat),
  //           'Date Of Joining': this.datepipe.transform(candidateList[key].DateOfJoining, dateFormat),
  //           'Date Of Decline': this.datepipe.transform(candidateList[key].DateOfDecline, dateFormat),
  //           'Decline Category': candidateList[key].DeclineCategory,
  //           'Reason for Decline': candidateList[key].ReasonforDecline,
  //           'Req To Offer Days': candidateList[key].ReqToOfferDays,
  //           'Req To Offer Bucketing': candidateList[key].ReqToOfferAgening,
  //           'External Mkd To Offer Days': candidateList[key].ExternalMarkedTAGToOfferDays,
  //           'External Mkd To Offer Bucketing': candidateList[key].ExternalMkdToOfferAgening,
  //           'L1 Interview Date To Offer Days': candidateList[key].L1InterviewToOfferDays,
  //           'L1 Interview Date To Offer Bucketing': candidateList[key].L1InterviewToOfferAgening,
  //           'Offer To Joining Days': candidateList[key].OfferToJoiningDays,
  //           'Offer To Joining Bucketing': candidateList[key].OfferToJoiningAgening,
  //           'Req To Joining': candidateList[key].ReqToJoining,
  //           'Req To Joining Bucketing': candidateList[key].ReqToJoiningAgening,
  //           'External Mkd To Joining Days': candidateList[key].ExternalMkdToJoiningDays,
  //           'External Mkd To Joining Bucketing': candidateList[key].ExternalMkdToJoiningAgening,
  //           'Candidate Primary Skills': candidateList[key].PrimarySkills,
  //           'Candidate Sub Skills': candidateList[key].SubSkill,
  //           'Total Exp (in yrs)': candidateList[key].TotalExpInYear,
  //           'Exp Bucketing': candidateList[key].ExpBucketing,
  //           'BU': candidateList[key].BU,
  //           'Delivery Unit': candidateList[key].DeliveryUnit,
  //           'Account Name': candidateList[key].AccountName,
  //           'Project Name': candidateList[key].ProjectName,
  //           'Designation': candidateList[key].Designation,
  //           'OffShore / Onsite': candidateList[key].OnShoreOffShore,
  //           'Joining Location': candidateList[key].JoiningLocation,
  //           'Education': candidateList[key].Education,
  //           'Current Employer': candidateList[key].CurrentEmployer,
  //           'Current Location': candidateList[key].CandidateCurrentLocation,
  //           'Current CTC ': candidateList[key].CurrentCTC,
  //           'Excepted CTC': candidateList[key].ExceptedCTC,
  //           'CTC Offered': candidateList[key].CTCOffered,
  //           '% Of Hike Offered (on curr. CTC)': candidateList[key].PerOfHikeOffered,
  //           'Job Family': candidateList[key].JobFamilyName,
  //           'Grade': candidateList[key].Grade,
  //           'Comp. Band': candidateList[key].CompBand,
  //           'Grid Limit (Min)': candidateList[key].MinGridLimit,
  //           'Grid Limit (Median P-50)': candidateList[key].P50GridLimit,
  //           'Exception Yes/No (From Median P-50)': candidateList[key].P50MediumSalaryException,
  //           'Exception % from Median P-50': candidateList[key].P50ExceptionPer,
  //           'Grid Limit (Max P-75)': candidateList[key].P75GridLimit,
  //           'Exception Yes/No (From Max P-75)': candidateList[key].P75UpperSalaryException,
  //           'Exception % from (Max P-75)': candidateList[key].P75ExceptionPer,
  //           'Grid Bucketing': candidateList[key].ExceptionalBucketing,
  //           'Joining Bonus': candidateList[key].JoiningBonus,
  //           'Retention Bonus': candidateList[key].RetentionBonus,
  //           'Relocation Expense': candidateList[key].RelocationExpense,
  //           'Travel Expense': candidateList[key].TravelExpense,
  //           'Notice Period': candidateList[key].NoticePeriod,
  //           'Primary Recruiter': candidateList[key].PrimaryRecruiter,
  //           'Secondary Recruiter': candidateList[key].SecondaryRecruiter,
  //           'Offer Released By': candidateList[key].OfferReleased,
  //           'Source Type': candidateList[key].Source,
  //           'Source Name': candidateList[key].SourceName,
  //           'Billing Rate ($)': candidateList[key].BillingRateInUSD,
  //           'DGM Percent ($)': candidateList[key].DGMPercentUsd
  //         };
  //         filterDataExcel.push(selectedData);
  //       }

  //       this._excelService.exportAsExcelFile(filterDataExcel, 'Salary Deviation Report');
  //     }
  //   )
  // }

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
    let _apiUrl:string = 'Report/ExportToExcelSalaryDeviationReport';
    if(_url == "salary-deviation-report-uat"){
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



}
