import { AfterContentInit, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Form, UntypedFormGroup } from '@angular/forms';
import { MatLegacyTabGroup as MatTabGroup } from '@angular/material/legacy-tabs';
import { forkJoin } from 'rxjs';
import { GlobalMethod } from 'projects/ats-global-system-external/src/app/core/common/global-method';
import { ShareService } from 'projects/ats-global-system-external/src/app/core/services/share.service';
import { CandidateService } from '../candidate.service';
import { CandidateScreenTab } from '../../core/models/common-model';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { GetSetStorageService } from '../../core/services/get-set-storage.service';
import { GlobalCommonMethodService } from '../../core/common/global-common-method.service';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { ConfirmationDialogComponent } from '../../shared/shared-app/components/confirmation-dialog/confirmation-dialog.component';
import { Day1DisclaimerModalComponent } from '../candidate-day-one-forms/modal/day1-disclaimer-modal/day1-disclaimer-modal.component';
import { environment } from 'projects/ats-global-system-external/src/environments/environment';
import { UserAuthService } from '../../core/authentication/user-auth.service';
import { ConfirmIfBgSubmittedComponent } from '../modals/confirm-if-bg-submitted/confirm-if-bg-submitted.component';
@Component({
  selector: 'app-candidate-details-onboard',
  templateUrl: './candidate-details-onboard.component.html',
  styleUrls: ['./candidate-details-onboard.component.scss']
})
export class CandidateDetailsOnboardComponent implements OnInit, AfterViewInit {
  public formAppearance: string = 'fill';
  public formClass: string = 'form-fill-ats';
  public selectedTabIndex: number = 0;
  public isPrevBtnShow: boolean = false;
  public isNextBtnShow: boolean = true;
  public isSubmitBtnShow: boolean = false;
  @ViewChild("atsOnTab", { static: false }) matTabAts: MatTabGroup;
  @ViewChild("personalDetailsCom", { static: false }) personalDetailsCom;
  @ViewChild("salaryDetailsCom", { static: false }) salaryDetailsCom;
  @ViewChild("otherDetailsCom", { static: false }) otherDetailsCom;
  private candidateId =  this._storage.getCandidateId();
  
  // @ViewChild("iConfirmedCheckBox") iConfirmedCheckBox: ElementRef;
  public personalDetailsForm: UntypedFormGroup;
  candidateTabConfig: CandidateScreenTab = new CandidateScreenTab();
  tabConfigSubs: Subscription;
  public apiBaseUrlMaster: string = `${environment.apiMainUrlNet}master`;
  public apiBaseUrlCand: string = `${environment.apiMainUrlNet}Candidate`;
  
  constructor(
    private _candidateServe: CandidateService,
    private _share: ShareService,
    public dialog: MatDialog,
    private _storage: GetSetStorageService,
    private _globalMethod: GlobalCommonMethodService,
    private _userAuth: UserAuthService
  ) {
  }

  public uploadedDocumentLists: any = [];
  public candidatePersonalDetails: any = {};
  public salaryDetails: any = {};
  public educationList: any = [];
  public familyDataList: any = [];
  public trainingDataList: any = [];
  public employmentDataList: any = [];
  public previousEmploymentList: any = [];
  public userData: any = {};
  ngOnInit(): void {
    this.excuteAllAPI();
    this.activeTabDetection();
    this.userData = this._storage.getSetUserData();
  }

  excuteAllAPI() {
    forkJoin([
      this._candidateServe.getCanddiateDocumentList(this.candidateId),
      this._candidateServe.getCandidateSalaryDetails(),
      this._candidateServe.getEducationDetails(this.candidateId),
      this._candidateServe.getCandidateFamilyDetails(),
      this._candidateServe.getTrainingDetails(),
      this._candidateServe.getEmploymentDetails(),
      this._candidateServe.getCandidatePersonalDetails(this.candidateId),
      this._candidateServe.getCandidatePreviousEmploymentDetails(),

    ]).subscribe(
      res => {
        this.uploadedDocumentLists = res[0]['data'];
        this.salaryDetails = res[1]['data'][0];
        this.educationList = res[2]['data'];
        this.familyDataList = res[3]['data'];
        this.trainingDataList = res[4]['data'];
        this.employmentDataList = res[5]['data'];
        this.candidatePersonalDetails = res[6]['data'][0];
        this.previousEmploymentList = res[7]['data'];
        this.expStored();
        this.getScreenDetails();

        this.tabEnabledDisabled();

      }
    )
  }

