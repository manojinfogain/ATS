
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { CandidateService } from 'projects/ats-global-system-external/src/app/candidate-module/candidate.service';
import { ExternalUserGlobalApiService } from 'projects/ats-global-system-external/src/app/core/services/external-user-global-api.service';
import { ShareService } from 'projects/ats-global-system-external/src/app/core/services/share.service';

@Component({
  selector: 'app-other-info-form-modal',
  templateUrl: './other-info-form-modal.component.html',
  styleUrls: ['./other-info-form-modal.component.scss']
})
export class OtherInfoFormModalComponent implements OnInit {
  public appearance: string = 'fill';
  public formClass: string = 'form-fill-ats'
  public otherInfoForm: UntypedFormGroup = new UntypedFormGroup({});
  public reqDetails: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<OtherInfoFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: UntypedFormBuilder,
    private _candidateServe: CandidateService,
    private _share: ShareService,
    private _exGlobal: ExternalUserGlobalApiService,
  ) { }

  ngOnInit(): void {
    this.formInit();
    this.getInfogainLocations();
  }

  /***
   * gertLocationMaster
   */
   public locList: any = [];
   getInfogainLocations() {
     this._exGlobal.getInfogainLocations().subscribe(
       res => {
         this.locList = res['data']
       }
     )
   }

   /**
   * get Control
   */

  getControl(name: string) {
    return this.otherInfoForm.get(name);
  }


  //init form
  formInit() {
    this.otherInfoForm = this._fb.group({
      locationConsent: [null,[Validators.required]],
      prefLocId: [this.data?.locationPreferenceId? this.data?.locationPreferenceId:null,[Validators.required]],
      strengthsImpArea: [this.data?.strengthsImprovementArea? this.data?.strengthsImprovementArea:null,[Validators.required]],
      techAreaImprove: [this.data?.techAreaImprove? this.data?.techAreaImprove:null,[Validators.required]],
    });
    
  }

  /***
   * update other info form- to server
   */
  updateOtherInfoForm(form: any) {
    form.markAllAsTouched();
    if (this.otherInfoForm.valid) {
      let formValue = form.value;
      if(formValue['locationConsent']){
        formValue['locationConsent'] = formValue['locationConsent'] == true? 1:0;
      }
      this._candidateServe.updateOtherInfoDetails(formValue).subscribe(
        res => {
          this._share.showAlertSuccessMessage.next(res)
        }
      )
      this.dialogRef.close(true);
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

