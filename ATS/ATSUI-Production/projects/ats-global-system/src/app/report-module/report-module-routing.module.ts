import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecAdminSuperadminGuard } from '../core/guards/rec-admin-superadmin.guard';
import { RecRecAdminSuperadminGuard } from '../core/guards/rec-rec-admin-superadmin.guard';
import { RoleWiseAccessGuard } from '../core/guards/roleWiseAccess.guard';
import { SpecialAccessGuard } from '../core/guards/special-access.guard ';
import { SuperadminGuard } from '../core/guards/superadmin.guard';
import { CandidateOfferReportComponent } from './candidate-offer-report/candidate-offer-report.component';
import { DeliveryWiseReportComponent } from './delivery-wise-report/delivery-wise-report.component';
import { EmployeeReferalReportComponent } from './employee-referal-report/employee-referal-report.component';
import { InterviewProcessReportComponent } from './interview-process-report/interview-process-report.component';
import { OpenPositionReportComponent } from './open-position-report/open-position-report.component';
import { PanelWiseReportComponent } from './panel-wise-report/panel-wise-report.component';
import { RecruiterProductivityReporComponent } from './recruiter-productivity-repor/recruiter-productivity-repor.component';
import { RecruiterWiseReportComponent } from './recruiter-wise-report/recruiter-wise-report.component';
import { ReportDashboardComponent } from './report-dashboard/report-dashboard.component';
import { SalaryDeviationReportComponent } from './salary-deviation-report/salary-deviation-report.component';
import { ShippingAddresConfirmationStatusReportComponent } from './shipping-addres-confirmation-status-report/shipping-addres-confirmation-status-report.component';
import { PanelWiseReportLatestComponent } from './panel-wise-report-latest/panel-wise-report-latest.component';
import { HiringTrackerReportComponent } from './hiring-tracker-report/hiring-tracker-report.component';
import { RenuCandidateWiseReportComponent } from './renu-candidate-wise-report/renu-candidate-wise-report.component';
import { IjpReportWmgComponent } from './ijp-report-wmg/ijp-report-wmg.component';
import { UsHiringTrackerComponent } from './us-hiring-tracker/us-hiring-tracker.component';
import { CandidateIntToOnboarVideoComComponent } from './candidate-int-to-onboar-video-com/candidate-int-to-onboar-video-com.component';
import { SalaryDeviationReportUsComponent } from './salary-deviation-report-us/salary-deviation-report-us.component';
import { PolandDemandReportComponent } from './poland-demand-report/poland-demand-report.component';

