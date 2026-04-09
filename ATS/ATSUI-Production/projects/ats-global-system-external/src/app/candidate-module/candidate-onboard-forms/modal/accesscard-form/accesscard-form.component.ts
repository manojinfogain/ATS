import { Component, Inject, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { ShareService } from 'projects/ats-global-system-external/src/app/core/services/share.service';
import { CandidateService } from '../../../candidate.service';
@Component({
  selector: 'app-accesscard-form',
  templateUrl: './accesscard-form.component.html',
  styleUrls: ['./accesscard-form.component.scss']
})
export class AccesscardFormComponent implements OnInit, AfterViewInit {
  public accessCardForm: UntypedFormGroup = new UntypedFormGroup({});
  constructor(
    public dialogRef: MatDialogRef<AccesscardFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private _fb: UntypedFormBuilder,
    private _share: ShareService,
    private _candidateServe: CandidateService
  ) { }

  ngOnInit(): void {
    this.formInit();
  }

  ngAfterViewInit() {
  }

  //init form
  formInit() {
    this.accessCardForm = this._fb.group({
      em_ContactNumber: [this.data?.EmergContactNumberAccessCard ? this.data?.EmergContactNumberAccessCard : null, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
    })
  }

  //get control name
  getControl(name: string) {
    return this.accessCardForm.get(name);
  }

  /***
   * submit access card form
   */
  submitAccessCardForm(form: any) {
    
    form.markAllAsTouched();
    if (this.accessCardForm.valid) {
      let body = {};
      if (this.data?.candidateId) {
        // body['cid'] = this.data?.candidatePersonalDetails?.cid;
        body['Candidateid'] = this.data?.candidateId;
      }
      if (this.data?.formTypeId) {
        body['FormId'] = this.data?.formTypeId;
      }
      if (form.value['em_ContactNumber']) {
        body['EmergencyContactNumber'] = form.value['em_ContactNumber'];
      }
      debugger
      body['status'] = 'D';
      this._candidateServe.updateAccesscardForm(body).subscribe(
        res => {
          this._share.showAlertSuccessMessage.next(res);
          this.dialogRef.close(true);
        }
      );
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
