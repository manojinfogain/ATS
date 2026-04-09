import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { InrerviewsService } from 'projects/ats-global-system/src/app/interview-module/inrerviews.service';
import { OfferService } from '../../offer.service';
import { TalentService } from '../../../talent-module/talent.service';
import { GlobalApisService } from '../../../core/services/global-apis.service';
@Component({
  selector: 'app-selected-candidate-transfer-modal',
  templateUrl: './selected-candidate-transfer-modal.component.html',
  styleUrls: ['./selected-candidate-transfer-modal.component.scss']
})
export class SelectedCandidateTransferModalComponent implements OnInit {
  public userData:any = {};
  public formTransfer:UntypedFormGroup;
  constructor(
    public dialogRef: MatDialogRef<SelectedCandidateTransferModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb:UntypedFormBuilder,
    private _share:ShareService,
    private _offerServe:OfferService,    
    private _talentServ: TalentService,
    private _globalApiServe: GlobalApisService
  ) { }

  ngOnInit() {
    if(this.data?.callType == 2){
      this.getReasonsToReopen();
    }
    this.formTransfer = this._fb.group({
      talendIdControl: [null, [Validators.required]],
      remarks: [null],
      ReopeningReason: [null],
      thid:[null]
    })
  }

  getDataTalent(data){
    let prvTalentId = this.data.th_id;
    if(prvTalentId == data.TH_ID){
      this.formTransfer.get('talendIdControl').reset();
      this._share.showAlertErrorMessage.next(`${data.talentID} is already linked with ${this.data.email}.`);
    }
    else{
      this.formTransfer.get('thid').patchValue(data.TH_ID);
    }
    
   }

  TransferTalent(form:any){
    if(this.formTransfer.valid){
       let formValue = form.value;
      //  formValue['cid'] = this.data.cid;
      //  delete formValue['talendIdControl'];
      //  this._offerServe.transferSelectedCandidateByTalentId(formValue).subscribe(
      //   res=>{
      //    this._share.showAlertSuccessMessage.next(res); 
      //    this.dialogRef.close(true);
      //   }
      // )   
      if(this.data?.callType == 2){        
        formValue['prevthid'] = this.data?.prevthid;
        formValue['newthid'] = formValue['thid'];
        delete formValue['talendIdControl'];
        delete formValue['thid'];
        delete formValue['remarks'];
        this._talentServ.ReopenTransferTalentIdNonReinitiation(formValue).subscribe(
          res=>{
          this._share.showAlertSuccessMessage.next(res); 
          this.dialogRef.close(true);
          }
        )  
      }else{
        formValue['cid'] = this.data.cid;
        delete formValue['talendIdControl'];
        delete formValue['ReopeningReason'];
        this._offerServe.transferSelectedCandidateByTalentId(formValue).subscribe(
          res=>{
          this._share.showAlertSuccessMessage.next(res); 
          this.dialogRef.close(true);
          }
        )   
      }      
      
    }
    else {
      this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
    }

  }

  public reasonList: any = [];
  getReasonsToReopen() {
    this._globalApiServe.GetTalentReopenningRemarksList().subscribe(
      res => {
        this.reasonList = res['data'];
      }
    )
  }


  /***
  * close dialog
  */
   closeModal(): void {
    this.dialogRef.close();
  }

}
