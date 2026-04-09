import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CandidateDayOneFormsRoutingModule } from './candidate-day-one-forms-routing.module';
import { CandidateDayOneFormsComponent } from './candidate-day-one-forms/candidate-day-one-forms.component';
import { SharedAppModule } from '../../shared/shared-app/shared-app.module';
import { DayOneFormModalComponent } from './modal/day-one-form-modal/day-one-form-modal.component';
import { AtsLibModule } from 'projects/ats-lib/src/public-api';
import { AppointmentLetterConsentComponent } from './appointment-letter-consent/appointment-letter-consent.component';
import { UploadPendingDocumentsComponent } from './upload-pending-documents/upload-pending-documents.component';
import { UploadDocumentModalComponent } from './modal/day-one-form-modal/upload-document-modal/upload-document-modal.component';
import { Day1DisclaimerModalComponent } from './modal/day1-disclaimer-modal/day1-disclaimer-modal.component';


@NgModule({
  declarations: [
    CandidateDayOneFormsComponent,
    DayOneFormModalComponent,
    AppointmentLetterConsentComponent,
    UploadPendingDocumentsComponent,
    UploadDocumentModalComponent,
    Day1DisclaimerModalComponent
  ],
  imports: [
    CommonModule,
    CandidateDayOneFormsRoutingModule,
    SharedAppModule,
    AtsLibModule
  ]
})
export class CandidateDayOneFormsModule { }
