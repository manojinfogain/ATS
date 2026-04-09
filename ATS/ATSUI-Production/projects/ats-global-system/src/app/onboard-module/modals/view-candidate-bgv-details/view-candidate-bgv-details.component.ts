import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { forkJoin } from 'rxjs';
import { GetSetStorageService } from '../../../core/services/get-set-storage.service';
import { ShareService } from '../../../core/services/share.service';
import { OnboardService } from '../../onboard.service';
import { BgvConfirmationDownloadComponent } from '../../../offer-module/modals/bgv-confirmation-download/bgv-confirmation-download.component';
import { SendPreviewOfferModalComponent } from '../../../offer-module/modals/send-preview-offer-modal/send-preview-offer-modal.component';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { saveAs } from "file-saver";
import { OnboardCommonMethod } from '../../../core/common/onboard-common-method';
import { MultipleDocPreviewModalComponent } from '../multiple-doc-preview-modal/multiple-doc-preview-modal.component';

@Component({
  selector: 'app-view-candidate-bgv-details',
  templateUrl: './view-candidate-bgv-details.component.html',
  styleUrls: ['./view-candidate-bgv-details.component.scss']
})
export class ViewCandidateBgvDetailsComponent implements OnInit {
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
  
  
  displayedColumns = ['employerName', 'employerType', 'employeeId', 'Doj', 'currentWorking', 'Designation', 'RMNameDesig', 'RMContact', 'RMEmail', 'HRNameDesig', 'HRContact', 'HREmail', 'action'];
  constructor(
    public dialogRef: MatDialogRef<ViewCandidateBgvDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private _onboardServ: OnboardService,
    private _fb: UntypedFormBuilder,
    private _share: ShareService,
    private _storage: GetSetStorageService,
    private _http: HttpClient,
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
    this._http.get(`${environment.apiMainUrlNet}OnBoard/DownloadDocument?docId=${elm?.id}&cid=${elm?.cid}`, { responseType: 'blob' }).subscribe(
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


  public isRecruiterAction: boolean = false;
  public isHRAction: boolean = false;
  ngOnInit(): void {
    this.userData = this._storage.getSetUserData();

    if (
      (this.userData?.EmpNewId == this.data?.primaryrecruiter ||
        this.userData?.EmpNewId == this.data?.secondaryrecruiter)) {
      this.isRecruiterAction = true;
    }
    else if (this.userData?.RoleId == 1) {
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
      UploadOfferLtrAccDoc: [null]
    })

  }

  ngAfterViewInit() {

  }

  getControl(name: string) {
    return this.verificationForm.get(name);
  }

  /**
   * submit
   */
  submitRequest(form: UntypedFormGroup) {
    form.markAllAsTouched();

    if (form.valid) {
      let body = form.value;
      body['cid'] = this.data.cid;
      // if(this.IsRecFinalSubmit){
      //   body['ActionBy'] = 'R';
      //     this._onboardServ.VerificationOnboardingCandidateDetails(body).subscribe(
      //       res => {
      //         this._share.showAlertSuccessMessage.next(res);
      //         this.dialogRef.close(true)
      //       }
      //     )
      //   // }
      // }
      // if(this.IsHrFinalSubmit){
      //   body['ActionBy'] = 'H';
      //   this._onboardServ.VerificationOnboardingCandidateDetails(body).subscribe(
      //     res => {
      //       this._share.showAlertSuccessMessage.next(res);
      //       this.dialogRef.close(true)
      //     }
      //   )
      // }
      // this._onboardServ.VerificationOnboardingCandidateDetails(body).subscribe(
      //   res => {
      //     this._share.showAlertSuccessMessage.next(res);
      //     this.dialogRef.close(true)
      //   }
      // )

    }
    else {
      //  if (this.getControl('status').invalid) {
      //   this._share.showAlertErrorMessage.next('Please  provide your consent.')
      // }
      // else if (this.getControl('mailBody').invalid) {  
      //   this._share.showAlertErrorMessage.next('Please  enter remarks.')
      // }
      // else if (this.getControl('OnBordingMode').invalid) {      
      //   this._share.showAlertErrorMessage.next('Please  select onboarding mode.')
      // }else
      // if((this.UploadPosiApprMail?.value == '' || this.UploadPosiApprMail?.value == null) && !this.isPositionApprovalMailUploaded){
      //   this._share.showAlertErrorMessage.next('Please upload position approval E-mail.');

      // }else if((this.UploadIntEvalSheet?.value == '' || this.UploadIntEvalSheet?.value == null) && !this.isIntEvalSheetUploaded){
      //   this._share.showAlertErrorMessage.next('Please upload Interview Evaluation Sheet.');

      // }
      // else {
      this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
      // }
    }

  }



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
      this._onboardServ.GetBGVCandidateDetailsByCid(this.data?.candidateId),
    ]).subscribe(
      res => {
        this.BGVPersonalInfo = res[0]['Data']['PersonalData'][0];
        this.BGVAddressDetails = res[0]['Data']['AdreessData'][0];
        this.BGVCRCDetails = res[0]['Data']['CRCData'][0];
        this.BGVHighestEducationDetails = res[0]['Data']['EducationData'][0];
        this.BGVEmploymentDetails = res[0]['EmploymentDetails'];
        this.BGVGlobalDBCheckDetails = res[0]['Data']['GlobalDBData'][0];
        this.BGVOFACDetails = res[0]['Data']['OFACData'][0];

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
                elm['fileName'] = this.docDetails[0]?.DocumentName;
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

      /***
   * submit details  Data to server
   */
  submitAction() {
    this._onboardServ.ApprovalToSendCandidateDetailsForBGV(1,this.data?.cid,this.data?.candidateId).subscribe(
      res => {
        this._share.showAlertSuccessMessage.next(res);
        this.dialogRef.close(true);
      }
    )
  }

  closeModal(): void {
    this.dialogRef.close();
  }

}
