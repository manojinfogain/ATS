import { Component, Inject, OnInit } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { PartnerService } from '../../partner.service';
import { GlobalMethod } from '../../../core/common/global-method';

@Component({
  selector: 'app-view-talentid-details-partner',
  templateUrl: './view-talentid-details-partner.component.html',
  styleUrls: ['./view-talentid-details-partner.component.scss']
})
export class ViewTalentidDetailsPartnerComponent implements OnInit {
  public TalentData:any = [];
  public viewdatajobdes:any = [];
  public isloader:boolean = false;
  public TalentAssigndata:any  = {};

  constructor(
    public dialogRef: MatDialogRef<ViewTalentidDetailsPartnerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _partnerServe: PartnerService

  ) { }
  public jobDescHtml:string = '';
  ngOnInit() {
    this.isloader = true;
    if(this.data){
      this._partnerServe.getTalentIdInfo(this.data.th_id).subscribe(
        res=>{
          this.isloader = false;
          let data = res['data'];
          this.TalentData = data[0];
          this.TalentAssigndata = res['AssignDetails'][0];
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
    }
  }

   /***
  * close dialog
  */
    closeModal(): void {
      this.dialogRef.close();
    }
  

}
