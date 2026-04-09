import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { environment } from 'projects/ats-global-system-external/src/environments/environment';
import { saveAs } from "file-saver";
import { GetSetStorageService } from '../services/get-set-storage.service';
import { CandidateService } from '../../candidate-module/candidate.service';
import { CommonImagePreviewExternalComponent } from '../../common-sharing/modal/common-image-preview-external/common-image-preview-external.component';
import { CommonPdfViewerExternalComponent } from '../../common-sharing/modal/common-pdf-viewer-external/common-pdf-viewer-external.component';
import { GlobalMethod } from './global-method';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Injectable({
  providedIn: 'root'
})
export class GlobalCommonMethodService {
  public secretKey = 'ATS123!INF';
  constructor(private http: HttpClient,
    private _storage: GetSetStorageService,
    private _candidateServe: CandidateService
  ) { }
  /***
   * encript
   */
  public encryptData(data) {
    try {
      return CryptoJS.AES.encrypt(JSON.stringify(data), this.secretKey).toString();
    } catch (e) {
      console.log(e);
    }
  }

  public decryptData(data) {
    try {
      const bytes = CryptoJS.AES.decrypt(data, this.secretKey);
      if (bytes.toString()) {
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      }
      return data;
    } catch (e) {
      console.warn(e);
    }
  }


