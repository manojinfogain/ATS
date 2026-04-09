import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TalentRoutingModule } from './talent-routing.module';
import { TalentDashboardComponent } from './talent-dashboard/talent-dashboard.component';
import { JobRequisitionListComponent } from './job-requisition-list/job-requisition-list.component';
import { SharedAppModule } from '../shared/shared-app/shared-app.module';
import { CreateJobPositionModalComponent } from './job-requisition-list/modals/create-job-position-modal/create-job-position-modal.component';
import { ViewTalentFullDetailsModalComponent } from './job-requisition-list/modals/view-talent-full-details-modal/view-talent-full-details-modal.component';
import { UpdateTalentStatusModalComponent } from './job-requisition-list/modals/update-talent-status-modal/update-talent-status-modal.component';
import { ProposeEmployyeeModalComponent } from './job-requisition-list/modals/propose-employyee-modal/propose-employyee-modal.component';
import { ViewReferedEmpModalComponent } from './job-requisition-list/modals/view-refered-emp-modal/view-refered-emp-modal.component';
import { InternalJobPostingModalComponent } from './job-requisition-list/modals/internal-job-posting-modal/internal-job-posting-modal.component';
import { ApplyForIjpComponent } from './apply-for-ijp/apply-for-ijp.component';
import { ViewIjpApplicantListComponent } from './job-requisition-list/modals/view-ijp-applicant-list/view-ijp-applicant-list.component';
import { OfferedCandidateListModalComponent } from './job-requisition-list/modals/offered-candidate-list-modal/offered-candidate-list-modal.component';
import { CancelTalentidModalComponent } from './job-requisition-list/modals/cancel-talentid-modal/cancel-talentid-modal.component';
import { UpdateFulfillmentDateModalComponent } from './job-requisition-list/modals/update-fulfillment-date-modal/update-fulfillment-date-modal.component';
import { UpdateTalentIdDetailsTagModalComponent } from './job-requisition-list/modals/update-talent-id-details-tag/update-talent-id-details-tag.component';
import { ViewTalentHistoryModalComponent } from './job-requisition-list/modals/view-talent-history-modal/view-talent-history-modal.component';
import { AddMoreTalentDetailsModalComponent } from './job-requisition-list/modals/add-more-talent-details-modal/add-more-talent-details-modal.component';
import { TalentApprovalScreenComponent } from './talent-approval-screen/talent-approval-screen.component';
import { ViewAllJobRequisitionListComponent } from './view-all-job-requisition-list/view-all-job-requisition-list.component';
import { CloneMultiTalentidModalComponent } from './job-requisition-list/modals/clone-multi-talentid-modal/clone-multi-talentid-modal.component';
import { AddingOfferdCandidateComponent } from './job-requisition-list/modals/adding-offerd-candidate/adding-offerd-candidate.component';
import { UpdatejoiningDetailsModalComponent } from './job-requisition-list/modals/updatejoining-details-modal/updatejoining-details-modal.component';
import { TalentCubeRefrenceGridComponent } from './job-requisition-list/modals/talent-cube-refrence-grid/talent-cube-refrence-grid.component';
import { NgxEditorModule } from "ngx-editor";
import { JDListModalTcComponent } from './job-requisition-list/modals/jd-list-modal-tc/jd-list-modal-tc.component';
import { MandateskillConfirmationComponent } from './job-requisition-list/modals/mandateskill-confirmation/mandateskill-confirmation.component';
import { FullfillmentdataUpdateModalComponent } from './job-requisition-list/modals/fullfillmentdata-update-modal/fullfillmentdata-update-modal.component';
import { UpdateTalentAssigneeModalComponent } from './job-requisition-list/modals/update-talent-assignee-modal/update-talent-assignee-modal.component';
import { ReopenTalentIdModalComponent } from './job-requisition-list/modals/reopen-talent-id-modal/reopen-talent-id-modal.component';
import { JoinedCandidateReopenTransferModalComponent } from './job-requisition-list/modals/joined-candidate-reopen-transfer-modal/joined-candidate-reopen-transfer-modal.component';
import { ActivateDormantTidModalComponent } from './job-requisition-list/modals/activate-dormant-tid-modal/activate-dormant-tid-modal.component';
import { ViewLevelDetailsModalsComponent } from './job-requisition-list/modals/view-level-details-modals/view-level-details-modals.component';
import { CandidateTalentOfferDetailsModalComponent } from './job-requisition-list/modals/candidate-talent-offer-details-modal/candidate-talent-offer-details-modal.component';
import { UpdateJoinedDeclinedDetailsModalComponent } from './job-requisition-list/modals/update-joined-declined-details-modal/update-joined-declined-details-modal.component';
import { PostJobToNaukriModalComponent } from './job-requisition-list/modals/post-job-to-naukri-modal/post-job-to-naukri-modal.component';
import { ViewPostedJobDetailsModalComponent } from './job-requisition-list/modals/view-posted-job-details-modal/view-posted-job-details-modal.component';
import { ConfirmationDailogNaukriComponent } from './job-requisition-list/modals/confirmation-dailog-naukri/confirmation-dailog-naukri.component';
import { BulkApproveRejectModalComponent } from './job-requisition-list/modals/bulk-approve-reject-modal/bulk-approve-reject-modal.component';
import { IjpApplyJustificationModalComponent } from './apply-for-ijp/modals/ijp-apply-justification-modal/ijp-apply-justification-modal.component';
import { MyApplicationDetailsModalComponent } from './apply-for-ijp/modals/my-application-details-modal/my-application-details-modal.component';
import { DemandQualityProbComponent } from './job-requisition-list/modals/demand-quality-prob/demand-quality-prob.component';
import { InteralAvailableResourceModalComponent } from './job-requisition-list/modals/interal-available-resource-modal/interal-available-resource-modal.component';
import { DemandProbabiltyViewComponent } from './job-requisition-list/modals/demand-probabilty-view/demand-probabilty-view.component';
import { EditBillingOnboardingDatesModalComponent } from './job-requisition-list/modals/edit-billing-onboarding-dates-modal/edit-billing-onboarding-dates-modal.component';
import { MyApplicationsDashboardComponent } from './apply-for-ijp/components/my-applications-dashboard/my-applications-dashboard.component';
import { BrowseOpportunitiesComponent } from './apply-for-ijp/components/browse-opportunities/browse-opportunities.component';
import { MyApplicationHistoryModalComponent } from './apply-for-ijp/modals/my-application-history-modal/my-application-history-modal.component';


