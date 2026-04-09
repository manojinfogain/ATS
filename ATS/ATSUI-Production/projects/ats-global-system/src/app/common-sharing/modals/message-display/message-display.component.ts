import { Component, Inject, OnInit } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-message-display',
  templateUrl: './message-display.component.html',
  styleUrls: ['./message-display.component.scss']
})
export class MessageDisplayComponent implements OnInit {

  constructor( @Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<MessageDisplayComponent>) { }

  ngOnInit(): void {
    if(this.data?.autoHide){
      setTimeout(() => {
        this.closeModal();
      }, this.data?.duration * 1000);
    }
  }
   /***/

   closeModal(): void {
    this.dialogRef.close();
  }

}
