import { Component, Inject, OnInit } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { AtsCommonPrefix } from 'projects/ats-global-system/src/app/core/constant/common.const';
import { ViewOfferApprovalDetailsComponent } from 'projects/ats-global-system/src/app/offer-module/modals/view-offer-approval-details/view-offer-approval-details.component';
import { DatePipe } from '@angular/common';
import { InterviewCommonService } from 'projects/ats-global-system/src/app/core/services/interview-common.service';
import { CONSTANTS } from 'projects/ats-global-system/src/app/core/constant/constants';
import { AtsCommonFuncService } from 'projects/ats-global-system/src/app/core/common/ats-common-func.service';
import { GetLocationInfo } from 'projects/ats-global-system/src/app/core/common/getLocationInfo';
@Component({
  selector: 'app-candidate-details-modal',
  templateUrl: './candidate-details-modal.component.html',
  styleUrls: ['./candidate-details-modal.component.scss'],
  providers: [DatePipe]
})
export class CandidateDetailsModalComponent implements OnInit {

  public isVisibleForIndia: boolean = false;
  public isVisibleForUs: boolean = false;
  public candiData: any = [];
  public cidPrefix: string = AtsCommonPrefix.CidPrefix;
  public interviewByLabel: any = CONSTANTS.InterViewByKeyName;
  constructor(
    public dialogRef: MatDialogRef<ViewOfferApprovalDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _interviewServ: InterviewCommonService,
    private getLocInfo: GetLocationInfo
  ) { }

  ngOnInit(): void {
    this.data
    if (this.data) {
      let cid = `cid=${this.data.cid}`;
      this.getCandidateDetailsByCid(cid);
    }
    if (this.getLocInfo.isLocationUS()) {
      this.isVisibleForUs = true;
      this.isVisibleForIndia = false;
    } else {
      this.isVisibleForIndia = true;
      this.isVisibleForUs = false;
    }
  }

  getCandidateDetailsByCid(cid) {
    this._interviewServ.getCandidateDetailsByCid(cid).subscribe(
      res => {
        this.candiData = res['data'][0];
        console.log(this.candiData)
      }
    )
  }

  //Get interview status for if video is uploaded
  getInterviewStatus(StatusId: number, StatusName: string, IsExceptionVideo: string, fileNameVideo: string) {
    return (AtsCommonFuncService.getInterviewStatus(StatusId, StatusName, IsExceptionVideo, fileNameVideo));
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
