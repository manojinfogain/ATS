import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OnboardRoutingModule } from './onboard-routing.module';
import { PipelineJoineeComponent } from './pipeline-joinee/pipeline-joinee.component';
import { SharedAppModule } from '../shared/shared-app/shared-app.module';
import { UpdateCandidateJoiningStatusComponent } from './modals/update-candidate-joining-status/update-candidate-joining-status.component';
import { AddEmpEmailDomainComponent } from './modals/add-emp-email-domain/add-emp-email-domain.component';
import { ViewAllCandidateDetailsOnboardComponent } from './modals/view-all-candidate-details-onboard/view-all-candidate-details-onboard.component';
import { CommonSharingModule } from '../common-sharing/common-sharing.module';
import { OnboardCandidateListComponent } from './onboard-candidate-list/onboard-candidate-list.component';
import { OnbVerificationModalComponent } from './modals/onb-verification-modal/onb-verification-modal.component';
import { CandidateIdentityVerificationModalHrComponent } from './modals/candidate-identity-verification-modal-hr/candidate-identity-verification-modal-hr.component';
import { FileImgViewComponent } from './modals/candidate-identity-verification-modal-hr/file-img-view/file-img-view.component';
import { CandidateOnboardVerificationListComponent } from './candidate-onboard-verification-list/candidate-onboard-verification-list.component';
import { ConfirmReferbackMailModalComponent } from './modals/confirm-referback-mail-modal/confirm-referback-mail-modal.component';
import { ReferBackMailToCandidateModalComponent } from './modals/refer-back-mail-to-candidate-modal/refer-back-mail-to-candidate-modal.component';
import { SendPreonbFormsModalComponent } from './modals/send-preonb-forms-modal/send-preonb-forms-modal.component';
import { OnboardFormModalComponent } from './onboard-forms/modals/onboard-form-modal/onboard-form-modal.component';
import { SudexoFormComponent } from './onboard-forms/pages/sudexo-form/sudexo-form.component';
import { JoiningFormComponent } from './onboard-forms/pages/joining-form/joining-form.component';
import { CandidateOnboardFormsComponent } from './onboard-forms/modals/candidate-onboard-forms/candidate-onboard-forms.component';
import { PersonalDtFormComponent } from './onboard-forms/pages/personal-dt-form/personal-dt-form.component';
import { UndertakingPendingDocsComponent } from './onboard-forms/pages/undertaking-pending-docs/undertaking-pending-docs.component';
import { UndertakingCurrentAddressComponent } from './onboard-forms/pages/undertaking-current-address/undertaking-current-address.component';
import { AccesscardFormComponent } from './onboard-forms/pages/accesscard-form/accesscard-form.component';
import { UploadSendAppointmentLetterModalComponent } from './modals/upload-send-appointment-letter-modal/upload-send-appointment-letter-modal.component';
import { UploadItineraryModalComponent } from './modals/upload-itinerary-modal/upload-itinerary-modal.component';
import { ViewAllCandidateDetailsOnboardHrComponent } from './modals/view-all-candidate-details-onboard-hr/view-all-candidate-details-onboard-hr.component';
import { DayOneFormModalIComponent } from './onboard-forms/modals/day-one-form-modal-i/day-one-form-modal-i.component';
import { AtsLibModule } from 'projects/ats-lib/src/public-api';
import { UploadItineraryDocumentComponent } from './upload-itinerary-document/upload-itinerary-document.component';
import { CandidateDay1FormsDocComponent } from './onboard-forms/modals/candidate-day1-forms-doc/candidate-day1-forms-doc.component';
import { CreateEmployeeIdModalComponent } from './modals/create-employee-id-modal/create-employee-id-modal.component';
import { ShareAccountLinkComponent } from './modals/share-account-link/share-account-link.component';
import { PendingDocumentModalComponent } from './modals/pending-document-modal/pending-document-modal.component';
import { SendInductionSessionsInviteComponent } from './send-induction-sessions-invite/send-induction-sessions-invite.component';
import { SendInductionSessionsInviteModalComponent } from './modals/send-induction-sessions-invite-modal/send-induction-sessions-invite-modal.component';
import { ScheduleIndividualSessionFormModalComponent } from './send-induction-sessions-invite/modal/schedule-individual-session-form-modal/schedule-individual-session-form-modal.component';
import { VideoMatchOnboardAlertComponent } from './modals/video-match-onboard-alert/video-match-onboard-alert.component';
import { SendPreviewAppointmentLetterComponent } from './modals/send-preview-appointment-letter/send-preview-appointment-letter.component';
import { OnboardingCandidatesReportComponent } from './onboarding-reports/onboarding-candidates-report/onboarding-candidates-report.component';
import { CandidateVerificationReportComponent } from './candidate-verification-report/candidate-verification-report.component';
import { UpdateOnboardingModeModalComponent } from './modals/update-onboarding-mode-modal/update-onboarding-mode-modal.component';
import { UploadOlAcceptanceDocModalComponent } from './modals/upload-ol-acceptance-doc-modal/upload-ol-acceptance-doc-modal.component';
import { CandidateWisePendingDocumentsReportComponent } from './onboarding-reports/candidate-wise-pending-documents-report/candidate-wise-pending-documents-report.component';
import { ResendDay1FormComponent } from './onboard-forms/modals/resend-day1-form/resend-day1-form.component';
import { UpdateDay1PiplineStatusComponent } from './modals/update-day1-pipline-status/update-day1-pipline-status.component';
import { MailerDayStatusModalComponent } from './modals/mailer-day-status-modal/mailer-day-status-modal.component';
import { ManualPipelineMailModalComponent } from './modals/manual-pipeline-mail-modal/manual-pipeline-mail-modal.component';

