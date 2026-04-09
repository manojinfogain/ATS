import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { PartnerService } from 'projects/ats-global-system/src/app/vendor-partner-module/partner.service';

@Component({
  selector: 'app-transfer-candidate-modal',
  templateUrl: './transfer-candidate-modal.component.html',
  styleUrls: ['./transfer-candidate-modal.component.scss']
})
export class TransferCandidateModalComponent implements OnInit {

 
  public userData: any = {};
  public TalentData: any = []
  public partnerList: any = [];
  public searchInput: string;
  public FilterCtrl: UntypedFormControl = new UntypedFormControl();
  public formTransfer: UntypedFormGroup;
  constructor(
    public dialogRef: MatDialogRef<TransferCandidateModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _storage: GetSetStorageService,
    private _fb: UntypedFormBuilder,
    private _share: ShareService,
    private _partnerServe: PartnerService
  ) { }

  ngOnInit() {
   // this.getTalentIdListByPartner();
    this.formInit();
  }

  //form Init
  formInit() {
    this.formTransfer = this._fb.group({
      toThId: [null, [Validators.required]],
      remarksTransfer: [null],
    })
  }



  //form Controls
  getControl(name: string) {
    return this.formTransfer.get(name);
  }

  /***
   * get talent Id List
   */
  // getTalentIdListByPartner(): void {
  //   this._partnerServe.getTalentIdListByPartner().subscribe(
  //     res => {
  //       this.partnerList = res['data'];
  //       
  //       console.log("data1", res['data'])
  //       this.FilterCtrl.valueChanges.subscribe(
  //         val => {
  //           this.searchInput = val;
  //         }
  //       )
  //     }
  //   )
  // }

  //transfer handler
  TransferTalent(form: any) {
    if (this.formTransfer.valid) {
      let formValue = form.value;
      formValue['id'] = this.data.id;
   //   if (this.data.type === 1) {
        this._partnerServe.UnattendedCandidateTransfer(formValue).subscribe(
          res => {
            this._share.showAlertSuccessMessage.next(res);
            this.dialogRef.close(true);
          }
        )
     // }
      // else {
      //   this._partnerServe.transferUnattendedProfileByPartner(formValue).subscribe(
      //     res => {
      //       this._share.showAlertSuccessMessage.next(res);
      //       this.dialogRef.close(true);
      //     }
      //   )
      // }


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
