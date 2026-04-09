import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RecRecAdminSuperadminApproverGuard } from '../core/guards/rec-rec-admin-superadmin-approver.guard ';
import { BuddyScreenComponent } from './buddy-screen/buddy-screen.component';
import { RoleWiseAccessGuard } from '../core/guards/roleWiseAccess.guard';

const routes: Routes = [

  {
    path: 'buddy-screen',
    component: BuddyScreenComponent,
    data: { title: "Assign buddy",role:[],otherRole:['IsRM','IsHRBP','IsHiringManager','IsPM'] },
    canActivate: [RoleWiseAccessGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuddyRoutingModule { }
