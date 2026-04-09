import { Component, OnInit } from '@angular/core';
import { UntypedFormArray, FormArrayName, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthenticationCommonService } from '../../core/authentication/authentication-common.service';
import { ShareService } from '../../core/services/share.service';
import { Router } from '@angular/router';
import { GetSetStorageService } from '../../core/services/get-set-storage.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthenticationService } from '../authentication.service';
import { ILogin } from '../../core/models/common-model';
import { UserAuthService } from '../../core/authentication/user-auth.service';
import { userDetails } from '../../core/models/user-details-model';


@Component({
  selector: 'app-authenticate-otp',
  templateUrl: './authenticate-otp.component.html',
  styleUrls: ['./authenticate-otp.component.scss']
})
export class AuthenticateOtpComponent implements OnInit {
  public loginOtpForm: UntypedFormGroup = new UntypedFormGroup({});
  public isResendShow: boolean = false;
  public isResendText: boolean = false;
  public isExpShow: boolean = false;
  public isTimerShow: boolean = false;
  public encryptParam: string;
  public decryptData: any;
  public isOtpSent: boolean = false;
  constructor(
    private _fb: UntypedFormBuilder,
    private _authServe: AuthenticationCommonService,
    private _loginServe: AuthenticationService,
    private _share: ShareService,
    private _router: Router,
    private _storage: GetSetStorageService,
    private _userAuth: UserAuthService
  ) { }

  ngOnInit(): void {
    // this._share.hideTopRightMenu.next(true);
    this._share.hideSideBar.next(true);
    document.body.classList.add("auth-page-main");
    this.isOtpSent = true;
    this.isResendText = true;
    this.isExpShow = true;

    this.loginOtpFormFuc();
    const control = <UntypedFormArray>this.loginOtpForm.controls['item'];
    for (let i = 0; i < 6; i++) {
      control.push(this.initItemRow(null));
    }
  }

  ngAfterViewInit() {
    this.timer(2, 1);
    this.timer(15, 2);
  }


  resendOtp() {
    this._authServe.SendOtp().subscribe(
      res => {
        this._share.showAlertSuccessMessage.next(res);
        this.isOtpSent = true;
        this.isResendText = true;
        this.isExpShow = true;
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

  /***
*  password form Init
*/
  loginOtpFormFuc() {
    this.loginOtpForm = this._fb.group({
      item: this._fb.array([])
    })
  }
  getControl(name: string) {
    return this.loginOtpForm.get(name);
  }

  resetField(){
    //this.loginOtpForm.reset();
    this.t.reset();
  }

  BacktoLoginPage(){
    this._userAuth.logOutAts();
  }

  /***  get sort controls ***/
  get t() { return <UntypedFormArray>this.loginOtpForm.controls['item'] }

  initItemRow(data) {
    return this._fb.group({
      otpInput: [data, [Validators.required]]
    })
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

  /***
  * timer
  */
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

          this.isResendShow = true;
          this.isOtpSent = false;
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
        // this.userData = res;
        this._storage.saveToken(res.access_token);
        this._storage.destroyTokenExTemp();
        this.getDetailsUser();
      },

        (err: HttpErrorResponse) => {
          // console.warn(err);
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

  getDetailsUser() {
    this._authServe.getUser().subscribe(
      (res: userDetails) => {
        this._storage.setUserEmpId(res.EmpNewId);
        this._storage.setUserRole(res.RoleId);
        this._storage.setUserData(res);
        this._storage.setUserEmail(res.MailID);
        this._storage.setIsFinalStatud(res['FinalStatus']);
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

}
