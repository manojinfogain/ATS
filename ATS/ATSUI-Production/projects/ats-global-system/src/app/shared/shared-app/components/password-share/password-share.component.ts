
import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
@Component({
  selector: 'app-password-share',
  templateUrl: './password-share.component.html',
  styleUrls: ['./password-share.component.scss']
})
export class PasswordShareComponent implements OnInit {
  @Input() form: UntypedFormGroup =  new UntypedFormGroup({});
  @Input() passText?:string = "Password";
  public isPasswordError: boolean = false;
  public passwordErrorMessage?:string;
  public hide = true;
  public minLen: boolean = false;
  public minUpper: boolean = false;
  public minLower: boolean = false;
  public minNumber: boolean = false;
  public minUserName: boolean = false;
  constructor() { }

  ngOnInit(): void {
    this.checkPasswordValidation();
  }

  get password(){ return this.form?.get('password')};
  get confirmPassword(){ return this.form?.get('confirmPassword')};

   /** Method to check password Validations  */
   checkPasswordValidation(): void {
    let user_password = this.password;
    user_password?.valueChanges.subscribe(
      val => {
      //  this.showPasswordErrorMsg(val);
        this.addClassDynamic(val);
      }
    );
  }
  /****** Method for password validation *******/
  showPasswordErrorMsg(val:string) {
    let user_password = this.password;
    this.confirmPassword?.reset();
    if (val) {
      if (!val.match(/[a-z]/)) {
        this.isPasswordError = true;
       // this.passwordErrorMessage = "validationMessage.password_Sm";
        user_password?.setErrors({ WrongPassowrd: true });
      }
      else if (!val.match(/[A-Z]/)) {
        this.isPasswordError = true;
      //  this.passwordErrorMessage = "validationMessage.password_Cap";
        user_password?.setErrors({ WrongPassowrd: true });
      }
      else if (!val.match(/[0-9]/)) {
        this.isPasswordError = true;
       // this.passwordErrorMessage = "validationMessage.password_Num";
        user_password?.setErrors({ WrongPassowrd: true });
      }
      else if (val.trim().length < 6) {
        this.isPasswordError = true;
      //  this.passwordErrorMessage = "validationMessage.password_Len";
        user_password?.setErrors({ WrongPassowrd: true });
      }
      else {
        this.isPasswordError = false;
      }
    }
    else {
      this.isPasswordError = false;
    }
  }

  /******
   *   highlight password validation
   *    *******/
  addClassDynamic(val:string) {
    let user_password = this.password;
    this.confirmPassword?.reset();
    if (val) {
      if (val.match(/[a-z]/)) {
        this.minLower = true;
      }
      if (!val.match(/[a-z]/)) {
        this.minLower = false;
        user_password?.setErrors({ WrongPassowrd: true });
      }
      if (val.match(/[A-Z]/)) {
        this.minUpper = true;
      }
      if (!val.match(/[A-Z]/)) {
        this.minUpper = false;
        user_password?.setErrors({ WrongPassowrd: true });
      }
      if (val.match(/[0-9]/)) {
        this.minNumber = true;
      }
      if (!val.match(/[0-9]/)) {
        this.minNumber = false;
        user_password?.setErrors({ WrongPassowrd: true });
      }
      if (val.trim().length >= 6) {
        this.minLen = true;
      } 
      if (val.trim().length < 6) {
        this.minLen = false;
        user_password?.setErrors({ WrongPassowrd: true });
      } else {
      }
    } else {
      // this.isPasswordError = false;
      this.isPasswordError = false;
      this.isPasswordError = false;
      this.minUserName = false;
      this.minLower = false;
      this.minUpper = false;
      this.minNumber = false;
      this.minLen = false;
      user_password?.setErrors({ WrongPassowrd: true });
    }
}

}
