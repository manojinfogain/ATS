import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { TalentCONSTANTS } from 'projects/ats-global-system/src/app/core/constant/talent.const';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { TalentService } from '../../../talent.service';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { COMMON_CONST } from 'projects/ats-global-system/src/app/core/constant/common.const';
import { DashboardService } from 'projects/ats-global-system/src/app/dashboard-module/dashboard.service';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';


@Component({
  selector: 'app-activate-dormant-tid-modal',
  templateUrl: './activate-dormant-tid-modal.component.html',
  styleUrls: ['./activate-dormant-tid-modal.component.scss']
})
export class ActivateDormantTidModalComponent implements OnInit {
  statius: boolean = true;
  activateDormantTidForm: UntypedFormGroup;
  commonConst = COMMON_CONST;
  public statusList: any = [];
  imgFile: any;
  imgSrc: any;
  public isloader: boolean = false;
  public minDate: any = new Date();
  public reasonList: any = [];
  public TalentData: any = [];
  public disablePastDate: any = new Date(new Date().setDate(new Date().getDate()));
  constructor(
    public dialogRef: MatDialogRef<ActivateDormantTidModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: UntypedFormBuilder,
    public _dashServe: DashboardService,
    private _share: ShareService,
    private _talentServe:TalentService
  ) { }

  ngOnInit() {
    this.getDetails();
    this.getReasonsForActivation();
    this.formInit();
    this.isloader = true;
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
   * get reasons for activation
   */
  public activatingReasonsList: any = [];
  getReasonsForActivation() {
    if (this.data) {
      this._talentServe.GetTalentUndormantReasons().subscribe(
        res => {
          this.activatingReasonsList = res['data'];
        }
      )
    }

  }



  getRecEmpId(e: any) {

  }



  /***
   * update talentid form submit
   */

  formInit() {
    this.activateDormantTidForm = this._fb.group({
      revisedOnbDate: [null,[Validators.required]],
      revisedBillingSDate: [null],
      reasonToActivateId: [null],
    });
  }


  //control for form
  getControl(name: string) {
    return this.activateDormantTidForm.get(name);
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
  activateTalentIdHandler(form: UntypedFormGroup) {
    this.activateDormantTidForm.markAllAsTouched();
    if (form.valid) {
      let formData = form.value;
      // formData['thId'] = this.TalentData.th_id;
      let body = {
        "THID": this.TalentData.th_id,
        "RevisedOnbDate": GlobalMethod.formatDate(formData.revisedOnbDate),
        "UndormantReason": formData.reasonToActivateId,
        "RevisedBillingDate": GlobalMethod.formatDate(formData.revisedBillingSDate)
      };
// THID=${data?.THID ? data?.THID : ''}&RevisedOnbDate=${data?.RevisedOnbDate ? data?.RevisedOnbDate : ''}&UndormantReason=${data?.UndormantReason ? data?.UndormantReason : ''}&RevisedBillingDate =${data?.RevisedBillingDate  ? data?.RevisedBillingDate  : ''}`
      this._talentServe.UndormantTalentIDByTHID(body).subscribe(
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

  public minDatebilling = new Date();
  changeDate(type: string, event: any) {
    this.getControl('revisedBillingSDate').reset();
    let date = new Date(event.value);
    this.minDatebilling = new Date(event.value);
    // let date = new Date(event.value);
    // let init_ful_date = new Date(this.TalentData?.initial_fullfilment_date);
    // this.controlSetValue(this.TalentData, date);
    // this.IsFullFillmentDateChange = 'Y';
    // if(!this.TalentData?.initial_fullfilment_date){      
    //   this.compareDateWithOnbDate(date)
    // }else{
    //   if(date > init_ful_date || date < init_ful_date){
    //     this.IsFullFillmentDateChange = 'Y';
    //   }else{
    //     this.IsFullFillmentDateChange = 'N';
    //   }
    // }
  }

  /**control */
  // getControl(name: string) {
  //   return this.activateDormantTidForm.get(name);
  // }

}
