import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WidgetsModule } from './widgets/widgets.module';
import { PdfHeaderDay1Component } from './components/pdf-header-day1/pdf-header-day1.component';
import { PdfFooterDay1Component } from './components/pdf-footer-day1/pdf-footer-day1.component';
import { LibAddressCandidateComponent } from './components/lib-address-candidate/lib-address-candidate.component';
import { LibCountryListCodeComponent } from './components/form-control-components/lib-country-list-code/lib-country-list-code.component';
import { LibClickOutsideDirective } from './directives/lib-click-outside.directive';
import { LibDisableInitialSpaceDirective, LibDisableSpaceDirective } from './directives/lib-disable-initial-space.directive';
import { LibGradeValueDecimalDirective, LibmobileNumberDirective, LibNumberDecimalDirective, LibNumberOnlyDirective, LibPrevInitZeroSingleAllowedDirective } from './directives/lib-number-only.directive';
import { LibExpMonthDirective, LibExpYearDirective } from './directives/lib-validation-ats.directive';
import { LibAlphabetsOnlyDirective, LibAlphaNumericForAddDirective, LibNumericAndAlphabetsDirective, LibValidationSpecialCharacterDirective } from './directives/lib-validation-special-character.directive';
import { LibCustomCurrencyConvertPipe } from './pipes/lib-custom-currency-convert.pipe';
import { LibSafeUrlPipe } from './pipes/lib-safe-url.pipe';
import { LibConvertToWordPipe } from './pipes/lib-convert-to-word.pipe';
import { LibDefaultProfileImagePipe } from './pipes/lib-default-profile-image.pipe';
import { LibAdditionalSkillsFilterPipe, LibCityListFilterPipe, LibCollegeNameFilterPipe, LibCountryCodeFilterPipe, LibCountryFilterPipe, LibCountryListFilterPipe, LibCourseIdFilterPipe, LibDesignationFilterPipe, LibFunctionFilterPipe, LibIndustryFilterPipe, LibLevelFilterPipe, LibNationalityFilterPipe, LibSkillsFilterPipe, LibSubjectFilterPipe, LibUniversityNameFilterPipe, LibYopFilterPipe } from './pipes/lib-search-by-name.pipe';
import { LibMessageComponent, LibMessageSnackBarComponent, LibMessageSnackBarErrorComponent } from './components/message/lib-message.component';
import { LibConfirmationDialogComponent } from './components/lib-confirmation-dialog/lib-confirmation-dialog.component';

const componentsCollection = [
    LibAddressCandidateComponent,
    LibCountryListCodeComponent,
    LibMessageComponent,
    LibMessageSnackBarComponent,
    LibMessageSnackBarErrorComponent,
    LibConfirmationDialogComponent
]
const directiveCollection = [
    LibClickOutsideDirective,
    LibDisableInitialSpaceDirective,
    LibDisableSpaceDirective,
    LibNumberOnlyDirective,
    LibNumberDecimalDirective,
    LibmobileNumberDirective,
    LibExpYearDirective,
    LibExpMonthDirective,
    LibValidationSpecialCharacterDirective,
    LibAlphabetsOnlyDirective,
    LibGradeValueDecimalDirective,
    LibNumericAndAlphabetsDirective,
    LibPrevInitZeroSingleAllowedDirective,
    LibAlphaNumericForAddDirective
  ]
  const pipesCollection = [
    LibSafeUrlPipe,
    LibCustomCurrencyConvertPipe,
    LibConvertToWordPipe,
    LibDefaultProfileImagePipe,
    LibCourseIdFilterPipe,
    LibCollegeNameFilterPipe,
    LibUniversityNameFilterPipe,
    LibSubjectFilterPipe,
    LibLevelFilterPipe,
    LibYopFilterPipe,
    LibCountryFilterPipe,
    LibNationalityFilterPipe,
    LibAdditionalSkillsFilterPipe,
    LibDesignationFilterPipe,
    LibSkillsFilterPipe,
    LibIndustryFilterPipe,
    LibFunctionFilterPipe,
    LibCountryListFilterPipe,
    LibCityListFilterPipe,
    LibCountryCodeFilterPipe
  ]
@NgModule({
    declarations: [
    PdfHeaderDay1Component,
    PdfFooterDay1Component,
    componentsCollection,
    directiveCollection,
    pipesCollection,
  ],
    imports: [
        CommonModule,
        WidgetsModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    exports: [
       WidgetsModule,
        FormsModule,
        ReactiveFormsModule,
        PdfHeaderDay1Component,
        PdfFooterDay1Component,
        componentsCollection,
        directiveCollection,
    pipesCollection,
    ]
})
export class SharedAppModule { }
