import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllusersGuard } from '../core/guards/allusers.guard';
import { AuthGuard } from '../core/guards/auth.guard';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { LoginComponent } from './login/login.component';

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
    data: { title: "change-password" }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