const routes: Routes = [
  // {
  //   path: 'report/dashboard',
  //   component:ReportDashboardComponent,
  //   data: { title: "Dashboard" },
  //   canActivate:[SpecialAccessGuard]
  // },
  {
    path: 'panel-wise-report',
    component: PanelWiseReportComponent,
    data: { title: "Panel Wise Report (Technical)" },
    canActivate: [RecAdminSuperadminGuard]
  },
  {
    path: 'uat/panel-wise-report',
    component: PanelWiseReportLatestComponent,
    data: { title: "Panel Wise Report" },
    // canActivate:[RecAdminSuperadminGuard]
  },

  {
    path: 'recruiter-wise-report',
    component: RecruiterWiseReportComponent,
    data: { title: "TAG Team Report" },
    canActivate: [RecAdminSuperadminGuard]
  },
  {
    path: 'delivery-wise-report',
    component: DeliveryWiseReportComponent,
    data: { title: "Delivery Wise Report" },
    canActivate: [RecAdminSuperadminGuard]
  },
  {
    path: 'employee-referral-report',
    component: EmployeeReferalReportComponent,
    data: { title: "Employee Referral Report" },
    canActivate: [RecAdminSuperadminGuard]
  },
  {
    path: 'open-position-report',
    component: OpenPositionReportComponent,
    data: { title: "Open Position Report", role: [5], otherRole: [] },
    canActivate: [RoleWiseAccessGuard]
  },
  {
    path: 'uat/open-position-report-uat',
    component: OpenPositionReportComponent,
    data: { title: "Open Position Report" },
    canActivate: [RecAdminSuperadminGuard]
  },
  {
    path: 'recruiter-productivity-report',
    component: RecruiterProductivityReporComponent,
    data: { title: "Recruiter Productivity Report" },
    canActivate: [RecRecAdminSuperadminGuard]
  }
  ,
  {
    path: 'salary-deviation-report',
    component: SalaryDeviationReportComponent,
    data: { title: "Salary Deviation Report", role: [5], otherRole: ['IsDH', 'IsBUHead', 'IsAO'] },
    canActivate: [RoleWiseAccessGuard]
  },
  // {
  //   path: 'uat/salary-deviation-report-uat',
  //   component:SalaryDeviationReportComponent,
  //   data: { title: "Salary Deviation Report",role:[],otherRole:[]},
  //   canActivate:[RoleWiseAccessGuard]
  // },
  {
    path: 'candidate-offer-report',
    component: CandidateOfferReportComponent,
    data: { title: "Candidate Offer Report", role: [5], otherRole: ['IsDH', 'IsBUHead', 'IsAO'] },
    canActivate: [RoleWiseAccessGuard]
  },
  // {
  //   path: 'uat/candidate-offer-report-uat',
  //   component:CandidateOfferReportComponent,
  //   data: { title: "Candidate Offer Report" },
  //   canActivate:[SuperadminGuard]
  // },
  {
    path: 'hiring-tracker',
    component: HiringTrackerReportComponent,
    data: { title: "Hiring Tracker", role: [0], otherRole: ['IsRenuTeam'] },
    canActivate: [RoleWiseAccessGuard]
  },
  {
    path: 'us/hiring-tracker',
    component: UsHiringTrackerComponent,
    data: { title: "Hiring Tracker" },
    // canActivate:[RoleWiseAccessGuard]
  },

  {
    path: 'current-address-confirmation-report',
    component: ShippingAddresConfirmationStatusReportComponent,
    data: { title: "Current Address Confirmation Status Report" },
    canActivate: [RecRecAdminSuperadminGuard]
  },
  {
    path: 'interview-process-report',
    component: InterviewProcessReportComponent,
    data: { title: " Interview Process Report" },
    canActivate: [RecRecAdminSuperadminGuard]
  },
  {
    path: 'uat/interview-process-report-uat',
    component: InterviewProcessReportComponent,
    data: { title: " Interview Process Report" },
    canActivate: [SuperadminGuard]
  },
  {
    path: 'candidate-wise-report',
    component: RenuCandidateWiseReportComponent,
    data: { title: "Candidate Wise Report", role: [0], otherRole: ['IsRenuTeam'] },
    canActivate: [RoleWiseAccessGuard]
  },
  {
    path: 'ijp-report',
    component: IjpReportWmgComponent,
    data: { title: "IJP Report", role: [0], otherRole: ['IsWMG'] },
    canActivate: [RoleWiseAccessGuard]
  },

  {
    path: 'candidate-interview-onboarding-video-Report',
    component: CandidateIntToOnboarVideoComComponent,
    data: { title: "Interview to Onboarding Video Comparison Report", role: [1, 5], otherRole: ['IsVideoComparisonReport', 'IsIssAssestDelivery'] },
    canActivate: [RoleWiseAccessGuard]
  },
  {
    path: 'us/salary-deviation-report',
    component: SalaryDeviationReportUsComponent,
    data: { title: "Salary Deviation Report", role: [5], otherRole: ['IsUatReportAccess'] },
    canActivate: [RoleWiseAccessGuard]
  },
   {
    path: 'poland-demand-report',
    component: PolandDemandReportComponent,
    data: { title: "Poland Demand Report", role: [5], otherRole: ['IsUatReportAccess']},
    canActivate: [RoleWiseAccessGuard]
  },

];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportModuleRoutingModule { }
