import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { COMMON_CONST } from 'projects/ats-global-system/src/app/core/constant/common.const';
import { DashboardService } from 'projects/ats-global-system/src/app/dashboard-module/dashboard.service';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { GetLocationInfo } from 'projects/ats-global-system/src/app/core/common/getLocationInfo';
import { InterviewCommonService } from 'projects/ats-global-system/src/app/core/services/interview-common.service';
import { TalentService } from '../../../talent.service';
@Component({
  selector: 'app-fullfillmentdata-update-modal',
  templateUrl: './fullfillmentdata-update-modal.component.html',
  styleUrls: ['./fullfillmentdata-update-modal.component.scss']
})
export class FullfillmentdataUpdateModalComponent implements OnInit {
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
  public IsFullFillmentDateChange:string = 'N';
  displayedColumns = [];
  public talentHistoryList: any = [];
  constructor(
    public dialogRef: MatDialogRef<FullfillmentdataUpdateModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: UntypedFormBuilder,
    public _dashServe: DashboardService,
    private _share: ShareService,
    private _globalApi: GlobalApisService,
    private getLocInfo: GetLocationInfo,
    private _intCommonServe: InterviewCommonService,
    private _talentServe:TalentService
  ) { }

  public gridBucketingList: any = []
  ngOnInit() {
    this.getDetails();
    this.getEmpType();
    this.getGrade()
    this.formInit();
    this.isloader = true;
    this.getTagCommitmentHistory();
  }


  public candidateTypeData: any = [];
  getEmpType() {
    //get cand type
    this._talentServe.GetEmployeeType().subscribe(
      res=>{
        this.candidateTypeData = res['data']
      }
    )
  }


