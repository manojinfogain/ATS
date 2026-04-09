import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { Validators } from 'ngx-editor';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
//  import { AdminServiceService } from '../../../admin-service.service';
import { CONSTANTS } from 'projects/ats-global-system/src/app/core/constant/constants';
import { BgvServiceService } from '../../bgv-service.service';

@Component({
  selector: 'app-add-new-account-dt-modal',
  templateUrl: './add-new-account-dt-modal.component.html',
  styleUrls: ['./add-new-account-dt-modal.component.scss']
})
export class AddNewAccountDtModalComponent implements OnInit {
  public userData: any = {};
  public addAccountForm: UntypedFormGroup;
  public accountList: any = [];
  public FilterCtrlCandiStatus: UntypedFormControl = new UntypedFormControl();
  public searchInput: string;
  constructor(
    public dialogRef: MatDialogRef<AddNewAccountDtModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: UntypedFormBuilder,
    private _share: ShareService,
    private _bgvService: BgvServiceService,
    //  private _adminService: AdminServiceService
  ) { }

  ngOnInit() {
    this.formInit();
    this.getAccountList();
  }

  formInit() {
    this.addAccountForm = this._fb.group({
      newAccount: [null, [Validators.required]],
      remarks: [null, [Validators.required]],
    })
  }

  getControl(name: string) {
    return this.addAccountForm.get(name);
  }

  /**submit form */
  addAccountHandler(form: any) {
    form.markAllAsTouched();
    if (this.addAccountForm.valid) {
      let formData = {};
      formData['AccountId'] = form.value.newAccount;
      //  formData['Tier'] = form.value.tierType;
       this._bgvService.AddDTAccount(formData).subscribe(
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
    * get account list
    */
  getAccountList() {
    this._bgvService.getAccountLists().subscribe(
      (res: any) => {
        this.accountList = res['data'];
        this.FilterCtrlCandiStatus.valueChanges.subscribe(
          get => {
            this.searchInput = get;
          }
        )
      },
      (error) => {
        this._share.showAlertErrorMessage.next('Failed to load account list.');
      }
    );
  }

  /***
  * close dialog
  */
  closeModal(): void {
    this.dialogRef.close();
  }


}
