import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-update-address-candidate-modal',
  templateUrl: './update-address-candidate-modal.component.html',
  styleUrls: ['./update-address-candidate-modal.component.scss']
})
export class UpdateAddressCandidateModalComponent implements OnInit {
  public appearance: string = 'fill';
  public formClass: string = 'form-fill-ats';
  group: UntypedFormGroup = new  UntypedFormGroup({});
  
  formColClass:string = 'form-on-col';
  constructor(
    public dialogRef: MatDialogRef<UpdateAddressCandidateModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
  }

  saveAddress(){
    this.group;
  }

  /***
   * close modal
   */
  closeModal(): void {
    this.dialogRef.close();
  }


}