  getTagCommitmentHistory(){
    this._talentServe.GetTagCommitmentHistory(this.data.TH_ID).subscribe(
      res=>{
      this.talentHistoryList = res['data']
      }
    )
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
          if(!this.TalentData?.initial_fullfilment_date){
            this.getReasonList(2);
          }else{            
            this.getReasonList(1);
          }
          this.setDefaultValue(this.TalentData);
        }
      )
    }

    // this._globalApi.getFullfillmentDelayReason().subscribe(
    //   res => {
    //     this.reasonList = res['data'];
    //   }
    // )

    this._globalApi.GetCompRangeBucketMaster().subscribe(
      res => {
        this.gridBucketingList = res['data'];
      }
    )
  }

  /**set default value */

  setDefaultValue(data:any){
    if(data?.FulfillmentGradeId){
      this.getGradeBand(data?.FulfillmentGradeId);
    }
    this.getControl('fullfillmentDate').patchValue(data?.initial_fullfilment_date ? GlobalMethod.formatDate(data?.initial_fullfilment_date) : null);
    this.getControl('CompRange').patchValue(data?.CompRangeId ? data?.CompRangeId : null);
    this.getControl('employmentType').patchValue(data?.FULFILLMENTEmpTypeId ? data?.FULFILLMENTEmpTypeId : null);
    this.getControl('isMandatorySourcing').patchValue(data?.isMandatorySourcing ? data?.isMandatorySourcing : null);
    this.getControl('isEmpReferral').patchValue(data?.isEmpReferral ? data?.isEmpReferral : null);
    this.getControl('fullfillmentGrade').patchValue(data?.FulfillmentGradeId ? data?.FulfillmentGradeId : null);
    this.getControl('fullfillmentCompBand').patchValue(data?.FulfillmentCompBand ? data?.FulfillmentCompBand : null);
  }

  public isReasonIdHide: boolean = false;
  controlSetValue(data: any,changedDate:any) {
    let reasonId = this.getControl('tagRemarkId');
    let remarkTag = this.getControl('remarkTag');
    if (data.initial_fullfilment_date === null) {
      this.isReasonIdHide = false;
      reasonId.clearValidators();
      remarkTag?.clearValidators();
    }
    else {
      let init_ful_date = new Date(data.initial_fullfilment_date);
      if(changedDate < init_ful_date || changedDate > init_ful_date){
        this.isReasonIdHide = true;
        reasonId.setValidators([Validators.required]);
        remarkTag?.setValidators([Validators.required]);
      }else{
        this.isReasonIdHide = false;
        reasonId.clearValidators();
        remarkTag?.clearValidators();
      }
      //  this.getControl('fullfillmentDate').patchValue(new Date(data.initial_fullfilment_date))
    }
    reasonId.updateValueAndValidity();
    remarkTag?.updateValueAndValidity();

  }

  getRecEmpId(e: any) {

  }

  /***
* change date
*/
  changeDate(type: string, event: any) {
    let date = new Date(event.value);
    let init_ful_date = new Date(this.TalentData?.initial_fullfilment_date);
    this.controlSetValue(this.TalentData, date);
    this.IsFullFillmentDateChange = 'Y';
    if(!this.TalentData?.initial_fullfilment_date){      
      this.compareDateWithOnbDate(date)
    }else{
      if(date > init_ful_date || date < init_ful_date){
        this.IsFullFillmentDateChange = 'Y';
      }else{
        this.IsFullFillmentDateChange = 'N';
      }
    }
  }
  public FilterCtrlGrade: UntypedFormControl = new UntypedFormControl();


  public searchInputGrade: string;
  public gradeList: any = [];
  getGrade() {
    this._globalApi.getGradeList().subscribe(
      res => {
        this.gradeList = res['data'];
        this.FilterCtrlGrade.valueChanges.subscribe(
          val => {
            this.searchInputGrade = val;
          }
        );

      }
    );
  }
  getGradeId(e): void {
    this.getGradeBand(e.value);
   
  }
  public gradeBandList: any = [];
  getGradeBand(id: number) {
    this._globalApi.getGradeBandList(id).subscribe(
      res => {
        this.gradeBandList = res['data'];
        if(this.gradeBandList.length === 0){
          this.getControl('gradeBand').clearValidators();
          this.getControl('gradeBand').updateValueAndValidity();
        }
        else{
          this.getControl('gradeBand').setValidators([Validators.required]);
          this.getControl('gradeBand').updateValueAndValidity();
        }
      }
    );
  }
  /***
   * update talentid form submit
   */

  public isLocationIdia: boolean = true;
  formInit() {
    if(this.getLocInfo.isLocationIndiaById(this.data?.LocationID)){
      this.isLocationIdia = true;
      this.updateTalentIdForm = this._fb.group({
        fullfillmentDate: [null,Validators.required],
        tagRemarkId: [null],
        fullfillmentRemark: [null],
        CompRange: [null,Validators.required],
        employmentType: [null,Validators.required],
        isMandatorySourcing: [null,Validators.required],
        isEmpReferral: [null,Validators.required],
        fullfillmentGrade: [null,Validators.required],
        fullfillmentCompBand: [null,Validators.required],
      });

      this.displayedColumns = ['srNo','FullfillmentDate','Reason','Remarks','EmploymentType','GridBucketing','Grade','CompBand','Employeereferral','SourcingfromCompetitors', 'modifiedOn',  'modifiedBy'];
    }
    else{
      this.updateTalentIdForm = this._fb.group({
        fullfillmentDate: [null,Validators.required],
        tagRemarkId: [null],
        fullfillmentRemark: [null]
      })
      this.isLocationIdia = false;
      this.displayedColumns = ['srNo','FullfillmentDate','Reason','Remarks', 'modifiedOn',  'modifiedBy'];
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
      let formData = form.value;
      formData['thId'] = this.TalentData.th_id;
      if (formData['fullfillmentDate']) {
        formData['fullfillmentDate'] = GlobalMethod.formatDate(formData['fullfillmentDate']);
      }
      if (formData['fullfillmentCompBand']) {
        let filterdComp = this.gradeBandList.filter(x => x.ID === formData['fullfillmentCompBand']);
        formData['fullfillmentCompBandFull'] = filterdComp[0]?.Band;
      }
      if (formData['tagRemarkId'] && !this.TalentData?.initial_fullfilment_date) {
        // let filterdComp = this.gradeBandList.filter(x => x.ID === formData['fullfillmentCompBand']);
        formData['ReasonforDelay'] = formData['tagRemarkId'];
        delete formData['tagRemarkId'];
      }
      formData['IsFullFillmentDateChange'] = this.IsFullFillmentDateChange;
      this._talentServe.updateRequisitionDetails(formData).subscribe(
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

  compareDateWithOnbDate(date: any) {
    let onbDate = new Date(this.data?.PlannedOnBoardingDate);
    if (date > onbDate) {
      this.isReasonIdHide = true
      // this.IsFullFillmentDateChange = 'Y';
    }else{      
      this.isReasonIdHide = false
      // this.IsFullFillmentDateChange = 'N';
    }
  }

  // get reasons list based on fullfillment date avaialable or not
  getReasonList(type:number){    
    this._globalApi.getFullfillmentDelayReason(type).subscribe(
      res => {
        this.reasonList = res['data'];
      }
    )
  }

}
