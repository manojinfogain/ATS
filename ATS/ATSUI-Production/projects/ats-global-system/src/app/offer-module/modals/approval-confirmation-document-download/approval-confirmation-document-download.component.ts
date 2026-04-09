import { SelectionModel } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { saveAs } from "file-saver";
import { forkJoin } from 'rxjs';
import { OfferService } from '../../offer.service';
import { CommonPdfViewerInternalComponent } from '../../../common-sharing/modals/common-pdf-viewer-internal/common-pdf-viewer-internal.component';
import { ViewProfilePicsComponent } from '../../../common-sharing/interview/view-profile-pics/view-profile-pics.component';
import { CommonImagePreviewModalComponent } from '../../../common-sharing/modals/common-image-preview-modal/common-image-preview-modal.component';

@Component({
  selector: 'app-approval-confirmation-document-download',
  templateUrl: './approval-confirmation-document-download.component.html',
  styleUrls: ['./approval-confirmation-document-download.component.scss']
})
export class ApprovalConfirmationDocumentDownloadComponent implements OnInit {
  apprDocDataColum = ['fileName', 'action'];

  public apprDocData: any = [];
  constructor(
    public dialogRef: MatDialogRef<ApprovalConfirmationDocumentDownloadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private _offerService: OfferService,
    private http: HttpClient,
    private _share: ShareService
  ) { }

  ngOnInit() {
    this.getDetails();
  }

  //getting details
  getDetails() {
    forkJoin([
      this._offerService.getCandidateOfferAprDetails(this.data.cid),
    ]).subscribe(
      res => {
        this.apprDocData = res[0]['approvaldoc'];
      }
    )
  }

  //download Appr doc
  dwnloadApprDoc(data) {
    this.http.get(`${environment.apiMainUrlNet}Offer/DownloadTidReopenOffrApprovalDocumet?id=${data.id}`, { responseType: 'blob' }).subscribe(
      res => {
        // saveAs(res, data.fileName);
        let elm = [];
        debugger
        elm['title'] = 'Preview Transfer Approval';
        if(res?.type == 'application/pdf'){
          elm['pdfPreviewData'] = res;
          elm['documentName'] = data.fileName;
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
      }else if(res?.type == 'image/png' || res?.type == 'image/jpeg' || res?.type == 'image/jpg'){
        elm['picSource'] = res;
        elm['title'] = 'Preview Transfer Approval Document';
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
      }else{        
        saveAs(res, data.fileName);
      }
      },
      (error) => {
        this._share.showAlertErrorMessage.next('Something went wrong');
      }
    )
  }


  /***
  * close dialog
  */
  closeModal(): void {
    this.dialogRef.close();
  }



}
