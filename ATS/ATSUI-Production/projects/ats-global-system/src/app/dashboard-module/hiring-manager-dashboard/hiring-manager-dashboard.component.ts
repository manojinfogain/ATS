import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { GET_DEFAULT_DATE } from '../../core/constant/common.const';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-hiring-manager-dashboard',
  templateUrl: './hiring-manager-dashboard.component.html',
  styleUrls: ['./hiring-manager-dashboard.component.scss']
})
export class HiringManagerDashboardComponent implements OnInit {
  public headGroup: any = [];
  public duChartData: any = [];
  public isTableView: boolean = true;
  public DuControl = new UntypedFormControl();
  public reportList: any = [];
  legendTitle: string = '';
  public FilterCtrlList: UntypedFormControl = new UntypedFormControl();
  public sortFormFilter: UntypedFormGroup = new UntypedFormGroup({});
  public isResetFilter: boolean = false;
  public sortParam: string = '';
  public dateMin: any ='';
  accountName: string = '';  
  public selectedDate: any = {};
  public todayDate: any = new Date();
  public defaultFromDate: any = new Date(this.getPastdate());
  constructor(
    private _dashServe: DashboardService,
    private _share:ShareService,
    private _fb: UntypedFormBuilder
  ) {
  }


  ngOnInit(): void {
    /**
     * Get Account Owner Wise Details Api
     */
    this.getAccountOwnerWiseDetails({ startDate: this.getPastdate() });
    this.filterFormInit();
    this.selectedDate['startDate'] = new Date(this.getPastdate());
  }

  exportButtonMethod(){
    this._share.detectExcelExportPMWise.next({docName:"HM Wise Report"});
  }

  getSortData(data: string) {
    this.isResetFilter = false;
    this.sortParam = data;
    this.getAccountOwnerWiseDetails(data);

  }

  /**
 * reset filter and search
 */
   resetSortFilter() {
    this.isResetFilter = true;
    this.sortParam = '';
    //this.sortTable = '';
  }

    /**
  * get filter value
  * @param data
  */  

  //paste date
  getPastdate() {
    let currentDate = new Date();
    // let pastDate = new Date(currentDate);
    /**
     * 8 days before
     */
    // pastDate.setDate(pastDate.getDate() - 7);
    // let firstDayMonth = new Date(currentDate.getFullYear(), 0, 1);
    // let dateParse = GlobalMethod.formatDate(firstDayMonth);
    let dateParse = GlobalMethod.formatDate(GET_DEFAULT_DATE.fromDate);
    return dateParse;
  }

  //form for filter
  filterFormInit() {
    this.sortFormFilter = this._fb.group({
      dateFrom: [new Date(this.getPastdate())],
      dateTo: [{ value: null }],
      dateStart: [null],
      dateEnd: [{ value: null, disabled: true }]
    })
    this.dateMin = new Date(this.getPastdate());
  }

  /***
   * get 
   */
  public bodyParam: any = {};
  getAccountOwnerWiseDetails(sortParam: any) {
    this.bodyParam = {};
    let body = {};
    if (sortParam?.dateFrom) {
      body['startDate'] = GlobalMethod.formatDate(sortParam?.dateFrom);
    }
    if (sortParam?.dateFrom == null) {
      body['startDate'] = this.getPastdate();
    }
  
    if (sortParam?.dateTo) {
      body['endDate'] = GlobalMethod.formatDate(sortParam?.dateTo);
    }
    
    if (sortParam?.dateStart) {
      body['startDate2'] = GlobalMethod.formatDate(sortParam?.dateStart);
    }
 
    if (sortParam?.dateEnd) {
      body['endDate2'] = GlobalMethod.formatDate(sortParam?.dateEnd);
    }
    this.bodyParam = body;
    this._dashServe.getHiringManagerWiseTHIDsDetails(body).subscribe(
      res => {
        this.reportList = res['data'];
        if (this.reportList.length != 0) {
          this.duChartDataFilter = this.reportList[0];
          this.DuControl.patchValue(this.reportList[0]?.HiringManagerID)
          this.accountName = this.reportList[0]?.HiringManagerName || '';
        }
        //  this.legendTitle = this.reportList[0]?.AccountName || '';
        this.FilterCtrlList.valueChanges.subscribe(
          get => {
            this.searchInputList = get;
          }
        )
      }
    )
  }

  /***
   * search
   */
  public searchInputList: string;
  public searchInput: string;
  getSearchValueKey(e: any) {
    // this.isResetFilter = true;
    // this.isResetSearch = false;
    // this.sortParam = '';
    this.searchInput = e;
  }

