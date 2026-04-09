import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { ActivatedRoute } from '@angular/router';
import { ExcelService } from 'projects/ats-global-system/src/app/core/common/excel.service';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { AtsCommonPrefix, GET_DEFAULT_DATE } from 'projects/ats-global-system/src/app/core/constant/common.const';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { ReportService } from '../report.service';
import { OpenPositionReportDetailsComponent } from './modals/open-position-report-details/open-position-report-details.component';

@Component({
  selector: 'app-open-position-report',
  templateUrl: './open-position-report.component.html',
  styleUrls: ['./open-position-report.component.scss'],
  providers: [DatePipe]
})
export class OpenPositionReportComponent implements OnInit {

  displayedColumns = ['RequisitionId','LocationName', 'OffshoreOnshore', 'OpportunityName', 'BidType',
    'Probablity', 'designation', 'BuName', 'SbuName', 'accName', 'ProjectName', 'RequisitionType', 'PrimaryRecruiter',
    'SecondaryRecruiter', 'ScreeningRoundCount',
    'TechRound1', 'TechRound2', 'TechRound3', 'HRFinalRoundCount', 'ManagerialRoundCount', 'sumOfProfInter', 'OfferedCount', 'SubSkill', 'status', 'SubStatus'];
  public userData: any = {};
  public cid = AtsCommonPrefix.CidColName;
  public prefixCid =AtsCommonPrefix.CidPrefix;
  public candidateList: any = [];
  public searchInput: string;
  public FromDate: string;
  public paginationData: any;
  public pazeOption: any = [10, 25, 50, 100];
  public pazeSize: any = 10;
  public thId: string = '';
  public jumpFirstPage: boolean = false;
  public sortFormFilter: UntypedFormGroup = new UntypedFormGroup({});
  public isResetSearch: boolean = false;
  public isResetFilter: boolean = false;
  public sortParam: any = '';
  public maxBackDate: any = new Date('01-01-2021');
  public dateMin: any ='';

  @ViewChild(MatSort) sort: MatSort;
  public sortTable: string = '';
  @ViewChild('paginatorRef', { static: true }) paginatorCompRef;
  constructor(
    private _storage: GetSetStorageService,
    private _fb: UntypedFormBuilder,
    private _reportServe: ReportService,
    public dialog: MatDialog,
    public datepipe: DatePipe,
    public _excelService: ExcelService,
    private _act:ActivatedRoute
  ) {
  }

  ngOnInit() {
    /**remove transfer option */
    this.userData = this._storage.getSetUserData();
    this.filterFormInit();
  }

  ngAfterViewInit() {
    /* get List Profile   */
    // this.sortParam = `&recruiterId=${this.userData?.EmpNewId}`;

    this.sortTable = '';
    this.sortParam = '&startDate=' + this.getPastdate();
    this.getOpenPosition(1, this.pazeSize, null, this.sortParam, this.sortTable);
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
    // let firstDayMonth = new Date(currentDate.getFullYear(), 0, 1);
    // let dateParse = GlobalMethod.formatDate(firstDayMonth);
    let dateParse = GlobalMethod.formatDate(GET_DEFAULT_DATE.fromDate);
    return dateParse;
  }

  /***
   * reset paging
   */
  resetPagination() {
    this.paginatorCompRef.paginator.pageIndex = 0;
  }

  /***
   * table sort by column
   */
  sortData(sort: Sort) {
    this.resetPagination();
    if (sort.direction == '') {
      this.sortTable = '';
    }
    else {
      this.sortTable = `&sortColumn=${sort.active}&sortDir=${sort.direction}`;
    }
    this.getOpenPosition(1, this.pazeSize, this.searchInput, this.sortParam, this.sortTable);
  }

  /**
 * reset filter and search
 */
  resetSortFilter() {
    this.isResetSearch = true;
    this.isResetFilter = true;
    this.searchInput = '';
    this.sortParam = '';
    //this.sortTable = '';
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
    this.getOpenPosition(1, this.pazeSize, this.searchInput, data, '');

  }

  /***
 * filter form Init
 */
  filterFormInit() {
    this.sortFormFilter = this._fb.group({
      dateFrom: [new Date(this.getPastdate())],
      dateTo: [{ value: null }],
      deliveryUnit: [[]],
      requisitionType: [[]],
      recruiterId: [[]],
      accountType: [[]],
      location: [[]],
      subStatusId: [[]],
    });
    this.dateMin = new Date(this.getPastdate());
  }

