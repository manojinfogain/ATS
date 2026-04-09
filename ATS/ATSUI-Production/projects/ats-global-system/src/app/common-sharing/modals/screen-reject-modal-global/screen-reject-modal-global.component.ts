import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { InterviewCommonService } from 'projects/ats-global-system/src/app/core/services/interview-common.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { GetLocationInfo } from '../../../core/common/getLocationInfo';
@Component({
  selector: 'app-screen-reject-modal-global',
  templateUrl: './screen-reject-modal-global.component.html',
  styleUrls: ['./screen-reject-modal-global.component.scss']
})
export class ScreenRejectModalGlobalComponent implements OnInit {

  public reasonDropDown: any = [];
  public offerDropReason: any = [];
  public statusList: any = [];
  public isDropTypeSelected: boolean = false;
  public screenRejectForm: UntypedFormGroup = new UntypedFormGroup({});
  public screenRejectReason: any = [];
  constructor(
    public dialogRef: MatDialogRef<ScreenRejectModalGlobalComponent>,
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
    this.getControl('remark').setValidators([Validators.required]);
   
  }
  else{
    this.getControl('remark').clearValidators();
  }
  this.getControl('remark').updateValueAndValidity();

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
  formInit() {
    this.screenRejectForm = this._fb.group({
      remark: [null],
      screenRejectId: [null, [Validators.required]],
    })
  }


  /**submiting screen reject form method */
  submitScreenRejectForm(form: UntypedFormGroup) {
    form.markAllAsTouched();
    let formData = form.value;
    if (form.valid) {
      debugger
      formData['id'] = this.data.pId;
      formData['profileTypeId'] = this.data.profileId
      formData['IsFromNaukriAPI'] = this.data.IsFromNaukriAPI ? this.data.IsFromNaukriAPI : 'N';
      if(this.data.ApplicantUid){
        formData['ApplicantUid'] = this.data.ApplicantUid ? this.data.ApplicantUid : '';
      }
      this._intervServ.submitScreenReject(formData).subscribe(
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