  /***
   * Change View
   */
  ChangeReportView() {
    this.isTableView = !this.isTableView;
    if (!this.isTableView) {
      //  this.covertAsChartData(this.reportList);
    }
  }
  /***
   * total Count Report Method
   */
   keyWiseGetTotal(keys: string) {
    let total: number;
    for (let i = 0; i < this.reportList.length; i++) {
      if (keys == 'OpenOpsitions') {
        total = this.sumTotal(this.reportList, 'OpenOpsitions')
      }
     else if (keys == 'Totalpositions') {
        total = this.sumTotal(this.reportList, 'Totalpositions')
      }
     else if (keys == 'OfferDecline') {
        total = this.sumTotal(this.reportList, 'OfferDecline')
      }
      else if (keys == 'NotScheduled') {
        total = this.sumTotal(this.reportList, 'NotScheduled')
      }

      else if (keys == 'ScreeningRound') {
        total = this.sumTotal(this.reportList, 'ScreeningRound')
      }
      else if (keys == 'techRound') {
        total = this.sumTotal(this.reportList, 'techRound')
      }
      else if (keys == 'ManagerialRound') {
        total = this.sumTotal(this.reportList, 'ManagerialRound')
      }
      else if (keys == 'ManagementRound') {
        total = this.sumTotal(this.reportList, 'ManagementRound')
      }
      else if (keys == 'ClientRound') {
        total = this.sumTotal(this.reportList, 'ClientRound')
      }
      else if (keys == 'HRSelected') {
        total = this.sumTotal(this.reportList, 'HRSelected')
      }

      else if (keys == 'HRRejected') {
        total = this.sumTotal(this.reportList, 'HRRejected')
      }

      else if (keys == 'HrOnHold') {
        total = this.sumTotal(this.reportList, 'HrOnHold')
      }
      else if (keys == 'OfferGiven') {
        total = this.sumTotal(this.reportList, 'OfferGiven')
      }
      else if (keys == 'YTJ') {
        total = this.sumTotal(this.reportList, 'YTJ')
      }

      else if (keys == 'Joined') {
        total = this.sumTotal(this.reportList, 'Joined')
      }
    }
    return total;
  }


  /***
   * sum method
   */
  sumTotal(data, Type) {
    let total = data.reduce((total, line) => total + line[Type], 0)
    return total
  }
  /***
   * create json for Chart
   */
  CalcTotalKeyWise() {
    let totalFinalDataForChart =
    {
      OpenOpsitions: this.keyWiseGetTotal('OpenOpsitions'),
      Totalpositions: this.keyWiseGetTotal('Totalpositions'),
      OfferDecline: this.keyWiseGetTotal('OfferDecline'),

      NotScheduled: this.keyWiseGetTotal('NotScheduled'),

      ScreeningRound: this.keyWiseGetTotal('ScreeningRound'),

      techRound: this.keyWiseGetTotal('techRound'),

      ManagerialRound: this.keyWiseGetTotal('ManagerialRound'),

      ManagementRound: this.keyWiseGetTotal('ManagementRound'),

      ClientRound: this.keyWiseGetTotal('ClientRound'),

      HRSelected: this.keyWiseGetTotal('HRSelected'),

      HRRejected: this.keyWiseGetTotal('HRRejected'),

      HrOnHold: this.keyWiseGetTotal('HrOnHold'),

      OfferGiven: this.keyWiseGetTotal('OfferGiven'),

      YTJ: this.keyWiseGetTotal('YTJ'),

      Joined: this.keyWiseGetTotal('Joined')
    }

    return totalFinalDataForChart
  }
  /***
   * on select Dropdown
   */
  public duChartDataFilter: any = [];
  public loaded: boolean = true;
  selectDuId(event: any) {
    this.loaded = false;
    if (event.value == 'all') {
      this.duChartDataFilter = this.CalcTotalKeyWise();
      this.legendTitle = 'All';
      this.accountName = 'All';
    }
    else {
      let id: number = event.value;
      this.duChartDataFilter = this.reportList.filter(d => d.HiringManagerID == id)[0];
      this.accountName = this.duChartDataFilter?.HiringManagerName || '';
      //  this.legendTitle = this.duChartDataFilter?.DeliveryUnit || '';
    }

  }

  getDateRange(data:any) {
    if (data.startDate || data.endDate) {
      this.selectedDate['startDate'] = data.startDate ? data.startDate : new Date(this.getPastdate());
      this.selectedDate['endDate'] = data.endDate;
    }else {
      this.selectedDate['startDate'] = new Date(this.getPastdate());
      this.selectedDate['endDate'] = null;
    }
  }


}
