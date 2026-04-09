import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PanelListScreenComponent } from './panel-list-screen/panel-list-screen.component';
import { PublishedJobListingsComponent } from './published-job-listings/published-job-listings.component';
import { RoleWiseGuardGuard } from '../core/guards/role-wise-guard.guard';
import { RoleWiseAccessGuard } from '../core/guards/roleWiseAccess.guard';

const routes: Routes = [
  {
    path: 'panel-list',
    component: PanelListScreenComponent,
    data:{title:"Panel List",role:[5],otherRole:[]},
    canActivate:[RoleWiseAccessGuard]
  },
  {
    path: 'published-job-listing',
    component: PublishedJobListingsComponent,
    data:{title:"Published Job Listings",role:[5,2],otherRole:['IsPanelAccess']},
    canActivate:[RoleWiseAccessGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PanelSelfNominationRoutingModule { }
