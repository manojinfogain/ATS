import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationCommonService } from 'projects/ats-global-system/src/app/core/authentication/authentication-common.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { PasswordValidation } from 'projects/ats-global-system/src/app/core/validators/password-validator';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  public passwordForm:UntypedFormGroup =  new UntypedFormGroup({});
  constructor(private _fb:UntypedFormBuilder,
    private _authServe:AuthenticationCommonService,
    private _share:ShareService,
    private _router:Router
    ) { }

  ngOnInit(): void {
    document.body.classList.add("auth-page-main");
    this.InitSendEmailForm();
  }

   /***
   *  password form Init
   */
    InitSendEmailForm(){
      this.passwordForm = this._fb.group({
        password:[null,[Validators.required]],
        confirmPassword:[null,[Validators.required]]
      },
      {
        validator: PasswordValidation.MatchPassword
      })
    }

    /**
     * submit password
     * @param form 
     */

    submitForm(form:UntypedFormGroup){
      form.markAllAsTouched();
      if(form.valid){
        let formData = form.value;
       this._authServe.changeUserPassword(formData.password).subscribe(
         res=>{
          document.body.classList.remove("auth-page-main");
          this._share.showAlertSuccessMessage.next(res);
          this._router.navigate(['partner/dashboard']);
         }
       )
      }
    }
  /**
   * reset form
   */
    resetForm(){
      this.passwordForm.reset();
    }

}
