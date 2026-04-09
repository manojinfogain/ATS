import { Component, Inject, OnInit} from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-form-visible-modal-onb',
  templateUrl: './form-visible-modal-onb.component.html',
  styleUrls: ['./form-visible-modal-onb.component.scss']
})
export class FormVisibleModalOnbComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<FormVisibleModalOnbComponent>,
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
