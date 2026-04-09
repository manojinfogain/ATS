import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CandidateConnectRoutingModule } from './candidate-connect-routing.module';
import { CandidateConnectComponent } from './candidate-connect/candidate-connect.component';
import { SharedAppModule } from '../shared/shared-app/shared-app.module';
import { CandidateConnectViewComponent } from './modals/candidate-connect-view/candidate-connect-view.component';
import { UpdateConnectHistoryComponent } from './modals/update-connect-history/update-connect-history.component';
import { CandidateConnectTrackerComponent } from './candidate-connect-tracker/candidate-connect-tracker.component';




@NgModule({
  declarations: [
    CandidateConnectComponent,
    CandidateConnectViewComponent,
    UpdateConnectHistoryComponent,
    CandidateConnectTrackerComponent,

  ],
  imports: [
    CommonModule,
    CandidateConnectRoutingModule,
    SharedAppModule
  ]
})
export class CandidateConnectModule { }
