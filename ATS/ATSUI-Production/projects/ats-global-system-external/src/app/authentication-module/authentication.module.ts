import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { LoginComponent } from './login/login.component';
import { SharedAppModule } from '../shared/shared-app/shared-app.module';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AuthenticateOtpComponent } from './authenticate-otp/authenticate-otp.component';


@NgModule({
  declarations: [
   // LoginComponent
  
    ChangePasswordComponent,
   ForgotPasswordComponent,
   AuthenticateOtpComponent
  ],
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    SharedAppModule
  ]
})
export class AuthenticationModule { }
