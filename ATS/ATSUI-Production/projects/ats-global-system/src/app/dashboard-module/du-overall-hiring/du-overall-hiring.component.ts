import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { dashboardHiringTableKey, duDashboardCommonLabel } from '../../core/common/enums';
import { GlobalMethod } from '../../core/common/global-method';
import { TableUtil } from '../../core/common/tableUtil';
import { graphChartColor } from '../../core/constant/common.const';
import { CONSTANTS } from '../../core/constant/constants';
import { GlobalApisService } from '../../core/services/global-apis.service';
import { DashboardService } from '../dashboard.service';
@Component({
  selector: 'app-du-overall-hiring',
  templateUrl: './du-overall-hiring.component.html',
  styleUrls: ['./du-overall-hiring.component.scss']
})
export class DuOverallHiringComponent implements OnInit {
  public sortFormFilter: UntypedFormGroup = new UntypedFormGroup({});
  @Input() reportList: any = [];
  @Input() filteredDate: any = {};
  // OpenPositions
  displayedColumns = ['duHiringTot', 'w1', 'w2', 'w3', 'w4', 'w5', 'total', 'joiningPercent',
    'w1Decline', 'w2Decline', 'w3Decline', 'w4Decline', 'w5Decline', 'totalDecline', 'declinePercent', 'grandTotal'
  ]
  view: any[] = [3700, 500];

  colorScheme = {
    domain: graphChartColor.graphColorDash
  };
  public headGroup: any = [];

  public formControlYear: UntypedFormControl = new UntypedFormControl();
  public yearList1: any = GlobalMethod.generateYearsListBetween(2021, new Date().getFullYear()).sort((a, b) => b - a);
  public yearList: any = [];
  @Input() searchInput: string;
  public duOverallList: any = [];
  public dashTableLabel: any = dashboardHiringTableKey;
  public isResetFilter: boolean = false;
  public isResetSearch: boolean = false;
  public sortParam: string = '';
  constructor(
    public dialog: MatDialog,
    private _dashboardServ: DashboardService,
    private _fb: UntypedFormBuilder,
   private  _globalApiSere:GlobalApisService
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
    this.getOverAllHiringReport(this.formControlYear?.value, null);
  }
  public year: any = 0;
  MonthYear(e: any) {
    this.year = this.formControlYear.value;
    let currentYear = new Date().getFullYear();
    this.getOverAllHiringReport(this.year.toString(), this.sortParam);
  }

  getYearList() {
    this._globalApiSere.getYearList().subscribe(
      res => {
        this.yearList = res['data'];
      }
    )};
  //form for filter
  filterFormInit() {
    this.sortFormFilter = this._fb.group({
      deliveryUnit: [[]]
    })
  }

  getSortData(data: string) {
    this.isResetFilter = false;
    this.sortParam = data;
     this.getOverAllHiringReport(this.formControlYear?.value,  data);
  }

  /*getting all data*/
  getOverAllHiringReport(year: string, sortParam: any) {
    let queryString = `Year=${year}`;
    /**filter parameter */
    if (sortParam?.deliveryUnit && sortParam?.deliveryUnit?.length !== 0) {
      let Ids = sortParam?.deliveryUnit?.filter(n => n);
      queryString = `Year=${year}&DUID=${Ids?.toString()}`
    }
    this._dashboardServ.getOverallHiringList(queryString).subscribe(
      res => {
        this.duOverallList = (res['data']);
      }
    )
  }

  /**total by quarter */
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

  /**joined declined percentage total */
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

  /**reset filter */
  resetSortFilter() {
    this.isResetSearch = true;
    this.isResetFilter = true;
    this.searchInput = '';
    this.sortParam = '';
    //this.sortTable = '';
  }
  onSelect(event) {
    
  }

  /**showing table main heading */
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
      obj['title'] = duDashboardCommonLabel['decline'];;
      obj['class'] = 'du-bg-org';
    }
    if (index === 3) {
      obj['num'] = 1;
      obj['title'] = duDashboardCommonLabel['GrandTotal'];
      obj['class'] = 'interviewsStatus';
    }
    
    return obj;
  }

  exportAsXLSX(): void {
    TableUtil.exportTableToExcel("duHiringExport", 'GDL Overall Hiring', `GDL Overall Hiring Report`);
  }

}
