import { Component, Inject, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { DashboardService } from '../../dashboard.service';
import { GlobalMethod } from '../../../core/common/global-method';
import { forkJoin } from 'rxjs';
import { TalentService } from '../../../talent-module/talent.service';
@Component({
  selector: 'app-view-info-talentid',
  templateUrl: './view-info-talentid.component.html',
  styleUrls: ['./view-info-talentid.component.scss']
})
export class ViewInfoTalentidComponent implements OnInit {
  public TalentData:any = [];
  public viewdatajobdes:any = [];
  public isloader:boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ViewInfoTalentidComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _dashServe:DashboardService,
    private _talentServ: TalentService
  ) { }
  public jobDescHtml:string = '';
  public talentDetailsList: any = [];
  ngOnInit() {
    this.isloader = true;
    if(this.data){
      forkJoin([
        this._dashServe.getTalentIdInfo(this.data.th_id),
        this._talentServ.GetTHIDDetailsByTHID(this.data.th_id)
      ]).subscribe(
        res=>{
          this.isloader = false;
          this.TalentData = res[0][0];
          this.talentDetailsList = res[1]['data'][0];
          let viewdatajobdes = this.TalentData.job_description.trim().split('\r\n').map(item => item.trim().replace(/&amp/g, " ").replace(/\?/g, ""));
          this.viewdatajobdes = viewdatajobdes;
          if( this.TalentData.job_description){
            this.jobDescHtml=  GlobalMethod.htmlUnescape( this.TalentData.job_description);
          }
        },
        (error)=>{
          this.isloader = false;
        }
      )
      // this._dashServe.getTalentIdInfo(this.data.th_id).subscribe(
      //   res=>{
      //     this.isloader = false;
      //     let data = res;
      //     this.TalentData = data[0];
      //     let viewdatajobdes = this.TalentData.job_description.trim().split('\r\n').map(item => item.trim().replace(/&amp/g, " ").replace(/\?/g, ""));
      //     this.viewdatajobdes = viewdatajobdes;
      //     if( this.TalentData.job_description){
      //       this.jobDescHtml=  GlobalMethod.htmlUnescape( this.TalentData.job_description);
      //     }
      //   },
      //   (error)=>{
      //     this.isloader = false;
      //   }
      // )
    }
  }

   /***
  * close dialog
  */
    closeModal(): void {
      this.dialogRef.close();
    }
  
}
