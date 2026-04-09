import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OfferModuleRoutingModule } from './offer-module-routing.module';
import { ApprovalScreenComponent } from './approval-screen/approval-screen.component';
import { SharedAppModule } from '../shared/shared-app/shared-app.module';
import { SendForApprovalModalComponent } from './modals/send-for-approval-modal/send-for-approval-modal.component';
import { ApprovalActionModalComponent } from './modals/approval-action-modal/approval-action-modal.component';
import { OfferScreenComponent } from './offer-screen/offer-screen.component';
import { ViewOfferApprovalDetailsComponent } from './modals/view-offer-approval-details/view-offer-approval-details.component';
import { ViewGenerateOfferComponent } from './modals/view-generate-offer/view-generate-offer.component';
import { UpdateOfferStatusComponent } from './modals/update-offer-status/update-offer-status.component';
import { SendPreviewOfferModalComponent } from './modals/send-preview-offer-modal/send-preview-offer-modal.component';
import { BgvConfirmationDownloadComponent } from './modals/bgv-confirmation-download/bgv-confirmation-download.component';
import { SelectedCandidateTransferModalComponent } from './modals/selected-candidate-transfer-modal/selected-candidate-transfer-modal.component';
import { UpdateConfirmShippingAddressComponent } from './modals/update-confirm-shipping-address/update-confirm-shipping-address.component';
import { RecruiApprovDocumentsModalComponent } from './modals/recrui-approv-documents-modal/recrui-approv-documents-modal.component';
import { OfferReasonForDropComponent } from './modals/offer-reason-for-drop/offer-reason-for-drop.component';
import { UploadManualOfferModalComponent } from './modals/upload-manual-offer-modal/upload-manual-offer-modal.component';
import { OfferGenerationConfirmationModalComponent } from './modals/offer-generation-confirmation-modal/offer-generation-confirmation-modal.component';
import { DelegateRightsComponent } from './delegate-rights/delegate-rights.component';
import { DelegateRightsFormModalComponent } from './delegate-rights/Modals/delegate-rights-form-modal/delegate-rights-form-modal.component';
import { RevokeDelegateRightsModalComponent } from './delegate-rights/Modals/revoke-delegate-rights-modal/revoke-delegate-rights-modal.component';
import { ResendOrReviseOfferConfirmModalComponent } from './approval-screen/modals/resend-or-revise-offer-confirm-modal/resend-or-revise-offer-confirm-modal.component';
import { ResendOfferApprovalDetailsComponent } from './approval-screen/modals/resend-offer-approval-details/resend-offer-approval-details.component';
// import { ResendofferapprovaldetailsComponent } from './approval-screen/modals/resendofferapprovaldetails/resendofferapprovaldetails.component';
import { SendForApprovalModalUsComponent } from './modals/send-for-approval-modal-us/send-for-approval-modal-us.component';
import { UsGenerateOfferModalComponent } from './modals/us-generate-offer-modal/us-generate-offer-modal.component';
import { UsHrApprovalScreenComponent } from './us-hr-approval-screen/us-hr-approval-screen.component';
import { UsSendPreviewOfferModalComponent } from './modals/us-send-preview-offer-modal/us-send-preview-offer-modal.component';
import { ApproveRejectUsModalComponent } from './modals/approve-reject-us-modal/approve-reject-us-modal.component';
import { UsSendOfferToHrModalComponent } from './modals/us-send-offer-to-hr-modal/us-send-offer-to-hr-modal.component';
import { UsUploadManualOfferModalComponent } from './modals/us-upload-manual-offer-modal/us-upload-manual-offer-modal.component';
import { EmployeeAgreementPreviewUsComponent } from './modals/employee-agreement-preview-us/employee-agreement-preview-us.component';
import { OfferApprovalScreenComponent } from './approval-screen/offer-approval-screen/offer-approval-screen.component';
import { SelectedCandidateTransferWithTcModalComponent } from './modals/selected-candidate-transfer-with-tc-modal/selected-candidate-transfer-with-tc-modal.component';
import { SendForApprovalModalSupportComponent } from './modals/send-for-approval-modal-support/send-for-approval-modal-support.component';
import { ApprovalConfirmationDocumentDownloadComponent } from './modals/approval-confirmation-document-download/approval-confirmation-document-download.component';
import { TransferApprovalScreenComponent } from './transfer-approval-screen/transfer-approval-screen.component';
import { VideoComparisonConsnetModalComponent } from './modals/video-comparison-consnet-modal/video-comparison-consnet-modal.component';


@NgModule({
    declarations: [
        ApprovalScreenComponent,
        SendForApprovalModalComponent,
        ApprovalActionModalComponent,
        OfferScreenComponent,
        ViewOfferApprovalDetailsComponent,
        ViewGenerateOfferComponent,
        UpdateOfferStatusComponent,
        SendPreviewOfferModalComponent,
        BgvConfirmationDownloadComponent,
        SelectedCandidateTransferModalComponent,
        UpdateConfirmShippingAddressComponent,
        RecruiApprovDocumentsModalComponent,
        OfferReasonForDropComponent,
        UploadManualOfferModalComponent,
        OfferGenerationConfirmationModalComponent,
        DelegateRightsComponent,
        DelegateRightsFormModalComponent,
        RevokeDelegateRightsModalComponent,
        ResendOrReviseOfferConfirmModalComponent,
        ResendOfferApprovalDetailsComponent,
        // ResendofferapprovaldetailsComponent
        SendForApprovalModalUsComponent,
        UsGenerateOfferModalComponent,
        UsHrApprovalScreenComponent,
        UsSendPreviewOfferModalComponent,
        ApproveRejectUsModalComponent,
        UsSendOfferToHrModalComponent,
        UsUploadManualOfferModalComponent,
        EmployeeAgreementPreviewUsComponent,
        OfferApprovalScreenComponent,
        SelectedCandidateTransferWithTcModalComponent,
        SendForApprovalModalSupportComponent,
        ApprovalConfirmationDocumentDownloadComponent,
        TransferApprovalScreenComponent,
        VideoComparisonConsnetModalComponent,
    ],
    imports: [
        CommonModule,
        OfferModuleRoutingModule,
        SharedAppModule
    ]
})
export class OfferModuleModule { }
