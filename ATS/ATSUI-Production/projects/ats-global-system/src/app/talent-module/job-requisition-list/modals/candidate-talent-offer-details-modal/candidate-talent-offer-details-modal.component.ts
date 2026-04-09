import { Component,Inject, OnInit } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { AtsCommonPrefix } from 'projects/ats-global-system/src/app/core/constant/common.const';
import { ViewOfferApprovalDetailsComponent } from 'projects/ats-global-system/src/app/offer-module/modals/view-offer-approval-details/view-offer-approval-details.component';
import { DatePipe } from '@angular/common';
import { InterviewCommonService } from 'projects/ats-global-system/src/app/core/services/interview-common.service';
import { CONSTANTS } from 'projects/ats-global-system/src/app/core/constant/constants';
import { AtsCommonFuncService } from 'projects/ats-global-system/src/app/core/common/ats-common-func.service';
import { TalentService } from '../../../talent.service';
@Component({
  selector: 'app-candidate-talent-offer-details-modal',
  templateUrl: './candidate-talent-offer-details-modal.component.html',
  styleUrls: ['./candidate-talent-offer-details-modal.component.scss']
})
export class CandidateTalentOfferDetailsModalComponent implements OnInit {

 
  public candData:any =[];
  public cidPrefix:string = AtsCommonPrefix.CidPrefix;  
  public interviewByLabel:any = CONSTANTS.InterViewByKeyName;
  constructor( 
    public dialogRef: MatDialogRef<ViewOfferApprovalDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
        private _talentServ: TalentService,
  ) { }

  ngOnInit(): void {
    this.data
    if(this.data){
      // let cid =`cid=${this.data.cid}` ;
      this.getCandidateDetailsByTHIDOfferID(this.data.TH_ID, this.data.OfferId);
    }
  }

  getCandidateDetailsByTHIDOfferID(thid, offerId) {
      this._talentServ.GetOfferedCandidateDetailsForTalentForPoland(thid,offerId).subscribe(
      res => {
        this.candData = res['data'][0];
      }
    )
  }
  
  //Get interview status for if video is uploaded
  getInterviewStatus(StatusId:number,StatusName:string, IsExceptionVideo:string, fileNameVideo:string){
    return (AtsCommonFuncService.getInterviewStatus(StatusId,StatusName, IsExceptionVideo, fileNameVideo));
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
