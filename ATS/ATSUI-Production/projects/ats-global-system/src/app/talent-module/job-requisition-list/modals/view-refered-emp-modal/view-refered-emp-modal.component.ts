import { Component, OnInit, Inject } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { ExcelService } from 'projects/ats-global-system/src/app/core/common/excel.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { TalentService } from '../../../talent.service';

@Component({
  selector: 'app-view-refered-emp-modal',
  templateUrl: './view-refered-emp-modal.component.html',
  styleUrls: ['./view-refered-emp-modal.component.scss']
})
export class ViewReferedEmpModalComponent implements OnInit {
  public selectedEmployeeDetails: any[];
  public proposedEmpList: any = [];
  public employeeList: any[];
  displayedColumns = ['empName', 'ProposedOn', 'Status', 'RejectionReason',  'SelectedRejectedOn','SelectedRejectedBy',];
  constructor(
    public dialogRef: MatDialogRef<ViewReferedEmpModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public _share: ShareService,
    private _talentServ: TalentService,
    private _excelService:ExcelService
  ) { }

  ngOnInit(): void {
    this.getProposedEmpList();
  }

  /**get reffered / proposed emp list  */
  getProposedEmpList() {
    this._talentServ.GetProposedEmployeesTHIDWise(this.data?.TH_ID).subscribe(
      res => {
        this.proposedEmpList = res['data'];
      }
    )
  }


  /**getting all refer emp list here  */
  public referEmpList: any = [];
  getReferEmpList(data: any) {
    this.referEmpList = data;
  }
/**download as excel */
  exportAsXLSX(): void {
    this._talentServ.GetProposedEmployeesTHIDWise(this.data?.TH_ID).subscribe(
      res => {
        let candidateList = res['data'];
        let filterDataExcel = [];
        let dateFormat = 'dd-MMM-yy'
        for (var key in candidateList) {
          let selectedData = {
           // 'Emp Id': candidateList[key].newEmpID,
            'Emp Name': candidateList[key].EmployeeName,
            'Proposed On': candidateList[key].ProposedOn,
            'Status': candidateList[key].Status,
            'Reject Reason': candidateList[key].RejectionReason,
            'Selected/ Rejected On': candidateList[key].SelectedRejectedOn,
            'Selected/ Rejected By': candidateList[key].SelectedRejectedBy,
           
          };
          filterDataExcel.push(selectedData);
        }

        this._excelService.exportAsExcelFile(filterDataExcel, 'Proposed Employees');
      }
    )

  }
    

  closeModal(): void {
    this.dialogRef.close();
  }


}
