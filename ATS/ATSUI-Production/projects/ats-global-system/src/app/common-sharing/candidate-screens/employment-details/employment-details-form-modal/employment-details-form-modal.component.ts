import { Component, Inject, OnInit } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-employment-details-form-modal',
  templateUrl: './employment-details-form-modal.component.html',
  styleUrls: ['./employment-details-form-modal.component.scss']
})
export class EmploymentDetailsFormModalComponent implements OnInit {
  public appearance: string = 'fill';
  public formClass: string = 'form-fill-ats'
  constructor(
    public dialogRef: MatDialogRef<EmploymentDetailsFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
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
