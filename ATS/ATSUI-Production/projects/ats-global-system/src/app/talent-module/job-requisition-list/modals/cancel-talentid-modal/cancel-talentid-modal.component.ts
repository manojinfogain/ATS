import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { TalentService } from '../../../talent.service';

@Component({
  selector: 'app-cancel-talentid-modal',
  templateUrl: './cancel-talentid-modal.component.html',
  styleUrls: ['./cancel-talentid-modal.component.scss']
})
export class CancelTalentidModalComponent implements OnInit {
  public formCancelTalent: UntypedFormGroup;
  public cancelReasonList: any = [];
  public reasonCategList: any = [];
  public reasonList: any = [];
  constructor(
    public dialogRef: MatDialogRef<CancelTalentidModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: UntypedFormBuilder,
    private _share: ShareService,
    private _talentServ: TalentService
  ) { }

  ngOnInit() {
    this.data;
    debugger
    this.getCancelTalentReasonCateg();
    this.formInit();

  }

  /**get cancel reason category */
  getCancelTalentReasonCateg() {
    this._talentServ.cancelTalentReasonCateg().subscribe(
      res => {
        debugger
        /**for replacement type */
        if (this.data?.ReqTypeID == 3) {
          let filterById = [1, 2, 3];
          let dataRes = res['data'];
          /**showing category Opportunity Lost - 1, Opportunity Scaled Down -2,  Requirement/Scope Change- 3 
           * for replacement type*/
          let filterByStatus = dataRes.filter(t => {
            return filterById.indexOf(t.CateID) === -1;
          });
          this.reasonCategList = filterByStatus
        } else {
          let filterById = [5];
          let dataRes = res['data'];
          let filterByStatus = dataRes.filter(t => {
            return filterById.indexOf(t.CateID) === -1;
          });
          this.reasonCategList = filterByStatus
        }
      }
    )
  }

  /**get cancel reason */
  getCancelTalentReason(id) {
    this._talentServ.cancelTalentReason(id).subscribe(
      res => {
      //  this.reasonList = res['data'];
      let filterById = [6];
      let dataRes = res['data'];
      let filterByStatus = dataRes.filter(t => {
        return filterById.indexOf(t.SubCateID) === -1;
      });
          this.reasonList = filterByStatus;
      }
    )
  }

  formInit() {
    this.formCancelTalent = this._fb.group({
      reasonCategories: [null, [Validators.required]],
      cancelReasonSub: [null, [Validators.required]],
      remarks: [null]
    })
  }

  getControl(name: string) {
    return this.formCancelTalent.get(name);
  }

  /**getting current id of dropdown on selection */
  public projData: any = [];
  getReasonCategId(data: any) {
    //let reasonCategFilteredData = this.reasonCategList.filter(x => x.ProjectID === data.value);
    //this.projData = reasonCategFilteredData[0];
    this.getCancelTalentReason(data?.value);
  }
  /**cancel talent submit */
  cancelTalent(form: any) {
    this.formCancelTalent.markAllAsTouched();
    if (this.formCancelTalent.valid) {
      let formValue = form.value;
      this._talentServ.cancletTalentId(this.data?.TH_ID, formValue?.cancelReasonSub, formValue?.remarks ? formValue?.remarks : '').subscribe(
        res => {
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
