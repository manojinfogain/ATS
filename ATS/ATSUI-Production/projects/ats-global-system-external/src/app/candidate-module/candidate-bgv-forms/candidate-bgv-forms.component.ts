import { AfterContentInit, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Form, UntypedFormGroup } from '@angular/forms';
import { MatLegacyTabGroup as MatTabGroup } from '@angular/material/legacy-tabs';
import { forkJoin } from 'rxjs';
import { GlobalMethod } from 'projects/ats-global-system-external/src/app/core/common/global-method';
import { ShareService } from 'projects/ats-global-system-external/src/app/core/services/share.service';
import { CandidateService } from '../candidate.service';
import { CandidateBGVScreenTab } from '../../core/models/common-model';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { GetSetStorageService } from '../../core/services/get-set-storage.service';
import { GlobalCommonMethodService } from '../../core/common/global-common-method.service';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { ConfirmationDialogComponent } from '../../shared/shared-app/components/confirmation-dialog/confirmation-dialog.component';
import { Day1DisclaimerModalComponent } from '../candidate-day-one-forms/modal/day1-disclaimer-modal/day1-disclaimer-modal.component';
import { UserAuthService } from '../../core/authentication/user-auth.service';
import { ConfirmIfBgSubmittedComponent } from '../modals/confirm-if-bg-submitted/confirm-if-bg-submitted.component';
import { AlertMsgPopupComponent } from '../../common-sharing/modal/alert-msg-popup/alert-msg-popup.component';
@Component({
  selector: 'app-candidate-bgv-forms',
  templateUrl: './candidate-bgv-forms.component.html',
  styleUrls: ['./candidate-bgv-forms.component.scss']
})
export class CandidateBgvFormsComponent implements OnInit, AfterViewInit {
  public formAppearance: string = 'fill';
  public formClass: string = 'form-fill-ats';
  public selectedTabIndex: number = 0;
  public isPrevBtnShow: boolean = false;
  public isNextBtnShow: boolean = true;
  public isSubmitBtnShow: boolean = false;
  @ViewChild("atsOnTab", { static: false }) matTabAts: MatTabGroup;
  @ViewChild("personalDetailsCom", { static: false }) personalDetailsCom;
  @ViewChild("currentAddressCom", { static: false }) currentAddressCom;
  @ViewChild("highestEducationFormCom", { static: false }) highestEducationFormCom;
  @ViewChild("crcDetailsFormCom", { static: false }) crcDetailsFormCom;
  @ViewChild("globalDBCheckDetailsFormCom", { static: false }) globalDBCheckDetailsFormCom;
  @ViewChild("OFACCheckDetailsFormCom", { static: false }) OFACCheckDetailsFormCom;
  @ViewChild("currentDigitalLOAFormCom", { static: false }) currentDigitalLOAFormCom;
  // @ViewChild("iConfirmedCheckBox") iConfirmedCheckBox: ElementRef;
  public personalDetailsForm: UntypedFormGroup;
  candidateTabConfig: CandidateBGVScreenTab = new CandidateBGVScreenTab();
  tabConfigSubs: Subscription
  constructor(
    private _candidateServe: CandidateService,
    private _share: ShareService,
    public dialog: MatDialog,
    private _storage: GetSetStorageService,
    public _globalMethod: GlobalCommonMethodService,
    private _userAuth: UserAuthService
  ) {
  }

  public uploadedDocumentLists: any = [];
  public candidatePersonalDetails: any = {};
  public candidateEmploymentDetailsEAF: any = {};
  public BGVPersonalInfoDetails: any = {};
  public BGVCurrentAddressDetails: any = {};
  public BGVCRCDetails: any = [];
  public BGVHighestEducationDetails: any = [];
  public BGVEmploymentDetails: any = [];
  public BGVGlobalDBCheckDetails: any = [];
  public BGVOFACCheckDetails: any = [];
  public BGVDigitalLOADetails: any = {};
  ngOnInit(): void {
    this.excuteAllAPI();
    this.activeTabDetection();
  }

