import { Component, Input, OnInit } from '@angular/core';
import { FormArray, UntypedFormBuilder, FormControl, UntypedFormGroup, FormGroupName, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { ExternalUserGlobalApiService } from 'projects/ats-global-system/src/app/core/services/external-user-global-api.service';
import { UploadDocModalComponent } from './upload-doc-modal/upload-doc-modal.component';
import { forkJoin } from 'rxjs';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { CandidateService } from 'projects/ats-global-system/src/app/candidate-module/candidate.service';
import { OnboardService } from '../../../onboard-module/onboard.service';
import { GlobalMethod } from '../../../core/common/global-method';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { saveAs } from "file-saver";
import { CommonPdfViewerInternalComponent } from '../../modals/common-pdf-viewer-internal/common-pdf-viewer-internal.component';
import { CommonImagePreviewModalComponent } from '../../modals/common-image-preview-modal/common-image-preview-modal.component';
import { OnboardCommonMethod } from '../../../core/common/onboard-common-method';
@Component({
  selector: 'app-document-details-sc',
  templateUrl: './document-details-sc.component.html',
  styleUrls: ['./document-details-sc.component.scss']
})
export class DocumentDetailsScComponent implements OnInit {
  @Input() appearance: string = 'outline';
  @Input() formClass: string = 'form-outline-ats';
  @Input() public uploadedDocumentLists: any = [];
  public docUploadForm: UntypedFormGroup;
  public documentMasterListGroup: UntypedFormGroup = new UntypedFormGroup({});
  displayedColumns: string[] = ['categ', 'subcateg', 'docType', 'action'];
  dataSource: [];
  documentMasterTable: any = [];
  public requireDocsId: any = [13, 5, 4, 3]; //sub category ID's

  constructor(
    public dialog: MatDialog,
    private _fb: UntypedFormBuilder,
    private _exGlobal: ExternalUserGlobalApiService,
    private _onboardServ: OnboardService,
    private _share: ShareService,
    private _http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.getDocumentList();
    this.docUploadForm = this._fb.group({
      uploadDocGroup: this._fb.array([])
    });
  }

  /***
   * get Document category List
   */
  public docCategList: any = [];
  public docSubCategList: any = [];
  getDocumentList() {

  }
  /***
   * get sub Document
   */
  docCategListFunc(categId: any, index: number = null) {
    let filt = this.docSubCategList.filter(f => f.categId == categId);
    return filt;
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

    this._http.get(`${environment.apiMainUrlNet}OnBoard/DownloadDocument?docId=${data.id}&Candidateid=${data?.candidateId}`, { responseType: 'blob' }).subscribe(
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
    elm['cid'] = data.cid;
    elm['id'] = data.id;
    elm['docType'] = 'B';
   //  this._Gl.downloadPrevDocuments(elm);
    OnboardCommonMethod.downloadPrevDocuments(elm,this._http,this.dialog,this._share);
    
  }


}



