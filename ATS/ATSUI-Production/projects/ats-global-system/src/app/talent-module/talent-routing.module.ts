import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleWiseAccessGuard } from '../core/guards/roleWiseAccess.guard';
import { ApplyForIjpComponent } from './apply-for-ijp/apply-for-ijp.component';
import { JobRequisitionListComponent } from './job-requisition-list/job-requisition-list.component';
import { TalentDashboardComponent } from './talent-dashboard/talent-dashboard.component';
import { TalentApprovalScreenComponent } from './talent-approval-screen/talent-approval-screen.component';
import { ViewAllJobRequisitionListComponent } from './view-all-job-requisition-list/view-all-job-requisition-list.component';

const routes: Routes = [
  {
    path: 'talent/dashboard',
    component: TalentDashboardComponent,
    data: { title: "Dashboard", role: [5], otherRole: ['IsHiringManager', 'IsGDL', 'IsWMG' ,'IsBUHead','IsAO', 'IsFinance'] },
    canActivate: [RoleWiseAccessGuard]
  },
  {
    path: 'talent/job-requisition',
    component: JobRequisitionListComponent,
    data: { title: "Job Requisitions", role: [5], otherRole: ['IsHiringManager', 'IsGDL', 'IsWMG', 'IsBUHead', 'IsAO', 'IsFinance','IsTAG', 'IsJDEditableRight'] },
    canActivate: [RoleWiseAccessGuard]
  },
  {
    path: 'talent/internal-job-opportunity',
    component: ApplyForIjpComponent,
    data: { title: "Internal JOB Opportunity Openings", role: [5], otherRole: ['IsHiringManager', 'IsGDL', 'IsWMG', 'IsBUHead', 'IsAO', 'IsFinance','IsIJP','IsBizOpsSecondary'] },
    canActivate: [RoleWiseAccessGuard]
  },

  {
    path: 'talent/approval-screen',
    component: TalentApprovalScreenComponent,
    data: { title: "Job Requisition Approval", }
    //  canActivate: [RoleWiseAccessGuard]
    //  otherRole:[ 'IsBUHead', 'IsAO','IsGDL',]
  },
  {
    path: 'talent/all-job-requisition',
    component: ViewAllJobRequisitionListComponent,
    data: { title: "View All Job Requisitions", role: [5], otherRole: ['IsHiringManager', 'IsGDL', 'IsWMG', 'IsBUHead', 'IsAO', 'IsFinance','IsTAG'] },
    canActivate: [RoleWiseAccessGuard]
  },
  // 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TalentRoutingModule {

}
