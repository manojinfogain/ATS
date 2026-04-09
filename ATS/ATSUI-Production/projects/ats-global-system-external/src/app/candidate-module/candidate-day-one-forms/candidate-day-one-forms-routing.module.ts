import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CandidateDayOneFormsComponent } from './candidate-day-one-forms/candidate-day-one-forms.component';
import { AppointmentLetterConsentComponent } from './appointment-letter-consent/appointment-letter-consent.component';
import { UploadPendingDocumentsComponent } from './upload-pending-documents/upload-pending-documents.component';

const routes: Routes = [
  {
    path: 'day1-form',
    component:CandidateDayOneFormsComponent,
    data: {title:'Day1 Form'}
  },
  {
    path: 'appointment-letter-consent',
    component:AppointmentLetterConsentComponent,
    data: {title:'Appointment Letter Consent'}
  },

  {
    path: 'upload-pending-documents',
    component:UploadPendingDocumentsComponent,
    data: {title:'Upload Pending Documents'}
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CandidateDayOneFormsRoutingModule { }
