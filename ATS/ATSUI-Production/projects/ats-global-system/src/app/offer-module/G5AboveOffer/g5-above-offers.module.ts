import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { G5AboveOffersRoutingModule } from './g5-above-offers-routing.module';
import { SelectedCandListScreenComponent } from './selected-cand-list-screen/selected-cand-list-screen.component';
import { SharedAppModule } from '../../shared/shared-app/shared-app.module';
import { CandidateOfferApprovalModalComponent } from './selected-cand-list-screen/candidate-offer-approval-modal/candidate-offer-approval-modal.component';
import { OfferApproveActionModalComponent } from './selected-cand-list-screen/offer-approve-action-modal/offer-approve-action-modal.component';
import { ApprovedOfferCandidateListComponent } from './approved-offer-candidate-list/approved-offer-candidate-list.component';
import { OfferGenScreenModalComponent } from './approved-offer-candidate-list/offer-gen-screen-modal/offer-gen-screen-modal.component';
import { ManualOfferGenScreenModalComponent } from './approved-offer-candidate-list/manual-offer-gen-screen-modal/manual-offer-gen-screen-modal.component';
import { AddApproverDailogComponent } from './dialog/add-approver-dailog/add-approver-dailog.component';

@NgModule({
  declarations: [
    SelectedCandListScreenComponent,
    CandidateOfferApprovalModalComponent,
    OfferApproveActionModalComponent,
    ApprovedOfferCandidateListComponent,
    OfferGenScreenModalComponent,
    ManualOfferGenScreenModalComponent,
    AddApproverDailogComponent
  ],
  imports: [
    CommonModule,
    G5AboveOffersRoutingModule,
    SharedAppModule
  ]
})
export class G5AboveOffersModule { }
