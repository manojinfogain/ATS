import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { JobDetailsPopupComponent } from './modal/job-details-popup/job-details-popup.component';
import { AddProfileFormComponent } from './modal/add-profile-form/add-profile-form.component';
import { ViewCskillComponent } from './modal/view-cskill/view-cskill.component';
import { ViewInfoTalentidComponent } from './modal/view-info-talentid/view-info-talentid.component';
import { ViewProfileListComponent } from './modal/view-profile-list/view-profile-list.component';
import { SharedAppModule } from '../shared/shared-app/shared-app.module';
import { AssignedTalentidListComponent } from './assigned-talentid-list/assigned-talentid-list.component';
import { TotalOpenTalentListComponent } from './total-open-talent-list/total-open-talent-list.component';
import { UnmapProfilesCountComponent } from './modal/unmap-profiles-count/unmap-profiles-count.component';
import { UnmapProfilesListComponent } from './modal/unmap-profiles-list/unmap-profiles-list.component';
import { AssignCandidateTalentidComponent } from './modal/assign-candidate-talentid/assign-candidate-talentid.component';
import { UnusedCskillProfileListComponent } from './modal/unused-cskill-profile-list/unused-cskill-profile-list.component';
import { PartnerCandidateListsComponent } from './modal/partner-candidate-lists/partner-candidate-lists.component';
import { ScreenRejectModalComponent } from './modal/screen-reject-modal/screen-reject-modal.component';
import { UpdateTalentidStatusComponent } from './modal/update-talentid-status/update-talentid-status.component';
import { CommonRepoModalComponent } from './modal/common-repo-modal/common-repo-modal.component';
import { ScheduleInterviewComponent } from './modal/schedule-interview/schedule-interview.component';
import { DuDashboardComponent } from './du-dashboard/du-dashboard.component';
import { DuBuReportComponent } from './du-dashboard/du-bu-report/du-bu-report.component';
import { BuDashboardComponent } from './bu-dashboard/bu-dashboard.component';
import { BuReportDashComponent } from './bu-dashboard/bu-report-dash/bu-report-dash.component';
import { AccountOwnerDasboardComponent } from './account-owner-dasboard/account-owner-dasboard.component';
import { AccountReportsComponent } from './account-owner-dasboard/account-reports/account-reports.component';
import { PmDashboardComponent } from './pm-dashboard/pm-dashboard.component';
import { PmWisReportComponent } from './pm-dashboard/pm-wis-report/pm-wis-report.component';
import { HiringManagerDashboardComponent } from './hiring-manager-dashboard/hiring-manager-dashboard.component';
import { HmReportComponent } from './hiring-manager-dashboard/hm-report/hm-report.component';
import { CandidateInfoDialogComponent } from './modal/candidate-info-dialog/candidate-info-dialog.component';
import { CommonSharingModule } from '../common-sharing/common-sharing.module';
import { ViewTalentWiseCountComponent } from './modal/view-talent-wise-count/view-talent-wise-count.component';
import { DuOverallHiringComponent } from './du-overall-hiring/du-overall-hiring.component';
import { PermanentHiringDetailsComponent } from './permanent-hiring-details/permanent-hiring-details.component';
import { OverallHiringOfferToJoiningComponent } from './overall-hiring-offer-to-joining/overall-hiring-offer-to-joining.component';
import { LocationSpecificHiringDetailsComponent } from './location-specific-hiring-details/location-specific-hiring-details.component';
import { OverallHiringSourceTypeComponent } from './overall-hiring-source-type/overall-hiring-source-type.component';
import { ApprovalProfilesListComponent } from './approval-profiles-list/approval-profiles-list.component';
import { ApproveProdileModalComponent } from './approval-profiles-list/approve-prodile-modal/approve-prodile-modal.component';
import { ProfileApprovalDetailsComponent } from './approval-profiles-list/profile-approval-details/profile-approval-details.component';
import { ViewProfileDetailsAprovalModalComponent } from './approval-profiles-list/view-profile-details-aproval-modal/view-profile-details-aproval-modal.component';
import { ResumeAssesmentModalComponent } from './modal/resume-assesment-modal/resume-assesment-modal.component';
import { ViewProfileListHisAssestComponent } from './modal/view-profile-list-his-assest/view-profile-list-his-assest.component';
import { ViewAllProfilesModalComponent } from './modal/view-all-profiles-modal/view-all-profiles-modal.component';
import { UpdateprofileDetailsComponent } from './modal/updateprofile-details/updateprofile-details.component';
import { ViewApplicantDetailsModalComponent } from './modal/view-applicant-details-modal/view-applicant-details-modal.component';


@NgModule({
    declarations: [
        DashboardComponent,
        JobDetailsPopupComponent,
        AddProfileFormComponent,
        ViewCskillComponent,
        ViewInfoTalentidComponent,
        ViewProfileListComponent,
        AssignedTalentidListComponent,
        TotalOpenTalentListComponent,
        UnmapProfilesCountComponent,
        UnmapProfilesListComponent,
        AssignCandidateTalentidComponent,
        UnusedCskillProfileListComponent,
        PartnerCandidateListsComponent,
        ScreenRejectModalComponent,
        UpdateTalentidStatusComponent,
        CommonRepoModalComponent,
        ScheduleInterviewComponent,
        DuDashboardComponent,
        DuBuReportComponent,
        BuDashboardComponent,
        BuReportDashComponent,
        AccountOwnerDasboardComponent,
        AccountReportsComponent,
        PmDashboardComponent,
        PmWisReportComponent,
        HiringManagerDashboardComponent,
        HmReportComponent,
        CandidateInfoDialogComponent,
        ViewTalentWiseCountComponent,
        DuOverallHiringComponent,
        PermanentHiringDetailsComponent,
        OverallHiringOfferToJoiningComponent,
        LocationSpecificHiringDetailsComponent,
        OverallHiringSourceTypeComponent,
        ApprovalProfilesListComponent,
        ApproveProdileModalComponent,
        ProfileApprovalDetailsComponent,
        ViewProfileDetailsAprovalModalComponent,
        ResumeAssesmentModalComponent,
        ViewProfileListHisAssestComponent,
        ViewAllProfilesModalComponent,
        UpdateprofileDetailsComponent,
        ViewApplicantDetailsModalComponent
    ],
    imports: [
        CommonModule,
        DashboardRoutingModule,
        SharedAppModule,
        CommonSharingModule
        // RouterModule
    ]
})
export class DashboardModule { }
