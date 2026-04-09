import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { FILE_UPLOAD } from '../../../core/constant/common.const';
import { ShareService } from '../../../core/services/share.service';
import { OnboardService } from '../../onboard.service';
import { HttpClient } from '@angular/common/http';
import { saveAs } from "file-saver";
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { CommonPdfViewerInternalComponent } from '../../../common-sharing/modals/common-pdf-viewer-internal/common-pdf-viewer-internal.component';
import { CommonImagePreviewModalComponent } from '../../../common-sharing/modals/common-image-preview-modal/common-image-preview-modal.component';
@Component({
  selector: 'app-upload-ol-acceptance-doc-modal',
  templateUrl: './upload-ol-acceptance-doc-modal.component.html',
  styleUrls: ['./upload-ol-acceptance-doc-modal.component.scss']
})
export class UploadOlAcceptanceDocModalComponent implements OnInit {
  public upladFilesForm: UntypedFormGroup = new UntypedFormGroup({});
  public isOLAcceptMailUploaded: boolean = false;
  public mandateJoiningDocsList: any = [];
  constructor(
    public dialogRef: MatDialogRef<UploadOlAcceptanceDocModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public _fb: UntypedFormBuilder,
    public _share: ShareService,
    private _onboard: OnboardService,
    private _http: HttpClient
  ) { }

  ngOnInit(): void {
    /***
     * FormInit
     */

    this.upladFilesForm = this._fb.group(
      {
        fileControl: [null, Validators.required],
      }
    );
    this.GetMandateEmailDocs();
  }

  GetMandateEmailDocs() {
    this._onboard.getCandidateAllDetails(this.data.candidateId).subscribe(
      res => {
        this.mandateJoiningDocsList = res['MandateJoiningDocUpload'];
          if (this.mandateJoiningDocsList?.length != 0) {
            this.isOLAcceptMailUploaded = this.mandateJoiningDocsList?.filter(f => f.FileType == 'OA')?.length != 0 ? true : false;
          }
      }
    )
  }

  /***
  * upload option
  */
  public canOLAcceptDoc: any;
  fileUpload(event) {
    this.canOLAcceptDoc = '';
    let allowedExtensions = /(\.jpg|\.jpeg|\.png|\.pdf)$/i;
    let file = event.target.files[0];
    let fileName = file?.name;

    this.upladFilesForm.markAllAsTouched();
    if (!allowedExtensions.exec(fileName)) {
      this._share.showAlertErrorMessage.next('Please upload file type jpg/jpeg/png/pdf only.');
      event.target.value = "";
      this.canOLAcceptDoc = '';
      this.getControl('fileControl').reset();
      return false;
    }
    else if (file.size > FILE_UPLOAD.FILE_SIZE) {
      this._share.showAlertErrorMessage.next('file  cannot be greater than 15MB.');
      event.target.value = "";
      this.canOLAcceptDoc = '';
      this.getControl('fileControl').reset();
      return false;
    }
    else {
      this.canOLAcceptDoc = file;
    }
  }



  getControl(name: string) {
    return this.upladFilesForm.get(name);
  }

  /**
   * submit
   */
  submitRequest(form: UntypedFormGroup) {
    form.markAllAsTouched();
    
    if (form.valid) {
      let body = new FormData();
      if (this.data?.cid) {
      //  body.append('CId', this.data.cid);
        body.append('Candidateid', this.data.candidateId);
      }
      if (this.canOLAcceptDoc) {
        body.append('Files', this.canOLAcceptDoc);
      }
      body.append('documentType', 'OA');
      this._onboard.UploadJoiningMandateHRDocs(body).subscribe(
        res => {
          this._share.showAlertSuccessMessage.next(res);
          this.dialogRef.close(true);
        }
      )
    }
    else {
      if (this.getControl('fileControl').invalid) {
        this._share.showAlertErrorMessage.next('Please Upload Offer Letter Acceptance Document.')
      }
      else {
        this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
      }
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
      docName = 'Offer Letter Acceptance Document';
    } else if (docType == 'IE') {
      docName = 'Interview Evaluation Sheet';
    } else {
      docName = 'Mandatory Document';
    }
    this._http.get(`${environment.apiMainUrlNet}Onboard/DownloadHRMandateDoc?Candidateid=${elm?.candidateId}&documentType=${docType}`, { responseType: 'blob' }).subscribe(
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
  closeModal(): void {
    this.dialogRef.close();
  }

}



