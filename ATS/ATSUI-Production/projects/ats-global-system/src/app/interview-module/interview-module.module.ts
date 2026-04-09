import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InterviewModuleRoutingModule } from './interview-module-routing.module';
import { SharedAppModule } from '../shared/shared-app/shared-app.module';
import { ScheduleCandidateInterviewComponent } from './schedule-candidate-interview/schedule-candidate-interview.component';
import { InterviewFeedbackComponent } from './interview-feedback/interview-feedback.component';
import { InterviewFeedbackStatusComponent } from './interview-feedback/modals/interview-feedback-status/interview-feedback-status.component';
import { FeedbackRoundDetailsComponent } from './interview-feedback/modals/feedback-round-details/feedback-round-details.component';
import { FeedbackDetailsComponent } from './interview-feedback/modals/feedback-details/feedback-details.component';
import { RescheduleCancelInterviewComponent } from './reschedule-cancel-interview/reschedule-cancel-interview.component';
import { RescheduleInterviewModalComponent } from './reschedule-cancel-interview/modals/reschedule-interview-modal/reschedule-interview-modal.component';
import { CancelInterviewModalComponent } from './reschedule-cancel-interview/modals/cancel-interview-modal/cancel-interview-modal.component';
import { TalentTransferComponent } from './interview-feedback/modals/talent-transfer/talent-transfer.component';
import { BulkInterviewScheduleComponent } from './bulk-interview-schedule/bulk-interview-schedule.component';
import { ViewEditCandidateInfoComponent } from './view-edit-candidate-info/view-edit-candidate-info.component';
import { UpdateCandidateFormComponent } from './view-edit-candidate-info/modal/update-candidate-form/update-candidate-form.component';
import { TransferCandidatesComponent } from './transfer-candidates/transfer-candidates.component';
import { TransferCandidateFormComponent } from './transfer-candidates/modal/transfer-candidate-form/transfer-candidate-form.component';
import { SearchPageSectionComponent } from './search-page-section/search-page-section.component';
import { CandidateSearchIntComponent } from './candidate-search-int/candidate-search-int.component';
import { UpdateInterviewerModalComponent } from './interview-feedback/modals/update-interviewer-modal/update-interviewer-modal.component';
import { UpcomingInterviewComponent } from './upcoming-interview/upcoming-interview.component';
import { CandidateInterviewScheduleComponent } from './candidate-interview-schedule/candidate-interview-schedule.component';
import { InterviewMessageAlertComponent } from './candidate-interview-schedule/modal/interview-message-alert/interview-message-alert.component';
import { JobDescriptionComponent } from './upcoming-interview/modals/job-description/job-description.component';
import { RequestTransferCandidateComponent } from './transfer-candidates/modal/request-transfer-candidate/request-transfer-candidate.component';
import { ApproveTransferedCandidateComponent } from './transfer-candidates/modal/approve-transfered-candidate/approve-transfered-candidate.component';
import { ReasonForDropModalComponent } from './interview-feedback/modals/reason-for-drop-modal/reason-for-drop-modal.component';
import { JdPanelConfirmationModalComponent } from './modals/jd-panel-confirmation-modal/jd-panel-confirmation-modal.component';
import { CommonSharingModule } from '../common-sharing/common-sharing.module';
import { CandidateDetailsModalComponent } from './interview-feedback/modals/candidate-details-modal/candidate-details-modal.component';
import { DownloadSalaryDocumentModalComponent } from './interview-feedback/modals/download-salary-document-modal/download-salary-document-modal.component';
import { UploadCandidatePicVideoByTagComponent } from './modals/upload-candidate-pic-video-by-tag/upload-candidate-pic-video-by-tag.component';
import { InterviewFeedbackQuesionnaireModalComponent } from './interview-feedback/modals/interview-feedback-quesionnaire-modal/interview-feedback-quesionnaire-modal.component';
import { SendAssesmentToCandidateModalComponent } from './interview-feedback/modals/send-assesment-to-candidate-modal/send-assesment-to-candidate-modal.component';
import { ViewCoderbyteReportComponent } from './interview-feedback/modals/view-coderbyte-report/view-coderbyte-report.component';
import { AiQuestionListComponent } from './ai-question-list/ai-question-list.component';
import { ViewAllTechAiAssesmentComponent } from './interview-feedback/modals/view-all-tech-ai-assesment/view-all-tech-ai-assesment.component';
import { PanelDashboardComponent } from './panel-dashboard/panel-dashboard.component';
import { UpdateProfileSourceModalComponent } from './view-edit-candidate-info/modal/update-profile-source-modal/update-profile-source-modal.component';




@NgModule({
    declarations: [
        ScheduleCandidateInterviewComponent,
        InterviewFeedbackComponent,
        InterviewFeedbackStatusComponent,
        FeedbackRoundDetailsComponent,
        FeedbackDetailsComponent,
        RescheduleCancelInterviewComponent,
        RescheduleInterviewModalComponent,
        CancelInterviewModalComponent,
        TalentTransferComponent,
        BulkInterviewScheduleComponent,
        ViewEditCandidateInfoComponent,
        UpdateCandidateFormComponent,
        CandidateDetailsModalComponent,
        TransferCandidatesComponent,
        TransferCandidateFormComponent,
        SearchPageSectionComponent,
        CandidateSearchIntComponent,
        UpdateInterviewerModalComponent,
        UpcomingInterviewComponent,
        CandidateInterviewScheduleComponent,
        InterviewMessageAlertComponent,
        JobDescriptionComponent,
        RequestTransferCandidateComponent,
        ApproveTransferedCandidateComponent,
        ReasonForDropModalComponent,
        JdPanelConfirmationModalComponent,
        DownloadSalaryDocumentModalComponent,
        UploadCandidatePicVideoByTagComponent,
        InterviewFeedbackQuesionnaireModalComponent,
        SendAssesmentToCandidateModalComponent,
        ViewCoderbyteReportComponent,
        AiQuestionListComponent,
        ViewAllTechAiAssesmentComponent,
        PanelDashboardComponent,
        UpdateProfileSourceModalComponent,
        // ViewProfilePicsComponent,
    ],
    imports: [
        CommonModule,
        InterviewModuleRoutingModule,
        SharedAppModule,
        CommonSharingModule
    ]
})
export class InterviewModuleModule { }