import { AddLeadershipModalComponent } from './leadership/modals/add-leadership-modal/add-leadership-modal.component';
import { LeadershipHiringListComponent } from './leadership/leadership-hiring-list/leadership-hiring-list.component';
import { LeadershipUploadOfferDetailsModalComponent } from './leadership/modals/leadership-upload-offer-details-modal/leadership-upload-offer-details-modal.component';
import { PreviewLeadershipOfferModalComponent } from './leadership/modals/preview-leadership-offer-modal/preview-leadership-offer-modal.component';
import { AssignDelegatorForLeadershipModalComponent } from './leadership/modals/assign-delegator-for-leadership-modal/assign-delegator-for-leadership-modal.component';
import { PipelineLeadershipJoineeComponent } from './leadership/pipeline-leadership-joinee/pipeline-leadership-joinee.component';
import { UpdateLeadershipStatusModalComponent } from './leadership/modals/update-leadership-status-modal/update-leadership-status-modal.component';
import { AssignIssDelegatorModalComponent } from './leadership/modals/assign-iss-delegator-modal/assign-iss-delegator-modal.component';
import { LeadershipFileImgViewComponent } from './modals/candidate-identity-verification-modal-hr/leadership-file-img-view/leadership-file-img-view.component';
import { UpdateLeadershipDay1StatusComponent } from './leadership/modals/update-leadership-day1-status/update-leadership-day1-status.component';
//import { LeadershipIdentityVerificationModalComponent } from './modals/leadership-identity-verification-modal/leadership-identity-verification-modal.component';

import { ViewCandidateBgvDetailsComponent } from './modals/view-candidate-bgv-details/view-candidate-bgv-details.component';
import { ApproveInitiateBGVModalComponent } from './modals/approve-initiate-bgv-modal/approve-initiate-bgv-modal.component';
import { MultipleDocPreviewModalComponent } from './modals/multiple-doc-preview-modal/multiple-doc-preview-modal.component';
import { BgvApprovedByRecModalComponent } from './modals/bgv-approved-by-rec-modal/bgv-approved-by-rec-modal.component';
import { CandidateDropoutReportComponent } from './candidate-dropout-report/candidate-dropout-report.component';
import { PipelineCandidateHistoryComponent } from './pipeline-candidate-history/pipeline-candidate-history.component';
import { AddIssPendingVerificationRemarksModalComponent } from './modals/add-iss-pending-verification-remarks-modal/add-iss-pending-verification-remarks-modal.component';


@NgModule({
  declarations: [
    PipelineJoineeComponent,
    UpdateCandidateJoiningStatusComponent,
    AddEmpEmailDomainComponent,
    ViewAllCandidateDetailsOnboardComponent,
    OnboardCandidateListComponent,
    OnbVerificationModalComponent,
    CandidateIdentityVerificationModalHrComponent,
    FileImgViewComponent,
    CandidateOnboardVerificationListComponent,
    ConfirmReferbackMailModalComponent,
    ReferBackMailToCandidateModalComponent,
    SendPreonbFormsModalComponent,
    OnboardFormModalComponent,
    SudexoFormComponent,
    JoiningFormComponent,
    CandidateOnboardFormsComponent,
    PersonalDtFormComponent,
    UndertakingPendingDocsComponent,
    UndertakingCurrentAddressComponent,
    AccesscardFormComponent,
    UploadSendAppointmentLetterModalComponent,
    UploadItineraryModalComponent,
    ViewAllCandidateDetailsOnboardHrComponent,
    DayOneFormModalIComponent,
    UploadItineraryDocumentComponent,
    CandidateDay1FormsDocComponent,
    CreateEmployeeIdModalComponent,
    ShareAccountLinkComponent,
    PendingDocumentModalComponent,
    SendInductionSessionsInviteComponent,
    SendInductionSessionsInviteModalComponent,
    ScheduleIndividualSessionFormModalComponent,
    VideoMatchOnboardAlertComponent,
    SendPreviewAppointmentLetterComponent,
    OnboardingCandidatesReportComponent,
    CandidateVerificationReportComponent,
    UpdateOnboardingModeModalComponent,
    UploadOlAcceptanceDocModalComponent,
    CandidateWisePendingDocumentsReportComponent,
    ResendDay1FormComponent,
    UpdateDay1PiplineStatusComponent,
    MailerDayStatusModalComponent,
    ManualPipelineMailModalComponent,
    LeadershipHiringListComponent,
    AddLeadershipModalComponent,
    LeadershipUploadOfferDetailsModalComponent,
    PreviewLeadershipOfferModalComponent,
    AssignDelegatorForLeadershipModalComponent,
    PipelineLeadershipJoineeComponent,
    UpdateLeadershipStatusModalComponent,
    AssignIssDelegatorModalComponent,
    LeadershipFileImgViewComponent,
    UpdateLeadershipDay1StatusComponent,
    // LeadershipIdentityVerificationModalComponent
    // LeadershipIdentityVerificationModalComponent,
    ViewCandidateBgvDetailsComponent,
    ApproveInitiateBGVModalComponent,
    MultipleDocPreviewModalComponent,
    BgvApprovedByRecModalComponent,
    CandidateDropoutReportComponent,
    PipelineCandidateHistoryComponent,
    AddIssPendingVerificationRemarksModalComponent
  ],
  imports: [
    CommonModule,
    OnboardRoutingModule,
    SharedAppModule,
    CommonSharingModule,
    AtsLibModule
  ]
})
export class OnboardModule { }
