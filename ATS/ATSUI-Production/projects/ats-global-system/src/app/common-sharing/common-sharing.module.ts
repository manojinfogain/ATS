import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedAppModule } from '../shared/shared-app/shared-app.module';
import { ViewProfilePicsComponent } from './interview/view-profile-pics/view-profile-pics.component';
import { CandidateProfilePicIntComponent } from './interview/candidate-profile-pic-int/candidate-profile-pic-int.component';
import { VisibiltyTableViewCountComponent } from './dashboard/visibilty-table-view-count/visibilty-table-view-count.component';
import { ScreenRejectModalGlobalComponent } from './modals/screen-reject-modal-global/screen-reject-modal-global.component';
import { CandidateFamilyDetailsComponent } from './candidate-screens/candidate-family-details/candidate-family-details.component';
import { CandidateFamilyDetailsFromModalComponent } from './candidate-screens/candidate-family-details/candidate-family-details-from-modal/candidate-family-details-from-modal.component';
import { CandidatePersonalDetailsComponent } from './candidate-screens/candidate-personal-details/candidate-personal-details.component';
import { CandidateEducationDetailsComponent } from './candidate-screens/candidate-education-details/candidate-education-details.component';
import { CandidateEducationDetailsFormModalComponent } from './candidate-screens/candidate-education-details/candidate-education-details-form-modal/candidate-education-details-form-modal.component';
import { TrainingCoursesAttendedComponent } from './candidate-screens/training-courses-attended/training-courses-attended.component';
import { TrainingCoursesAttendedFormModalComponent } from './candidate-screens/training-courses-attended/training-courses-attended-form-modal/training-courses-attended-form-modal.component';
import { EmploymentDetailsComponent } from './candidate-screens/employment-details/employment-details.component';
import { EmploymentDetailsFormModalComponent } from './candidate-screens/employment-details/employment-details-form-modal/employment-details-form-modal.component';
import { SalaryDetailsComponent } from './candidate-screens/salary-details/salary-details.component';
import { UpdateAddressCandidateModalComponent } from './candidate-screens/candidate-personal-details/update-address-candidate-modal/update-address-candidate-modal.component';
import { DocumentDetailsScComponent } from './candidate-screens/document-details-sc/document-details-sc.component';
import { OtherDetailsScComponent } from './candidate-screens/other-details-sc/other-details-sc.component';
import { UploadDocModalComponent } from './candidate-screens/document-details-sc/upload-doc-modal/upload-doc-modal.component';
import { SignatureCaptureComponent } from './modals/signature-capture/signature-capture.component';
import { VideoUploadGuidelineComponent } from './modals/video-upload-guideline/video-upload-guideline.component';
import { MessageDisplayComponent } from './modals/message-display/message-display.component';
import { CommonPdfViewerInternalComponent } from './modals/common-pdf-viewer-internal/common-pdf-viewer-internal.component';
import { CommonImagePreviewModalComponent } from './modals/common-image-preview-modal/common-image-preview-modal.component';
import { OfferFTEComponent } from './offer-template-us/offer-fte/offer-fte.component';
import { OfferFTHourlyComponent } from './offer-template-us/offer-ft-hourly/offer-ft-hourly.component';
import { SignatureGlobalCComponent } from './modals/signature-global-c/signature-global-c.component';
import { FullfillmentdatelapseTalentModalComponent } from './modals/fullfillmentdatelapse-talent-modal/fullfillmentdatelapse-talent-modal.component';
import { BannerPreviewModalComponent } from './modals/banner-preview-modal/banner-preview-modal.component';
import { ViewResumeAiRatingDetailsComponent } from './modals/view-resume-ai-rating-details/view-resume-ai-rating-details.component';
import { UpdatescreenstatusmodalComponent } from './modals/updatescreenstatusmodal/updatescreenstatusmodal.component';
import { ViewMatchSkillRatingComponent } from './dashboard/view-match-skill-rating/view-match-skill-rating.component';

const components = [
    CandidatePersonalDetailsComponent,
    CandidateFamilyDetailsComponent,
    CandidateFamilyDetailsFromModalComponent,
    CandidateEducationDetailsComponent,
    CandidateEducationDetailsFormModalComponent,
    TrainingCoursesAttendedComponent,
    TrainingCoursesAttendedFormModalComponent,
    EmploymentDetailsComponent,
    EmploymentDetailsFormModalComponent,
    SalaryDetailsComponent,
    UpdateAddressCandidateModalComponent,
    DocumentDetailsScComponent,
    OtherDetailsScComponent,
    UploadDocModalComponent,
    CommonPdfViewerInternalComponent,
    OfferFTEComponent,
    ViewMatchSkillRatingComponent,
]

@NgModule({
    declarations: [
        ViewProfilePicsComponent,
        CandidateProfilePicIntComponent,
        VisibiltyTableViewCountComponent,
        ScreenRejectModalGlobalComponent,
        components,
        SignatureCaptureComponent,
        VideoUploadGuidelineComponent,
        MessageDisplayComponent,
        CommonImagePreviewModalComponent,        
        OfferFTHourlyComponent,
        SignatureGlobalCComponent,
        FullfillmentdatelapseTalentModalComponent,
        BannerPreviewModalComponent,
        ViewResumeAiRatingDetailsComponent,
        UpdatescreenstatusmodalComponent,
    ],
    imports: [
        CommonModule,
        SharedAppModule
    ],
    exports: [
        ViewProfilePicsComponent,
        CandidateProfilePicIntComponent,
        VisibiltyTableViewCountComponent,
        components
    ]
})
export class CommonSharingModule { }
