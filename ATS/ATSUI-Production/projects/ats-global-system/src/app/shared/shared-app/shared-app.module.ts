import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetsModule } from '../widgets/widgets.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SkillSetComponent } from './components/skill-set/skill-set.component';

import { AutoCompleteTalentidComponent } from './components/auto-complete-talentid/auto-complete-talentid.component';
import { EmployeeListComponent } from './form-control-components/employee-list/employee-list.component';
import { CommonControlMasterComponent } from './form-control-components/common-control-master/common-control-master.component';
import { PipesDirectivesModule } from '../pipes-directives/pipes-directives.module';
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';
import { SearchFilterComponent } from './components/search-filter/search-filter.component';
import { CountryListCodeComponent } from './form-control-components/country-list-code/country-list-code.component';
import { CityListCodeComponent } from './form-control-components/city-list-code/city-list-code.component';
import { SharedTalentidListingComponent } from './components/shared-talentid-listing/shared-talentid-listing.component';
import { NoResultFoundComponent } from './components/no-result-found/no-result-found.component';
import { CustomPaginatorComponent } from './components/custom-paginator/custom-paginator.component';
import { MasterGlobalFormControlComponent } from './form-control-components//master-global-form-control/master-global-form-control.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { TimePickerComponent } from './components/time-picker/time-picker.component';
import { TalentIdControlAllComponent } from './form-control-components/talent-id-control-all/talent-id-control-all.component';
//import { FilterSortComponent } from './components/filter-sort/filter-sort.component';
import { CandidateSearchFilterComponent } from './components/candidate-search-filter/candidate-search-filter.component';
import { CandidateSourceControlComponent } from './form-control-components/candidate-source-control/candidate-source-control.component';
import { AccountListControlComponent } from './form-control-components/account-list-control/account-list-control.component';
import { ProjectListControlComponent } from './form-control-components/project-list-control/project-list-control.component';
import { RecruiterListControlComponent } from './form-control-components/recruiter-list-control/recruiter-list-control.component';
import { RequisitionTypeControlComponent } from './form-control-components/requisition-type-control/requisition-type-control.component';
import { DuListControlComponent } from './form-control-components/du-list-control/du-list-control.component';
import { PartnerFormComponent } from './components/partner-form/partner-form.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { PartnerListControlComponent } from './form-control-components/partner-list-control/partner-list-control.component';
import { PasswordShareComponent } from './components/password-share/password-share.component';
import { CompanyMasterControlComponent } from './form-control-components/company-master-control/company-master-control.component';
import { ApproverListComponent } from './form-control-components/approver-list/approver-list.component';
import { CandidateDetailsInfoComponent } from './components/candidate-details-info/candidate-details-info.component';
import { AddressCandidateComponent } from './components/address-candidate/address-candidate.component';
import { SessionUpcomingTimerComponent } from './components/session-upcoming-timer/session-upcoming-timer.component';
import { AllStatusIdVisibilitySharedComponent } from './components/all-status-id-visibility-shared/all-status-id-visibility-shared.component';
import { StateListControlComponent } from './form-control-components/state-list-control/state-list-control.component';
import { ViewCalenderHistoryComponent } from './components/view-calender-history/view-calender-history.component';
import { ImageCropperMopComponent } from './components/image-cropper-mop/image-cropper-mop.component';
import { HiringManagerControlComponent } from './form-control-components/hiring-manager-control/hiring-manager-control.component';
import { AccountOwnerControlComponent } from './form-control-components/account-owner-control/account-owner-control.component';
import { DesignationControlComponent } from './form-control-components/designation-control/designation-control.component';
import { TimezoneListControlComponent } from './form-control-components/timezone-list-control/timezone-list-control.component';
import { MRecruiterCtrlComponent } from './form-control-components/m-recruiter-ctrl/m-recruiter-ctrl.component';
import { LocationControlComponent } from './form-control-components/location-control/location-control.component';
import { TalentSubStatusListControlComponent } from './form-control-components/talent-sub-status-list-control/talent-sub-status-list-control.component';
import { EducationMasterControlComponent } from './form-control-components/education-master-control/education-master-control.component';
import { ContractTypeControlComponent } from './form-control-components/contract-type-control/contract-type-control.component';
import { OfferStatusControlComponent } from './form-control-components/offer-status-control/offer-status-control.component';
import { ProfileSourceControlComponent } from './form-control-components/profile-source-control/profile-source-control.component';
import { SubListControlComponent } from './form-control-components/sub-list-control/sub-list-control.component';
import { DivisionControlComponent } from './form-control-components/division-control/division-control.component';
import { JobFamilyControlComponent } from './form-control-components/job-family-control/job-family-control.component';
import { GradeIdControlComponent } from './form-control-components/grade-id-control/grade-id-control.component';
import { CompBandControlComponent } from './form-control-components/comp-band-control/comp-band-control.component';
import { SalaryGridControlComponent } from './form-control-components/salary-grid-control/salary-grid-control.component';
import { FilterSortComponent } from './components/filter-sort/filter-sort.component';
import { NotificationMessageComponent } from './components/notification-message/notification-message.component';
import { PracticeListControlComponent } from './form-control-components/practice-list-control/practice-list-control.component';
import { SubPracticeListControlComponent } from './form-control-components/sub-practice-list-control/sub-practice-list-control.component';
import { PracticeCommunityListControlComponent } from './form-control-components/practice-community-list-control/practice-community-list-control.component';
import { PracticeIeControlComponent } from './form-control-components/practice-ie-control/practice-ie-control.component';
import { EmploymentUnitTypeComponent } from './form-control-components/employment-unit-type/employment-unit-type.component';
import { TalentAdditionalSkillControlComponent } from './form-control-components/talent-additional-skill-control/talent-additional-skill-control.component';
import { PreviewMediaFileModalComponent } from './components/preview-media-file-modal/preview-media-file-modal.component';
import { TalentEmployeesReferControlComponent } from './form-control-components/talent-employees-refer-control/talent-employees-refer-control.component';
import { TalentStatusControlComponent } from './form-control-components/talent-status-control/talent-status-control.component';
import { DepartmentsControlComponent } from './form-control-components/departments-control/departments-control.component';
import { OnboardStatusControlComponent } from './form-control-components/onboard-status-control/onboard-status-control.component';
import { TalentCubeControlComponent } from './form-control-components/talent-cube-control/talent-cube-control.component';
import { EmployeeListForSpocControlComponent } from './form-control-components/employee-list-for-spoc-control/employee-list-for-spoc-control.component';
import { ApproverListUsControlComponent } from './form-control-components/approver-list-us-control/approver-list-us-control.component';
import { UsCandidateAddressComponent } from './components/us-candidate-address/us-candidate-address.component';
import { TcSkillsControlComponent } from './form-control-components/tc-skills-control/tc-skills-control.component';
import { ViewQuestionnaireDetailedFeedbackComponent } from './components/view-questionnaire-detailed-feedback/view-questionnaire-detailed-feedback.component';
import { CskillsCountryControlComponent } from './form-control-components/cskills-country-control/cskills-country-control.component';
import { InterviewTypeControlComponent } from './form-control-components/interview-type-control/interview-type-control.component';
import { CandidateStatusControlComponent } from './form-control-components/candidate-status-control/candidate-status-control.component';
import { InterviewByListControlComponent } from './form-control-components/interview-by-list-control/interview-by-list-control.component';
import { RegisteredPartnerStatusComponent } from './form-control-components/registered-partner-status/registered-partner-status.component';
import { GradeLatestControlComponent } from './form-control-components/grade-latest-control/grade-latest-control.component';
import { IjpStatusControlComponent } from './form-control-components/ijp-status-control/ijp-status-control.component';
import { OnboardingSendCredConfirmationDialogComponent } from './components/onboarding-send-cred-confirmation-dialog/onboarding-send-cred-confirmation-dialog.component';
import { PanelListCtrlComponent } from './form-control-components/panel-list-ctrl/panel-list-ctrl.component';
import { PartnerMultiContractsFieldsComponent } from './components/partner-multi-contracts-fields/partner-multi-contracts-fields.component';
import { PartnerContractsStatusComponent } from './form-control-components/partner-contracts-status/partner-contracts-status.component';
import { AlertMsgModalComponent } from './components/alert-msg-modal/alert-msg-modal.component';
import { PrimarySkillsByTcControlComponent } from './form-control-components/primary-skills-by-tc-control/primary-skills-by-tc-control.component';
import { OpplistcontrolComponent } from './form-control-components/opplistcontrol/opplistcontrol.component';
import { BizopsControlComponent } from './form-control-components/bizops-control/bizops-control.component';
import { TalentInterviewersListControlComponent } from './form-control-components/talent-interviewers-list-control/talent-interviewers-list-control.component';
import { BgvFinalStatusControlComponent } from './form-control-components/bgv-final-status-control/bgv-final-status-control.component';
import { EmployementTypeLocControlComponent } from './form-control-components/employement-type-loc-control/employement-type-loc-control.component';
import { DemandDetailsVisibiltyComponent } from './components/demand-details-visibilty/demand-details-visibilty.component';
import { AtsPdfViewerComponent } from './components/ats-pdf-viewer/ats-pdf-viewer.component';


