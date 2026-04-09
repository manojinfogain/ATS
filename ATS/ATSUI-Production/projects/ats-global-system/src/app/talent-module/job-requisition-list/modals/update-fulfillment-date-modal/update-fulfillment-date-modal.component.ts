import { Component, OnInit,Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { TalentService } from '../../../talent.service';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';

@Component({
  selector: 'app-update-fulfillment-date-modal',
  templateUrl: './update-fulfillment-date-modal.component.html',
  styleUrls: ['./update-fulfillment-date-modal.component.scss']
})
export class UpdateFulfillmentDateModalComponent implements OnInit {

  public formUpdateFulfilmentTalent:UntypedFormGroup;

  public disablePastDate: any = new Date(new Date().setDate(new Date().getDate()));
  constructor(
    public dialogRef: MatDialogRef<UpdateFulfillmentDateModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb:UntypedFormBuilder,
    private _share:ShareService,
    private _talentServ: TalentService
  ) { }

  ngOnInit() {
    this.formInit();
   
  }

  formInit(){
    this.formUpdateFulfilmentTalent = this._fb.group({
      fulfilmentDate: [null, [Validators.required]],
      remarks:[null]
     })
  }

  getControl(name: string) {
    return this.formUpdateFulfilmentTalent.get(name);
  }


  /** submit fulfilment*/
  updateFulfillment(form:any){
  this.formUpdateFulfilmentTalent.markAllAsTouched();
    if(this.formUpdateFulfilmentTalent.valid){
       let formValue = form.value;
       let formData = new FormData();
      //  if (formValue.plannedOnBoardingDate) {
      //   formData.append('pOnboardDate', GlobalMethod.formatDate(formValue.plannedOnBoardingDate));
      // }
      let dateFulFill = GlobalMethod.formatDate(formValue.fulfilmentDate)
       this._talentServ.updateThIdDetailsWmg( this.data?.TH_ID, dateFulFill, formValue?.remarks ? formValue?.remarks : '' ).subscribe(
        res=>{
         this._share.showAlertSuccessMessage.next(res); 
         this.dialogRef.close(true);
        }
      )   
      
    }
    else {
      this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
    }

  }

  
  /***
  * close dialog
  */
   closeModal(): void {
    this.dialogRef.close();
  }


}
