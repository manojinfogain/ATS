import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CandidateModuleRoutingModule } from './candidate-module-routing.module';
import { CandidateOfferAcceptanceComponent } from './candidate-offer-acceptance/candidate-offer-acceptance.component';
import { SharedAppModule } from '../shared/shared-app/shared-app.module';
import { OtpVerificationComponent } from './modals/otp-verification/otp-verification.component';
import { CandidateDetailsOnboardComponent } from './candidate-details-onboard/candidate-details-onboard.component';
import { CommonSharingModule } from '../common-sharing/common-sharing.module';
import { VideoMatchScreenComponent } from './video-match-screen/video-match-screen.component';
import { OtpVerificationVideoMatchComponent } from './modals/otp-verification-video-match/otp-verification-video-match.component';

import { UsCandidateOfferAcceptanceComponent } from './us-candidate-offer-acceptance/us-candidate-offer-acceptance.component';
import { ViewAcceptOfferUsModalComponent } from './modals/view-accept-offer-us-modal/view-accept-offer-us-modal.component';
import { UsOtpVerificationModalComponent } from './modals/us-otp-verification-modal/us-otp-verification-modal.component';
import { FormControModalComponent } from './modals/form-contro-modal/form-contro-modal.component';
import { IndCandidateOfferAcceptanceComponent } from './ind-candidate-offer-acceptance/ind-candidate-offer-acceptance.component';
import { IndOtpVerificationModalComponent } from './modals/ind-otp-verification-modal/ind-otp-verification-modal.component';
import { ViewAcceptOfferIndModalComponent } from './modals/view-accept-offer-ind-modal/view-accept-offer-ind-modal.component';
import { ManualOfferAcceptIndModalComponent } from './modals/manual-offer-accept-ind-modal/manual-offer-accept-ind-modal.component';

@NgModule({
  declarations: [
    CandidateOfferAcceptanceComponent,
    OtpVerificationComponent,
    CandidateDetailsOnboardComponent,
    VideoMatchScreenComponent,
    OtpVerificationVideoMatchComponent,
    UsCandidateOfferAcceptanceComponent,
    ViewAcceptOfferUsModalComponent,
    UsOtpVerificationModalComponent,
    FormControModalComponent,
    IndCandidateOfferAcceptanceComponent,
    IndOtpVerificationModalComponent,
    ViewAcceptOfferIndModalComponent,
    ManualOfferAcceptIndModalComponent,
  ],
  imports: [
    CommonModule,
    CandidateModuleRoutingModule,
    SharedAppModule,
    CommonSharingModule
  ]
})
export class CandidateModuleModule { }