  /***
   * get Screen
   */
  public profileCompletionPercent: number = 0;
  public isBGVFormSubmitted: boolean = false;
  getScreenDetails() {
    this._candidateServe.getScreenDetails().subscribe(
      res => {
        let data = res['data'][0];
        this._storage.setIsFinalStatud(data?.final_status);
        this._storage.setOnboardStatus(data?.onboardStatus);
        this.profileCompletionPercent = data?.profileCompletionPercent;
        this._storage.setIsDeclarationDone(data?.IsDeclarationDone);
        this._userAuth.consentModalOpen();
        this.isBGVFormSubmitted = data?.isBGVFormSubmitted;
      }
    )
  }

  /***
   * data Stored
   */
  expStored() {
    let expData: any = {
      year: this.candidatePersonalDetails?.totalExp,
      month: this.candidatePersonalDetails?.totalExpMonth
    }
    this._storage.setCandExp(expData);
  }


  /***
   * tab 
   */
  public mandatoryDocListLength: number = 7;
  tabEnabledDisabled() {
    this.candidateTabConfig = new CandidateScreenTab();
    // let getMandlistFam = this.familyDataList.filter(r => r.relationship == 6 || r.relationship == 9);
    let getMandlistFam = this.familyDataList

    let getMandlistEdu = this.educationList.filter(r => r.courseId == 12);
    let requireDocsId: any = [13, 6, 5, 4, 3, 9, 10, 11];
    // [13,6,5,4,3,9,10,11,14,1,2];
    if (this.previousEmploymentList?.length != 0) {
      if (this.previousEmploymentList?.length == 1) {
        requireDocsId = [13, 6, 5, 4, 3, 9, 10, 11, 1, 2];
        this.mandatoryDocListLength = 9;
      } else if (this.previousEmploymentList?.length == 2) {
        requireDocsId = [13, 6, 5, 4, 3, 9, 10, 11, 1, 2];
        this.mandatoryDocListLength = 11;
      } else {

      }
    } else {
      this.mandatoryDocListLength = 7;
      requireDocsId = [13, 6, 5, 4, 3, 9, 10, 11];
    }
    let getMandlistDoc = this.uploadedDocumentLists.filter(t => {
      return requireDocsId.indexOf(t.docSubCategId) !== -1;
    });
    let getSalSlips = this.uploadedDocumentLists.filter(f => f.documentType == 11);

    if (this.candidatePersonalDetails?.FatherName) {
      this.candidateTabConfig['FamilyDetails'] = true;
    }
    else {
      this.reRenderNavigation();
      return false
    }
    if (getMandlistFam?.length > 0) {
      this.candidateTabConfig['EducationalBackground'] = true;
    }
    else {
      this.reRenderNavigation();
      return false
    }
    // if (getMandlistFam?.length == 2) {
    //   this.candidateTabConfig['EducationalBackground'] = true;
    // }
    // else {
    //   this.reRenderNavigation();
    //   return false
    // }
    if (getMandlistEdu?.length == 1) {
      this.candidateTabConfig['TrainingCourses'] = true;
      this.candidateTabConfig['EmploymentDetails'] = true;
    }
    else {
      this.reRenderNavigation();
      return false
    }
    if (this.employmentDataList?.length != 0 || this._globalMethod.isCandidateFresher()) {
      this.candidateTabConfig['SalaryDetails'] = true;
    }
    else {
      this.reRenderNavigation();
      return false
    }
    if (this.salaryDetails?.currentSalaryType || this._globalMethod.isCandidateFresher()) {
      this.candidateTabConfig['UploadDocuments'] = true;
    }
    else {
      this.reRenderNavigation();
      return false
    }
    // if ((getSalSlips?.length == 1 && getMandlistDoc?.length >= 8) || (getSalSlips?.length == 2 && getMandlistDoc?.length >= 9) || (getSalSlips?.length == 3 && getMandlistDoc?.length >= 10) || this._globalMethod.isCandidateFresher()) {
    if ((getSalSlips?.length == 1 && getMandlistDoc?.length >= this.mandatoryDocListLength + 1) || (getSalSlips?.length == 2 && getMandlistDoc?.length >= this.mandatoryDocListLength + 2) || (getSalSlips?.length == 3 && getMandlistDoc?.length >= this.mandatoryDocListLength + 3) || this._globalMethod.isCandidateFresher()) {
      this.candidateTabConfig['OtherDetails'] = true;      
      this._storage.setIsDocumentsUploaded(1);
    }
    else {     
      this._storage.setIsDocumentsUploaded(0);
      this.reRenderNavigation();
      return false
    }
    this.reRenderNavigation();
  }

