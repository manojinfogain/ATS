import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatSort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { Observable } from 'rxjs';
import { ExcelService } from 'projects/ats-global-system/src/app/core/common/excel.service';
import { TableUtil } from 'projects/ats-global-system/src/app/core/common/tableUtil';
import { FeedbackRoundDetailsComponent } from 'projects/ats-global-system/src/app/interview-module/interview-feedback/modals/feedback-round-details/feedback-round-details.component';
import { DashboardService } from '../../dashboard.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-view-talent-wise-count',
  templateUrl: './view-talent-wise-count.component.html',
  styleUrls: ['./view-talent-wise-count.component.scss'],
  providers: [DatePipe]
})
export class ViewTalentWiseCountComponent implements OnInit {

  displayedColumns = ['talentID', 'raisedBy', 'ScreeningRound', 'TechnicalRound','TechnicalRound2','ManagerialRound','ClientRound', 'HRSelected', 'HRRejected', 'HrOnHold', 'OfferedGiven', 'OfferedDecline', 'YTJCandidates', 'CandidatesJoined'];
  displayedColumns2 = ['talentID', 'raisedBy','raisedOn'];
  public headGroup: any = [];
  //public candidateList: any = [];
  public isResetSearch: boolean = false;
  public searchInput: string;
  public reportList: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginatorRef', { static: true }) paginatorCompRef;
  public Type: string;
  public pendingForScreening: boolean = false;
  public paginationData: any;
  private obj: any = {};