  public reuiredEmployersNos: number;
  excuteAllAPI() {
    forkJoin([
      this._candidateServe.GetCandidateDetailsBGVDetails(),
      this._candidateServe.GetBGVPersonalDetails(),
      this._candidateServe.GetCandidateBGVCurrentAddress(),
      this._candidateServe.GetBGVCRCDetails(),
      this._candidateServe.GetBGVEducationDetails(),
      this._candidateServe.GetBGVEmploymentDetails(),
      this._candidateServe.GetBGVGlobalDBCheck(),
      this._candidateServe.GetBGVOFACDetails(),
      this._candidateServe.GetBGVLOADetails()

    ]).subscribe(
      res => {
        this.candidatePersonalDetails = res[0]['CandidateDetails'][0];
        this.candidateEmploymentDetailsEAF = res[0]['CandidateEmployement'];
        this.BGVPersonalInfoDetails = res[1]['data'][0];
        this.BGVCurrentAddressDetails = res[2]['data'][0];
        this.BGVCRCDetails = res[3]['data'][0];
        this.BGVHighestEducationDetails = res[4]['data'][0];
        this.BGVEmploymentDetails = res[5]['data'];
        this.reuiredEmployersNos = res[5]['EmployerCount'][0]?.ResultValue;
        this.BGVGlobalDBCheckDetails = res[6]['data'][0];
        this.BGVOFACCheckDetails = res[7]['data'][0];
        this.BGVDigitalLOADetails = res[8]['data'][0];
        this.getScreenDetails();

        this.tabEnabledDisabled();

      }
    )
  }

  /***
   * get Screen
   */
  public screenDetails: any = {};
  public profileCompletionPercent: number = 0;
  getScreenDetails() {
    this._candidateServe.getBGVScreenDetails().subscribe(
      res => {
        let data = res['data'][0];
        this.screenDetails = data;
        this._storage.setIsBGVFinalStatud(data?.final_status);
        this.expStored();
        this._userAuth.isEAFSubmittedModalOpen(this._globalMethod.isEAFMandDocumentsUploaded());
      }
    )
  }

  /***
   * data Stored
   */
  expStored() {
    let expData: any = {
      year: parseInt(this.screenDetails?.totalExp),
      month: parseInt(this.screenDetails?.totalExpMonth)
    }
    this._storage.setCandExpBGV(expData);
  }


  /***
   * tab 
   */
  public mandatoryDocListLength: number = 7;
  tabEnabledDisabled() {
    this.candidateTabConfig = new CandidateBGVScreenTab();
    if (this.BGVPersonalInfoDetails?.Id) {
      this.candidateTabConfig['CurrentAddressDetails'] = true;
    }
    else {
      this.reRenderNavigation();
      return false
    }
    if (this.BGVCurrentAddressDetails?.Id) {
      this.candidateTabConfig['CRCDetails'] = true;
    }
    else {
      this.reRenderNavigation();
      return false
    }
    if (this.BGVCRCDetails?.Id) {
      this.candidateTabConfig['HighestEducationDetails'] = true;
    }
    else {
      this.reRenderNavigation();
      return false
    }
    if (this.BGVHighestEducationDetails?.Id) {
      this.candidateTabConfig['EmploymentDetails'] = true;
    }
    else {
      this.reRenderNavigation();
      return false
    }
    if ((this.BGVEmploymentDetails && this.BGVEmploymentDetails?.length != 0 && this.isEmploymentDetailsFilled()) || this._globalMethod.isCandidateFresherBGV()) {
      this.candidateTabConfig['GlobalDBCheckDetails'] = true;
    }
    else {
      this.reRenderNavigation();
      return false
    }
    if (this.BGVGlobalDBCheckDetails?.Id) {
      this.candidateTabConfig['OFACDetails'] = true;
    }
    else {
      this.reRenderNavigation();
      return false
    }
    if (this.BGVOFACCheckDetails?.Id) {
      this.candidateTabConfig['DigitalLOA'] = true;
    }
    else {
      this.reRenderNavigation();
      return false
    }
    this.reRenderNavigation();
  }

