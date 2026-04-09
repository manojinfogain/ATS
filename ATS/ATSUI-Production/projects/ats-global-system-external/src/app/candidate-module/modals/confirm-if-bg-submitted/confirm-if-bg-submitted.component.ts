 import { Component, Inject, OnInit } from '@angular/core';
 import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
 import { CandidateService } from '../../../candidate-module/candidate.service';
 import { Router } from '@angular/router';
 // import { SidebarService } from 'src/app/core/services/sidebar.service'; // Adjust path as per your project
 
 @Component({
  selector: 'app-confirm-if-bg-submitted',
  templateUrl: './confirm-if-bg-submitted.component.html',
  styleUrls: ['./confirm-if-bg-submitted.component.scss']
})
export class ConfirmIfBgSubmittedComponent implements OnInit {
 
   constructor(
     public dialogRef: MatDialogRef<ConfirmIfBgSubmittedComponent>,
     @Inject(MAT_DIALOG_DATA) public data: any,
     private router: Router,
   ) { }
 
   ngOnInit(): void {
   }
 
   submitConsent(): void {
     // this._candidateServe.declarationSubmit().subscribe();
     // Set the sidebar menu selection
     // this.sidebarService.setSelectedMenu('employment-application-form');
     // Navigate to the employment application form route
     if( this.data?.src === 'BGV') {
       this.router.navigate(['/employment-application-form']);
     } else {
     this.router.navigate(['/upload-bgv-documents']);
     }
     this.dialogRef.close(true);
   }
   closeModal(): void {
     this.dialogRef.close();
   }
 
 }
 