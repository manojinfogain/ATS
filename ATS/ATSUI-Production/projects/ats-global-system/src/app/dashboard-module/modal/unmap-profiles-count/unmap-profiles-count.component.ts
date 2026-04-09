import { Component, Inject, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { DashboardService } from '../../dashboard.service';
import { JobDetailsPopupComponent } from '../job-details-popup/job-details-popup.component';
import { UnmapProfilesListComponent } from '../unmap-profiles-list/unmap-profiles-list.component';

@Component({
  selector: 'app-unmap-profiles-count',
  templateUrl: './unmap-profiles-count.component.html',
  styleUrls: ['./unmap-profiles-count.component.scss']
})
export class UnmapProfilesCountComponent implements OnInit {
  public ptofileList:any = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<JobDetailsPopupComponent>,
    public dialog: MatDialog,
    public _dashServe:DashboardService
  ) { }

  ngOnInit(): void {
    this.getProfileList();
  }

  /***
    * get list
    */
 getProfileList(){
  this._dashServe.getAllUnmapProfileCount().subscribe(
    res=>{
      this.ptofileList = res;
    }
  )
}

  openProfileList(data):void{
    const dialogRef = this.dialog.open(UnmapProfilesListComponent, {
      width: '650px',
      panelClass:['ats-model-wrap','view-profile-popup','add-profile-popup'],
      data: data,
      disableClose: true
    });
  }

  /***
  * close dialog
  */
   onNoClick(): void {
    this.dialogRef.close();
  }
  

}
