import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
// import { InterviewCommonService } from 'projects/ats-global-system/src/app/core/services/interview-common.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { GetSetStorageService } from '../../../core/services/get-set-storage.service';
import { OnboardService } from '../../onboard.service';
// import { ConfirmReferbackMailModalComponent } from '../confirm-referback-mail-modal/confirm-referback-mail-modal.component';
@Component({
  selector: 'app-refer-back-mail-to-candidate-modal',
  templateUrl: './refer-back-mail-to-candidate-modal.component.html',
  styleUrls: ['./refer-back-mail-to-candidate-modal.component.scss']
})
export class ReferBackMailToCandidateModalComponent implements OnInit {

  public reasonDropDown: any = [];
  public offerDropReason: any = [];
  public candidatePersonalDetails: any = [];
  public isDropTypeSelected: boolean = false;
  public referBackForm: UntypedFormGroup = new UntypedFormGroup({});
  public screenRejectReason: any = [];
  public userData: any = {};
  constructor(
    public dialogRef: MatDialogRef<ReferBackMailToCandidateModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public _fb: UntypedFormBuilder,
    public _share: ShareService,
    private _onboardServ: OnboardService,
    private _storage:GetSetStorageService

  ) { }

  ngOnInit(): void {
    this.userData = this._storage.getSetUserData();
    this._onboardServ.getCandidatePersonalDetails(this.data.candidateId).subscribe(
      res => {
        this.candidatePersonalDetails = res['data'][0];
      });
    this.formInit();
  }

  //formInit
  formInit() {
    this.referBackForm = this._fb.group({
      // mailSubject: [null, [Validators.required]],
      mailBody: [null, [Validators.required]],
    });
    setTimeout(() => {
      if (this.candidatePersonalDetails?.HRVerifiedMailBody) {
        this.mailBodyCtrl.patchValue(this.candidatePersonalDetails?.HRVerifiedMailBody);
      }
    }, 1000);
  }

  get mailBodyCtrl() { return this.referBackForm.get('mailBody') }


  /**submiting form method */
  submitReferBackForm(form: UntypedFormGroup) {
    form.markAllAsTouched();
    let formData = form.value;
    if (form.valid) {
      formData['ActionBy'] = 'R';
      // formData['cid'] = this.data?.cid;
      formData['Candidateid'] = this.data?.candidateId;
      // this.confirmMailSendToCandidate(this.data,formData);
      this._onboardServ.directReferBackToCandidate(formData).subscribe(
        res => {
          this._share.showAlertSuccessMessage.next(res);
          this.dialogRef.close(true)
        }
      )
    } else {
      this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
    }
  }

  /***
   * Mail SendTo Candidate
   */

  //  confirmMailSendToCandidate(elm,body) {
  //   elm['headerText'] = `Preview Mail - Referred Back to ${elm?.Name}`;
  //   elm['buttonText'] = {ok: "OK", cancel: "Cancel"};
  //   elm['userData'] = this.userData;
  //   elm['subject'] = body?.mailSubject;
  //   elm['mailBody'] = body?.mailBody;

  //   const dialogRef = this.dialog.open(ConfirmReferbackMailModalComponent, {
  //     panelClass: ['ats-confirm','ats-confirm-width'],
  //     data:elm,
  //     width: '500px',
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       this._onboardServ.directReferBackToCandidate(body).subscribe(
  //         res => {
  //           this._share.showAlertSuccessMessage.next(res);
  //           this.dialogRef.close(true)
  //         }
  //       )
  //     }
      
  //   });
  // }


  //control for form
  getControl(name: string) {
    return this.referBackForm.get(name);
  }

  /***/

  closeModal(): void {
    this.dialogRef.close();
  }
}
