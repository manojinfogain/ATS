import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SelectedCandListScreenComponent } from './selected-cand-list-screen/selected-cand-list-screen.component';
import { RecRecAdminSuperadminApproverGuard } from '../../core/guards/rec-rec-admin-superadmin-approver.guard ';
import { RecRecAdminSuperadminGuard } from '../../core/guards/rec-rec-admin-superadmin.guard';
import { ApprovedOfferCandidateListComponent } from './approved-offer-candidate-list/approved-offer-candidate-list.component';

const routes: Routes = [
  {
    path: 'offer-approval',
    component:SelectedCandListScreenComponent,
    data: { title: "Offer Approval" },
    canActivate:[RecRecAdminSuperadminApproverGuard]
  },
  {
    path: 'offer-generation',
    component:ApprovedOfferCandidateListComponent,
    data: { title: "Offer Generation" },
    canActivate:[RecRecAdminSuperadminGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class G5AboveOffersRoutingModule { }
