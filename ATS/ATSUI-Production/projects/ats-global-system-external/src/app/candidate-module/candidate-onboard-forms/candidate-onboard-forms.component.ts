import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { SignatureCaptureComponent } from '../../common-sharing/modal/signature-capture/signature-capture.component';
import { ShareService } from '../../core/services/share.service';
import { ConfirmationDialogComponent } from '../../shared/shared-app/components/confirmation-dialog/confirmation-dialog.component';
import { CandidateService } from '../candidate.service';
import { AccesscardFormComponent } from './modal/accesscard-form/accesscard-form.component';
import { JoiningFormComponent } from './modal/joining-form/joining-form.component';
import { PersonalDtgFormComponent } from './modal/personal-dtg-form/personal-dtg-form.component';
import { SudexoFormComponent } from './modal/sudexo-form/sudexo-form.component';
import { UndertakingCurrentAddressComponent } from './modal/undertaking-current-address/undertaking-current-address.component';
import { UndertakingPendingDocsComponent } from './modal/undertaking-pending-docs/undertaking-pending-docs.component';
import { UploadFormsModalComponent } from './modal/upload-forms-modal/upload-forms-modal.component';
import { GetSetStorageService } from '../../core/services/get-set-storage.service';

@Component({
  selector: 'app-candidate-onboard-forms',
  templateUrl: './candidate-onboard-forms.component.html',
  styleUrls: ['./candidate-onboard-forms.component.scss']
})
export class CandidateOnboardFormsComponent implements OnInit {
  displayedColumns = ['Name', 'status', 'action'];
  public submitOnboardingForm: UntypedFormGroup = new UntypedFormGroup({});
  public onBoardCandidateList: any = [];
  public userData: any = {};
  private candidateId =  this._storage.getCandidateId();
  constructor(
    public dialog: MatDialog,
    private _candidateServe: CandidateService,
    private _share: ShareService,
    private _fb: UntypedFormBuilder,
    private _http:HttpClient,
    private _storage: GetSetStorageService
  ) { }

  ngOnInit(): void {
    this.userData = this._storage.getSetUserData();
    this.getOnboardingFormDetails();
    this.getCandidatePersonalDetails();
    this.formInit();
  }

  //init form
  formInit() {
    this.submitOnboardingForm = this._fb.group({
      iConfirmedCheckBox: [null, [Validators.required]]
    })
  }

  //get onboarding form details
  getOnboardingFormDetails() {
    this._candidateServe.getOnboardingFormDetails(1).subscribe(
      res => {
        this.onBoardCandidateList = res['data'];
        this.getIndividualFormStatus();
      }
    )
  }

  public anyFormRef: string = 'N';
  public referredBackForms = [];
  public pendingForms = [];
  getIndividualFormStatus() {
    this.referredBackForms = this.onBoardCandidateList.filter(d => d.Status == 'R');
    if (this.referredBackForms.length) {
      this.anyFormRef = 'Y';
    } else {
      this.anyFormRef = 'N';
    }
    
    // this.pendingForms = this.onBoardCandidateList.filter(d => d.Status == 'P' && d.Id !=335);
   let pendingFilter = this.onBoardCandidateList.filter(d => d.Status == 'P' && d.Id !=335);
  //  Cancelled Cheque/Bank Statement for pf  11278
   if(this.userData?.IsAVPUp == 'Y'){
    this.pendingForms = pendingFilter.filter(d => d.Status == 'P' && d.Id !=12273);
   }else{
    this.pendingForms = pendingFilter;
   }
  }

  public candidatePersonalDetails: any = {};
  public isEditable: boolean = true;
  //get candidate personal details
  getCandidatePersonalDetails() {
    this._candidateServe.getCandidatePersonalDetails(this.candidateId).subscribe(
      res => {
        this.candidatePersonalDetails = res['data'][0];
        if (this.candidatePersonalDetails?.onboardFormStatus != null) {
          if (this.candidatePersonalDetails?.onboardFormStatus == 100 || this.candidatePersonalDetails?.onboardFormStatus == 120) {
            this.isEditable = false;
          }
          else {
            this.isEditable = true;
          }
        } else {
          this.isEditable = true;
        }
      }
    )
  }

