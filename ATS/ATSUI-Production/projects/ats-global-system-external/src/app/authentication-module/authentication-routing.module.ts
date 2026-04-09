import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AuthenticateOtpComponent } from './authenticate-otp/authenticate-otp.component';

const routes: Routes = [
  // {
  //   path: 'login',
  //   component:LoginComponent,
  //   data: { title: "Login" }
  // },
   {
    path: 'change-password',
    component:ChangePasswordComponent,
   // canActivate:[AuthGuard],
    data: { title: "change Password" }
  },
  {
    path: 'forgot-password',
    component:ForgotPasswordComponent,
   // canActivate:[AuthGuard],
    data: { title: "forgot Password" }
  },
  {
    path: 'otp-verification',
    component:AuthenticateOtpComponent,
   // canActivate:[AuthGuard],
    data: { title: "OTP Verification" }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
