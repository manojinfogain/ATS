import { Component, Input, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { GetLocationInfo } from 'projects/ats-global-system/src/app/core/common/getLocationInfo';
import { CONSTANTS } from 'projects/ats-global-system/src/app/core/constant/constants';
import { CandidateCommonApiService } from 'projects/ats-global-system/src/app/core/services/candidate-common-api.service';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { InrerviewsService } from 'projects/ats-global-system/src/app/interview-module/inrerviews.service';
import { TalentService } from 'projects/ats-global-system/src/app/talent-module/talent.service';
import { tcSupportList } from 'projects/ats-global-system/src/app/core/constant/common.const';
@Component({
  selector: 'app-transfer-candidate-form',
  templateUrl: './transfer-candidate-form.component.html',
  styleUrls: ['./transfer-candidate-form.component.scss']
})
export class TransferCandidateFormComponent implements OnInit {
  public userData: any = {};
  public formTransfer: UntypedFormGroup;
  public today = new Date();
  public maxDate = new Date(this.today.getFullYear() - 10, this.today.getMonth(), this.today.getDate());
  @Input() public formFieldAppearance: string = "legacy";
  public currentDevisionId: number;
  public JfCategList: any = CONSTANTS.JfCategList;
  constructor(
    public dialogRef: MatDialogRef<TransferCandidateFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _storage: GetSetStorageService,
    private _fb: UntypedFormBuilder,
    private _share: ShareService,
    private _intServe: InrerviewsService,
    private getLocInfo: GetLocationInfo,
    private _candidateCommon: CandidateCommonApiService,
    private _globalApi: GlobalApisService,
    private _talentServ: TalentService
  ) { }

  ngOnInit() {
    this.getCandidateDetails();
    this.formInit();
    this.updateValidatorLocWise();
    this._globalApi.getTalentCubeList().subscribe(
      res=>{
        this.talentCubeList = res['data'];
      }
    )
  }

  public isDobVisible: boolean = false;
  public isVisibleForIndia: boolean = false;
  public isDisabled: boolean = true;
  updateValidatorLocWise() {
    if (this.getLocInfo.isLocationIndia()) {
      this.isVisibleForIndia = true;
      this.isDisabled = true;
    }

    else if (this.getLocInfo.isLocationUS()) {
      this.isVisibleForIndia = false;
    }
    else {

    }

  }

  formInit() {
    this.formTransfer = this._fb.group({
      talendIdControl: [null, [Validators.required]],
      remarksTransfer: [null, [Validators.required]],
      telentId: [null],
      DivisionID: [null],
      TCID: [null],
      cluster: [null],
      role: [null],
      cubeClusterId: [null],
      roleId: [null],
      gradeId: [null],
      gradeBand: [null],
      JfCateg: [null],
      EmpUnitId: null,
      practiceId: [null]
    })
  }

  getControl(name: string) {
    return this.formTransfer.get(name);
  }

  public isHideForUnttentProfile: boolean = false;
  public isHideGradBand: boolean = false;
  formControlValidation(validation: boolean = true, divisionID: number = null) {
    if (validation) {
      this.isHideForUnttentProfile = true;
      this.getControl('DivisionID').setValidators([Validators.required]);
      this.getControl('TCID').setValidators([Validators.required]);
      this.getControl('gradeId').setValidators([Validators.required]);
      this.getControl('gradeBand').setValidators([Validators.required]);
      this.getControl('cubeClusterId').setValidators([Validators.required]);
      this.getControl('cluster').setValidators([Validators.required]);

    }
    else {
      this.getControl('DivisionID').clearValidators();
      this.getControl('TCID').clearValidators();
      this.getControl('gradeBand').clearValidators();
      this.getControl('gradeId').clearValidators();
      this.getControl('cluster').clearValidators();
      this.getControl('cubeClusterId').clearValidators();
      this.getControl('TCID').reset();
      this.getControl('cubeClusterId').reset();
      this.getControl('roleId').reset();
      this.getControl('gradeId').reset();
      this.getControl('gradeBand').reset();
      this.isHideForUnttentProfile = false;
    }

    this.getControl('DivisionID').updateValueAndValidity();
    this.getControl('TCID').updateValueAndValidity();
    this.getControl('gradeBand').updateValueAndValidity();
    this.getControl('gradeId').updateValueAndValidity();
    this.getControl('cluster').updateValueAndValidity();
    this.getControl('cubeClusterId').updateValueAndValidity();
  }

  // get talent cube Id
  public talentCubeList = [];
  public talentCubeId:number;
  getTCID(e) {
    this.talentCubeList = e?.talentCubeList;
    this.talentCubeId = e?.selectedVal;
    this.OnTCSelectionValidation(this.talentCubeId);
    this.getCubeClusterID(e?.selectedVal, e?.talentCubeList);
  }

  //To Remove Validation for cluster when TCID is 61
  OnTCSelectionValidation(tcId: any) {
    if (tcSupportList.supportItems.find(x => x === tcId)) {
      this.getControl('cluster').reset();
      this.getControl('cluster').clearValidators();
      this.getControl('cubeClusterId').reset();
      this.getControl('cubeClusterId').clearValidators();;
    } else {
      if (this.getLocInfo.isLocationIndia()) {
        this.getControl('cluster').addValidators([
          Validators.required,
        ]);
        this.getControl('cubeClusterId').addValidators([
          Validators.required,
        ]);
      }
    }
    this.getControl('cluster').updateValueAndValidity();
    this.getControl('cubeClusterId').updateValueAndValidity();
  }

  /**
   *
   * @param e get Cub Cluster Id
   */
  public filterCubeList:any = {};
  getCubeClusterID(tcId, tcList,type:string = 'I'): any {
    if(type == 'I'){
   let gradeId = this.getControl('gradeId')?.value;
    this.filterCubeList = tcList?.filter(r=> r?.CubeId == tcId)[0];
    if(gradeId && tcId){
     this.getRoleByTalentCube(tcId,gradeId);
    }
  }
  else{
    this.filterCubeList = tcList?.filter(r=> r?.CubeId == tcId)[0];
    if(this.talentDetailsList?.TCGradeId && this.talentDetailsList?.TalentCubeId){
     this.getRoleByTalentCube(this.talentDetailsList?.TalentCubeId,this.talentDetailsList?.TCGradeId);
    }
  }
  }

  //get role cluster
//  public RoleTalentCube: any = {};
getRoleByTalentCube(talentCubeCode:number,gradeId:number) {
  this._globalApi.getRoleByTalentCube(talentCubeCode,gradeId).subscribe(
    res => {
      let RoleTalentCube = res['data'][0];
      let cluster = this.getControl('cluster');
      let role = this.getControl('role');
      let cubeClusterId = this.getControl('cubeClusterId');
      let roleId = this.getControl('roleId');
     cluster.patchValue(this.filterCubeList?.ClusterName);
     role.patchValue(RoleTalentCube?.RoleName);
     cubeClusterId.patchValue(this.filterCubeList?.ClusterId);
     roleId.patchValue(RoleTalentCube?.RoleId);
    }
  );
}


  /***
     * form set value
     */
  public filteryByCountry: boolean = true;
  public showCtrlForSchCand: boolean = false;
  public isDivsionShow: boolean = true;
  setValueToForm(data) {
    if (this.data?.cid) {
      this.showCtrlForSchCand = false;
      this.isDivsionShow = true;
      this.formControlValidation(false, data?.divisionID);
    }
    else {
      this.isDivsionShow = false;
      this.showCtrlForSchCand = false;
      this.formControlValidation(false, data?.divisionID);
    }
    this.formTransfer.patchValue({
      DivisionID: data?.divisionID == 0 ? null : data?.divisionID,
      gradeId: data?.gradeId == 0 ? null : data?.gradeId,
      gradeBand: data?.GradeBand == '' ? null : data?.gradeBand,
      TCID: data?.CubeID == 0 ? null : data?.CubeID,
    })
    if (data?.Identity?.id) {
      // this.idValidation(data?.Identity?.id);
    }
    else {

    }
  }
  /**get candidate details */


  public candidateData: any = {};
  getCandidateDetails() {
    // let id= this.data?.cid ? this.data?.cid : this.data?.id
    this._candidateCommon.getCandidateDetailsProfile(this.data?.cid, this.data?.id, this.data?.ProfileSourceId).subscribe(
      res => {
        this.candidateData = res['data'][0];
        this.setValueToForm(this.candidateData);
        // this.updateValidatorLocWise(res);
        this.currentDevisionId = this.candidateData?.divisionID;
      }
    )
  }

  clearValidators(name: string) {
    let ctrl = this.getControl(name);
    ctrl.clearValidators();
    ctrl.updateValueAndValidity();
  }
  /***
 * get Division Id
 */
  public DivisionID: number;
  getDivisionID(e) {
    this.DivisionID = e;
    let empUnitId = this.getControl('EmpUnitId')?.value;
    if (this.currentDevisionId == e) {
      this.showCtrlForSchCand = false;
      this.formControlValidation(false, e);
    }
    else {
      this.showCtrlForSchCand = true
      this.formControlValidation(true, e);
      this.getControl('TCID').reset();
      this.getControl('cubeClusterId').reset();
      this.getControl('roleId').reset();
      this.getControl('gradeId').reset();
      this.getControl('gradeBand').reset();
    }
    this.hideFieldsForSupport(empUnitId);
    this.OnTCSelectionValidation(this.talentCubeId);
  }

  resetControl(name: string) {
    let ctrl = this.getControl(name);
    ctrl.reset();
  }

  public showFieldsForDelivery: boolean = true;
  // get employee unit Id
  getEmpUnitId(e) {
    let empUnitIdVal = e;
    this.hideFieldsForSupport(empUnitIdVal);
  }

  //hideFields for Supprt job damily
  hideFieldsForSupport(empUnitId: number) {
    if (empUnitId == 5) {
      this.showFieldsForDelivery = false;
      this.clearValidators('TCID');
      this.resetControl('TCID');
      this.resetControl('cubeClusterId');
      this.clearValidators('cubeClusterId');
      this.resetControl('cluster');
      this.clearValidators('cluster');
      this.resetControl('roleId');
      this.clearValidators('gradeId');
      this.resetControl('gradeId');
      this.clearValidators('gradeBand');
      this.resetControl('gradeBand');
    } else {
      this.showFieldsForDelivery = true;
      this.getControl('TCID').setValidators([Validators.required]);
      this.getControl('gradeId').setValidators([Validators.required]);
      this.getControl('gradeBand').setValidators([Validators.required]);
      this.getControl('cubeClusterId').setValidators([Validators.required]);
      this.getControl('cluster').setValidators([Validators.required]);
    }
    this.getControl('TCID').updateValueAndValidity();
    this.getControl('gradeId').updateValueAndValidity();
    this.getControl('gradeBand').updateValueAndValidity();
    this.getControl('cubeClusterId').updateValueAndValidity();
    this.getControl('cluster').updateValueAndValidity();
  }

  /***
* get Grade Id
*/
  public gradeId: number = 0;
  getGradeId(e) {
    this.gradeId = e;
    this.getControl('gradeBand').reset();
    this.getCubeClusterID(this.talentCubeId, this?.talentCubeList);
  }
  public talentDetailsList: any = {};
  getDataTalent(data) {

    let prvTalentId = this.data.th_id;
    if (prvTalentId == data.TH_ID) {
      this.formTransfer.get('talendIdControl').reset();
      this._share.showAlertErrorMessage.next(`${data.talentID} is already linked with ${this.data.email}.`);
    }
    else {
      this.formTransfer.get('telentId').patchValue(data.TH_ID);
      if(this.data.cid){
        this._talentServ.GetTHIDDetailsByTHID(data.TH_ID).subscribe(
          res=>{
            this.talentDetailsList = res['data'][0];
            if(this.talentDetailsList?.TalentIdCreatedBy == 'TC'){
               this.showCtrlForSchCand = true;
               if (this.getLocInfo.isLocationIndia()) {
                this.formControlValidation(true, null);
              }

              else if (this.getLocInfo.isLocationUS()) {
                this.formControlValidation(false, null);
              }
              this.gradeId =this.talentDetailsList?.TCGradeId;
              this.getControl('TCID').reset();
              this.getControl('cubeClusterId').reset();
              this.getControl('roleId').reset();
              this.getControl('gradeId').reset();
              this.getControl('gradeBand').reset();
              if (this.getLocInfo.isLocationIndia()) {
                this.getControl('gradeId').patchValue(this.talentDetailsList?.TCGradeId);
              this.getControl('TCID').patchValue(this.talentDetailsList.TalentCubeId?parseInt(this.talentDetailsList.TalentCubeId):null)
              //this.getControl('gradeId').patchValue(this.talentDetailsList?.TCGradeId)

              this.getCubeClusterID(this.talentDetailsList.TalentCubeId,this.talentCubeList);
              }


            }

          }
        )
      }
    }

  }

  TransferTalent(form: any) {
    if (this.formTransfer.valid) {
      let empId = this._storage.getUserEmpId();
      let formValue = form.value;
      if (this.data['type'] === 1) {
        formValue['id'] = this.data.id;
        formValue['IsFromNaukriAPI'] = this.data.IsFromNaukriAPI ? this.data.IsFromNaukriAPI : 'N';
        this._intServe.UnattendedProfileTransfer(formValue).subscribe(
          res => {
            this._share.showAlertSuccessMessage.next(res);
            this.dialogRef.close(true);
          }
        )
      }
      else {
        let formdata = new FormData();
        formdata.append('cid', this.data.cid);
        formdata.append('updateBy', empId);
        formdata.append('thid', formValue.telentId);
        formdata.append('remarks', formValue.remarksTransfer);
        if (formValue.DivisionID) {
          formdata.append('DivisionID', formValue.DivisionID);
        }
        if (formValue.TCID) {
          formdata.append('CubeID', formValue.TCID);
        }
        if (formValue?.cubeClusterId) {
          formdata.append('CubeClusterID', formValue?.cubeClusterId);
        }
        if (formValue?.roleId) {
          formdata.append('CubeRoleID', formValue?.roleId);
        }
        if (formValue.gradeId) {
          formdata.append('gradeId', formValue.gradeId);
        }
        if (formValue.gradeBand) {
          formdata.append('gradeBand', formValue.gradeBand);
        }
        if (formValue?.EmpUnitId) {
          formdata.append('EmpUnitId', formValue?.EmpUnitId);
        }

        this._intServe.shifttoTalentId(formdata).subscribe(
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




  /***
  * close dialog
  */
  closeModal(): void {
    this.dialogRef.close();
  }


}
