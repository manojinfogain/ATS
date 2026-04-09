import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbDatepickerModule,NgbTimepickerModule,NgbPopoverModule, NgbDropdownModule, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatLegacyMenuModule as MatMenuModule} from '@angular/material/legacy-menu';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {MatLegacyTabsModule as MatTabsModule} from '@angular/material/legacy-tabs';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatLegacyCardModule as MatCardModule} from '@angular/material/legacy-card';
import {MatLegacyTableModule as MatTableModule} from '@angular/material/legacy-table';
import {MatLegacyPaginatorModule as MatPaginatorModule} from '@angular/material/legacy-paginator';
import {MatLegacyFormFieldModule as MatFormFieldModule} from '@angular/material/legacy-form-field';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';
import {MatLegacyCheckboxModule as MatCheckboxModule} from '@angular/material/legacy-checkbox';
import {MatLegacyListModule as MatListModule} from '@angular/material/legacy-list';
import {MatLegacyDialogModule as MatDialogModule} from '@angular/material/legacy-dialog';
import {MatLegacySelectModule as MatSelectModule} from '@angular/material/legacy-select';
import {MatLegacyTooltipModule as MatTooltipModule} from '@angular/material/legacy-tooltip';
import {MatBadgeModule} from '@angular/material/badge';
import {MatLegacyRadioModule as MatRadioModule} from '@angular/material/legacy-radio';
import { MatSortModule } from '@angular/material/sort';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatLegacyProgressBarModule as MatProgressBarModule} from '@angular/material/legacy-progress-bar';
import {MatLegacyProgressSpinnerModule as MatProgressSpinnerModule} from '@angular/material/legacy-progress-spinner';
import {MatLegacySnackBarModule as MatSnackBarModule} from '@angular/material/legacy-snack-bar';
import {MatLegacyAutocompleteModule as MatAutocompleteModule} from '@angular/material/legacy-autocomplete';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import {MatLegacyChipsModule as MatChipsModule} from '@angular/material/legacy-chips';
import {MatLegacySlideToggleModule as MatSlideToggleModule} from '@angular/material/legacy-slide-toggle';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { CountdownModule } from 'ngx-countdown';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ImageCropperModule } from 'ngx-image-cropper';
import {ClipboardModule} from '@angular/cdk/clipboard';
  const MatModules = [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatTabsModule,
    MatExpansionModule,
    MatCardModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatTableModule,
    MatListModule,
    MatDialogModule,
    MatSelectModule,
    MatTooltipModule,
    MatBadgeModule,
    MatRadioModule,
    MatSortModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatSlideToggleModule,
    ClipboardModule
  ]
  const NgbAtsModules = [
    NgbDatepickerModule,
    NgbTimepickerModule,
    NgbPopoverModule,
    NgbDropdownModule,
    NgxExtendedPdfViewerModule,
    CountdownModule,
    NgxChartsModule,
    ImageCropperModule,
    NgbProgressbarModule
  ]


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatModules,
    NgbAtsModules,
    NgxMatSelectSearchModule,
    NgxSliderModule
  ],
  exports:[
    MatModules,
    NgbAtsModules,
    NgxMatSelectSearchModule,
    NgxSliderModule
  ]
})
export class WidgetsModule { }
