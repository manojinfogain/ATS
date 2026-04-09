import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { CandidateService } from 'projects/ats-global-system-external/src/app/candidate-module/candidate.service';
import { ShareService } from 'projects/ats-global-system-external/src/app/core/services/share.service';

@Component({
  selector: 'app-update-address-candidate-modal',
  templateUrl: './update-address-candidate-modal.component.html',
  styleUrls: ['./update-address-candidate-modal.component.scss']
})
export class UpdateAddressCandidateModalComponent implements OnInit, AfterViewInit {
  public appearance: string = 'fill';
  public formClass: string = 'form-fill-ats';
  group: UntypedFormGroup = new UntypedFormGroup({});

  formColClass: string = 'form-on-col';
  constructor(
    public dialogRef: MatDialogRef<UpdateAddressCandidateModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _share: ShareService,
    private _candidateServe: CandidateService,
    private _cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

  }

  checkSame(e: any) {
    if (e.checked == true) {
      let personalDetails = this.data['personalDetails'];
      this.group.patchValue({
        addressLine1: personalDetails?.AddressLine1,
        addressLine2: personalDetails?.AddressLine2,
        addressLine3: personalDetails?.AddressLine3,
        city: personalDetails?.cr_city,
        state: personalDetails?.cr_state,
        postalCode: personalDetails?.cr_postalCode,
        country: personalDetails?.cr_country ? parseInt(personalDetails?.cr_country) : null
      })
    }

  }
  public isSameCheck: boolean = false;
  ngAfterViewInit(): void {
    if (this.data) {
      let personalDetails = this.data['personalDetails'];
      if (personalDetails?.AddressLine1 != null && this.data['type'] == 'P') {
        this.isSameCheck = true;
      }
      if (this.data['type'] == 'C') {
        this.group.patchValue({
          addressLine1: personalDetails?.AddressLine1,
          addressLine2: personalDetails?.AddressLine2,
          addressLine3: personalDetails?.AddressLine3,
          city: personalDetails?.cr_city,
          state: personalDetails?.cr_state,
          postalCode: personalDetails?.cr_postalCode,
          country: personalDetails?.cr_country ? parseInt(personalDetails?.cr_country) : null
        })
      }

      if (this.data['type'] == 'P') {
        this.group.patchValue({
          addressLine1: personalDetails?.pr_addressLine1,
          addressLine2: personalDetails?.pr_addressLine2,
          addressLine3: personalDetails?.pr_addressLine3,
          city: personalDetails?.pr_city,
          state: personalDetails?.pr_state,
          postalCode: personalDetails?.pr_postalCode,
          country: personalDetails?.pr_country ? parseInt(personalDetails?.pr_country) : null

        })

      }
      if (this.data['type'] == 'E') {
        this.group.patchValue({
          addressLine1: personalDetails?.em_addressLine1,
          addressLine2: personalDetails?.em_addressLine2,
          addressLine3: personalDetails?.em_addressLine3,
          city: personalDetails?.em_city,
          state: personalDetails?.em_state,
          postalCode: personalDetails?.em_postalCode,
          country: personalDetails?.em_country ? parseInt(personalDetails?.em_country) : null
        })

      }


    }

    this._cd.detectChanges();
  }

  saveAddress() {
    this.group.markAllAsTouched();
    if (this.group.valid) {
      let body: any = this.group.value;
      body['addressType'] = this.data['type'];
      body['Candidateid'] = this.data?.candidateId;
      this._candidateServe.updateAddress(body).subscribe(
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

  /***
   * close modal
   */
  closeModal(): void {
    this.dialogRef.close();
  }


}
