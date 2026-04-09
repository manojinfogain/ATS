import { Component, Inject, OnInit } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-view-level-details-modals',
  templateUrl: './view-level-details-modals.component.html',
  styleUrls: ['./view-level-details-modals.component.scss']
})
export class ViewLevelDetailsModalsComponent implements OnInit {

  constructor(
     public dialogRef: MatDialogRef<ViewLevelDetailsModalsComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
         private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

  closeModal(): void {
    this.dialogRef.close();
  }

}
