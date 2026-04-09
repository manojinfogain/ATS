import { NgModule } from '@angular/core';
import { AtsLibComponent } from './ats-lib.component';
import { AcceptableUseOfAssetPolicyComponent } from './components/acceptable-use-of-asset-policy/acceptable-use-of-asset-policy.component';
import { CommonModule } from '@angular/common';
import { SharedAppModule } from './shared/shared-app.module';
import { AntiCorruptAntiPolicyComponent } from './components/anti-corrupt-anti-policy/anti-corrupt-anti-policy.component';
import { CodeConductBusinessEthicsPolicyComponent } from './components/code-conduct-business-ethics-policy/code-conduct-business-ethics-policy.component';
import { NDALateralComponent } from './components/nda-lateral/nda-lateral.component';
import { PoshDocComponent } from './components/posh-doc/posh-doc.component';
import { ConflictofInteresPolicyComponent } from './components/conflictof-interes-policy/conflictof-interes-policy.component';
import { SignatureCaptureLibComponent } from './components/modals/signature-capture-lib/signature-capture-lib.component';
import { LateralNDAEmpNNTComponent } from './components/lateral-nda-emp-nnt/lateral-nda-emp-nnt.component';
import { PoshDocPuneComponent } from './components/posh-doc-pune/posh-doc-pune.component';
import { PoshDocMumbaiComponent } from './components/posh-doc-mumbai/posh-doc-mumbai.component';
import { PoshDocBangloreComponent } from './components/posh-doc-banglore/posh-doc-banglore.component';
import { TraineesDCThirdPartyContractualNDANNTComponent } from './components/trainees-dcthird-party-contractual-nda-nnt/trainees-dcthird-party-contractual-nda-nnt.component';
import { TraineesDCThirdPartyContractualNDAComponent } from './components/trainees-dcthird-party-contractual-nda/trainees-dcthird-party-contractual-nda.component';
import { NetappNdaComponent } from './components/netapp-nda/netapp-nda.component';
import { PoshADTComponent } from './components/posh-adt/posh-adt.component';
import { PoshDocNntBangloreComponent } from './components/posh-doc-nnt-banglore/posh-doc-nnt-banglore.component';
import { DapFormComponent } from './components/dap-form/dap-form.component';
import {LateralNdaBengaluru} from './components/lateral-ndas/lateral-nda-bengaluru/lateral-nda-bengaluru.component';
import {LateralNdaGurugram} from './components/lateral-ndas/lateral-nda-gurugram/lateral-nda-gurugram.component';
import {LateralNdaMumbai} from './components/lateral-ndas/lateral-nda-mumbai/lateral-nda-mumbai.component';
import {LateralNdaNoida} from './components/lateral-ndas/lateral-nda-noida/lateral-nda-noida.component';
import {LateralNdaPune} from './components/lateral-ndas/lateral-nda-pune/lateral-nda-pune.component';
import {OtherNdaBengaluruComponent} from './components/other-ndas/other-nda-bengaluru/other-nda-bengaluru.component';
import {OtherNdaGurugramComponent} from './components/other-ndas/other-nda-gurugram/other-nda-gurugram.component';
import {OtherNdaMumbaiComponent} from './components/other-ndas/other-nda-mumbai/other-nda-mumbai.component';
import {OtherNdaNoidaComponent} from './components/other-ndas/other-nda-noida/other-nda-noida.component';
import {OtherNdaPuneComponent} from './components/other-ndas/other-nda-pune/other-nda-pune.component';
import { LibCandidatePersonalDetailsComponent } from './components/EAF/lib-candidate-personal-details/lib-candidate-personal-details.component';
import { LibUpdateAddressCandidateModalComponent } from './components/EAF/lib-candidate-personal-details/lib-update-address-candidate-modal/lib-update-address-candidate-modal.component';
import { LibCandidateFamilyDetailsComponent } from './components/EAF/lib-candidate-family-details/lib-candidate-family-details.component';
import { LibCandidateFamilyDetailsFromModalComponent } from './components/EAF/lib-candidate-family-details/lib-candidate-family-details-from-modal/lib-candidate-family-details-from-modal.component';
import { LibCandidateEducationDetailsComponent } from './components/EAF/lib-candidate-education-details/lib-candidate-education-details.component';
import { LibCandidateEducationDetailsFormModalComponent } from './components/EAF/lib-candidate-education-details/lib-candidate-education-details-form-modal/lib-candidate-education-details-form-modal.component';
import { LibTrainingCoursesAttendedComponent } from './components/EAF/lib-training-courses-attended/lib-training-courses-attended.component';
import { LibTrainingCoursesAttendedFormModalComponent } from './components/EAF/lib-training-courses-attended/lib-training-courses-attended-form-modal/lib-training-courses-attended-form-modal.component';
import { LibEmploymentDetailsComponent } from './components/EAF/lib-employment-details/lib-employment-details.component';
import { LibEmploymentDetailsFormModalComponent } from './components/EAF/lib-employment-details/lib-employment-details-form-modal/lib-employment-details-form-modal.component';
import { LibSalaryDetailsComponent } from './components/EAF/lib-salary-details/lib-salary-details.component';
import { LibDocumentDetailsScComponent, LibTrDocumentSelectOptComponents } from './components/EAF/lib-document-details-sc/lib-document-details-sc.component';
import { LibDocumentViewModalComponent } from './components/EAF/lib-document-details-sc/lib-document-view-modal/lib-document-view-modal.component';
import { LibUploadDocModalComponent } from './components/EAF/lib-document-details-sc/lib-upload-doc-modal/lib-upload-doc-modal.component';
import { LibViewInstructionModalComponent } from './components/EAF/lib-document-details-sc/lib-view-instruction-modal/lib-view-instruction-modal.component';
import { LibOtherDetailsScComponent } from './components/EAF/lib-other-details-sc/lib-other-details-sc.component';
import { LibCandidateProfessionalReferenceFormModalComponent } from './components/EAF/lib-other-details-sc/Modal/lib-candidate-pro-ref-form-modal/lib-candidate-pro-ref-form-modal.component';
import { LibOtherInfoFormModalComponent } from './components/EAF/lib-other-details-sc/Modal/lib-other-info-form-modal/lib-other-info-form-modal.component';
import { LibQuestionareFormModalComponent } from './components/EAF/lib-other-details-sc/Modal/lib-questionare-form-modal/lib-questionare-form-modal.component';
import { PoshDocImpaqtiveKochiComponent } from './components/posh-doc-impaqtive-kochi/posh-doc-impaqtive-kochi.component';
import { LateralNdaImpaqtiveKochiComponent } from './components/lateral-ndas/lateral-nda-impaqtive-kochi/lateral-nda-impaqtive-kochi.component';
import { TrainingThirdPartyContractualNdaImpaqtiveComponent } from './components/training-third-party-contractual-nda-impaqtive/training-third-party-contractual-nda-impaqtive.component';
import { NetappNdaImpaqtiveComponent } from './components/netapp-nda-impaqtive/netapp-nda-impaqtive.component';

