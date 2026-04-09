import { Component, Inject, OnInit } from '@angular/core';
import { Form, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { InrerviewsService } from 'projects/ats-global-system/src/app/interview-module/inrerviews.service';
import { PartnerService } from 'projects/ats-global-system/src/app/vendor-partner-module/partner.service';
@Component({
  selector: 'app-partner-candidate-transfer-request',
  templateUrl: './partner-candidate-transfer-request.component.html',
  styleUrls: ['./partner-candidate-transfer-request.component.scss']
})
export class PartnerCandidateTransferRequestComponent implements OnInit {
  public requTransferCandidateForm: UntypedFormGroup = new UntypedFormGroup({});
  public talentIdList: any = [];
  public FilterCtrl: UntypedFormControl = new UntypedFormControl();
  public searchInput: string;
  constructor(
    public dialogRef: MatDialogRef<PartnerCandidateTransferRequestComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public _fb: UntypedFormBuilder,
    public _share: ShareService,
    private _intServe: InrerviewsService,
    private _partnerServe: PartnerService

  ) { }

  ngOnInit(): void {
    this.formInit();
    this.getTalentIdListByPartner();
  }

 /***
   * get talent Id List
   */
  getTalentIdListByPartner(): void {
    this._partnerServe.getTalentIdListByPartner().subscribe(
      res => {
        this.talentIdList = res['data'];
        this.FilterCtrl.valueChanges.subscribe(
          val => {
            this.searchInput = val;
          }
        )
      }
    )
  }
  //formInit

  formInit() {
    this.requTransferCandidateForm = this._fb.group({
      toThId: [null, [Validators.required]],
      remarks: [null]
    })
  }

  //talentData
  getDataTalent(data) {
    let prvTalentId = this.data.th_id;
    if (prvTalentId == data.TH_ID) {
      this.requTransferCandidateForm.get('talendIdControl').reset();
      this._share.showAlertErrorMessage.next(`${data.toThId} is already linked with ${this.data.email}.`);
    }
    else {
      this.requTransferCandidateForm.get('toThId').patchValue(data.TH_ID);
    }

  }

  //sending transfer request method
  reqTransferHandler(form: UntypedFormGroup) {
    if (this.requTransferCandidateForm.valid) {
      let formValue = form.value;
      /**by type */
      if(this.data?.type ==1){
        formValue['cid'] = this.data.cid;
        this._partnerServe.requestTransferCandidateByPartner(formValue).subscribe(
          res => {
            this._share.showAlertSuccessMessage.next(res);
            this.dialogRef.close(true);
          }
        )
        
      }
      else if(this.data?.type ==2) {
        formValue['id'] = this.data.id;
        this._partnerServe.UnattendedCandidateTransferRequestByPartner(formValue).subscribe(
          res => {
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

  //control for form
  getControl(name: string) {
    return this.requTransferCandidateForm.get(name);
  }

  /***/
  closeModal(): void {
    this.dialogRef.close();
  }
}
