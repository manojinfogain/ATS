import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyMasterComponent } from './company-master/company-master.component';
import { RoleWiseAccessGuard } from '../core/guards/roleWiseAccess.guard';
import { RecAdminSuperadminGuard } from '../core/guards/rec-admin-superadmin.guard';

const routes: Routes = [
  {
    path: 'company-master',
    component: CompanyMasterComponent,
    data:{title:"Company Master",role:[5,10],otherRole:[] },
    canActivate:[RoleWiseAccessGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminModuleRoutingModule { }
