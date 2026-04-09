import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { COMMON_CONST } from 'projects/ats-global-system/src/app/core/constant/common.const';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { PanelSelfNominationService } from '../../../panel-self-nomination.service';
import { GlobalCommonMethodService } from 'projects/ats-global-system/src/app/core/common/global-common-method.service';

@Component({
  selector: 'app-addupdate-panel-screen',
  templateUrl: './addupdate-panel-screen.component.html',
  styleUrls: ['./addupdate-panel-screen.component.scss']
})
export class AddupdatePanelScreenComponent implements OnInit {
  PanelistAdditionForm: UntypedFormGroup;
  commonConst = COMMON_CONST;
  public gradeList: any = [];
  public FilterCtrlGrade: UntypedFormControl = new UntypedFormControl();
  public searchInputGrade: string;
  public FilterCtrlEmp: UntypedFormControl = new UntypedFormControl();
  public searchInputEmp: string;
  constructor(
    public dialogRef: MatDialogRef<AddupdatePanelScreenComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: UntypedFormBuilder,
    private _share: ShareService,
    private _globalApiServe: GlobalApisService,
    private  _PanelServe:PanelSelfNominationService,
    private _globalCommonMethod:GlobalCommonMethodService
  ) { }

  public gridBucketingList: any = []
  public isEmpDroDown: boolean = true;
  public empListPanel: any = [];
  ngOnInit() {
    this.formInit();
    let paramE:any ={
      page:1,
      pageSize:10000,
      search:null
    }
    this._PanelServe.getEmpListForPanelAddition(paramE).subscribe(
      res=>{
       this.empListPanel = res['data'];
       this.FilterCtrlEmp.valueChanges.subscribe(
        val => {
          this.searchInputEmp = val;
        }
      );
      }
    )
    this._globalApiServe.getGradeList().subscribe((res: any) => {
      this.gradeList = res['data'];
      this.FilterCtrlGrade.valueChanges.subscribe(
        val => {
          this.searchInputGrade = val;
        }
      );
    });
  }
 public filterEmp:any ={}
  getDataEmp(e:any){
    let empId: string = e.value;
    this._PanelServe.getEmpDetails(empId).subscribe(
      res=>{
        this.filterEmp = res['data'][0];
        debugger
        this.getControl('gradeId').patchValue(this.filterEmp?.gradeName?this.filterEmp?.gradeName:'');
        this.getControl('AccountId').patchValue(this.filterEmp?.accountName?this.filterEmp?.accountName:'');
        this.getControl('Skills').patchValue(this.filterEmp?.skills?this.filterEmp?.skills:'');
        this.getControl('exp').patchValue(this.filterEmp?.EMP_INDEXP_YRS+ 'Years '+this.filterEmp?.EMP_INDEXP_MTH+'Months');
      }
    )
  }

  /***
   * update talentid form submit
   */

  formInit() {

    this.PanelistAdditionForm = this._fb.group({
      PanelEmpId: [null, Validators.required],
      AccountId: [null],
      Skills: [null],
      gradeId:[null],
      exp:[null],
    });
    if(this.data?.action == 'U'){
      this.getControl('PanelEmpId').clearValidators();
      this.getControl('PanelEmpId').updateValueAndValidity();
      this.isEmpDroDown = false;
      debugger
      let AccountIds = [];
      let SkillIds = [];
      if(this.data?.AccountIds != null){
         AccountIds = this.data?.AccountIds?.split(',').map(Number);;
      }
      if(this.data?.SkillIds!= null){
        SkillIds = this.data?.SkillIds?.split(',').map(Number);;
     }
      
      this.PanelistAdditionForm.patchValue({
        PanelEmpId: this.data?.PanelEmpId,
        AccountId: AccountIds,
        Skills:SkillIds,
        gradeId: this.data?.GradeIdName
      
      });
    }
  }

  

  //control for form
  getControl(name: string) {
    return this.PanelistAdditionForm.get(name);
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
 submitPanelDetails(form: UntypedFormGroup) {
    this.PanelistAdditionForm.markAllAsTouched();
    debugger
    if (form.valid) {
      let formData = form.value;
      let body = Object.assign({}, formData);
      body['id']= 0;
      if(this.data?.action == 'U'){
        body['id']= this.data?.Id;
        body['PanelEmpId'] = this.data?.PanelEmpId;
      }
      body['ActionDateUTC'] = GlobalMethod.convertToUTCDate(new Date());
      body['ActionTimeZone'] = GlobalMethod.getTimezone();
      body['LocationId'] = this._globalCommonMethod.getSetLocation().locId;
      // if(formData['AccountId'].length !=0){
      //   let AccoundIds = formData['AccountId']?.filter(n => n);
      //   body['AccountId'] = AccoundIds.toString();
      // }
      // if(formData['Skills'].length !=0){
      //   let AccoundIds = formData['Skills']?.filter(n => n);
      //   body['Skills'] = AccoundIds.toString();
      // }
      delete body['gradeId'];
      delete body['Skills'];
      delete body['AccountId'];
      delete body['exp'];
      this._PanelServe.addUpdatePanelDetails(body).subscribe((res: any) => {
        this._share.showAlertSuccessMessage.next(res);
        this.dialogRef.close(true);
        
      });
    }
    else {
      this._share.showAlertErrorMessage.next("Please fill all mandatory fields.");
    }
  }


}
