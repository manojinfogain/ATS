import { Component, OnInit, Inject } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { BgvServiceService } from '../../bgv-service.service';

@Component({
  selector: 'app-view-check-wise-report-history',
  templateUrl: './view-check-wise-report-history.component.html',
  styleUrls: ['./view-check-wise-report-history.component.scss']
})
export class ViewCheckWiseReportHistoryComponent implements OnInit {
  public selectedEmployeeDetails: any[];
  public proposedEmpList: any = [];
  public employeeList: any[];
  displayedColumns = ['sno', 'checkName', 'checkStatus', 'colorCode', 'remarks'];
  constructor(
    public dialogRef: MatDialogRef<ViewCheckWiseReportHistoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public _share: ShareService,
    private _bgvServ: BgvServiceService,
  ) { }

  ngOnInit(): void {
    this.getProposedEmpList();
  }

  /**get reffered / proposed emp list  */
  getProposedEmpList() {
    this._bgvServ.GetCheckwiseBGVHistory(this.data?.Candidateid).subscribe(
      res => {
        this.proposedEmpList = res['data'];
        debugger
      }
    )
  }



  /**download as excel */
  //  exportAsXLSX(): void {
  //    this._talentServ.GetCheckwiseBGVHistory(this.data?.TH_ID).subscribe(
  //      res => {
  //        let candidateList = res['data'];
  //        let filterDataExcel = [];
  //        let dateFormat = 'dd-MMM-yy'
  //        for (var key in candidateList) {
  //          let selectedData = {
  //           // 'Emp Id': candidateList[key].newEmpID,
  //            'Emp Name': candidateList[key].EmployeeName,
  //            'Proposed On': candidateList[key].ProposedOn,
  //            'Status': candidateList[key].Status,
  //            'Reject Reason': candidateList[key].RejectionReason,
  //            'Selected/ Rejected On': candidateList[key].SelectedRejectedOn,
  //            'Selected/ Rejected By': candidateList[key].SelectedRejectedBy,

  //          };
  //          filterDataExcel.push(selectedData);
  //        }

  //        this._excelService.exportAsExcelFile(filterDataExcel, 'Proposed Employees');
  //      }
  //    )

  //  }


  closeModal(): void {
    this.dialogRef.close();
  }


}
