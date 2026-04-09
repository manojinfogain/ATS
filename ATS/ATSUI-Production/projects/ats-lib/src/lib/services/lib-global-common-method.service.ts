import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { saveAs } from "file-saver";
import { LibGetSetStorageService } from './lib-get-set-storage.service';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Injectable({
  providedIn: 'root'
})
export class LibGlobalCommonMethodService {
  public secretKey = 'ATS123!INF';
  constructor(private http: HttpClient,
    private _storage: LibGetSetStorageService,
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

  downloadFile(baseUrlMain:string='', data: any, url: string) {
    this.http.get(`${baseUrlMain}${url}=${data.resumePath}`, { responseType: 'blob' }).subscribe(
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
  getSetLocation(islocationWiseEnv: boolean) {
    let getComLoc = this._storage.getLocationData();
    let user = this._storage.getSetUserData();
    let locationData: any = {};

    if (islocationWiseEnv) {
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

  getProfileListUs( res: any) {
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
        
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new File([u8arr], filename, {type:mime});
}

  /***
   * check if candidate fresher
   */
   isCandidateFresher(){
    let expData = this._storage.getCandExp();
    if(expData){
      if(expData?.year == 0 && expData?.month <=5){
        return true
      }
      else{
        return false
      }
    }
   }


   /***
   * check if candidate fresher
   */
    isFinalSubmit(){
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
      else{
        return true
      }
     }



}
