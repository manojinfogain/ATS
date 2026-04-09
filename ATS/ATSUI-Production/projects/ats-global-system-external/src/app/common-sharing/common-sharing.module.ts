import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { DocumentDetailsScComponent, TrDocumentSelectOptComponents } from './candidate-screens/document-details-sc/document-details-sc.component';
import { OtherDetailsScComponent } from './candidate-screens/other-details-sc/other-details-sc.component';
import { UploadDocModalComponent } from './candidate-screens/document-details-sc/upload-doc-modal/upload-doc-modal.component';
import { SharedAppModule } from '../shared/shared-app/shared-app.module';
import { DocumentViewModalComponent } from './modal/document-view-modal/document-view-modal.component';
import { QuestionareFormModalComponent } from './candidate-screens/other-details-sc/Modal/questionare-form-modal/questionare-form-modal.component';
import { OtherInfoFormModalComponent } from './candidate-screens/other-details-sc/Modal/other-info-form-modal/other-info-form-modal.component';
import { ViewInstructionModalComponent } from './modal/view-instruction-modal/view-instruction-modal.component';
import { CandidateProfessionalReferenceFormModalComponent } from './candidate-screens/other-details-sc/Modal/candidate-pro-ref-form-modal/candidate-pro-ref-form-modal.component';
import { SignatureCaptureComponent } from './modal/signature-capture/signature-capture.component';
import { ProfessionalReffrencessScComponent } from './candidate-screens/professional-reffrencess-sc/professional-reffrencess-sc.component';
import { DeclarationConsentModalComponent } from './modal/declaration-consent-modal/declaration-consent-modal.component';
import { AlertMsgPopupComponent } from './modal/alert-msg-popup/alert-msg-popup.component';
import { PersonalInformationComponent } from './candidate-bgv-forms-screens/personal-information/personal-information.component';
import { CurrentAddressDetailsComponent } from './candidate-bgv-forms-screens/current-address-details/current-address-details.component';
import { CrcInfoDetailsComponent } from './candidate-bgv-forms-screens/crc-info-details/crc-info-details.component';
import { HighestEducationDetailsComponent } from './candidate-bgv-forms-screens/highest-education-details/highest-education-details.component';
import { BgvEmploymentDetailsComponent } from './candidate-bgv-forms-screens/bgv-employment-details/bgv-employment-details.component';
import { BgvEmploymentDetailsFormModalComponent } from './candidate-bgv-forms-screens/bgv-employment-details/bgv-employment-details-form-modal/bgv-employment-details-form-modal.component';
import { CommonPdfViewerExternalComponent } from './modal/common-pdf-viewer-external/common-pdf-viewer-external.component';
import { CommonImagePreviewExternalComponent } from './modal/common-image-preview-external/common-image-preview-external.component';
import { GlobalDbCheckDetailsComponent } from './candidate-bgv-forms-screens/global-db-check-details/global-db-check-details.component';
import { OfacCheckDetailsComponent } from './candidate-bgv-forms-screens/ofac-check-details/ofac-check-details.component';
import { DigitalLoaComponent } from './candidate-bgv-forms-screens/digital-loa/digital-loa.component';
import { PreventBgvScreenModalComponent } from './modal/prevent-bgv-screen-modal/prevent-bgv-screen-modal.component';
import { MultipleDocPreviewModalComponent } from './modal/multiple-doc-preview-modal/multiple-doc-preview-modal.component';
//import { SharedAppModule } from 'projects/ats-global-system-external/src/app/shared/shared-app/shared-app.module';

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
    DocumentViewModalComponent,
    
    ViewInstructionModalComponent,
    ProfessionalReffrencessScComponent,
    PersonalInformationComponent,
    CurrentAddressDetailsComponent,
    CrcInfoDetailsComponent,
    HighestEducationDetailsComponent,
    BgvEmploymentDetailsComponent,
    BgvEmploymentDetailsFormModalComponent,
    CommonPdfViewerExternalComponent,
    CommonImagePreviewExternalComponent,
    GlobalDbCheckDetailsComponent,
    OfacCheckDetailsComponent,
    DigitalLoaComponent,
]

@NgModule({
    declarations: [
        TrDocumentSelectOptComponents,
       components,
       CandidateProfessionalReferenceFormModalComponent,
       QuestionareFormModalComponent,
       OtherInfoFormModalComponent,
       SignatureCaptureComponent,
       SignatureCaptureComponent,
       DeclarationConsentModalComponent,
       AlertMsgPopupComponent,
       PreventBgvScreenModalComponent,
       MultipleDocPreviewModalComponent,
    ],
    imports: [
        CommonModule,
        SharedAppModule
    ],
    exports: [
         components
    ]
})
export class CommonSharingModule { }
