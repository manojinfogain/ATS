import { Component, OnInit,Inject } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { ExcelService } from 'projects/ats-global-system/src/app/core/common/excel.service';
import { TableUtil } from 'projects/ats-global-system/src/app/core/common/tableUtil';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { TalentService } from '../../../talent.service';

@Component({
  selector: 'app-view-talent-history-modal',
  templateUrl: './view-talent-history-modal.component.html',
  styleUrls: ['./view-talent-history-modal.component.scss']
})
export class ViewTalentHistoryModalComponent implements OnInit {
  displayedColumns = ['srNo', 'modifiedOn',  'modifiedBy', 'status',
  'wmgCommitDate', 'TAGCommitDate', 'Remarks'];
  blob: any;
  url: any;
  public isloader: boolean = false;

  public talentHistoryList: any[];
  constructor(
    public dialogRef: MatDialogRef<ViewTalentHistoryModalComponent>,
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
    this._talentServ.GetHistoryForTalentID(this.data?.TH_ID).subscribe(
      res => {
        console.log(res);
        this.talentHistoryList = res['data'];
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

