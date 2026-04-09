import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { dashboardSourceTypeKey, dashboardSpecificLOcationHiringDetails, duDashboardCommonLabel } from '../../core/common/enums';
import { TableUtil } from '../../core/common/tableUtil';
import { DuDummyList, graphChartColor } from '../../core/constant/common.const';
import { GlobalApisService } from '../../core/services/global-apis.service';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-overall-hiring-source-type',
  templateUrl: './overall-hiring-source-type.component.html',
  styleUrls: ['./overall-hiring-source-type.component.scss']
})
export class OverallHiringSourceTypeComponent implements OnInit {

  public DummyDuOverAllHiringList: any = DuDummyList;
  public formControlYear: UntypedFormControl = new UntypedFormControl();
  public sortFormFilter: UntypedFormGroup = new UntypedFormGroup({});
  public duOverallSourceTypeList: any = [];
  public isResetFilter: boolean = false;
  public sortParam: string = '';
  public isResetSearch: boolean = false;
  @Input() searchInput: string;

  displayedColumns = ['duHiringTot', 'cskills', 'empReferral', 'socialMedia','vendor','staffingAgency','webPortal', 'total', 'joiningPercent',
  'cskillsDecline', 'empReferralDecline', 'socialMediaDecline','vendorDecline','staffingAgencyDecline','webPortalDecline', 'totalDecline', 'PercentDecline', 'grandTotal'
  ]

  colorScheme = {
    domain: graphChartColor.graphColorDash
  };
  public headGroup: any = [];
  public sourceTypeLabel: any = dashboardSourceTypeKey
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
    this.filterFormInit();
    this.getYearList();
    this.getOverAllSourceTypeReport('2022,2023',null)
  }

  ngAfterViewInit() {
    this.formControlYear.patchValue('2022,2023');
    this.getOverAllSourceTypeReport(this.formControlYear?.value, null);
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

  //form for filter
  filterFormInit() {
    this.sortFormFilter = this._fb.group({
      deliveryUnit: [[]]
    })
  }

  getSortData(data: string) {
    this.isResetFilter = false;
    this.sortParam = data;
    this.getOverAllSourceTypeReport(this.formControlYear?.value, data);
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
    this.getOverAllSourceTypeReport(this.year?.toString(), this.sortParam);
  }

  //getting  data
  getOverAllSourceTypeReport(year: string, sortParam: any) {
    let queryString = `Year=${year}`;
    if (sortParam?.deliveryUnit && sortParam?.deliveryUnit?.length !== 0) {
      let Ids = sortParam?.deliveryUnit?.filter(n => n);
      queryString = `Year=${year}&DUID=${Ids?.toString()}`
    }
    this._dashboardServ.getOverAllSourceTypeList(queryString).subscribe(
      res => {
        console.log(res);
        let List = res['data'];
        let List2 = res['SumQuatorPer'];
        const newarray = List2.map(o => {
          return {
            MonthName: o.Name ,
            CSkill_Decline: o.CSkill_Decline ? o.CSkill_Decline : 0,
            CSkill_Joined: o.CSkill_Joined ? o.CSkill_Joined : 0,
            EmpReferral_Decline: o.EmpReferral_Decline ? o.EmpReferral_Decline : 0,
            EmpReferral_Joined: o.EmpReferral_Joined ? o.EmpReferral_Joined : 0,
            SocialMedia_Decline: o.SocialMedia_Decline ? o.SocialMedia_Decline : 0,
            SocialMedia_Joined: o.SocialMedia_Joined ? o.SocialMedia_Joined : 0,
            StaffingAgency_Decline: o.StaffingAgency_Decline ? o.StaffingAgency_Decline : 0,
            StaffingAgency_Joined: o.StaffingAgency_Joined ? o.StaffingAgency_Joined : 0,
            Vender_Decline: o.Vender_Decline ? o.Vender_Decline : 0,
            Vender_Joined: o.Vender_Joined ? o.Vender_Joined : 0,
            WebPortal_Decline: o.WebPortal_Decline ? o.WebPortal_Decline : 0,
            WebPortal_Joined: o.WebPortal_Joined ? o.WebPortal_Joined : 0,
            Type: 'YTD' 
          }
        });
        newarray.forEach(t => {
          List.push(t);
        });
        this.duOverallSourceTypeList = List;
        this.getTotalQuarter(this.duOverallSourceTypeList);
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

  exportAsXLSX(): void {
    TableUtil.exportTableToExcel("exportTable", 'Source Type Wise Hiring Report', `Report`);
  }

}