  /***
   * method for export excel
   */
  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    console.log('worksheet', worksheet);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }

  downloadFile(data: any, url: string) {
    this.http.get(`${environment.apiMainUrlNet}${url}=${data.resumePath}`, { responseType: 'blob' }).subscribe(
      res => {
        saveAs(res, data.resume);
      }
    )
  }
  /***
   * hide mail
   */
  hideEmail(email: string) {
    if (email) {
      let hiddenEmail = "";
      for (let i = 0; i < email.length; i++) {
        if (i > 3 && i < email.indexOf("@")) {
          hiddenEmail += "*";
        } else {
          hiddenEmail += email[i];
        }
      }
      return hiddenEmail;
    }
    return null
  }


  /***
   * getSet Location
   */
  getSetLocation() {
    let getComLoc = this._storage.getLocationData();
    let user = this._storage.getSetUserData();
    let locationData: any = {};

    if (environment.locationWise) {
      if (getComLoc) {
        locationData = {
          locId: getComLoc.locId,
          locName: getComLoc.locName
        }

      }
      else {
        if (user?.LocationID) {
          locationData = {
            locId: user?.LocationID,
            locName: user?.LocationName
          }
        }
        else {
          locationData = {
            locId: 1,
            locName: 'Noida'
          }
        }

        this._storage.saveLocationData(locationData);
      }
    }
    //if location disable 
    else {
      locationData = {
        locId: 1,
        locName: 'Noida'
      }
    }

    return locationData;
  }

  /***
   * india location profile
   */
  getProfileIndia(data: any, res: any) {
    let filterById;
    if (data) {
      filterById = [1, 2, 3, 4, 5, 6];
    }
    else {
      filterById = [1, 2, 6];
    }
    let dataRes = res['data'];
    let filterByStatus = dataRes.filter(t => {
      return filterById.indexOf(t.id) !== -1;
    });
    return filterByStatus;
  }

  getProfileListIndia(res: any) {
    let filterById = [1, 2, 3, 4, 5, 6];
    let filterByStatus = res.filter(t => {
      return filterById.indexOf(t.id) !== -1;
    });
    return filterByStatus;
  }
  /***
 * US location profile
 */
  getProfileUs(data: any, res: any) {
    let filterById;
    if (data) {
      filterById = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    }
    else {
      filterById = [1, 2, 6, 7, 8, 9];
    }
    let dataRes = res['data'];
    let filterByStatus = dataRes.filter(t => {
      return filterById.indexOf(t.id) !== -1;
    });
    return filterByStatus;
  }

  getProfileListUs(res: any) {
    let filterById = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    let filterByStatus = res.filter(t => {
      return filterById.indexOf(t.id) !== -1;
    });
    return filterByStatus;
  }


  /** Method to convert base64 to blob */
  public base64toBlob(dataURI: any) {
    const byteString = window.atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([ab], {
      type: mimeString,
    });
    return blob;
  }

  dataURLtoFile(dataurl, filename) {

    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  /***
   * check if candidate fresher
   */
  isCandidateFresher() {
    let expData = this._storage.getCandExp();
    if (expData) {
      if (expData?.year == 0 && expData?.month <= 5) {
        return true
      }
      else {
        return false
      }
    }
  }

   /***
   * check if candidate fresher for bgv
   */
  isCandidateFresherBGV() {
    let expData = this._storage.getCandExpBGV();
    if (expData) {
      if (expData?.year == 0 && expData?.month <= 5) {
        return true
      }
      else {
        return false
      }
    }
  }


   /***
   * check if candidate fresher
   */
    isFinalSubmit(){
      debugger
      let data = this._storage.getIsFinalStatus();
      let onbSt = this._storage.getOnboardStatus();
      
      if(data || data === 0){
        if(data === 1 && onbSt != 30){
          return true
        }
       else if(data === 0 || onbSt == 30){
          return false
        }
        else{
          return true
        }
      }
      else {
        // return false
      }
    } 

    /***
   * check if BGV final submit
   */
  isBGVFinalSubmit() {
    let data = this._storage.getIsBGVFinalStatus();
    if (data) {
      if (data === 1) {
        return true
      }
      else if (data === 0) {
        return false
      }
      else {
        // return false
      }
    } else {
      return false
    }
  }

  /***
   * check if EAF Mandatory documents uploaded
   */
  isEAFMandDocumentsUploaded() {
    let data = this._storage.getIsDocumentsUploaded();
    if (data) {
      if (data === 1) {
        return true
      }
      else if (data === 0) {
        return false
      }
      else {
        // return false
      }
    } else {
      return false
    }
  }

  public downloadPrevDocuments(data: any, http: any, dialog: any, share: any) {
      /**method for only path  */
      if (data?.type == 'path') {
        console.log("path");
        http.get(`${environment.apiMainUrlNet}Candidate/Downloadfiles?filePath=${encodeURIComponent(data.filePath)}`, { responseType: 'blob' }).subscribe(
          res => {
            let elm = {};
            elm['title'] = 'Preview Document';
            // Format filename: DocumentTypeName_CandidateName_cid_date.pdf
            if (data.candidateName && data.documentName && data.cid) {
              const today = new Date();
              const todayDate = GlobalMethod.formatDate(today);
              const candidateName = data.candidateName.replace(/\s+/g, '_');
              const documentTypeName = data.documentName.replace(/\s+/g, '_');
              elm['documentName'] = `${documentTypeName}_${candidateName}_${data.cid}_${todayDate}.pdf`;
            } else {
              elm['documentName'] = data.fileName;
            }
            if (res?.type == 'application/pdf') {
              elm['pdfPreviewData'] = res;
              const dialogRef = dialog.open(CommonPdfViewerExternalComponent, {
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
              const dialogRef = dialog.open(CommonImagePreviewExternalComponent, {
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
            // Format filename: DocumentTypeName_CandidateName_cid_date.pdf
            if (data.candidateName && data.DocumentName && data.id) {
              const today = new Date();
              const todayDate = GlobalMethod.formatDate(today);
              const candidateName = data.candidateName.replace(/\s+/g, '_');
              const documentTypeName = data.DocumentName.replace(/\s+/g, '_');
              elm['documentName'] = `${documentTypeName}_${candidateName}_${data.id}_${todayDate}.pdf`;
            } else {
              elm['documentName'] = data.DocumentName;
            }
            elm['fileName'] = data.fileName;
            if (res?.type == 'application/pdf') {
              elm['pdfPreviewData'] = res;
              const dialogRef = dialog.open(CommonPdfViewerExternalComponent, {
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
              const dialogRef = dialog.open(CommonImagePreviewExternalComponent, {
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
              // Format filename: DocumentTypeName_CandidateName_cid_date.pdf
              if (data.candidateName && data.documentTypeName && data.cid) {
                const today = new Date();
                const todayDate = GlobalMethod.formatDate(today);
                const candidateName = data.candidateName.replace(/\s+/g, '_');
                const documentTypeName = data.documentTypeName.replace(/\s+/g, '_');
                elm['documentName'] = `${documentTypeName}_${candidateName}_${data.cid}_${todayDate}.pdf`;
              } else {
                elm['documentName'] = data.documentTypeName;
              }
              const dialogRef = dialog.open(CommonPdfViewerExternalComponent, {
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
              const dialogRef = dialog.open(CommonImagePreviewExternalComponent, {
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
