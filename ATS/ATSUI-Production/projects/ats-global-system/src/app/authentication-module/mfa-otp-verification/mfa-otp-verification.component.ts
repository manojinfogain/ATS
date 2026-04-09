import { Component, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../authentication.service';
import { GetSetStorageService } from '../../core/services/get-set-storage.service';
import { AuthenticationCommonService } from '../../core/authentication/authentication-common.service';
import { userDetails } from '../../core/models/user-details-model';
import { UserAuthService } from '../../core/authentication/user-auth.service';
import { ILogin } from '../../core/models/common-model';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ShareService } from '../../core/services/share.service';

@Component({
  selector: 'app-mfa-otp-verification',
  templateUrl: './mfa-otp-verification.component.html',
  styleUrls: ['./mfa-otp-verification.component.scss']
})
export class MfaOtpVerificationComponent implements OnInit {
  public submit: boolean = false;
  public display: string;
  public isResendShow: boolean = false;
  public isResendText: boolean = false;
  public isExpShow: boolean = false;
  public isTimerShow: boolean = false;
  public isOtpSent: boolean = false;
  public isError: boolean = false;

  public otpSubmitFormGroup: UntypedFormGroup = new UntypedFormGroup({});
  constructor(
    private _fb: UntypedFormBuilder,
    private _loginServe: AuthenticationService,
    private _storage: GetSetStorageService,
    private _userAuthCommon: AuthenticationCommonService,
    private _userAuth: UserAuthService,
    private router: Router,
    private _share: ShareService,
    // private _authServe: AuthenticationCommonService,
  ) { }

  ngOnInit(): void {
    this._share.hideSideBar.next(true);
    document.body.classList.add("auth-page-main");
    this.otpSubmitForm();
    const control = <UntypedFormArray>this.otpSubmitFormGroup.controls['item'];
    for (let i = 0; i < 6; i++) {
      control.push(this.initItemRow(null));
    }
    this.isOtpSent = true;
    this.isResendText = true;
    this.isExpShow = true;
  }


  ngAfterViewInit() {
    this.timer(2, 1);
    this.timer(15, 2);
  }

  /***
 *  password form Init
 */
  otpSubmitForm() {
    this.otpSubmitFormGroup = this._fb.group({
      item: this._fb.array([])
    })
  }
  getControl(name: string) {
    return this.otpSubmitFormGroup.get(name);
  }

  /***  get sort controls ***/
  get t() { return <UntypedFormArray>this.otpSubmitFormGroup.controls['item'] }

  initItemRow(data) {
    return this._fb.group({
      otpInput: [data, [Validators.required]]
    })
  }


  //opt resend
  resendOtp() {
    this.getControl('item').reset();
    this._userAuthCommon.SendOtp().subscribe(
      res => {
        this._share.showAlertSuccessMessage.next(res);
        this.isOtpSent = true;
        this.isResendText = true;
        this.isExpShow = true;
        this.isResendShow = false;
        this.timer(2, 1);
        this.timer(15, 2);
      },
      (er) => {
        this.isResendShow = true;
        // this.timer(0, 1);
        //  this.timer(0, 2);
      }
    )
  }

  resetItem() {
    this.getControl('item').reset();
  }

  /***
  * timer
  */
  // public resendMM: string = '00';
  // public resendSS: string = '00';
  // public expMM: string = '00';
  // public expSS: string = '00';
  // public timerInt: any;
  // timer(minute: number, type: number, show: boolean = true) {
  //   // let minute = 1;
  //   let seconds: number = minute * 60;
  //   let textSec: any = "0";
  //   let statSec: number = 60;
  //   const prefix = minute < 10 ? "0" : "";
  //   const timer = setInterval(() => {
  //     seconds--;
  //     if (statSec != 0) statSec--;
  //     else statSec = 59;

  //     if (statSec < 10) {
  //       textSec = "0" + statSec;
  //     } else textSec = statSec;

