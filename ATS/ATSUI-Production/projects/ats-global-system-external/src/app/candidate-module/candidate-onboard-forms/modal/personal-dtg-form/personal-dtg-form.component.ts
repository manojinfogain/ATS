import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { COMMON_CONST } from 'projects/ats-global-system-external/src/app/core/constant/common.const';
import { ExternalUserGlobalApiService } from 'projects/ats-global-system-external/src/app/core/services/external-user-global-api.service';
import { ShareService } from 'projects/ats-global-system-external/src/app/core/services/share.service';
import { CandidateService } from '../../../candidate.service';

@Component({
  selector: 'app-personal-dtg-form',
  templateUrl: './personal-dtg-form.component.html',
  styleUrls: ['./personal-dtg-form.component.scss']
})
export class PersonalDtgFormComponent implements OnInit {
  public logoImg: string = COMMON_CONST.imgPath + '/logo/logo-head.png'; 
  public personalInfoForm: UntypedFormGroup = new UntypedFormGroup({});
  constructor(
    public dialogRef: MatDialogRef<PersonalDtgFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private _exGlobal: ExternalUserGlobalApiService,
    private _fb: UntypedFormBuilder,
    private _share: ShareService,
    private _candidateServe: CandidateService
  ) { }

  ngOnInit(): void {
    this.formInit();
    this.getRelationMaster();
    // this.getOnboardingFormDetailsById();
  }

  //init form
  formInit() {
    this.personalInfoForm = this._fb.group({
      em_ContactNumber: [this.data?.EmergencyContactNumber ? this.data?.EmergencyContactNumber : null, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      em_ContactPerson: [this.data?.ContactPersonName ? this.data?.ContactPersonName : null, [Validators.required]],
      em_ContactRelation: [this.data?.Relation ? this.data?.Relation : null, [Validators.required]]
    })
  }

  //get control name
  getControl(name: string) {
    return this.personalInfoForm.get(name);
  }

  public familyList: any[];
  getRelationMaster() {
    this._exGlobal.getRelationShipMaster().subscribe(
      res => {
        this.familyList = res['data']
      })
  }

  // getOnboardingFormDetailsById() {
  //   this._candidateServe.getOnboardingFormDetailsById(this?.data?.formTypeId).subscribe(
  //     res => {
  //     })
  // }

  /***
   * submit personal info form
   */
  submitPersonalInfoForm(form: any) {
    
    form.markAllAsTouched();
    if (this.personalInfoForm.valid) {

      let body = {};
      // body['cid'] = this.data?.candidatePersonalDetails?.cid;
      body['Candidateid'] = this.data?.candidateId;
      body['FormId'] = this.data?.formTypeId;
      body['EmergencyContactNumber'] = form.value['em_ContactNumber'];
      body['ContactPersonName'] = form.value['em_ContactPerson'];
      body['Relation'] = form.value['em_ContactRelation'];
      body['status'] = 'D';
      debugger
      this._candidateServe.updatePersonalDetailsForm(body).subscribe(
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
