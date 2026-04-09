import { Component, Inject, OnInit } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-confirmation-dailog-naukri',
  templateUrl: './confirmation-dailog-naukri.component.html',
  styleUrls: ['./confirmation-dailog-naukri.component.scss']
})
export class ConfirmationDailogNaukriComponent{
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDailogNaukriComponent>,
    @Inject(MAT_DIALOG_DATA) @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
}