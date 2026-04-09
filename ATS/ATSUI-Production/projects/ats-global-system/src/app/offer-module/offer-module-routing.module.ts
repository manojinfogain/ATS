import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DelegationGuard } from '../core/guards/delegation.guard';
import { RecRecAdminSuperadminApproverGuard } from '../core/guards/rec-rec-admin-superadmin-approver.guard ';
import { RecRecAdminSuperadminGuard } from '../core/guards/rec-rec-admin-superadmin.guard';
import { ApprovalScreenComponent } from './approval-screen/approval-screen.component';
import { DelegateRightsComponent } from './delegate-rights/delegate-rights.component';
import { OfferScreenComponent } from './offer-screen/offer-screen.component';
import { UserAuthLoadGuard } from '../core/guards/user-auth-load.guard';
import { UsHrApprovalScreenComponent } from './us-hr-approval-screen/us-hr-approval-screen.component';
import { RoleWiseAccessGuard } from '../core/guards/roleWiseAccess.guard';
import { OfferApprovalScreenComponent } from './approval-screen/offer-approval-screen/offer-approval-screen.component';
import { TransferApprovalScreenComponent } from './transfer-approval-screen/transfer-approval-screen.component';


const routes: Routes = [
  {
    path: 'offer-approval',
    component: ApprovalScreenComponent,
    data: { title: "Offer Approval" },
    canActivate: [RecRecAdminSuperadminApproverGuard]
  },
  {
    path: 'transfer-request-approval',
    component: TransferApprovalScreenComponent,
    data: { title: "Transfer Request Approval" },
    canActivate: [RecRecAdminSuperadminApproverGuard]
  },
  {
    path: 'offer-generation',
    component: OfferScreenComponent,
    data: { title: "Offer Generation" },
    canActivate: [RecRecAdminSuperadminGuard]
  }
  ,
  {
    path: 'delegate-rights',
    component: DelegateRightsComponent,
    data: { title: "Delegate Rights" },
    canActivate: [DelegationGuard]
  },

  {
    path: 'hr-offer-approval',
    component: UsHrApprovalScreenComponent,
    data: { title: "HR Offer Approval", role: [], otherRole: ['IsUSHrRole'] },
    canActivate: [RoleWiseAccessGuard]
  },
  {
    path: 'offer',
    loadChildren: () => import('./G5AboveOffer/g5-above-offers.module').then(m => m.G5AboveOffersModule),
    canLoad:[UserAuthLoadGuard]
  },
  
  { 
  path: 'approve-offer/:id', 
  component: OfferApprovalScreenComponent, 
  data: { title: "Offer Approval"}, 
  // canActivate: [RecRecAdminSuperadminApproverGuard]
  canActivate: [DelegationGuard]
},


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OfferModuleRoutingModule { }
