
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { MatSort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { FeedbackRoundDetailsComponent } from 'projects/ats-global-system/src/app/interview-module/interview-feedback/modals/feedback-round-details/feedback-round-details.component';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { CandidateConnectService } from '../../candidate-connect.service';
import { saveAs } from "file-saver";
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
@Component({
  selector: 'app-candidate-connect-view',
  templateUrl: './candidate-connect-view.component.html',
  styleUrls: ['./candidate-connect-view.component.scss']
})
export class CandidateConnectViewComponent implements OnInit, AfterViewInit {
  displayedColumns = ['CandidateStatus', 'ConnectPerson', 'ConnectDate', 'RescheduleDate', 'remark', 'connectStatus', 'modifiedby', 'CreatedOn',
    //'offereddate','dateOfJoining'
  ];
  public statusList: any = [];
  public sortTable: any = [];
  public isResetSearch: boolean = false;
  public isResetFilter: boolean = false;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public dialogRef: MatDialogRef<FeedbackRoundDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private _CandidateConnectService: CandidateConnectService,
    private _http: HttpClient,
    private _share: ShareService
  ) { }

  ngOnInit() {
    this.getCandiConnectHistoryList();
    this.data
  }

  ngAfterViewInit() {
    this.getCandiConnectHistoryList();
  }

  //getting canidate connect history
  getCandiConnectHistoryList() {
    this._CandidateConnectService.getCandidateConnectView(this.data.cid).subscribe(
      res => {
        this.statusList = new MatTableDataSource(res['data']);
        this.statusList.sort = this.sort;
        this.statusList.sortingDataAccessor = (item, property) => {
          switch (property) {
            case 'CreatedOn':
              const newDate = new Date(item.updatedOn);
              return newDate;
            default:
              return item[property];
          }
        };
      }
    )
  }

  getSortData(data: any) {

  }
  sortFormFilter() { }

  //export report in  excel
  exportAsXLSX(): void {
    let candidateName = this.data?.Name;
    let filename = `Candidate_View_History`
    let queryString = `cid=${this.data.cid}`;
    this._http.get(`${environment.apiMainUrlNet}CandidateConnect/ExportToExcelCandidateConnectHistory?cid=${this.data.cid}`, { responseType: 'blob' }).subscribe(
      res => {
        saveAs(res, filename + '-' + '(' + candidateName + ')' + '.xls');
      },
      (error) => {
        this._share.showAlertErrorMessage.next('Something went wrong');
      }
    )
  }

  /***
  * close dialog
  */
  closeModal(): void {
    this.dialogRef.close();
  }


}
