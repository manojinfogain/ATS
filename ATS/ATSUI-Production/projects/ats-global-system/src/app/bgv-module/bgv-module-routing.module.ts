import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleWiseGuardGuard } from '../core/guards/role-wise-guard.guard';
import { BgvCandidatesListComponent } from './bgv-candidates-list/bgv-candidates-list.component';
import { EmployeeWiseBgvReportComponent } from './employee-wise-bgv-report/employee-wise-bgv-report.component';
import { CheckWiseBgvReportComponent } from './check-wise-bgv-report/check-wise-bgv-report.component';
import { DetailedBgvReportComponent } from './detailed-bgv-report/detailed-bgv-report.component';
import { AddRemoveAccountDrugTestComponent } from './add-remove-account-drug-test/add-remove-account-drug-test.component';
import { RoleWiseAccessGuard } from '../core/guards/roleWiseAccess.guard';

const routes: Routes = [ 
  {
    path: 'bgv-candidates-list',
    component:BgvCandidatesListComponent,
    data: { title: "Candidates List For BGV",role:[1], otherRole:['IsRM']},
    canActivate:[RoleWiseAccessGuard]
  },
   {
    path: 'employee-wise-bgv-report',
    component:EmployeeWiseBgvReportComponent,
    data: { title: "Employee Wise BGV Report",role:[1] },
    canActivate:[RoleWiseGuardGuard]
  },
  {
    path: 'check-wise-bgv-report',
    component: CheckWiseBgvReportComponent,
    data: { title: "Check Wise BGV Report", role: [1] },
    canActivate: [RoleWiseGuardGuard]
  },
  {
    path: 'detailed-bgv-report',
    component: DetailedBgvReportComponent,
    data: { title: "Detailed BGV Report", role: [1] },
    canActivate: [RoleWiseGuardGuard]
  },
  {
    path: 'add-remove-account-for-dt',
    component: AddRemoveAccountDrugTestComponent,
    data: { title: "Add / Remove Account For Drug Test", role: [1] },
    canActivate: [RoleWiseGuardGuard]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BgvModuleRoutingModule { }
