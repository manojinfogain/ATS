import { Component, Inject, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { InterviewCommonService } from 'projects/ats-global-system/src/app/core/services/interview-common.service';
import { InterviewStatusService } from 'projects/ats-global-system/src/app/core/services/interview-status.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { InrerviewsService } from 'projects/ats-global-system/src/app/interview-module/inrerviews.service';

@Component({
  selector: 'app-update-interviewer-modal',
  templateUrl: './update-interviewer-modal.component.html',
  styleUrls: ['./update-interviewer-modal.component.scss']
})
export class UpdateInterviewerModalComponent implements OnInit {
  public candidateData: any = [];
  public candidteRoundDetails: any = [];
  updatePrimaryInterviewer: UntypedFormGroup;
  public additionalIntList:any= [];
  constructor(
    public dialogRef: MatDialogRef<UpdateInterviewerModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _interviewStatus: InterviewStatusService,
    private _fb: UntypedFormBuilder,
    private _share: ShareService,
    private _InterviewServe: InrerviewsService,
    private _intCommonServe: InterviewCommonService,

  ) { }

  ngOnInit(): void {
    this.formSetup();
    this.getRoundDetails();
  }

  /* get Details
   */
  getRoundDetails() {
    if (this.data) {
      this._interviewStatus.getCandidateDetails(this.data.cid).subscribe(
        res => {

          this.candidateData = res;
          if (res.roundList.length != 0) {
            let crrInt = res.roundList.filter(list => list.IsCurrentRound == 'Y');
            this.candidteRoundDetails = crrInt[0];
            this._intCommonServe.getAdditionalInterviewrList(crrInt[0].RoundId).subscribe(
              res=>{
                this.additionalIntList = res['data'];
              }
            )
            
          }
        },

      )
    }
  }


  /***
  * formSetup
  */
  formSetup() {
    this.updatePrimaryInterviewer = this._fb.group({
      Remarks: [null,],
      InterviewerID: [null, [Validators.required]]
    })
  }

  get adPanelControl() { return this.updatePrimaryInterviewer.get('adPanelControl') }
  /*submit submit Update Interviewer form*/
  submitUpdateInterviewerHandler(form: UntypedFormGroup) {
    if(form.valid){
      let formData = form.value;
      formData['RoundID']= this.candidteRoundDetails.RoundId;
      this._InterviewServe.UpdatePrimaryInterviewer(formData).subscribe(
        res=>{
          this._share.showAlertSuccessMessage.next(res);
          this.dialogRef.close(true);
        }
      )
    }
  }

  closeModal(): void {
    this.dialogRef.close();
  }


}
