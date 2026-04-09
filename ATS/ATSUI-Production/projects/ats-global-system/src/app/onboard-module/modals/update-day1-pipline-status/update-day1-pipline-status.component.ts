import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { CONSTANTS } from 'projects/ats-global-system/src/app/core/constant/constants';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { OfferService } from 'projects/ats-global-system/src/app/offer-module/offer.service';
import { OnboardService } from '../../onboard.service';


@Component({
  selector: 'app-update-day1-pipline-status',
  templateUrl: './update-day1-pipline-status.component.html',
  styleUrls: ['./update-day1-pipline-status.component.scss']
})
export class UpdateDay1PiplineStatusComponent implements OnInit {
  public joineeStatus: any =  [
    { name: 'Decline', value: 2 },
    { name: 'Defer', value: 3 },
    { name: 'Joined', value: 4 },
     { name: 'Offer Withdrawn ', value: 5 }
];
  public joineeStatusForm: UntypedFormGroup = new UntypedFormGroup({});
  constructor(
    public dialogRef: MatDialogRef<UpdateDay1PiplineStatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public _fb: UntypedFormBuilder,
    public _share: ShareService,
    private _onBoardServe: OnboardService,
    private _offerService: OfferService
  ) { }

  ngOnInit(): void {
    this.formInit();
    this.getControl('joineeStatus').markAsTouched();
  }


  
  joineeStatusAction(e: any) {
    let val = e.value;
   
  }

  

  //formInit
  formInit() {
    this.joineeStatusForm = this._fb.group({
      remark: [null],
      joineeStatus: [null, [Validators.required]],
      confirmJoinDate: [null]
    })
  }

  /***
   * submit method
   */
  submitJoineeStatusForm(form: UntypedFormGroup) {
    form.markAllAsTouched();
    let formData = form.value;
    if (form.valid) {
      let formDataJson = {};
      formDataJson['cid'] = this.data.cid;
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
   * api
   * @param formDataJson 
   */
  apiCallOnSubmit(formDataJson: any) {
    this._onBoardServe.UpdateCandidateJoiningStatus(formDataJson).subscribe(
      res => {
        this._share.showAlertSuccessMessage.next(res);
        this.dialogRef.close(true);
      }
    )
  }

  //control for form
  getControl(name: string) {
    return this.joineeStatusForm.get(name);
  }

  /***/

  closeModal(): void {
    this.dialogRef.close();
  }

}
