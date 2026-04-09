import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { saveAs } from "file-saver";
import { GetSetStorageService } from '../services/get-set-storage.service';
import { dashboardGraphLabel } from './enums';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MessageDisplayComponent } from '../../common-sharing/modals/message-display/message-display.component';
import { CommonPdfViewerInternalComponent } from '../../common-sharing/modals/common-pdf-viewer-internal/common-pdf-viewer-internal.component';
import { CommonImagePreviewModalComponent } from '../../common-sharing/modals/common-image-preview-modal/common-image-preview-modal.component';
import { ShareService } from '../services/share.service';
import { COMMON_CONST } from '../constant/common.const';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Injectable({
  providedIn: 'root'
})
export class GlobalCommonMethodService {
  public secretKey = 'ATS123!INF';
  constructor(private http: HttpClient,
    private _storage: GetSetStorageService,
    public dialog: MatDialog,
    private _share: ShareService
  ) { }
  /***
   * msg Diaplay
   */
  showMessagedisplay(paramBody: any = {}) {
    let data: any = {}
    data['autoHide'] = false;
    data['title'] = paramBody.title;
    data['msg'] = paramBody.msg;
    data['duration'] = paramBody.duration || 100;
    const dialogRef = this.dialog.open(MessageDisplayComponent, {
      width: '500px',
      panelClass: ['ats-msg-modal'],
      data: data,
      //   disableClose: true
    });
  }
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
    let resumeName = this.removeLastExtension(data?.resume);
    this.http.get(`${environment.apiMainUrlNet}${url}=${encodeURIComponent(data.resumePath)}`, { responseType: 'blob' }).subscribe(
      res => {
        saveAs(res, resumeName);
      }
    )
  }

  downloadTalentFile(thid:number,type:string,name:string){
    this.http.get(`${environment.apiMainUrlNet}Talent/downloadTalentDocument?thid=${thid}&docType=${type}`, { responseType: 'blob' }).subscribe(
      res => {
        saveAs(res, name);
      }
    )
  }

  /**
   *
   * @param path common download
   * @param url
   * @param name
   */
  downloadFileCommon(path: string, name: string) {
    let Name = this.removeLastExtension(name);
    this.http.get(`${environment.apiMainUrlNet}Dashboard/downloadFile?filelocation=${encodeURIComponent(path)}`, { responseType: 'blob' }).subscribe(
      res => {
        saveAs(res, Name);
      }
    )
  }

  downloadGovtIdDocument(cid: number, name: string) {
    let Name = this.removeLastExtension(name);
    this.http.get(`${environment.apiMainUrlNet}Interview/downloadGovtIdDocument?cid=${cid}`, { responseType: 'blob' }).subscribe(
      res => {
        saveAs(res, Name);
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

  public requistionActionControlRight(data: any) {
    let userData = this._storage.getSetUserData();
    if (data?.recruiter1EmpId == userData?.EmpNewId ||
      data?.recruiter2EmpId == userData?.EmpNewId
      //  userData?.RoleId == 6 ||
      //  userData?.RoleId == 5
    ) {
      return true
    }
    else {
      return false
    }
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
  getProfileIndia(data: any, res: any, idTobeFiltered: any = []) {
    let filterById;
    // if (data) {
    //   filterById = [1, 2, 3, 4, 5, 6];
    // }
    // else {
    //   filterById = [1, 2, 6];
    // }
    debugger
    if (idTobeFiltered.length != 0) {
      //  filterById = [1, 2, 6];
      let dataRes = res['data'];
      let filterByStatus = dataRes.filter(t => {
        return idTobeFiltered.indexOf(t.id) !== -1;
      });
      return filterByStatus;
    }
    else {
      filterById = [1, 2, 6,10];
      let dataRes = res['data'];
      let filterByStatus = dataRes.filter(t => {
        return filterById.indexOf(t.id) !== -1;
      });
      return filterByStatus;
    }


  }

  getProfileRenuTeamG5Above(data: any, res: any,idTobeFiltered:any = []) {
    let filterById;
    // if (data) {
    //   filterById = [1, 2, 3, 4, 5, 6];
    // }
    // else {
    //   filterById = [1, 2, 6];
    // }
    filterById = [1, 2,4,5,6];
    let dataRes = res['data'];
    let filterByStatus = dataRes.filter(t => {
      return filterById.indexOf(t.id) !== -1;
    });
    return filterByStatus;


  }

  getProfileListIndia(res: any) {
    let filterById = [1, 2, 3, 4, 5, 6,10,15];
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
    // if (data) {
    //   filterById = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    // }
    // else {
    //   filterById = [1, 2, 5, 6, 7, 8, 9];
    // }
    filterById = [1, 2, 6, 7, 8, 9,10,4];
    let dataRes = res['data'];
    let filterByStatus = dataRes.filter(t => {
      return filterById.indexOf(t.id) !== -1;
    });
    return filterByStatus;
  }

   /***
 * US location profile
 */
   getProfileUsTalentStatus(data: any, res: any) {
    let filterById;
    // if (data) {
    //   filterById = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    // }
    // else {
    //   filterById = [1, 2, 5, 6, 7, 8, 9];
    // }
    filterById = [1, 2,5, 6, 7, 8, 9,10,4];
    let dataRes = res['data'];
    let filterByStatus = dataRes.filter(t => {
      return filterById.indexOf(t.id) !== -1;
    });
    return filterByStatus;
  }

  getProfileListUs(res: any) {
    let filterById = [1, 2, 3, 4, 5, 6, 7, 8, 9,10];
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


  covertAsChartData(reportList) {
    let ChartData = [
      // {
      //   "name": dashboardGraphLabel['TotalPosition'],
      //   "value": reportList.Totalpositions
      // },
      {
        "name": dashboardGraphLabel['OpenPositions'],
        "value": reportList.OpenOpsitions
      },
      {
        "name": dashboardGraphLabel['PendingForScreen'],
        "value": reportList.NotScheduled
      },
      {
        "name": dashboardGraphLabel['ScreeningRound'],
        "value": reportList.ScreeningRound
      },
      {
        "name": dashboardGraphLabel['TechnicalRound'],
        "value": reportList.techRound
      },
      {
        "name": dashboardGraphLabel['TechnicalRound2'],
        "value": reportList?.techRound2 || 0
      },
      {
        "name": dashboardGraphLabel['ManagerialRound'],
        "value": reportList.ManagerialRound
      },
      // {
      //   "name": dashboardGraphLabel['MgmtRound'],
      //   "value": reportList.ManagementRound
      // },
      {
        "name": dashboardGraphLabel['ClientRound'],
        "value": reportList.ClientRound
      },

      {
        "name": dashboardGraphLabel['Selected'],
        "value": reportList.HRSelected
      },
      {
        "name": dashboardGraphLabel['Rejected'],
        "value": reportList.HRRejected
      },
      {
        "name": dashboardGraphLabel['Hold'],
        "value": reportList.HrOnHold
      },
      {
        "name": dashboardGraphLabel['OfferedGiven'],
        "value": reportList.OfferGiven
      },
      {
        "name": dashboardGraphLabel['OfferedDecline'],
        "value": reportList.OfferDecline
      },
      {
        "name": dashboardGraphLabel['YTJCandidates'],
        "value": reportList.YTJ
      },
      {
        "name": dashboardGraphLabel['CandidatesJoined'],
        "value": reportList.Joined
      }
    ]

    return ChartData;

  }



 validationGradeAboveG4AndAbove(gradeId:number){
  //G4
  if(gradeId === 205){
    return true
  }
  //G5
  else if(gradeId === 206){
    return true
  }
   //G6
   else if(gradeId === 207){
    return true
  }
   //G7
   else if(gradeId === 208){
    return true
  }
   //G8
   else if(gradeId === 209){
    return true
  }
   //G9
   else if(gradeId === 210){
    return true
  }
    //G10
    else if(gradeId === 211){
      return true
    }
    else{
      return false
    }


 }

 validationGradeAboveG4Above(gradeId:number){

  //G5
  if(gradeId === 206){
    return true
  }
   //G6
   else if(gradeId === 207){
    return true
  }
   //G7
   else if(gradeId === 208){
    return true
  }
   //G8
   else if(gradeId === 209){
    return true
  }
   //G9
   else if(gradeId === 210){
    return true
  }
    //G10
    else if(gradeId === 211){
      return true
    }
    else{
      return false
    }


 }

 removeLastExtension(fileName: string): string {
  if (!fileName) return fileName; // Handle empty/null input

  const lowerFileName = fileName.toLowerCase();

  if (lowerFileName.endsWith(".enc") || lowerFileName.endsWith(".dat")) {
    return fileName.substring(0, fileName.lastIndexOf(".")); // Removes the last .enc or .dat
  }

  return fileName; // Return unchanged if extension is not .enc or .dat
}

/**
   *
   * @param path common download
   * @param url
   * @param name
   */
downloadFileCskill(path: string, name: string) {
   let c_skillProfilePath =COMMON_CONST.cskillBaseUrl;
   /**
    * if path contains cskillBaseUrl then download from cloud url
    */
   if(path?.toLowerCase().includes(c_skillProfilePath)){
    this.http.get(`${environment.apiMainUrlNet}common/downloadCskillFile?fileWebUrl=${encodeURIComponent(path)}`, { responseType: 'blob' }).subscribe(
      res => {
        saveAs(res, name);
      }
    )
   }
   else{
    this.http.get(`${environment.apiMainUrlNet}Dashboard/downloadFile?filelocation=${encodeURIComponent(path)}`, { responseType: 'blob' }).subscribe(
      res => {
        saveAs(res, name);
      },
      (error) => {
        this._share.showAlertErrorMessage.next('Something went wrong');
      }
    )
   }

}


DownLoadResumeAll(Id:string,profileId:number, isProfileInterview:number =0,resumePath:string =null,resumeName:string =null){
  debugger
let c_skillProfilePath =COMMON_CONST.cskillBaseUrl;
  if(profileId == 3 && isProfileInterview == 0){
     this.http.get(`${environment.apiMainUrlNet}common/downloadCskillFile?fileWebUrl=${encodeURIComponent(resumePath)}`, { responseType: 'blob' }).subscribe(
      res => {
        saveAs(res, this.removeLastExtension(resumeName));
      }
    )
  }
   else if(profileId == 3 && isProfileInterview == 1 && resumePath?.toLowerCase().includes(c_skillProfilePath)){
     this.http.get(`${environment.apiMainUrlNet}common/downloadCskillFile?fileWebUrl=${encodeURIComponent(resumePath)}`, { responseType: 'blob' }).subscribe(
      res => {
        saveAs(res, this.removeLastExtension(resumeName));
      }
    )
  }
  else{
      if(isProfileInterview == 1){
         this.http.get(`${environment.apiMainUrlNet}Dashboard/downloadResume?candidateId=${Id}`, { responseType: 'blob' }).subscribe(
        res => {
          saveAs(res,this.removeLastExtension(resumeName));
        }
      )
      }
      else{
         this.http.get(`${environment.apiMainUrlNet}Dashboard/downloadResume?id=${Id}`, { responseType: 'blob' }).subscribe(
       res => {
         saveAs(res,this.removeLastExtension(resumeName));
       }
     )
    }
      

  }

}



/**
   *
   * @param path common download
   * @param url
   * @param name
   */
  downloadResume(candidateId?: string, id?: string) {
    if(candidateId){
      this.http.get(`${environment.apiMainUrlNet}Dashboard/downloadResume?candidateId=${candidateId}`, { responseType: 'blob' }).subscribe(
        res => {
          saveAs(res);
        },
        (error) => {
          this._share.showAlertErrorMessage.next('Something went wrong');
        }
      )
    }
    else{
     this.http.get(`${environment.apiMainUrlNet}Dashboard/downloadResume?id=${id}`, { responseType: 'blob' }).subscribe(
       res => {
         saveAs(res);
       },
       (error) => {
         this._share.showAlertErrorMessage.next('Something went wrong');
       }
     )
    }

 }



/***
  * RATING MERGED
  */
// mergeAIAndPanelAssessmentData(panelAssessmentData:any, AIAssesmentDataArr:any) {
//   const mergedData = panelAssessmentData.map(panelAssessmentData => {
//     const aiRating = AIAssesmentDataArr.find(AIAssesmentDataArr => AIAssesmentDataArr?.name === panelAssessmentData.Area)?.rating || 0;
//     return {
//       Area: panelAssessmentData?.Area,
//       RatingByPanel: panelAssessmentData?.rating,
//       RatingByAI: aiRating
//     };
//   });

// return mergedData;
// }

 mergeAIAndPanelAssessmentData(panelAssessmentData:any, aiAssessmentDataArr:any) {
  // Ensure panelAssessmentData is a valid array
  if (!Array.isArray(panelAssessmentData)) {
    return []; // Return an empty array if panelAssessmentData is not valid
  }

  // Map over panelAssessmentData
  const mergedData = panelAssessmentData.map(panelData => {
    // If aiAssessmentDataArr is empty or not an array, always set aiRating to null
    if (!Array.isArray(aiAssessmentDataArr) || aiAssessmentDataArr.length === 0) {
      return {
        Area: panelData?.Area,
        RatingByPanel: panelData?.rating,
        RatingByAI: null
      };
    }

    // Find the corresponding AI rating
    const aiRating = aiAssessmentDataArr.find(aiData => aiData?.name === panelData?.Area)?.rating || 0;

    return {
      Area: panelData?.Area,
      RatingByPanel: panelData?.rating,
      RatingByAI: aiRating
    };
  });

  return mergedData;
}


mergeAIQuestRating(panelAssessmentData:any, AIAssesmentDataArr:any) {
  const mergedData = panelAssessmentData.map(panelAssessmentData => {
    const aiRating = AIAssesmentDataArr.find(AIAssesmentDataArr => AIAssesmentDataArr?.name === panelAssessmentData.QuestionAuto)?.rating || 0;
    return {
      Area: panelAssessmentData?.QuestionAuto,
      Ans:panelAssessmentData?.AutoQAns,
      RatingByPanel: panelAssessmentData?.rating,
      RatingByAI: aiRating
    };
  });

return mergedData;
}

 /**
   * Convert API date string to proper Excel date object
   * @param dateString - Date string from API (e.g., "2025-11-04T00:00:00")
   * @returns Date object or null for null/undefined values
   */
  convertToExcelDate(dateString: string): Date | null {
    if (!dateString) {
      return null;
    }
    try {
      // Parse the ISO date string and return Date object
      return new Date(dateString);
    } catch (error) {
      // If parsing fails, return null
      return null;
    }
  }

convertToExcelDateWithoutTime(dateString: string): Date | null {
  if (!dateString) return null;

  const d = new Date(dateString);
  if (isNaN(d.getTime())) return null;

  d.setHours(0, 0, 0, 0); // 🔥 critical
  return d;
}





}
