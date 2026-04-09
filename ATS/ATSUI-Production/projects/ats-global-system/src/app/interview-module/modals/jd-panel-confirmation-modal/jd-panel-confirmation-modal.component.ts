import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { InterviewCommonService } from 'projects/ats-global-system/src/app/core/services/interview-common.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { PartnerService } from 'projects/ats-global-system/src/app/vendor-partner-module/partner.service';

@Component({
  selector: 'app-jd-panel-confirmation-modal',
  templateUrl: './jd-panel-confirmation-modal.component.html',
  styleUrls: ['./jd-panel-confirmation-modal.component.scss']
})
export class JdPanelConfirmationModalComponent implements OnInit {

  public reasonDropDown: any = []

  public jdPannelAvailableForm: UntypedFormGroup = new UntypedFormGroup({});
  constructor(
    public dialogRef: MatDialogRef<JdPanelConfirmationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private _fb: UntypedFormBuilder,
    private _share: ShareService,
    private _intervServ: InterviewCommonService,
    private _globalApi: GlobalApisService
  ) { }

  ngOnInit(): void {
    this.data;
    debugger
    this.formInit()
    this._intervServ.getReasonDropList().subscribe((res) => {
      this.reasonDropDown = res.data;
    });
    this.getReqDetails(this.data?.th_id);
  }

  /***
    * get requition details
    */
  public talentInfo: any;
  getReqDetails(thId: number) {
    this._globalApi.getRequisitionTHID(thId).subscribe(
      res => {
        this.talentInfo = res[0]
      }
    )
  }
  //formInit
  formInit() {
    this.jdPannelAvailableForm = this._fb.group({
      JDFlag: [null, [Validators.required]],
      PanelFlag: [null, [Validators.required]]
    })
  }


  //submit 
  jdPannelAvailableHandler(form: UntypedFormGroup) {
    form.markAllAsTouched();
    this.data.cid;
    let formData = form.value

    if (form.valid) {
      this._intervServ.updatePanelJdConfirmation(formData, this.data?.th_id).subscribe(
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
    return this.jdPannelAvailableForm.get(name);
  }

  //

  /***/

  closeModal(): void {
    this.dialogRef.close();
  }



}
