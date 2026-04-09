import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatSort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { ExcelService } from 'projects/ats-global-system/src/app/core/common/excel.service';
import { TableUtil } from 'projects/ats-global-system/src/app/core/common/tableUtil';
import { FeedbackRoundDetailsComponent } from 'projects/ats-global-system/src/app/interview-module/interview-feedback/modals/feedback-round-details/feedback-round-details.component';
import { DashboardService } from '../../dashboard.service';
import { DatePipe } from '@angular/common';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { AtsCommonPrefix } from 'projects/ats-global-system/src/app/core/constant/common.const';
import { CidPrefixPipe } from 'projects/ats-global-system/src/app/shared/pipes-directives/pipes/cid-prefix.pipe';

@Component({
  selector: 'app-candidate-info-dialog',
  templateUrl: './candidate-info-dialog.component.html',
  styleUrls: ['./candidate-info-dialog.component.scss'],
  providers: [DatePipe, CidPrefixPipe]
})
export class CandidateInfoDialogComponent implements OnInit, AfterViewInit {
  displayedColumns = ['TalentID', 'cid', 'name', 'email', 'phone', 'gender', 'sourceType', 'source', 'totalExperience', 'releventExperience', 'intDate', 'noticePeriod', 'PrimaryRecruiter', 'AccountName', 'reqType', 'empType',  'cStatus','DropReasonName', 'action'];
  //public candidateList: any = [];
  public cid = AtsCommonPrefix.CidColName;
  public prefixCid = AtsCommonPrefix.CidPrefix;
  public sortFormFilter: UntypedFormGroup = new UntypedFormGroup({});
  public isResetSearch: boolean = false;
  public searchInput: string;
  public candidateList: MatTableDataSource<any>;
  public hmFilterListAll: boolean = false
  public filterByBu: string = '';
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginatorRef', { static: true }) paginatorCompRef;
  public Type: string;
  private obj: any = {};
  public duId: any = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CandidateInfoDialogComponent>,
    private _dashServe: DashboardService,
    public dialog: MatDialog,
    public datepipe: DatePipe,
    private _excelService: ExcelService,
    private _fb: UntypedFormBuilder,
    private _cidPrefix:CidPrefixPipe
  ) { }


  ngOnInit(): void {
    //sending flag to core api
    this.filterFormInit();
    if (this.data?.reportType === 'BU') {
      this.filterByBu = 'BU'
      this.duId = this.data.BUID
    } else if (this.data?.reportType === 'DU') {
      this.duId = this.data.DUID
      this.filterByBu = 'DU'
    } else {
      this.duId = []
    }
  }

  /***
   * 
   */
  initMatSource(data: any) {
    this.candidateList = new MatTableDataSource(data);
    this.candidateList.paginator = this.paginator;
    this.candidateList.sort = this.sort;
  }

  ngAfterViewInit() {
    if (this.data) {
      this.obj = {
        ColumnType: this.data.columnType,
        startDate: this.data?.filteredDate?.startDate,
        endDate: this.data?.filteredDate?.endDate || null,
        startDate2: this.data?.filteredDate?.startDate2 || null,
        endDate2: this.data?.filteredDate?.endDate2 || null
      }
      if (this.data.columnType === 'OD' ||
        this.data.columnType === 'YT' ||
        this.data.columnType === 'JO'
      ) {
        this.displayedColumns = ['TalentID', 'cid', 'name', 'email', 'phone', 'gender', 'sourceType', 'source', 'totalExperience', 'releventExperience', 'intDate', 'noticePeriod', 'PrimaryRecruiter', 'AccountName', 'reqType', 'empType', 'DateOfOffer', 'DateOfJoined', 'joinLoc', 'cStatus', 'action'];
      }
      else if (this.data.columnType === 'DO') {
        this.displayedColumns = ['TalentID', 'cid', 'name', 'email', 'phone', 'gender', 'sourceType', 'source', 'totalExperience', 'releventExperience', 'intDate', 'noticePeriod', 'PrimaryRecruiter', 'AccountName', 'reqType', 'empType', 'DateOfOffer', 'DateOfDecline', 'DateOfJoined', 'joinLoc', 'DropReasonName', 'cStatus', 'action'];
      }

      this.executeAllApi({ accountId: '' });

    }

  }

  //
  executeAllApi(body: any) {
    let reportType = this.data.reportType;
    if (reportType === 'DU') {
      this.obj['ID'] = this.data.DUID;
      this.Type = this.data?.DeliveryUnit;
      this.obj['accountId'] = body.AccountId;
      this._dashServe.getDeliveryWiseCandidateDetails(this.obj).subscribe(
        res => {
          this.initMatSource(res?.data);
        }
      )
    }
    else if (reportType === 'BU') {
      this.obj['ID'] = this.data.BUID;
      this.Type = this.data?.BusinessUnit;
      // if(body.AccountId){
      this.obj['accountId'] = body.AccountId;
      //}
      this._dashServe.getBUHeadWiseCandidateDetails(this.obj).subscribe(
        res => {
          this.initMatSource(res?.data);
        }
      )
    }

    else if (reportType === 'account') {
      this.obj['ID'] = this.data.AccountID;
      this.Type = this.data?.AccountName;
      this._dashServe.getAccountOwnerWiseCandidateDetails(this.obj).subscribe(
        res => {
          this.initMatSource(res?.data);
        }
      )
    }


    else if (reportType === 'PM') {
      this.obj['ID'] = this.data.ProjectID;
      this.Type = this.data?.ProjectName;
      this._dashServe.getPMWiseCandidateDetails(this.obj).subscribe(
        res => {
          this.initMatSource(res?.data);
        }
      )
    }

    else if (reportType === 'hm') {
      this.Type = this.data?.HiringManagerName;
      this.obj['ID'] = this.data.HiringManagerID;
      this.obj['accountId'] = body.AccountId;
      this._dashServe.getHiringManagerWiseCandidateDetails(this.obj).subscribe(
        res => {
          this.initMatSource(res?.data);
        }
      )
    }

  }


  //  //form for filter
  filterFormInit() {
    this.sortFormFilter = this._fb.group({
      // dateFrom: [null],
      // dateTo: [{ value: null, disabled: true }],
      accountType: [[]],
    })
  }

  public isResetFilter: boolean = false;
  public sortParam: string = '';
  getSortData(data: any) {
    if (data.accountType && data.accountType.length !== 0) {
      let accountTypeIds = data.accountType.filter(n => n);
      let body = {
        AccountId: accountTypeIds.toString()
      };
      this.executeAllApi(body);
    } else {
      this.executeAllApi({ AccountId: '' });
    }

  }

  /***
     * search
     */
  getSearchValueKey(e: any) {
    this.isResetSearch = false;
    this.searchInput = e;
    this.candidateList.filter = e.trim().toLowerCase();
    if (this.candidateList.paginator) {
      this.candidateList.paginator.firstPage();
    }
  }

  /**
   * show interview round details
   * @param data 
   */
  openfeedbackInfoModal(data: any) {
    const dialogRef = this.dialog.open(FeedbackRoundDetailsComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'update-interview-feedback'],
      data: data,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }

  /***
* close
*/
  onNoClick() {
    this.dialogRef.close(true);
  }

  exportAsXLSX(): void {
    let fileName = `${this.Type}-${this.data.colName}-Report`;
    let candidateList = this.candidateList.filteredData;
    let filterDataExcel = [];
    let dateFormat = 'dd/MM/yyyy h:mm a';
    for (var key in candidateList) {
      if (this.data.columnType === 'OD' ||
        this.data.columnType === 'YT' ||
        this.data.columnType === 'JO') {
        let selectedData = {
          'Talent IDs': candidateList[key]?.TalentID || '-',
          //'CID': candidateList[key].cid ? this.prefixCid + candidateList[key].cid : '-',
          'CID': this._cidPrefix.transform(candidateList[key].cid,  candidateList[key].ProfileId ),
          'Candidate Name': candidateList[key]?.CName || '-',
          'Email': candidateList[key]?.Email || '-',
          'Phone No.': candidateList[key]?.Phone || '-',
          'Gender': candidateList[key]?.Gender || '-',
          'Source Type': candidateList[key]?.Source || '-',
          'Source Name': candidateList[key]?.SourceName || '-',
          // 'Profile Source': candidateList[key].ProfileSource,
          'Total Experience': candidateList[key]?.TotalExp || '-',
          'Relevent Experience': candidateList[key]?.releventExp || '-',
          'Interview Date': this.datepipe.transform(candidateList[key].InterviewDate, 'dd/MM/yyyy h:mm a') || '-',
          'Notice Period': candidateList[key]?.NoticePeriod || '-',
          'Primary Recruiter': candidateList[key]?.PrimaryRecruiter || '-',
          'Account': candidateList[key]?.AccountName || '-',
          'Requirement Type': candidateList[key]?.ReqirementType || '-',
          'Employment Type': candidateList[key]?.EmploymentType || '-',
          'Offered Date': this.datepipe.transform(candidateList[key].DateOfOffer, dateFormat) || '-',
          'Date of Joining': this.datepipe.transform(candidateList[key].DateOfJoined, dateFormat) || '-',
          'Joining Location': candidateList[key]?.JoiningLocation || '-',
         // 'Drop Reason ': candidateList[key]?.DropReasonName || '-',
          'Candidate Status': candidateList[key].CStatusId == 240 || candidateList[key].CStatusId == 260 ? candidateList[key].PrevStatusName + ' /' + candidateList[key].CStatus : candidateList[key].CStatus || '-'
        };
        filterDataExcel.push(selectedData);
      } else if (this.data.columnType === 'DO') {
        let selectedData = {
          'Talent IDs': candidateList[key]?.TalentID || '-',
        //  'CID': candidateList[key].cid ? this.prefixCid + candidateList[key].cid : '-',
          'CID': this._cidPrefix.transform(candidateList[key].cid,  candidateList[key].ProfileId ),
          'Candidate Name': candidateList[key]?.CName || '-',
          'Email': candidateList[key]?.Email || '-',
          'Phone No.': candidateList[key]?.Phone || '-',
          'Gender': candidateList[key]?.Gender || '-',
          'Source Type': candidateList[key]?.Source || '-',
          'Source Name': candidateList[key]?.SourceName || '-',
          // 'Profile Source': candidateList[key].ProfileSource,
          'Total Experience': candidateList[key]?.TotalExp || '-',
          'Relevent Experience': candidateList[key]?.releventExp || '-',
          'Interview Date': this.datepipe.transform(candidateList[key].InterviewDate, 'dd/MM/yyyy h:mm a') || '-',
          'Notice Period': candidateList[key]?.NoticePeriod || '-',
          'Primary Recruiter': candidateList[key]?.PrimaryRecruiter || '-',
          'Account': candidateList[key]?.AccountName || '-',
          'Requirement Type': candidateList[key]?.ReqirementType || '-',
          'Employment Type': candidateList[key]?.EmploymentType || '-',
          'Offered Date': this.datepipe.transform(candidateList[key].DateOfOffer, dateFormat) || '-',
          'Offer Declined Date': this.datepipe.transform(candidateList[key].DateOfDecline, dateFormat) || '-',
          'Date of Joining': this.datepipe.transform(candidateList[key].DateOfJoined, dateFormat) || '-',
          'Joining Location': candidateList[key]?.JoiningLocation || '-',
          'Drop Reason ': candidateList[key]?.DropReasonName || '-',
          'Candidate Status': candidateList[key].CStatusId == 240 || candidateList[key].CStatusId == 260 ? candidateList[key].PrevStatusName + ' /' + candidateList[key].CStatus : candidateList[key].CStatus || '-'
        };
        filterDataExcel.push(selectedData);
      } else {
        let selectedData = {
          'Talent IDs': candidateList[key]?.TalentID || '-',
          //'CID': candidateList[key].cid ? this.prefixCid + candidateList[key].cid : '-',
          'CID': this._cidPrefix.transform(candidateList[key].cid,  candidateList[key].ProfileId ),
          'Candidate Name': candidateList[key]?.CName || '-',
          'Email': candidateList[key]?.Email || '-',
          'Phone No.': candidateList[key]?.Phone || '-',
          'Gender': candidateList[key]?.Gender || '-',
          'Source Type': candidateList[key]?.Source || '-',
          'Source Name': candidateList[key]?.SourceName || '-',
          'Total Experience': candidateList[key]?.TotalExp || '-',
          'Relevent Experience': candidateList[key]?.releventExp || '-',
          'Interview Date': this.datepipe.transform(candidateList[key].InterviewDate, 'dd/MM/yyyy h:mm a') || '-',
          'Notice Period': candidateList[key]?.NoticePeriod || '-',
          'Primary Recruiter': candidateList[key]?.PrimaryRecruiter || '-',
          'Account': candidateList[key]?.AccountName || '-',
          'Requirement Type': candidateList[key]?.ReqirementType || '-',
          'Employment Type': candidateList[key]?.EmploymentType || '-',
          'Drop Reason ': candidateList[key]?.DropReasonName || '-',
          'Candidate Status': candidateList[key].CStatusId == 240 || candidateList[key].CStatusId == 260 ? candidateList[key].PrevStatusName + ' /' + candidateList[key].CStatus : candidateList[key].CStatus || '-',
        };
        filterDataExcel.push(selectedData);
      }
    }
    let sn = filterDataExcel;
    this._excelService.exportAsExcelFile(filterDataExcel, fileName);
  }
}
