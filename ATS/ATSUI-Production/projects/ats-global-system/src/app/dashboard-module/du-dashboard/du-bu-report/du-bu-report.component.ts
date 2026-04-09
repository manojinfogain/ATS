import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { dashboardGraphLabel, dashboardTableKey } from 'projects/ats-global-system/src/app/core/common/enums';
import { GlobalCommonMethodService } from 'projects/ats-global-system/src/app/core/common/global-common-method.service';
import { dashTableHead } from 'projects/ats-global-system/src/app/core/constant/common.const';
import { DashboardCommon } from '../../dashboard';
import { CandidateInfoDialogComponent } from '../../modal/candidate-info-dialog/candidate-info-dialog.component';
import { ViewTalentWiseCountComponent } from '../../modal/view-talent-wise-count/view-talent-wise-count.component';

@Component({
  selector: 'app-du-bu-report',
  templateUrl: './du-bu-report.component.html',
  styleUrls: ['./du-bu-report.component.scss']
})
export class DuBuReportComponent implements OnInit, OnChanges {

  @Input() reportList: any = [];
  @Input() filteredDate: any = {};
  displayedColumns = dashTableHead.displayedColumns;  
  /**displayedColumns2 for total */
  displayedColumns2 = ['DU',
  'OpenOpsitions' ,
  'NotScheduled' ,
  'ScreeningRound' ,
  'techRound' ,
  'techRound2' ,
  'ManagerialRound' ,
  'ClientRound' ,
  'MidWayDrop',
  'HRSelected',
  'HRRejected' ,
  'HrOnHold' ,
  'OfferGiven' ,
  'YTJ' ,
  'Joined',
  'OfferDecline',
  'DropAfterSelection',
  ];
  displayedColumns3 = this.displayedColumns2.map(x => `f2_${x}`);

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
    domain: ['blue','blue', 'red', '#9BC2E6', '#9BC2E6', '#9BC2E6', '#9BC2E6', '#9BC2E6', '#92D050', 'red', 'yellow', 'green','red', 'yellow', 'green']
  };
  public headGroup: any = [];
  public duChartData: any = [];
  @Input() isTableView: boolean = false;
  public DuControl = new UntypedFormControl();
  @Input() legendTitle: string = 'DU';
  @Input() duChartDataFilter: any = [];
  @Input() searchInput: string;
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

  filterDUData: any = [];
  ngOnChanges(changes: SimpleChanges): void {
    if (this.reportList.length != 0) {
      // this.duChartDataFilter = this.duChartDataFilter;
      // this.DuControl.patchValue(this.reportList[0].DUID)
      this.covertAsChartData(this.duChartDataFilter);
      // this.legendTitle = this.duChartDataFilter[0]?.DeliveryUnit || '';
      this.filterDUData = this.reportList.filter(str => str.DeliveryUnit.match(/^GDL[0-9]+/));
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
    Type = Type.replace('f2_','');    
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
    data['profile_name'] = "Candidates List";
    data['columnType'] = columnType;
    data['reportType'] = 'DU';
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
    data['reportType'] = 'DU';
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
  // exportToExcel(){
  //   // TableUtil.exportArrayToExcel(this.reportList, 'DU Wise Report');
  //   console.log(this.reportList);
  // }
}
