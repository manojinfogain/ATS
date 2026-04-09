import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { GetSetStorageService } from '../services/get-set-storage.service';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Injectable({
  providedIn: 'root'
})
export class ExcelService {
  constructor( private _storage: GetSetStorageService) { }
  public exportAsExcelFile(json: any[], excelFileName: string): void {
  // / 
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    console.log('worksheet',worksheet);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    let today = new Date();
    let todayDate =this.convertDate(today);
    const getUsername = this._storage.getUserEmpId();
 //   const recName = getUsername.replace(/\s/g, " ");
    FileSaver.saveAs(data, fileName +' '+todayDate + EXCEL_EXTENSION);
  }

  convertDate(date) {
    var yyyy = date.getFullYear().toString();
    var mm = (date.getMonth()+1).toString();
    var dd  = date.getDate().toString();
  
    var mmChars = mm.split('');
    var ddChars = dd.split('');
  
   // return yyyy + '-' + (mmChars[1]?mm:"0"+mmChars[0]) + '-' + (ddChars[1]?dd:"0"+ddChars[0]);
   return (ddChars[1]?dd:"0"+ddChars[0]) + '-' + (mmChars[1]?mm:"0"+mmChars[0])+ '-' + yyyy;
  }


public exportAsExcelFileDateOnly(
  json: any[],
  excelFileName: string,
  dateKeys: string[]
): void {

  const headers = Object.keys(json[0]);

  const processed = json.map(row => {
    const r = { ...row };

    dateKeys.forEach(k => {
      if (r[k]) {
        r[k] = this.toExcelSerial(new Date(r[k]));
      }
    });

    return r;
  });

  const worksheet = XLSX.utils.json_to_sheet(processed);

  // SAFELY apply date format
  const ref = worksheet['!ref'];
  if (ref) {
    const range = XLSX.utils.decode_range(ref);

    dateKeys.forEach(key => {
      const colIndex = headers.indexOf(key);
      if (colIndex === -1) return;

      for (let r = range.s.r + 1; r <= range.e.r; r++) {
        const addr = XLSX.utils.encode_cell({ r, c: colIndex });
        const cell = worksheet[addr];

        if (cell && typeof cell.v === 'number') {
          cell.t = 'n';
          cell.z = 'dd-mm-yyyy';
        }
      }
    });
  }

  const workbook: XLSX.WorkBook = {
    Sheets: { Sheet1: worksheet },
    SheetNames: ['Sheet1']
  };

  const buffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array'
  });

  this.saveAsExcelFile(buffer, excelFileName);
}

private toExcelSerial(date: Date): number {
  const excelEpoch = new Date(Date.UTC(1899, 11, 30));
  const utcDate = Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  return Math.floor((utcDate - excelEpoch.getTime()) / 86400000);
}


}
