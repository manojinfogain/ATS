import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { forkJoin } from 'rxjs';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { OfferReasonForDropComponent } from 'projects/ats-global-system/src/app/offer-module/modals/offer-reason-for-drop/offer-reason-for-drop.component';
import { OfferService } from 'projects/ats-global-system/src/app/offer-module/offer.service';

@Component({
  selector: 'app-delegate-rights-form-modal',
  templateUrl: './delegate-rights-form-modal.component.html',
  styleUrls: ['./delegate-rights-form-modal.component.scss']
})
export class DelegateRightsFormModalComponent implements OnInit {
  public delegationForm: UntypedFormGroup = new UntypedFormGroup({});
  public DHList: any = [];
  public FilterCtrl: UntypedFormControl = new UntypedFormControl();
  public searchInput: string;
  public minFromDate: any = new Date();
  public minToDate: any = new Date();
  public userData: any = {};
  public isVisibleApprover: boolean = false;


  constructor(
    public dialogRef: MatDialogRef<DelegateRightsFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _globalApiServe: GlobalApisService,
    private _offerService: OfferService,
    private _fb: UntypedFormBuilder,
    private _share: ShareService,
    private _storage: GetSetStorageService,
  ) { }

  ngOnInit(): void {
    this.userData = this._storage.getSetUserData();
    this.sendApprovalForm();
    this.getDHApproverList();
    const today = new Date()
    this.minFromDate = today;
    this.minToDate = today;
  }

  getDHApproverList() {
    this._globalApiServe.getTagHeadApproverList().subscribe(
      res => {
        this.DHList = res['data']
        this.FilterCtrl.valueChanges.subscribe(
          val => {
            this.searchInput = val;
          }
        )
      }
    )
  }

  setMinToDate(event: any) {
    this.minToDate = new Date(event.value);
    let FromDate = new Date(event.value);
    let ToDate = new Date(this.getControl("ToDate").value)
    if (FromDate > ToDate) {
      this.getControl("ToDate").reset();
    }
  }

  sendApprovalForm() {
    ;
    this.delegationForm = this._fb.group({
      Approver: [null, Validators.required],
      DelegateTo: [null, Validators.required],
      FromDate: [null, Validators.required],
      ToDate: [null, Validators.required],
      Remarks: [null],
    })
    if (this.userData.RoleId === 5) {
      this.getControl("Approver").addValidators([Validators.required])
      this.isVisibleApprover = true;
    }
    else {
      this.getControl("Approver").clearValidators();
      this.isVisibleApprover = false;
    }
    this.getControl("Approver").updateValueAndValidity();
  }

  addDelegationHandler(form: UntypedFormGroup) {
    if (form.valid) {
      
      let formData = form.value;
      if (formData.FromDate) {
        formData.FromDate = GlobalMethod.formatDate(formData.FromDate);
      }
      if (formData.ToDate) {
        formData.ToDate = GlobalMethod.formatDate(formData.ToDate);
      }
      this._offerService.addDelegation(formData).subscribe(
        res => {
          ;
          this._share.showAlertSuccessMessage.next(res);
          this.dialogRef.close(true);
        }
      )

    } else {
      form.markAllAsTouched();
      this._share.showAlertErrorMessage.next("Please fill all mandatory fields.");
    }
  }

  /*
get control Method*/
  getControl(name: string) {
    return this.delegationForm.get(name);
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
