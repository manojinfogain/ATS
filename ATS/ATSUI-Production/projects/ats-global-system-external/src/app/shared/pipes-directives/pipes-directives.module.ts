import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultProfileImagePipe } from './pipes/default-profile-image.pipe';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { DisableInitialSpaceDirective, DisableSpaceDirective } from './directives/disable-initial-space.directive';
import { mobileNumberDirective, NumberDecimalDirective, NumberOnlyDirective, GradeValueDecimalDirective, PrevInitZeroSingleAllowedDirective } from './directives/number-only.directive';
import { ExpMonthDirective, ExpYearDirective } from './directives/validation-ats.directive';
import { AlphabetsOnlyDirective, AlphaNumericForAddDirective, NumericAndAlphabetsDirective, ValidationSpecialCharacterDirective } from './directives/validation-special-character.directive';
import { SafeUrlPipe } from './pipes/safe-url.pipe';
import { CustomCurrencyConvertPipe } from './pipes/custom-currency-convert.pipe';
import { ConvertToWordPipe } from './pipes/convert-to-word.pipe';
import { CollegeNameFilterPipe, CountryFilterPipe, CountryListFilterPipe, CityListFilterPipe, CourseIdFilterPipe, DesignationFilterPipe, FunctionFilterPipe, IndustryFilterPipe, LevelFilterPipe, SkillsFilterPipe, SubjectFilterPipe, UniversityNameFilterPipe, YopFilterPipe, NationalityFilterPipe, AdditionalSkillsFilterPipe } from './pipes/search-by-name.pipe';
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
  ValidationSpecialCharacterDirective,
  AlphabetsOnlyDirective,
  GradeValueDecimalDirective,
  NumericAndAlphabetsDirective,
  PrevInitZeroSingleAllowedDirective,
  AlphaNumericForAddDirective,
  CapitalizeWordsDirective
]
const pipesCollection = [
SafeUrlPipe,
CustomCurrencyConvertPipe,
ConvertToWordPipe,
DefaultProfileImagePipe,
CourseIdFilterPipe,
CollegeNameFilterPipe,
UniversityNameFilterPipe,
SubjectFilterPipe,
LevelFilterPipe,
YopFilterPipe,
CountryFilterPipe,
NationalityFilterPipe,
AdditionalSkillsFilterPipe,
DesignationFilterPipe,
SkillsFilterPipe,
IndustryFilterPipe,
FunctionFilterPipe,
CountryListFilterPipe,
CityListFilterPipe
]

@NgModule({
  declarations: [
    directiveCollection,
    pipesCollection,
   
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
