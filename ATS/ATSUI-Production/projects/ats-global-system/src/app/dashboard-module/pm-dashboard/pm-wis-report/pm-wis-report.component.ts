import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { GlobalCommonMethodService } from 'projects/ats-global-system/src/app/core/common/global-common-method.service';
import { graphChartColor } from 'projects/ats-global-system/src/app/core/constant/common.const';
import { DashboardCommon } from '../../dashboard';
import { CandidateInfoDialogComponent } from '../../modal/candidate-info-dialog/candidate-info-dialog.component';
@Component({
  selector: 'app-pm-wis-report',
  templateUrl: './pm-wis-report.component.html',
  styleUrls: ['./pm-wis-report.component.scss']
})
export class PmWisReportComponent implements OnInit,OnChanges {

  @Input() reportList: any = [];
  @Input() filteredDate: any = {};
  displayedColumns = ['du', 'OpenPositions', 'NotScheduledYet', 'ScreeningRound', 'TechnicalRound', 'ManagerialRound', 'MgmtRound', 'ClientRound', 'HRSelected', 'HRRejected', 'HrOnHold', 'OfferedGiven', 'YTJCandidates', 'CandidatesJoined'];
  view: any[] = [3700, 500];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = false;
  xAxisLabel = 'DU';
  showYAxisLabel = false;
  yAxisLabel = 'DU';
  colorScheme = {
    domain: graphChartColor.graphColorDash
  };
  public headGroup: any = [];
  public duChartData: any = [];
  @Input() isTableView: boolean = false;
  public DuControl = new UntypedFormControl();
  @Input() legendTitle: string = 'DU';
  @Input() duChartDataFilter: any = [];
  @Input() searchInput:string;
  public dataKeyObj:any = {
    name:'ProjectName',
    id:''
  };
  constructor(
    public dialog: MatDialog,
    private globalCom:GlobalCommonMethodService
  ) {
    //showing heading in table
    for (let i = 0; i <= 4; i++) {
      this.headGroup.push('day' + i)
    }
  }


  ngOnInit(): void {

  }

  filterDUData: any = [];
  ngOnChanges(changes: SimpleChanges): void {
    if (this.reportList.length != 0) {
      // this.duChartDataFilter = this.duChartDataFilter;
      // this.DuControl.patchValue(this.reportList[0].DUID)
      this.covertAsChartData(this.duChartDataFilter);
      // this.legendTitle = this.duChartDataFilter[0]?.DeliveryUnit || '';
      // this.filterDUData = this.reportList.filter(str => str.DeliveryUnit.match(/^DU[0-9]+/));
    }
    if (!this.isTableView) {
      //   this.covertAsChartData(this.reportList);
    }


  }



  ChangeReportView() {
    this.isTableView = !this.isTableView;
    if (!this.isTableView) {
      this.covertAsChartData(this.reportList);
    }
  }



  sumTotal(data, Type) {
    let total = data.reduce((total, line) => total + line[Type], 0)
    return total
  }

  sumDUTotal(data, Type) {
    let total = this.filterDUData.reduce((total, line) => total + line[Type], 0)
    return total
  }

  /***
   * DU Chart
   */
  @Input() loaded: boolean = true;
  covertAsChartData(reportList) {
    this.loaded = false;
    this.duChartData = this.globalCom.covertAsChartData(reportList);

    setTimeout(() => {
      this.loaded = true;
    }, 500);
  }



  onSelect(event) {
    console.log(event);
  }

  /**
    * open modal
    * @param data 
    * @param columnType 
    */
   openCandidateInfoModal(data: any, columnType: string): void {
    data['profile_name'] = "Candidates List (BU)";
    data['columnType'] = columnType;
    data['reportType'] = 'PM';
    data['colName']= DashboardCommon.getIntType(columnType);
    data['filteredDate'] = this.filteredDate;
    const dialogRef = this.dialog.open(CandidateInfoDialogComponent, {
      width: '650px',
      panelClass: ['ats-model-wrap', 'ats-model-lg'],
      data: data,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }

}
