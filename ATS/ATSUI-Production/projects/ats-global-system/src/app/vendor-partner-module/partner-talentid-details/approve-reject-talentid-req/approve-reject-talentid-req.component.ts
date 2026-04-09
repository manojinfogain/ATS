import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { GlobalApisService } from '../../../core/services/global-apis.service';
import { PartnerService } from '../../partner.service';
import { GetLocationInfo } from '../../../core/common/getLocationInfo';

@Component({
  selector: 'app-approve-reject-talentid-req',
  templateUrl: './approve-reject-talentid-req.component.html',
  styleUrls: ['./approve-reject-talentid-req.component.scss']
})
export class ApproveRejectTalentidReqComponent implements OnInit {
  public partnerStatusForm: UntypedFormGroup = new UntypedFormGroup({});
  public searchInput: string;
  constructor(
    public dialogRef: MatDialogRef<ApproveRejectTalentidReqComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: UntypedFormBuilder,
    private _share: ShareService,
    private _partnerServe: PartnerService,
    private _globalServe: GlobalApisService,
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
   
   this.getTagHeadApproverList();
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
    this.partnerStatusForm = this._fb.group({
      Action: [null],
      Remarks: [null],
      TAGLeadID:[this.data?.ApproverID || null]
    })

    if(this.data?.type == 'C'){
      this.getControl('TAGLeadID').setValidators([Validators.required]);
      this.getControl('TAGLeadID').updateValueAndValidity();
      this.getControl('Remarks').setValidators([Validators.required]);
      this.getControl('Remarks').updateValueAndValidity();
    }
    else{
      this.getControl('Action').setValidators([Validators.required]);
      this.getControl('Action').updateValueAndValidity();
    }
  }

  /***
   * get Control
   */
  getControl(name: string) {
    return this.partnerStatusForm.get(name);
  }


  //status on change

  public isRemarkRequired: boolean = false;
  statusChange(e) {
    if (e.value == 'A') {
      this.getControl('Remarks').clearValidators();
      this.getControl('Remarks').updateValueAndValidity();
    }
    else {
      this.getControl('Remarks').setValidators([, Validators.required]);
      this.getControl('Remarks').updateValueAndValidity();
    }
  }
  /**
   * approve/reject
   * @param form 
   */
  approveRejected(form: UntypedFormGroup) {
    form.markAllAsTouched();
    if (form.valid) {
      let formData = form.value;
      formData['AssignID'] = this.data?.ID;
      if (!formData.Remarks) {
        delete formData['Remarks']
      }

      if(this.data?.type == 'A'){
        this._partnerServe.UpdatePartnerTHIDAssignStatus(formData).subscribe(
          res => {
            this._share.showAlertSuccessMessage.next(res);
            this.dialogRef.close(true);
          }
        )
      }
      else if(this.data?.type == 'C'){
        this._partnerServe.ChangeApprover(formData).subscribe(
          res => {
            this._share.showAlertSuccessMessage.next(res);
            this.dialogRef.close(true);
          }
        )
      }
      
    }
    else {
      if (this.getControl('Action').invalid) {
        this._share.showAlertErrorMessage.next('Please select Action.');
      }
      else if (this.getControl('Remarks').invalid) {
        this._share.showAlertErrorMessage.next('Please enter Remarks.');
      }
      else {
        this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
      }

    }
  }

  /***
   * close Modal
   */
  closeModal(): void {
    this.dialogRef.close();
  }

}
