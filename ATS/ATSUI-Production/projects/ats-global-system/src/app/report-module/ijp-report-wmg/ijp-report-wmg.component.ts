import { Component, OnInit, ViewChild } from '@angular/core';
import { CONSTANTS } from '../../core/constant/constants';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { GetSetStorageService } from '../../core/services/get-set-storage.service';
import { ReportService } from '../report.service';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { DatePipe } from '@angular/common';
import { ExcelService } from '../../core/common/excel.service';
import { GlobalMethod } from '../../core/common/global-method';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
@Component({
  selector: 'app-ijp-report-wmg',
  templateUrl: './ijp-report-wmg.component.html',
  styleUrls: ['./ijp-report-wmg.component.scss'],
  providers: [DatePipe]
})
export class IjpReportWmgComponent implements OnInit {

  displayedColumns = ['thID', 'RequirementType', 'TalentPrimarySkill', 'TalentSubSkill', 'talentAccountName', 'talentLocation', 'OffshoreOnshore',
    'talentgrade', 'talentdesignation', 'experince',
    'empName', 'empID', 'candidateAccount', 'empgrade', 'IJPAppliedOn','profielMatchPercentage',
    'empLocation', 'ProjectName', 'pm', 'status', 'talentStatus'

  ];
  public userData: any = {};
  public ijpCandidateList: any = [];
  public searchInput: string;
  public paginationData: any;
  public pazeOption: any = [10, 25, 50, 100];
  public pazeSize: any = 10;
  public thId: string = '';
  public jumpFirstPage: boolean = false;
  public sortFormFilter: UntypedFormGroup = new UntypedFormGroup({});
  public isResetSearch: boolean = false;
  public isResetFilter: boolean = false;
  public sortParam: string = '';
  public searchTitle: string = 'Search By Talent ID/ Name'
  @ViewChild(MatSort) sort: MatSort;
  public sortTable: string = '';
  public dateMin: any = '';
  @ViewChild('paginatorRef', { static: true }) paginatorCompRef;
  constructor(
    private _storage: GetSetStorageService,
    private _fb: UntypedFormBuilder,
    private _reportServe: ReportService,
    public dialog: MatDialog,
    public datepipe: DatePipe,
    public _excelService: ExcelService
  ) {
  }

