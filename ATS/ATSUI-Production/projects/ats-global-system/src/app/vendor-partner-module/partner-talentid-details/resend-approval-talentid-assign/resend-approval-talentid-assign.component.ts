import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { Router } from '@angular/router';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { COMMON_CONST } from 'projects/ats-global-system/src/app/core/constant/common.const';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { GlobalApisService } from '../../../core/services/global-apis.service';
import { PartnerService } from '../../partner.service';
import { NotMessageComponent } from '../../talent-id-assigned-partner/not-message/not-message.component';
import { GetLocationInfo } from '../../../core/common/getLocationInfo';
import { CONSTANTS } from '../../../core/constant/constants';

@Component({
  selector: 'app-resend-approval-talentid-assign',
  templateUrl: './resend-approval-talentid-assign.component.html',
  styleUrls: ['./resend-approval-talentid-assign.component.scss']
})
export class ResendApprovalTalentidAssignComponent implements OnInit {
  public assignTalentForm: UntypedFormGroup = new UntypedFormGroup({});
  public partnerList: any = [];
  public FilterCtrl: UntypedFormControl = new UntypedFormControl([]);
  public searchInput: string;
  public reasonForAssingList: any = [];
  public salaryTypeList: any = CONSTANTS.salaryType;
  public remoteStatusList: any = [];
  constructor(
    public dialogRef: MatDialogRef<ResendApprovalTalentidAssignComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: UntypedFormBuilder,
    private _share: ShareService,
    private _partnerServe: PartnerService,
    private _router: Router,
    private _globalServe: GlobalApisService,
    public dialog: MatDialog,
    private getLocInfo: GetLocationInfo
  ) { }
  ngOnInit(): void {
    this.formInit();
    this.showHideLocWise();
    
  }

  // location wise check
  public isLocationUS: boolean = false;
  public isLocationIndia: boolean = false;
  showHideLocWise() {
   if (this.getLocInfo.isLocationIndia()) {
     this.isLocationIndia = true;
     this.isLocationUS = false;
   } else if (this.getLocInfo.isLocationUS()) {
     this.isLocationIndia = false;
     this.isLocationUS = true;
   }
   
   this.getReasonForAssignList();
   this.getContractList();
   this.getTagHeadApproverList();
   this.formValidationLocWise();

   this._globalServe.getRemoteStatusList().subscribe(
    res=>{
      this.remoteStatusList = res['data'];
    })

    this.setValue();
 }

 public BasePayLabel:string = 'Max Rate';
 selectSalaryType(e: any) {
   let val = e.value;
   this.lableChanged(val);
 
 }

 lableChanged(val: number ){
  if(val === 1){
    this.BasePayLabel = 'Max Rate (Annual)';
  }
  else if(val === 2){
    this.BasePayLabel = 'Max Rate (Monthly)';
  }
  else if(val === 3){
    this.BasePayLabel = 'Max Rate (Hourly)';
  }
 }

 setValue(){
  if (this.data) {
    this.lableChanged(this.data?.salaryTypeId);
    debugger
    this.GetPartnerTalentContractType();
    this.assignTalentForm.patchValue({
      PartnerIDs: this.data?.PartnerID,
      reasonid: this.data?.reasonid,
       candidateType:[3],
      TAGLeadID: this.data?.ApproverID,
      thid: this.data?.talent_id,
      SalaryType: this.data?.salaryTypeId?this.data?.salaryTypeId:null,
      basePay:this.data?.basePay,
      workingRemoteStatus: this.data?.RemoteStatusId?this.data?.RemoteStatusId:null
    })
  }
 }

 /***
   * form validation location wise
   */

 formValidationLocWise(){
  if(this.isLocationIndia){
    this.getControl('SalaryType').reset();
    this.getControl('basePay').reset();
    this.getControl('workingRemoteStatus').reset();
    this.getControl('SalaryType').clearValidators();
    this.getControl('basePay').clearValidators();
    this.getControl('workingRemoteStatus').clearValidators();
    
  }
  else if(this.isLocationUS){
    this.getControl('SalaryType').setValidators([Validators.required]);
    this.getControl('basePay').setValidators([Validators.required]);
    this.getControl('workingRemoteStatus').setValidators([Validators.required]);
  }
  else{
    this.getControl('SalaryType').reset();
    this.getControl('basePay').reset();
    this.getControl('workingRemoteStatus').reset();
    this.getControl('SalaryType').clearValidators();
    this.getControl('basePay').clearValidators();
    this.getControl('workingRemoteStatus').clearValidators();
  
  }
  this.getControl('SalaryType').updateValueAndValidity();
  this.getControl('basePay').updateValueAndValidity();
  this.getControl('workingRemoteStatus').updateValueAndValidity();

}

