import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { OnboardService } from '../../../onboard.service';

@Component({
  selector: 'app-update-leadership-day1-status',
  templateUrl: './update-leadership-day1-status.component.html',
  styleUrls: ['./update-leadership-day1-status.component.scss']
})
export class UpdateLeadershipDay1StatusComponent implements OnInit {
  public joineeStatus: any = [
    { name: 'Decline', value: 2 },
    { name: 'Defer', value: 3 },
    { name: 'Joined', value: 4 },
    { name: 'Offer Withdrawn', value: 5 }
  ];
  public joineeStatusForm: UntypedFormGroup = new UntypedFormGroup({});

  constructor(
    public dialogRef: MatDialogRef<UpdateLeadershipDay1StatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public _fb: UntypedFormBuilder,
    public _share: ShareService,
    private _onBoardServe: OnboardService
  ) { }

  ngOnInit(): void {
    this.formInit();
    this.getControl('joineeStatus').markAsTouched();
  }

  joineeStatusAction(e: any) {
    let val = e.value;
  }

  // Form initialization
  formInit() {
    this.joineeStatusForm = this._fb.group({
      remark: [null],
      joineeStatus: [null, [Validators.required]],
      confirmJoinDate: [null]
    });
  }

  /**
   * Submit method for leadership candidate status update
   */
  submitJoineeStatusForm(form: UntypedFormGroup) {
    form.markAllAsTouched();
    let formData = form.value;
    if (form.valid) {
      let formDataJson = {};
      // Leadership uses candidateId, but API may expect cid
      formDataJson['cid'] = this.data.cid || this.data.candidateId;
      formDataJson['candidateId'] = this.data.candidateId;
      formDataJson['Status'] = formData['joineeStatus'];
      if (formData['remark']) {
        formDataJson['remark'] = formData['remark'];
      }

      this.apiCallOnSubmit(formDataJson);
    } else {
      this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
    }
  }

  /**
   * API call for leadership candidate status update
   * @param formDataJson 
   */
  apiCallOnSubmit(formDataJson: any) {
    this._onBoardServe.UpdateCandidateJoiningStatusLeadership(formDataJson).subscribe(
      res => {
        this._share.showAlertSuccessMessage.next(res);
        this.dialogRef.close(true);
      }
    );
  }

  // Get form control
  getControl(name: string) {
    return this.joineeStatusForm.get(name);
  }

  // Close modal
  closeModal(): void {
    this.dialogRef.close();
  }
}
