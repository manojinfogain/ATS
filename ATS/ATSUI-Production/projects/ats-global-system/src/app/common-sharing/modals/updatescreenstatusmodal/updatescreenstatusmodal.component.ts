import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { InterviewCommonService } from 'projects/ats-global-system/src/app/core/services/interview-common.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { GetLocationInfo } from '../../../core/common/getLocationInfo';

@Component({
  selector: 'app-updatescreenstatusmodal',
  templateUrl: './updatescreenstatusmodal.component.html',
  styleUrls: ['./updatescreenstatusmodal.component.scss']
})
export class UpdatescreenstatusmodalComponent implements OnInit {

  public reasonDropDown: any = [];
  public offerDropReason: any = [];
  public statusList: any = [];
  public isDropTypeSelected: boolean = false;
  public screenRejectForm: UntypedFormGroup = new UntypedFormGroup({});
  public screenRejectReason: any = [];
  constructor(
    public dialogRef: MatDialogRef<UpdatescreenstatusmodalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public _fb: UntypedFormBuilder,
    public _share: ShareService,
    private _intervServ: InterviewCommonService,
    private globalApiServ: GlobalApisService,
    private getLocInfo: GetLocationInfo

  ) { }

  ngOnInit(): void {
    this.showHideLocWise();
    this.getScreenRejectReasonList('');
    this.formInit()
    this._intervServ.getReasonDropList().subscribe((res) => {
      this.reasonDropDown = res.data;
    });
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
   
 }
 getReason(e:any){
  if(e.value == '0'){
    this.getControl('Remarks').setValidators([Validators.required]);
   
  }
  else{
    this.getControl('Remarks').clearValidators();
  }
  this.getControl('Remarks').updateValueAndValidity();

 }
  /**get screen reject  */
  getScreenRejectReasonList(id) {
    this.globalApiServ.getScreenRejectReasonList(id).subscribe(
      res => {
         /*filtering reject list by id*/
       let filterById = [1,2,3];
       let filteredRejectReason= res['data'].filter(t => {
         return filterById.indexOf(t.id) !== -1;
       });
       this.screenRejectReason = filteredRejectReason;
      }
    )
  }

  //formInit
  public isReasonVisible: boolean = true;
  formInit() {
    this.screenRejectForm = this._fb.group({
      Remarks: [null],
      screenRejectReasonId: [null],
    });
    debugger
    if(this.data?.statusId == 20){    
      this.getControl('screenRejectReasonId').clearValidators();
      this.getControl('Remarks').setValidators([Validators.required]);
      this.isReasonVisible = false;
    }
    else{
      this.isReasonVisible = true;
      this.getControl('screenRejectReasonId').setValidators([Validators.required]);
      this.getControl('Remarks').clearValidators();
      
    }
    
    this.getControl('screenRejectReasonId').updateValueAndValidity();
    this.getControl('Remarks').updateValueAndValidity();
  }


  /**submiting screen reject form method */
  submitScreenRejectForm(form: UntypedFormGroup) {
    form.markAllAsTouched();
    let formData = form.value;
    if (form.valid) {
      formData['id'] = this.data.pId;
      formData['profileId'] = this.data?.profileId;
      formData['statusId'] = this.data?.statusId == 20 ? 22 : 20;
      this._intervServ.updatescreenstatusbyId(formData).subscribe(
        res => {
          this._share.showAlertSuccessMessage.next(res);
          this.dialogRef.close(true);
        }
      )
    } else {
      this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
    }
  }

  //control for form
  getControl(name: string) {
    return this.screenRejectForm.get(name);
  }

  /***/

  closeModal(): void {
    this.dialogRef.close();
  }

}
