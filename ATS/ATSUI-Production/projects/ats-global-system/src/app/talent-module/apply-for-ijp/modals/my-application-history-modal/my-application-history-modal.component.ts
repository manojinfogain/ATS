import { Component, OnInit,Inject } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { ExcelService } from 'projects/ats-global-system/src/app/core/common/excel.service';
import { TableUtil } from 'projects/ats-global-system/src/app/core/common/tableUtil';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { TalentService } from '../../../talent.service';

@Component({
  selector: 'app-my-application-history-modal',
  templateUrl: './my-application-history-modal.component.html',
  styleUrls: ['./my-application-history-modal.component.scss']
})
export class MyApplicationHistoryModalComponent implements OnInit {
  displayedColumns = ['srNo', 'ProposedBy', 'ProposedOn', 'ProposalRemarks', 'SelectedRejectedBy',
  'SelectedRejectedOn','RejectionReason', 'statusName'];
  blob: any;
  url: any;
  public isloader: boolean = false;
  public searchInput: string = '';

  public talentHistoryList: any[];
  constructor(
    public dialogRef: MatDialogRef<MyApplicationHistoryModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public _share: ShareService,
    private _talentServ: TalentService,
    private _excelService: ExcelService,

  ) { }

  ngOnInit(): void {
   this.GetHistoryForTalentID();
  }
  /**Get History for talent ID */
  GetHistoryForTalentID() {
    let body ={
        ProposeId: this.data.Id
    }
    this._talentServ.getApplicationHistory(body).subscribe(
      res => {
        this.talentHistoryList = res['data'];
        debugger;
      }
    )
  }

  onNoClick() {
    this.dialogRef.close();
  }


  /**download  list */
  exportAsXLSX(): void {    
    TableUtil.exportTableToExcel("exportTable", 'Talent ID History', `Data`);
  }
   

}

