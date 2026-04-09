import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { GlobalCommonMethodService } from 'projects/ats-global-system/src/app/core/common/global-common-method.service';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { CandidateService } from '../../candidate.service';

@Component({
  selector: 'app-otp-verification',
  templateUrl: './otp-verification.component.html',
  styleUrls: ['./otp-verification.component.scss']
})
export class OtpVerificationComponent implements OnInit {
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
    public dialogRef: MatDialogRef<OtpVerificationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: UntypedFormBuilder,
    private _share: ShareService,
    private _globalMethodServe: GlobalCommonMethodService,
    private _candServe: CandidateService,
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
     this._candServe.SendOTPtoCandidate(this.data.cid).subscribe(
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

  submitForm(form: UntypedFormGroup) {
    form.markAllAsTouched();
    this.submit = true;
    if(form.valid){
      let formData = form.value;
      let getUserOtp = formData.item;
      /** object convert to array  **/
      let convertArray = [];
      for (let i = 0; i < getUserOtp.length; i++) {
        convertArray.push(getUserOtp[i].otpInput)
      }
      let enterdOtp = convertArray.join('');
      let param = `cid=${this.data.cid}&otp=${enterdOtp}&status=140&joiningDate=${GlobalMethod.formatDate(this.data.joiningDate)}`;
      this._candServe.CandidateSubmitOtp(param).subscribe(
        res => {
          this.hideFormControl = false;
          this._share.showAlertSuccessMessage.next(res);
          this.dialogRef.close(true);
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
  closeModal(): void {
    this.dialogRef.close();
  }

}
