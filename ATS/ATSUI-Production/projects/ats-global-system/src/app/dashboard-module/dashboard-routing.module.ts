import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllusersGuard } from '../core/guards/allusers.guard';
import { AccountOwnerDasboardComponent } from './account-owner-dasboard/account-owner-dasboard.component';
import { AssignedTalentidListComponent } from './assigned-talentid-list/assigned-talentid-list.component';
import { BuDashboardComponent } from './bu-dashboard/bu-dashboard.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DuDashboardComponent } from './du-dashboard/du-dashboard.component';
import { DuOverallHiringComponent } from './du-overall-hiring/du-overall-hiring.component';
import { HiringManagerDashboardComponent } from './hiring-manager-dashboard/hiring-manager-dashboard.component';
import { LocationSpecificHiringDetailsComponent } from './location-specific-hiring-details/location-specific-hiring-details.component';
import { OverallHiringOfferToJoiningComponent } from './overall-hiring-offer-to-joining/overall-hiring-offer-to-joining.component';
import { OverallHiringSourceTypeComponent } from './overall-hiring-source-type/overall-hiring-source-type.component';
import { PermanentHiringDetailsComponent } from './permanent-hiring-details/permanent-hiring-details.component';
import { PmDashboardComponent } from './pm-dashboard/pm-dashboard.component';
import { TotalOpenTalentListComponent } from './total-open-talent-list/total-open-talent-list.component';
import { ApprovalProfilesListComponent } from './approval-profiles-list/approval-profiles-list.component';
import { RoleWiseAccessGuard } from '../core/guards/roleWiseAccess.guard';
import { ProfileApprovalDetailsComponent } from './approval-profiles-list/profile-approval-details/profile-approval-details.component';

const routes: Routes = [
  {
    path: 'home',
    component: DashboardComponent,
    data: { title: "Home" },
    canActivate: [AllusersGuard]
  },
  {
    path: 'assigned-talentid',
    component: AssignedTalentidListComponent,
    data: { title: "Talent Ids assigned to me" },
    canActivate: [AllusersGuard]
  },
  {
    path: 'total-open-position',
    component: TotalOpenTalentListComponent,
    data: { title: "Total Open Positions" },
    canActivate: [AllusersGuard]
  },
  {
    path: 'dashboard/du',
    component: DuDashboardComponent,
    data: { title: "GDL Dashboard" },
    // canActivate:[AllusersGuard]
  },
  {
    path: 'dashboard/du-overall-hiring',
    component: DuOverallHiringComponent,
    data: { title: "GDL Overall Hiring" },
    // canActivate:[AllusersGuard]
  },
  {
    path: 'dashboard/permanent-hiring-details',
    component: PermanentHiringDetailsComponent,
    data: { title: "Permanent Hiring Details ( Gender Diversity )" },
    // canActivate:[AllusersGuard]
  },
  {
    path: 'dashboard/overall-hiring-offerTo-joining',
    component: OverallHiringOfferToJoiningComponent,
    data: { title: "Overall Hiring  ( Offer To Joining )" },
    // canActivate:[AllusersGuard]
  },
  {
    path: 'dashboard/location-specific-hiring-details',
    component: LocationSpecificHiringDetailsComponent,
    data: { title: "Overall Hiring ( Location Wise )" },
    // canActivate:[AllusersGuard]
  },
  {
    path: 'dashboard/source-type-hiring-details',
    component: OverallHiringSourceTypeComponent,
    data: { title: "Overall Hiring ( Source Type )" },
    // canActivate:[AllusersGuard]
  },
 
  /* BU renamed to MU - marketing Unit - 22-april-2024*/
  {
    path: 'dashboard/mu',
    component: BuDashboardComponent,
    data: { title: "MU Dashboard" },
    // canActivate:[AllusersGuard]
  },
  {
    path: 'dashboard/account',
    component: AccountOwnerDasboardComponent,
    data: { title: "Account Dashboard" },
    // canActivate:[AllusersGuard]
  },
  {
    path: 'dashboard/pm',
    component: PmDashboardComponent,
    data: { title: "PM Dashboard" },
    // canActivate:[AllusersGuard]
  },
  {
    path: 'dashboard/hiring-manager',
    component: HiringManagerDashboardComponent,
    data: { title: "Hiring Manager Dashboard" },
    // canActivate:[AllusersGuard]
  },
  {
    path: 'dashboard/hiring-manager',
    component: HiringManagerDashboardComponent,
    data: { title: "Hiring Manager Dashboard" },
    // canActivate:[AllusersGuard]
  },
  {
    path: 'Profile/approval',
    component: ApprovalProfilesListComponent,
    data: { title: "Profile Approval",role:[10,2],otherRole:['IsProfileApprover'] },
    canActivate:[RoleWiseAccessGuard]
  },
  {
    path: 'Profile/approval/:id',
    component: ProfileApprovalDetailsComponent,
    data: { title: "Profile Approval",role:[],otherRole:['IsProfileApprover'] },
    canActivate:[RoleWiseAccessGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
