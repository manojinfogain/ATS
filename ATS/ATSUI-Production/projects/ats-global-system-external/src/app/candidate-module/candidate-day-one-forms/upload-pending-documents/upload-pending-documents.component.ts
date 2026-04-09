import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ConfirmationDialogComponent } from '../../../shared/shared-app/components/confirmation-dialog/confirmation-dialog.component';
import { HttpClient } from '@angular/common/http';
import { ShareService } from '../../../core/services/share.service';
import { CandidateService } from '../../candidate.service';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { UploadDocumentModalComponent } from '../modal/day-one-form-modal/upload-document-modal/upload-document-modal.component';
import { environment } from 'projects/ats-global-system-external/src/environments/environment';
import { saveAs } from "file-saver";
import { GetSetStorageService } from '../../../core/services/get-set-storage.service';
@Component({
  selector: 'app-upload-pending-documents',
  templateUrl: './upload-pending-documents.component.html',
  styleUrls: ['./upload-pending-documents.component.scss']
})
export class UploadPendingDocumentsComponent implements OnInit {
  displayedColumns = ['Name', 'orgName', 'docCategName', 'status', 'action'];

  public submitPendingDocForm: UntypedFormGroup = new UntypedFormGroup({});
  public onBoardCandidateList: any = []
  private candidateId =  this._storage.getCandidateId();
  constructor(
    public dialog: MatDialog,
    private _candidateServe: CandidateService,
    private _share: ShareService,
    private _fb: UntypedFormBuilder,
    private _http: HttpClient,
    private _storage: GetSetStorageService
  ) { }

  ngOnInit(): void {
    this.getOnboardingFormDetails();
    this.getCandidatePersonalDetails();
    this.formInit();
  }

  //init form
  formInit() {
    this.submitPendingDocForm = this._fb.group({
      iConfirmedCheckBox: [null, [Validators.required]]
    })
  }

  //get onboarding form details
  public pendingDocumentsList: any = [];
  getOnboardingFormDetails() {
    this._candidateServe.getOnboardingFormDetails(1).subscribe(
      res => {
        this.onBoardCandidateList = res['data']

        this.pendingDocumentsList = res['pendingdocs']
        this.getIndividualFormStatus();
      }
    )
  }

  public isPendingDoc: boolean = true;
  public draftForms: any = []

  public anyFormRef: string = 'N';
  public referredBackForms = [];
  public pendingForms = [];
  /**filtering by status for validation */
  getIndividualFormStatus() {
    this.referredBackForms = this.pendingDocumentsList.filter(d => d.ActionTaken == 'R');
    if (this.referredBackForms.length) {
      this.anyFormRef = 'Y';
    } else {
      this.anyFormRef = 'N';
    }
    /**for pending doc validation  */
    this.pendingForms = this.pendingDocumentsList.filter(d => d.ActionTaken == 'P');
   
  }

  //get control name
  getControl(name: string) {
    return this.submitPendingDocForm.get(name);
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


  /**update document modal  */
  uploadDocumentModal(element: any) {
    element['title'] = element?.docName;
    element['candidateId'] =this.candidateId;
    const dialogRef = this.dialog.open(UploadDocumentModalComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'update-interview-feedback', 'talent-transfers', 'doc-upload-onboard-mod'],
      data: element,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getOnboardingFormDetails();
        this.getCandidatePersonalDetails();
      }
    });
  }

  
  /***
  * download document
  */
  downloadDocuments(elm: any) {
    
    this._http.get(`${environment.apiMainUrlNet}Candidate/DownloadPendingDocuments?id=${elm?.id}&Candidateid=${elm?.candidateId}`, { responseType: 'blob' }).subscribe(
      res => {
        saveAs(res, elm?.docName);
        setTimeout(() => {
          this._share.showAlertSuccessMessage.next('File downloaded successfully.')
        }, 1000);
      }
    )
  }
 
  downloadForm(formId: number) {
    let form = this.onBoardCandidateList.filter(d => d.formTypeId == formId);
    let filePath = `${form[0].FormFilePath}\\${form[0].FormFileName}`;
    let fileName = `${form[0].FormFileName}`
    this._candidateServe.downloadFile(filePath, fileName);
  }

  previewSavedGovtForms(ele: any) {
    if (ele?.Status === 'D' &&
      (ele?.formTypeId == 7 || ele?.formTypeId == 8 || ele?.formTypeId == 9 ||
        ele?.formTypeId == 10 || ele?.formTypeId == 11 || ele?.formTypeId == 12 ||
        ele?.formTypeId == 27 || ele?.formTypeId == 28 || ele?.formTypeId == 29)) {
      return true;
    } else {
      return false;
    }
  }

}
