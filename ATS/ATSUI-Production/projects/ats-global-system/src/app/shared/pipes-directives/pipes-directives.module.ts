import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { DisableInitialSpaceDirective, DisableSpaceDirective } from './directives/disable-initial-space.directive';
import { mobileNumberDirective, NumberDecimalDirective, NumberOnlyDirective, RemoveAriaOwnsDirective } from './directives/number-only.directive';
import { DashSearchPipe } from './pipes/dash-search.pipe';
import { accountFilterPipe, CityFilterPipe, CountryCodeFilterPipe, CountryFilterPipe, designationFilterPipe, EmplListRecFilterPipe, offerStatusPipe, panelFilterPipe,JobFamilyFilterPipe, ProjectFilterPipe, recruiterFilter, skillFilterPipe, StateFilterPipe, talendIdFilterPipe, subListFilterPipe, GradeFilterPipe, CandidateStatusFilterPipe, candidateJoinedListPipe, practiceFilterPipe, practiceCommunityFilterPipe, SubPracticeFilterPipe, additionalSkillFilterPipe, 
  EmpCreationDesignFilterPipe, LastEmployerFilterPipe, JobTitleFilterPipe, ReportingMngrFilterPipe, VendorFilterPipe, SubLocationFilterPipe, DepartmentFilterPipe, DPFilterPipe, NationalityFilterPipe, OnboarsStatusFilterPipe, USEmployeeFilterPipe, FieldsListData,TCFilterPipe, tagHeadFilterPipe, WorkVisaFilterPipe, DepartmentCodeFilterPipe, TalentCubeCodeFilterPipe, tagLeadApproUS, VenderfilterPIPE, cskillCountryFilterPipe, CoderBytePipe,interviTypeFilterPipe, gradePipe, hrListDelegateFilterPipe,
buddyListFilterPipe,
PrimarySkillByTcPipe,
DelegateISSFilterPipe,
  AccountNameFilterPipe,
  SearchCtrlIssReason} from './pipes/search-by-name.pipe';
import { SafeUrlPipe,SafeHtmlPipe } from './pipes/safe-url.pipe';
import { FilterDataCandidateListPipe, FilterDataCompanylPipe, FilterDataCSkillPipe, FilterDataModalPipe, FilterDataPipe, FilterOppNamePipe } from './pipes/filter-data.pipe';
import { EmailContainInfogain, ExpMonthDirective, ExpYearDirective } from './directives/validation-ats.directive';
import { AHWiseFilterPipe, CompanySearchFilterPipe, DayLightSavingPipe, duFilterPipe, HMWiseFilterPipe, panelWiseFilterDetailsPipe, panelWiseFilterPipe, partnerListFilterPipe, recruiterWiseFilterPipe, showCharPartnerPipe, TalentPartnerFilterPipe, TZFilterPipe } from './pipes/commonfilter.pipe';
import { CalenderAddKey, CustomCurrencyConvertPipe } from './pipes/custom-currency-convert.pipe';
import { ConvertToWordPipe } from './pipes/convert-to-word.pipe';
import { DefaultProfileImagePipe } from './pipes/default-profile-image.pipe';
import { DateFilterPipe, DateUTCTimePipe, TimezoneNamePipe, TimezonePipe } from './pipes/date-filter.pipe';
import { AccountFilterOnDash, BUFilterOnDashPipe, DUFilterOnDashPipe, HmFilterOnDashPipe, PmFilterOnDashPipe, RportFilterOnDashPipe} from './pipes/search-dash-all.pipe';
import { dateSwitchPipe } from './pipes/date-switch.pipe';
import { AlphabetsOnlyDirective, ValidationSpecialCharacterDirective } from './directives/validation-special-character.directive';
import { CidPrefixPipe } from './pipes/cid-prefix.pipe';
import { DepartmentSearchPipe, EmpFiltertPipe, TalentAccountPipe, TalentConversionPipe, TalentdesignationPipe, TalentdesignCategoriesPipe, TalentDivisonPipe, TalentDuPipe, TalentJoiningCityPipe, TalentJoiningLocationPipe, TalentJoiningStatePipe, TalentOppurtunityPipe, TalentPrimarySkillPipe, TalentProjectPipe, TalentQualificationPipe, TalentReferEmployePipe, TalentReplacementPipe, TalentReplacementReasonPipe, TalentStatusSearchPipe, TalentSubSkillsPipe } from './pipes/talent-pipe';
import { G5AboveApproverPipe, OfferG5abovePipe } from './pipes/offer-g5above.pipe';
import { AmountMaskPipe } from './pipes/masking-amount.pipe';
import { SkillProficiencyPipe } from './pipes/skill-proficiency.pipe';
import { CapitalizeWordsDirective } from './directives/capitalizeWords.directive';

