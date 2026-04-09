import { Component, Inject, OnInit } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-training-courses-attended-form-modal',
  templateUrl: './training-courses-attended-form-modal.component.html',
  styleUrls: ['./training-courses-attended-form-modal.component.scss']
})
export class TrainingCoursesAttendedFormModalComponent implements OnInit {
  public appearance: string = 'fill';
  public formClass: string = 'form-fill-ats'
  constructor(
    public dialogRef: MatDialogRef<TrainingCoursesAttendedFormModalComponent>,
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
