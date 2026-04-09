import { Component, OnInit, Inject } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { AtsCommonPrefix } from 'projects/ats-global-system/src/app/core/constant/common.const';
import { CONSTANTS } from 'projects/ats-global-system/src/app/core/constant/constants';
import { InterviewCommonService } from 'projects/ats-global-system/src/app/core/services/interview-common.service';

@Component({
  selector: 'app-view-coderbyte-report',
  templateUrl: './view-coderbyte-report.component.html',
  styleUrls: ['./view-coderbyte-report.component.scss']
})
export class ViewCoderbyteReportComponent implements OnInit {

  public talentDetailsList: any = [];
  public isJoiningLocIndia = true;
  public assessmentDetails: any = [];
  constructor(
    public dialogRef: MatDialogRef<ViewCoderbyteReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _interviewServ: InterviewCommonService
  ) { }

  ngOnInit(): void {
    
    this.getAssessmentReport(this.data.cid);

  }

  /**get assessment report details  */
  getAssessmentReport(cid: number) {
    let cidStatic = 54244
    // alert("Cid is static");
    this._interviewServ.getAssessmentReport(cid).subscribe(
      res => {
        this.assessmentDetails = res['data'][0];
        console.log(this.assessmentDetails)
      }
    )
  }

  closeModal(): void {
    this.dialogRef.close();
  }

}
