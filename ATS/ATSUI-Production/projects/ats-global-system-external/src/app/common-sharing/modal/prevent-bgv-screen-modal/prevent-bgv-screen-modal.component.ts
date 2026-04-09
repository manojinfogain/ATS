import { Component, Inject, OnInit } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-prevent-bgv-screen-modal',
  templateUrl: './prevent-bgv-screen-modal.component.html',
  styleUrls: ['./prevent-bgv-screen-modal.component.scss']
})
export class PreventBgvScreenModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<PreventBgvScreenModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  submitConsent(): void {
    // Navigate to the employment application form route
    this.router.navigate(['/employment-application-form']);
    this.dialogRef.close(true);
  }
  closeModal(): void {
    this.dialogRef.close();
  }

}
