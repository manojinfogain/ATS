import { Component, Inject, OnInit } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { ShareService } from '../../../core/services/share.service';
import { TalentService } from '../../../talent-module/talent.service';
import { ExcelService } from '../../../core/common/excel.service';

@Component({
  selector: 'app-view-invited-recruiters-list-modal',
  templateUrl: './view-invited-recruiters-list-modal.component.html',
  styleUrls: ['./view-invited-recruiters-list-modal.component.scss']
})
export class ViewInvitedRecruitersListModalComponent implements OnInit {

  displayedColumns = ['srNo',  'PanelMemberName', 'NotificationSentOn' ];
  blob: any;
  url: any;
  public isloader: boolean = false;

  public NotificationEmployeeList: any[];
  constructor(
    public dialogRef: MatDialogRef<ViewInvitedRecruitersListModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public _share: ShareService,
    private _talentServ: TalentService,
    private _excelService: ExcelService,

  ) { }

  ngOnInit(): void {
    this.data;
    debugger
   this.GetPanelNominationNotificationlistBytidMethod();
  }
  /**Get History for talent ID */
  GetPanelNominationNotificationlistBytidMethod() {
    this._talentServ.GetPanelNominationNotificationlistBytid(this.data?.thid).subscribe(
      res => {
        console.log(res);
        this.NotificationEmployeeList = res['data'];
      }
    )
  }

  onNoClick() {
    this.dialogRef.close();
  }


  /**download  list */
  exportAsXLSX(): void {    
   // TableUtil.exportTableToExcel("exportTable", 'Talent ID History', `Data`);
  }

}
