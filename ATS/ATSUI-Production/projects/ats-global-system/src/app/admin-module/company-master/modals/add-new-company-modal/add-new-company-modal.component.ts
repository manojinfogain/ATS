import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { Validators } from 'ngx-editor';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { AdminServiceService } from '../../../admin-service.service';
import { CONSTANTS } from 'projects/ats-global-system/src/app/core/constant/constants';

@Component({
  selector: 'app-add-new-company-modal',
  templateUrl: './add-new-company-modal.component.html',
  styleUrls: ['./add-new-company-modal.component.scss']
})
export class AddNewCompanyModalComponent implements OnInit {
  public userData: any = {};
  public addCompanyForm: UntypedFormGroup;
  public tierTypeList: any = CONSTANTS.tierList;
  constructor(
    public dialogRef: MatDialogRef<AddNewCompanyModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: UntypedFormBuilder,
    private _share: ShareService,
    private _adminService: AdminServiceService
  ) { }

  ngOnInit() {
    this.formInit();
  }

  formInit() {
    this.addCompanyForm = this._fb.group({
      newCompany: [null, [Validators.required]],
      tierType: [null, [Validators.required]],
    })
  }

  getControl(name: string) {
    return this.addCompanyForm.get(name);
  }

  /**submit form */
  addCompanyHandler(form: any) {
    form.markAllAsTouched();
    if (this.addCompanyForm.valid) {
      let formData = {};
      formData['ComapanyName'] = form.value.newCompany;
      formData['Tier'] = form.value.tierType;
      this._adminService.addCompany(formData).subscribe(
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
  * close dialog
  */
  closeModal(): void {
    this.dialogRef.close();
  }


}