const directiveCollection = [
    ClickOutsideDirective,
    DisableInitialSpaceDirective,
    DisableSpaceDirective,
    NumberOnlyDirective,
    NumberDecimalDirective,
    mobileNumberDirective,
    ExpYearDirective,
    ExpMonthDirective,
    EmailContainInfogain,
    AHWiseFilterPipe,
    dateSwitchPipe,
    ValidationSpecialCharacterDirective,
    AlphabetsOnlyDirective ,
    RemoveAriaOwnsDirective,
    showCharPartnerPipe,
    CapitalizeWordsDirective
]
const pipesCollection = [
  DashSearchPipe,
  designationFilterPipe, 
  panelFilterPipe,
  DPFilterPipe, 
  JobFamilyFilterPipe,
  CandidateStatusFilterPipe,
  AccountNameFilterPipe,
  GradeFilterPipe,
  skillFilterPipe, 
  talendIdFilterPipe,
  SafeUrlPipe,
  FilterDataCandidateListPipe, 
  FilterDataCSkillPipe, 
  FilterDataModalPipe, 
  FilterDataPipe,
  CountryFilterPipe,
  CountryCodeFilterPipe,
  CityFilterPipe,
  accountFilterPipe,
  recruiterFilter,
  ProjectFilterPipe,
  EmplListRecFilterPipe,
  panelWiseFilterPipe,
  duFilterPipe,
  panelWiseFilterDetailsPipe,
  partnerListFilterPipe,
  TalentPartnerFilterPipe,
  CompanySearchFilterPipe,
  recruiterWiseFilterPipe,
  CustomCurrencyConvertPipe,
  ConvertToWordPipe,
  DefaultProfileImagePipe,
  offerStatusPipe,
  StateFilterPipe,
  CalenderAddKey,
  DateFilterPipe,
  AccountFilterOnDash,
  PmFilterOnDashPipe,
  HmFilterOnDashPipe,
  DUFilterOnDashPipe,
  BUFilterOnDashPipe,
  RportFilterOnDashPipe,
  HMWiseFilterPipe,
  DayLightSavingPipe,
  TZFilterPipe,
  subListFilterPipe,
  CidPrefixPipe,
  candidateJoinedListPipe,
  practiceFilterPipe,
  practiceCommunityFilterPipe,
  SubPracticeFilterPipe,
  additionalSkillFilterPipe,
  TalentSubSkillsPipe,
  TalentPrimarySkillPipe,
  TalentDuPipe,
  TalentAccountPipe,
  TalentOppurtunityPipe,
  TalentdesignCategoriesPipe,
  TalentdesignationPipe,
  TalentJoiningLocationPipe,
  TalentJoiningStatePipe,
  TalentJoiningCityPipe,
  TalentQualificationPipe,
  TalentProjectPipe,
  TalentDivisonPipe,
  TalentReplacementReasonPipe,
  TalentReferEmployePipe,
  TalentStatusSearchPipe,
  DepartmentSearchPipe,
  TalentConversionPipe,
  NationalityFilterPipe,
  EmpCreationDesignFilterPipe,
  LastEmployerFilterPipe,
  JobTitleFilterPipe,
  ReportingMngrFilterPipe,
  VendorFilterPipe,
  SubLocationFilterPipe,
  DepartmentFilterPipe,
  OnboarsStatusFilterPipe,
  USEmployeeFilterPipe,
  FieldsListData,
  TCFilterPipe,
  tagHeadFilterPipe,
  OfferG5abovePipe,
  G5AboveApproverPipe,
  WorkVisaFilterPipe,
  DepartmentCodeFilterPipe,
  TalentCubeCodeFilterPipe,
  tagLeadApproUS,
  VenderfilterPIPE,
  USEmployeeFilterPipe,
  SafeHtmlPipe,
  cskillCountryFilterPipe,
  interviTypeFilterPipe,
  AmountMaskPipe,
  CoderBytePipe,
  interviTypeFilterPipe,
  TalentReplacementPipe,
  gradePipe,
  EmpFiltertPipe,
  TimezonePipe,
  TimezoneNamePipe,
  DateUTCTimePipe,
  hrListDelegateFilterPipe,
  buddyListFilterPipe,
  PrimarySkillByTcPipe,
  DelegateISSFilterPipe,
  // primarySkillByTc,
  FilterDataCompanylPipe,
  FilterOppNamePipe,
  SearchCtrlIssReason
]

@NgModule({
  declarations: [
    directiveCollection,
    pipesCollection,
    SkillProficiencyPipe,
   
  ],
  imports: [
    CommonModule
  ],
  exports:[
    directiveCollection,
    pipesCollection
  ]
})
export class PipesDirectivesModule { }