/**
 * component class name declare here
 */
const componentsCollection = [
    SkillSetComponent,
    AutoCompleteTalentidComponent,
    EmployeeListComponent,
    CommonControlMasterComponent,
    BreadcrumbsComponent,
    SearchFilterComponent,
    CountryListCodeComponent,
    CityListCodeComponent,
    SharedTalentidListingComponent,
    NoResultFoundComponent,
    CustomPaginatorComponent,
    MasterGlobalFormControlComponent,
    FileUploadComponent,
    TimePickerComponent,
    TalentIdControlAllComponent,
    FilterSortComponent,
    CandidateSearchFilterComponent,
    CandidateSourceControlComponent,
    AccountListControlComponent,
    ProjectListControlComponent,
    RecruiterListControlComponent,
    RequisitionTypeControlComponent,
    DuListControlComponent,
    PartnerFormComponent,
    ConfirmationDialogComponent,
    PartnerListControlComponent,
    PasswordShareComponent,
    CompanyMasterControlComponent,
    ApproverListComponent,
    CandidateDetailsInfoComponent,
    AddressCandidateComponent,
    SessionUpcomingTimerComponent,
    AllStatusIdVisibilitySharedComponent,
    StateListControlComponent,
    ViewCalenderHistoryComponent,
    ImageCropperMopComponent,
    HiringManagerControlComponent,
    AccountOwnerControlComponent,
    DesignationControlComponent,
    TimezoneListControlComponent,
    MRecruiterCtrlComponent,
    LocationControlComponent,
    TalentSubStatusListControlComponent,
    EducationMasterControlComponent,
    ContractTypeControlComponent,
    OfferStatusControlComponent,
    ProfileSourceControlComponent,
    DivisionControlComponent,
    JobFamilyControlComponent,
    GradeIdControlComponent,
    CompBandControlComponent,
    SalaryGridControlComponent,
    NotificationMessageComponent,
    PracticeListControlComponent,
    SubPracticeListControlComponent,
    PracticeCommunityListControlComponent,
    PracticeIeControlComponent,
    EmploymentUnitTypeComponent,
    TalentAdditionalSkillControlComponent,
    PreviewMediaFileModalComponent,
    TalentEmployeesReferControlComponent,
    DepartmentsControlComponent,
    OnboardStatusControlComponent,
    TalentCubeControlComponent,
    EmployeeListForSpocControlComponent,
    ApproverListUsControlComponent,
    UsCandidateAddressComponent,
    TcSkillsControlComponent,
    ViewQuestionnaireDetailedFeedbackComponent,
    CskillsCountryControlComponent,
    InterviewTypeControlComponent,  
    InterviewByListControlComponent,  
    RegisteredPartnerStatusComponent,
    GradeLatestControlComponent,
    PanelListCtrlComponent  ,
    PartnerMultiContractsFieldsComponent,
    PrimarySkillsByTcControlComponent,  
    TalentInterviewersListControlComponent,
    EmployementTypeLocControlComponent,
     DemandDetailsVisibiltyComponent,
        AtsPdfViewerComponent,
]
@NgModule({
    declarations: [
        componentsCollection,
        SubListControlComponent,
        TalentStatusControlComponent,
        CandidateStatusControlComponent,
        OnboardingSendCredConfirmationDialogComponent,
        IjpStatusControlComponent,
        PartnerContractsStatusComponent,
        AlertMsgModalComponent,
        OpplistcontrolComponent,
        BizopsControlComponent,
        EmployementTypeLocControlComponent,
        BgvFinalStatusControlComponent,
    ],
    imports: [
        CommonModule,
        WidgetsModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        PipesDirectivesModule
    ],
    exports: [
        WidgetsModule,
        FormsModule,
        ReactiveFormsModule,
        componentsCollection,
        PipesDirectivesModule
    ]
})
export class SharedAppModule { }
