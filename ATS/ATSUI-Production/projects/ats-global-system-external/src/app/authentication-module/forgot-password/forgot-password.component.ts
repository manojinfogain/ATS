import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationCommonService } from 'projects/ats-global-system-external/src/app/core/authentication/authentication-common.service';
import { ShareService } from 'projects/ats-global-system-external/src/app/core/services/share.service';
import { PasswordValidation } from 'projects/ats-global-system-external/src/app/core/validators/password-validator';
import { GlobalCommonMethodService } from '../../core/common/global-common-method.service';
import { GetSetStorageService } from '../../core/services/get-set-storage.service';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  public passwordForm: UntypedFormGroup = new UntypedFormGroup({});
  public isForgot: boolean = true;
  public hiddenEmail: string = '';
  constructor(private _fb: UntypedFormBuilder,
    private _authServe: AuthenticationCommonService,
    private _share: ShareService,
    private _router: Router,
    private _globalMethodServe: GlobalCommonMethodService,
      private _storage: GetSetStorageService
  ) { }

  ngOnInit(): void {
    this.AuithenticateCandidate();
    this._share.hideTopRightMenu.next(true);
    this._share.hideSideBar.next(true);
    document.body.classList.add("auth-page-main");
    this.InitSendEmailForm();
    
  }

  AuithenticateCandidate() {
    this._authServe.getToken().subscribe(
      res => {
        this._storage.saveTokenEx(res.access_token);
      }
    )
  }

  /***
  *  password form Init
  */
  InitSendEmailForm() {
    this.passwordForm = this._fb.group({
      password: [null],
      confirmPassword: [null],
      email: [null, [Validators.required, Validators.email]],
      otp: [null]
    },
      {
        validator: PasswordValidation.MatchPassword
      })
  }

  getControl(name: string) {
    return this.passwordForm.get(name);
  }

  clearSetValidationSendOtp() {
    this.getControl('email').clearValidators();
    this.getControl('email').updateValueAndValidity();
    this.getControl('otp').setValidators([Validators.required]);
    this.getControl('otp').updateValueAndValidity();
  }

  resendOTP(){
    this._authServe.forgotPasword(this.email).subscribe(
      res => {
        this._share.showAlertSuccessMessage.next(res);
        this.isForgot = false;
        // this._router.navigate(['login']);
      }
    )
  }

  /**
   * submit password
   * @param form 
   */

  public email:string = '';
  submitForm(form: UntypedFormGroup) {
    // form.markAllAsTouched();
    if (form.valid) {
      let formValue = form.value;
      if (this.isForgot) {
        this.email =formValue.email;
        this.hiddenEmail = this._globalMethodServe.hideEmail(formValue.email) || '';
        this._authServe.forgotPasword(formValue.email).subscribe(
          res => {
            this._share.showAlertSuccessMessage.next(res);
            this.isForgot = false;
            // this._router.navigate(['login']);
          }
        )

      }
      else {
        this._authServe.changePasswordOTP(formValue.email, formValue.password, formValue.otp).subscribe(
          res => {
            this._share.showAlertSuccessMessage.next(res);
            this._router.navigate(['login']);
          }
        )
      }
    }
  }
  /**
   * reset form
   */
  resetForm() {
    this.passwordForm.reset();
    this.passwordForm?.get('password').setErrors({ required: true });
  }


}
