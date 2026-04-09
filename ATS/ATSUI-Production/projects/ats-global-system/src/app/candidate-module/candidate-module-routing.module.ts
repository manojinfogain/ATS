import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CandidateDetailsOnboardComponent } from './candidate-details-onboard/candidate-details-onboard.component';
import { CandidateOfferAcceptanceComponent } from './candidate-offer-acceptance/candidate-offer-acceptance.component';
import { VideoMatchScreenComponent } from './video-match-screen/video-match-screen.component';
import { UsCandidateOfferAcceptanceComponent } from './us-candidate-offer-acceptance/us-candidate-offer-acceptance.component';
import { ViewAcceptOfferUsModalComponent } from './modals/view-accept-offer-us-modal/view-accept-offer-us-modal.component';
import { IndCandidateOfferAcceptanceComponent } from './ind-candidate-offer-acceptance/ind-candidate-offer-acceptance.component';

const routes: Routes = [
  {
    path: 'offer-accept',
    component: CandidateOfferAcceptanceComponent,
    data: { title: 'Offer Accept'}
  },
  {
    path: 'us-offer-accept',
    component: UsCandidateOfferAcceptanceComponent,
    data: { title: 'Offer Accept'}
  },
  {
    path: 'in/offer-accept',
    component: IndCandidateOfferAcceptanceComponent,
    data: { title: 'Offer Accept'}
  },
  // {
  //   path: 'us-view-accept-offer',
  //   component: ViewAcceptOfferUsModalComponent,
  //   data: { title: 'View Accept Offer' }
  // },

  // {
  //   path:'accept-offer',
  //   component:CandidateOfferAcceptanceComponent,
  //   data: {title:'Candidate Offer Accept'}
  // }
  {
    path: 'candidate-screen',
    component:CandidateDetailsOnboardComponent,
    data: {title:'Employment Application Details'}
  },
  {
    path: 'video-match',
    component:VideoMatchScreenComponent,
    data: {title:'Video Match'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CandidateModuleRoutingModule { }
