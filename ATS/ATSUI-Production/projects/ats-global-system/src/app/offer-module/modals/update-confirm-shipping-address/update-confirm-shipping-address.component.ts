import { Component, Inject, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { forkJoin } from 'rxjs';
import { OfferService } from '../../offer.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { ViewOfferApprovalDetailsComponent } from '../view-offer-approval-details/view-offer-approval-details.component';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';


@Component({
  selector: 'app-update-confirm-shipping-address',
  templateUrl: './update-confirm-shipping-address.component.html',
  styleUrls: ['./update-confirm-shipping-address.component.scss']
})
export class UpdateConfirmShippingAddressComponent implements OnInit {
  public updateAddressForm: UntypedFormGroup = new UntypedFormGroup({});
  public statusList: any;
  public declineCategoryList: any;
  public gradeList: any = [];
  public offerAprDt: any = [];
  public isHideDeclinCateg: boolean = false;
  public dcRequi: boolean = false;
  displayedColumns = ['approverType', 'approverName', 'ActionTaken', 'ActionTakenOn', 'ActionTakenBy', 'FromStatus', 'ToStatus', 'remarks'];
  constructor(
    public dialogRef: MatDialogRef<ViewOfferApprovalDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _offerService: OfferService,
    public dialog: MatDialog,
    public _fb: UntypedFormBuilder,
    public _globalApiServe: GlobalApisService,
    public _globalApi: GlobalApisService,
    public _share: ShareService
  ) { }

  ngOnInit(): void {
    this.getCandidateDetails();
    this.updateForm();
  }

  setDefaultAddress(addressType: string, data: any) {
    this.getControl(addressType).patchValue({
      "addressLine1": addressType === 'currentAddress' ? data?.AddressLine1 : data?.pr_addressLine1,
      "addressLine2": addressType === 'currentAddress' ? data?.AddressLine2 : data?.pr_addressLine2,
      "addressLine3": addressType === 'currentAddress' ? data?.AddressLine3 : data?.pr_addressLine3,
      "city": addressType === 'currentAddress' ? data?.cr_city : data?.pr_city,
      "state": addressType === 'currentAddress' ? data?.cr_state : data?.pr_state,
      "country": addressType === 'currentAddress' ? parseInt(data?.cr_country) : parseInt(data?.pr_country),
      "postalCode": addressType === 'currentAddress' ? data?.cr_postalCode : data?.pr_postalCode
    })
    // this.cdr.detectChanges();
  }

  //form control
  updateForm() {
    this.updateAddressForm = this._fb.group({
      currentAddress: this._fb.group({
      }),

    })
  }


  //control for form
  getControl(name: string) {
    return this.updateAddressForm.get(name);
  }


  getCandidateDetails() {
    forkJoin([
      this._offerService.getCandidateOfferAprDetails(this.data.cid)
    ]).subscribe(
      res => {
        this.offerAprDt = res[0]['data'][0];
        this.setDefaultAddress('currentAddress', this.offerAprDt);
        
      }
    )
  }

  updateAddressMethod(form: UntypedFormGroup) {
    form.markAllAsTouched();
    if (form.valid) {
      let formData = form.value;
      formData['cid'] = this.data.cid;
      formData['isShippingAddrConfirm'] = 1;

      this._offerService.updateConfirmShippingAddress(formData).subscribe(
        res => {
          this._share.showAlertSuccessMessage.next(res);
          this.dialogRef.close(true);
        }
      )
    }
    else {
      this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
    }
  }



  closeModal(): void {
    this.dialogRef.close();
  }


}
