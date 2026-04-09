import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
@Component({
  selector: 'app-offer-generation-confirmation-modal',
  templateUrl: './offer-generation-confirmation-modal.component.html',
  styleUrls: ['./offer-generation-confirmation-modal.component.scss']
})
export class OfferGenerationConfirmationModalComponent implements OnInit {
  public optionCtrl:UntypedFormControl = new UntypedFormControl('A');
  constructor(
    public dialogRef: MatDialogRef<OfferGenerationConfirmationModalComponent>,
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
