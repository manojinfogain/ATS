import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CandidateModuleRoutingModule } from './candidate-module-routing.module';
import { CandidateOfferAcceptanceComponent } from './candidate-offer-acceptance/candidate-offer-acceptance.component';
import { SharedAppModule } from '../shared/shared-app/shared-app.module';
import { OtpVerificationComponent } from './modals/otp-verification/otp-verification.component';
import { CandidateDetailsOnboardComponent } from './candidate-details-onboard/candidate-details-onboard.component';
import { CommonSharingModule } from '../common-sharing/common-sharing.module';
import { CandidateOnboardFormsComponent } from './candidate-onboard-forms/candidate-onboard-forms.component';
import { AccesscardFormComponent } from './candidate-onboard-forms/modal/accesscard-form/accesscard-form.component';
import { JoiningFormComponent } from './candidate-onboard-forms/modal/joining-form/joining-form.component';
import { PersonalDtgFormComponent } from './candidate-onboard-forms/modal/personal-dtg-form/personal-dtg-form.component';
import { PrintScreenComponent } from './print-screen/print-screen.component';
import { FormVisibleModalOnbComponent } from './candidate-onboard-forms/modal/form-visible-modal-onb/form-visible-modal-onb.component';
import { UndertakingCurrentAddressComponent } from './candidate-onboard-forms/modal/undertaking-current-address/undertaking-current-address.component';
import { UndertakingPendingDocsComponent } from './candidate-onboard-forms/modal/undertaking-pending-docs/undertaking-pending-docs.component';
import { SudexoFormComponent } from './candidate-onboard-forms/modal/sudexo-form/sudexo-form.component';
import { PfFormComponent } from './candidate-onboard-forms/modal/pf-form/pf-form.component';
import { UploadFormsModalComponent } from './candidate-onboard-forms/modal/upload-forms-modal/upload-forms-modal.component';
import { AtsLibModule } from 'projects/ats-lib/src/public-api';
import { LeadershipOnboardDetailsComponent } from './leadership-onboard-details/leadership-onboard-details.component';
import { CandidateOnboardEafScreenComponent } from './candidate-onboard-eaf-screen/candidate-onboard-eaf-screen.component';
import { CandidateBgvFormsComponent } from './candidate-bgv-forms/candidate-bgv-forms.component';
import { ConfirmIfBgSubmittedComponent } from './modals/confirm-if-bg-submitted/confirm-if-bg-submitted.component';



@NgModule({
  declarations: [
    CandidateOfferAcceptanceComponent,
    OtpVerificationComponent,
    CandidateDetailsOnboardComponent,
    CandidateOnboardFormsComponent,
    AccesscardFormComponent,
    JoiningFormComponent,
    PersonalDtgFormComponent,
    PrintScreenComponent,
    FormVisibleModalOnbComponent,
    UndertakingCurrentAddressComponent,
    UndertakingPendingDocsComponent,
    SudexoFormComponent,
    PfFormComponent,
    UploadFormsModalComponent,
    LeadershipOnboardDetailsComponent,
    CandidateOnboardEafScreenComponent,
    CandidateBgvFormsComponent,
    ConfirmIfBgSubmittedComponent
  ],
  imports: [
    CommonModule,
    CandidateModuleRoutingModule,
    SharedAppModule,
    CommonSharingModule,
    AtsLibModule
  ]
})
export class CandidateModuleModule { }
