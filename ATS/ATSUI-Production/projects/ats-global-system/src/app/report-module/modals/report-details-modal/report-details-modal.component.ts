import { Component, Inject, OnInit } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { AtsCommonPrefix } from 'projects/ats-global-system/src/app/core/constant/common.const';
import { ViewOfferApprovalDetailsComponent } from 'projects/ats-global-system/src/app/offer-module/modals/view-offer-approval-details/view-offer-approval-details.component';
import { ReportService } from '../../report.service';

@Component({
  selector: 'app-report-details-modal',
  templateUrl: './report-details-modal.component.html',
  styleUrls: ['./report-details-modal.component.scss']
})
export class ReportDetailsModalComponent implements OnInit {

  public candiData:any =[];
  public cidPrefix:string = AtsCommonPrefix.CidPrefix;
  constructor( 
    public dialogRef: MatDialogRef<ViewOfferApprovalDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _reportServe: ReportService,
  ) { }

  ngOnInit(): void {
    if(this.data){
      let cid = this.data.cid;
      this.getCandidateDetailsByCid(cid);
    }
  }

  getCandidateDetailsByCid(cid) {
      this._reportServe.GetInterviewProcesssReportDetailsByCid(cid).subscribe(
      res => {
        this.candiData = res['data'][0];
      }
    )
  }

  closeModal(): void {
    this.dialogRef.close();
  }

}
