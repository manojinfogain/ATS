import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, UntypedFormControl, FormGroup } from '@angular/forms';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { ExcelService } from 'projects/ats-global-system/src/app/core/common/excel.service';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { TableUtil } from 'projects/ats-global-system/src/app/core/common/tableUtil';
import { CONSTANTS } from 'projects/ats-global-system/src/app/core/constant/constants';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { ReportService } from '../report.service';
@Component({
  selector: 'app-recruiter-productivity-repor',
  templateUrl: './recruiter-productivity-repor.component.html',
  styleUrls: ['./recruiter-productivity-repor.component.scss'],
  providers: [DatePipe]
})
export class RecruiterProductivityReporComponent implements OnInit {


  displayedColumns = ['recruiterName',
   'RecruiterLocation', 'RecruiterRM',
    'schedulL1', 'intervL1', 'selectedL1', 'offered',
    '2schedulL1', '2intervL1', '2selectedL1', '2offered'
    , '3schedulL1', '3intervL1', '3selectedL1', '3offered'
    , '4schedulL1', '4intervL1', '4selectedL1', '4offered'
    , '5schedulL1', '5intervL1', '5selectedL1', '5offered'
    , '6schedulL1', '6intervL1', '6selectedL1', '6offered'
    , '7schedulL1', '7intervL1', '7selectedL1', '7offered'
    , '8schedulL1', '8intervL1', '8selectedL1', '8offered'
    , '9schedulL1', '9intervL1', '9selectedL1', '9offered'
    , '10schedulL1', '10intervL1', '10selectedL1', '10offered'
    , '11schedulL1', '11intervL1', '11selectedL1', '11offered'
    , '12schedulL1', '12intervL1', '12selectedL1', '12offered'
    , '13schedulL1', '13intervL1', '13selectedL1', '13offered'
    , '14schedulL1', '14intervL1', '14selectedL1', '14offered'
    , '15schedulL1', '15intervL1', '15selectedL1', '15offered'
    , '16schedulL1', '16intervL1', '16selectedL1', '16offered'
    , '17schedulL1', '17intervL1', '17selectedL1', '17offered'
    , '18schedulL1', '18intervL1', '18selectedL1', '18offered'
    , '19schedulL1', '19intervL1', '19selectedL1', '19offered'
    , '20schedulL1', '20intervL1', '20selectedL1', '20offered'
    , '21schedulL1', '21intervL1', '21selectedL1', '21offered'
    , '22schedulL1', '22intervL1', '22selectedL1', '22offered'
    , '23schedulL1', '23intervL1', '23selectedL1', '23offered'
    , '24schedulL1', '24intervL1', '24selectedL1', '24offered'
    , '25schedulL1', '25intervL1', '25selectedL1', '25offered'
    , '26schedulL1', '26intervL1', '26selectedL1', '26offered'
    , '27schedulL1', '27intervL1', '27selectedL1', '27offered'
    , '28schedulL1', '28intervL1', '28selectedL1', '28offered'
    , '29schedulL1', '29intervL1', '29selectedL1', '29offered'
    , '30schedulL1', '30intervL1', '30selectedL1', '30offered'
    , '31schedulL1', '31intervL1', '31selectedL1', '31offered'
    , 'grandTotSchedL1', 'grandTotIntervL1', 'grandTotSelectL1', 'grandOffered'
    , 'grandselectPer', 'NoOfCandidateJoined',

  ];
  public grTotalHd: any = [
    'grandTotSchedL1', 'grandTotIntervL1', 'grandTotSelectL1', 'grandOffered'
    , 'grandselectPer',  'NoOfCandidateJoined',
    'NoPositioncancelled' , 'NoOfEffortLoss','organisationDrop','candidateDrop',
    'anotherOfferBetterComp','anotherOfferPermanentWFH',
    'anotherOfferLocationChoice','anotherOfferOrganization','anotherOfferOnsiteOppurtunity','personalReason',
    'processDelay','retainByCurrentOrganization','cost','positionCanceled','fakeCandidate','negativeReferenceCheck',
    'roleFitment','Responsiveness'
  ]

