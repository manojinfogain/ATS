import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { GetLocationInfo } from 'projects/ats-global-system/src/app/core/common/getLocationInfo';
import { CONSTANTS } from 'projects/ats-global-system/src/app/core/constant/constants';
import { CandidateCommonApiService } from 'projects/ats-global-system/src/app/core/services/candidate-common-api.service';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { InrerviewsService } from 'projects/ats-global-system/src/app/interview-module/inrerviews.service';
import { tcSupportList } from 'projects/ats-global-system/src/app/core/constant/common.const';
import { PartnerService } from '../../../partner.service';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';


@Component({
  selector: 'app-partner-profiles-transfer-or-request-transfer-modal',
  templateUrl: './partner-profiles-req-transfer-modal.component.html',
  styleUrls: ['./partner-profiles-req-transfer-modal.component.scss']
})
export class PartnerProfilesReqTransferModalComponent implements OnInit {
  public requTransferCandidateForm: UntypedFormGroup = new UntypedFormGroup({});
  public currentDevisionId: number;
  public JfCategList: any = CONSTANTS.JfCategList;
  constructor(
    public dialogRef: MatDialogRef<PartnerProfilesReqTransferModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public _fb: UntypedFormBuilder,
    public _share: ShareService,
    private _intServe: InrerviewsService,
    private getLocInfo: GetLocationInfo,
    private _candidateCommon: CandidateCommonApiService,
    private _globalApi: GlobalApisService,
    private _partnerServe: PartnerService,
    private _storage: GetSetStorageService

  ) { }

