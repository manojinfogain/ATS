import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { LIBrequiredMsgPrefix } from 'projects/ats-lib/src/lib/core/constant/lib-common.const';
import { LibCandidateService } from 'projects/ats-lib/src/lib/services/lib-candidate.service';
import { LibExternalUserGlobalApiService } from 'projects/ats-lib/src/lib/services/lib-external-user-global-api.service';
import { LibGlobalMethod } from 'projects/ats-lib/src/lib/services/lib-global-method';
import { LibShareService } from 'projects/ats-lib/src/lib/services/lib-share.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'lib-candidate-family-details-from-modal',
  templateUrl: './lib-candidate-family-details-from-modal.component.html',
  styleUrls: ['./lib-candidate-family-details-from-modal.component.scss']
})
export class LibCandidateFamilyDetailsFromModalComponent implements OnInit {
  public appearance: string = 'fill';
  public formClass: string = 'form-fill-ats'
  updateFamilyDetailsForm: UntypedFormGroup;
  public relationshipList: any = [];
  public occupationList: any[];
  public genderList: any[];
  public today = new Date();
  public requireMinCharacText1 = LIBrequiredMsgPrefix.requireMinCharacText1
  public requireMinCharacText2 = LIBrequiredMsgPrefix.requireMinCharacText2
  public requireText = LIBrequiredMsgPrefix.requireText;
  public apiBaseUrlCand:string = '';
  public apiBaseUrlMaster:string = '';
  constructor(
    public dialogRef: MatDialogRef<LibCandidateFamilyDetailsFromModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: UntypedFormBuilder,
    private _share: LibShareService,
    private _exGlobal: LibExternalUserGlobalApiService,
    private _candidateServe: LibCandidateService,
  ) { }

  ngOnInit(): void {
    this.apiBaseUrlCand = this.data?.apiBaseUrlCand;
    this.apiBaseUrlMaster = this.data?.apiBaseUrlMaster;
    this.getDocumentList();
    this.formInit();
  }
  /**getting  data api */
  public familyListFiltered:any[];
  getDocumentList() {
    forkJoin([
      this._exGlobal.getRelationShipMaster(this.apiBaseUrlMaster),
      // this._exGlobal.GetOccupationMaster(),
      this. _exGlobal.getGenderList(this.apiBaseUrlMaster),
    ]).subscribe(
      res => {
       /**filtering realtionship - already added father and mother details will not show in dropdown */
      /**type 1 stands for add details */
       if(this.data?.type == 1){
        this.familyListFiltered = res[0]['data'].filter(t => {
          return !this.data?.relationshipId?.includes(t.REL_ID)
        });
      }
      /**  type 2 stands for update details */
      else if(this.data?.type == 2){
        this.familyListFiltered = res[0]['data']
      }
        // this.occupationList = res[1]['data'];
       this.genderList = res[1]['data'];
      }
    )
  }