  ngOnInit() {
    this.getCountStatusWise();
    this.userData = this._storage.getSetUserData();
    this.filterFormInit();
  }
  ngAfterViewInit() {
    /**
         * get List Profile
         */
    this.sortParam = '&startDate=' + this.getPastdate();
    this.getIjpEmployeeReport(1, this.pazeSize, null, null);
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
    this.getIjpEmployeeReport(1, this.pazeSize, this.searchInput, data);

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

  //paste date
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
* filter form Init
*/
  filterFormInit() {
    this.sortFormFilter = this._fb.group({
      dateFrom: [new Date(this.getPastdate())],
      dateTo: [{ value: null }],
      accountType: [[]],
      location: [[]],
      primarySkill: [[]],
      grade: [[]],
      appliedEmp: [null],
      ijpStatus:[null]
    })
    this.dateMin = new Date(this.getPastdate());
  }

  //getting data 
  public bodyParam: any = {};
  getIjpEmployeeReport(page: number, pageSize: number, search: string, sortParam: any) {
    this.bodyParam = {};
    let body = {
      page: page,
      pageSize: pageSize,
      // startDate: sortParam.startDate
    }
    if (sortParam?.dateFrom) {
      body['startDate'] = GlobalMethod.formatDate(sortParam?.dateFrom);
    }
    if (sortParam?.dateTo) {
      body['endDate'] = GlobalMethod.formatDate(sortParam?.dateTo);
    }
    if (search) {
      body['search'] = search;
    }

    if (sortParam?.accountType && sortParam?.accountType.length !== 0) {
      let Ids = sortParam?.accountType.filter(n => n);
      body['AccountIDs'] = Ids.toString();
    }

    if (sortParam?.location&& sortParam?.location.length !== 0) {
      let Ids = sortParam?.location.filter(n => n);
      body['LocationIDs'] = Ids.toString();
    }
    if (sortParam?.primarySkill && sortParam?.primarySkill?.length !== 0) {
      let Ids = sortParam?.primarySkill?.filter(n => n);
      body['SkillIDs'] = Ids.toString();
    }
    if (sortParam?.grade && sortParam?.grade?.length !== 0) {
      let Ids = sortParam?.grade?.filter(n => n);
      body['GradeIDs'] = Ids.toString();
    }
    if (sortParam?.ijpStatus && sortParam?.ijpStatus?.length !== 0) {
      let Ids = sortParam?.ijpStatus?.filter(n => n);
      body['ijpStatusId'] = Ids.toString();
    }
    
    this.bodyParam = body;

    this.bodyParam = body;
    this._reportServe.GetIJPTalentReport(body).subscribe(
      res => {
        this.ijpCandidateList = new MatTableDataSource(res['data']);
        this.paginationData = res['pagination'][0];
      }
    )
  }

  /**
 * pagination method
 * @param pageEvent 
 */
  getPagingData(pageEvent: any) {
    this.getIjpEmployeeReport(pageEvent.pageIndex + 1, pageEvent.pageSize, this.searchInput, this.sortParam);
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
    this.getIjpEmployeeReport(1, CONSTANTS.PAGE_SIZE, e, this.sortParam);
  }
 /***
  * GetCount
  */
 public TodayCount:any = {};
 public TotalCount:any = {};
  getCountStatusWise(){
    this._reportServe.GetTotalIjpApplictionCount().subscribe(
      res => {
       this.TodayCount = res['TodayCount'][0];
       this.TotalCount = res['TotalCount'][0];
      }
    )
  }
  public filterBoxCtrl:UntypedFormControl = new UntypedFormControl();
  public CountDetailsStatus;
  getFilterValueFunc(event:any){

     let crrVal = event.value;
     let data:any= {};
     //Total no of applications received
     if(crrVal == '1'){
      let strArray = this.CountDetailsStatus?.PendingForApprovalCountStatusId?.split(",");
      
       data = {talentStatusID: strArray};
     }
     //Applications received today
     else if(crrVal == '2'){
      let strArray = this.CountDetailsStatus?.OpenTHIDCountStatusId?.split(",");
      data = {talentStatusID: strArray};
     }
     //Fulfilled
    //  else if(crrVal == '3'){
     
    //   let strArray = this.CountDetailsStatus?.FulfiledTHIDCountStatusId?.split(",");
    //   data = {talentStatusID:strArray};
    //  }
     else{

     }
    this.isResetSearch = true;
    this.isResetFilter = false;
    this.searchInput = '';
    this.sortParam = data;
    this.paginatorCompRef;
    let pageSizeSelected:number = this.paginatorCompRef?.paginator?.pageSize;
    this.paginatorCompRef.paginator.pageIndex = 0;
    ///this.GetRaisedTHIDDetails(1,pageSizeSelected, this.searchInput, data);
   // this.getIjpEmployeeReport(1, pageSizeSelected, this.searchInput, data);

  }
  //export ijp report excel
  exportAsXLSX(): void {
    let bodyData = {
      ...this.bodyParam,
      page: 1,
      pageSize: this.paginationData?.Total,
    }
  //  let queryString = `page=${1}&PageSize=${this.paginationData?.Total}${this.searchInput ? '&search=' + this.searchInput : ''}`;
    this._reportServe.GetIJPTalentReport(bodyData).subscribe(
      res => {
        let candidateList = res['data'];
        let filterDataExcel = [];
        for (var key in candidateList) {
          let selectedData = {
            'Requisition ID': candidateList[key].TalentId,
            'Requisition Type': candidateList[key].RequirementType,
            'Primary Skill (Talent)': candidateList[key].TalentPrimarySkill,
            'Sub Skill (Talent)': candidateList[key].TalentSubSkill,
            'Account Name (Talent)': candidateList[key].TalentAccountName,
            'Location (Talent)': candidateList[key].TalentLocation,
            'Offshore/Onshore': candidateList[key].OffshoreOnshore,
            'Grade (Talent)': candidateList[key].Grade,
            'Designation (Talent)': candidateList[key].Designation,
            'Experience (Talent)': candidateList[key].Experience,

            'Employee Name': candidateList[key].IJPAppliedBy,
            'Employee ID': candidateList[key].IJPmployeeId,
            'Account Name (Employee)': candidateList[key].EmpAccountName,
            'Grade (Employee)': candidateList[key].EmpGrade,
            'Applied On': this.datepipe.transform(candidateList[key].IJPAppliedOn, 'dd-MMM-yy'),
             'Profile Match %': candidateList[key].FitmentPercentage,
            'Location (Employee)': candidateList[key].EmpLocation,
            'Project Name (Employee)': candidateList[key].EmpProjectName,
            'Project Manager': candidateList[key].EmpProjectManager,
            'Self Fitment Justification': candidateList[key].FitmentRemarks,
            'IJP Status': candidateList[key].AppliedStatusName,
            'Talent Status': candidateList[key]?.SubStatus
            // 'Reject Reason': candidateList[key].RejectReason,
            // 'Rejection Remarks': candidateList[key].RejectionRemarks,
          };
          filterDataExcel.push(selectedData);
        }

        this._excelService.exportAsExcelFile(filterDataExcel, 'IJP Report');
      }
    )

  }

  public dtData: any = '';
  public title: string = '';
  openPop(data: any, title: string): void {
    if (data) {
      this.title = title;
      this.dtData = data;
    }

  }



}