  isDwnload(element: any = {}) {
   if (element['formTypeId'] === 7 ||
       element['formTypeId'] === 8 ||
       element['formTypeId'] === 9 ||
       element['formTypeId'] === 10 ||
       element['formTypeId'] === 11 ||
       element['formTypeId'] === 12 ||
       element['formTypeId'] === 27 ||
       element['formTypeId'] === 28 ||
       element['formTypeId'] === 29) {
      return true;
    
    }
    else{
      return false;
    }
    
  }
  /***
   * open forms
   */
  openFormModal(element: any = {},typeBtn): void {
    
    if (element['formTypeId'] === 1) {
      this.personalDetailsForm(element);
    }
    else if (element['formTypeId'] === 2) {
      this.accesscardFormModal(element);
    }
    else if (element['formTypeId'] === 3) {
      this.joiningReportForm(element);
    }
    else if (element['formTypeId'] === 4) {
      this.underakingCurrentAddress(element);
    }
    else if (element['formTypeId'] === 5) {
      this.UndertakingPendingDocs(element);
    } else if (element['formTypeId'] === 6) {
      this.SodexoBenefitForm(element);
    }
    else if (element['formTypeId'] === 7) {
      element['title'] = "Form 11";
      if (typeBtn == 2 || (!this.isEditable || element?.Status == 'V')) {
        this.downloadForm(element['formTypeId']);
      } else {
        this.docFormUpload(element);
      }
    }
    else if (element['formTypeId'] === 8) {
      element['title'] = "Form 2PF";
      if (typeBtn == 2 || (!this.isEditable || element?.Status == 'V')) {
        this.downloadForm(element['formTypeId']);
      } else {
        this.docFormUpload(element);
      }
    }
    else if (element['formTypeId'] === 9) {
      element['title'] = "Form F";
      if (typeBtn == 2 || (!this.isEditable || element?.Status == 'V')) {
        this.downloadForm(element['formTypeId']);
      } else {
        this.docFormUpload(element);
      }
    }
    else if (element['formTypeId'] === 10) {
      element['title'] = "Form 1";
      if (typeBtn == 2 || (!this.isEditable || element?.Status == 'V')) {
        this.downloadForm(element['formTypeId']);
      } else {
        this.docFormUpload(element);
      }
    }
    else if (element['formTypeId'] === 11) {
      element['title'] = "Form Q";
      if (typeBtn == 2 || (!this.isEditable || element?.Status == 'V')) {
        this.downloadForm(element['formTypeId']);
      } else {
        this.docFormUpload(element);
      }
    }
    else if (element['formTypeId'] === 12) {
      element['title'] = "SEZ Form";
      if (typeBtn == 2 || (!this.isEditable || element?.Status == 'V')) {
        this.downloadForm(element['formTypeId']);
      } else {
        this.docFormUpload(element);
      }
    }
    else if (element['formTypeId'] === 27) {
      element['title'] = "HDFC Happay Card Application";
      if (typeBtn == 2 || (!this.isEditable || element?.Status == 'V')) {
        this.downloadForm(element['formTypeId']);
      } else {
        this.docFormUpload(element);
      }
    }
    else if (element['formTypeId'] === 28) {
      element['title'] = "Form I_Payment of Wages";
      if (typeBtn == 2 || (!this.isEditable || element?.Status == 'V')) {
        this.downloadForm(element['formTypeId']);
      } else {
        this.docFormUpload(element);
      }
    }
    else if (element['formTypeId'] === 29) {
      element['title'] = "EPF_Form_11-OpenFile";
      if (typeBtn == 2 || (!this.isEditable || element?.Status == 'V')) {
        this.downloadForm(element['formTypeId']);
      } else {
        this.docFormUpload(element);
      }
    }
    
    else if (element['formTypeId'] === 32) {
      element['title'] = "Cancelled Cheque / Bank Statement - For PF";
      if (typeBtn == 2 || (!this.isEditable || element?.Status == 'V')) {
        this.downloadForm(element['formTypeId']);
      } else {
        this.docFormUpload(element);
      }
    }

  }

