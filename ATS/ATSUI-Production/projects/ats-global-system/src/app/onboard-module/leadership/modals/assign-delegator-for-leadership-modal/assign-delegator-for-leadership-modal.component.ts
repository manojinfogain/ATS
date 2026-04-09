import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { Validators } from 'ngx-editor';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { OnboardService } from '../../../onboard.service';

@Component({
  selector: 'app-assign-delegator-for-leadership-modal',
  templateUrl: './assign-delegator-for-leadership-modal.component.html',
  styleUrls: ['./assign-delegator-for-leadership-modal.component.scss']
})
export class AssignDelegatorForLeadershipModalComponent implements OnInit {
  public assingDelegator: UntypedFormGroup;
  public cancelReasonList: any = [];
  public hrList: any = [];
  public filterCtrlHr: UntypedFormControl = new UntypedFormControl();
  public searchCtrlHr: string;
  constructor(
    public dialogRef: MatDialogRef<AssignDelegatorForLeadershipModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: UntypedFormBuilder,
    private _share: ShareService,
    private _onboard: OnboardService
  ) { }

  ngOnInit() {
    this.data;
    debugger
    this.getHrListForDelegationMethod();
    this.formInit();

  }

  /**get cancel reason category */
  getHrListForDelegationMethod() {
    this.filterCtrlHr.valueChanges.subscribe(
      val => {
        this.searchCtrlHr = val;
      }
    )
    this._onboard.getHrListForDelegation().subscribe(
      res => {
        this.hrList = res['data'];
        this.setDefaultVal();
      }
    )
  }

  formInit() {
    this.assingDelegator = this._fb.group({
      delegateHrId: [null, [Validators.required]],
      remarks: [null]
    })

  }

  setDefaultVal() {
    if (this.data?.isUpdate == 'Y') {
      this.assingDelegator.patchValue({
        delegateHrId: this.data.addedByEmpID.toString(),
        remarks: this.data.remarks
      })
    }
  }

  getControl(name: string) {
    return this.assingDelegator.get(name);
  }


  /**assign delegator submit */
  assingDelegatorHandler(form: any) {
    this.assingDelegator.markAllAsTouched();
    if (this.assingDelegator.valid) {
      let formValue = form.value;
      formValue['Candidateid'] = this.data.CandidateId;

      this._onboard.addOnboarSpocDelegation(formValue).subscribe(
        res => {
          this._share.showAlertSuccessMessage.next(res);
          this.dialogRef.close(true);
        }
      )

    }
    else {
      this._share.showAlertErrorMessage.next('Please fill the mandatory field.');
    }

  }
  /***
  * close dialog
  */
  closeModal(): void {
    this.dialogRef.close();
  }



}
