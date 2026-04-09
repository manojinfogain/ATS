import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { forkJoin } from 'rxjs';
import { GetSetStorageService } from '../../../core/services/get-set-storage.service';
import { ShareService } from '../../../core/services/share.service';
import { OnboardService } from '../../onboard.service';
// import { ConfirmReferbackMailModalComponent } from '../confirm-referback-mail-modal/confirm-referback-mail-modal.component';
import { OnbVerificationModalComponent } from '../onb-verification-modal/onb-verification-modal.component';
import { BgvConfirmationDownloadComponent } from '../../../offer-module/modals/bgv-confirmation-download/bgv-confirmation-download.component';
import { SendPreviewOfferModalComponent } from '../../../offer-module/modals/send-preview-offer-modal/send-preview-offer-modal.component';
// import { GlobalMethod } from '../../../core/common/global-method';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { saveAs } from "file-saver";
import { GlobalCommonMethodService } from '../../../core/common/global-common-method.service';
import { FILE_UPLOAD } from '../../../core/constant/common.const';
import { CommonPdfViewerInternalComponent } from '../../../common-sharing/modals/common-pdf-viewer-internal/common-pdf-viewer-internal.component';
import { CommonImagePreviewModalComponent } from '../../../common-sharing/modals/common-image-preview-modal/common-image-preview-modal.component';
import { BgvServiceService } from '../../../bgv-module/bgv-service.service';
import { OnboardCommonMethod } from '../../../core/common/onboard-common-method';
import { MultipleDocPreviewModalComponent } from '../multiple-doc-preview-modal/multiple-doc-preview-modal.component';

@Component({
  selector: 'app-view-all-candidate-details-onboard',
  templateUrl: './view-all-candidate-details-onboard.component.html',
  styleUrls: ['./view-all-candidate-details-onboard.component.scss']
})
export class ViewAllCandidateDetailsOnboardComponent implements OnInit {
  public formAppearance: string = 'fill';
  public formClass: string = 'form-fill-ats';
  public verificationForm: UntypedFormGroup = new UntypedFormGroup({});
  public userData: any = {};

  public verifyActionBtnLabelRec: string = "Verify";
  public verifyActionBtnLabelHR: string = "Verify";
  public verifiedLabel: string = 'Verified';
  public notVerifiedLabel: string = 'Verification Failed';
  public pendingLabel: string = 'Pending';
  public tAGVerificationLabel: string = 'TAG Verification Status :';
  public hRVerificationLabel: string = 'HR Verification Status :';
  public statusList: any = [
    { statusId: 1, statusName: 'Pending' },
    { statusId: 2, statusName: 'In Progress' },
    { statusId: 3, statusName: 'Completed' },
    { statusId: 4, statusName: 'Failed' }
  ];
  displayedColumns = ['employerName', 'employerType', 'employeeId', 'Doj', 'currentWorking', 'Designation', 'RMNameDesig', 'RMContact', 'RMEmail', 'HRNameDesig', 'HRContact', 'HREmail', 'action'];
  constructor(
    public dialogRef: MatDialogRef<ViewAllCandidateDetailsOnboardComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private _onboardServ: OnboardService,
    private _fb: UntypedFormBuilder,
    private _share: ShareService,
    private _storage: GetSetStorageService,
    private _http: HttpClient,
    private _globalCommonMethod: GlobalCommonMethodService,
    public _bgvServe: BgvServiceService,
  ) {
  }

  public step: number = 0;
  public step1: number = 0;
  public step2: number = 0;
  setStep(index: number) {
    this.step = index;
  }  
  setStep1(index: number) {
    this.step1 = index;
  }
  setStep2(index: number) {
    this.step2 = index;
  }


  public isHideNextButton: boolean = false;
  nextStep() {
    this.step++;

  }

  prevStep() {
    this.step--;
  }