  /***
   * form Initialization
   */
  formInit() {
    this.updateFamilyDetailsForm = this._fb.group({
      relationship: [null, [Validators.required]],
      familyMemberName: [null, [Validators.required]],
      memberDob: [null],
      gender: [null, [Validators.required]],
      dependent: [null, [Validators.required]],
      occupation: [null],
      address: [null],
      minor: [null, [Validators.required]],
      guardianName: [null],
      guardianAddress: [null],
      organizatonName: [null],
      currentlocation: [null, [Validators.required]],
    })
    if (this.data?.type == 2) {
      this.updateFamilyDetailsForm.patchValue({
        familyMemberName: this.data?.name,
        relationship: this.data?.relationship,
        memberDob: this.data?.dob,
        dependent: this.data?.isdependent,
        organizatonName: this.data?.orgName,
        guardianAddress: this.data?.guardianAddress,
        currentlocation: this.data?.currentLocation,
        guardianName: this.data?.guardianName,
        gender: this.data?.gender,
        minor: this.data?.minor,
        occupation: this.data?.occupation,
        address: this.data?.address,
      });
      this.selectMinor(this.data?.minor);
      // this.selectRelation(this.data?.relationship);
    }
  }
  getControl(name: string) {
    return this.updateFamilyDetailsForm.get(name);
  }
  get relationshipControl() { return this.updateFamilyDetailsForm.get('relationship'); }
  get familyMemberNameControl() { return this.updateFamilyDetailsForm.get('familyMemberName'); }
  get memberDobControl() { return this.updateFamilyDetailsForm.get('memberDob'); }
  get genderControl() { return this.updateFamilyDetailsForm.get('gender'); }
  get dependentControl() { return this.updateFamilyDetailsForm.get('dependent'); }
  get addressControl() { return this.updateFamilyDetailsForm.get('address'); }
  get minorControl() { return this.updateFamilyDetailsForm.get('minor'); }
  get guardianNameControl() { return this.updateFamilyDetailsForm.get('guardianName'); }
  get guardianAddressControl() { return this.updateFamilyDetailsForm.get('guardianAddress'); }
  get occupationControl() { return this.updateFamilyDetailsForm.get('occupation'); }
  get organizatonNameControl() { return this.updateFamilyDetailsForm.get('organizatonName'); }
  get currentlocationControl() { return this.updateFamilyDetailsForm.get('currentlocation'); }

  /***
   * submit form- to server
   */
  submitForm(form: any) {
    form.markAllAsTouched();
    if (this.updateFamilyDetailsForm.valid) {
      let formValue = form.value;
      if (formValue['memberDob']) {
        formValue['dob'] = LibGlobalMethod.formatDate(formValue['memberDob']);
      }
      if (formValue['relationship']) {
        formValue['relationship'] = formValue.relationship;
      }
      if (formValue['gender']) {
        formValue['gender'] = formValue.gender;
      }
      if (formValue['dependent']) {
        formValue['isdependent'] = formValue.dependent;
      }
      if (formValue['occupation']) {
        formValue['occupation'] = formValue.occupation;
      }
      if (formValue['organizatonName']) {
        formValue['orgName'] = formValue.organizatonName;
      }

      if (formValue['minor']) {
        formValue['minor'] = formValue.minor;
      }
      if (formValue['familyMemberName']) {
        formValue['name'] = formValue.familyMemberName;
      }
      if (formValue['address']) {
        formValue['address'] = formValue.address;
      }
      if (formValue['guardianName']) {
        formValue['guardianName'] = formValue.guardianName;
      }
      if (formValue['guardianAddress']) {
        formValue['guardianAddress'] = formValue.guardianAddress;
      }

      if (formValue['currentlocation']) {
        formValue['currentLocation'] = formValue.currentlocation;
      }
      /** type 1 for add / save family memeber details */
       /** type 2 update / edit family memeber details */
      if (this.data?.type == 1) {
        this._candidateServe.addFamilyMemberDetails(this.apiBaseUrlCand,formValue).subscribe(
          res => {
              this._share.showAlertSuccessMessage.next(res)
              this.dialogRef.close(true);
          }
        )
      } else {
        this._candidateServe.updateFamilyMemberDetails(this.apiBaseUrlCand,this.data?.id, formValue).subscribe(
          res => {
             this._share.showAlertSuccessMessage.next(res)
             this.dialogRef.close(true);
          }
        )
      }
    
    }
    else {
      this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
    }
  }

  public isGuardianShow: boolean = false;
  selectMinor(val:any){
    if(val == 'Y'){
      this.isGuardianShow = true;
    }
    else{
      this.isGuardianShow = false;
      this.getControl('guardianName')?.reset();
      this.getControl('guardianAddress')?.reset();
    }
  }

  selectRelation(val:any){
    if(val == 1 || val == 9 || val == 18){
      this.getControl('gender').patchValue(2);
    }else if(val == 6 || val == 7 || val == 19){      
      this.getControl('gender').patchValue(1);
    }else{    
      this.getControl('gender').reset();
    }
  }

  /***
   * close modal
   */
  closeModal(): void {
    this.dialogRef.close();
  }
}