  GetPartnerTalentContractType(){
    let param = `thid=${this.data.thid}&partnerId=${this.data.PartnerID}`;
    this._partnerServe.GetPartnerTalentContractType(param).subscribe(
      res=>{
        let data = res['data'];
        let tempArrr = [];
        for(let i=0; i<data.length; i++){
          tempArrr.push(data[i]?.ContractType)
        }
        if(tempArrr.length!=0){
          this.assignTalentForm.get('candidateType').patchValue(tempArrr)
        }
       
      }
    )
  }

  public FilterCtrlTAG: UntypedFormControl = new UntypedFormControl();
  public tagHeadList: any = [];
  getTagHeadApproverList() {
    let locId:number = 0;
    if(this.isLocationUS){
      locId = 3;
    }
    else{
      locId = 1;
    }
    this._partnerServe.getPartnerTagLeadApproverByLoc(locId).subscribe(
      res => {
        this.tagHeadList = res['data']
        this.FilterCtrlTAG.valueChanges.subscribe(
          val => {
            this.searchInput = val;
          }
        )
      }
    )
  }

  formInit() {
    this.assignTalentForm = this._fb.group({
      PartnerIDs: [null, [Validators.required]],
      reasonid: [null, [Validators.required]],
      thid: [null, [Validators.required]],
      candidateType: [[], [Validators.required]],
      Remarks: [null],
      TAGLeadID: [[], [Validators.required]],
      SalaryType:[null],
      basePay:[null],
      workingRemoteStatus:[null]
    })
  }

  getControl(name: string) {
    return this.assignTalentForm.get(name);
  }

  getPartnerList(e: any) {
    this.partnerList = e;
  }
  /***
   * get selected partner id's
   */
  public filterByExpiryList: any = [];
  getDataIdsPartners(e: any) {
    let maptoListVendor = this.partnerList.filter(t => t.PartnerID == e);

    // this.filterByExpiryList = maptoListVendor.filter(m => m.IsContractExpired === 1);
    if (maptoListVendor[0].IsContractExpired === 1) {
      this._share.showAlertErrorMessage.next(maptoListVendor[0]?.PartnerName + ' contract has been expired.');
      // this.getControl('reasonid').disable();
      // this.getControl('Remarks').disable();
      this.getControl('PartnerIDs').reset();

    }
    else {
      // this.getControl('reasonid').enable();
      // this.getControl('Remarks').enable();
    }



  }


  openMessageModal(data: any) {
    const dialogRef = this.dialog.open(NotMessageComponent, {
      width: '650px',
      panelClass: ['ats-model-wrap', 'ats-msg-modal'],
      data: data,
      //  disableClose: true
    });
  }




  /**
   * 
   * @param e 
   */
  public contractTypeID: string = '';
  getcontractTypeID(e) {
    this.contractTypeID = e.value.toString();
  }

  get partnerIDControl() { return this.assignTalentForm.get('PartnerIDs') }
  /***
   * register partner
   */
  submitForm(form: UntypedFormGroup) {
    form.markAllAsTouched();
    //  let vm = formData.value['PartnerIDs'].split(',')
    if (form.valid) {
      let formData = form.value;
      formData['PartnerIDs'] = formData.PartnerIDs.toString();
      formData['AssignID'] = this.data?.ID;
      formData['thid']= this.data?.thid;
      formData['candidateType'] = formData.candidateType.toString();
      this._partnerServe.assignTalentIdToPartner(formData).subscribe(
        res => {
          this._share.showAlertSuccessMessage.next(res);
          this.assignTalentForm.reset();
          this.dialogRef.close(true);
        }
      )
    }
    else {
      this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
    }

  }

  resetForm() {
    this.assignTalentForm.reset()
  }

  gotPartnerDetailsPage(): void {
    this._router.navigate(['user-details'])
  }

  //get connect person
  getReasonForAssignList() {
    this._partnerServe.getReasonAssingList().subscribe((res) => {
      if(this.isLocationUS){
        this.reasonForAssingList = res.data;
      }
      else{
        this.reasonForAssingList = res.data.filter((item: any) => (item.ReasonId != '5' || item.ReasonId != 5));
      }
     
    });
  }
  public contactList: any = [];
  public prContactList: any = [];
  getContractList() {
    this._globalServe.GetContractTypes().subscribe(
      res => {
        this.prContactList = res['data'];
        this.locationWiseContracList();
      }
    )
  }
  locationWiseContracList(){
    if(this.isLocationUS){
      this.contactList = this.prContactList.filter((item: any) => item.ID == '3' || item.ID == '7');
    }
    else{
     
      const filterContType = this.prContactList.filter(itemInArray => itemInArray.ID === 8 || itemInArray.ID === 3);
      this.contactList = filterContType;
    
    }
  }


  closeModal(): void {
    this.dialogRef.close();
  }

}
