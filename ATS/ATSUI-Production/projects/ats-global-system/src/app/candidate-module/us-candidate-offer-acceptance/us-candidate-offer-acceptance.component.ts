import { Component, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { OtpVerificationComponent } from '../modals/otp-verification/otp-verification.component';
import { ShareService } from '../../core/services/share.service';
import { ActivatedRoute } from '@angular/router';
import { GlobalCommonMethodService } from '../../core/common/global-common-method.service';
import { CandidateService } from '../candidate.service';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { ViewAcceptOfferUsModalComponent } from '../modals/view-accept-offer-us-modal/view-accept-offer-us-modal.component';
import { UsOtpVerificationModalComponent } from '../modals/us-otp-verification-modal/us-otp-verification-modal.component';
import { GetSetStorageService } from '../../core/services/get-set-storage.service';

@Component({
  selector: 'app-us-candidate-offer-acceptance',
  templateUrl: './us-candidate-offer-acceptance.component.html',
  styleUrls: ['./us-candidate-offer-acceptance.component.scss']
})
export class UsCandidateOfferAcceptanceComponent implements OnInit {


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
  public paramCid: string = '';
  public candidateDetails: any = [];
  constructor(private _fb: UntypedFormBuilder,
    private _share: ShareService,
    private _activateRoute: ActivatedRoute,
    private _globalMethodServe: GlobalCommonMethodService,
    private _candServe: CandidateService,
    private _dialog: MatDialog,
    private _storage: GetSetStorageService

  ) {


  }

  viewAcceptOfferModal(elm: any) {
    const dialogRef = this._dialog.open(ViewAcceptOfferUsModalComponent, {
      panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
      data: elm,
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%'
    });
    dialogRef.afterClosed().subscribe(
      res => {
        if (res) {
          if(res?.type == 'A'){
          //  this.dialogRef.close({type:'A'});
          }
          // this.dialogRef.close(true);
          //this.getOnboardingCandidateList(1, CONSTANTS.PAGE_SIZE, null, { startDate: null });
        }
      }
    );
  }
  public hiddenEmail: string = '';
  ngOnInit(): void {

    this.paramCid = this._activateRoute['snapshot']?.queryParams?.param;
    this.AuithenticateCandidate(); 

    this._share.hideTopRightMenu.next(true);
    this._share.hideSideBar.next(true);
    document.body.classList.add("auth-page-main");
    // this.getCandidateData();

    this.offerSubmitForm();
    ///
  }
  AuithenticateCandidate() {
    this._candServe.getToken().subscribe( 
      res => {
        this._storage.saveTokenEx(res.access_token); 
        this.getCandidateDetails(this.paramCid); 
      }
    ) 
  }

  /***
   * open otp modal
   */
  openOtpModal(elm: any) {
    elm['key']=this.paramCid;
    const dialogRef = this._dialog.open(UsOtpVerificationModalComponent, {
      panelClass: ['ats-model-wrap', 'otp-modal'],
      data: elm,
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.hideFormControl = false;
          this.getCandidateDetails(this.paramCid);
          this.isOfferaccept = true
         
        }
      }
    )
  }

  /**get candidate details of US */
  public invalidUrl: boolean = false;
  getCandidateDetails(param: string) {
    // if (param) {
        /**status 1 for offered and else 2 for offer accepted */
    this._candServe.getCandidateDetailsByParam(param).subscribe(
      res => {
        if (res['data'][0]) {
          this.candidateDetails = res['data'][0];
          if (this.candidateDetails.status === 1) {
            //  this.sendOTPtoCandidate();
            this.hideFormControl = true;
            this.isOfferaccepted = false
          }
          else if (this.candidateDetails.status === 2) {
            this.hideFormControl = false;
            this.isOfferaccepted = true
          }
          else {
            this.hideFormControl = false;
            this.isOfferaccepted = false
          }
        }
        else {
          this._share.showAlertErrorMessage.next('Invalid Url.');
          this.invalidUrl = true;
        }
      }
    )
    // } else {
    //   this._share.showAlertErrorMessage.next('Invalid Url.');
    //   this.invalidUrl = true;
    // }

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
     // joiningDate: [null, Validators.required],
      status: [null]
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
    this.candidateDetails;
      if (form.valid) {
        let formData = form.value;
        formData['paramCid'] = this.paramCid;
        formData['email'] = this.candidateDetails?.Email;
        // this.decryptData['joiningDate'] = formData.joiningDate;
        this.offerSubmitFormGroup.reset();
        this.openOtpModal(formData);
        
      }
   
  }

  /**
   * reset form
   */
  resetForm() {
    this.offerSubmitFormGroup.reset();
  }



}
