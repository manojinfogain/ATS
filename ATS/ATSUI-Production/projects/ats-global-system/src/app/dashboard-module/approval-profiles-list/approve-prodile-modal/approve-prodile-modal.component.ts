import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { ShareService } from '../../../core/services/share.service';
import { DashboardService } from '../../dashboard.service';

@Component({
  selector: 'app-approve-prodile-modal',
  templateUrl: './approve-prodile-modal.component.html',
  styleUrls: ['./approve-prodile-modal.component.scss']
})
export class ApproveProdileModalComponent implements OnInit {

  public approveForm: UntypedFormGroup = new UntypedFormGroup({});
  constructor(
    public dialogRef: MatDialogRef<ApproveProdileModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public _fb: UntypedFormBuilder,
    public _share: ShareService,
    public _dashboardService: DashboardService
  ) { }

  ngOnInit(): void {
    this.formInit()
  }


  //formInit
  formInit() {
    this.approveForm = this._fb.group({
      status: [null, [Validators.required]],
      remarks: [null],
    })
  }

 // ApprRejectCandidateTransferReqByPartner
  //submit approval
  approveCandiHandler(form: UntypedFormGroup) {
    form.markAllAsTouched();
    if (form.valid) {
      let formValue = form.value;
      formValue['id'] = this.data?.ID;
      this._dashboardService.approveProfileScreening(form.value).subscribe(res => {
        if (res) {
          this._share.showAlertSuccessMessage.next(res);
          this.dialogRef.close(true);
        }
      })
    } else {
      this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
    }

  }

  //onchange
  public isRemarkRequired: boolean = false;
  statusChange(e) {
    if (e.value == 'A') {
      this.getControl('remarks').clearValidators();
      this.getControl('remarks').updateValueAndValidity();
      this.isRemarkRequired = false;
    }
    else {
      this.getControl('remarks').setValidators([, Validators.required]);
      this.getControl('remarks').updateValueAndValidity();
      this.isRemarkRequired = true;
    }
  }

  //control for form
  getControl(name: string) {
    return this.approveForm.get(name);
  }

  /***/

  closeModal(): void {
    this.dialogRef.close();
  }

}
