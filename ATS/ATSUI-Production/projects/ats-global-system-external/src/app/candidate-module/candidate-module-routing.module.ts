import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CandidateDetailsOnboardComponent } from './candidate-details-onboard/candidate-details-onboard.component';
import { CandidateOfferAcceptanceComponent } from './candidate-offer-acceptance/candidate-offer-acceptance.component';
import { CandidateOnboardFormsComponent } from './candidate-onboard-forms/candidate-onboard-forms.component';
import { PrintScreenComponent } from './print-screen/print-screen.component';
import { CandidateOnboardEafScreenComponent } from './candidate-onboard-eaf-screen/candidate-onboard-eaf-screen.component';
import { CandidateBgvFormsComponent } from './candidate-bgv-forms/candidate-bgv-forms.component';

const routes: Routes = [
  {
    path: 'offer-accept',
    component:CandidateOfferAcceptanceComponent,
    data: {title:'Offer Accept'}
  },
  // {
  //   path:'accept-offer',
  //   component:CandidateOfferAcceptanceComponent,
  //   data: {title:'Candidate Offer Accept'}
  // }
  {
    path: 'employment-application-form',
    component:CandidateOnboardEafScreenComponent,
    data: {title:'Employment Application Form'}
  },
   {
    path: 'upload-bgv-documents',
    component:CandidateBgvFormsComponent,
    data: {title:'Update Background Verification Details'}
  },
  {
    path: 'onboarding-form',
    component:CandidateOnboardFormsComponent,
    data: {title:'Pre Onboarding Form'}
  },
  {
    path: 'preview-form',
    component:PrintScreenComponent,
    data: {title:'Preview Form'}
  },
  {
    path: '',
    loadChildren: () => import('../candidate-module/candidate-day-one-forms/candidate-day-one-forms.module').then(m => m.CandidateDayOneFormsModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CandidateModuleRoutingModule { }
