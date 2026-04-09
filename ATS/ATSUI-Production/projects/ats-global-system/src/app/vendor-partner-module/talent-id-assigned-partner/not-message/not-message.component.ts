import { Component, Inject, OnInit } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-not-message',
  templateUrl: './not-message.component.html',
  styleUrls: ['./not-message.component.scss']
})
export class NotMessageComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<NotMessageComponent>,
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
