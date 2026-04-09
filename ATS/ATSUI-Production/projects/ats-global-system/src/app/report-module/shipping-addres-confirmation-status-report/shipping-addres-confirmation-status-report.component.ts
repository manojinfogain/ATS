import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatSort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { ExcelService } from 'projects/ats-global-system/src/app/core/common/excel.service';
import { AtsCommonPrefix } from 'projects/ats-global-system/src/app/core/constant/common.const';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { CidPrefixPipe } from 'projects/ats-global-system/src/app/shared/pipes-directives/pipes/cid-prefix.pipe';
import { ReportService } from '../report.service';

@Component({
  selector: 'app-shipping-addres-confirmation-status-report',
  templateUrl: './shipping-addres-confirmation-status-report.component.html',
  styleUrls: ['./shipping-addres-confirmation-status-report.component.scss'],
  providers: [DatePipe,CidPrefixPipe ]
})
export class ShippingAddresConfirmationStatusReportComponent implements OnInit {
  displayedColumns = ['tId', 'Cid', 'candName','candiEmail','contactNumber','priRectru','secRectru','dateOfJoing','isAddreConfir','AddrconfirmOnDate','AddrconfirmByRecr'

];
public userData: any = {};
public sortFormFilter: UntypedFormGroup = new UntypedFormGroup({});
public candidateList: any = [];
public searchInput: string;
public paginationData: any;
public pazeOption: any = [10, 20, 50, 100];
public pazeSize: any = 10;
public thId: string = '';
public jumpFirstPage: boolean = false;
public isResetSearch: boolean = false;
public isResetFilter: boolean = false;
public sortParam: string = '';
public cidColName:string = AtsCommonPrefix.CidColName;
public cidPrefix:string = AtsCommonPrefix.CidPrefix;
@ViewChild(MatSort) sort: MatSort;
public sortTable: string = '';
@ViewChild('paginatorRef', { static: true }) paginatorCompRef;
constructor(
  private _storage: GetSetStorageService,
  private _reportServe: ReportService,
  public dialog: MatDialog,
  public datepipe: DatePipe,
  public _excelService: ExcelService,
  private _fb: UntypedFormBuilder,
  private _cidPrefix: CidPrefixPipe
) {}

ngOnInit() {
}
ngAfterViewInit() {
  this.getShippingAddreConfirStatus(1, this.pazeSize, '');
}

/***
 * reset paging
 */
resetPagination() {
  this.paginatorCompRef.paginator.pageIndex = 0;
}

//getting data
getShippingAddreConfirStatus(page: number, pageSize: number, search: string) {
  let queryString = `page=${page}&pageSize=${pageSize}&search=${search?search:''}`;
  this._reportServe.GetCandidateAddresConfirmationStatus(queryString).subscribe(
    res => {
      this.candidateList = new MatTableDataSource(res['data']);
      this.paginationData = res['Table1'][0];     
    }
  )
}



/**
* pagination method
* @param pageEvent 
*/
getPagingData(pageEvent: any) {
  this.getShippingAddreConfirStatus(pageEvent.pageIndex + 1, pageEvent.pageSize, this.searchInput);
}

/***
   * search
   */
getSearchValueKey(e: any) {
  //this.isResetFilter = true;
  this.isResetSearch = false;
  //  this.sortParam = '';
  this.searchInput = e;
  this.jumpFirstPage = false;
  this.jumpFirstPage = true;
  this.getShippingAddreConfirStatus(1, this.pazeSize, e);
}

/* filter form Init
*/

 /**
* get filter value
* @param data
*/
getSortData(data: string) {
  this.isResetSearch = true;
  this.isResetFilter = false;
  this.searchInput = '';
  this.sortParam = data;
  this.resetPagination();
   //this.getCandidateOffer(1, this.pazeSize, this.searchInput, data, this.sortTable);
  if (data == '') {
   
    this.getShippingAddreConfirStatus(1, this.pazeSize, this.searchInput, );
  }
  else {
    this.sortParam =data;
     this.getShippingAddreConfirStatus(1, this.pazeSize, this.searchInput);
  }
}


  /***
   * get PAst Date
   */
  //  getPastdate() {
  //   let currentDate = new Date();
  //   // let pastDate = new Date(currentDate);
  //   /**
  //    * 8 days before
  //    */
  //   // pastDate.setDate(pastDate.getDate() - 7);
  //   let firstDayMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  //   let dateParse = GlobalMethod.formatDate(firstDayMonth);
  //   return dateParse;
  // }

//export report in  excel
exportAsXLSX(): void {
  let queryString = `page=1&pageSize=${this.paginationData?.Total}${this.sortParam ? this.sortParam : ''}`;
  this._reportServe.GetCandidateAddresConfirmationStatus(queryString).subscribe(
    res => {
      let candidateList = res['data'];
      let filterDataExcel = [];
      let dateFormat ='dd-MMM-yyy'
      for (var key in candidateList) {
        let selectedData = {
          'Talent ID': candidateList[key].THID,
          // 'CID': this.cidPrefix+candidateList[key].cid,
          'CID': this._cidPrefix.transform(candidateList[key].cid,  candidateList[key].ProfileId),
          'Candidate Name': candidateList[key].CandidateName,
          'Email': candidateList[key].CandidateEmail,
          'Contact Number': candidateList[key].CandidatePhone,
          'Primary Recruiter': candidateList[key].PrimaryRecruiter,
          'Secondary Recruiter': candidateList[key].SecondaryRecruiter,
          'Tentative Date of Joining':this.datepipe.transform(candidateList[key].DateOfJoining, dateFormat ),
          'Address Confirmed': candidateList[key].IsAddressConfirmed,  
          'Address confirmed Date': candidateList[key].AddrconfirmOnDate,  
         'Address Confirmed by Recruiter': candidateList[key].AddrconfirmByRecr 
          
        };
        filterDataExcel.push(selectedData);
      }

      this._excelService.exportAsExcelFile(filterDataExcel, 'Current Address Confirmation Status Report');
    }
  )
}

}
