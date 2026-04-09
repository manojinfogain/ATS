import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { partnerGuard } from '../core/guards/partner.guard';
import { RecAdminSuperadminGuard } from '../core/guards/rec-admin-superadmin.guard';
import { RecRecAdminSuperadminGuard } from '../core/guards/rec-rec-admin-superadmin.guard';
import { RoleWiseAccessGuard } from '../core/guards/roleWiseAccess.guard';
import { VendorGuard } from '../core/guards/vendor.guard';
import { AddProfileComponent } from './add-profile/add-profile.component';
import { CandidateProfileDetailsComponent } from './candidate-profile-details/candidate-profile-details.component';
import { CandidateProfilelistSharedbyPartnerComponent } from './candidate-profilelist-sharedby-partner/candidate-profilelist-sharedby-partner.component';
import { PartnerDashboardComponent } from './partner-dashboard/partner-dashboard.component';
import { PartnerRegistrationComponent } from './partner-registration/partner-registration.component';
import { PartnerTalentidDetailsComponent } from './partner-talentid-details/partner-talentid-details.component';
import { PartnerUserListingComponent } from './partner-user-listing/partner-user-listing.component';
import { PartnerUserRegistrationComponent } from './partner-user-registration/partner-user-registration.component';
import { RegisteredPartnerDetailsComponent } from './registered-partner-details/registered-partner-details.component';
import { TalentIdAssignedPartnerComponent } from './talent-id-assigned-partner/talent-id-assigned-partner.component';
import { AssignedTalentidPartnerListComponent } from './partner-talentid-details/assigned-talentid-partner-list/assigned-talentid-partner-list.component';
import { PartnerContractsDetailsScreenComponent } from './partner-contracts-details-screen/partner-contracts-details-screen.component';

const routes: Routes = [
  {
    path:'partner/dashboard',
    component:PartnerDashboardComponent,
    data:{title:"Dashboard"},
    canActivate:[partnerGuard]
  },
  {
    path:'partner-registration',
    component:PartnerRegistrationComponent,
    data:{title:"Partner Registration"},
    canActivate:[RecAdminSuperadminGuard]
  },
  // {
  //   path:'partner-details',
  //   component:RegisteredPartnerDetailsComponent,
  //   data:{title:"Partner Details"},
  //   canActivate:[RecAdminSuperadminGuard]
  // },
  {
    path:'partner-details',
    component:RegisteredPartnerDetailsComponent,
    data:{title:"Partner Details", role:[5],otherRole:['IsPartnerApprover']},
    canActivate: [RoleWiseAccessGuard]
  },
  {
    path: 'contract-details',
    component: PartnerContractsDetailsScreenComponent,
    data: { title: "Partner Contract Details", role: [5], otherRole: ['IsPartnerApprover'] },
    canActivate: [RoleWiseAccessGuard]
  },
  {
    path:'user-registration',
    component:PartnerUserRegistrationComponent,
    data:{title:"User Registration"},
    canActivate:[RecAdminSuperadminGuard]
  },
  {
    path:'user-details',
    component:PartnerUserListingComponent,
    data:{title:"User Details"},
    canActivate:[RecAdminSuperadminGuard]
  },
  {
    path:'add-candidate-profile',
    component:AddProfileComponent,
    data:{title:"Add Candidate Profile"},
    canActivate:[VendorGuard]
  },
  {
    path:'assign-talentId-partner',
    component:TalentIdAssignedPartnerComponent,
    data:{title:"Assign Talent ID To Partner"},
    canActivate:[RecRecAdminSuperadminGuard]
  },
  {
    path:'assigned-talentId-list-partner',
    component:AssignedTalentidPartnerListComponent,
    data:{title:"Assigned Talent ID List"},
    canActivate:[VendorGuard]
   // canActivate:[RecRecAdminSuperadminGuard]
  },
  {
    path:'partner-talentId-list',
    component:PartnerTalentidDetailsComponent,
    data:{title:"Partner Talent ID list",role:[5,2],otherRole:['IsTagLeadApprover']},
    canActivate:[RoleWiseAccessGuard]
   // canActivate:[RecRecAdminSuperadminGuard]
  },
  {
    path:'candidate-profile-list',
    component:CandidateProfileDetailsComponent,
    data:{title:"Candidate Profile List"},
    canActivate:[VendorGuard]
  },
  {
    path:'partner-profiles',
    component:CandidateProfilelistSharedbyPartnerComponent,
    data:{title:"Partner Profiles"},
    canActivate:[RecRecAdminSuperadminGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorPartnerRoutingModule { }
