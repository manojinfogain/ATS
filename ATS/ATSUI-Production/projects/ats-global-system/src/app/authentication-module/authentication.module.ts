import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { LoginComponent } from './login/login.component';
import { SharedAppModule } from '../shared/shared-app/shared-app.module';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { MfaOtpVerificationComponent } from './mfa-otp-verification/mfa-otp-verification.component';
import { AuthenticateOtpComponent } from './authenticate-otp/authenticate-otp.component';


@NgModule({
  declarations: [
   // LoginComponent
  
    ChangePasswordComponent,
   MfaOtpVerificationComponent,
   AuthenticateOtpComponent
  ],
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    SharedAppModule
  ]
})
export class AuthenticationModule { }
