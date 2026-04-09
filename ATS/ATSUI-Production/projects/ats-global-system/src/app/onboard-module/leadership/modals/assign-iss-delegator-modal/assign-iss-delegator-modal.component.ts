import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { OnboardService } from '../../../onboard.service';

@Component({
  selector: 'app-assign-iss-delegator-modal',
  templateUrl: './assign-iss-delegator-modal.component.html',
  styleUrls: ['./assign-iss-delegator-modal.component.scss']
})
export class AssignIssDelegatorModalComponent implements OnInit {

  public assingIssDelegator: UntypedFormGroup;
  public cancelReasonList: any = [];
  public issList: any = [];
  public filterCtrlISS: UntypedFormControl = new UntypedFormControl();
  public searchCtrlIss: string;
  constructor(
    public dialogRef: MatDialogRef<AssignIssDelegatorModalComponent>,
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
    this.filterCtrlISS.valueChanges.subscribe(
      val => {
        this.searchCtrlIss = val;
      }
    )
    this._onboard.getIssSpocListDelegation().subscribe(
      res => {
        this.issList = res['data'];
      }
    )
  }

  formInit() {
    this.assingIssDelegator = this._fb.group({
      issDelegateId: [null, [Validators.required]],
      remarks: [null]
    })
    if (this.data?.isUpdate == 'Y') {
      this.assingIssDelegator.patchValue({
        issDelegateId: this.data.assignedIssDelegatorId,
        remarks: this.data.remarks
      })
    }
  }

  // setDefaultValue(){
    
  // }

  getControl(name: string) {
    return this.assingIssDelegator.get(name);
  }


  /**assign delegator submit */
  assingDelegatorHandler(form: any) {
    this.assingIssDelegator.markAllAsTouched();
    if (this.assingIssDelegator.valid) {
      let formValue = form.value;
      formValue['Candidateid'] = this.data.candidateId;
      debugger
      this._onboard.addISSDelegationMethod(formValue).subscribe(
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