  public isRecruiterAction: boolean = false;
  public isHRAction: boolean = false;
  ngOnInit(): void {
    this.addRemoveValidatorForConfidentialUFiles();
    this.userData = this._storage.getSetUserData();

    if (
      (this.userData?.EmpNewId == this.data?.primaryrecruiter ||
        this.userData?.EmpNewId == this.data?.secondaryrecruiter)) {
      this.isRecruiterAction = true;
    }
    else if (this.userData?.RoleId == 1 || this.userData?.otherRoles?.IsHRAccess == 'Y') {
      this.isHRAction = true;
    }
    this.excuteAllAPI();
    this.verificationForm = this._fb.group({
      status: [null, Validators.required],
      OnBordingMode: [this.data?.OnBoardingModeFromRec ? this.data?.OnBoardingModeFromRec : null, Validators.required],
      mailBody: [null],
      mailSubject: [null],
      UploadPosiApprMail: [null],
      UploadIntEvalSheet: [null],
      UploadOfferLtrAccDoc: [null],
    });

  }

  ngAfterViewInit() {

  }

  getControl(name: string) {
    return this.verificationForm.get(name);
  }

  /***
   * Mail SendTo Candidate
   */

  //  confirmMailSendToCandidate(elm,body) {
  //   elm['headerText'] = `Preview Mail - Referred Back to ${elm?.Name}`;
  //   elm['buttonText'] = {ok: "OK", cancel: "Cancel"};
  //   elm['userData'] = this.userData;
  //   elm['subject'] = body?.mailSubject;
  //   elm['mailBody'] = body?.mailBody;

