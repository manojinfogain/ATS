import { Component, Inject, OnInit } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-interview-message-alert',
  templateUrl: './interview-message-alert.component.html',
  styleUrls: ['./interview-message-alert.component.scss']
})
export class InterviewMessageAlertComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<InterviewMessageAlertComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
  }

   /***
  * close dialog
  */
    closeModal(): void {
      this.dialogRef.close();
    }

}
