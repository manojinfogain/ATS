import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { TalentService } from '../../../talent.service';
import { DashboardService } from 'projects/ats-global-system/src/app/dashboard-module/dashboard.service';


@Component({
  selector: 'app-clone-multi-talentid-modal',
  templateUrl: './clone-multi-talentid-modal.component.html',
  styleUrls: ['./clone-multi-talentid-modal.component.scss']
})
export class CloneMultiTalentidModalComponent implements OnInit {

  cloneTalentIdForm: UntypedFormGroup;
  public TalentData: any = {};
  constructor(
    public dialogRef: MatDialogRef<CloneMultiTalentidModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: UntypedFormBuilder,
    public _dashServe: DashboardService,
    public _talentServe: TalentService,
    private _share: ShareService
  ) { }

  ngOnInit() {
    this.getDetails();
    this.formInit();
  }

  /***
   * get Details
   */
  getDetails() {
    if (this.data) {
      this._dashServe.getTalentIdInfo(this.data.TH_ID).subscribe(
        res => {
          let data = res;
          this.TalentData = data[0];
        }
      )
    }

  }


  /***
   * update talentid form submit
   */

  formInit() {
    this.cloneTalentIdForm = this._fb.group({
      Frequency: [null,[Validators.required,Validators.max(40)]]
    })

  }


  //control for form
  getControl(name: string) {
    return this.cloneTalentIdForm.get(name);
  }

  /***
  * close dialog
  */
  closeModal(): void {
    this.dialogRef.close();
  }

  /***
   * submit details  Data to server
   */
  updateTalentIdHandler(form: UntypedFormGroup) {
    this.cloneTalentIdForm.markAllAsTouched();
    if (form.valid) {
      let formData = form.value;
      formData['thId'] = this.TalentData.th_id;
      this._talentServe.TalentIDClone(formData).subscribe(
        res => {
          this._share.showAlertSuccessMessage.next(res);
          this.dialogRef.close(true);
        }
      )
    }
    else {
      this._share.showAlertErrorMessage.next("Please fill all mandatory fields.");
    }
  }

  

}
