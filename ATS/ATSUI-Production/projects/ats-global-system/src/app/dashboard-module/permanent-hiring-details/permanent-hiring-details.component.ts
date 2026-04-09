import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { dashboardHiringTableKey, duDashboardCommonLabel } from '../../core/common/enums';
import { GlobalMethod } from '../../core/common/global-method';
import { DuDummyList, graphChartColor } from '../../core/constant/common.const';
import { GlobalApisService } from '../../core/services/global-apis.service';
import { DashboardService } from '../dashboard.service';
import { TableUtil } from 'projects/ats-global-system/src/app/core/common/tableUtil';

@Component({
  selector: 'app-permanent-hiring-details',
  templateUrl: './permanent-hiring-details.component.html',
  styleUrls: ['./permanent-hiring-details.component.scss']
})
export class PermanentHiringDetailsComponent implements OnInit {
  @Input() reportList: any = [];
  @Input() filteredDate: any = {};
  displayedColumns = ['duHiringTot', 'w1', 'w2', 'w3', 'w4', 'w5', 'total', 'joiningPercent',
    'w1Decline', 'w2Decline', 'w3Decline', 'w4Decline', 'w5Decline', 'totalDecline', 'declinePercent', 'grandTotal'
  ]
  view: any[] = [3700, 500];
  colorScheme = {
    domain: graphChartColor.graphColorDash
  };
  public headGroup: any = [];
  public formControlYear: UntypedFormControl = new UntypedFormControl();
  public formControlGender: UntypedFormControl = new UntypedFormControl();
  public sortFormFilter: UntypedFormGroup = new UntypedFormGroup({});
  public duOverallGenderDiversityList: any = [];
  public yearList1: any = GlobalMethod.generateYearsListBetween(2021, new Date().getFullYear()).sort((a, b) => b - a);
  public isResetFilter: boolean = false;
  public sortParam: string = '';
  public isResetSearch: boolean = false;
  @Input() searchInput: string; 
  public dashTableLabel: any = dashboardHiringTableKey;
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
    this.getGender();
    this.getYearList();
    this.filterFormInit();
    // this.getOverAllGenderDiversityHiringReport(this.year,1);
  }

  ngAfterViewInit() {
    this.formControlYear.patchValue('2022,2023');
    this.formControlGender.patchValue(1);
    this.getOverAllGenderDiversityHiringReport(this.formControlYear?.value, this.formControlGender?.value, null);
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
    // this.getDeliveryHeadWiseDetails(data);    
    this.getOverAllGenderDiversityHiringReport(this.formControlYear?.value, this.formControlGender?.value, data);
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
    this.getOverAllGenderDiversityHiringReport(this.year?.toString(), this.formControlGender?.value, this.sortParam);
  }

  //getting  data
  getOverAllGenderDiversityHiringReport(year: string, gender: number, sortParam: any) {
    let queryString = `Year=${year}&Gender=${gender}`;
    if (sortParam?.deliveryUnit && sortParam?.deliveryUnit?.length !== 0) {
      let Ids = sortParam?.deliveryUnit?.filter(n => n);
      queryString = `Year=${year}&Gender=${gender}&DUID=${Ids?.toString()}`
    }
    // let queryString = `Year=${year}&Gender=${gender}`;
    this._dashboardServ.getOverallGenderDiversityHiringList(queryString).subscribe(
      res => {
        this.duOverallGenderDiversityList = (res['data']);
        this.getTotalQuarter(this.duOverallGenderDiversityList);
      }
    )
  }

  public QCount: number = 0;
  public totalQ: string = '';
  getTotalQuarter(data) {
    this.QCount = 0;
    data.forEach(element => {
      if (element?.Type == 'Q') {
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

  filterDUData: any = [];
  // ngOnChanges(changes: SimpleChanges): void {
  //   if (this.reportList.length != 0) {
  //     // this.duChartDataFilter = this.duChartDataFilter;
  //     // this.DuControl.patchValue(this.reportList[0].DUID)
  //     this.covertAsChartData(this.duChartDataFilter);
  //     // this.legendTitle = this.duChartDataFilter[0]?.DeliveryUnit || '';
  //     // this.filterDUData = this.reportList.filter(str => str.DeliveryUnit.match(/^DU[0-9]+/));
  //   }
  //   if (!this.isTableView) {
  //     //   this.covertAsChartData(this.reportList);
  //   }


  // }



  // ChangeReportView() {
  //   this.isTableView = !this.isTableView;
  //   if (!this.isTableView) {
  //     this.covertAsChartData(this.reportList);
  //   }
  // }



  sumTotal(data, colName) {
    let total = data.reduce((total, line) => {
      if (line['Type'] == 'M') {
        return total + line[colName];
      } else {
        return total + 0;
      }
    }, 0)
    return total
  }

  TotalJoinDeclinePer(data, colNameTotal, colNameGrTotal) {
    let totalJoinDecline = data.reduce((total, line) => {
      if (line['Type'] == 'M') {
        return total + line[colNameTotal];
      } else {
        return total + 0;
      }
    }, 0);
    let grandTotal = data.reduce((total, line) => {
      if (line['Type'] == 'M') {
        return total + line[colNameGrTotal];
      } else {
        return total + 0;
      }
    }, 0);

    let totalJoinDeclinePer = grandTotal != 0 ? Math.round((totalJoinDecline / grandTotal) * 100) : 0;

    return totalJoinDeclinePer;
  }

  clacRowSpan(index: number) {
    let obj = {};
    if (index === 0) {
      obj['num'] = 1;
      obj['title'] = '';
      obj['class'] = 'duP';
    }
    if (index === 1) {
      obj['num'] = 7;
      obj['title'] = duDashboardCommonLabel['Joining'];
      obj['class'] = 'interviewsStatus';
    }
    if (index === 2) {
      obj['num'] = 7;
      obj['title'] = duDashboardCommonLabel['decline'];
      obj['class'] = 'du-bg-org';
    }
    if (index === 3) {
      obj['num'] = 1;
      obj['title'] = duDashboardCommonLabel['GrandTotal'];
      obj['class'] = 'interviewsStatus';
    }
    // if(index ===4){
    //   obj['num']= 5;
    //   obj['title']= dashboardTableKey['CandidatesStatus'];
    //   obj['class']= 'candidatesStatus';
    // }
    return obj;
  }

  //getgender
  public genderType: any = []
  getGender() {
    this._globalApiSere.getGenderList().subscribe(
      res => {
        this.genderType = res['data'];
      }
    )
  }

  public genderId: number = 1;
  selectGender(e: any) {
    this.year = this.formControlYear?.value;
    this.genderId = e.value;
    this.getOverAllGenderDiversityHiringReport(this.year?.toString(), this.genderId, this.sortParam);
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
    TableUtil.exportTableToExcel("OverallGenderDiversityTable", 'Permanent Hiring-Gender Diversity', `Report`);
  }

}