  isEmploymentDetailsFilled(){
     const details = Array.isArray(this.BGVEmploymentDetails) ? this.BGVEmploymentDetails : [];
      const allHaveId = details.length === this.reuiredEmployersNos &&
        details.every(item => Number.isInteger(item?.Id) && item?.Id > 0);
      return allHaveId;
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
        if (this.selectedTabIndex == 4 ||this.selectedTabIndex == 5 || this.selectedTabIndex == 0 || this.selectedTabIndex == 1 || this.selectedTabIndex == 2 || this.selectedTabIndex == 3 || this.selectedTabIndex == 6) {
          this.isNextBtnShow = true;
        }
        else {
          this.isNextBtnShow = false;
        }

      }
    }

    if (this._globalMethod.isBGVFinalSubmit()) {

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
  /**
   * Submit Final
   */
  submitFinalAction(): void {
    let currentDigitalLOAForm: UntypedFormGroup = this.currentDigitalLOAFormCom?.currentDigitalLOAForm;
    if (currentDigitalLOAForm.valid) {
      const dialogRef = this.dialog.open(AlertMsgPopupComponent, {
            panelClass: 'ats-confirm',
            data: {
              headerText: 'Note',
              message: ` Are you sure you want to submit the BGV Forms? Once submitted, you will not be able to make any changes.`,
              buttonText: {
                ok: "OK",
                cancel: "Cancel"
              },
              isShowOk: 1,
            }
          });
      
          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              this.updateOnFinalSubmission(currentDigitalLOAForm);
            }
          });
    }
    else {
      this._share.showAlertErrorMessage.next('Please sign the Letter of Authorization.');
      currentDigitalLOAForm.markAllAsTouched();
    }
    // this._candidateServe.FinalBGVSubmitByCandidate(1).subscribe(
    //   res => {
    //     this._share.showAlertSuccessMessage.next('BGV Forms Submitted Successfully.');
    //     this._share.BGVLOATabSubmit.next(true);
    //     this.isSubmitBtnShow = false;
    //     this.getScreenDetails();

    //   // this._candidateServe.GetBGVLOADetails().subscribe(
    //   //   res => {
    //   //     this.BGVDigitalLOADetails = res['data'][0];
    //   //   }
    //   // )

    //   }
    // )
  }

  /***
   * form submit and navigate
   */

  formActionAndNavigate(navigate: boolean = false) {
    let personalDetailsForm = this.personalDetailsCom?.personalDetailsForm;
    let currentAddressDetailsForm = this.currentAddressCom?.currentAddressDetailsForm;
    let highestEducationForm = this.highestEducationFormCom?.highestEducationForm;
    let crcDetailsForm = this.crcDetailsFormCom?.crcDetailsForm;
    let globalDBCheckDetailsForm: UntypedFormGroup = this.globalDBCheckDetailsFormCom?.globalDBCheckDetailsForm;
    let OFACCheckDetailsForm: UntypedFormGroup = this.OFACCheckDetailsFormCom?.OFACCheckDetailsForm;
    let currentDigitalLOAForm: UntypedFormGroup = this.currentDigitalLOAFormCom?.currentDigitalLOAForm;
    /***
     * personal details
     */
    if (this._globalMethod.isBGVFinalSubmit()) {
      this.switchToNext();
    }
    else {
      if (this.selectedTabIndex === 0) {
        if (personalDetailsForm.valid) {
          if (this._globalMethod.isBGVFinalSubmit()) {
            this.switchToNext();
          }
          else {
            this.updatePersonaldt(personalDetailsForm);
          }

        }
        else {
          this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
          personalDetailsForm.markAllAsTouched();
        }
      }
      /***
       * current address details
       */

      else if (this.selectedTabIndex === 1) {
        if (currentAddressDetailsForm.valid) {
          if (this._globalMethod.isBGVFinalSubmit()) {
            this.switchToNext();
          }
          else {
            this.updateCurrentAddressdt(currentAddressDetailsForm);
          }

        }
        else {
          this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
          currentAddressDetailsForm.markAllAsTouched();
        }
      }
      /***
       * crc details
       */

      else if (this.selectedTabIndex === 2) {
        if (crcDetailsForm.valid) {
          if (this._globalMethod.isBGVFinalSubmit()) {
            this.switchToNext();
          }
          else {
            this.updateCrcDetails(crcDetailsForm);
          }

        }
        else {
          this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
          currentAddressDetailsForm.markAllAsTouched();
        }
      }
      /***
       * highest education details
       */

      else if (this.selectedTabIndex === 3) {
        if (highestEducationForm.valid) {
          if (this._globalMethod.isBGVFinalSubmit()) {
            this.switchToNext();
          }
          else {
            this.updateHighestEducationDetails(highestEducationForm);
          }

        }
        else {
          this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
          highestEducationForm.markAllAsTouched();
        }
      }
      // Employment Details tab validation
      else if (this.selectedTabIndex === 4) {
        debugger
        // Only validate if requiredEmployersNos is set and greater than 0
        if (this.reuiredEmployersNos > 0) {
          const details = Array.isArray(this.BGVEmploymentDetails) ? this.BGVEmploymentDetails : [];
          const allHaveId = details.length === this.reuiredEmployersNos &&
            details.every(item => Number.isInteger(item?.Id) && item?.Id > 0);

          if (!allHaveId) {
            this._share.showAlertErrorMessage.next(
              `Please fill all ${this.reuiredEmployersNos} employer details before proceeding.`
            );
            return;
          }else{            
            this.switchToNext();
          }
        }
      }
      /***
       *  globalDBCheckDetailsForm tab
       */

      else if (this.selectedTabIndex === 5) {

        if (globalDBCheckDetailsForm.valid) {

          if (this._globalMethod.isBGVFinalSubmit()) {
            this.switchToNext();
          }
          else {
            this.updateGlobalDBCheckDetails(globalDBCheckDetailsForm);
          }
        }
        else {
          this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
          globalDBCheckDetailsForm.markAllAsTouched();
        }
      }
      /***
       *  OFACCheckDetailsForm tab
       */

      else if (this.selectedTabIndex === 6) {

        if (OFACCheckDetailsForm.valid) {

          if (this._globalMethod.isBGVFinalSubmit()) {
            this.switchToNext();
          }
          else {
            this.updateOFACCheckDetails(OFACCheckDetailsForm);
          }
        }
        else {
          this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
          OFACCheckDetailsForm.markAllAsTouched();
        }
      }

      /***
       *  LOA  tab
       */

      else if (this.selectedTabIndex === 7) {

        if (currentDigitalLOAForm.valid) {

          this.updateOtherDetails(currentDigitalLOAForm);
        }
        else {
          this._share.showAlertErrorMessage.next('Please sign the Letter of Authorization.');
          currentDigitalLOAForm.markAllAsTouched();
        }
      }
      else {
        this.switchToNext();
      }
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
    if (formValue['dateOfBirth']) {
      formValue['dateOfBirth'] = GlobalMethod.formatDate(formValue['dateOfBirth']);
    }
    this._candidateServe.updatePersonalDetailsForBGV(formValue).subscribe(
      res => {
        this._share.showAlertSuccessMessage.next(res);
        this.candidateTabConfig['CurrentAddressDetails'] = true;
        this._candidateServe.GetBGVPersonalDetails().subscribe(
          res => {
            this.BGVPersonalInfoDetails = res['data'][0];
            this.expStored();
            this.tabEnabledDisabled();
            this.switchToNext();


          }
        )

      }
    )

  }

  /***
  * API'S
  */
  /***
  * update current address details
  */

  updateCurrentAddressdt(form: UntypedFormGroup) {
    let formValue = form.value;
    delete formValue['UploadDocument1'];
    this._candidateServe.updateCurrentAddressDetailsForBGV(formValue).subscribe(
      res => {
        this._share.showAlertSuccessMessage.next(res);
        this.candidateTabConfig['CRCDetails'] = true;
        this._candidateServe.GetCandidateBGVCurrentAddress().subscribe(
          res => {
            this.BGVCurrentAddressDetails = res['data'][0];
            this.expStored();
            this.tabEnabledDisabled();
            this.switchToNext();
          }
        )
      }
    )

  }

  /***
   * API'S
   */
  /***
  * update crc details
  */

  updateCrcDetails(form: UntypedFormGroup) {
    let formValue = form.value;
    delete formValue['UploadDocument1'];
    this._candidateServe.updateCrcDetailsForBGV(formValue).subscribe(
      res => {
        this._share.showAlertSuccessMessage.next(res);
        this.candidateTabConfig['HighestEducationDetails'] = true;
        this._candidateServe.GetBGVCRCDetails().subscribe(
          res => {
            this.BGVCRCDetails = res['data'][0];
            this.expStored();
            this.tabEnabledDisabled();
            this.switchToNext();
          }
        )
      }
    )

  }

  /***
  * API'S
  */
  /***
  * update highest education details
  */

  updateHighestEducationDetails(form: UntypedFormGroup) {
    let formValue = form.value;
    delete formValue['UploadDocument1'];
    this._candidateServe.updateHighestEducationDetailsForBGV(formValue).subscribe(
      res => {
        this._share.showAlertSuccessMessage.next(res);
        this.candidateTabConfig['EmploymentDetails'] = true;
        this._candidateServe.GetBGVEducationDetails().subscribe(
          res => {
            this.BGVHighestEducationDetails = res['data'][0];
            this.expStored();
            this.tabEnabledDisabled();
            this.switchToNext();
          }
        )
      }
    )

  }
  /***
  * API'S
  */
  /***
  * update Global DB Check  details
  */

  updateGlobalDBCheckDetails(form: UntypedFormGroup) {
    let formValue = form.value;
    delete formValue['UploadDocument1'];
    this._candidateServe.AddUpdateBGVGlobalDBCheck(formValue).subscribe(
      res => {
        this._share.showAlertSuccessMessage.next(res);
        this.candidateTabConfig['OFACDetails'] = true;
        this._candidateServe.GetBGVGlobalDBCheck().subscribe(
          res => {
            this.BGVGlobalDBCheckDetails = res['data'][0];
            this.expStored();
            this.tabEnabledDisabled();
            this.switchToNext();
          }
        )
      }
    )

  }
  /***
 * API'S
 */
  /***
  * update OFAC Check  details
  */

  updateOFACCheckDetails(form: UntypedFormGroup) {
    let formValue = form.value;
    delete formValue['UploadDocument1'];
    this._candidateServe.AddUpdateBGVOFACDetails(formValue).subscribe(
      res => {
        this._share.showAlertSuccessMessage.next(res);
        this.candidateTabConfig['DigitalLOA'] = true;
        this._candidateServe.GetBGVOFACDetails().subscribe(
          res => {
            this.BGVOFACCheckDetails = res['data'][0];
            this.expStored();
            this.tabEnabledDisabled();
            this.switchToNext();
          }
        )
      }
    )

  }


  /**
  * update other details
  */

  updateOtherDetails(form: any) {
    let formValue = form.value;
    this._candidateServe.SaveBGVLetterofAuthorization(formValue).subscribe(
      res => {
        this._share.showAlertSuccessMessage.next(res);
        this._share.BGVLOATabSave.next(true);
        // this.isSubmitBtnShow = false;
        // this.getScreenDetails();

        this._candidateServe.GetBGVLOADetails().subscribe(
          res => {
            this.BGVDigitalLOADetails = res['data'][0];
          }
        )
      }
    )
  }

  /**
  * update other details
  */

  updateOnFinalSubmission(form: any) {
    let formValue = form.value;
    formValue['CandidateConsentBGV'] = 1;
    this._candidateServe.FinalBGVSubmitByCandidate(formValue).subscribe(
      res => {
        this._share.showAlertSuccessMessage.next('BGV Forms Submitted Successfully.');
        this._share.BGVLOATabSubmit.next(true);
        this.isSubmitBtnShow = false;
        this.getScreenDetails();

        this._candidateServe.GetBGVLOADetails().subscribe(
          res => {
            this.BGVDigitalLOADetails = res['data'][0];
          }
        )
        let elm = { title: 'Submit employment application form' };
        elm['src'] = 'BGV';
        elm['msg'] = ' Now you can submit employment application form';
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
