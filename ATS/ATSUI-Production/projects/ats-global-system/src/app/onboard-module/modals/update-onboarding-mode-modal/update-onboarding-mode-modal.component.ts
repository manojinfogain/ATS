import { Component, Inject, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { forkJoin } from 'rxjs';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { UntypedFormBuilder, FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { OfferService } from '../../../offer-module/offer.service';
import { ONBOARDING_MODE } from '../../../core/constant/common.const';
import { OnboardService } from '../../onboard.service';
import { GlobalMethod } from '../../../core/common/global-method';

@Component({
  selector: 'app-update-onboarding-mode-modal',
  templateUrl: './update-onboarding-mode-modal.component.html',
  styleUrls: ['./update-onboarding-mode-modal.component.scss']
})
export class UpdateOnboardingModeModalComponent implements OnInit {
  // public minDate: any = new Date();
  // public maxDate: any = new Date(this.data?.DateOfJoining);
  public submitUpdateOnboardingModeForms: UntypedFormGroup = new UntypedFormGroup({});
  public offerAprDt: any = [];
  public isSubmitBtnDisabled: boolean = false;
  public onboardingModeList: any = ONBOARDING_MODE;
  public userData: any = {};
  constructor(
    public dialogRef: MatDialogRef<UpdateOnboardingModeModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _offerService: OfferService,
    public dialog: MatDialog,
    public _fb: UntypedFormBuilder,
    public _globalApiServe: GlobalApisService,
    public _globalApi: GlobalApisService,
    public _share: ShareService,
    private _onboardServ: OnboardService,
    private _storage: GetSetStorageService,
  ) { }

  ngOnInit(): void {
    this.userData = this._storage.getSetUserData();
    this.getCandidateDetails();
    this.updateForm();
  }  

  //form control
  updateForm() {
    this.submitUpdateOnboardingModeForms = this._fb.group({
      onboardingMode: [this.data?.OnBoardingModeFromRec ? this.data?.OnBoardingModeFromRec : null , [Validators.required]],
      remarks: [null],
      // revisedOnboardingDate: [this.data?.DateOfJoining ? this.data?.DateOfJoining : null]
    })
  }

 




  //control for form
  getControl(name: string) {
    return this.submitUpdateOnboardingModeForms.get(name);
  }


  public joiningDate: any;
  getCandidateDetails() {
    forkJoin([
      this._offerService.getCandidateOfferAprDetails(this.data.cid)
    ]).subscribe(
      res => {
        this.offerAprDt = res[0]['data'][0];
      }
    )
  }


  //update  submit 
  updateOnboardingModeFormHandler(form: UntypedFormGroup) {
    if (form.valid) {
      let formData = form.value;
      // formData['cid'] = this.data.cid;  
      formData['Candidateid'] = this.data.candidateId;  
      if(this.userData?.RoleId === 2){
        formData['actionTakenBy'] = 'R';
      } else
      if(this.userData?.RoleId === 1 || this.userData?.otherRoles?.IsHRAccess == 'Y'){
        formData['actionTakenBy'] = 'H';
      }
      // if( formData['revisedOnboardingDate']){
      //   formData['revisedOnboardingDate'] = GlobalMethod.formatDate(formData['revisedOnboardingDate']);
      // }    
        this._onboardServ.updateCandidateOnboardingMode(formData).subscribe(
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

   /***
   * weekend exclude
   */
   FilterDateWeekend = (d: Date): boolean => {
    const day = d?.getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
