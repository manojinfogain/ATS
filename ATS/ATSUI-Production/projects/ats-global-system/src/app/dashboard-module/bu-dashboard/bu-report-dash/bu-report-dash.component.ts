import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { dashboardTableKey } from 'projects/ats-global-system/src/app/core/common/enums';
import { GlobalCommonMethodService } from 'projects/ats-global-system/src/app/core/common/global-common-method.service';
import { dashTableHead, graphChartColor } from 'projects/ats-global-system/src/app/core/constant/common.const';
import { DashboardCommon } from '../../dashboard';
import { CandidateInfoDialogComponent } from '../../modal/candidate-info-dialog/candidate-info-dialog.component';
import { ViewTalentWiseCountComponent } from '../../modal/view-talent-wise-count/view-talent-wise-count.component';

@Component({
  selector: 'app-bu-report-dash',
  templateUrl: './bu-report-dash.component.html',
  styleUrls: ['./bu-report-dash.component.scss']
})
export class BuReportDashComponent implements OnInit,OnChanges {

  @Input() reportList: any = [];
  @Input() filteredDate: any = {};
  displayedColumns = dashTableHead.displayedColumns;
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
    domain:graphChartColor.graphColorDash
  };
  public headGroup: any = [];
  public duChartData: any = [];
  @Input() isTableView: boolean = false;
  public DuControl = new UntypedFormControl();
  @Input() legendTitle: string = 'Name';
  @Input() duChartDataFilter: any = [];
  @Input() searchInput:string;
  public dashTableLabel:any = dashboardTableKey;
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

  ngOnChanges(changes: SimpleChanges): void {
    if (this.reportList.length != 0) {
      // this.duChartDataFilter = this.duChartDataFilter;
      // this.DuControl.patchValue(this.reportList[0].DUID)
      this.covertAsChartData(this.duChartDataFilter);
      this.legendTitle = this.duChartDataFilter[0]?.DeliveryUnit || '';
    }
    if (!this.isTableView) {
     // this.covertAsChartData(this.reportList);
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
    data['reportType'] = 'BU';
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

  /**
    * open modal
    * @param data 
    * @param columnType 
    */
   openTalentViewModal(data: any, columnType: string): void {
    data['profile_name'] = "Candidates List";
    data['columnType'] = columnType;
    data['reportType'] = 'BU';
    data['colName']= DashboardCommon.getIntType(columnType);
    data['filteredDate'] = this.filteredDate;
    const dialogRef = this.dialog.open(ViewTalentWiseCountComponent, {
      width: '650px',
      panelClass: ['ats-model-wrap', 'ats-model-lg'],
      data: data,
      disableClose: true
    });
  }


  clacRowSpan(index:number){
    let obj ={};
    if(index ===0){
      obj['num']= 1;
      obj['title']= '';
      obj['class']= 'duP';
    }
    if(index ===1){
      obj['num']= 2;
      obj['title']= dashboardTableKey['TalentIDStatus'];
      obj['class']= 'tl-st';
    }
    if(index ===2){
      obj['num']= 6;
      obj['title']= dashboardTableKey['InterviewsStatus'];
      obj['class']= 'interviewsStatus';
    }
    if(index ===3){
      obj['num']= 3;
      obj['title']= dashboardTableKey['HRSelectionStatus'];
      obj['class']= 'selectionStatus';
    }
    if(index ===4){
      obj['num']= 5;
      obj['title']= dashboardTableKey['CandidatesStatus'];
      obj['class']= 'candidatesStatus';
    }
    return obj;
  }

}