  /***
  * accesscardFormModal
  */
  accesscardFormModal(element: any = {}): void {
    // let formStatus = this.referredBackForms.filter(d => d?.formTypeId == element['formTypeId'])[0]?.Status;
    element['title'] = "Access Card Form";
    element['isEditable'] = (this.isEditable && element?.Status != 'V');
    element['candidatePersonalDetails'] = this.candidatePersonalDetails;
    element['candidateId'] = this.candidateId;
    const dialogRef = this.dialog.open(AccesscardFormComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'onboard-form-modal'],
      data: element,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.getOnboardingFormDetails();
        }
      }
    )

  }
  /***
   * joiningReportForm
   */
  joiningReportForm(element: any = {}): void {
    element['title'] = "Joining Report Form";
    element['isEditable'] = (this.isEditable && element?.Status != 'V');
    element['candidatePersonalDetails'] = this.candidatePersonalDetails;
    element['candidateId'] = this.candidateId;
    const dialogRef = this.dialog.open(JoiningFormComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'onboard-form-modal'],
      data: element,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.getOnboardingFormDetails();
        }
      }
    )

  }

  /***
   * personalDetailsForm
   */
  personalDetailsForm(element: any = {}): void {
    // let formStatus = this.referredBackForms?.filter(d => d?.formTypeId == 1)[0]?.Status;
    element['title'] = "Personal information Form";
    element['isEditable'] = (this.isEditable && element?.Status != 'V');
    element['candidatePersonalDetails'] = this.candidatePersonalDetails;
     element['candidateId'] = this.candidateId;
    const dialogRef = this.dialog.open(PersonalDtgFormComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'onboard-form-modal'],
      data: element,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.getOnboardingFormDetails();
        }
      }
    )

  }

  /***
  * underakingCurrentAddress
  */
  underakingCurrentAddress(element: any = {}): void {
    element['title'] = "Undertaking for Current Address Proof";
    element['isEditable'] = (this.isEditable && element?.Status != 'V');
    element['candidatePersonalDetails'] = this.candidatePersonalDetails;
    element['candidateId'] = this.candidateId;
    const dialogRef = this.dialog.open(UndertakingCurrentAddressComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'onboard-form-modal'],
      data: element,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.getOnboardingFormDetails();
        }
      }
    )

  }

  /***
   * UndertakingPendingDocs
   */
  UndertakingPendingDocs(element: any = {}): void {
    element['title'] = "Undertaking For Pending Documents";
    element['isEditable'] = (this.isEditable && element?.Status != 'V');
    element['candidatePersonalDetails'] = this.candidatePersonalDetails;
    element['candidateId'] = this.candidateId;
    const dialogRef = this.dialog.open(UndertakingPendingDocsComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'onboard-form-modal'],
      data: element,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.getOnboardingFormDetails();
        }
      }
    )

  }

  /***
   * sodexo benefit form
   */
  SodexoBenefitForm(element: any = {}): void {
    element['title'] = "Sodexo Benefit Form";
    element['isEditable'] = (this.isEditable && element?.Status != 'V');
    element['candidatePersonalDetails'] = this.candidatePersonalDetails;
    element['candidateId'] = this.candidateId;
    const dialogRef = this.dialog.open(SudexoFormComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'onboard-form-modal'],
      data: element,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.getOnboardingFormDetails();
        }
      }
    )

  }
  /***
  * docFormUpload
  */
  docFormUpload(element: any = {}): void {
    element['candidatePersonalDetails'] = this.candidatePersonalDetails;
    element['isEditable'] = (this.isEditable && element?.Status != 'V');
    element['candidateId'] = this.candidateId;
    const dialogRef = this.dialog.open(UploadFormsModalComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'onboard-form-modal', 'onboard-form-file-modal'],
      data: element,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.getOnboardingFormDetails();
        }
      }
    )

  }

  /***
  * accesscardFormModal
  */
  signt(element: any = {}): void {
    element['titleSignModal'] = " Add Education Details";

    const dialogRef = this.dialog.open(SignatureCaptureComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'add-signature-modal'],
      data: element,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
        }
      }
    )
  }

  /***
   * submit pending docs undertaking form
   */
  SubmitOnboardingForm(form: UntypedFormGroup) {
    
    let body = form?.value;
    if (!body['iConfirmedCheckBox']) {
      this._share.showAlertErrorMessage.next('Please provide your consent.');
      return false;
    }
    if (this.pendingForms?.length > 0) {
      this._share.showAlertErrorMessage.next('Please fill all pending onboarding forms first');
      return false;
    }
    if (this.referredBackForms?.length > 0) {
      this._share.showAlertErrorMessage.next('Please fill referred back onboarding forms first');
      return false;
    }
    form.markAllAsTouched();
    if (this.submitOnboardingForm.valid) {
      this.confirmAlertSubmit(form);
    }
    else {
      this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
    }
  }

  finalSubmitOnbForms(form: UntypedFormGroup) {

    let body = form?.value;
      if (body['iConfirmedCheckBox']) {
        body['consent'] = true ? 'Y' : 'N';
      }
      this._candidateServe.SubmitOnboardFormByCandidate(body).subscribe(
        res => {
          this._share.showAlertSuccessMessage.next(res);
          this.getOnboardingFormDetails();
          this.getCandidatePersonalDetails();
        }
      );
      // this.dialogRef.close();
  }

  /***
   * confirmation before sumbit
   */

  confirmAlertSubmit(form: UntypedFormGroup) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      panelClass: 'ats-confirm',
      data: {
        headerText: 'Alert',
        message: `Are you sure and want to submit? Please verify all forms then submit. <br>Once submitted, it cannot to be changed.`,
        buttonText: {
          ok: "Yes",
          cancel: "No"
        },
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.finalSubmitOnbForms(form);
      }
    });

  }

  downloadForm(formId: number) {
    let form = this.onBoardCandidateList.filter(d => d.formTypeId == formId);
    let filePath = `${form[0].FormFilePath}\\${form[0].FormFileName}`;
    let fileName = `${form[0].FormFileName}`
    this._candidateServe.downloadSignature(formId, fileName);
  }

   /***
   * downloadDocuments
   */
    // downloadForm(Id: number) {
    //   this._http.get(`${environment.apiMainUrlNet}Candidate/downloadUploadedOnbDocById?Id=${Id}&Type=F`, { responseType: 'blob' }).subscribe(
    //     res => {
    //       saveAs(res, 'sample');
    //       setTimeout(() => {
    //         this._share.showAlertSuccessMessage.next('File downloaded successfully.')
    //       }, 1000);
    //     }
    //   )
    // }

  previewSavedGovtForms(ele:any){
    if(ele?.Status === 'D' && 
    (ele?.formTypeId == 7 || ele?.formTypeId == 8 || ele?.formTypeId == 9 ||
      ele?.formTypeId == 10 || ele?.formTypeId == 11 || ele?.formTypeId == 12 ||
      ele?.formTypeId == 27 || ele?.formTypeId == 28 || ele?.formTypeId == 29)){
        return true;
    }else{
      return false;
    }
  }

}
