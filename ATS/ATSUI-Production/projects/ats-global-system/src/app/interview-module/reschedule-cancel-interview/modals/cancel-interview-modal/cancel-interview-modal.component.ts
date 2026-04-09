import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { InterviewStatusService } from 'projects/ats-global-system/src/app/core/services/interview-status.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { InrerviewsService } from 'projects/ats-global-system/src/app/interview-module/inrerviews.service';
@Component({
  selector: 'app-cancel-interview-modal',
  templateUrl: './cancel-interview-modal.component.html',
  styleUrls: ['./cancel-interview-modal.component.scss']
})
export class CancelInterviewModalComponent implements OnInit {
  public isloader: boolean = false;
  public candidateData: any = [];
  public candidteRoundDetails: any = [];
  minDate = new Date();
  isTimeZero = true;
  intModeData: any = [];
  CancelInterviewForm: UntypedFormGroup;
  public cancelReasons:any= [];
  constructor(
    public dialogRef: MatDialogRef<CancelInterviewModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _interviewStatus: InterviewStatusService,
    private _fb: UntypedFormBuilder,
    private _share: ShareService,
    private _InterviewServe: InrerviewsService,
    private globalApiServe: GlobalApisService,
    private _storage: GetSetStorageService
  ) { }

  ngOnInit(): void {
    this.formSetup();
    this.getRoundDetails();
    this.getInterviewCancelReasonsReason();
  }

  /***
   * get Details
   */
   getRoundDetails() {
    if (this.data) {
      this._interviewStatus.getCandidateDetails(this.data.cid).subscribe(
        res => {
          this.candidateData = res;
          if (res.roundList.length != 0) {
            let crrInt = res.roundList.filter(list => list.IsCurrentRound == 'Y');
            this.candidteRoundDetails = crrInt[0];
          }
        }
      )
    }
  }

     //geting cancel reason list list
  
     getInterviewCancelReasonsReason() {
      this.globalApiServe.getInterviewCancelReason().subscribe(
        res => {
          this.cancelReasons = res['data'];
        }
      )
    }
  

   /***
   * formSetup
   */
    formSetup() {
      this.CancelInterviewForm = this._fb.group({
       cancelReason:[null,[Validators.required]],
        Remarks: [null,[Validators.required]]
      });
    }

    /***
   * submit form
   */
  CancelFormSubmit(form: any) {
    if (this.CancelInterviewForm.valid) {
      const getTokenEmp =this._storage.getUserEmpId();
      let formData = form.value;
      let body = {
        RoundId: this.candidteRoundDetails.RoundId,
        cid: this.data.cid,
        InterviewStatus: 2,
        Remarks: formData.Remarks,
        UpdatedBy: getTokenEmp,
        rescheduleCancelReason: formData.cancelReason
        
      }

      this._InterviewServe.reschedulingInterview(body).subscribe(
        res=>{
          this._share.showAlertSuccessMessage.next(res);
          this.dialogRef.close(true);
        },
        (error) => {
          this._share.showAlertErrorMessage.next(error.error.Message);
        }
      )

    }
    else {
      this._share.showAlertErrorMessage.next('Please enter Remarks.');
    }
  }

   /***
 * close dialog
 */
    closeModal(): void {
      this.dialogRef.close();
    }
  

}