  ngOnInit(): void {
    console.log(this.data)
    this.getCandidateDetails();
    this.formInit();
    this.updateValidatorLocWise();
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
      this.getControl('DivisionID').clearValidators();
      this.getControl('TCID').clearValidators();
      this.getControl('EmpUnitId').clearValidators();
      this.getControl('gradeBand').clearValidators();
      this.getControl('gradeId').clearValidators();
      this.isVisibleForIndia = false;
    }
    else {

    }
  }


  //formInit
  formInit() {
    this.requTransferCandidateForm = this._fb.group({
      toThId: [null, [Validators.required]],
      remarks: [null],
      DivisionID: [null],
      TCID: [null],
      cluster: [null],
      role: [null],
      cubeClusterId: [null],
      roleId: [null],
      gradeId: [null],
      gradeBand: [null],
      EmpUnitId: null
    });

  }
  //control for form
  getControl(name: string) {
    return this.requTransferCandidateForm.get(name);
  }
  //gt talent cube list
  getTalentCubeList(list:any){
    this.talentCubeList = list;
  }

  // get talent cube Id
  public talentCubeList = [];
  public talentCubeId:number;
  getTCID(e) {
    // this.talentCubeList = e?.talentCubeList;
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
      if(this.data?.cid){
        this.getControl('cluster').addValidators([
          Validators.required,
        ]);
        this.getControl('cubeClusterId').addValidators([
          Validators.required,
        ]);
      }
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
  getCubeClusterID(tcId, tcList): any {
   let gradeId = this.getControl('gradeId')?.value;
    this.filterCubeList = tcList?.filter(r=> r?.CubeId == tcId)[0];
    if(gradeId && tcId){
     this.getRoleByTalentCube(tcId,gradeId);
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

  public isHideForUnttentProfile: boolean = false;
  public isHideGradBand: boolean = false;
  formControlValidation(validation: boolean = true, divisionID: number = null) {
    if (validation) {
      this.isHideForUnttentProfile = true;
      if (this.getLocInfo.isLocationIndia()) {
        this.getControl('DivisionID').setValidators([Validators.required]);
        this.getControl('TCID').setValidators([Validators.required]);
        this.getControl('gradeId').setValidators([Validators.required]);
        this.getControl('EmpUnitId').setValidators([Validators.required]);
        this.getControl('cubeClusterId').setValidators([Validators.required]);
        this.getControl('cluster').setValidators([Validators.required]);
      }

      if (divisionID == 1) {
        if (this.getLocInfo.isLocationIndia()) {
          this.getControl('gradeBand').setValidators([Validators.required]);
        }

      }
      else {
        this.getControl('gradeBand').clearValidators();
        this.getControl('gradeBand').reset();
      }
    }
    else {
      this.getControl('DivisionID').clearValidators();
      this.getControl('TCID').clearValidators();
      this.getControl('EmpUnitId').clearValidators();
      this.getControl('gradeBand').clearValidators();
      this.getControl('gradeId').clearValidators();
      this.getControl('cluster').clearValidators();
      this.getControl('cubeClusterId').clearValidators();
      this.getControl('TCID').reset();
      this.getControl('cubeClusterId').reset();
      this.getControl('roleId').reset();
      this.getControl('EmpUnitId').reset();
      this.getControl('gradeId').reset();
      this.getControl('gradeBand').reset();
      this.isHideForUnttentProfile = false;
    }

    this.getControl('DivisionID').updateValueAndValidity();
    this.getControl('TCID').updateValueAndValidity();
    this.getControl('EmpUnitId').updateValueAndValidity();
    this.getControl('gradeBand').updateValueAndValidity();
    this.getControl('gradeId').updateValueAndValidity();
    this.getControl('cluster').updateValueAndValidity();
    this.getControl('cubeClusterId').updateValueAndValidity();

  }
  /***
     * form set value
     */
  public filteryByCountry: boolean = true;
  public showCtrlForSchCand: boolean = true;
  public isDivsionShow: boolean = true;
  public showSalaryGrid: boolean = false;
  setValueToForm(data) {
    if (this.data?.cid) {
      this.showCtrlForSchCand = true;
      this.isDivsionShow = true;
      this.formControlValidation(true, data?.divisionID);
      this.gradeId = data?.gradeId;
      if (data?.divisionID) {
        this.getDivisionID(data?.divisionID);
      }
      if (data?.EmpUnitId == 5) {
        this.hideFieldsForSupport(data?.EmpUnitId);
      }
      this.requTransferCandidateForm.patchValue({
        DivisionID: data?.divisionID == 0 ? null : data?.divisionID,
        gradeId: data?.gradeId == 0 ? null : data?.gradeId,
        gradeBand: data?.GradeBand == '' ? null : data?.gradeBand,
        TCID: data?.CubeID == 0 ? null : data?.CubeID,
        EmpUnitId: data?.EmpUnitId == 0 ? null : data?.EmpUnitId,
      });
      this.showSalaryGrid = true;
      setTimeout(() => {
        this.getCubeClusterID(data?.CubeID, this.talentCubeList);
      }, 500);
    }
    else {
      this.isDivsionShow = false;
      this.showCtrlForSchCand = false;
      this.formControlValidation(false, data?.divisionID);
    }

  }

  /**get candidate details */
  public candidateData: any = {};
  getCandidateDetails() {
    this._candidateCommon.getCandidateDetailsProfile(this.data?.cid, this.data?.id, this.data?.ProfileSourceId).subscribe(
      res => {
        this.candidateData = res['data'][0];
        this.setValueToForm(this.candidateData);
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
  public DivisionID: number = 1;
  getDivisionID(e) {
    this.DivisionID = e;
    let empUnitId = this.getControl('EmpUnitId')?.value;
    this.showCtrlForSchCand = true
    this.formControlValidation(true, e);
    this.getControl('TCID').reset();
    this.getControl('gradeBand').reset();
    this.getControl('gradeId').reset();

    this.hideFieldsForSupport(empUnitId);
    this.OnTCSelectionValidation(this.talentCubeId);

  }

   // get employee unit Id
   getEmpUnitId(e) {
    let jfId = this.getControl('TCID')?.value;
    let empUnitIdVal = e;
    this.hideFieldsForSupport(empUnitIdVal);
  }

  //hideFields for Supprt job damily
  public showFieldsForDelivery: boolean = true;
  hideFieldsForSupport(empUnitId: number) {
    if (empUnitId == 5) {
      this.showFieldsForDelivery = false;
      this.clearValidators('TCID');
      this.resetControl('TCID');
      this.resetControl('cubeClusterId');
      this.resetControl('roleId');
      this.clearValidators('gradeId');
      this.resetControl('gradeId');
      this.clearValidators('gradeBand');
      this.resetControl('gradeBand');
      this.clearValidators('cubeClusterId');
      this.resetControl('cluster');
      this.clearValidators('cluster');
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


  resetControl(name: string) {
    let ctrl = this.getControl(name);
    ctrl.reset();
  }
  /***
  * get Grade Id
  */
  public gradeId: number = 0;
  getGradeId(e) {
    this.gradeId = e;
    this.getControl('gradeBand').reset();
    let talentCubeId = this.getControl('TCID').value;
    this.getCubeClusterID(talentCubeId, this?.talentCubeList);
  }
  //talentData
  getDataTalent(data) {
    let prvTalentId = this.data.th_id;
    if (prvTalentId == data.TH_ID) {
      this.requTransferCandidateForm.get('toThId').reset();
      this._share.showAlertErrorMessage.next(`${data.TH_ID} is already linked with ${this.data.email}.`);
    }
    else {
      this.requTransferCandidateForm.get('toThId').patchValue(data.TH_ID);
    }

  }

  //sending transfer request method
  requTransferHandler(form: any) {
    debugger
    if (this.requTransferCandidateForm.valid) {
      let formValue = form.value;
      let empId = this._storage.getUserEmpId();
      if (this.data['type'] === 1) {
        formValue['id'] = this.data.id;
        if(this.data?.TransferDirectOrRequest){
          formValue['Action'] = this.data?.TransferDirectOrRequest;
        }
        this._partnerServe.UnattendedCandidateTransferPartner(formValue).subscribe(
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
        formdata.append('thid', formValue['toThId']);
        formdata.append('remarks', formValue['remarks']);
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
        if(this.data?.TransferDirectOrRequest){ 
          formdata.append('Action', this.data?.TransferDirectOrRequest);
        }
        this._partnerServe.transferPratnerCandidateByTalentId(formdata).subscribe(
        // this._intServe.requestTransferCandidate(formValue).subscribe(
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


  /***/
  closeModal(): void {
    this.dialogRef.close();
  }

}
