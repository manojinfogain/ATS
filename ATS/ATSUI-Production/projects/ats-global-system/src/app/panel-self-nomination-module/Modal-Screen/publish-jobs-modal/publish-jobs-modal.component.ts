import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormBuilder,UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { COMMON_CONST } from 'projects/ats-global-system/src/app/core/constant/common.const';
import { DashboardService } from 'projects/ats-global-system/src/app/dashboard-module/dashboard.service';
import { PanelSelfNominationService } from '../../panel-self-nomination.service';
import { GlobalCommonMethodService } from '../../../core/common/global-common-method.service';

@Component({
  selector: 'app-publish-jobs-modal',
  templateUrl: './publish-jobs-modal.component.html',
  styleUrls: ['./publish-jobs-modal.component.scss']
})
export class PublishJobsModalComponent implements OnInit {
  updateTalentIdForm: UntypedFormGroup;
  commonConst = COMMON_CONST;
  public minDate: any = new Date();
  public reasonList: any = [];
  public TalentData: any = {};
  constructor(
    public dialogRef: MatDialogRef<PublishJobsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: UntypedFormBuilder,
    public _dashServe: DashboardService,
    private _share: ShareService,
    private  _PanelServe:PanelSelfNominationService,
    private _globalCommonMethod:GlobalCommonMethodService
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
    debugger
    this._dashServe.getTalentIdInfo(this.data.thidM).subscribe(
      res => {
        let data = res;
        this.TalentData = data[0];
      }
    )
  }

}

 /***
* change date
*/
mindateEnd = new Date();
changeDateStart(event: any) {
  debugger
  let date = new Date(event.value);
  this.getControl('endDate').reset();
  this.mindateEnd = date;
 
}

  /***
* change date
*/

  changeDate(type: string, event: any) {
    let date = new Date(event.value);
    let init_ful_date = new Date(this.TalentData?.initial_fullfilment_date);
   
  }
  
  /***
   * update talentid form submit
   */

  public isLocationIdia: boolean = true;
  formInit() {
    this.updateTalentIdForm = this._fb.group({
      startDate: [null,Validators.required],
      endDate: [null,Validators.required],
      candidateCount: [null,Validators.required]
    })

    if(this.data?.action == 'U'){
      this.updateTalentIdForm.patchValue({
        startDate: new Date(this.data?.startDate),
        endDate: new Date(this.data?.endDate),
        candidateCount: this.data?.candidateCount
      })
      let localDateEnd =GlobalMethod.convertUTCToLocalDate(this.data?.endDate);
      let startDate =GlobalMethod.convertUTCToLocalDate(this.data?.endDate);
      // s
      // thiss.mindateEnd = new Date(this.data?.endDate);
      if(startDate < new Date()){
        this.getControl('startDate').disable();
      }
    }

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
   * submit details  Data to server
   */
  updateTalentIdHandler(form: UntypedFormGroup) {
    
    this.updateTalentIdForm.markAllAsTouched();
    if (form.valid) {
      // let formData = form.value;
      // formData['thId'] = this.TalentData.th_id;
      let formData1 = form.value;
      let formData = this.updateTalentIdForm.getRawValue();
      debugger
      let body = Object.assign({}, formData);
      if(this.data?.action == 'U'){
        body['id']= this.data?.Id;
      }
      body['thId'] = this.data.thidM;
      body['ActionDateUTC'] = GlobalMethod.convertToUTCDate(new Date());
      body['ActionTimeZone'] = GlobalMethod.getTimezone();
      body['LocationId'] = this._globalCommonMethod.getSetLocation().locId;
      body['startDate'] = GlobalMethod.convertToUTCDate(new Date(formData.startDate));
      body['endDate'] = GlobalMethod.convertToUTCDate(new Date(formData.endDate));
      body['candidateCount'] = formData.candidateCount;
      debugger
      this._PanelServe.jobPosting(body).subscribe(
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
