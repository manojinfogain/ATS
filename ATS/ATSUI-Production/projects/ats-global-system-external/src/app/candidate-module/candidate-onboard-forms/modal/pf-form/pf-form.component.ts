import { Component, Inject, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-pf-form',
  templateUrl: './pf-form.component.html',
  styleUrls: ['./pf-form.component.scss']
})
export class PfFormComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<PfFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }


   /***
   * close modal
   */
   closeModal(): void {
    this.dialogRef.close();
  }


}