  //     this.display = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;
  //     if (type === 1) {
  //       this.resendMM = `${prefix}${Math.floor(seconds / 60)}`;
  //       this.resendSS = `${textSec}`;
  //     }
  //     else {
  //       this.expMM = `${prefix}${Math.floor(seconds / 60)}`;
  //       this.expSS = `${textSec}`;
  //     }

  //     if (seconds == 0) {
  //       if (type === 1) {
  //         this.isResendShow = true;
  //         this.isResendText = false;
  //       }
  //       else {
  //         this.isExpShow = true;
  //         this.isExpShow = false;
  //       }

  //       clearInterval(timer);
  //     }
  //   }, 1000);
  // }
  public resendMM: string = '00';
  public resendSS: string = '00';
  public expMM: string = '00';
  public expSS: string = '00';
  public resendTimerInt: any;  // Separate timer for Resend OTP
  public expTimerInt: any;  // Separate timer for OTP expiration
  public isExpText: boolean = true;
  timer(minute: number, type: number, show: boolean = true) {
    let seconds: number = minute * 60;
    let statSec: number = 60;
    let textSec: string = "00";
    const prefix = minute < 10 ? "0" : "";

    // Clear only the corresponding timer
    if (type === 1 && this.resendTimerInt) {
      clearInterval(this.resendTimerInt);
    } else if (type === 2 && this.expTimerInt) {
      clearInterval(this.expTimerInt);
    }

    const timerInstance = setInterval(() => {
      seconds--;
      statSec = (statSec !== 0) ? statSec - 1 : 59;
      textSec = (statSec < 10) ? "0" + statSec : String(statSec);

      if (type === 1) {
        this.resendMM = `${prefix}${Math.floor(seconds / 60)}`;
        this.resendSS = textSec;
      } else {
        this.expMM = `${prefix}${Math.floor(seconds / 60)}`;
        this.expSS = textSec;
      }

      if (seconds === 0) {
        clearInterval(timerInstance);  // Stop the timer

        if (type === 1) {
          this.isResendShow = true;
          this.isResendText = false;
        } else {
          this.isExpShow = false;
          this.isExpText = false;
        }
      }
    }, 1000);

    // Assign the correct timer instance
    if (type === 1) {
      this.resendTimerInt = timerInstance;
    } else {
      this.expTimerInt = timerInstance;
    }
  }

  submitForm(form: UntypedFormGroup) {
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
      let body: ILogin = {
        password: "",
        userName: this._storage.getUserEmail(),
      }

      this._loginServe.LoginUser(body, null, null, enterdOtp).subscribe(res => {
        this._storage.saveToken(res.access_token);
        this._storage.destroyTokenExTemp();
        this.getDetailsUser();
      },

        (err: HttpErrorResponse) => {
          if (err.error.statusCode == "404") {
            this._share.showAlertErrorMessage.next(err.error.error_description);
          }
          else if (err.status == 0) {
            this._share.showAlertErrorMessage.next(" Server Error");
          }
          else {
            this._share.showAlertErrorMessage.next(err.error.error_description);
          }

        }
      );
    }
  }

  //   /***
  //    * foucs input field
  //    */
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


  getDetailsUser() {
    this._userAuthCommon.getUser().subscribe(
      (res: userDetails) => {
        this._storage.setUserEmpId(res.EmpNewId);
        this._storage.setUserRole(res.RoleId);
        this._storage.setUserData(res);
        this._storage.setUserEmail(res.MailID);
        this._userAuth.redirectMethod();
      },
      (error) => {
        this._share.showAlertErrorMessage.next(error.error.message);
        // this.isLoading = false;
        // this.isLoadingHorz = false;
        // this.error = error.error.message;
        // this.isLoginErrorShow = true;
      }
    )
  }

  goToLogin() {
    this.router.navigate(['login']);
  }
  BacktoLoginPage(){
    this._userAuth.logOutAts();
  }

}
