import { Component, Inject, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { DashboardService } from 'projects/ats-global-system/src/app/dashboard-module/dashboard.service';

@Component({
  selector: 'app-job-description',
  templateUrl: './job-description.component.html',
  styleUrls: ['./job-description.component.scss']
})
export class JobDescriptionComponent implements OnInit {
  public TalentData:any = [];
  public viewdatajobdes:any = [];
  public isloader:boolean = false;

  constructor(
    public dialogRef: MatDialogRef<JobDescriptionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _dashServe:DashboardService
  ) { }

  ngOnInit() {
    this.isloader = true;
    if(this.data){
      this._dashServe.getTalentIdInfo(this.data.th_id).subscribe(
        res=>{
          this.isloader = false;
          let data = res;
          this.TalentData = data[0];
          let viewdatajobdes = this.TalentData.job_description.trim().split('\r\n').map(item => item.trim().replace(/&amp/g, " ").replace(/\?/g, ""));
          this.viewdatajobdes = viewdatajobdes;
        },
        (error)=>{
          this.isloader = false;
        }
      )
    }
  }

   /***
  * close dialog
  */
    closeModal(): void {
      this.dialogRef.close();
    }
  

}
