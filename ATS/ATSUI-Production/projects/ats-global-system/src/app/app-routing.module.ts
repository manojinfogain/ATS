import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './authentication-module/login/login.component';
import { UserAuthLoadGuard } from './core/guards/user-auth-load.guard';
import { ComingSoonComponent } from './shared/shared-landing/components/coming-soon/coming-soon.component';
import { PageNotFoundComponent } from './shared/shared-landing/components/page-not-found/page-not-found.component';
import { MfaOtpVerificationComponent } from './authentication-module/mfa-otp-verification/mfa-otp-verification.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: "/home",
    pathMatch: 'full'
  },
  {
    path: 'login',
    component:LoginComponent,
    data: { title: "Login" }
  },
  {
    path: 'mfa-otp-verification',
    component:MfaOtpVerificationComponent,
    data: { title: "OTP Verification" }
  },
  {
    path: '',
    loadChildren: () => import('../app/authentication-module/authentication.module').then(m => m.AuthenticationModule)
  },
  {
    path: '',
    loadChildren: () => import('../app/candidate-connect-module/candidate-connect.module').then(m => m.CandidateConnectModule),
    // canLoad:[UserAuthLoadGuard]
  },
  {
    path: '',
    loadChildren: () => import('../app/candidate-module/candidate-module.module').then(m => m.CandidateModuleModule)
  },
  {
    path: '',
    loadChildren: () => import('../app/dashboard-module/dashboard.module').then(m => m.DashboardModule),
    canLoad:[UserAuthLoadGuard]
  },

  {
    path: '',
    loadChildren: () => import('../app/buddy-module/buddy.module').then(m => m.BuddyModule),
    canLoad:[UserAuthLoadGuard]
  },
  {
    path: '',
    loadChildren: () => import('../app/interview-module/interview-module.module').then(m => m.InterviewModuleModule),
    canLoad:[UserAuthLoadGuard]
  },
  {
    path: '',
    loadChildren: () => import('../app/hr-module/hr-module.module').then(m => m.HrModuleModule),
    canLoad:[UserAuthLoadGuard]
  },
  {
    path: '',
    loadChildren: () => import('../app/report-module/report-module.module').then(m => m.ReportModuleModule),
    canLoad:[UserAuthLoadGuard]
  },
  {
    path: '',
    loadChildren: () => import('../app/vendor-partner-module/vendor-partner.module').then(m => m.VendorPartnerModule),
    canLoad:[UserAuthLoadGuard]
  },
  {
    path: '',
    loadChildren: () => import('../app/offer-module/offer-module.module').then(m => m.OfferModuleModule),
    canLoad:[UserAuthLoadGuard]
  },

  {
    path: '',
    loadChildren: () => import('../app/offer-module/offer-module.module').then(m => m.OfferModuleModule),
    canLoad:[UserAuthLoadGuard]
  },
  {
    path: '',
    loadChildren: () => import('../app/onboard-module/onboard.module').then(m => m.OnboardModule),
    canLoad:[UserAuthLoadGuard]
  },
  {
    path: '',
    loadChildren: () => import('../app/talent-module/talent.module').then(m => m.TalentModule),
    canLoad:[UserAuthLoadGuard]
  },
  {
    path: '',
    loadChildren: () => import('../app/admin-module/admin-module.module').then(m => m.AdminModuleModule),
    canLoad:[UserAuthLoadGuard]
  },
  {
    path: '',
    loadChildren: () => import('../app/panel-self-nomination-module/panel-self-nomination.module').then(m => m.PanelSelfNominationModule),
    canLoad:[UserAuthLoadGuard]
  },
  {
    path: '',
    loadChildren: () => import('../app/bgv-module/bgv-module.module').then(m => m.BgvModuleModule),
    canLoad:[UserAuthLoadGuard]
  },
  // {
  //   path: '',
  //   loadChildren: () => import('../app/leadership-hiring/leadership-hiring.module').then(m => m.LeadershipHiringModule),
  //   canLoad:[UserAuthLoadGuard]
  // },
  // {
  //   path: '',
  //   loadChildren: () => import('../app/candidate-module/candidate-module.module').then(m => m.CandidateModuleModule)
  // },
  {
    path: 'coming-soon',
    component:ComingSoonComponent,
    data: { title: "Coming Soon" }
  },
  
  { path : '**', component : PageNotFoundComponent,  data: {title : "Page Not Found"},canLoad:[UserAuthLoadGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes),],
  exports: [RouterModule]
})
export class AppRoutingModule { }
