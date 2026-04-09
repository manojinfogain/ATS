import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { DashboardService } from '../../dashboard.service';

@Component({
  selector: 'app-assign-candidate-talentid',
  templateUrl: './assign-candidate-talentid.component.html',
  styleUrls: ['./assign-candidate-talentid.component.scss']
})
export class AssignCandidateTalentidComponent implements OnInit {
  public userData:any = {};
  public formTransfer:UntypedFormGroup;
  constructor(
    public dialogRef: MatDialogRef<AssignCandidateTalentidComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _storage:GetSetStorageService,
    private _fb:UntypedFormBuilder,
    private _share:ShareService,
    public _dashServe:DashboardService
  ) { }

  ngOnInit() {
    this.formTransfer = this._fb.group({
      talendIdControl: [null, [Validators.required]],
      remarksTransfer: [null, [Validators.required]],
      telentId:[null]
    })
  }

  getDataTalent(data){
    let prvTalentId = this.data.TalentId;
    if(this.data.transferType === "unmap"){
      this.formTransfer.get('telentId').patchValue(data.TH_ID);
    }
    else if(this.data.transferType === "all"){
      this.formTransfer.get('telentId').patchValue(data.TH_ID);
    }
    else{
      if(prvTalentId == data.talentID){
        this.formTransfer.get('talendIdControl').reset();
        this._share.showAlertErrorMessage.next(data.talentID+' is already assigned.Please choose different one.');
      }
      else{
        this.formTransfer.get('telentId').patchValue(data.talentID);
      }
     // this.formTransfer.get('telentId').patchValue(data.talentID);
    }
    
   }

  TransferTalent(form:any){
    if(this.formTransfer.valid){
      let empId = this._storage.getUserEmpId();
       let formValue = form.value;
       let formdata =  new FormData();
       formdata.append('id',this.data.id);
       formdata.append('AddedBy',empId);
       formdata.append('thid',formValue.telentId);
       formdata.append('Remarks',formValue.remarksTransfer);
       /***
        * for unmap Employee referal profile
        */
       if(this.data.transferType === "unmap"){
        formdata.append('ProfileId',this.data.profileid);
        this._dashServe.maptoTalentId(formdata).subscribe(
          res=>{
           this._share.showAlertSuccessMessage.next(res); 
           this.dialogRef.close(true);
          }
        )
       }

       else if(this.data.transferType === "all"){
        formdata.append('ProfileId',this.data?.SourceID);
        this._dashServe.maptoTalentId(formdata).subscribe(
          res=>{
           this._share.showAlertSuccessMessage.next(res); 
           this.dialogRef.close(true);
          }
        )
       }
       else{
         /***
          * for  unsed cskill profile
          */
        this._dashServe.shifttoTalentId(formdata).subscribe(
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


  /***
  * close dialog
  */
   closeModal(): void {
    this.dialogRef.close();
  }


}
