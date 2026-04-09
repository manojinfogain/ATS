import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
// import { environment } from 'projects/ats-global-system-external/src/environments/environment';
import { saveAs } from "file-saver";
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class GlobalCommonServLibService {
  public secretKey = 'ATS123!INF';
  constructor(
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

 
}