  /***
   * 
   */
  reRenderNavigation() {
    setTimeout(() => {
      this.hideShowActionButton();
    }, 500);
  }

  /**
   * 
   * @param e check family validation
   */
  activeTabDetection() {
    this.tabConfigSubs = this._share.activeTabDetection.subscribe(
      data => {
        if (data) {
          this.excuteAllAPI();
        }

      }
    )


  }

  public getAllTab: any = [];
  ngAfterViewInit(): void {
    this.getAllTab = this.matTabAts?._allTabs['_results'];
    //this._userAuth.consentModalOpen();
  }

  /** tab switch */
  onTabChanged(event: any): void {
    this.selectedTabIndex = event.index;
    this.hideShowActionButton();
    this.getScreenDetails();

  }

  hideShowActionButton() {
    this.getAllTab = this.matTabAts?._allTabs['_results'];

    this.isSubmitBtnShow = false;
    this.isPrevBtnShow = false;
    this.isNextBtnShow = false;
    if (this.selectedTabIndex === 0) {
      this.isPrevBtnShow = false;
      this.isNextBtnShow = true;
    }
    else if (this.selectedTabIndex == 7) {
      this.isPrevBtnShow = true;
      this.isNextBtnShow = false;
      this.isSubmitBtnShow = true;
    }
    else {
      this.isPrevBtnShow = true;
      this.isNextBtnShow = true;
    }
    if (this.selectedTabIndex != 7) {
      let getNextTabInfo = this.getAllTab[this.selectedTabIndex + 1];
      if (getNextTabInfo['disabled']) {
        if (this.selectedTabIndex == 5 || this.selectedTabIndex == 0) {
          this.isNextBtnShow = true;
        }
        else {
          this.isNextBtnShow = false;
        }

      }
    }

    if (this._globalMethod.isFinalSubmit()) {

      this.isSubmitBtnShow = false;
    }
  }

  /**
   * Next
   */
  nextTab(): void {
    this.formActionAndNavigate(true)



    // if(this.selectedTabIndex >= 1){
    //   this.isPrevBtnShow = true;
    //  }
  }
  /**
  * Submit
  */
  submitAction(): void {
    this.formActionAndNavigate(false)
  }

  /***
   * form submit and navigate
   */

