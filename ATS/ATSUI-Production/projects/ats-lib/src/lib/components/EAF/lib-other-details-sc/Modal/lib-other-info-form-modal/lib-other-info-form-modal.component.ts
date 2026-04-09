
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { LibCandidateService } from 'projects/ats-lib/src/lib/services/lib-candidate.service';
import { LibExternalUserGlobalApiService } from 'projects/ats-lib/src/lib/services/lib-external-user-global-api.service';
import { LibShareService } from 'projects/ats-lib/src/lib/services/lib-share.service';

@Component({
  selector: 'lib-other-info-form-modal',
  templateUrl: './lib-other-info-form-modal.component.html',
  styleUrls: ['./lib-other-info-form-modal.component.scss']
})
export class LibOtherInfoFormModalComponent implements OnInit {
  public appearance: string = 'fill';
  public formClass: string = 'form-fill-ats'
  public otherInfoForm: UntypedFormGroup = new UntypedFormGroup({});
  public reqDetails: boolean = false;
  public apiBaseUrlCand:string = '';
  public apiBaseUrlMaster:string = '';
  constructor(
    public dialogRef: MatDialogRef<LibOtherInfoFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: UntypedFormBuilder,
    private _candidateServe: LibCandidateService,
    private _share: LibShareService,
    private _exGlobal: LibExternalUserGlobalApiService,
  ) { }

  ngOnInit(): void {
    this.apiBaseUrlCand = this.data?.apiBaseUrlCand;
    this.apiBaseUrlMaster = this.data?.apiBaseUrlMaster;
    this.formInit();
    this.getInfogainLocations();
  }

  /***
   * gertLocationMaster
   */
   public locList: any = [];
   getInfogainLocations() {
     this._exGlobal.getInfogainLocations(this.apiBaseUrlMaster).subscribe(
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
      this._candidateServe.updateOtherInfoDetails(this.apiBaseUrlCand,formValue).subscribe(
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

