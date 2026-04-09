import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
@Component({
  selector: 'app-resend-or-revise-offer-confirm-modal',
  templateUrl: './resend-or-revise-offer-confirm-modal.component.html',
  styleUrls: ['./resend-or-revise-offer-confirm-modal.component.scss']
})
export class ResendOrReviseOfferConfirmModalComponent implements OnInit {
  public optionCtrl:UntypedFormControl = new UntypedFormControl('RV');
  constructor(
    public dialogRef: MatDialogRef<ResendOrReviseOfferConfirmModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
  }

  continue():void{
   this.dialogRef.close(this.optionCtrl.value);
  }


  closeModal(): void {
    this.dialogRef.close(false);
  }
}
