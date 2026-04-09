import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ReportService } from '../report.service';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { PanelWiseReportDetailsComponent } from './modals/panel-wise-report-details/panel-wise-report-details.component';
import { IdataModal, IpanelDetailsReq, IpanelReportList } from 'projects/ats-global-system/src/app/core/models/panel-report-model';
import { ExcelService } from 'projects/ats-global-system/src/app/core/common/excel.service';
import { saveAs } from "file-saver";
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { TableUtil } from 'projects/ats-global-system/src/app/core/common/tableUtil';

@Component({
  selector: 'app-panel-wise-report',
  templateUrl: './panel-wise-report.component.html',
  styleUrls: ['./panel-wise-report.component.scss']
})
export class PanelWiseReportComponent implements OnInit {
  displayedColumns = ['SNum', 'intEmpId', 'intName', 'skill', 'DU', 'account', 'intLenTaken', 'scheduled', 'cancel', 'rejected', 'shortList'];
  public userData: any = {};
  public searchInput: string = '';
  public sortParam: string = '';
  public paginationData: any;
  public panelList: IpanelReportList[] = [];
  public jumpFirstPage: boolean = false;
  public sortFormFilter: UntypedFormGroup = new UntypedFormGroup({});
  public isResetSearch: boolean = false;
  public isResetFilter: boolean = false;
  public maxDate: any = new Date();
  public todayDate: any = new Date();
  public dateMin: any = '';
  constructor(
    private _storage: GetSetStorageService,
    private _fb: UntypedFormBuilder,
    private _reportServe: ReportService,
    public dialog: MatDialog,
    private http: HttpClient,
    public _excelService: ExcelService,
    private _share: ShareService
  ) {
    let d = new Date();
    let year = d.getFullYear();
    let month = d.getMonth();
    let day = d.getDate();
    this.maxDate = new Date(year + 1, month, day);
  }

  ngOnInit() {
    /**remove transfer option */
    this.userData = this._storage.getSetUserData();
    this.getPanelReport({ startDate: this.getPastdate() });
    this.filterFormInit();
    const yearsArray = GlobalMethod.generateYearsListBetween(2007, 2014);
    this.selectedDate['startDate'] = new Date(this.getPastdate());

  }

  /***
   * get PAst Date
   */
  getPastdate() {
    let currentDate = new Date();
    // let pastDate = new Date(currentDate);
    /**
     * 8 days before
     */
    // pastDate.setDate(pastDate.getDate() - 7);
    let firstDayMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    let dateParse = GlobalMethod.formatDate(firstDayMonth);
    return dateParse;
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
    this.callApiFormValue(data);
  }

  callApiFormValue(data: any) {
    let bodyObj = {};

    bodyObj['startDate'] = data.dateFrom ? GlobalMethod.formatDate(data.dateFrom) : this.getPastdate();
    if (data.dateTo) {
      bodyObj['endDate'] = GlobalMethod.formatDate(data.dateTo);
    }
    if (data.accountType && data.accountType.length !== 0) {
      let accountTypeIds = data.accountType.filter(n => n);
      bodyObj['accountId'] = accountTypeIds.toString();
    }
    if (data.deliveryUnit && data.deliveryUnit.length !== 0) {
      let duIds = data.deliveryUnit.filter(n => n);
      bodyObj['DUIDs'] = duIds.toString();
    }
    if (data.primarySkill && data.primarySkill.length !== 0) {
      let skillIds = data.primarySkill.filter(n => n);
      bodyObj['skillId'] = skillIds.toString();
    }
    this.getPanelReport(bodyObj);
  }

  public selectedDate: any = {};
  getDateRange(data: any) {
    if (data.startDate || data.endDate) {
      this.selectedDate['startDate'] = data.startDate ? data.startDate : new Date(this.getPastdate());
      this.selectedDate['endDate'] = data.endDate;
    }
    else {
      this.selectedDate['startDate'] = new Date(this.getPastdate());
      this.selectedDate['endDate'] = null;
    }
  }

  public bodyParam: IpanelDetailsReq = {};
  getPanelReport(bodyParam: any) {
    bodyParam['EmpID'] = this._storage.getUserEmpId();
    this.bodyParam = bodyParam;
    this._reportServe.getPanelWiseReport(bodyParam).subscribe(
      res => {
        this.panelList = res['data'];
      }
    )
  }

  /***
   * 
   */
  getPanelWiseReportDetails(elm: IpanelReportList, type: string) {
    this.bodyParam['PanelEmpID'] = elm.interviewerEmpId;
    if (type === 'taken') {
      this.bodyParam['statusId'] = '5,4,7';
    }
    else if (type === 'scheduled') {
      this.bodyParam['statusId'] = '1,3';
    }
    else if (type === 'cancelled') {
      this.bodyParam['statusId'] = '2';
    }
    else if (type === 'rejected') {
      this.bodyParam['statusId'] = '5';
    }
    else if (type === 'shortList') {
      this.bodyParam['statusId'] = '7';
    }
    this._reportServe.getPanelWiseReportDetails(this.bodyParam).subscribe(
      res => {
        let elmData: IdataModal = {};
        elmData['elm'] = elm;
        elmData['listData'] = res['data'];

        this.openDetailsPanelWise(elmData);
      }
    )
  }

  /**
   *  
   */
  openDetailsPanelWise(data: IdataModal): void {
    const dialogRef = this.dialog.open(PanelWiseReportDetailsComponent, {
      width: '650px',
      panelClass: ['ats-model-wrap', 'view-profile-popup', 'panel-report-popup'],
      data: data,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }

  /***
 * filter form Init
 */
  filterFormInit() {
    this.sortFormFilter = this._fb.group({
      dateFrom: [new Date(this.getPastdate())],
      dateTo: [{ value: null }],
      primarySkill: [null],
      deliveryUnit: [null],
      accountType: [null],
    });
    this.dateMin = new Date(this.getPastdate());
  }


  /***
   * search
   */
  getSearchValueKey(e: any) {
    this.isResetSearch = false;
    this.searchInput = e;
  }

  public dataList: any = [];
  public title: string = '';
  openPop(data: any, title: string): void {
    if (data) {
      this.title = title;
      this.dataList = data.split(',');
    }

  }

  /***
* download report excel
*/
  downloadReportAsExel() {
    let filteredList;
    if (this.searchInput) {
      let searchName = this.searchInput?.trim().toLowerCase();
      filteredList = this.panelList?.filter((item) => {
        return item?.interviewerEmpId?.trim().toLowerCase().match(searchName) || item?.Name?.trim().toLowerCase().match(searchName);
      });
    } else {
      filteredList = this.panelList
    }
    let filterDataExcel = [];
    for (var key in filteredList) {
      let selectedData = {
        'Panel Employee Id': filteredList[key].interviewerEmpId,
        'Panel Name (Technical)': filteredList[key].Name,
        'Hiring For Skills': filteredList[key].Skills,
        'GDL': filteredList[key].DU,
        'Account': filteredList[key].Account,
        'Number of Interviews taken': filteredList[key].interviewTaken,
        'Number of Interviews Scheduled': filteredList[key].shceduled,
        'Number of Interviews Cancelled': filteredList[key].cancelled,
        'Number of Candidates Rejected': filteredList[key].rejected,
        'Number of Candidates ShortListed': filteredList[key].shortList
      };
      filterDataExcel.push(selectedData);
    }
      let sn = filterDataExcel;
      // 
      this._excelService.exportAsExcelFile(filterDataExcel, 'Panel_Wise_Report');    
  }
}
