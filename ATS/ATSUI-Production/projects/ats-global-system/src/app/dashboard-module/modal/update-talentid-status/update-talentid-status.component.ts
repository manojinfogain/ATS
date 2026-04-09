import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms'
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { COMMON_CONST, FILE_UPLOAD } from 'projects/ats-global-system/src/app/core/constant/common.const';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { DashboardService } from '../../dashboard.service';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
@Component({
  selector: 'app-update-talentid-status',
  templateUrl: './update-talentid-status.component.html',
  styleUrls: ['./update-talentid-status.component.scss']
})
export class UpdateTalentidStatusComponent implements OnInit {
  statius: boolean = true;
  updateTalentIdForm: UntypedFormGroup;
  commonConst = COMMON_CONST;
  public statusList: any = [];
  imgFile: any;
  imgSrc: any;
  public isloader: boolean = false;
  public minDate: any = new Date();
  public reasonList: any = [];
  public TalentData: any = [];
  constructor(
    public dialogRef: MatDialogRef<UpdateTalentidStatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: UntypedFormBuilder,
    public _dashServe: DashboardService,
    private _share: ShareService,
    private _globalApi: GlobalApisService
  ) { }

  ngOnInit() {
    this.getDetails();
    this.formInit();
    this.isloader = true;
  }

  /***
   * get Details
   */
  getDetails() {
    if (this.data) {
      this._dashServe.getTalentIdInfo(this.data.th_id).subscribe(
        res => {
          let data = res;
          this.TalentData = data[0];
        }
      )
    }

    this._globalApi.getFullfillmentDelayReason().subscribe(
      res => {
        this.reasonList = res['data'];
        console.log("reason", res['data'])
      }
    )
  }

  public isReasonIdHide: boolean = false;
  controlSetValue(data: any) {
    let reasonId = this.getControl('tagRemarkId');
    if (data.initial_fullfilment_date === null) {
      this.isReasonIdHide = false;
      reasonId.clearValidators();
    }
    else {
      this.isReasonIdHide = true;
      reasonId.setValidators([Validators.required]);
      //  this.getControl('fullfillmentDate').patchValue(new Date(data.initial_fullfilment_date))
    }
    reasonId.updateValueAndValidity();

  }

  getRecEmpId(e: any) {

  }

  /***
* change date
*/
  changeDate(type: string, event: any) {
    let date = new Date(event.value);
    this.controlSetValue(this.TalentData);
  }

  /***
   * update talentid form submit
   */

  formInit() {
    this.updateTalentIdForm = this._fb.group({
      fullfillmentDate: [null],
      prRecEmpId: [null],
      srRecEmpId: [null],
      tagRemarkId: [null],
      // tagRemarkId: [null]
    })

  }


  //control for form
  getControl(name: string) {
    return this.updateTalentIdForm.get(name);
  }

  /***
  * close dialog
  */
  closeModal(): void {
    this.dialogRef.close();
  }

  /***
   * submit form Data
   */
  updateTalentIdHandler(form: UntypedFormGroup) {
    this.updateTalentIdForm.markAllAsTouched();
    if (form.valid) {
      let formData = form.value;
      formData['thId'] = this.TalentData.th_id;
      if (formData['fullfillmentDate']) {
        formData['fullfillmentDate'] = GlobalMethod.formatDate(formData['fullfillmentDate']);
      }
      this._dashServe.updateRequisitionDetails(formData).subscribe(
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

  /**
 * get new val
 * @param cg 
 */
  getDirtyValues(cg: any) {
    const dirtyValues = {};
    Object.keys(cg.controls).forEach(c => {
      const currentControl = cg.get(c);
      if (currentControl.dirty) {
        dirtyValues[c] = currentControl.value;
      }
    });
    return dirtyValues;
  }

}
