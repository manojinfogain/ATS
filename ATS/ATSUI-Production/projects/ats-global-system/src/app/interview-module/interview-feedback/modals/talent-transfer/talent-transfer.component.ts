import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { InterviewStatusService } from 'projects/ats-global-system/src/app/core/services/interview-status.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';

@Component({
  selector: 'app-talent-transfer',
  templateUrl: './talent-transfer.component.html',
  styleUrls: ['./talent-transfer.component.scss']
})
export class TalentTransferComponent implements OnInit {
  public userData:any = {};
  public formTransfer:UntypedFormGroup;
  constructor(
    public dialogRef: MatDialogRef<TalentTransferComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _storage:GetSetStorageService,
    private _fb:UntypedFormBuilder,
    private _intStatus:InterviewStatusService,
    private _share:ShareService
  ) { }

  ngOnInit() {
    this.data;
    this.formTransfer = this._fb.group({
      talendIdControl: [null, [Validators.required]],
      remarksTransfer: [null, [Validators.required]],
      telentId:[null]
    })
  }

  getDataTalent(data){
    this.formTransfer.get('telentId').patchValue(data.TH_ID);
   }

  TransferTalent(form:any){
    if(this.formTransfer.valid){
       let formData = form.value;
       formData['cid'] = this.data.cid;
      this._intStatus.updateTalentId(formData).subscribe(
       res=>{
        this._share.showAlertSuccessMessage.next(res.message);
        this.dialogRef.close(true);
       }
      )
    }

  }


  /***
  * close dialog
  */
   closeModal(): void {
    this.dialogRef.close();
  }

}
