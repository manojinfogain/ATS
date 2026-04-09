import { DatePipe } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-form-contro-modal',
  templateUrl: './form-contro-modal.component.html',
  styleUrls: ['./form-contro-modal.component.scss'],
  providers: [DatePipe]
})
export class FormControModalComponent implements OnInit {
   public dateSelectedCtrl:UntypedFormControl = new UntypedFormControl();
   minDate = new Date();
  constructor(
    public dialogRef: MatDialogRef<FormControModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public datepipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.dateSelectedCtrl.addValidators([Validators.required])
  }

  selectDate(){
    if(this.dateSelectedCtrl.valid){
      this.dialogRef.close(this.dateSelectedCtrl.value);
    }

  }
  closeModal(): void {
    this.dialogRef.close();
  }
}
