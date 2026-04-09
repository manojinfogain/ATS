import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetsModule } from '../widgets/widgets.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PipesDirectivesModule } from '../pipes-directives/pipes-directives.module';
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';
import { SearchFilterComponent } from './components/search-filter/search-filter.component';
import { NoResultFoundComponent } from './components/no-result-found/no-result-found.component';
import { CustomPaginatorComponent } from './components/custom-paginator/custom-paginator.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { PasswordShareComponent } from './components/password-share/password-share.component';
import { AddressCandidateComponent } from './components/address-candidate/address-candidate.component';
import { CountryListCodeComponent } from './form-control-components/country-list-code/country-list-code.component';
import { AtsPdfViewerExternalComponent } from './components/ats-pdf-viewer-external/ats-pdf-viewer-external.component';
/**
 * component class name declare here
 */
const componentsCollection = [
  BreadcrumbsComponent,
  SearchFilterComponent,
  NoResultFoundComponent,
  CustomPaginatorComponent,
  ConfirmationDialogComponent,
  PasswordShareComponent,
  AddressCandidateComponent,
  CountryListCodeComponent,
  AtsPdfViewerExternalComponent
]
@NgModule({
    declarations: [
      componentsCollection
        
       
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
