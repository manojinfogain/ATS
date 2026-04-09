import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-day1-disclaimer-modal',
  templateUrl: './day1-disclaimer-modal.component.html',
  styleUrls: ['./day1-disclaimer-modal.component.scss']
})
export class Day1DisclaimerModalComponent implements OnInit {  
  public submitOnbForm: UntypedFormGroup = new UntypedFormGroup({});
  constructor( 
    @Inject(MAT_DIALOG_DATA) public data: any,    
    public dialogRef: MatDialogRef<Day1DisclaimerModalComponent>,
    private _fb: UntypedFormBuilder,
  ) { }

  ngOnInit(): void {
    this.data;
    debugger
    this.submitOnbForm = this._fb.group({
      iConfirmedCheck: [null, [Validators.required]]
    })
  }

   getControl(name:string){
    return this.submitOnbForm.get(name);
  }

  /***
  * close dialog
  */
  closeModal(): void {
    this.dialogRef.close(this.submitOnbForm?.value);
  }

}