  formActionAndNavigate(navigate: boolean = false) {
    let personalDetailsForm = this.personalDetailsCom?.personalDetailsForm;
    let salaryDetailsForm: UntypedFormGroup = this.salaryDetailsCom?.updateSalDetailsForm;
    let otherDetailsform: UntypedFormGroup = this.otherDetailsCom?.otherDetailsform;
    /***
     * personal details
     */

    if (this.selectedTabIndex === 0) {
      if (personalDetailsForm.valid) {
        let totalExpInMonths = (parseInt(personalDetailsForm?.controls?.TotalExpYear?.value) * 12) + (parseInt(personalDetailsForm?.controls?.TotalExpMonth?.value));
        let relExpInMonths = (parseInt(personalDetailsForm?.controls?.RelevantExpyear?.value) * 12) + (parseInt(personalDetailsForm?.controls?.RelevantExpMonth?.value));
        let itExpInMonths = (parseInt(personalDetailsForm?.controls?.ITExpyear?.value) * 12) + (parseInt(personalDetailsForm?.controls?.ITExpMonth?.value));
        if (relExpInMonths > totalExpInMonths) {
          this._share.showAlertErrorMessage.next('Relevant Experience can not be greater than Total Experience.');
        }
        else if (itExpInMonths > totalExpInMonths) {
          this._share.showAlertErrorMessage.next('IT Experience can not be greater than Total Experience.');
        }
        else {
          if (this._globalMethod.isFinalSubmit()) {
            this.switchToNext();
          }
          else {
            this.updatePersonaldt(personalDetailsForm);
          }

          // this.switchToNext();
        }
      }
      else {
        this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
        personalDetailsForm.markAllAsTouched();
      }
    }
    /***
     *  Salary Details tab
     */

    else if (this.selectedTabIndex === 5) {

      if (salaryDetailsForm.valid) {

        if (this._globalMethod.isFinalSubmit()) {
          this.switchToNext();
        }
        else {
          this.updateSalaryDetails(salaryDetailsForm);
        }
      }
      else {
        this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
        salaryDetailsForm.markAllAsTouched();
      }
    }

    /***
     *  other Details tab
     */

    else if (this.selectedTabIndex === 7) {
      // if(!this.iConfirmedCheckBox['checked'] || this.iConfirmedCheckBox['checked'] == false){
      //   this._share.showAlertErrorMessage.next('Please provide your consent.');
      // }else{
      if (this.candidatePersonalDetails?.onboardStatus && this.candidatePersonalDetails?.onboardStatus != 30) {
        //  if(!this.iConfirmedCheckBox['checked'] || this.iConfirmedCheckBox['checked'] == false){

        //   this._share.showAlertErrorMessage.next('Please provide your consent.');
        //  }else{
        if (otherDetailsform.valid) {
          if (!this.isBGVFormSubmitted && this.userData?.ISBGVFormsEnable === 'Y') {
            let elm = { title: 'Complete BGV Form First' };
            elm['src'] = 'EAF';
            elm['msg'] = 'Kindly complete the Background Verification form First to submit the Employment Application Form.';
            const dialogRef = this.dialog.open(ConfirmIfBgSubmittedComponent, {
              panelClass: ['ats-model-wrap', 'onboard-consent-modal'],
              data: elm,
              disableClose: true,
            });
            dialogRef.afterClosed().subscribe((res) => {
              if (res) {
                // this.getUserDetails();
              }
            });
          } else {
            this.confirmAlertSubmit(otherDetailsform);
          }
        }
        else {
          this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
          otherDetailsform.markAllAsTouched();
        }
        // }
      } else {
        // this.confirmAlertSubmit(otherDetailsform);
        if (!this.isBGVFormSubmitted && this.userData?.ISBGVFormsEnable === 'Y') {
            let elm = { title: 'Complete BGV Form First' };
            elm['src'] = 'EAF';
            elm['msg'] = 'Kindly complete the Background Verification form First to submit the Employment Application Form.';
            const dialogRef = this.dialog.open(ConfirmIfBgSubmittedComponent, {
              panelClass: ['ats-model-wrap', 'onboard-consent-modal'],
              data: elm,
              disableClose: true,
            });
            dialogRef.afterClosed().subscribe((res) => {
              if (res) {
                // this.getUserDetails();
              }
            });
          } else {
            this.confirmAlertSubmit(otherDetailsform);
          }
      }
      // }
    }
    else {
      this.switchToNext();
    }
  }



  /***
   * Switch Next Tab
   */
  switchToNext() {
    let getTabsLen = (this.getAllTab.length) - 2;
    if (getTabsLen === this.selectedTabIndex) {
      this.selectedTabIndex = this.selectedTabIndex + 1;
    }
    else {
      let getNextTabInfo = this.getAllTab[this.selectedTabIndex + 2];
      if (getNextTabInfo['disabled']) {
        this.isNextBtnShow = false;
        this.selectedTabIndex = this.selectedTabIndex + 1;
      }
      else {
        this.selectedTabIndex = this.selectedTabIndex + 1;
      }
    }

  }

  /**
  * Next
  */
  prevTab(): void {
    this.selectedTabIndex = this.selectedTabIndex - 1;
    // if(this.selectedTabIndex >= 1){
    //   this.isPrevBtnShow = true;
    //  }
  }
  /***
   * action save form
   */
  saveTabData() {

  }


  /***
   * API'S
   */
  /***
  * update personal details
  */

  updatePersonaldt(form: UntypedFormGroup) {
    let formValue = form.value;
    if (formValue['dob']) {
      formValue['dob'] = GlobalMethod.formatDate(formValue['dob']);
    }
    if (formValue['VisaValidUpto']) {
      formValue['VisaValidUpto'] = GlobalMethod.formatDate(formValue['VisaValidUpto']);
    }

    if (formValue['secondarySkill']?.length != 0) {
      formValue['secondarySkill'] = formValue['secondarySkill']?.toString();
    }
    // if (formValue['secondarySkill']?.length != 0) {
      formValue['Candidateid'] = this.candidateId ? this.candidateId : 0;
 //   }
    
    delete formValue['PermanentAddress'];
    delete formValue['PresentAddress'];
    delete formValue['ContactAddressEmr'];
    delete formValue['FirstName'];
    delete formValue['MiddleName'];
    delete formValue['LastName'];

    this._candidateServe.updatePersonalDetails(formValue).subscribe(
      res => {
        this._share.showAlertSuccessMessage.next(res);
        this.candidateTabConfig['FamilyDetails'] = true;
        this._candidateServe.getCandidatePersonalDetails(this.candidateId).subscribe(
          res => {
            this.candidatePersonalDetails = res['data'][0];
            this.expStored();
            this.tabEnabledDisabled();
            this.switchToNext();


          }
        )

      }
    )

  }

