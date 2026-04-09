import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { GlobalMethod } from '../../core/common/global-method';
import { AtsCommonPrefix, SPECIALACCESSUSER } from '../../core/constant/common.const';
import { CONSTANTS } from '../../core/constant/constants';
import { GetSetStorageService } from '../../core/services/get-set-storage.service';
import { OnboardService } from '../onboard.service';
import { DatePipe } from '@angular/common';
import { ExcelService } from '../../core/common/excel.service';

@Component({
  selector: 'app-candidate-verification-report',
  templateUrl: './candidate-verification-report.component.html',
  styleUrls: ['./candidate-verification-report.component.scss'],
  providers: [DatePipe]
})
export class CandidateVerificationReportComponent implements OnInit {
  displayedColumns = ['EmployeeCode', 'EmployeeName', 'Talent_ID', 'joiningDate', 'RMConnectVerification',
  'RMConnectVerificationdoneon', 'RMConnectVerificationdoneby', 'RMConnectVerificationSuccessful',
  'RMConnectPendingFrom','RemarksRM',
  'ISSConnectVerification',
  'ISSConnectVerificationdoneon', 'ISSConnectVerificationdoneby', 'ISSConnectVerificationSuccessful',
  'ISSConnectPendingFrom','RemarksISS', 'HRVerificationPost7days','HRVerificationdoneon','HRVerificationdoneby','HRVerificationSuccess','HRConnectPendingFrom','RemarksHR'];
private thId: string;
public userData: any = {};
public searchInput: string = '';
public sortParam: string = '';
public paginationData: any;
public candidateList: any = [];
public sortFormFilter: UntypedFormGroup = new UntypedFormGroup({});
public isResetSearch: boolean = false;
public isResetFilter: boolean = false;
public cidColName: string = AtsCommonPrefix.CidColName;
public cidPrefix: string = AtsCommonPrefix.CidPrefix;
/** Paginator Reference */
@ViewChild('paginatorRef', { static: true }) paginatorCompRef;
constructor(
  private _fb: UntypedFormBuilder,
  private _onboard: OnboardService,
  private _storage:GetSetStorageService,
  private _excelService: ExcelService,
  public datepipe: DatePipe,

) {
}

ngOnInit() {
  this.filterFormInit();
  this.userData = this._storage.getSetUserData();
}

ngAfterViewInit() {
  this.getOnboardingCandidateList(1, CONSTANTS.PAGE_SIZE, null, { startDate: null });
}


/**
 * reset filter and search
 */
resetSortFilter() {
  this.isResetSearch = true;
  this.isResetFilter = true;
  this.searchInput = '';
  this.sortParam = '';
}
/**
* get filter value
* @param data
*/
getSortData(data: string) {
  this.isResetSearch = true;
  this.isResetFilter = false;
  this.searchInput = '';
  this.sortParam = data;
  this.paginatorCompRef.paginator.pageIndex = 0;
  this.getOnboardingCandidateList(1, CONSTANTS.PAGE_SIZE, this.searchInput, data);
}


/**
 * get selected talent Id
 * @param data 
 */
getDataTalent(data) {
  this.resetSortFilter();
  this.thId = data.TH_ID;
  this.paginatorCompRef.paginator.pageIndex = 0;
  this.getOnboardingCandidateList(1, CONSTANTS.PAGE_SIZE, this.searchInput, this.sortParam)
}

/**
* pagination method
* @param pageEvent 
*/
getPagingData(pageEvent: any) {
  this.getOnboardingCandidateList(pageEvent.pageIndex + 1, pageEvent.pageSize, this.searchInput ? this.searchInput : null, this.sortParam);
}

/***
 * search
 */
getSearchValueKey(e: any) {
  this.isResetFilter = true;
  this.isResetSearch = false;
  this.sortParam = '';
  this.searchInput = e;
  this.paginatorCompRef.paginator.pageIndex = 0;
  this.getOnboardingCandidateList(1, CONSTANTS.PAGE_SIZE, e, this.sortParam);
}
/**
 * get candidate list
 * @param page 
 * @param pageSize 
 * @param search 
 */

/***
* filter form Init
*/
filterFormInit() {
  this.sortFormFilter = this._fb.group({
    offerstatus: [[]],
    dateStart: [null],
    dateEnd: [{ value: null, disabled: true }]
  })
}


public bodyParam: any = {};
getOnboardingCandidateList(page: number, pageSize: number, search: any, sortParam: any) {
  
  this.bodyParam = {};
  let body = {
    page: page,
    pageSize: pageSize
  }
  if (sortParam?.dateStart) {
    body['startDate'] = GlobalMethod.formatDate(sortParam?.dateStart);
  }
  if (sortParam?.dateEnd) {
    body['endDate'] = GlobalMethod.formatDate(sortParam?.dateEnd);
  }

  if (this.thId) {
    body['thid'] = this.thId
  }
  if (search) {
    body['search'] = search;
  }
  if (sortParam.offerstatus && sortParam.offerstatus.length !== 0) {
    let offerstatusIds = sortParam.offerstatus.filter(n => n);
    body['offerStatus'] = offerstatusIds.toString();
  }


  this.bodyParam = body;
  this._onboard.GetOnboardCandidateVerificationReport(body).subscribe(
    res => {
      this.candidateList = res['data'];
      this.paginationData = res['Paging'][0];
    }
  )
}


/***
   * export excel
   */
exportAsXLSX(): void {
  let queryString = `page=1&pageSize=${this.paginationData?.Total}&search=${this.searchInput ? this.searchInput.trim() : ''}${this.sortParam ? this.sortParam : ''}`;
  // let queryString = `page=1&pageSize=${this.paginationData?.Total}&search=${this.sortParam ? this.sortParam : ''}`;
  //let queryString = `page=1&pageSize=10000&search=`;
  this.bodyParam['page'] = 1;
  this.bodyParam['pageSize'] = this.paginationData?.Total;
  this._onboard.GetOnboardCandidateVerificationReport(this.bodyParam).subscribe(
    res => {
      let candidateList = res['data'];
      let filterDataExcel = [];
      for (var key in candidateList) {
        let selectedData = {
          'SR No.': +key + 1,
          'Employee Code': candidateList[key].EmployeeId,
          'Employee Name ': candidateList[key].EmployeeName,
          'Talent ID': candidateList[key].talent_id,
          'Date of Joining': this.datepipe.transform(candidateList[key].DateOfJoining, 'yyyy/MM/dd'),
          'RM Connect Verification ': candidateList[key].RMConnectVerification,
          'RM Connect Verification done on ': this.datepipe.transform(candidateList[key].RMConnectVerificationDate, 'yyyy/MM/dd'),
          'RM Connect Verification done by ': candidateList[key].RMConnectVerificationBy,
          'RM Connect Verification Successful': candidateList[key].RMConnectVerificationSuccess,
          'RM Connect Pending From (Days)': candidateList[key].RMConnectVerificationPendingFrom,
          'Remarks  (RM)': candidateList[key].RMRemark,
          'ISS Connect Verification ': candidateList[key].ISSConnectVerification,
          'ISS Connect Verification done on ': this.datepipe.transform(candidateList[key].ISSConnectVerificationDate, 'yyyy/MM/dd'),
          'ISS Connect Verification done by ': candidateList[key].ISSConnectVerificationBy,
          'ISS Connect Verification Successful': candidateList[key].ISSConnectVerificationSuccess,
          'ISS Connect Pending From (Days)': candidateList[key].ISSConnectVerificationPendingFrom,
          'Remarks  (ISS)': candidateList[key].ISSConnectVerificationRemark,
          'HR Verification Post 7 days from joining  ': candidateList[key].HR7ConnectVerification,
          'HR Verification done on ': this.datepipe.transform(candidateList[key].HR7ConnectVerificationDate, 'yyyy/MM/dd'),
          'HR Verification done by ': candidateList[key].HR7ConnectVerificationBy,
          'HR Verification Successful ': candidateList[key].HR7ConnectVerificationSuccess,
          'HR Verification Pending From (Days)': candidateList[key].HR7ConnectVerificationPendingFrom,
          'Remarks  (HR) ': candidateList[key].EmpRemark,
          
        //  'Assessment Date': this.datepipe.transform(candidateList[key].AssessmentDate, 'yyyy/MM/dd')
        };
        filterDataExcel.push(selectedData);

      }
      let sn = filterDataExcel;
      this._excelService.exportAsExcelFile(filterDataExcel, 'Candidate Verification Report');
    }
  );
}


}
