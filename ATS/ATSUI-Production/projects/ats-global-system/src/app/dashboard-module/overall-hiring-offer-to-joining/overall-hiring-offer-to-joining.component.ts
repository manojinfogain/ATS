import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { dashboardHiringOfferToJoiningTableKey, dashboardHiringTableKey, duDashboardCommonLabel } from '../../core/common/enums';
import { TableUtil } from '../../core/common/tableUtil';
import { GlobalApisService } from '../../core/services/global-apis.service';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-overall-hiring-offer-to-joining',
  templateUrl: './overall-hiring-offer-to-joining.component.html',
  styleUrls: ['./overall-hiring-offer-to-joining.component.scss']
})
export class OverallHiringOfferToJoiningComponent implements OnInit {
  displayedColumns = ['duHiringTot', '0to15Join', '16to30Join', '31to45Join', '46to60Join', '61to90Join', 'above90Join', 'total', 'joiningPercent',
    'w1Decline', 'w2Decline', 'w3Decline', 'w4Decline', 'w5Decline', 'w5Decline1', 'totalDecline', 'declinePercent', 'grandTotal'
  ]
  public headGroup: any = [];
  @Input() searchInput: string;
  public dashTableLabel: any = dashboardHiringTableKey;
  public hiringOfferToJoiningLabel: any = dashboardHiringOfferToJoiningTableKey;

  public formControlYear: UntypedFormControl = new UntypedFormControl();
  public sortFormFilter: UntypedFormGroup = new UntypedFormGroup({});
  public duOverallOfferToJoinList: any = [];
  public isResetFilter: boolean = false;
  public sortParam: string = '';
  public isResetSearch: boolean = false;
  constructor(
    private _dashboardServ: DashboardService,
    private _globalApiSere: GlobalApisService,
    private _fb: UntypedFormBuilder
  ) {
    //showing heading in table
    for (let i = 0; i <= 3; i++) {
      this.headGroup.push('day' + i)
    }
  }


  ngOnInit(): void {
    this.getYearList();
    this.filterFormInit();
  }


  ngAfterViewInit() {
    this.formControlYear.patchValue('2022,2023');
    this.getOverAllOfferToJoinReport(this.formControlYear?.value, null);
  }

  //form for filter
  filterFormInit() {
    this.sortFormFilter = this._fb.group({
      deliveryUnit: [[]]
    })
  }

  getSortData(data: string) {
    this.isResetFilter = false;
    this.sortParam = data;
    this.getOverAllOfferToJoinReport(this.formControlYear?.value, data);
  }

  resetSortFilter() {
    this.isResetSearch = true;
    this.isResetFilter = true;
    this.searchInput = '';
    this.sortParam = '';
  }


  public year: number = 0;
  MonthYear(e: any) {
    this.year = this.formControlYear.value;
    let currentYear = new Date().getFullYear();
    this.getOverAllOfferToJoinReport(this.year?.toString(), this.sortParam);
  }

  //getting  data
  getOverAllOfferToJoinReport(year: string, sortParam: any) {
    let queryString = `Year=${year}`;
    if (sortParam?.deliveryUnit && sortParam?.deliveryUnit?.length !== 0) {
      let Ids = sortParam?.deliveryUnit?.filter(n => n);
      queryString = `Year=${year}&DUID=${Ids?.toString()}`
    }
    // let queryString = `Year=${year}&Gender=${gender}`;
    this._dashboardServ.getOverallOfferToJoinList(queryString).subscribe(
      res => {
        // this.duOverallOfferToJoinList = (res['data']);
        let List = res['Table1'];
        let List2 = res['Table2'];
        List2.forEach((item, i) => {
          if (item.Name == 'YTD') {
            List2.splice(i, 1);
            List2.unshift(item);
          }
        })
        const newarray = List2.map(o => {
          return {
            MonthName: o.Name == 'YTD' ? o.Name + ' Joining %' : o.Name + ' %',
            Bucket1_Declined: o.Bucket1_Declined ? o.Bucket1_Declined : 0,
            Bucket1_Joined: o.Bucket1_Joined ? o.Bucket1_Joined : 0,
            Bucket2_Declined: o.Bucket2_Declined ? o.Bucket2_Declined : 0,
            Bucket2_Joined: o.Bucket2_Joined ? o.Bucket2_Joined : 0,
            Bucket3_Declined: o.Bucket3_Declined ? o.Bucket3_Declined : 0,
            Bucket3_Joined: o.Bucket3_Joined ? o.Bucket3_Joined : 0,
            Bucket4_Declined: o.Bucket4_Declined ? o.Bucket4_Declined : 0,
            Bucket4_Joined: o.Bucket4_Joined ? o.Bucket4_Joined : 0,
            Bucket5_Declined: o.Bucket5_Declined ? o.Bucket5_Declined : 0,
            Bucket5_Joined: o.Bucket5_Joined ? o.Bucket5_Joined : 0,
            Bucket6_Declined: o.Bucket6_Declined ? o.Bucket6_Declined : 0,
            Bucket6_Joined: o.Bucket6_Joined ? o.Bucket6_Joined : 0,
            Total_Decline: o.Total_Decline ? o.Total_Decline : 0,
            Total_Joined: o.Total_Joined ? o.Total_Joined : 0,
            Type: o.Name == 'YTD' ? 'YTD' : 'PerQuar'
          }
        });
        newarray.forEach(t => {
          List.push(t);
        });
        this.duOverallOfferToJoinList = List;
        this.getTotalQuarter(this.duOverallOfferToJoinList);
      }
    )
  }