@NgModule({
  declarations: [
    TalentDashboardComponent,
    JobRequisitionListComponent,
    CreateJobPositionModalComponent,
    ViewTalentFullDetailsModalComponent,
    UpdateTalentStatusModalComponent,
    ProposeEmployyeeModalComponent,
    ViewReferedEmpModalComponent,
    InternalJobPostingModalComponent,
    ApplyForIjpComponent,
    ViewIjpApplicantListComponent,
    OfferedCandidateListModalComponent,
    CancelTalentidModalComponent,
    UpdateFulfillmentDateModalComponent,
    UpdateTalentIdDetailsTagModalComponent,
    ViewTalentHistoryModalComponent,
    AddMoreTalentDetailsModalComponent,
    TalentApprovalScreenComponent,
    ViewAllJobRequisitionListComponent,
    CloneMultiTalentidModalComponent,
    AddingOfferdCandidateComponent,
    UpdatejoiningDetailsModalComponent,
    TalentCubeRefrenceGridComponent,
    JDListModalTcComponent,
    MandateskillConfirmationComponent,
    FullfillmentdataUpdateModalComponent,
    UpdateTalentAssigneeModalComponent,
    ReopenTalentIdModalComponent,
    JoinedCandidateReopenTransferModalComponent,
    ActivateDormantTidModalComponent,
    ViewLevelDetailsModalsComponent,
    CandidateTalentOfferDetailsModalComponent,
    UpdateJoinedDeclinedDetailsModalComponent,
    PostJobToNaukriModalComponent,
    ViewPostedJobDetailsModalComponent,
    ConfirmationDailogNaukriComponent,
    BulkApproveRejectModalComponent,
    IjpApplyJustificationModalComponent,
    MyApplicationDetailsModalComponent,
    DemandQualityProbComponent,
    InteralAvailableResourceModalComponent,
    DemandProbabiltyViewComponent,
    EditBillingOnboardingDatesModalComponent,
    MyApplicationsDashboardComponent,
    BrowseOpportunitiesComponent,
    MyApplicationHistoryModalComponent,
  ],
  imports: [
    CommonModule,
    TalentRoutingModule,
    SharedAppModule,
    NgxEditorModule
  ]
})
export class TalentModule { }
