import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecRecAdminSuperadminGuard } from '../core/guards/rec-rec-admin-superadmin.guard';
import { BulkInterviewScheduleComponent } from './bulk-interview-schedule/bulk-interview-schedule.component';
import { CandidateInterviewScheduleComponent } from './candidate-interview-schedule/candidate-interview-schedule.component';
import { CandidateSearchIntComponent } from './candidate-search-int/candidate-search-int.component';
import { InterviewFeedbackComponent } from './interview-feedback/interview-feedback.component';
import { RescheduleCancelInterviewComponent } from './reschedule-cancel-interview/reschedule-cancel-interview.component';
import { ScheduleCandidateInterviewComponent } from './schedule-candidate-interview/schedule-candidate-interview.component';
import { SearchPageSectionComponent } from './search-page-section/search-page-section.component';
import { TransferCandidatesComponent } from './transfer-candidates/transfer-candidates.component';
import { UpcomingInterviewComponent } from './upcoming-interview/upcoming-interview.component';
import { ViewEditCandidateInfoComponent } from './view-edit-candidate-info/view-edit-candidate-info.component';
import { AiQuestionListComponent } from './ai-question-list/ai-question-list.component';
import { PanelDashboardComponent } from './panel-dashboard/panel-dashboard.component';
import { RoleWiseAccessGuard } from '../core/guards/roleWiseAccess.guard';

const routes: Routes = [
  {
    path: 'interview-schedules',
    component:ScheduleCandidateInterviewComponent,
    data: { title: "Schedule Candidate Interview" },
    canActivate:[RecRecAdminSuperadminGuard]
  },
  {
    path: 'interview-schedule',
    component:CandidateInterviewScheduleComponent,
    data: { title: "Schedule Candidate Interview (Screening Round)" },
    canActivate:[RecRecAdminSuperadminGuard]
  },
  {
    path: 'interview-feedback',
    component:InterviewFeedbackComponent,
    data: { title: "Candidate Interview Feedback" }
  },

  {
    path: 'reschedule-interview',
    component:RescheduleCancelInterviewComponent,
    data: { title: "Reschedule / Cancel Interview" },
    canActivate:[RecRecAdminSuperadminGuard]
  },
  {
    path: 'bulk-interview-schedule',
    component:BulkInterviewScheduleComponent,
    data: { title: "Bulk Interview Schedule" },
    canActivate:[RecRecAdminSuperadminGuard]
  },
  {
    path: 'view-edit-candidate-info',
    component:ViewEditCandidateInfoComponent,
    data: { title: "View / Edit Candidate Info " },
    canActivate:[RecRecAdminSuperadminGuard]
  },
  {
    path: 'transfer-candidates',
    component:TransferCandidatesComponent,
    data: { title: "Transfer Candidate" },
    canActivate:[RecRecAdminSuperadminGuard]
  },
 
  {
    path: 'candidate-module',
    component:CandidateSearchIntComponent,
    data: { title: "Candidate Module" },
    canActivate:[RecRecAdminSuperadminGuard]
  },
  {
    path: 'upcoming-interview',
    component:UpcomingInterviewComponent,
    data: { title: "Upcoming Interview" }
  },
  {
    path: 'panel-dashboard',
    component:PanelDashboardComponent,
    data: { title: "Panel Interview Dashboard",role:[5],otherRole:['IsInterviewer'] },
    canActivate:[RoleWiseAccessGuard]
  },
  {
    path: 'technical-evaluation-questions/:id',
    component:AiQuestionListComponent,
    data: { title: "Technical Evaluation Questions" }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InterviewModuleRoutingModule { }
