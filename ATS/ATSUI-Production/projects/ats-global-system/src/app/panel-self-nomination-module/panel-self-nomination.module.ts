import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PanelSelfNominationRoutingModule } from './panel-self-nomination-routing.module';
import { PanelListScreenComponent } from './panel-list-screen/panel-list-screen.component';
import { SharedAppModule } from '../shared/shared-app/shared-app.module';
import { AddupdatePanelScreenComponent } from './panel-list-screen/pages/addupdate-panel-screen/addupdate-panel-screen.component';
import { PanelActiveDeactiveComponent } from './panel-list-screen/pages/panel-active-deactive/panel-active-deactive.component';
import { PublishJobsModalComponent } from './Modal-Screen/publish-jobs-modal/publish-jobs-modal.component';
import { PublishedJobListingsComponent } from './published-job-listings/published-job-listings.component';
import { SlotNominationModalComponent } from './Modal-Screen/slot-nomination-modal/slot-nomination-modal.component';
import { AddNewSlotComponent } from './Modal-Screen/add-new-slot/add-new-slot.component';
import { PanelSlotListThidComponent } from './Modal-Screen/panel-slot-list-thid/panel-slot-list-thid.component';
import { ViewInvitedRecruitersListModalComponent } from './Modal-Screen/view-invited-recruiters-list-modal/view-invited-recruiters-list-modal.component';


@NgModule({
  declarations: [
    PanelListScreenComponent,
    AddupdatePanelScreenComponent,
    PanelActiveDeactiveComponent,
    PublishJobsModalComponent,
    PublishedJobListingsComponent,
    SlotNominationModalComponent,
    AddNewSlotComponent,
    PanelSlotListThidComponent,
    ViewInvitedRecruitersListModalComponent
  ],
  imports: [
    CommonModule,
    SharedAppModule,
    PanelSelfNominationRoutingModule
  ]
})
export class PanelSelfNominationModule { }
