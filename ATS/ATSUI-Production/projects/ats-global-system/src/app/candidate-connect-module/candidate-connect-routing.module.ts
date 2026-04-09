import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecRecAdminSuperadminApproverGuard } from '../core/guards/rec-rec-admin-superadmin-approver.guard ';
import { RoleWiseGuardGuard } from '../core/guards/role-wise-guard.guard';
import { CandidateConnectTrackerComponent } from './candidate-connect-tracker/candidate-connect-tracker.component';
import { CandidateConnectComponent } from './candidate-connect/candidate-connect.component';


const routes: Routes = [
  {
    path: 'candidate-connect',
    component:CandidateConnectComponent,
    data: {title: 'Candidate Connect',role:[2,5,8, 10] },
    canActivate:[RoleWiseGuardGuard]
  },
  {
    path: 'candidate-tracker',
    component:CandidateConnectTrackerComponent,
    data: {title: 'Candidate Connect Tracker',role:[2,5,8,10] },
    canActivate:[RoleWiseGuardGuard]
  },
 

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CandidateConnectRoutingModule { }