import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { InrerviewsService } from 'projects/ats-global-system/src/app/interview-module/inrerviews.service';

@Component({
  selector: 'app-approve-transfered-candidate',
  templateUrl: './approve-transfered-candidate.component.html',
  styleUrls: ['./approve-transfered-candidate.component.scss']
})
export class ApproveTransferedCandidateComponent implements OnInit {

  public approveTransferCandidateForm: UntypedFormGroup = new UntypedFormGroup({});

  constructor(
    public dialogRef: MatDialogRef<ApproveTransferedCandidateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public _fb: UntypedFormBuilder,
    public _share: ShareService,
    private _intServe: InrerviewsService,
  ) { }

  ngOnInit(): void {
    this.formInit()
  }


  //formInit
  formInit() {
    this.approveTransferCandidateForm = this._fb.group({
      transferStatus: [null, [Validators.required]],
      remark: [null],
    })
  }


  //submit approval
  approveTransferCandiHandler(form: UntypedFormGroup) {
    form.markAllAsTouched();
    if (form.valid) {
      if(this.data['type'] === 1){
        this._intServe.ApproveUnAttendentTransferProfile(this.data.id, form.value.transferStatus, form.value.remark ? form.value.remark : null,this.data?.IsFromNaukriAPI ? this.data?.IsFromNaukriAPI : 'N').subscribe(
          res => {
            this._share.showAlertSuccessMessage.next(res);
            this.dialogRef.close(true);
          }
        )
      }
      else{
        this._intServe.approveTransferedCandidate(this.data.cid, form.value.transferStatus, form.value.remark ? form.value.remark : null).subscribe(
          res => {
            this._share.showAlertSuccessMessage.next(res);
            this.dialogRef.close(true);
          }
        )
      }
    } else {
      this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
    }

  }

  //onchange
  public isRemarkRequired: boolean = false;
  statusChange(e) {
    if (e.value == 'A') {
      this.getControl('remark').clearValidators();
      this.getControl('remark').updateValueAndValidity();
      this.isRemarkRequired = false;
    }
    else {
      this.getControl('remark').setValidators([, Validators.required]);
      this.getControl('remark').updateValueAndValidity();
      this.isRemarkRequired = true;
    }
  }

  //control for form
  getControl(name: string) {
    return this.approveTransferCandidateForm.get(name);
  }

  /***/

  closeModal(): void {
    this.dialogRef.close();
  }
}