const components = [
  LibCandidatePersonalDetailsComponent,
  LibUpdateAddressCandidateModalComponent,
  LibCandidateFamilyDetailsComponent,
  LibCandidateFamilyDetailsFromModalComponent,
  LibCandidateEducationDetailsComponent,
  LibCandidateEducationDetailsFormModalComponent,
  LibTrainingCoursesAttendedComponent,
  LibTrainingCoursesAttendedFormModalComponent,
  LibEmploymentDetailsComponent,
  LibEmploymentDetailsFormModalComponent,
  LibSalaryDetailsComponent,
  LibTrDocumentSelectOptComponents,
  LibDocumentDetailsScComponent,
  LibDocumentViewModalComponent,
  LibUploadDocModalComponent,
  LibViewInstructionModalComponent,
  LibOtherDetailsScComponent,
  LibCandidateProfessionalReferenceFormModalComponent,
  LibOtherInfoFormModalComponent,
  LibQuestionareFormModalComponent
]
@NgModule({
  declarations: [
    AtsLibComponent,
    AcceptableUseOfAssetPolicyComponent,
    AntiCorruptAntiPolicyComponent,
    CodeConductBusinessEthicsPolicyComponent,
    NDALateralComponent,
    PoshDocComponent,
    ConflictofInteresPolicyComponent,
    SignatureCaptureLibComponent,
    LateralNDAEmpNNTComponent,
    PoshDocPuneComponent,
    PoshDocMumbaiComponent,
    PoshDocBangloreComponent,
    TraineesDCThirdPartyContractualNDANNTComponent,
    TraineesDCThirdPartyContractualNDAComponent,
    NetappNdaComponent,
    PoshADTComponent,
    PoshDocNntBangloreComponent,
    DapFormComponent,
    LateralNdaBengaluru,
    LateralNdaGurugram,
    LateralNdaMumbai,
    LateralNdaNoida,
    LateralNdaPune,
    OtherNdaBengaluruComponent,
    OtherNdaGurugramComponent,
    OtherNdaMumbaiComponent,
    OtherNdaNoidaComponent,
    OtherNdaPuneComponent,
    components,
    PoshDocImpaqtiveKochiComponent,
    LateralNdaImpaqtiveKochiComponent,
    TrainingThirdPartyContractualNdaImpaqtiveComponent,
    NetappNdaImpaqtiveComponent,
  ],
  imports: [
    CommonModule,
    SharedAppModule
  ],
  exports: [
    AtsLibComponent,
    AcceptableUseOfAssetPolicyComponent,
    AntiCorruptAntiPolicyComponent,
    CodeConductBusinessEthicsPolicyComponent,
    NDALateralComponent,
    ConflictofInteresPolicyComponent,
    LateralNDAEmpNNTComponent,
    PoshDocComponent,
    PoshDocPuneComponent,
    PoshDocMumbaiComponent,
    PoshDocBangloreComponent,
    TraineesDCThirdPartyContractualNDANNTComponent,
    TraineesDCThirdPartyContractualNDAComponent,
    NetappNdaComponent,
    PoshADTComponent,
    PoshDocNntBangloreComponent,
    DapFormComponent,
    LateralNdaBengaluru,
    LateralNdaGurugram,
    LateralNdaMumbai,
    LateralNdaNoida,
    LateralNdaPune,
    OtherNdaBengaluruComponent,
    OtherNdaGurugramComponent,
    OtherNdaMumbaiComponent,
    OtherNdaNoidaComponent,
    OtherNdaPuneComponent,
    components,
    
    SharedAppModule,
     PoshDocImpaqtiveKochiComponent,
    LateralNdaImpaqtiveKochiComponent,
     TrainingThirdPartyContractualNdaImpaqtiveComponent,
    NetappNdaImpaqtiveComponent,
  ]
})
export class AtsLibModule { }
