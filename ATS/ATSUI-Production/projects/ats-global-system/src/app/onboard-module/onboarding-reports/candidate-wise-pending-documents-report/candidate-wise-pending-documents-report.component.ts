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
import { OnboardService } from '../../onboard.service';
  
@Component({
  selector: 'app-candidate-wise-pending-documents-report',
  templateUrl: './candidate-wise-pending-documents-report.component.html',
  styleUrls: ['./candidate-wise-pending-documents-report.component.scss'],
  providers: [DatePipe]
})
  export class CandidateWisePendingDocumentsReportComponent implements OnInit {
  
    displayedColumns = [ 'sNo','Empl_Id', 'Empl_Name',  
      'Grade','Joining_Date','Location',
      'PendingDocumentsFromEmployee',
      'DeclarationSubmissionDate','ExpectedDateOfSubmission','Ageing','ActualDateOfSubmission'
      // ,'AppointmentVerifiedBy',
      // 'offerLetersubmissiondate','offerLeterStatus','offerLeterSubmittedOn','offerLeterVerifiedBy',
      // 'experienceLetterSubmissionDate','experienceLetterStatus','experienceLetterSubmittedOn','experienceLetterVerifiedBy',
      // 'relievingLetterSubmissionDate','relievingLetterStatus','relievingLetterSubmittedOn','relievingLetterVerifiedBy',
      // 'resignationLetterSubmissionDate','resignationLetterStatus','resignationLetterSubmittedOn','resignationLetterVerifiedBy',
      // 'tenthMarksheetSubmissionDate','tenthMarksheetStatus','tenthMarksheetSubmittedOn','tenthMarksheetVerifiedBy',
      // 'tenthCertificateSubmissionDate','tenthCertificateStatus','tenthCertificateSubmittedOn','tenthCertificateVerifiedBy',
      // 'twelfthMarksheetSubmissionDate','twelfthMarksheetStatus','twelfthMarksheetSubmittedOn','twelfthMarksheetVerifiedBy',
      // 'twelfthCertificateSubmissionDate','twelfthCertificateStatus','twelfthCertificateSubmittedOn','twelfthCertificateVerifiedBy',
      // 'graduationMarksheetSubmissionDate','graduationMarksheetStatus','graduationMarksheetSubmittedOn','graduationMarksheetVerifiedBy',
      // 'graduationCertificateSubmissionDate','graduationCertificateStatus','graduationCertificateSubmittedOn','graduationCertificateVerifiedBy',
      // 'postgraduationMarksheetSubmissionDate','postgraduationMarksheetStatus','postgraduationMarksheetSubmittedOn','postgraduationMarksheetVerifiedBy',
      // 'postgraduationCertificateSubmissionDate','postgraduationCertificateStatus','postgraduationCertificateSubmittedOn','postgraduationCertificateVerifiedBy',

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
      private _onbServe: OnboardService,
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
      this.getCandidateWisePendingDocReport(1, this.pazeSize, null, null);
      this._cdr.detectChanges();
    }
  
    getPagingData(pageEvent: any) {
      this.getCandidateWisePendingDocReport(pageEvent.pageIndex + 1, pageEvent.pageSize,this.searchInput, this.sortParam);
    }
  
  
        /***
   * filter form Init
   */
         filterFormInit() {
          this.sortFormFilter = this._fb.group({
            location: [[]],
            // Division: [[]],
            dateFrom: [null],
            dateTo: [{ value: null, disabled: true }]            
          })
        }
    
  
    //getting productivity data
    public bodyParam: any = {};
    getCandidateWisePendingDocReport(page: number, pageSize: number, search:string, sortParam: any) { 
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
      // if (sortParam?.Division && sortParam?.Division?.length !== 0) {
      //   let divisionIds = sortParam?.Division?.filter(n => n);
      //   body['Division'] =divisionIds?.toString();
      // }
      this.bodyParam = body;
      this._onbServe.getCandidateWisePendingDocReport(body).subscribe(
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
      this.getCandidateWisePendingDocReport(1, CONSTANTS.PAGE_SIZE, this.searchInput, data);
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
      this.getCandidateWisePendingDocReport(1, CONSTANTS.PAGE_SIZE, e, this.sortParam);
    }
  
    /***
   * export excel
   */
  exportAsXLSX(): void {
    this.bodyParam['Page']=1;
    this.bodyParam['PageSize']=this.paginationData?.Total;
    this._onbServe.getCandidateWisePendingDocReport(this.bodyParam).subscribe(
      res => {
        let candList = res['data'];
        let filterDataExcel = [];
        for (var key in candList) {
          let selectedData = {
            'Empl Id': (candList[key]?.EmployeeId ),
            'Empl Name': candList[key].EmployeeName,
            'Grade': candList[key].Grade,
            'Joining Date': this.datepipe.transform(candList[key].DateofJoining),
            'Location': candList[key].LocationName,
            'Pending Documents from employee': candList[key].PendingDoc,

            'Declaration submission date': this.datepipe.transform(candList[key].DeclarationSubmissionDate),
            'Expected date of submission': this.datepipe.transform(candList[key].ExpectedDateOfSubmission),
            'Ageing': candList[key].Ageing,
            'Actual date of submission': this.datepipe.transform(candList[key].ActualSubmissionDate),
            };
          filterDataExcel.push(selectedData);

        }
        this._excelService.exportAsExcelFile(filterDataExcel, 'Pending Documents Report');
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
