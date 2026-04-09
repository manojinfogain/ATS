import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleWiseGuardGuard } from '../core/guards/role-wise-guard.guard';
import { CandidateOnboardVerificationListComponent } from './candidate-onboard-verification-list/candidate-onboard-verification-list.component';
import { OnboardCandidateListComponent } from './onboard-candidate-list/onboard-candidate-list.component';
import { PipelineJoineeComponent } from './pipeline-joinee/pipeline-joinee.component';
import { UploadItineraryDocumentComponent } from './upload-itinerary-document/upload-itinerary-document.component';
import { OnboardingCandidatesReportComponent } from './onboarding-reports/onboarding-candidates-report/onboarding-candidates-report.component';
import { RoleWiseAccessGuard } from '../core/guards/roleWiseAccess.guard';
import { CandidateVerificationReportComponent } from './candidate-verification-report/candidate-verification-report.component';
import { CandidateWisePendingDocumentsReportComponent } from './onboarding-reports/candidate-wise-pending-documents-report/candidate-wise-pending-documents-report.component';
import { LeadershipHiringListComponent } from './leadership/leadership-hiring-list/leadership-hiring-list.component';
import { PipelineLeadershipJoineeComponent } from './leadership/pipeline-leadership-joinee/pipeline-leadership-joinee.component';
import { CandidateDropoutReportComponent } from './candidate-dropout-report/candidate-dropout-report.component';
import { PipelineCandidateHistoryComponent } from './pipeline-candidate-history/pipeline-candidate-history.component';

const routes: Routes = [
  {
    path: 'pipeline-joinee-candidate',
    component:PipelineJoineeComponent,
    data: { title: "Pipeline Joinee List",role:[1,5,7,10,2],otherRole:['IsHRAccess','IsPipeLineAdmin'] },
    canActivate:[RoleWiseAccessGuard]
  },
  
  {
    path: 'onboard-candidate',
    component:OnboardCandidateListComponent,
    data: { title: "Onboarding Candidates List",role:[1,2,5,9,10],otherRole:['IsHRAccess'] },
    canActivate:[RoleWiseAccessGuard]
  },
  {
    path: 'candidate-verification',
    component:CandidateOnboardVerificationListComponent,
    data: { title: " Onboard Candidate Verification",role:[1,2,5,7,10],otherRole:['IsRM','IsHRAccess'] },
    canActivate:[RoleWiseAccessGuard]
    //canActivate:[RoleWiseGuardGuard]
  },
  {
    path: 'upload-itinerary-document',
    component:UploadItineraryDocumentComponent,
    data: { title: "Upload Itinerary Document",role:[1],otherRole:['IsHRAccess'] },
    canActivate:[RoleWiseAccessGuard]
  },
  {
    path: 'candidate-verification-report',
    component:CandidateVerificationReportComponent,
    data: { title: "Candidate Verification Report",role:[1,5],otherRole:['IsIssAssestDelivery', 'IsHRAccess'] },
    canActivate:[RoleWiseAccessGuard]
  },
  {
    path: 'onboarding-candidates-report',
    component:OnboardingCandidatesReportComponent,
    data: { title: "Onboarding Candidates Report",role:[1],otherRole:['IsHRAccess'] },
    canActivate:[RoleWiseAccessGuard]
  },
  {
    path: 'candidate-wise-pending-doc-report',
    component:CandidateWisePendingDocumentsReportComponent,
    data: { title: "Candidate Wise Pending Documents Report",role:[1],otherRole:['IsHRAccess'] },
    canActivate:[RoleWiseAccessGuard]
  },
  {
    path: 'leadership-onboard',
    component:LeadershipHiringListComponent,
    data: { title: "Leadership Onboard",role:[10,1,9,2,7],otherRole:['IsRenuTeam', 'IsHRAccess'] },
    canActivate:[RoleWiseAccessGuard]
  },
  {
    path: 'pipeline-joinee-leadership',
    component:PipelineLeadershipJoineeComponent,
    data: { title: "Pipeline Joinee Leadership",role:[1,5,7,10],otherRole:['IsHRAccess'] },
    canActivate:[RoleWiseAccessGuard]
  },
   {
    path: 'candidate-dropout-report',
    component:CandidateDropoutReportComponent,
    data: { title: "Candidate Dropout Report",role:[1],otherRole:['IsHRAccess'] },
    canActivate:[RoleWiseAccessGuard]
  },
  {
    path: 'pipeline-candidate-history',
    component:PipelineCandidateHistoryComponent,
    data: { title: "Manual Pipeline Mailer History",role:[5,10],otherRole:['IsHRAccess','IsPipeLineAdmin'] },
    canActivate:[RoleWiseAccessGuard]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnboardRoutingModule { }
