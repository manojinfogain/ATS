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
import { FeedbackRoundDetailsComponent } from '../../../interview-module/interview-feedback/modals/feedback-round-details/feedback-round-details.component';
import { ViewOfferApprovalDetailsComponent } from '../../../offer-module/modals/view-offer-approval-details/view-offer-approval-details.component';
import { CommonImagePreviewModalComponent } from '../../../common-sharing/modals/common-image-preview-modal/common-image-preview-modal.component';
import { CommonPdfViewerInternalComponent } from '../../../common-sharing/modals/common-pdf-viewer-internal/common-pdf-viewer-internal.component';
import { OnboardCommonMethod } from '../../../core/common/onboard-common-method';
import { COMMON_CONST } from '../../../core/constant/common.const';
import { GlobalCommonMethodService } from '../../../core/common/global-common-method.service';

@Component({
  selector: 'app-view-all-candidate-details-onboard-hr',
  templateUrl: './view-all-candidate-details-onboard-hr.component.html',
  styleUrls: ['./view-all-candidate-details-onboard-hr.component.scss']
})
export class ViewAllCandidateDetailsOnboardHrComponent implements OnInit {
  public formAppearance: string = 'fill';
  public formClass: string = 'form-fill-ats';
  public verificationForm:UntypedFormGroup = new UntypedFormGroup({});
  public userData: any = {};

  public verifyActionBtnLabelRec:string ="Verify";
  public verifyActionBtnLabelHR:string ="Verify";
  public verifiedLabel:string = 'Verified';
  public notVerifiedLabel:string = 'Not Verified';
  public pendingLabel:string = 'Pending';
  public tAGVerificationLabel:string = 'TAG Verification Status :';
  public hRVerificationLabel:string = 'HR Verification Status :';
 // displayedColumns: string[] = ['categ', 'subcateg', 'docType','action'];
 displayedColumns: string[] = ['docType','action'];
  constructor(
    public dialogRef: MatDialogRef<ViewAllCandidateDetailsOnboardHrComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private _onboardServ: OnboardService,
    private _fb:UntypedFormBuilder,
    private _share: ShareService,
    private _storage:GetSetStorageService,
    private _http:HttpClient,
      private _commonMethodServe: GlobalCommonMethodService
  ) {
  }

  public step: number = 0;
  public step1: number = 0;
  public step2: number = 0;
  setStep(index: number) {
    this.step = index;
  }
  setStep1(index: number) {
    this.step = index;
  }
  setStep2(index: number) {
    this.step = index;
  }


  public isHideNextButton: boolean = false;
  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  /***
   * view offer/approval Details
   */

   openofferApprovalDetailsModal(elm: any) {
    elm['title'] = 'View Offer / Approver Details';
    elm['th_id'] = elm['thid'];
    const dialogRef = this.dialog.open(ViewOfferApprovalDetailsComponent, {
      panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
      data: elm,
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%'
    });
  }

  /**
    * show interview round details
    * @param data 
    */
  openfeedbackInfoModal(data: any) {
    data['final']=true;
   const dialogRef = this.dialog.open(FeedbackRoundDetailsComponent, {
     width: '500px',
     panelClass: ['ats-model-wrap', 'update-interview-feedback'],
     data: data,
     disableClose: true
   });

   dialogRef.afterClosed().subscribe(result => {
     if (result) {
     }
   });
 }

  //bgv modal
  bgvDownldModal(data: any) {
    data['final']=true;
   const dialogRef = this.dialog.open(BgvConfirmationDownloadComponent, {
     panelClass: ['ats-model-wrap','bgv-modal'],
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
  downloadDocuments(elm:any) {
    this._http.get(`${environment.apiMainUrlNet}OnBoard/DownloadDocument?docId=${elm?.id}&Candidateid=${this.data?.candidateId}`, { responseType: 'blob' }).subscribe(
      res => {
        saveAs(res, elm?.documentName);
        this._share.showAlertSuccessMessage.next('File downloaded successfully.')
      }
    )
  }

  /***
 * downloadDocuments
 */
  // downloadDocuments(elm: any) {
  //   let today = new Date();
  //   let todayDate = GlobalMethod.formatDate(today);
  //   this._http.get(`${environment.apiMainUrlNet}OnBoard/DownloadDocument?docId=${elm?.id}&cid=${elm?.cid}`, { responseType: 'blob' }).subscribe(
  //     res => {
  //       saveAs(res, elm?.documentName);
  //       this._share.showAlertSuccessMessage.next('File downloaded successfully.')
  //     }
  //   )
  // }
  //download bgv 
  dwnloadFile(data) {

    this._http.get(`${environment.apiMainUrlNet}OnBoard/DownloadDocument?docId=${data?.id}&Candidateid=${this.data?.candidateId}`, { responseType: 'blob' }).subscribe(
      res => {
        // saveAs(res, data.fileName);
        
        let elm = [];
        elm['title'] = 'Preview Document';
        if (res?.type == 'application/pdf') {
          elm['pdfPreviewData'] = res;
          elm['documentName'] = data.documentTypeName;
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
          elm['title'] = 'Preview Document';
          // elm['directPreview'] = 'Y';
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
      },
      (error) => {
        this._share.showAlertErrorMessage.next('Something went wrong');
      }
    )
  }


  viewAndDwnloadFile(data) {
    
    let elm = {};
    elm['documentName'] = data.documentTypeName
    elm['filePath'] = data.documentPath;
    elm['fileName'] = data.documentName;
    elm['type'] = 'docid';
    // elm['cid'] = data.cid;
    elm['Candidateid'] = this.data.candidateId;
    elm['id'] = data.id;
    elm['docType'] = 'B';
   // this._Gl.downloadPrevDocuments(elm);
    OnboardCommonMethod.downloadPrevDocuments(elm,this._http,this.dialog,this._share);
    
  }


  /**
   * preview and send offer modal
   * @param elm 
   */
  previewandSendOffer(elm:any) {
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


  public isRecruiterAction:boolean = false;
  public isHRAction:boolean = false;
  ngOnInit(): void {
    this.userData = this._storage.getSetUserData();
    if(this.userData?.RoleId == 2){
      this.isRecruiterAction = true;
    }
    if(this.userData?.RoleId == 1 || this.userData?.otherRoles?.IsHRAccess == 'Y'){
      this.isHRAction = true;
    }
  
  
    this.excuteAllAPI();
    this.verificationForm = this._fb.group({
      status:[null,Validators.required],
      mailBody:[null],
      mailSubject:[null]
    })

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

  /**
   * submit
   */
  submitRequest(form: UntypedFormGroup) {
    form.markAllAsTouched();
    if (form.valid) {
      let body = form.value;
      // body['cid'] = this.data.cid;
      body['Candidateid'] = this.data.candidateId;
      if(this.IsRecFinalSubmit){
        body['ActionBy'] = 'R';
        // if(this.getControl('status')?.value == 0){
        //   this.confirmMailSendToCandidate(this.data,body);
        // }else{
          this._onboardServ.VerificationOnboardingCandidateDetails(body).subscribe(
            res => {
              this._share.showAlertSuccessMessage.next(res);
              this.dialogRef.close(true)
            }
          )
        // }
      }
      if(this.IsHrFinalSubmit){
        body['ActionBy'] = 'H';
        this._onboardServ.VerificationOnboardingCandidateDetails(body).subscribe(
          res => {
            this._share.showAlertSuccessMessage.next(res);
            this.dialogRef.close(true)
          }
        )
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
        // this._share.showAlertErrorMessage.next('Please  enter Email Body.')        
        this._share.showAlertErrorMessage.next('Please  enter remarks.')
      }
      // else if (this.getControl('mailSubject').invalid && !this.IsHrFinalSubmit) {
      //   this._share.showAlertErrorMessage.next('Please  enter Email Subject.')
      // }
      else {
        this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
      }
    }

  }



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
  public personalDtStatusRec:string = null;
  public familyDtStatusRec:string = null;
  public eduDtStatusRec:string = null;
  public trainingCoursesDtStatusRec:string = null;
  public EmpDtStatusRec:string = null;
  public salDtStatusRec:string = null;
  public otherDtStatusRec:string = null;
  public docDtStatusRec:string = null;
  //HR
  public personalDtStatusHR:string = null;
  public familyDtStatusHR:string = null;
  public eduDtStatusHR:string = null;
  public trainingCoursesDtStatusHR:string = null;
  public EmpDtStatusHR:string = null;
  public salDtStatusHR:string = null;
  public otherDtStatusHR:string = null;
  public docDtStatusHR:string = null;
  public IsHrFinalSubmit:boolean = false;
  public IsRecFinalSubmit:boolean = false;
  public panCardDoc:any =[];
  public passportPhotoDoc:any =[];
  public BackPapersDocList:any =[];
  public mandateJoiningDocsList:any =[];
  public isOLAcceptMailUploaded:boolean = false;
  public isPosiApprMailUploaded:boolean = false;
  public isIntEvalSheetUploaded:boolean = false;
  /**getting data from APIs   */
  /**sending some apis data to child component */
  excuteAllAPI() {
    forkJoin([
      this._onboardServ.getCandidateAllDetails(this.data.candidateId),
      this._onboardServ.getCandidatePersonalDetails(this.data.candidateId),
      this._onboardServ.getCanddiateDocumentList(this.data.candidateId),
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
        this.uploadedDocumentLists = res[2]['data'].sort(({docCategId:a},{docCategId:b}) => a-b);
        if(this.uploadedDocumentLists.length != 0){
          this.panCardDoc = this.uploadedDocumentLists.filter(f=>f.documentType ==27);
          this.passportPhotoDoc = this.uploadedDocumentLists.filter(f=>f.documentType ==18);
          this.BackPapersDocList = this.uploadedDocumentLists.filter(f=>(f.docCategId ==1 && f.docSubCategId!=3));
          let salaryDocList = this.uploadedDocumentLists.filter(f=>(f.documentType == 11));
           let salaryDocGroup:any = [];
           salaryDocList.forEach((element,index) => {
            element['serialNum'] = index+1;
            salaryDocGroup.push(element);
          });
          this.BackPapersDocList = [...this.BackPapersDocList,...salaryDocGroup]
        }
        if(this.mandateJoiningDocsList?.length != 0){
          this.isOLAcceptMailUploaded = this.mandateJoiningDocsList?.filter(f=>f.FileType == 'OA')?.length != 0 ? true : false;
          this.isPosiApprMailUploaded = this.mandateJoiningDocsList?.filter(f=>f.FileType == 'PA')?.length != 0 ? true : false;
          this.isIntEvalSheetUploaded = this.mandateJoiningDocsList?.filter(f=>f.FileType == 'IE')?.length != 0 ? true : false;
        }        
        /**other information data sharing from personal data */
        this.otherInformation = {
          locationPreferenceName: this.candidatePersonalDetails?.locationPreferenceName,
          strengthsImprovementArea: this.candidatePersonalDetails?.strengthsImprovementArea,
          techAreaImprove: this.candidatePersonalDetails?.techAreaImprove,
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
        if(this.candidatePersonalDetails?.recruiterVerifiedStatus === 1){
          this.personalDtStatusRec = 'Y';
        }
        if(this.candidatePersonalDetails?.recruiterVerifiedStatus === 0){
          this.personalDtStatusRec = 'N';
        }
        if(this.candidatePersonalDetails?.recFinalVerifiedStatus === 1){
          this.personalDtStatusRec = 'F';
          this.familyDtStatusRec = 'F';
          this.eduDtStatusRec = 'F';
          this.EmpDtStatusRec = 'F';
          this.otherDtStatusRec = 'F';
          this.trainingCoursesDtStatusRec = 'F';
          this.salDtStatusRec = 'F';
          this.docDtStatusRec = 'F';
        }
        if(this.familyList[0]?.recruiterVerifiedStatus === 1){
          this.familyDtStatusRec = 'Y';
        }
        if(this.familyList[0]?.recruiterVerifiedStatus === 0){
          this.familyDtStatusRec = 'N';
        }
        // if(this.familyList[0]?.recFinalVerifiedStatus ===  1){
        //   this.familyDtStatusRec = 'F';
        // }

        if(this.candidateEducationList[0]?.recruiterVerifiedStatus === 1){
          this.eduDtStatusRec = 'Y';
        }
        if(this.candidateEducationList[0]?.recruiterVerifiedStatus === 0){
          this.eduDtStatusRec = 'N';
        }
        // if(this.candidateEducationList[0]?.recFinalVerifiedStatus === 1){
        //   this.eduDtStatusRec = 'F';
        // }

        if(this.employmentList[0]?.recruiterVerifiedStatus === 1){
          this.EmpDtStatusRec = 'Y';
        }
        if(this.employmentList[0]?.recruiterVerifiedStatus === 0){
          this.EmpDtStatusRec = 'N';
        }
        // if(this.employmentList[0]?.recFinalVerifiedStatus === 1){
        //   this.EmpDtStatusRec = 'F';
        // }

        if(this.questionireList[0]?.recruiterVerifiedStatus === 1){
          this.otherDtStatusRec = 'Y';
        }
        if(this.questionireList[0]?.recruiterVerifiedStatus === 0){
          this.otherDtStatusRec = 'N';
        }
        // if(this.questionireList[0]?.recFinalVerifiedStatus === 1){
        //   this.otherDtStatusRec = 'F';
        // }

        if(this.trainingCoursesList[0]?.recruiterVerifiedStatus === 1){
          this.trainingCoursesDtStatusRec = 'Y';
        }
        if(this.trainingCoursesList[0]?.recruiterVerifiedStatus === 0){
          this.trainingCoursesDtStatusRec = 'N';
        }
        // if(this.trainingCoursesList[0]?.recFinalVerifiedStatus === 1){
        //   this.trainingCoursesDtStatusRec = 'F';
        // }

        if(this.salaryList?.recruiterVerifiedStatus === 1){
          this.salDtStatusRec = 'Y';
        }
        if(this.salaryList?.recruiterVerifiedStatus === 0){
          this.salDtStatusRec = 'N';
        }
        // if(this.salaryList?.recFinalVerifiedStatus === 1){
        //   this.salDtStatusRec = 'F';
        // }

        if(this.uploadedDocumentLists[0]?.recruiterVerifiedStatus === 1){
          this.docDtStatusRec = 'Y';
        }
        if(this.uploadedDocumentLists[0]?.recruiterVerifiedStatus === 0){
          this.docDtStatusRec = 'N';
        }
        // if(this.uploadedDocumentLists[0]?.recFinalVerifiedStatus === 1){
        //   this.docDtStatusRec = 'F';
        // }

        /***
         * status check HR
         */
         if(this.candidatePersonalDetails?.HRVerifiedStatus === 1){
          this.personalDtStatusHR = 'Y';
        }
        if(this.candidatePersonalDetails?.HRVerifiedStatus === 0){
          this.personalDtStatusHR = 'N';
        }
        if(this.candidatePersonalDetails?.HRFinalVerifiedStatus === 1){
          this.personalDtStatusHR = 'F';
          this.familyDtStatusHR = 'F';
          this.eduDtStatusHR = 'F';
          this.EmpDtStatusHR = 'F';
          this.otherDtStatusHR = 'F';
          this.trainingCoursesDtStatusHR = 'F';
          this.salDtStatusHR = 'F';
          this.docDtStatusHR = 'F';
        }
        if(this.familyList[0]?.HRVerifiedStatus === 1){
          this.familyDtStatusHR = 'Y';
        }
        if(this.familyList[0]?.HRVerifiedStatus === 0){
          this.familyDtStatusHR = 'N';
        }

        if(this.candidateEducationList[0]?.HRVerifiedStatus === 1){
          this.eduDtStatusHR = 'Y';
        }
        if(this.candidateEducationList[0]?.HRVerifiedStatus === 0){
          this.eduDtStatusHR = 'N';
        }

        if(this.employmentList[0]?.HRVerifiedStatus === 1){
          this.EmpDtStatusHR = 'Y';
        }
        if(this.employmentList[0]?.HRVerifiedStatus === 0){
          this.EmpDtStatusHR = 'N';
        }
        if(this.questionireList[0]?.HRVerifiedStatus === 1){
          this.otherDtStatusHR = 'Y';
        }
        if(this.questionireList[0]?.HRVerifiedStatus === 0){
          this.otherDtStatusHR = 'N';
        }

        if(this.trainingCoursesList[0]?.HRVerifiedStatus === 1){
          this.trainingCoursesDtStatusHR = 'Y';
        }
        if(this.trainingCoursesList[0]?.HRVerifiedStatus === 0){
          this.trainingCoursesDtStatusHR = 'N';
        }

        if(this.salaryList?.HRVerifiedStatus === 1){
          this.salDtStatusHR = 'Y';
        }
        if(this.salaryList?.HRVerifiedStatus === 0){
          this.salDtStatusHR= 'N';
        }

        if(this.uploadedDocumentLists[0]?.HRVerifiedStatus === 1){
          this.docDtStatusHR = 'Y';
        }
        if(this.uploadedDocumentLists[0]?.HRVerifiedStatus === 0){
          this.docDtStatusHR = 'N';
        }

        
        // final submission form enable/disable
        if(
          (this.candidatePersonalDetails?.recFinalVerifiedStatus == 0 ||
            this.candidatePersonalDetails?.recFinalVerifiedStatus == null) &&
         ( this.userData?.RoleId == 2 &&
          this.data?.onboardStatus == 20)){

          this.IsRecFinalSubmit = true;
        }
        
        if(
          (this.candidatePersonalDetails?.HRFinalVerifiedStatus == 0 ||
          this.candidatePersonalDetails?.HRFinalVerifiedStatus == null) &&
          ((this.userData?.RoleId == 1 || this.userData?.otherRoles?.IsHRAccess == 'Y') &&
            this.data?.onboardStatus == 40)){
            this.IsHrFinalSubmit = true;
        }
        
      }
    )
  }

  //offer status check to disable offer letter buttn
  checkOfferStatus(){
    if(this.data?.StatusID == 140 || this.data?.StatusID == 120 || this.data?.StatusID == 200 || this.data?.StatusID == 220 || this.data?.StatusID == 160 || this.data?.StatusID == 180){
      return false;
    }else{
      return true;
    }
  }


  /***
   * verficstion modal
   */

  openVerificationModal(type: any) {
    let element = {};
    element['type'] = type;
    // element['cid'] = this.data.cid;
    element['Candidateid'] = this.data.candidateId;
    element['srcType'] = 'EAF';
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
      get=>{
        if(get){
          this.excuteAllAPI();
        }
      }
    )
  }

  /**
   * 
   */
  public isEmail:boolean = false;
  consentUp(e: any) {
    if (e.value == '0') {
      this.isEmail = true;
      // if(!this.IsHrFinalSubmit){
      //   this.getControl('mailSubject').addValidators([Validators.required]);
      // }
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
   /***
  * download resume 
  */
   dwnloadFileSingle(data) {
     if (data?.ProfileId == 3) {
      this._commonMethodServe.downloadFileCskill(data?.resume_path, data?.c_resume);
    }
    else {
     this._commonMethodServe.downloadResume(this.data.candidateId,"")
     // this._commonMethodServe.downloadFileCommon(data?.resume_path, data?.c_resume);
    }
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  /***
   * view Mandate Email docs
   */

  viewDownloadMandateEmail(elm: any,docType:string) {
      let docName = '';
      if(docType == 'PA'){
        docName = 'Position Approval E-Mail';
      }else if(docType == 'OA'){
        docName = 'Offer Letter Acceptance E-Mail';
      }else if(docType == 'IE'){
        docName = 'Interview Evaluation Sheet';
      }else{
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

}
