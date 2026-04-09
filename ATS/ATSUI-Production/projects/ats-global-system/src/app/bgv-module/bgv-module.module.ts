import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BgvModuleRoutingModule } from './bgv-module-routing.module';
import { BgvCandidatesListComponent } from './bgv-candidates-list/bgv-candidates-list.component';
import { SharedAppModule } from '../shared/shared-app/shared-app.module';
import { CommonSharingModule } from '../common-sharing/common-sharing.module';
import { EmployeeWiseBgvReportComponent } from './employee-wise-bgv-report/employee-wise-bgv-report.component';
import { CheckWiseBgvReportComponent } from './check-wise-bgv-report/check-wise-bgv-report.component';
import { DetailedBgvReportComponent } from './detailed-bgv-report/detailed-bgv-report.component';
import { AddRemoveAccountDrugTestComponent } from './add-remove-account-drug-test/add-remove-account-drug-test.component';
import { AddNewAccountDtModalComponent } from './modals/add-new-account-dt-modal/add-new-account-dt-modal.component';
import { UpdateOtherBgvDetailsModalComponent } from './modals/update-other-bgv-details-modal/update-other-bgv-details-modal.component';
import { ViewCheckWiseReportHistoryComponent } from './modals/view-check-wise-report-history/view-check-wise-report-history.component';


@NgModule({
  declarations: [
    BgvCandidatesListComponent,
    EmployeeWiseBgvReportComponent,
    CheckWiseBgvReportComponent,
    DetailedBgvReportComponent,
    AddRemoveAccountDrugTestComponent,
    AddNewAccountDtModalComponent,
    UpdateOtherBgvDetailsModalComponent,
    ViewCheckWiseReportHistoryComponent
  ],
  imports: [
    CommonModule,
    BgvModuleRoutingModule,
    SharedAppModule,
    CommonSharingModule,
  ]
})
export class BgvModuleModule { }