  //getting data
  public bodyParam: any = {};

  getOpenPosition(page: number, pageSize: number, search: string, sortParam: any, sortTable: string) {
    this.bodyParam = {};
    let body = {
      page: page,
      pageSize: pageSize
    //  startDate: sortParam.startDate
    }

    if (sortParam?.dateFrom) {
      body['startDate'] = GlobalMethod.formatDate(sortParam?.dateFrom);
    }
    if (sortParam?.dateFrom == null) {
      body['startDate'] = this.getPastdate();
    }
    if (sortParam?.dateTo) {
      body['endDate'] = GlobalMethod.formatDate(sortParam?.dateTo);
    }

    if (search) {
      body['search'] = search;
    }
    if (sortParam.deliveryUnit && sortParam.deliveryUnit.length !== 0) {
      let Ids = sortParam.deliveryUnit.filter(n => n);
      body['DUIDs'] = Ids.toString();
    }
    if (sortParam.recruiterId && sortParam.recruiterId.length !== 0) {
      let recIds = sortParam.recruiterId.filter(n => n);
      body['recruiterId'] = recIds.toString();
    }
    if (sortParam.accountType && sortParam.accountType.length !== 0) {
      let accountTypeIds = sortParam.accountType.filter(n => n);
      body['accountId'] = accountTypeIds.toString();
    }
    if (sortParam.location && sortParam.location.length !== 0) {
      let locationIds = sortParam.location.filter(n => n);
      body['location'] = locationIds.toString();
    }
    if (sortParam.subStatusId && sortParam.subStatusId.length !== 0) {
      let subStatusIdIds = sortParam.subStatusId.filter(n => n);
      body['subStatusId'] = subStatusIdIds.toString();
    }

    if (sortParam.requisitionType && sortParam.requisitionType.length !== 0) {
      let reqisitionIds = sortParam.requisitionType.filter(n => n);
      body['requisitionType'] = reqisitionIds.toString();
    }

    this.bodyParam = body;
    const _url= this._act?.snapshot?.url[1]?.path;
    let _apiUrl:string = 'Report/GetOpenPositionReports';
    if(_url == "open-position-report-uat"){
      _apiUrl = 'UAT/GetOpenPositionReports_UAT';
    }
    this._reportServe.getOpenPositionReport(body,_apiUrl).subscribe(
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
    this.getOpenPosition(pageEvent.pageIndex + 1, pageEvent.pageSize, this.searchInput ? this.searchInput : null, this.sortParam, this.sortTable);
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
    this.getOpenPosition(1, this.pazeSize, e, this.sortParam, this.sortTable);
  }

  //getOpenpistion 
  getOpenPositionReportDetails(data: any, flag: string, Round: number, title: string): void {
    data['flag'] = flag;
    data['Round'] = Round;
    data['title'] = title;
    const dialogRef = this.dialog.open(OpenPositionReportDetailsComponent, {
      width: '650px',
      panelClass: ['ats-model-wrap', 'view-profile-popup', 'panel-report-popup'],
      data: data,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }

  downloadReport(apiUrl:any, type:number){
    let bodyData = {
      ...this.bodyParam,
      page: 1,
      pageSize: this.paginationData?.Total,
    }
    // old api
    if(type == 1){
      this._reportServe.getOpenPositionReport(bodyData,apiUrl).subscribe(
        res => {
          let candidateList = res['data'];
          let filterDataExcel = [];
          let dateFormat = 'dd-MMM-yy'
          for (var key in candidateList) {
            let selectedData = {
              'Requisition Id': candidateList[key].RequisitionId,
              'Location': candidateList[key].LocationName,
              'Offshore/Onshore': candidateList[key].OffshoreOnshore,
              'Opportunity Name': candidateList[key].OpportunityName,
              'Bid Type': candidateList[key].BidType,
              'Probability (At insertion time)': candidateList[key].Probablity,
              'Designation': candidateList[key].Designation,
              /* BU renamed to MU - marketing Unit - 22-april-2024*/
              'MU': candidateList[key].BuName,
              'Global Delivery Lead': candidateList[key].SbuName,
              'Account Name': candidateList[key].AccountName,
              'Project Name': candidateList[key].ProjectName,
              'Primary Recruiter': candidateList[key].PrimaryRecruiter,
              'Secondary Recruiter': candidateList[key].SecondaryRecruiter,
              'Approved Date': this.datepipe.transform(candidateList[key].ApprovedDate, dateFormat),
              'Created On': this.datepipe.transform(candidateList[key].CreatedOn, dateFormat),
              'Requisition Age': candidateList[key].RequisitionAge,
              'Rag Age': candidateList[key].RagAge,
              'Tag Age': candidateList[key].TagAge,
              'Tag Age Start Date': this.datepipe.transform(candidateList[key].TagAgeStartDate, dateFormat),
              'Latest Tag Age Date': this.datepipe.transform(candidateList[key].latest_tag_age_date, dateFormat),
              'No of Position': candidateList[key].NoofPosition,
              'No of Employee Referred': candidateList[key].NoofEmployeeReferred,
              'Total Offered': candidateList[key].TotalOffered,
              'Total Joined': candidateList[key].TotalJoinned,
              'Primary Skill': candidateList[key].PrimarySkill,
              'Sub Skill': candidateList[key].SubSkill,
              'Status (Tag)': candidateList[key].Status,
              'Sub Status': candidateList[key].SubStatus,
              'Interviewer 1': candidateList[key].Interviewer1,
              'Interviewer 2': candidateList[key].Interviewer2,
              'Is Billable': candidateList[key].IsBillable,
              'Employement Type': candidateList[key].EmployementType,
              'Requirement Type': candidateList[key].RequirementType,
              'Replacement For': candidateList[key].ReplacementEmployee,
              'Experience': candidateList[key].Experience,
              'Visa Ready': candidateList[key].VisaReady,
              'Is Client Interview Required': candidateList[key].IsClientInterviewRequired,
              'Planned Billing': this.datepipe.transform(candidateList[key].PlannedBillingStartDate, dateFormat),
              'Billing Loss Days': candidateList[key].BillingLossDays ? candidateList[key].BillingLossDays : 'NA',
              'Planned OnBoarding Date': this.datepipe.transform(candidateList[key].PlannedOnboardingDate, dateFormat),
              'Tag Remarks': candidateList[key].TagRemark,
              'Planned Fulfillment Date': this.datepipe.transform(candidateList[key].PlannedFulfilmentDate, dateFormat),
              'Fulfillment date provided by TAG': this.datepipe.transform(candidateList[key].FulfillmentdatebyTAG, dateFormat),
              'Screening Round': candidateList[key].ScreeningRoundCount,
              'Technical Round 1': candidateList[key].TechnicalRound1Count,
              'Technical Round 2': candidateList[key].TechnicalRound2Count,
              'Technical Round 3': candidateList[key].TechnicalRound3Count,
              'HR Final Round ': candidateList[key].HRFinalRoundCount,
              'Managerial Round': candidateList[key].ManagerialRoundCount,
              'Sum Of Interviewed': candidateList[key].SumOfInterviewed,
              'Offered Count': candidateList[key].OfferedCount,
            };
            filterDataExcel.push(selectedData);
          }
  
          this._excelService.exportAsExcelFile(filterDataExcel, 'Open Position Report');
        }
      )
    }
    //new api
    else{
      this._reportServe.getOpenPositionReport(bodyData,apiUrl).subscribe(
        res => {
          let candidateList = res['data'];
          let filterDataExcel = [];
          let dateFormat = 'dd-MMM-yy'
          for (var key in candidateList) {
            let selectedData = {
              'Requisition Id': candidateList[key].RequisitionId,
              'Location': candidateList[key].LocationName,
              'Offshore/Onshore': candidateList[key].OffshoreOnshore,
              'Opportunity Id': candidateList[key].OpportunityId,
              'Opportunity Name': candidateList[key].OpportunityName,
              'ISFDC Id': candidateList[key].ISFDCId,
              'Bid Type': candidateList[key].BidType,
              'Probability (At insertion time)': candidateList[key].Probablity,
              'Current Probability': candidateList[key].CurrentProbability,
              'Job Summary':candidateList[key].JobSummary,
              'Job Description':candidateList[key].JobDescription,
              'Comp Band':candidateList[key].COMP_BAND,
              'Designation': candidateList[key].Designation,
                 /* BU renamed to MU - marketing Unit - 22-april-2024*/
              'MU': candidateList[key].BuName,
              'Global Delivery Lead': candidateList[key].SbuName,
              'Account Name': candidateList[key].AccountName,
              'Project Name': candidateList[key].ProjectName,
              'Primary Recruiter': candidateList[key].PrimaryRecruiter,
              'Secondary Recruiter': candidateList[key].SecondaryRecruiter,
              'Approved Date': this.datepipe.transform(candidateList[key].ApprovedDate, dateFormat),
              'Created On': this.datepipe.transform(candidateList[key].CreatedOn, dateFormat),
              'Requisition Age': candidateList[key].RequisitionAge,
              'WMG Age': candidateList[key].WMGAge,
              'Tag Age': candidateList[key].TagAge,
              'Tag Age Start Date': this.datepipe.transform(candidateList[key].TagAgeStartDate, dateFormat),
              'Latest Tag Age Date': this.datepipe.transform(candidateList[key].latest_tag_age_date, dateFormat),
              'No of Position': candidateList[key].NoofPosition,
              'No of Employee Referred': candidateList[key].NoofEmployeeReferred,
              'Total Offered': candidateList[key].TotalOffered,
              'Total Joined': candidateList[key].TotalJoinned,
              'Primary Skill': candidateList[key].PrimarySkill,
              'Sub Skill': candidateList[key].SubSkill,
              'Status (Tag)': candidateList[key].Status,
              'Sub Status': candidateList[key].SubStatus,
              'Interviewer 1': candidateList[key].Interviewer1,
              'Interviewer 2': candidateList[key].Interviewer2,
              'Is Billable': candidateList[key].IsBillable,
              'Employment Type': candidateList[key].EmploymentType,
              'Requirement Type': candidateList[key].RequirementType,
              'Replacement For': candidateList[key].ReplacementEmployee,
              'Experience': candidateList[key].Experience,
              'Visa Ready': candidateList[key].VisaReady,
              'Is Client Interview Required': candidateList[key].IsClientInterviewRequired,
              'Planned Billing': this.datepipe.transform(candidateList[key].PlannedBillingStartDate, dateFormat),
              'Billing Loss Days': candidateList[key].BillingLossDays ? candidateList[key].BillingLossDays : 'NA',
              'Planned OnBoarding Date': this.datepipe.transform(candidateList[key].PlannedOnboardingDate, dateFormat),
              'Tag Remarks': candidateList[key].TagRemark,
              'Allocation': candidateList[key].Allocation,
              'Employee Allocation': candidateList[key].employee_allocated,
              'TAG SendBack Remarks': candidateList[key].TAG_SendBack_Remarks,
              'TAG Remarks Modified_by': candidateList[key].TAG_Remarks_Modified_by,
              'TAG Remarks Modified_on': candidateList[key].TAG_Remarks_Modified_on,
              'Modified By': candidateList[key].Modified_By,
              'Modified On': candidateList[key].Modified_On,
              'Planned Fulfillment Date': this.datepipe.transform(candidateList[key].PlannedFulfillmentDate, dateFormat),
              'Fulfillment date provided by TAG': this.datepipe.transform(candidateList[key].FulfillmentdatebyTAG, dateFormat),
              'Screening Round': candidateList[key].ScreeningRoundCount,
              'Technical Round 1': candidateList[key].TechnicalRound1Count,
              'Technical Round 2': candidateList[key].TechnicalRound2Count,
              'Technical Round 3': candidateList[key].TechnicalRound3Count,
              'HR Final Round ': candidateList[key].HRFinalRoundCount,
              'Managerial Round': candidateList[key].ManagerialRoundCount,
              'Sum Of Interviewed': candidateList[key].SumOfInterviewed,
              'Offered Count': candidateList[key].OfferedCount,
            };
            filterDataExcel.push(selectedData);
          }
  
          this._excelService.exportAsExcelFile(filterDataExcel, 'Open Position Report');
        }
      )
    }
  }

  //download export excel
  exportAsXLSX(): void {
    const _url= this._act?.snapshot?.url[1]?.path;
    let _apiUrl:string = 'Report/GetOpenPositionReports';
    let type:number = 1;
    if(_url == "open-position-report-uat"){
      _apiUrl = 'UAT/GetOpenPositionReports_UAT';
      type = 2;
      this.downloadReport(_apiUrl,type);
    }else{
      this.downloadReport(_apiUrl,type);
    }
  }


}
