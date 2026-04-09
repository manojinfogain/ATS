import * as moment from 'moment';
import { CommonImagePreviewModalComponent } from '../../common-sharing/modals/common-image-preview-modal/common-image-preview-modal.component';
import { CommonPdfViewerInternalComponent } from '../../common-sharing/modals/common-pdf-viewer-internal/common-pdf-viewer-internal.component';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { saveAs } from "file-saver";
import { ShareService } from '../services/share.service';
export class OnboardCommonMethod {

  public static downloadPrevDocuments(data: any, http: any, dialog: any, share: any) {
    /**method for only path  */
    if (data?.type == 'path') {
      console.log("path");
      // Dashboard/downloadFile?filelocation=${encodeURIComponent(data.filePath)}
      http.get(`${environment.apiMainUrlNet}OnBoard/downloadPendingDocument?cid=${data.cid}&docID=${data.docID}`, { responseType: 'blob' }).subscribe(
        res => {
          let elm = {};
          elm['title'] = 'Preview Document';
          elm['documentName'] = data.DocumentName;
          elm['fileName'] = data.fileName?.replace(/\.(dat|enc)$/i, '');
          if (res?.type == 'application/pdf') {
            elm['pdfPreviewData'] = res;
            const dialogRef = dialog.open(CommonPdfViewerInternalComponent, {
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
            const dialogRef = dialog.open(CommonImagePreviewModalComponent, {
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
            saveAs(res, data.fileName);
          }
        },
        (error) => {
          share.showAlertErrorMessage.next('Something went wrong');
        }
      )
    }/**method behalf on document id */ 
    else if (data?.type == 'docid') {
      console.log("docId");
      http.get(`${environment.apiMainUrlNet}OnBoard/downloadUploadedDocById?Id=${data.id}&Type=${data.docType}`, { responseType: 'blob' }).subscribe(
        res => {
          let elm = {};
          elm['title'] = 'Preview Document';
          elm['documentName'] = data.DocumentName;
          elm['fileName'] = data.fileName?.replace(/\.(dat|enc)$/i, '');
          if (res?.type == 'application/pdf') {
            elm['pdfPreviewData'] = res;
            const dialogRef = dialog.open(CommonPdfViewerInternalComponent, {
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
            const dialogRef = dialog.open(CommonImagePreviewModalComponent, {
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
            saveAs(res, data.fileName);
          }
        },
        (error) => {
          share.showAlertErrorMessage.next('Something went wrong');
        }
      )
    }
    
    /**method behalf on IDs- id,cid */
    else {
      console.log("IDS")
      http.get(`${environment.apiMainUrlNet}OnBoard/DownloadDocument?docId=${data?.id}&cid=${data?.cid}`, { responseType: 'blob' }).subscribe(
        res => {
          // saveAs(res, data.fileName);
          let elm = [];
          elm['title'] = 'Preview Document';
          if (res?.type == 'application/pdf') {
            elm['pdfPreviewData'] = res;
            elm['documentName'] = data.documentTypeName;
            elm['fileName'] = data.fileName?.replace(/\.(dat|enc)$/i, '');
            const dialogRef = dialog.open(CommonPdfViewerInternalComponent, {
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
            const dialogRef = dialog.open(CommonImagePreviewModalComponent, {
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
          share.showAlertErrorMessage.next('Something went wrong');
        }
      )
    }

  }

  public static downloadPrevDocumentsOld(data: any, http: any, dialog: any, share: any) {
    /**method for only path  */
    if (data?.type == 'path') {
      console.log("path");
      http.get(`${environment.apiMainUrlNet}Dashboard/downloadFile?filelocation=${encodeURIComponent(data.filePath)}`, { responseType: 'blob' }).subscribe(
        res => {
          let elm = {};
          elm['title'] = 'Preview Document';
          elm['documentName'] = data.DocumentName;
          elm['fileName'] = data.fileName?.replace(/\.(dat|enc)$/i, '');
          if (res?.type == 'application/pdf') {
            elm['pdfPreviewData'] = res;
            const dialogRef = dialog.open(CommonPdfViewerInternalComponent, {
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
            const dialogRef = dialog.open(CommonImagePreviewModalComponent, {
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
            saveAs(res, data.fileName);
          }
        },
        (error) => {
          share.showAlertErrorMessage.next('Something went wrong');
        }
      )
    }/**method behalf on document id */ 
    else if (data?.type == 'docid') {
      console.log("docId");
      http.get(`${environment.apiMainUrlNet}OnBoard/downloadUploadedDocById?Id=${data.id}&Type=${data.docType}`, { responseType: 'blob' }).subscribe(
        res => {
          let elm = {};
          elm['title'] = 'Preview Document';
          elm['documentName'] = data.DocumentName;
          elm['fileName'] = data.fileName?.replace(/\.(dat|enc)$/i, '');
          if (res?.type == 'application/pdf') {
            elm['pdfPreviewData'] = res;
            const dialogRef = dialog.open(CommonPdfViewerInternalComponent, {
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
            const dialogRef = dialog.open(CommonImagePreviewModalComponent, {
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
            saveAs(res, data.fileName);
          }
        },
        (error) => {
          share.showAlertErrorMessage.next('Something went wrong');
        }
      )
    }
    
    /**method behalf on IDs- id,cid */
    else {
      console.log("IDS")
      http.get(`${environment.apiMainUrlNet}OnBoard/DownloadDocument?docId=${data?.id}&cid=${data?.cid}`, { responseType: 'blob' }).subscribe(
        res => {
          // saveAs(res, data.fileName);
          let elm = [];
          elm['title'] = 'Preview Document';
          if (res?.type == 'application/pdf') {
            elm['pdfPreviewData'] = res;
            elm['documentName'] = data.documentTypeName;
            elm['fileName'] = data.fileName?.replace(/\.(dat|enc)$/i, '');
            const dialogRef = dialog.open(CommonPdfViewerInternalComponent, {
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
            const dialogRef = dialog.open(CommonImagePreviewModalComponent, {
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
          share.showAlertErrorMessage.next('Something went wrong');
        }
      )
    }

  }

}