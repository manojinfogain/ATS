import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { GlobalCommonMethodService } from 'projects/ats-global-system/src/app/core/common/global-common-method.service';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { ConfirmReferbackMailModalComponent } from '../../../modals/confirm-referback-mail-modal/confirm-referback-mail-modal.component';
import { OnbVerificationModalComponent } from '../../../modals/onb-verification-modal/onb-verification-modal.component';
import { OnboardService } from '../../../onboard.service';
import { OnboardFormModalComponent } from '../onboard-form-modal/onboard-form-modal.component';
import { DayOneFormModalIComponent } from '../day-one-form-modal-i/day-one-form-modal-i.component';
import { OnboardCommonMethod } from 'projects/ats-global-system/src/app/core/common/onboard-common-method';
import { HttpClient } from '@angular/common/http';
import { ConfirmationDialogComponent } from 'projects/ats-global-system/src/app/shared/shared-app/components/confirmation-dialog/confirmation-dialog.component';


@Component({
  selector: 'app-candidate-onboard-forms',
  templateUrl: './candidate-onboard-forms.component.html',
  styleUrls: ['./candidate-onboard-forms.component.scss']
})
export class CandidateOnboardFormsComponent implements OnInit {
  public formAppearance: string = 'fill';
  public formClass: string = 'form-fill-ats';
  public verificationForm: UntypedFormGroup = new UntypedFormGroup({});
  public userData: any = {};
  displayedColumns = ['Name', 'status', 'updateBy', 'updateOn','verifyRem', 'action'];
  displayedColumns1 = ['docName','orgName', 'submissionDate','status', 'action'];
  public onBoardCandidateList: any = [];
  public onBoardDay1CandidateList: any = [];
  public persInfoFormDetails: any = [];
  public accCardFormDetails: any = [];
  public pendingDocFormDetails: any = [];
  public sodexoFormDetails: any = [];
  public joiningRepFormDetails: any = [];
  public currAddrFormDetails: any = [];
  public pendingDocList: any = [];
  constructor(
    public dialogRef: MatDialogRef<CandidateOnboardFormsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private _onboardServ: OnboardService,
    private _fb: UntypedFormBuilder,
    private _share: ShareService,
    private _storage: GetSetStorageService,
    private _GlobCommon: GlobalCommonMethodService,
    private _http:HttpClient
  ) {
  }

  public step: number = 0;
  setStep(index: number) {
    this.step = index;
  }


