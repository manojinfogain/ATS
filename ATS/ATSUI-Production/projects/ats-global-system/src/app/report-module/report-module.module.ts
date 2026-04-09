import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportModuleRoutingModule } from './report-module-routing.module';
import { PanelWiseReportComponent } from './panel-wise-report/panel-wise-report.component';
import { SharedAppModule } from '../shared/shared-app/shared-app.module';
import { PanelWiseReportDetailsComponent } from './panel-wise-report/modals/panel-wise-report-details/panel-wise-report-details.component';
import { RecruiterWiseReportComponent } from './recruiter-wise-report/recruiter-wise-report.component';
import { RecruiterWiseReportDetailsComponent } from './recruiter-wise-report/modal/recruiter-wise-report-details/recruiter-wise-report-details.component';
import { ReportDashboardComponent } from './report-dashboard/report-dashboard.component';
import { DeliveryWiseReportComponent } from './delivery-wise-report/delivery-wise-report.component';
import { EmployeeReferalReportComponent } from './employee-referal-report/employee-referal-report.component';
import { OpenPositionReportComponent } from './open-position-report/open-position-report.component';
import { OpenPositionReportDetailsComponent } from './open-position-report/modals/open-position-report-details/open-position-report-details.component';
import { RecruiterProductivityReporComponent } from './recruiter-productivity-repor/recruiter-productivity-repor.component';
import { SalaryDeviationReportComponent } from './salary-deviation-report/salary-deviation-report.component';
import { CandidateOfferReportComponent } from './candidate-offer-report/candidate-offer-report.component';
import { ShippingAddresConfirmationStatusReportComponent } from './shipping-addres-confirmation-status-report/shipping-addres-confirmation-status-report.component';
import { InterviewProcessReportComponent } from './interview-process-report/interview-process-report.component';
import { ReportDetailsModalComponent } from './modals/report-details-modal/report-details-modal.component';
import { PanelWiseReportLatestComponent } from './panel-wise-report-latest/panel-wise-report-latest.component';
import { HiringTrackerReportComponent } from './hiring-tracker-report/hiring-tracker-report.component';
import { RenuCandidateWiseReportComponent } from './renu-candidate-wise-report/renu-candidate-wise-report.component';
import { IjpReportWmgComponent } from './ijp-report-wmg/ijp-report-wmg.component';
import { UsHiringTrackerComponent } from './us-hiring-tracker/us-hiring-tracker.component';
import { CandidateIntToOnboarVideoComComponent } from './candidate-int-to-onboar-video-com/candidate-int-to-onboar-video-com.component';
import { SalaryDeviationReportUsComponent } from './salary-deviation-report-us/salary-deviation-report-us.component';
import { PolandDemandReportComponent } from './poland-demand-report/poland-demand-report.component';


@NgModule({
    declarations: [
        PanelWiseReportComponent,
        PanelWiseReportDetailsComponent,
        RecruiterWiseReportComponent,
        RecruiterWiseReportDetailsComponent,
        ReportDashboardComponent,
        DeliveryWiseReportComponent,
        EmployeeReferalReportComponent,
        OpenPositionReportComponent,
        OpenPositionReportDetailsComponent,
        RecruiterProductivityReporComponent,
        SalaryDeviationReportComponent,
        CandidateOfferReportComponent,
        ShippingAddresConfirmationStatusReportComponent,
        InterviewProcessReportComponent,
        ReportDetailsModalComponent,
        PanelWiseReportLatestComponent,
        HiringTrackerReportComponent,
        RenuCandidateWiseReportComponent,
        IjpReportWmgComponent,
        UsHiringTrackerComponent,
        CandidateIntToOnboarVideoComComponent,
        SalaryDeviationReportUsComponent,
        PolandDemandReportComponent
    ],
    imports: [
        CommonModule,
        ReportModuleRoutingModule,
        SharedAppModule
    ]
})
export class ReportModuleModule { }
