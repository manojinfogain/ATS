import { AfterViewInit, Component, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { ActivatedRoute } from '@angular/router';
import { GlobalCommonMethodService } from 'projects/ats-global-system/src/app/core/common/global-common-method.service';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { CandidateService } from '../candidate.service';
import { OtpVerificationComponent } from '../modals/otp-verification/otp-verification.component';
@Component({
  selector: 'app-candidate-offer-acceptance',
  templateUrl: './candidate-offer-acceptance.component.html',
  styleUrls: ['./candidate-offer-acceptance.component.scss']
})
export class CandidateOfferAcceptanceComponent implements OnInit, AfterViewInit {

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
  public isOfferaccept: boolean = false;
  public isOfferaccepted: boolean = false;
  constructor(private _fb: UntypedFormBuilder,
    private _share: ShareService,
    private _activateRoute: ActivatedRoute,
    private _globalMethodServe: GlobalCommonMethodService,
    private _candServe: CandidateService,
    private _dialog: MatDialog
  ) {


  }


  public hiddenEmail: string = '';
  ngOnInit(): void {
    this._share.hideTopRightMenu.next(true);
    this._share.hideSideBar.next(true);
    document.body.classList.add("auth-page-main");
    this.getCandidateData();
    this.offerSubmitForm();
  }
  /***
   * open otp modal
   */
  openOtpModal(elm: any) {
    const dialogRef = this._dialog.open(OtpVerificationComponent, {
      panelClass: ['ats-model-wrap', 'otp-modal'],
      data: elm,
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.hideFormControl = false;
          this.isOfferaccept = true
        }
      }
    )
  }

  /****
   * 
   */
  public invalidUrl: boolean = false;
  getCandidateData(): void {
    let queryParam = this._activateRoute['snapshot']?.queryParams?.offer;
    if (queryParam) {
      let encodeData = encodeURIComponent(queryParam)
      this.decryptData = this._globalMethodServe.decryptData(queryParam);
      if (this.decryptData?.email) {
        // this.hiddenEmail = this._globalMethodServe.hideEmail(this.decryptData?.email);
        //  this.sendOTPtoCandidate();
        this.getCandidateInfo();
      }
      else {
        this._share.showAlertErrorMessage.next('Invalid Url.');
        this.invalidUrl = true;
      }

    }
    else {
      this._share.showAlertErrorMessage.next('Invalid Url.');
      this.invalidUrl = true;
    }
  }

  /***
   * get candidate
   */
  public candidateData: any = [];
  getCandidateInfo() {
    this._candServe.getCandidateInfo(this.decryptData.cid).subscribe(
      res => {
        this.candidateData = res['data'][0];
        if (this.candidateData.status === 1) {
          //  this.sendOTPtoCandidate();
          this.hideFormControl = true;
          this.isOfferaccepted = false
        }
        else if(this.candidateData.status === 2){
          this.hideFormControl = false;
          this.isOfferaccepted = true
        }
        else {
          this.hideFormControl = false;
          this.isOfferaccepted = false
        }
      }
    )
  }
  /***
   * send OTPto Candidate
   */
  public isError: boolean = false;
  sendOTPtoCandidate() {
    this._candServe.SendOTPtoCandidate(this.decryptData.cid).subscribe(
      res => {
        this._share.showAlertSuccessMessage.next(res);
        this.isOtpSent = true;
        this.isResendText = true;
        this.isExpShow = true;
        this.isError = false;
        this.timer(5, 1);
        this.timer(2, 2);
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

  ngAfterViewInit(): void {
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
      // item: this._fb.array([]),
      joiningDate: [null, Validators.required],
      status: [null, Validators.required]
    })
  }

  /***  get sort controls ***/
  get t() { return <UntypedFormArray>this.offerSubmitFormGroup.controls['item'] }
  initItemRow(data) {
    return this._fb.group({
      otpInput: [data, [Validators.required]]
    })
  }

  getControl(name: string) {
    return this.offerSubmitFormGroup.get(name);
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
  /**
   * submit password
   * @param form 
   */

  submitForm(form: UntypedFormGroup) {
    form.markAllAsTouched();
    this.submit = true;
    if (form.valid) {
      let formData = form.value;
      this.decryptData['joiningDate'] = formData.joiningDate;
      this.openOtpModal(this.decryptData);
    }
  }

  /**
   * reset form
   */
  resetForm() {
    this.offerSubmitFormGroup.reset();
  }


}
