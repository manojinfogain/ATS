import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { CandidateService } from 'projects/ats-global-system-external/src/app/candidate-module/candidate.service';
import { GlobalMethod } from 'projects/ats-global-system-external/src/app/core/common/global-method';
import { requiredMsgPrefix } from 'projects/ats-global-system-external/src/app/core/constant/common.const';
import { ExternalUserGlobalApiService } from 'projects/ats-global-system-external/src/app/core/services/external-user-global-api.service';
import { GetSetStorageService } from 'projects/ats-global-system-external/src/app/core/services/get-set-storage.service';
import { ShareService } from 'projects/ats-global-system-external/src/app/core/services/share.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-candidate-family-details-from-modal',
  templateUrl: './candidate-family-details-from-modal.component.html',
  styleUrls: ['./candidate-family-details-from-modal.component.scss']
})
export class CandidateFamilyDetailsFromModalComponent implements OnInit {
  public appearance: string = 'fill';
  public formClass: string = 'form-fill-ats'
  updateFamilyDetailsForm: UntypedFormGroup;
  public relationshipList: any = [];
  public occupationList: any[];
  public genderList: any[];
  public today = new Date();
  public requireMinCharacText1 = requiredMsgPrefix.requireMinCharacText1
  public requireMinCharacText2 = requiredMsgPrefix.requireMinCharacText2
  public requireText = requiredMsgPrefix.requireText;
  private candidateId =  this._storage.getCandidateId();
  constructor(
    public dialogRef: MatDialogRef<CandidateFamilyDetailsFromModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: UntypedFormBuilder,
    private _share: ShareService,
    private _exGlobal: ExternalUserGlobalApiService,
    private _candidateServe: CandidateService,
    private _storage: GetSetStorageService
  ) { }

  ngOnInit(): void {
    this.getDocumentList();
    this.formInit();
  }
  /**getting  data api */
  public familyListFiltered:any[];
  getDocumentList() {
    forkJoin([
      this._exGlobal.getRelationShipMaster(),
      // this._exGlobal.GetOccupationMaster(),
      this. _exGlobal.getGenderList(),
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
        formValue['dob'] = GlobalMethod.formatDate(formValue['memberDob']);
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
    
        formValue['Candidateid'] = this.candidateId;
      
      /** type 1 for add / save family memeber details */
       /** type 2 update / edit family memeber details */
      if (this.data?.type == 1) {
        this._candidateServe.addFamilyMemberDetails(formValue).subscribe(
          res => {
              this._share.showAlertSuccessMessage.next(res)
              this.dialogRef.close(true);
          }
        )
      } else {
        this._candidateServe.updateFamilyMemberDetails(this.data?.id, formValue).subscribe(
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