  // public grTotalHd: any = [
  //   'grandTotSchedL1', 'grandTotIntervL1', 'grandTotSelectL1', 'grandOffered'
  //   , 'grandselectPer', 'grandselectOffPer', 'NoOfCandidateJoined', 'midWayDropCandi',
  //   'NoPositioncancelled' , 'NoOfEffortLoss'
  // ]
  public displayedColumnsAll: any = [];
  public groupAll: any = [];
  public headGroup: any = [];
  public userData: any = {};
  getmonths: any;
  public candidateList: any = [];
  public sortParam: string = '';
  public MonthList: any = CONSTANTS.MonthList;
  public MonthListAll: any = CONSTANTS.MonthList;
  public yearList: any = GlobalMethod.generateYearsListBetween(2021, new Date().getFullYear()).sort((a, b) => b - a);
  public formControlYear: UntypedFormControl = new UntypedFormControl();
  public formControlMonth: UntypedFormControl = new UntypedFormControl();
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private _storage: GetSetStorageService,
    private _reportServe: ReportService,
    public dialog: MatDialog,
    public datepipe: DatePipe,
    public _excelService: ExcelService,
    private _cdr: ChangeDetectorRef
  ) {

    //showing heading in table
    for (let i = 0; i < 33; i++) {
      this.headGroup.push('day' + i)
    }
    this.groupAll = this.headGroup;
    this.displayedColumnsAll = this.displayedColumns;
  }

  ngOnInit() {
    /**remove transfer option */
    this.userData = this._storage.getSetUserData();
  }


  ngAfterViewInit() {
    let currentMonth = new Date().getMonth() + 1;
    let currentYear = new Date().getFullYear();
    this.MonthList = this.MonthListAll.filter(d => d.value <= currentMonth);
    let getMonthById = this.MonthListAll.filter(v => v.value == currentMonth);
    this.getmonths = getMonthById[0].nameShort;
    this.month = currentMonth;
    this.year = currentYear;
    this.formControlMonth.patchValue(currentMonth);
    this.formControlYear.patchValue(currentYear);
    this.getRecruiterProductivityReport(currentMonth, currentYear);
    this.hideColumn(this.month, this.year);
    this._cdr.detectChanges();
  }

  //hiding column by condition
  hideColumn(month, year) {
    let days = new Date(year, month, 0).getDate();
    this.displayedColumns = [];
    this.headGroup = [];
    this.displayedColumns = [...this.displayedColumnsAll];
    this.headGroup = [...this.groupAll];
    if (days === 28) {
      let dayRv = ['day32']
      this.displayedColumns.splice(-18);
      this.displayedColumns = [...this.displayedColumns, ...this.grTotalHd];
      // for(let i =0; i<this.grTotalHd.length;i++){
      //   this.displayedColumns.push(this.grTotalHd[i])
      // }
      this.headGroup.splice(-4);
      this.headGroup.push('day45');
    }
    if (days === 29) {
      this.displayedColumns.splice(-14);
      this.displayedColumns = [...this.displayedColumns, ...this.grTotalHd];
      this.headGroup.splice(-2);
      this.headGroup.push('day45');
    }
    if (days === 30) {
      this.displayedColumns.splice(-10);
      this.displayedColumns = [...this.displayedColumns, ...this.grTotalHd];
      this.headGroup.splice(-2);
      this.headGroup.push('day45');
    }
    if (days === 31) {
      this.displayedColumns.splice(-6);
      this.displayedColumns = [...this.displayedColumns, ...this.grTotalHd];
      this.headGroup.splice(-1);
      this.headGroup.push('day45');
    }
    else {

    }
  }

  delete(data) {
    let v;
    for (let i = 0; i < data.length; i++) {
      v = this.displayedColumns.splice(data[i], 1)
    }

    return v
  }

  //selecting months years
  public month: any = [];
  public year: number = 0;
  public isWeekWiseReport:boolean = false;
  MonthYear(e: any, type: number) {
    this.year = this.formControlYear.value;
    this.month = this.formControlMonth.value;
    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth() + 1;
    if (type === 1) {
      this.formControlMonth.reset();
      if (this.year === 2021) {
        let filterById = [9, 10, 11, 12]
        this.MonthList = this.MonthListAll.filter(t => {
          return filterById.indexOf(t.value) !== -1;
        });
        // this.MonthList = this.MonthListAll;
        this.isWeekWiseReport ? this.formControlMonth.patchValue([9]) : this.formControlMonth.patchValue(9);
        this.month = 9;
      }
      else if (this.year < currentYear) {
        this.MonthList = this.MonthListAll;
        this.isWeekWiseReport ? this.formControlMonth.patchValue([1]) : this.formControlMonth.patchValue(1);
      }
      else {
        this.MonthList = this.MonthListAll.filter(d => d.value <= currentMonth);
        this.month = currentMonth;
        this.isWeekWiseReport ? this.formControlMonth.patchValue([currentMonth]) : this.formControlMonth.patchValue(currentMonth);
      }
    }else
    if(type == 2){
      if(this.isWeekWiseReport){
        if(this.formControlMonth.value.length <= 3){
          this.month = this.formControlMonth.value;
        }else{
          this.formControlMonth.setValue(this.month);
        }
      }else{
        this.month = this.formControlMonth.value
      }
    }
    let getMonthById = this.MonthListAll.filter(v => v.value == this.month);
    this.getmonths = getMonthById[0]?.nameShort;
    this.getRecruiterProductivityReport(this.month, this.year);
    this.hideColumn(this.month, this.year);
  }

  public finalTotal: any = {};
  public displayedColumns2:any = [];
  public dataSource:any = [];

  //getting productivity data
  getRecruiterProductivityReport(month: number, year: number) {
    let queryString = `Month=${month}&Year=${year}`;
    if(!this.isWeekWiseReport){
      this._reportServe.RecruiterProductivityReport(queryString).subscribe(
        res => {
          this.candidateList = new MatTableDataSource(res['data']);
          this.finalTotal = res['grandTotal'][0];
          this.candidateList.sort = this.sort;
        }      
      )
    }else{
      this._reportServe.GetWeekWiseRecruiterProductivityReport(queryString).subscribe(
        res => {
          this.dataSource = res['data'];
          this.displayedColumns2 = Object.keys(this.dataSource[0])
        }
      )
    }
  }

 //remove underscore
  replaceUnder(y){
    y = y.replace(/_/g,' ');
    return y
  }

  //disable options after 3 months selected
  isOptionDisabled(opt:any):boolean {
    return this.formControlMonth?.value?.length >=3 && !this.formControlMonth?.value?.find(el => el == opt)
  }

  //toggle report day wise and week wise
  changeReport(){
    this.formControlMonth.reset();
    this.formControlYear.reset();    
    this.formControlYear.patchValue(this.year);
    let currentMonth = new Date().getMonth() + 1;
    this.month = currentMonth;
    if(this.isWeekWiseReport){
      this.isWeekWiseReport = false;
      let getMonthById = this.MonthListAll.filter(v => v.value == this.month);
      this.getmonths = getMonthById[0]?.nameShort;
    }else{
      this.isWeekWiseReport = true;
    }
    
    this.getRecruiterProductivityReport(this.month, this.year);
    this.hideColumn(this.month, this.year);
    this.isWeekWiseReport ? this.formControlMonth.setValue([currentMonth]) : this.formControlMonth.setValue(currentMonth);
  }


  //total count showing
  sumTotal(data: any = [], Type) {
    if (data.length != 0) {
      let total = data.reduce((total, line) => total + line[Type], 0)
      return total
    }
  }



  //export data as excel
  exportAsXLSX(): void {
    if(!this.isWeekWiseReport){
      TableUtil.exportTableToExcel("exportTable", 'date-wise-recruiter-productivity-report', `Report-${this.getmonths}-${this.year}`);
    }else{
      let monthsForExl:string = '';
      let getMonthById = this.MonthListAll.filter(v => this.formControlMonth.value.some(b => b == v.value));
      for(let i =0; i<getMonthById.length; i++){
        monthsForExl = monthsForExl+'-'+getMonthById[i].nameShort;
      }
      TableUtil.exportTableToExcel("exportTable", 'week-wise-recruiter-productivity-report', `Report${monthsForExl}-${this.year}`);
      
    }
    // let queryString = `Month=1&Year=2222`;
    // this._reportServe.RecruiterProductivityReport(queryString).subscribe(
    //   res => {
    //     let candidateList = res['data'];
    //     let filterDataExcel = [];
    //     for (let key = 0; key < candidateList.length+1; key++) {
    //       console.log('ar',candidateList[key]?.RecruiterName?candidateList[key].RecruiterName:'Total')
    //       let selectedData = {
    //         'Recruiter Name': candidateList[key]?.RecruiterName?candidateList[key].RecruiterName:'Total',
    //         'Scheduled L1': candidateList[key]?.Day_1_L1_Interviewed?candidateList[key].Day_1_L1_Interviewed:this.sumTotal(candidateList,''),
    //         //'Scheduled L1': candidateList[key].Day_1_L1_Interviewed,


    //       };

    //       filterDataExcel.push(selectedData);
    //     }

    //     this._excelService.exportAsExcelFile(filterDataExcel, 'Employee Referral Report');
    //   }
    // )

  }
}