  /**
   * add salary details
   */

  updateSalaryDetails(form: UntypedFormGroup) {
    let formValue = form.value;
    if (formValue['expectedJoiningDate']) {
      formValue['expectedJoiningDate'] = GlobalMethod.formatDate(formValue['expectedJoiningDate']);
    }

    if (parseInt(formValue['currentCTC']) < parseInt(formValue['salaryAmount']) && !this._globalMethod.isCandidateFresher()) {
      this._share.showAlertErrorMessage.next('Fixed component of your salary should not exceed annual CTC.');
      return false;
    }
    if (formValue['salaryAmountPay']) {
      if (parseInt(formValue['currentCTC']) < parseInt(formValue['salaryAmountPay']) && !this._globalMethod.isCandidateFresher()) {
        this._share.showAlertErrorMessage.next('Variable component of your salary should not exceed annual CTC.');
        return false;
      }
    }


    this._candidateServe.updateSalaryDetails(formValue).subscribe(
      res => {
        this._share.showAlertSuccessMessage.next(res);
        this._candidateServe.getCandidateSalaryDetails().subscribe(
          res => {
            this.salaryDetails = res['data'][0];
          }
        )
        this.switchToNext();
        this.candidateTabConfig['UploadDocuments'] = true;
      }
    )
  }


  /**
  * update other details
  */

  updateOtherDetails(form: any) {
    let formValue = form;
    if (formValue['References'].length != 0) {
      formValue['References'] = formValue['References'].filter(n => n?.Name);
    }
    formValue['finalSubmit'] = 1;
    // if(this.iConfirmedCheckBox['checked']){
    //   formValue['CandidateConsentEAF'] = this.iConfirmedCheckBox['checked'] ? 1 : 0;
    // }
    if (formValue['CandidateConsentEAF']) {
      formValue['CandidateConsentEAF'] = formValue['CandidateConsentEAF'] == 'Y' ? 1 : 0;
    }
    if (formValue['locationConsent']) {
      formValue['locationConsent'] = formValue['locationConsent'] == true ? 1 : 0;
    }

    this._candidateServe.updateOtherDetails(formValue).subscribe(
      res => {
        this._share.showAlertSuccessMessage.next(res);
        this._share.otherTabSubmit.next(true);
        this._share.referredBackSubmit.next(true);
        this.isSubmitBtnShow = false;
        this.getScreenDetails();
        // this.switchToNext();
      }
    )
  }


  /**
  * update referred Back details
  */

  updateReferredBackDetails(body: any) {
    // let body = {};
    if (body['CandidateConsentEAF']) {
      body['CandidateConsentEAF'] = body['CandidateConsentEAF'] == 'Y' ? 1 : 0;
    }
    this._candidateServe.updateReferredBackDetails(body).subscribe(
      res => {
        this._share.showAlertSuccessMessage.next(res);
        this._share.referredBackSubmit.next(true);
        this.isSubmitBtnShow = false;
        this.getScreenDetails();
        // this.switchToNext();
      }
    )
  }

  /***
   * confirmation before sumbit
   */

  confirmAlertSubmit(form: UntypedFormGroup) {
    const dialogRef = this.dialog.open(Day1DisclaimerModalComponent, {
      panelClass: 'ats-confirm',
      data: {
        candidatePersonalDetails: this.candidatePersonalDetails,
        headerText: 'Consent',
        type: 'EAF',
        buttonText: {
          ok: "Agree",
          cancel: "Disagree"
        },
      }
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     if(this.candidatePersonalDetails?.onboardStatus == 30){
    //       this.updateReferredBackDetails();
    //     }else{
    //       this.updateOtherDetails(form);
    //     }
    //   }
    // });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let body = form?.value;
        if (result?.iConfirmedCheck == true) {
          body['CandidateConsentEAF'] = 'Y';
        }
        // this.finalSubmitDay1Forms(body);
        if (this.candidatePersonalDetails?.onboardStatus == 30) {
          this.updateReferredBackDetails(body);
        } else {
          this.updateOtherDetails(body);
        }
      }
    });
  }

}
