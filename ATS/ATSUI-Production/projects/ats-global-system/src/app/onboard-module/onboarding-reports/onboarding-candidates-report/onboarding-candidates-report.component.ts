  import { DatePipe } from '@angular/common';
  import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
  import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
  import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
  import { MatSort } from '@angular/material/sort';
  import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
  import { ExcelService } from 'projects/ats-global-system/src/app/core/common/excel.service';
  import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
  import { AtsCommonPrefix } from 'projects/ats-global-system/src/app/core/constant/common.const';
  import { CONSTANTS } from 'projects/ats-global-system/src/app/core/constant/constants';
import { ReportService } from '../../../report-module/report.service';
  
  @Component({
    selector: 'app-onboarding-candidates-report',
    templateUrl: './onboarding-candidates-report.component.html',
    styleUrls: ['./onboarding-candidates-report.component.scss'],
    providers: [DatePipe]
  })
  export class OnboardingCandidatesReportComponent implements OnInit {
  
    displayedColumns = [ 'Cid', 'candName',  
      'email','OfficialEmail',
      'joiningDate','empType','phone','division','location','OnboardingSpoc', 'backPapers',
      'onbModeF2F', 'onbModeVirtual', 'onbModeRemarks' ,
      'AccessCardForm', 'JoiningReportForm','SodexoBenefitForm', 'UnderCurrentAddress','UnderPendingDocument','Form11','Form2PF','FormF','FormI','FormQ','SEZ','preOnbVerDate',
      'AcceptableUseofAssetsPolicy', 'AntiCorruptionAntiBriberyPolicy', 'CodeofConductBusinessEthics', 'ConflictofInterest', 'NDA_Lateral', 'POSHDocument', 'day1OnbVerDate',
      //
      'isAppointmentLetterShared','AppointmentLetterAcc', 'PendingDoc',
    ];
    // public grTotalHd: any = [
    //   'grandTotSchedL1', 'grandTotIntervL1', 'grandTotSelectL1', 'grandOffered'
    //   , 'grandselectPer', 'NoOfCandidateJoined'
    // ]
    public sortFormFilter: UntypedFormGroup = new UntypedFormGroup({});
    public displayedColumnsAll: any = [];
    public groupAll: any = [];
    public headGroup: any = [];
    public userData: any = {};
    public pazeSize: any = 10;
    public paginationData: any;
    public pazeOption: any = [10, 20, 50, 100];
    public jumpFirstPage: boolean = false;
    getmonths: any;
    public candidateList: any = [];
    public sortParam: string ='';
    public isResetSearch: boolean = false;
    public isResetFilter: boolean = false;
    public searchInput: string = '';
    public cidColName:string = AtsCommonPrefix.CidColName;
    public cidPrefix:string = AtsCommonPrefix.CidPrefix;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('paginatorRef', { static: true }) paginatorCompRef;
    constructor(
      public dialog: MatDialog,
      public datepipe: DatePipe,
      public _excelService: ExcelService,
      private _cdr: ChangeDetectorRef,
      private _reportServe: ReportService,
      private _fb:UntypedFormBuilder
    ) {
  
      //showing heading in table
      for (let i = 0; i <= 4; i++) {
        this.headGroup.push('day' + i)
      }
      this.groupAll = this.headGroup;
      this.displayedColumnsAll = this.displayedColumns;
    }
  
    ngOnInit() {
      this.filterFormInit();
    }
  
    ngAfterViewInit() {
      this.getOnboardingCandidatesReport(1, this.pazeSize, null, null);
      this._cdr.detectChanges();
    }
  
    getPagingData(pageEvent: any) {
      this.getOnboardingCandidatesReport(pageEvent.pageIndex + 1, pageEvent.pageSize,this.searchInput, this.sortParam);
    }
  
  
        /***
   * filter form Init
   */
         filterFormInit() {
          this.sortFormFilter = this._fb.group({
            location: [[]],
            Division: [[]],
            dateFrom: [null],
            dateTo: [{ value: null, disabled: true }]            
          })
        }
    
  
    //getting productivity data
    public bodyParam: any = {};
    getOnboardingCandidatesReport(page: number, pageSize: number, search:string, sortParam: any) { 
      this.bodyParam = {};
      let body = {
        page: page,
        pageSize: pageSize
      }
      if (sortParam?.dateFrom) {
        body['DateOfjoiningStart'] = GlobalMethod.formatDate(sortParam?.dateFrom);
      }
      if (sortParam?.dateTo) {
        body['DateOfjoiningEnd'] = GlobalMethod.formatDate(sortParam?.dateTo);
      }
      if (search) {
        body['search'] = search;
      } 
      if (sortParam?.location && sortParam?.location?.length !== 0) {
        let locationIds = sortParam?.location?.filter(n => n);
        body['Location'] = locationIds?.toString();
      }
      if (sortParam?.Division && sortParam?.Division?.length !== 0) {
        let divisionIds = sortParam?.Division?.filter(n => n);
        body['Division'] =divisionIds?.toString();
      }
      this.bodyParam = body;
      this._reportServe.getOnboardReport(body).subscribe(
        res => {
          this.candidateList = new MatTableDataSource(res['data']);
         this.paginationData = res['Paging'][0];
          this.candidateList.sort = this.sort;
        }
      )
    }
  
    getSortData(data: string) {
      console.log(data);
      this.isResetSearch = true;
      this.isResetFilter = false;
      this.searchInput = '';
      this.sortParam = data;
      this.paginatorCompRef.paginator.pageIndex = 0;
      this.getOnboardingCandidatesReport(1, CONSTANTS.PAGE_SIZE, this.searchInput, data);
    }
  
    /***
     * search
     */
     getSearchValueKey(e: any) {
      this.isResetFilter = true;
      this.isResetSearch = false;
      //this.sortParam = '';
      this.searchInput = e;
      this.paginatorCompRef.paginator.pageIndex = 0;
      this.getOnboardingCandidatesReport(1, CONSTANTS.PAGE_SIZE, e, this.sortParam);
    }
  
    /***
   * export excel
   */
  exportAsXLSX(): void {
    this.bodyParam['Page']=1;
    this.bodyParam['PageSize']=this.paginationData?.Total;
    this._reportServe.getOnboardReport(this.bodyParam).subscribe(
      res => {
        let candList = res['data'];
        let filterDataExcel = [];
        for (var key in candList) {
          let selectedData = {
            'S. No.':  1 + parseInt(key),
            'Employee Id': candList[key].EmployeeId,
            'Candidate Name': candList[key].CandidateName,
            'Personal Email Id': candList[key].PersonalEmailID,
            'Official Email Id': candList[key].OfficialEmailID,
            'Date Of Joining': this.datepipe.transform(candList[key].DateOfJoining, 'yyyy/M/dd'),
            'Employment Type': candList[key].EmploymentType,
            'Mobile No.': candList[key].PhoneNumber,
            'Division': candList[key].Division,
            'Location': candList[key].JoiningLocationName,
            'Onboarding SPOC': candList[key].OnboardingSpoc,
            'Back Papers':  this.getBackpapersStatus(candList[key].BackpaperStatus),
            'Onboarding request received through (Online/Offline)': ' ',
            'Type of Onboarding ( In-Person )': candList[key].OnboardingMode == 1 ? 'Yes' : candList[key].OnboardingMode == 2 ? 'No' : '-',
            'Type of Onboarding ( Virtual )': candList[key].OnboardingMode == 2 ? 'Yes' : candList[key].OnboardingMode == 1 ? 'No' : '-',
            'Remarks for Exceptions (if any)': ' ',
            'Access Card Form': this.getOnboardingFormsStatus(candList[key].AccessCardForm),
            'Joining Report Form': this.getOnboardingFormsStatus(candList[key].JoiningReportForm),
            'Sodexo Benefit Form': this.getOnboardingFormsStatus(candList[key].SodexoBenefitForm),
            'Undertaking For Current Address': this.getOnboardingFormsStatus(candList[key].UnderCurrentAddress),
            'Undertaking For Pending Documents': this.getOnboardingFormsStatus(candList[key].UnderPendingDocument),
            'Form 11': this.getOnboardingFormsStatus(candList[key].Form11),
            'Form 2-PF': this.getOnboardingFormsStatus(candList[key].Form2PF),
            'Form F': this.getOnboardingFormsStatus(candList[key].FormF),
            'Form I': this.getOnboardingFormsStatus(candList[key].FormI),
            'Form Q': this.getOnboardingFormsStatus(candList[key].FormQ),
            'SEZ Form': this.getOnboardingFormsStatus(candList[key].SEZ_Form),
            'Pre-Onboarding Forms Verification Date': candList[key].PreOnboardVerficationDate?candList[key].PreOnboardVerficationDate:'-',
            'Acceptable Use of Assets Policy': this.getOnboardingFormsStatus(candList[key].AcceptableUseOfAssetsPolicy),
            'Anti Corruption & Anti Bribery Policy': this.getOnboardingFormsStatus(candList[key].AntiCorruptionAntiBriberyPolicy),
            'Code of Conduct & Business Ethics Policy': this.getOnboardingFormsStatus(candList[key].CodeofConductBusinessEthicsPolicy),
            'Conflict of Interest Policy': this.getOnboardingFormsStatus(candList[key].ConflictofInterestPolicy),
            'NDA Lateral': this.getOnboardingFormsStatus(candList[key].NDA_Lateral),
            'POSH Document': this.getOnboardingFormsStatus(candList[key].POSHDocument),
            'Day-1 Froms Verification Date': candList[key].Day1VerficationDate?candList[key].Day1VerficationDate:'-',
            'Appointment Letter shared with employee': candList[key].AppointmentLetterSharedEMp == 'Y' ? 'Yes' : 'No',
            'Appointment Letter Acceptance': candList[key].AppointmentLetter,
            'Pending Documents List (if any)': candList[key].PendingDocList
            };
          filterDataExcel.push(selectedData);

        }
        this._excelService.exportAsExcelFile(filterDataExcel, 'Onboarding Report');
      }
    );
  }

  //get onboardingFormsStatus for export
  getOnboardingFormsStatus(element:any){
    if(element == 'P'){
      return 'Pending';
    }else if(element == 'D'){
      return 'Saved';
    }else if(element == 'S'){
      return 'Submitted';
    }else if(element == 'V'){
      return 'Verified';
    }else if(element == 'R'){
      return 'Referred Back';
    }else if(element == 'NA'){
      return 'NA';
    }else{
      return '-';
    }
  }

  //get backpapersStatus for export
  getBackpapersStatus(element:any){
    if(element == 10 ||
      element == 20 ||
      element == 30 ||
      element == 40){
      return 'Pending';
      }else if(element == 50 ||
        element == 60 ||
        element == 70 ||
        element == 80 ||
        element == 90 ||
        element == 100 ||
        element == 110 ||
        element == 120 ||
        element == 130){
        return 'Verified';
        }else{
          return '-';
        }
  }
}