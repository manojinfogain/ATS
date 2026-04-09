import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VendorPartnerRoutingModule } from './vendor-partner-routing.module';
import { PartnerRegistrationComponent } from './partner-registration/partner-registration.component';
import { SharedAppModule } from '../shared/shared-app/shared-app.module';
import { RegisteredPartnerDetailsComponent } from './registered-partner-details/registered-partner-details.component';
import { UpdatePartnerDetailsComponent } from './modals/update-partner-details/update-partner-details.component';
import { UserActiveDeactiveComponent } from './modals/user-active-deactive/user-active-deactive.component';
import { PartnerUserRegistrationComponent } from './partner-user-registration/partner-user-registration.component';
import { PartnerUserListingComponent } from './partner-user-listing/partner-user-listing.component';
import { AddProfileComponent } from './add-profile/add-profile.component';
import { TalentIdAssignedPartnerComponent } from './talent-id-assigned-partner/talent-id-assigned-partner.component';
import { PartnerTalentidDetailsComponent } from './partner-talentid-details/partner-talentid-details.component';
import { UploadProfileFormComponent } from './forms/upload-profile-form/upload-profile-form.component';
import { CandidateProfileDetailsComponent } from './candidate-profile-details/candidate-profile-details.component';
import { ViewCandidateDetailsPartnerComponent } from './modals/view-candidate-details-partner/view-candidate-details-partner.component';
import { UpdateCandidateDetailsPartnerComponent } from './modals/update-candidate-details-partner/update-candidate-details-partner.component';
import { ViewTalentidDetailsPartnerComponent } from './modals/view-talentid-details-partner/view-talentid-details-partner.component';
import { PartnerDashboardComponent } from './partner-dashboard/partner-dashboard.component';
import { TransferCandidateComponent } from './modals/transfer-candidate/transfer-candidate.component';
import { CandidateProfilelistSharedbyPartnerComponent } from './candidate-profilelist-sharedby-partner/candidate-profilelist-sharedby-partner.component';
import { PartnerCandidateTransferRequestComponent } from './candidate-profile-details/modal/partner-candidate-transfer-request/partner-candidate-transfer-request.component';
import { ApproveRequestPartnerProfilesTransferComponent } from './candidate-profilelist-sharedby-partner/modal/approve-request-partner-profiles-transfer/approve-request-partner-profiles-transfer.component';
import { TransferCandidateModalComponent } from './candidate-profilelist-sharedby-partner/modal/transfer-candidate-modal/transfer-candidate-modal.component';
import { NotMessageComponent } from './talent-id-assigned-partner/not-message/not-message.component';
import { ParnerStatusFormModalComponent } from './registered-partner-details/parner-status-form-modal/parner-status-form-modal.component';
import { ApproveRejectTalentidReqComponent } from './partner-talentid-details/approve-reject-talentid-req/approve-reject-talentid-req.component';
import { ResendApprovalTalentidAssignComponent } from './partner-talentid-details/resend-approval-talentid-assign/resend-approval-talentid-assign.component';
import { ApprovePendingWithMeTalentModalComponent } from './partner-talentid-details/approve-pending-with-me-talent-modal/approve-pending-with-me-talent-modal.component';
import { ApproverReffereRemarksModalComponent } from './partner-talentid-details/approver-reffere-remarks-modal/approver-reffere-remarks-modal.component';
import { TransferProfileSourceModalComponent } from './candidate-profilelist-sharedby-partner/modal/transfer-profile-source-modal/transfer-profile-source-modal.component';import { PartnerProfilesReqTransferModalComponent } from './candidate-profilelist-sharedby-partner/modal/partner-profiles-req-transfer-modal/partner-profiles-req-transfer-modal.component';
import { PartnerProfilesDirectTransferModalComponent } from './candidate-profilelist-sharedby-partner/modal/partner-profiles-direct-transfer-modal/partner-profiles-direct-transfer-modal.component';
import { ApproveTransferRequestByRecruiterModalComponent } from './candidate-profilelist-sharedby-partner/modal/approve-transfer-request-by-recruiter-modal/approve-transfer-request-by-recruiter-modal.component';
import { AssignedTalentidPartnerListComponent } from './partner-talentid-details/assigned-talentid-partner-list/assigned-talentid-partner-list.component';

import { ViewContractHistoryComponent } from './modals/view-contract-history/view-contract-history.component';
import { AddNewContractsModalComponent } from './modals/add-new-contracts-modal/add-new-contracts-modal.component';
import { UpdateContractDetailsModalComponent } from './modals/update-contract-details-modal/update-contract-details-modal.component';
import { PartnerContractsDetailsScreenComponent } from './partner-contracts-details-screen/partner-contracts-details-screen.component';
import { ApprovRejectMultiContractsModalComponent } from './modals/approv-reject-multi-contracts-modal/approv-reject-multi-contracts-modal.component';


@NgModule({
    declarations: [
        PartnerRegistrationComponent,
        RegisteredPartnerDetailsComponent,
        UpdatePartnerDetailsComponent,
        UserActiveDeactiveComponent,
        PartnerUserRegistrationComponent,
        PartnerUserListingComponent,
        AddProfileComponent,
        TalentIdAssignedPartnerComponent,
        PartnerTalentidDetailsComponent,
        UploadProfileFormComponent,
        CandidateProfileDetailsComponent,
        ViewCandidateDetailsPartnerComponent,
        UpdateCandidateDetailsPartnerComponent,
        ViewTalentidDetailsPartnerComponent,
        PartnerDashboardComponent,
        TransferCandidateComponent,
        CandidateProfilelistSharedbyPartnerComponent,
        PartnerCandidateTransferRequestComponent,
        ApproveRequestPartnerProfilesTransferComponent,
        TransferCandidateModalComponent,
        NotMessageComponent,
        ParnerStatusFormModalComponent,
        ApproveRejectTalentidReqComponent,
        ResendApprovalTalentidAssignComponent,
        ApprovePendingWithMeTalentModalComponent,
        ApproverReffereRemarksModalComponent,
        AssignedTalentidPartnerListComponent,
        TransferProfileSourceModalComponent,
        PartnerProfilesReqTransferModalComponent,
        PartnerProfilesDirectTransferModalComponent,
        ApproveTransferRequestByRecruiterModalComponent,
        ViewContractHistoryComponent,
        AddNewContractsModalComponent,
        UpdateContractDetailsModalComponent,
        PartnerContractsDetailsScreenComponent,
        ApprovRejectMultiContractsModalComponent
    ],
    imports: [
        CommonModule,
        VendorPartnerRoutingModule,
        SharedAppModule
    ]
})
export class VendorPartnerModule { }
