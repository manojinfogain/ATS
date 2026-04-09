import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormBuilder, FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { BgvServiceService } from '../../bgv-service.service';

@Component({
  selector: 'app-update-other-bgv-details-modal',
  templateUrl: './update-other-bgv-details-modal.component.html',
  styleUrls: ['./update-other-bgv-details-modal.component.scss']
})
export class UpdateOtherBgvDetailsModalComponent implements OnInit {

  public updateTalentForm: UntypedFormGroup = new UntypedFormGroup({});
  public userData: any = {};
  public formAppearance: string = 'outline';
  public monthNamesList: string[] = []; // <-- Add this property

  constructor(
    public dialogRef: MatDialogRef<UpdateOtherBgvDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public _fb: UntypedFormBuilder,
    public _share: ShareService,
    private _storage: GetSetStorageService,
    private _bgvServ: BgvServiceService,
  ) { }

  ngOnInit(): void {
    this.userData = this._storage.getSetUserData();
    this.updateForm();
    this.getMonthNamesList(); // <-- Fetch month names on init
  }

  getMonthNamesList() {
    // Replace this with your actual service method
    this._bgvServ.getMonthNames().subscribe(
      (months: string[]) => {
        this.monthNamesList = months['data'];
      },
      err => {
        this.monthNamesList = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
      }
    );
  }

  //form control
  updateForm() {
    this.updateTalentForm = this._fb.group({
      PenaltyMonth: [null],
      YTRAmount: [null],
      DTAmount: [null],
      YTRPaidMonth: [null],
      StatusPaidUnpaidAmount: [null],
      FinalReportPaidMonth: [null],
    })
  }

  //control for form
  getControl(name: string) {
    return this.updateTalentForm.get(name);
  }

  hasAnyValue(): boolean {
    if (!this.updateTalentForm) return false;
    const values = this.updateTalentForm.value;
    return Object.values(values).some(val => val !== null && val !== '' && typeof val !== 'undefined');
  }

  //update  status submit 
  updateTalentHandler(form: UntypedFormGroup) {
    
    if (form.valid) {
      let formData = form.value;
      // formData['cid'] = this.data?.Cid;
      formData['Candidateid'] = this.data?.Candidateid;
      /**api calls based on rolewise */
      if(formData['YTRAmount']) {
        formData['YTRAmount'] = parseInt(formData['YTRAmount']);
      }
      if(formData['DTAmount']) {
        formData['DTAmount'] = parseInt(formData['DTAmount']);
      }
      debugger
        this._bgvServ.SavePenaltyMonthDetails(formData).subscribe(
          res => {
            this._share.showAlertSuccessMessage.next(res);
            this.dialogRef.close(true);
          }
        )
    } else {
      form.markAllAsTouched();
      this._share.showAlertErrorMessage.next("Please fill all mandatory fields.");
    }
  }

  closeModal(): void {
    this.dialogRef.close();
  }

}