  // public screenView:string;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ViewTalentWiseCountComponent>,
    private _dashServe: DashboardService,
    public dialog: MatDialog,
    public datepipe: DatePipe,
    private _excelService: ExcelService,
  ) {

  }

  ngOnInit(): void {
    if (this.data.reportType === 'hm') {
      //showing heading in table
      for (let i = 0; i <= 3; i++) {
        this.headGroup.push('day' + i)
      }
      this.displayedColumns = ['talentID', 'raisedOn', 'ScreeningRound', 'TechnicalRound','TechnicalRound2', 'ManagerialRound','ClientRound', 'HRSelected', 'HRRejected', 'HrOnHold', 'OfferedGiven', 'OfferedDecline', 'YTJCandidates', 'CandidatesJoined'];
      this.displayedColumns2 = ['talentID', 'raisedOn','du','account','primRecr','secRecr','primSkill','secSkill'];
    }
    else {
      //showing heading in table
      for (let i = 0; i <= 4; i++) {
        this.headGroup.push('day' + i)
      }
      this.displayedColumns = ['talentID', 'raisedBy', 'raisedOn', 'ScreeningRound', 'TechnicalRound', 'TechnicalRound2','ManagerialRound','ClientRound', 'HRSelected', 'HRRejected', 'HrOnHold', 'OfferedGiven', 'OfferedDecline', 'YTJCandidates', 'CandidatesJoined'];
      this.displayedColumns2 = ['talentID', 'raisedBy', 'raisedOn','du','account','primRecr','secRecr','primSkill','secSkill'];
    }
    this.pendingForScreening = (this.data.columnType === 'NS');
  }

  /***
   * 
   */
  initMatSource(data: any) {
    this.reportList = new MatTableDataSource(data);
    this.reportList.paginator = this.paginator;
    this.reportList.sort = this.sort;
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
      let reportType = this.data.reportType;
      if (reportType === 'DU') {
        this.obj['ID'] = this.data.DUID;
        this.Type = this.data?.DeliveryUnit;
        this._dashServe.getDUTHIDWiseCount(this.obj).subscribe(
          res => {
            this.initMatSource(res?.data);
            // console.log(res.data);
          }
        )
      }
      else if (reportType === 'BU') {
        this.obj['ID'] = this.data.BUID;
        this.Type = this.data?.BusinessUnit;
        this._dashServe.getBUTHIDWiseCount(this.obj).subscribe(
          res => {
            this.initMatSource(res?.data);
          }
        )
      }

      else if (reportType === 'account') {
        this.obj['ID'] = this.data.AccountID;
        this.Type = this.data?.AccountName;
        this._dashServe.getAccountTHIDWiseCount(this.obj).subscribe(
          res => {
            this.initMatSource(res?.data);
          }
        )
      }

      else if (reportType === 'PM') {
        this.obj['ID'] = this.data.ProjectID;
        this.Type = this.data?.ProjectName;
        this._dashServe.getPMTHIDWiseCount(this.obj).subscribe(
          res => {
            this.initMatSource(res?.data);
          }
        )
      }

      else if (reportType === 'hm') {
        this.Type = this.data?.HiringManagerName;
        this.obj['ID'] = this.data.HiringManagerID;
        this._dashServe.getHMTHIDWiseCount(this.obj).subscribe(
          res => {
            this.initMatSource(res?.data);
          }
        )
      }

    }

  }

  /***
     * search
     */
  getSearchValueKey(e: any) {
    this.isResetSearch = false;
    this.searchInput = e;
    this.reportList.filter = e.trim().toLowerCase();
    if (this.reportList.paginator) {
      this.reportList.paginator.firstPage();
    }
  }

  sumTotal(report: any, Type: string) {
    let total = report?.data.reduce((total, line) => total + line[Type], 0)
    return total
  }

  clacRowSpan(index: number) {
    let obj = {};
    if (index === 0) {
      obj['num'] = this.data.reportType == 'hm' ? 2 : 3;
      obj['title'] = '';
      obj['class'] = 'duP';
    }

    if (index === 1) {
      obj['num'] = 5;
      obj['title'] = 'Interviews Status';
      obj['class'] = 'interviewsStatus';
    }
    if (index === 2) {
      obj['num'] = 3;
      obj['title'] = 'HR- Selection Status';
      obj['class'] = 'selectionStatus';
    }
    if (index === 3) {
      obj['num'] = 4;
      obj['title'] = 'Candidates Status';
      obj['class'] = 'candidatesStatus';
    }
    return obj;
  }

  openTalentViewModal(data: any, columnType: string): void {
  }


  /***
* close
*/
  onNoClick() {
    this.dialogRef.close(true);
  }

  exportAsXLSX(): void {
        let fileName = `${this.Type}-${this.data.colName}-Report`;
        let candidateList = this.reportList.filteredData;
        let res = this.reportList;
        let filterDataExcel = [];
        for (var key in candidateList) {
          if (!this.pendingForScreening) {
            let selectedData = {
              'Talent IDs': candidateList[key].TalentID,
              'Raised By': candidateList[key]?.RaisedBy || '-',
              'Raised On': this.datepipe.transform(candidateList[key].RaisedOn, 'dd/MM/yyyy'),
              'Screening Round': candidateList[key].ScreeningRound,
              'Technical Round-1': candidateList[key].techRound,
              'Technical Round-2': candidateList[key].techRound2,
              'Managerial/Mgmt Round': candidateList[key].ManagerialRound,
              'CLient Round': candidateList[key].ClientRound,
              'Selected': candidateList[key].HRSelected,
              'Rejected': candidateList[key].HRRejected,
              'Hold': candidateList[key].HrOnHold,
              'Offered Given': candidateList[key].OfferGiven,
              'Offered Declined': candidateList[key].OfferDecline,
              'YTJ Candidates': candidateList[key].YTJ,
              'Candidates Joined': candidateList[key].Joined
            };
            filterDataExcel.push(selectedData);
          }
          else {
            let selectedData = {
              'Talent IDs': candidateList[key].TalentID,
              'Raised By': candidateList[key]?.RaisedBy || '-',
              'Raised On': this.datepipe.transform(candidateList[key].RaisedOn, 'dd/MM/yyyy'),
              'Global Delivery Lead': candidateList[key].DU,
              'Account Name': candidateList[key].Account,
              'Primary Recruiter': candidateList[key].PrimaryRecruiter,
              'Secondary Recruiter': candidateList[key].SecondaryRecruiter,
              'Primary Skills': candidateList[key].PrimarySkill,
              'Secondary Skills': candidateList[key].SecondarySkill
            };
            filterDataExcel.push(selectedData);
          }

        }
        if(!this.pendingForScreening){
          filterDataExcel.push({'Talent IDs':"Total",'Raised By':"",'Raised On':"",'Screening Round':this.sumTotal(res,'ScreeningRound'),
            'Technical Round-1': this.sumTotal(res,'techRound'),
            'Technical Round-2': this.sumTotal(res,'techRound2'),
            'Managerial/Mgmt Round': this.sumTotal(res,'ManagerialRound'),
            'CLient Round': this.sumTotal(res,'ClientRound'),
            'Selected': this.sumTotal(res,'HRSelected'),
            'Rejected': this.sumTotal(res,'HRRejected'),
            'Hold': this.sumTotal(res,'HrOnHold'),
            'Offered Given': this.sumTotal(res,'OfferGiven'),
            'Offered Declined': this.sumTotal(res,'OfferDecline'),
            'YTJ Candidates': this.sumTotal(res,'YTJ'),
            'Candidates Joined': this.sumTotal(res,'Joined')
          });
        }
        this._excelService.exportAsExcelFile(filterDataExcel, fileName);
      }
}
