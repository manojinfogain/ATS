
import { Component, OnInit, Inject } from '@angular/core';
import { GlobalMethod } from '../../../core/common/global-method';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CandidateService } from '../../candidate.service';
import { GlobalCommonMethodService } from '../../../core/common/global-common-method.service';
import { ShareService } from '../../../core/services/share.service';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { ViewAcceptOfferUsModalComponent } from '../view-accept-offer-us-modal/view-accept-offer-us-modal.component';
import { ViewAcceptOfferIndModalComponent } from '../view-accept-offer-ind-modal/view-accept-offer-ind-modal.component';
import { ManualOfferAcceptIndModalComponent } from '../manual-offer-accept-ind-modal/manual-offer-accept-ind-modal.component';


@Component({
  selector: 'app-ind-otp-verification-modal',
  templateUrl: './ind-otp-verification-modal.component.html',
  styleUrls: ['./ind-otp-verification-modal.component.scss']
})
export class IndOtpVerificationModalComponent implements OnInit {

  public offerSubmitFormGroup: UntypedFormGroup = new UntypedFormGroup({});
  public submit: boolean = false;
  public display: string;
  public isResendShow: boolean = false;
  public isResendText: boolean = false;
  public isExpShow: boolean = false;
  public isTimerShow: boolean = false;
  public encryptParam: string;
  public decryptData: any;
  public isOtpSent: boolean = false;
  public hideFormControl: boolean = false;
  public minDate: any = new Date();
  constructor(
    public dialogRef: MatDialogRef<IndOtpVerificationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: UntypedFormBuilder,
    private _share: ShareService,
    private _globalMethodServe: GlobalCommonMethodService,
    private _candServe: CandidateService,
    private _dialog: MatDialog
  ) { }
  public hiddenEmail: string = '';
  ngOnInit(): void {
    this.offerSubmitForm();
    const control = <UntypedFormArray>this.offerSubmitFormGroup.controls['item'];
    for (let i = 0; i < 6; i++) {
      control.push(this.initItemRow(null));
    }
    if (this.data?.email) {
      // this.hiddenEmail = this._globalMethodServe.hideEmail(this.data?.email);
      this.hiddenEmail = this._globalMethodServe.hideEmail(this.data?.email);
      this.sendOTPtoCandidate();
    }

  }

  /***
   * send OTPto Candidate
   */
  public isError: boolean = false;
  sendOTPtoCandidate() {
    this._candServe.SendOTPtoCandidateUS(this.data?.paramCid).subscribe(
      res => {
        this._share.showAlertSuccessMessage.next(res);
        this.isOtpSent = true;
        this.isResendText = true;
        this.isExpShow = true;
        this.isError = false;
        this.timer(2, 1);
        this.timer(5, 2);

      },
      (er) => {
        this.isError = true;
        this.isResendShow = true;
      }
    )

  }

  //opt resend
  resendOtp() {
    this.getControl('item').reset();
    this.sendOTPtoCandidate();

  }

  getControl(name: string) {
    return this.offerSubmitFormGroup.get(name);
  }

  /***
  * timer
  */
  public resendMM: string = '00';
  public resendSS: string = '00';
  public expMM: string = '00';
  public expSS: string = '00';
  public timerInt: any;
  timer(minute: number, type: number, show: boolean = true) {
    // let minute = 1;
    let seconds: number = minute * 60;
    let textSec: any = "0";
    let statSec: number = 60;
    const prefix = minute < 10 ? "0" : "";
    const timer = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 59;

      if (statSec < 10) {
        textSec = "0" + statSec;
      } else textSec = statSec;

      this.display = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;
      if (type === 1) {
        this.resendMM = `${prefix}${Math.floor(seconds / 60)}`;
        this.resendSS = `${textSec}`;
      }
      else {
        this.expMM = `${prefix}${Math.floor(seconds / 60)}`;
        this.expSS = `${textSec}`;
      }

      if (seconds == 0) {
        if (type === 1) {
          this.isResendShow = true;
          this.isResendText = false;
        }
        else {
          this.isExpShow = true;
          this.isExpShow = false;
        }

        clearInterval(timer);
      }
    }, 1000);
  }

  /***
 *  password form Init
 */
  offerSubmitForm() {
    this.offerSubmitFormGroup = this._fb.group({
      item: this._fb.array([])
    })
  }

  /***  get sort controls ***/
  get t() { return <UntypedFormArray>this.offerSubmitFormGroup.controls['item'] }
  initItemRow(data) {
    return this._fb.group({
      otpInput: [data, [Validators.required]]
    })
  }

  /**submit otp */
  public uniqueAuthKey: number;
  submitOtpForm(form: UntypedFormGroup) {
    form.markAllAsTouched();
    this.submit = true;
    if (form.valid) {
      let formData = form.value;
      let getUserOtp = formData.item;
      /** object convert to array  **/
      let convertArray = [];
      for (let i = 0; i < getUserOtp.length; i++) {
        convertArray.push(getUserOtp[i].otpInput)
      }
      let enterdOtp = convertArray.join('');
      let param = `param=${this.data?.paramCid}&otp=${enterdOtp}`;
      this._candServe.CandidateSubmitOtpIndia(param).subscribe(
        res => {
          
          this.hideFormControl = false;
          this._share.showAlertSuccessMessage.next(res.Message);
          this.dialogRef.close(true);
          this.data['AuthKey'] = res.AuthKey;
          this.viewAcceptOfferModal(this.data);
        }
      )
    }
  }

  /***
   * foucs input field
   */
  keyUpEvent(e, index) {
    let target = e.srcElement;
    let maxLength = 1;
    let myLength = target.value.length;
    if (myLength >= maxLength) {
      let next = target;
      while (next = next.nextElementSibling) {
        if (next == null)
          break;
        if (next.tagName.toLowerCase() == "input") {
          next.focus();
          break;
        }
      }
    }
  }

  viewAcceptOfferModal(elm: any) {
    let dialogRef:any ={};
    if(elm?.candidateDetails?.isMNO == 'M'){
      dialogRef = this._dialog.open(ManualOfferAcceptIndModalComponent, {
        panelClass: ['ats-model-wrap', 'ats-model-upload-screen'],
        data: elm,
        // maxWidth: '100vw',
        // maxHeight: '100vh',
        // height: '100%',
        // width: '100%'
      });
    }
    else{
      dialogRef = this._dialog.open(ViewAcceptOfferIndModalComponent, {
        panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
        data: elm,
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100%',
        width: '100%'
      });
    }
    dialogRef.afterClosed().subscribe(
      res => {
        if (res) {
          if(res?.type == 'A'){
            this.dialogRef.close({type:'A'});
          }
          // this.dialogRef.close(true);
          //this.getOnboardingCandidateList(1, CONSTANTS.PAGE_SIZE, null, { startDate: null });
        }
      }
    );
  }
  closeModal(): void {
    this.dialogRef.close();
  }

}