  public QCount: number = 0;
  public totalQ: string = '';
  getTotalQuarter(data) {
    this.QCount = 0;
    data.forEach(element => {
      if (element.Type == 'Q') {
        this.QCount = this.QCount + 1;
      }
    });
    if (this.QCount == 1) {
      this.totalQ = 'Total (Q1)'
    } else if (this.QCount == 2) {
      this.totalQ = 'Total (Q1-Q2)'
    } else if (this.QCount == 3) {
      this.totalQ = 'Total (Q1-Q2-Q3)'
    } else if (this.QCount == 4) {
      this.totalQ = 'Total (Q1-Q2-Q3-Q4)'
    }
    // else {
    //   this.totalQ = 'Total (All Quarters)'
    // }
  }


  // sumTotal(data, colName) {
  //   let total = data.reduce((total, line) => {
  //     if (line['Type'] == 'M') {
  //       return total + line[colName];
  //     } else {
  //       return total + 0;
  //     }
  //   }, 0)
  //   return total
  // }

  // TotalJoinDeclinePer(data, colNameTotal, colNameGrTotal) {
  //   let totalJoinDecline = data.reduce((total, line) => {
  //     if (line['Type'] == 'M') {
  //       return total + line[colNameTotal];
  //     } else {
  //       return total + 0;
  //     }
  //   }, 0);
  //   let grandTotal = data.reduce((total, line) => {
  //     if (line['Type'] == 'M') {
  //       return total + line[colNameGrTotal];
  //     } else {
  //       return total + 0;
  //     }
  //   }, 0);

  //   let totalJoinDeclinePer = grandTotal != 0 ? Math.round((totalJoinDecline / grandTotal) * 100) : 0;

  //   return totalJoinDeclinePer;
  // }


  /**
   * open modal
   * @param data 
   * @param columnType 
   */
  // openTalentViewModal(data: any, columnType: string): void {
  //   data['profile_name'] = "Candidates List";
  //   data['columnType'] = columnType;
  //   data['reportType'] = 'account';
  //   data['colName'] = DashboardCommon.getIntType(columnType);
  //   data['filteredDate'] = this.filteredDate;
  //   const dialogRef = this.dialog.open(ViewTalentWiseCountComponent, {
  //     width: '650px',
  //     panelClass: ['ats-model-wrap', 'ats-model-lg'],
  //     data: data,
  //     disableClose: true
  //   });
  // }

  clacRowSpan(index: number) {
    let obj = {};
    if (index === 0) {
      obj['num'] = 1;
      obj['title'] = '';
      obj['class'] = 'duP';
    }
    if (index === 1) {
      obj['num'] = 8;
      obj['title'] = duDashboardCommonLabel['Joining'];
      obj['class'] = 'interviewsStatus';
    }
    if (index === 2) {
      obj['num'] = 8;
      obj['title'] = duDashboardCommonLabel['decline'];
      obj['class'] = 'du-bg-org';
    }
    if (index === 3) {
      obj['num'] = 1;
      obj['title'] = duDashboardCommonLabel['GrandTotal'];
      obj['class'] = 'interviewsStatus';
    }

    return obj;
  }


  //getYearlist
  public yearList: any = []
  getYearList() {
    this._globalApiSere.getYearList().subscribe(
      res => {
        this.yearList = res['data'];
      }
    )
  }

  exportAsXLSX(): void {
    TableUtil.exportTableToExcel("exportTable", 'Offer To Joining Hiring Report', `Report`);
  }

}