  public isHideNextButton: boolean = false;
  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }


  public uploadedDocumentLists:any =[];
  ngOnInit(): void {
    this.userData = this._storage.getSetUserData();
    this.getOnboardingFormDetails();
    this._onboardServ.getCanddiateDocumentList(this.data.candidateId).subscribe(
      res=>{
        this.uploadedDocumentLists = res['data'];
      }
    )
    this._onboardServ.getOnboardingFormDetails(this.data?.candidateId, 2).subscribe(
      res => {
        this.onBoardDay1CandidateList = res['data'];
      }
    );
    this.getCandidatePersonalDetails();
    this.verificationForm = this._fb.group({
      status: [null, Validators.required],
      mailBody: [null],
      mailSubject: [null],
      formSelection: [0]
    })

  }

  ngAfterViewInit() {

  }

  public candidatePersonalDetails: any = {};
  //get candidate personal details
  getCandidatePersonalDetails() {
    this._onboardServ.getCandidatePersonalDetails(this.data?.candidateId).subscribe(
      res => {
        this.candidatePersonalDetails = res['data'][0];

      }
    )
  }
  
  public onboradFormListFailed: any = [];
  public onboradFormListSuccess: any = [];
  public isOnboardVerificationFailed: boolean = false;
  public isOnboardVerificationSuccess: boolean = false;
  public isOnboardVerificationPending: boolean = false;
  //get onboarding form details
  getOnboardingFormDetails() {
    this._onboardServ.getOnboardingFormDetails(this.data?.candidateId, 1).subscribe(
      res => {
        this.onBoardCandidateList = res['data'];
        this.onboradFormListFailed = res['data'].filter(d => d.Status === 'R');
        this.onboradFormListSuccess = res['data'].filter(d => d.Status === 'V');
        
        if(this.onboradFormListFailed.length > 0){
          this.isOnboardVerificationFailed = true;
          this.isOnboardVerificationSuccess= false;
          this.isOnboardVerificationPending= false;
          this.isEmail = true;
          this.getControl('status').patchValue('0');
          // this.getControl('mailSubject').addValidators([Validators.required]);
           this.getControl('mailBody').addValidators([Validators.required]);
           this.getControl('mailBody').updateValueAndValidity();
        }
        else if( this.onBoardCandidateList.length == this.onboradFormListSuccess.length){
          this.getControl('status').patchValue('1');
           this.getControl('mailBody').clearValidators();
           this.getControl('mailBody').updateValueAndValidity();
           this.isEmail = false;
           this.isOnboardVerificationFailed = false;
           this.isOnboardVerificationSuccess= true;
           this.isOnboardVerificationPending= false;
        }
        else{
          this.getControl('mailBody').clearValidators();
          this.getControl('mailBody').updateValueAndValidity();
          this.getControl('status').reset();
          this.isEmail = false;
          this.isOnboardVerificationFailed = false;
           this.isOnboardVerificationSuccess= false;
           this.isOnboardVerificationPending= true;
        }
        this.pendingDocList = res['pendingdocs'];
        this.persInfoFormDetails = this.onBoardCandidateList.filter(d => d.formTypeId === 1);
        this.accCardFormDetails = this.onBoardCandidateList.filter(d => d.formTypeId === 2);
        this.pendingDocFormDetails = this.onBoardCandidateList.filter(d => d.formTypeId === 5);
        this.sodexoFormDetails = this.onBoardCandidateList.filter(d => d.formTypeId === 6);
        this.joiningRepFormDetails = this.onBoardCandidateList.filter(d => d.formTypeId === 3);
        this.currAddrFormDetails = this.onBoardCandidateList.filter(d => d.formTypeId === 4);
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
  openFormModal(element: any = {}): void {
    if (element['formTypeId'] === 1) {
      element['title'] = "Personal information Form";
      element['candidatePersonalDetails'] = this.candidatePersonalDetails;
      element['persInfoFormDetails'] = this.persInfoFormDetails[0];
      this.OnboardFormModal(element);
    }
    else if (element['formTypeId'] === 2) {
      element['title'] = "Access Card Form";
      element['candidatePersonalDetails'] = this.candidatePersonalDetails;
      element['accCardFormDetails'] = this.accCardFormDetails[0];
      this.OnboardFormModal(element);
    }
    else if (element['formTypeId'] === 3) {
      element['title'] = "Joining Report";
      element['candidatePersonalDetails'] = this.candidatePersonalDetails;
      element['joiningRepFormDetails'] = this.joiningRepFormDetails[0];
      this.OnboardFormModal(element);
    }
    else if (element['formTypeId'] === 4) {
      element['title'] = "Undertaking for Current Address Proof";
      element['candidatePersonalDetails'] = this.candidatePersonalDetails;
      element['currAddrFormDetails'] = this.currAddrFormDetails[0];
      this.OnboardFormModal(element);
    }
    else if (element['formTypeId'] === 5) {
      element['title'] = "Undertaking For Pending Documents";
      element['candidatePersonalDetails'] = this.candidatePersonalDetails;
      element['pendingDocFormDetails'] = this.pendingDocFormDetails[0];
      element['pendingDocList'] = this.pendingDocList;
      this.OnboardFormModal(element);
    }
    else if (element['formTypeId'] === 6) {
      element['title'] = "Sodexo Benefit Form";
      element['candidatePersonalDetails'] = this.candidatePersonalDetails;
      element['sodexoFormDetails'] = this.sodexoFormDetails[0];
      this.OnboardFormModal(element);
    }
    else if (element['formTypeId'] === 7) {
      element['title'] = "Form 11";
      this.downloadForm(element);
    } else if (element['formTypeId'] === 8) {
      element['title'] = "Form - 2PF";
      this.downloadForm(element);
    }
    else if (element['formTypeId'] === 9) {
      element['title'] = "Form - F";
      this.downloadForm(element);
    }
    else if (element['formTypeId'] === 10) {
      element['title'] = "Form - I";
      this.downloadForm(element);
    }
    else if (element['formTypeId'] === 11) {
      element['title'] = "Form - Q";
      this.downloadForm(element);
    }
    else if (element['formTypeId'] === 12) {
      element['title'] = "SEZ Form";
      this.downloadForm(element);
    }
    else if (element['formTypeId'] === 27) {
      element['title'] = "HDFC Happay Card Application";
      this.downloadForm(element);
    }
    else if (element['formTypeId'] === 28) {
      element['title'] = "Form I_Payment of Wages";
      this.downloadForm(element);
    }
    else if (element['formTypeId'] === 29) {
      element['title'] = "EPF_Form_11-OpenFile";
      this.downloadForm(element);
    }
    else if (element['formTypeId'] === 32) {
      element['title'] = "Cancelled Cheque / Bank Statement - For PF";
      this.downloadForm(element);
    }
  }

  /***
  * personalDetailsForm
  */
  OnboardFormModal(element: any = {}): void {
    const dialogRef = this.dialog.open(OnboardFormModalComponent, {
      panelClass: ['ats-model-wrap', 'ats-model-full-screen', 'onboard-form-modal-preview'],
      data: element,
      disableClose: true,
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%'
    });
    dialogRef.afterClosed().subscribe(
      result => {
        document.title = 'Onboarding Form'
        if (result) {
        }
      }
    )

  }

  /***
   * verficstion modal
   */

  openVerificationModal(element: any) {
    // element['cid'] = this.data.cid;
    element['Candidateid'] =  this.data?.candidateId;
    debugger
    element['srcType'] = 'ONB';
    if (element['formTypeId'] === 1) {
      element['title'] = "Personal information Form Verification";
    }
    else if (element['formTypeId'] === 2) {
      element['title'] = "Access Card Form Verification";
    }
    else if (element['formTypeId'] === 3) {
      element['title'] = "Joining Report Form Verification";
    }
    else if (element['formTypeId'] === 4) {
      element['title'] = "Undertaking of current address Verification";
    }
    else if (element['formTypeId'] === 5) {
      element['title'] = "Undertaking of pending documents Verification";
    }
    else if (element['formTypeId'] === 6) {
      element['title'] = "Sodexo Benefit Form Verification";
    }
    else if (element['formTypeId'] === 7) {
      element['title'] = "Form - 11 Verification";
    }
    else if (element['formTypeId'] === 8) {
      element['title'] = "Form - 2PF Verification";
    }
    else if (element['formTypeId'] === 9) {
      element['title'] = "Form - F Verification";
    }
    else if (element['formTypeId'] === 10) {
      element['title'] = "Form - I Verification";
    }
    else if (element['formTypeId'] === 11) {
      element['title'] = "Form - Q Verification";
    }
    else if (element['formTypeId'] === 12) {
      element['title'] = "SEZ Form Verification";
    }
    const dialogRef = this.dialog.open(OnbVerificationModalComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'onb-verification-modal', 'ats-header-text-cap',],
      data: element,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(
      get => {
        if (get) {
          this.getOnboardingFormDetails();
        }
      }
    )
  }

  getControl(name: string) {
    return this.verificationForm.get(name);
  }

  /***
   * resend pre onb form email
   */
    ResendPreOnbFormEmail(data:any){
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        panelClass: 'ats-confirm',
        data: {
          headerText: 'Alert',
          message: ` Are you sure you want to send Pre-Onboarding form again ?`,
          buttonText: {
            ok: "Yes",
            cancel: "No"
          },
        }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
         
          this._onboardServ.ResendOnboardingFormMailer(data?.cid).subscribe(
            res => {
              
              this._share.showAlertSuccessMessage.next(res);
            }
          )
        }
      });
    }
  

  /**
   * submit
   */
  submitRequest(form: UntypedFormGroup) {
    form.markAllAsTouched();
    
    if (form.valid) {
      let formData = form.value;
      let body = {};
      // body['cid'] = this.data?.cid;
      body['Candidateid'] = this.data?.candidateId;
      body['Consent'] = formData['status'] == 0 ? 'N' : 'Y';
      body['mailBody'] = formData['mailBody'];
      // body['mailSubject'] = formData['mailSubject'];
      // if (this.getControl('status')?.value == 0) {
      //   this.confirmMailSendToCandidate(this.data, body);
      // } else {
        this._onboardServ.FinalVerificationOnboardingForm(body).subscribe(
          res => {
            this._share.showAlertSuccessMessage.next(res);
            this.dialogRef.close(true)
          }
        )
      // }

    }
    else {
      if (this.getControl('status').invalid) {
        this._share.showAlertErrorMessage.next('Please  provide your consent.')
      }
      else if (this.getControl('mailBody').invalid) {
        this._share.showAlertErrorMessage.next('Please  enter Remarks.')
      }
      // else if (this.getControl('mailSubject').invalid) {
      //   this._share.showAlertErrorMessage.next('Please  enter Email Subject.')
      // }
      else {
        this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
      }
    }
  }

  /***
   * Mail SendTo Candidate
   */

  // confirmMailSendToCandidate(elm, body) {
  //   elm['headerText'] = `Preview Mail - Referred Back to ${elm?.Name}`;
  //   elm['buttonText'] = { ok: "OK", cancel: "Cancel" };
  //   elm['userData'] = this.userData;
  //   elm['subject'] = body?.mailSubject;
  //   elm['mailBody'] = body?.mailBody;

  //   const dialogRef = this.dialog.open(ConfirmReferbackMailModalComponent, {
  //     panelClass: ['ats-confirm', 'ats-confirm-width'],
  //     data: elm,
  //     width: '500px',
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       this._onboardServ.FinalVerificationOnboardingForm(body).subscribe(
  //         res => {
  //           this._share.showAlertSuccessMessage.next(res);
  //           this.dialogRef.close(true)
  //         }
  //       )
  //     }

  //   });
  // }

  //to download govt forms
  // downloadForm(formId: number) {
  //   let form = this.onBoardCandidateList.filter(d => d.formTypeId == formId);
  //   let filePath = `${form[0].FormFilePath}\\${form[0].FormFileName}`;
  //   let fileName = `${form[0].FormFileName}`
  //   this._GlobCommon.downloadFileCommon(filePath, fileName)  
  // }

  //to download govt forms
  downloadForm(element: any) {    
    element['documentName'] = element?.Name
    element['fileName'] = element?.documentName;
    element['type'] = 'docid';
    element['id'] = element?.Id;
    element['docType'] = 'O';
    OnboardCommonMethod.downloadPrevDocuments(element,this._http,this.dialog,this._share);
  }

  /**
  * 
  */
  public isEmail: boolean = false;
  consentUp(e: any) {
    if (e.value == '0') {
      this.isEmail = true;
      // this.getControl('mailSubject').addValidators([Validators.required]);
      this.getControl('mailBody').addValidators([Validators.required]);
    }
    else {
      // this.getControl('mailSubject').clearValidators();
      this.getControl('mailBody').clearValidators();
      this.isEmail = false;
    }
    // this.getControl('mailSubject').updateValueAndValidity();
    this.getControl('mailBody').updateValueAndValidity();

  }

  //enable/disable verify button
  showVerifyButton(element) {
    if (element?.Status == 'S' || element?.Status == 'R') {
      return true;
    } else {
      return false;
    }
  }

 /***
   * open modal 
   */
 openDocDiaolog(element: any = {}): void {
  
  element['title']=element?.Name;
  const dialogRef = this.dialog.open(DayOneFormModalIComponent, {
    width: '500px',
    panelClass: ['ats-model-wrap','ats-model-full-screen'],
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

getVerifyStatus(candidateStatus: any, status: string){
  console.log(status,candidateStatus);
  // (status=='S' || status=='V' || status=='R') && candidateStatus==120
  if((status=='S' || status=='V' || status=='R') && candidateStatus==120){
    return false;
  }else{
    return true;
  }
 }

  closeModal(): void {
    this.dialogRef.close();
  }


}