  //   const dialogRef = this.dialog.open(ConfirmReferbackMailModalComponent, {
  //     panelClass: ['ats-confirm','ats-confirm-width'],
  //     data:elm,
  //     width: '500px',
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       this._onboardServ.VerificationOnboardingCandidateDetails(body).subscribe(
  //         res => {
  //           this._share.showAlertSuccessMessage.next(res);
  //           this.dialogRef.close(true)
  //         }
  //       )
  //     }

  //   });
  // }





  public familyList: any = [];
  public candidateEducationList: any = [];
  public trainingCoursesList: any = [];
  public employmentList: any = [];
  public salaryList: any = [];
  public questionireList: any = [];
  public refrenceList: any = [];
  public candidatePersonalDetails: any = [];
  public otherInformation: any = [];
  public uploadedDocumentLists: any = [];
  public presentAddress: string = '';
  public PermanentAddress: string = '';
  public ContactAddressEmr: string = '';
  public personalDtStatusRec: string = null;
  public familyDtStatusRec: string = null;
  public eduDtStatusRec: string = null;
  public trainingCoursesDtStatusRec: string = null;
  public EmpDtStatusRec: string = null;
  public salDtStatusRec: string = null;
  public otherDtStatusRec: string = null;
  public docDtStatusRec: string = null;
  //HR
  public personalDtStatusHR: string = null;
  public familyDtStatusHR: string = null;
  public eduDtStatusHR: string = null;
  public trainingCoursesDtStatusHR: string = null;
  public EmpDtStatusHR: string = null;
  public salDtStatusHR: string = null;
  public otherDtStatusHR: string = null;
  public docDtStatusHR: string = null;
  public IsHrFinalSubmit: boolean = false;
  public IsRecFinalSubmit: boolean = false;
  public panCardDoc: any = [];
  public passportPhotoDoc: any = [];
  public isTotalExperienceDiffer: boolean = false;
  public isReleventExperienceDiffer: boolean = false;
  public mandateJoiningDocsList: any = [];
  public isPositionApprovalMailUploaded: boolean = false;
  public isIntEvalSheetUploaded: boolean = false;
  public isOfferLtrAccDocUploaded: boolean = false;  
  public BGVPersonalInfo: any = [];
  public BGVAddressDetails: any = [];
  public BGVCRCDetails: any = [];
  public BGVHighestEducationDetails: any = [];
  public BGVEmploymentDetails: any = [];
  public BGVGlobalDBCheckDetails: any = [];
  public BGVOFACDetails: any = [];
  /**getting data from APIs   */
  /**sending some apis data to child component */
  excuteAllAPI() {
    forkJoin([
      this._onboardServ.getCandidateAllDetails(this.data?.candidateId),
      this._onboardServ.getCandidatePersonalDetails(this.data?.candidateId),
      this._onboardServ.getCanddiateDocumentList(this.data?.candidateId),
      this._onboardServ.GetBGVCandidateDetailsByCid(this.data?.candidateId),
    ]).subscribe(
      res => {
        this.familyList = res[0]['familyData']; 8
        this.candidateEducationList = res[0]['educationData'];
        this.trainingCoursesList = res[0]['trainingData'];
        this.employmentList = res[0]['employmentData'];
        this.salaryList = res[0]['salaryData'][0];
        this.questionireList = res[0]['questionireData'];
        this.refrenceList = res[0]['refrenceData'];
        this.mandateJoiningDocsList = res[0]['MandateJoiningDocUpload'];
        this.candidatePersonalDetails = res[1]['data'][0];
        this.uploadedDocumentLists = res[2]['data'];
        this.BGVPersonalInfo = res[3]['Data']['PersonalData'][0];
        this.BGVAddressDetails = res[3]['Data']['AdreessData'][0];
        this.BGVCRCDetails = res[3]['Data']['CRCData'][0];
        this.BGVHighestEducationDetails = res[3]['Data']['EducationData'][0];
        this.BGVEmploymentDetails = res[3]['EmploymentDetails'];
        this.BGVGlobalDBCheckDetails = res[3]['Data']['GlobalDBData'][0];
        this.BGVOFACDetails = res[3]['Data']['OFACData'][0];
        
        if(this.uploadedDocumentLists.length != 0){
          this.panCardDoc = this.uploadedDocumentLists.filter(f=>f.documentType ==27);
          this.passportPhotoDoc = this.uploadedDocumentLists.filter(f=>f.documentType ==18);
        }
        if (this.mandateJoiningDocsList?.length != 0) {
          this.isOfferLtrAccDocUploaded = this.mandateJoiningDocsList?.filter(f => f.FileType == 'OA')?.length != 0 ? true : false;
          this.isPositionApprovalMailUploaded = this.mandateJoiningDocsList?.filter(f => f.FileType == 'PA')?.length != 0 ? true : false;
          this.isIntEvalSheetUploaded = this.mandateJoiningDocsList?.filter(f => f.FileType == 'IE')?.length != 0 ? true : false;
        }
        let totalExpFromRecruiter = parseInt(this.candidatePersonalDetails?.totalExp) * 12 + parseInt(this.candidatePersonalDetails?.totalExpMonth);
        let releventExpFromRecruiter = parseInt(this.candidatePersonalDetails?.releventExp) * 12 + parseInt(this.candidatePersonalDetails?.releventExpMonth);
        let totalExpFromCandidate = parseInt(this.candidatePersonalDetails?.CandidateTotalExp) * 12 + parseInt(this.candidatePersonalDetails?.CandidateTotalExpMonth);
        let releventExpFromCandidate = parseInt(this.candidatePersonalDetails?.CandidateRelevantExp) * 12 + parseInt(this.candidatePersonalDetails?.CandidateRelevantExpMonth);
        if (totalExpFromRecruiter != totalExpFromCandidate) {
          this.isTotalExperienceDiffer = true;
          this._globalCommonMethod.showMessagedisplay({
            title: 'Alert !',
            autoHide: false,
            msg: `
             <p>Total Experience entered by candidate is different than what is entered during profile addition. Please check.</p>`
          });
        } else {
          this.isTotalExperienceDiffer = false;
        }
        if (releventExpFromRecruiter != releventExpFromCandidate) {
          this.isReleventExperienceDiffer = true;
          this._globalCommonMethod.showMessagedisplay({
            title: 'Alert !',
            autoHide: false,
            msg: `
             <p>Relevent Experience entered by candidate is different than what is entered during profile addition. Please check.</p>`
          });
        } else {
          this.isReleventExperienceDiffer = false;
        }

        /**other information data sharing from personal data */
        this.otherInformation = {
          locationPreferenceName: this.candidatePersonalDetails?.locationPreferenceName,
          strengthsImprovementArea: this.candidatePersonalDetails?.strengthsImprovementArea,
          techAreaImprove: this.candidatePersonalDetails?.techAreaImprove,
          locationConsent: this.candidatePersonalDetails?.locationConsent,
          candidatePersonalDetails: this.candidatePersonalDetails
        }
        /*** */
        let data = this.candidatePersonalDetails;
        this.presentAddress = `${data?.AddressLine1 ? data?.AddressLine1 + ', ' : ''}${data?.AddressLine2 ? data?.AddressLine2 + ', ' : ''}
        ${data?.AddressLine3 ? data?.AddressLine3 + ', ' : ''}${data?.cr_city ? data?.cr_city + ', ' : ''}${data?.cr_state ? data?.cr_state + ', ' : ''}
        ${data?.cr_postalCode ? data?.cr_postalCode + ', ' : ''}${data?.cr_countryName ? data?.cr_countryName : ''}`
        this.PermanentAddress = `${data?.pr_addressLine1 ? data?.pr_addressLine1 + ', ' : ''}${data?.pr_addressLine2 ? data?.pr_addressLine2 + ', ' : ''}
        ${data?.pr_addressLine3 ? data?.pr_addressLine3 + ', ' : ''}${data?.pr_city ? data?.pr_city + ', ' : ''}${data?.pr_state ? data?.pr_state + ', ' : ''}
        ${data?.pr_postalCode ? data?.pr_postalCode + ', ' : ''}${data?.pr_countryName ? data?.pr_countryName : ''}`
        this.ContactAddressEmr = `${data?.em_addressLine1 ? data?.em_addressLine1 + ', ' : ''}${data?.em_addressLine2 ? data?.em_addressLine2 + ', ' : ''} ${data?.em_addressLine3 ? data?.em_addressLine3 + ',' : ''}${data?.em_city ? data?.em_city + ',' : ''}${data?.em_state ? data?.em_state + ',' : ''}
        ${data?.em_postalCode ? data?.em_postalCode + ', ' : ''}${data?.em_countryName ? data?.em_countryName : ''}`;

        /***
         * status check Recruiter
         */
        if (this.candidatePersonalDetails?.recruiterVerifiedStatus === 1) {
          this.personalDtStatusRec = 'Y';
        }
        if (this.candidatePersonalDetails?.recruiterVerifiedStatus === 0) {
          this.personalDtStatusRec = 'N';
        }
        if (this.candidatePersonalDetails?.recFinalVerifiedStatus === 1) {
          this.personalDtStatusRec = 'F';
          this.familyDtStatusRec = 'F';
          this.eduDtStatusRec = 'F';
          this.EmpDtStatusRec = 'F';
          this.otherDtStatusRec = 'F';
          this.trainingCoursesDtStatusRec = 'F';
          this.salDtStatusRec = 'F';
          this.docDtStatusRec = 'F';
        }
        if (this.familyList[0]?.recruiterVerifiedStatus === 1) {
          this.familyDtStatusRec = 'Y';
        }
        if (this.familyList[0]?.recruiterVerifiedStatus === 0) {
          this.familyDtStatusRec = 'N';
        }
        // if(this.familyList[0]?.recFinalVerifiedStatus ===  1){
        //   this.familyDtStatusRec = 'F';
        // }

        if (this.candidateEducationList[0]?.recruiterVerifiedStatus === 1) {
          this.eduDtStatusRec = 'Y';
        }
        if (this.candidateEducationList[0]?.recruiterVerifiedStatus === 0) {
          this.eduDtStatusRec = 'N';
        }
        // if(this.candidateEducationList[0]?.recFinalVerifiedStatus === 1){
        //   this.eduDtStatusRec = 'F';
        // }

        if (this.employmentList[0]?.recruiterVerifiedStatus === 1) {
          this.EmpDtStatusRec = 'Y';
        }
        if (this.employmentList[0]?.recruiterVerifiedStatus === 0) {
          this.EmpDtStatusRec = 'N';
        }
        // if(this.employmentList[0]?.recFinalVerifiedStatus === 1){
        //   this.EmpDtStatusRec = 'F';
        // }

        if (this.questionireList[0]?.recruiterVerifiedStatus === 1) {
          this.otherDtStatusRec = 'Y';
        }
        if (this.questionireList[0]?.recruiterVerifiedStatus === 0) {
          this.otherDtStatusRec = 'N';
        }
        // if(this.questionireList[0]?.recFinalVerifiedStatus === 1){
        //   this.otherDtStatusRec = 'F';
        // }

        if (this.trainingCoursesList[0]?.recruiterVerifiedStatus === 1) {
          this.trainingCoursesDtStatusRec = 'Y';
        }
        if (this.trainingCoursesList[0]?.recruiterVerifiedStatus === 0) {
          this.trainingCoursesDtStatusRec = 'N';
        }
        // if(this.trainingCoursesList[0]?.recFinalVerifiedStatus === 1){
        //   this.trainingCoursesDtStatusRec = 'F';
        // }

        if (this.salaryList?.recruiterVerifiedStatus === 1) {
          this.salDtStatusRec = 'Y';
        }
        if (this.salaryList?.recruiterVerifiedStatus === 0) {
          this.salDtStatusRec = 'N';
        }
        // if(this.salaryList?.recFinalVerifiedStatus === 1){
        //   this.salDtStatusRec = 'F';
        // }

        if (this.uploadedDocumentLists[0]?.recruiterVerifiedStatus === 1) {
          this.docDtStatusRec = 'Y';
        }
        if (this.uploadedDocumentLists[0]?.recruiterVerifiedStatus === 0) {
          this.docDtStatusRec = 'N';
        }
        // if(this.uploadedDocumentLists[0]?.recFinalVerifiedStatus === 1){
        //   this.docDtStatusRec = 'F';
        // }

        /***
         * status check HR
         */
        if (this.candidatePersonalDetails?.HRVerifiedStatus === 1) {
          this.personalDtStatusHR = 'Y';
        }
        if (this.candidatePersonalDetails?.HRVerifiedStatus === 0) {
          this.personalDtStatusHR = 'N';
        }
        if (this.candidatePersonalDetails?.HRFinalVerifiedStatus === 1) {
          this.personalDtStatusHR = 'F';
          this.familyDtStatusHR = 'F';
          this.eduDtStatusHR = 'F';
          this.EmpDtStatusHR = 'F';
          this.otherDtStatusHR = 'F';
          this.trainingCoursesDtStatusHR = 'F';
          this.salDtStatusHR = 'F';
          this.docDtStatusHR = 'F';
        }
        if (this.familyList[0]?.HRVerifiedStatus === 1) {
          this.familyDtStatusHR = 'Y';
        }
        if (this.familyList[0]?.HRVerifiedStatus === 0) {
          this.familyDtStatusHR = 'N';
        }

        if (this.candidateEducationList[0]?.HRVerifiedStatus === 1) {
          this.eduDtStatusHR = 'Y';
        }
        if (this.candidateEducationList[0]?.HRVerifiedStatus === 0) {
          this.eduDtStatusHR = 'N';
        }

        if (this.employmentList[0]?.HRVerifiedStatus === 1) {
          this.EmpDtStatusHR = 'Y';
        }
        if (this.employmentList[0]?.HRVerifiedStatus === 0) {
          this.EmpDtStatusHR = 'N';
        }
        if (this.questionireList[0]?.HRVerifiedStatus === 1) {
          this.otherDtStatusHR = 'Y';
        }
        if (this.questionireList[0]?.HRVerifiedStatus === 0) {
          this.otherDtStatusHR = 'N';
        }

        if (this.trainingCoursesList[0]?.HRVerifiedStatus === 1) {
          this.trainingCoursesDtStatusHR = 'Y';
        }
        if (this.trainingCoursesList[0]?.HRVerifiedStatus === 0) {
          this.trainingCoursesDtStatusHR = 'N';
        }

        if (this.salaryList?.HRVerifiedStatus === 1) {
          this.salDtStatusHR = 'Y';
        }
        if (this.salaryList?.HRVerifiedStatus === 0) {
          this.salDtStatusHR = 'N';
        }

        if (this.uploadedDocumentLists[0]?.HRVerifiedStatus === 1) {
          this.docDtStatusHR = 'Y';
        }
        if (this.uploadedDocumentLists[0]?.HRVerifiedStatus === 0) {
          this.docDtStatusHR = 'N';
        }


        // final submission form enable/disable

        if (
          (this.candidatePersonalDetails?.recFinalVerifiedStatus == 0 ||
            this.candidatePersonalDetails?.recFinalVerifiedStatus == null) &&
          (
            this.data?.onboardStatus == 20)
          || this.data?.onboardStatus == 50) {

          this.IsRecFinalSubmit = true;
        }

        if (
          (this.candidatePersonalDetails?.HRFinalVerifiedStatus == 0 ||
            this.candidatePersonalDetails?.HRFinalVerifiedStatus == null) &&
          ((this.userData?.RoleId == 1 || this.userData?.otherRoles?.IsHRAccess == 'Y') &&
            this.data?.onboardStatus == 40)) {
          this.IsHrFinalSubmit = true;
        }

      }
    )
  }
  /**
     * submit
     */
  submitRequest(form: UntypedFormGroup) {
    form.markAllAsTouched();
    if (form.valid) {
      let body = form.value;
      // body['cid'] = this.data.cid;
      body['Candidateid'] = this.data.candidateId;
      // if(!this.IsRecFinalSubmit){
      //   body['ActionBy'] = 'R';
      //     this._onboardServ.VerificationOnboardingCandidateDetails(body).subscribe(
      //       res => {
      //         this._share.showAlertSuccessMessage.next(res);
      //         this.dialogRef.close(true)
      //       }
      //     )
      //   // }
      // }
      if (this.IsHrFinalSubmit) {
        body['ActionBy'] = 'H';
        this._onboardServ.VerificationOnboardingCandidateDetails(body).subscribe(
          res => {
            this._share.showAlertSuccessMessage.next(res);
            this.dialogRef.close(true)
          }
        )
      }
      else {
        body['ActionBy'] = 'R';
        this._onboardServ.VerificationOnboardingCandidateDetails(body).subscribe(
          res => {
            this._share.showAlertSuccessMessage.next(res);
            this.dialogRef.close(true)
          }
        )
        // this._share.showAlertErrorMessage.next('Something went wrong.');
      }
      // this._onboardServ.VerificationOnboardingCandidateDetails(body).subscribe(
      //   res => {
      //     this._share.showAlertSuccessMessage.next(res);
      //     this.dialogRef.close(true)
      //   }
      // )

    }
    else {
      if (this.getControl('status').invalid) {
        this._share.showAlertErrorMessage.next('Please  provide your consent.')
      }
      else if (this.getControl('mailBody').invalid) {
        this._share.showAlertErrorMessage.next('Please  enter remarks.')
      }
      else if (this.getControl('OnBordingMode').invalid) {
        this._share.showAlertErrorMessage.next('Please  select onboarding mode.')
      } else
        if ((this.UploadPosiApprMail?.value == '' || this.UploadPosiApprMail?.value == null) && !this.isPositionApprovalMailUploaded) {
          this._share.showAlertErrorMessage.next('Please upload position approval E-mail.');

        } else if ((this.UploadIntEvalSheet?.value == '' || this.UploadIntEvalSheet?.value == null) && !this.isIntEvalSheetUploaded) {
          this._share.showAlertErrorMessage.next('Please upload Interview Evaluation Sheet.');

        }
        else {
          this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
        }
    }

  }
  //bgv modal
  bgvDownldModal(data: any) {
    data['final'] = true;
    const dialogRef = this.dialog.open(BgvConfirmationDownloadComponent, {
      panelClass: ['ats-model-wrap', 'bgv-modal'],
      data: data,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }

  /***
   * downloadDocuments
   */
  downloadDocuments(elm: any) {
    this._http.get(`${environment.apiMainUrlNet}OnBoard/DownloadDocument?docId=${elm?.id}&Candidateid=${this.data.candidateId}`, { responseType: 'blob' }).subscribe(
      res => {
        saveAs(res, elm?.documentName);
        this._share.showAlertSuccessMessage.next('File downloaded successfully.')
      }
    )
  }

  /**
   * preview and send offer modal
   * @param elm 
   */
  previewandSendOffer(elm: any) {
    elm['title'] = 'Preview and Send Offer';
    elm['isOfferHr'] = "Y";
    const dialogRef = this.dialog.open(SendPreviewOfferModalComponent, {
      panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
      data: elm,
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%'
    });
    dialogRef.afterClosed().subscribe(
      res => {
      }
    );
  }

  /***
   * verficstion modal
   */

  openVerificationModal(type: any) {
    let element = {};
    element['type'] = type;
    element['Candidateid'] = this.data.candidateId;
    element['srcType'] = 'EAF';
    element['candidateData'] = this.data;
    
    //personal details
    if (type === 'PD') {
      element['type'] = type;
      element['title'] = "Personal Details Verification";
    }
    //family details
    else if (type === 'FD') {
      element['title'] = "Family Details Verification";
    }

    //Education Background details
    else if (type === 'EB') {
      element['title'] = "Educational Background Verification";
    }

    //Training Courses
    else if (type === 'TC') {
      element['title'] = "Training Courses Verification";
    }

    //Employment Details
    else if (type === 'ED') {
      element['title'] = "Employment Details Verification";
    }
    //Salary Details
    else if (type === 'SD') {
      element['title'] = "Salary Details Verification";
    }
    //Other Details
    else if (type === 'OD') {
      element['title'] = "Other Details Verification";
    }
    else if (type === 'DD') {
      element['title'] = "Documents Verification";
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
          this.excuteAllAPI();
        }
      }
    )
  }

  /**
   * 
   */
  public isEmail: boolean = false;
  public isConsentAppr: boolean = false;
  consentUp(e: any) {
    if (e.value == '0') {
      this.isEmail = true;
      // if(!this.IsHrFinalSubmit){
      //   this.getControl('mailSubject').addValidators([Validators.required]);
      // }
      this.getControl('mailBody').addValidators([Validators.required]);
    }
    else {
      this.getControl('mailBody').clearValidators();
      this.isEmail = false;
    }
    // this.getControl('mailSubject').updateValueAndValidity();
    this.getControl('mailBody').updateValueAndValidity();

  }

  public isConfidentialVpAbove: boolean = false;
  /** upload  file optional for confidiantial candidate type 
   * g5 and above 6
  */
  addRemoveValidatorForConfidentialUFiles() {
    // this.data['gradeLevel'] = 5;
    // this.data['candidateHiringType'] = 'R';
    /** checking VP & above or confidential joinings  */
    // if (this.data?.candidateHiringType =='C' &&  this.data?.CandidateGradeLevelId > 5) {
    //   this.isConfidentialVpAbove = true;
    // } else {
    //   this.isConfidentialVpAbove = false;
    // }
    if (this.data?.candidateHiringType =='C' &&  this.data?.IsAVPUp =='Y') {
      this.isConfidentialVpAbove = true;
    } else {
      this.isConfidentialVpAbove = false;
    }
    
  }

  get UploadPosiApprMail() { return this.verificationForm.get('UploadPosiApprMail'); }
  get UploadIntEvalSheet() { return this.verificationForm.get('UploadIntEvalSheet'); }
  get UploadOfferLtrAccDoc() { return this.verificationForm.get('UploadOfferLtrAccDoc'); }

  public UploadFileId: any;
  fileUpPosiApprMail(event: any, docType: string) {
    this.UploadFileId = '';
    let allowedExtensions = /(\.jpg|\.jpeg|\.png|\.pdf)$/i;
    let file = event.target.files[0];
    let fileName = file?.name;
    if (docType == 'PA') {
      this.UploadPosiApprMail.markAsTouched();
    } else if (docType == 'IE') {
      this.UploadIntEvalSheet.markAsTouched();
    } else if (docType == 'OA') {
      this.UploadOfferLtrAccDoc.markAsTouched();
    } else {

    }
    if (!allowedExtensions.exec(fileName)) {
      this._share.showAlertErrorMessage.next('Please upload file type jpg/jpeg/png/pdf only.');
      event.target.value = "";
      this.UploadFileId = '';
      return false;
    }
    else if (file.size > FILE_UPLOAD.FILE_SIZE) {
      this._share.showAlertErrorMessage.next('file  cannot be greater than 15MB.');
      event.target.value = "";
      this.UploadFileId = '';
      return false;
    }
    else {
      this.UploadFileId = file;
      let body = new FormData();
      // body.append('CId', this.data?.cid);
      body.append('Candidateid', this.data?.candidateId);
      body.append('documentType', docType);
      if (this.UploadFileId) {
        body.append('Files', this.UploadFileId);
      }
      this._onboardServ.UploadJoiningMandateHRDocs(body).subscribe(
        res => {
          console.log(res);
        }
      )
    }
  }

  /***
   * view Mandate Email docs
   */

  viewDownloadMandateEmail(elm: any, docType: string) {
    let docName = '';
    if (docType == 'PA') {
      docName = 'Position Approval E-Mail';
    } else if (docType == 'OA') {
      docName = 'Offer Letter Acceptance E-Mail';
    } else if (docType == 'IE') {
      docName = 'Interview Evaluation Sheet';
    } else {
      docName = 'Mandatory Document';
    }
    this._http.get(`${environment.apiMainUrlNet}Onboard/DownloadHRMandateDoc?Candidateid=${this.data?.candidateId}&documentType=${docType}`, { responseType: 'blob' }).subscribe(
      res => {
        let elm = {};
        elm['title'] = `Preview ${docName}`;
        elm['documentName'] = docName;
        if (res?.type == 'application/pdf') {
          elm['pdfPreviewData'] = res;
          const dialogRef = this.dialog.open(CommonPdfViewerInternalComponent, {
            panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
            data: elm,
            maxWidth: '100vw',
            maxHeight: '100vh',
            height: '100%',
            width: '100%'
          });
          dialogRef.afterClosed().subscribe(
            res => {
            }
          );
        } else if (res?.type == 'image/png' || res?.type == 'image/jpeg' || res?.type == 'image/jpg') {
          elm['picSource'] = res;
          elm['title'] = `Preview  ${docName}`;
          const dialogRef = this.dialog.open(CommonImagePreviewModalComponent, {
            panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
            data: elm,
            maxWidth: '100vw',
            maxHeight: '100vh',
            height: '100%',
            width: '100%'
          });
          dialogRef.afterClosed().subscribe(
            res => {
            }
          );
        }
        else {
          saveAs(res, docName);
        }
      },
      (error) => {
        this._share.showAlertErrorMessage.next('Something went wrong');
      }
    )
}

previewDocument(data: any) {
      let elm = {};
      elm['documentName'] = data.DocumentTypeName
      elm['filePath'] = data?.DocumentPath;
      elm['fileName'] = data?.DocumentName ;
      elm['type'] = 'path';
      elm['cid'] = data?.cid ? data?.cid : data?.CID;
      OnboardCommonMethod.downloadPrevDocumentsOld(elm, this._http, this.dialog, this._share);
    }

     public docDetails: any[] = [];
      previewEmpDetDoc(element: any) {
        console.log(element);
    
        // this._candidateServe.GetBGVFilePaths(element?.DocumentTypeId, element?.OrgId).subscribe(
        //   res => {
            this.docDetails = element?.DocmentDetails;
            if (this.docDetails?.length > 1) {
              element['docList'] = this.docDetails
              const dialogRef = this.dialog.open(MultipleDocPreviewModalComponent, {
                panelClass: ['ats-model-wrap', 'bgv-modal'],
                data: element,
                disableClose: true
              });
    
              dialogRef.afterClosed().subscribe(result => {
                if (result) {
                }
              });
            } else {
              if (this.docDetails?.length === 1) {
                let elm = {};
                elm['documentName'] = this.docDetails[0].documentName
                elm['filePath'] = this.docDetails[0]?.DocumentPath;
                elm['fileName'] = this.docDetails[0]?.documentName;
                elm['type'] = 'path';
              elm['cid'] = element?.CID;
              OnboardCommonMethod.downloadPrevDocumentsOld(elm, this._http, this.dialog, this._share);
              }else{
                this._share.showAlertErrorMessage.next("No document found");
              }
            }
        //   }
        // )
      }


  closeModal(): void {
    this.dialogRef.close();
  }

}
