import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { dashboardHiringTableKey, dashboardSpecificLOcationHiringDetails, duDashboardCommonLabel } from '../../core/common/enums';
import { TableUtil } from '../../core/common/tableUtil';
import { GlobalApisService } from '../../core/services/global-apis.service';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-location-specific-hiring-details',
  templateUrl: './location-specific-hiring-details.component.html',
  styleUrls: ['./location-specific-hiring-details.component.scss']
})
export class LocationSpecificHiringDetailsComponent implements OnInit {

  // public DummyDuOverAllHiringList: any = DuDummyList;
  public formControlYear: UntypedFormControl = new UntypedFormControl();
  public sortFormFilter: UntypedFormGroup = new UntypedFormGroup({});
  public duOverallLocationSpecificList: any = [];
  public isResetFilter: boolean = false;
  public sortParam: string = '';
  public isResetSearch: boolean = false;

  displayedColumns = ['duHiringTot', 'locJoiningNoida', 'locJoiningBang', 'locJoiningMum', 'locJoiningPune', 'total', 'joiningPercent',
    'locDeclNoida', 'locDeclBang', 'locDeclMum', 'locDeclPune', 'totalDecline', 'declinePercent', 'grandTotal'
  ]


  @Input() searchInput: string;
  public headGroup: any = [];
  public specificLocationLabel: any = dashboardSpecificLOcationHiringDetails
  constructor(
    // public dialog: MatDialog,
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
    this.getOverAllLocationSpecificReport(this.formControlYear?.value, null);
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
    this.getOverAllLocationSpecificReport(this.formControlYear?.value, data);
  }

  resetSortFilter() {
    this.isResetSearch = true;
    this.isResetFilter = true;
    this.searchInput = '';
    this.sortParam = '';
    //this.sortTable = '';
  }


  public year: number = 0;
  MonthYear(e: any) {
    this.year = this.formControlYear.value;
    let currentYear = new Date().getFullYear();
    this.getOverAllLocationSpecificReport(this.year?.toString(), this.sortParam);
  }

  //getting  data
  getOverAllLocationSpecificReport(year: string, sortParam: any) {
    let queryString = `Year=${year}`;
    if (sortParam?.deliveryUnit && sortParam?.deliveryUnit?.length !== 0) {
      let Ids = sortParam?.deliveryUnit?.filter(n => n);
      queryString = `Year=${year}&DUID=${Ids?.toString()}`
    }
    this._dashboardServ.getOverAllLocationSpecificList(queryString).subscribe(
      res => {
        // this.duOverallLocationSpecificList = (res['SumQuatorPer']);
        let List = res['SumQuatorPer'];
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
            Banglore_Decline: o.Banglore_Decline ? o.Banglore_Decline : 0,
            Banglore_Joined: o.Banglore_Joined ? o.Banglore_Joined : 0,
            Mumbai_Decline: o.Mumbai_Decline ? o.Mumbai_Decline : 0,
            Mumbai_Joined: o.Mumbai_Joined ? o.Mumbai_Joined : 0,
            Noida_Decline: o.Noida_Decline ? o.Noida_Decline : 0,
            Noida_Joined: o.Noida_Joined ? o.Noida_Joined : 0,
            Pune_Decline: o.Pune_Decline ? o.Pune_Decline : 0,
            Pune_Joined: o.Pune_Joined ? o.Pune_Joined : 0,
            Total_Decline: o.Total_Decline ? o.Total_Decline : 0,
            Total_Joined: o.Total_Joined ? o.Total_Joined : 0,
            Type: o.Name == 'YTD' ? 'YTD' : 'PerQuar'
          }
        });
        newarray.forEach(t => {
          List.push(t);
        });
        this.duOverallLocationSpecificList = List;
        this.getTotalQuarter(this.duOverallLocationSpecificList);
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
      obj['num'] = 6;
      obj['title'] = duDashboardCommonLabel['Joining'];
      obj['class'] = 'interviewsStatus';
    }
    if (index === 2) {
      obj['num'] = 6;
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
    TableUtil.exportTableToExcel("exportTable", 'Location Specific Hiring Report', `Report`);
  }


}
