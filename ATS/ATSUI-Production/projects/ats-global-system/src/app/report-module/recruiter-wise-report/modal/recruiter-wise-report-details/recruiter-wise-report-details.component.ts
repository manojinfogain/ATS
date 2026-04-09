import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { ReportService } from 'projects/ats-global-system/src/app/report-module/report.service';

@Component({
  selector: 'app-recruiter-wise-report-details',
  templateUrl: './recruiter-wise-report-details.component.html',
  styleUrls: ['./recruiter-wise-report-details.component.scss']
})
export class RecruiterWiseReportDetailsComponent implements OnInit {
  displayedColumns = ['SNum','CandidateName','CandidateEmail','AccountNameCandi','ContactNumber','DU','TotalExperience','Skill','THID'];
 // 

  public candidateList:any = [];
  public searchInput:string;
  public paginationData: any;
  public pazeOption: any = [10, 25, 50, 100];
  public pazeSize: any = 10;
  public jumpFirstPage: boolean = false;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginatorRef', { static: true }) paginatorCompRef;
  constructor(
    @Inject(MAT_DIALOG_DATA)
     public data: any,
     public dialogRef: MatDialogRef<RecruiterWiseReportDetailsComponent>,
     public dialog: MatDialog,
     private cdr: ChangeDetectorRef,
     private _reportServe:ReportService
  ) { }

  ngOnInit(): void {
    if(this.data.flag == 'thidassigned' || this.data.flag =="thidassignedbefore30days"){
      this.displayedColumns = ['sNum2','talentId','Designation','TotalExperience','AccountName','DeliveryUnit','RequirementType','CreatedByName','CreatedOn']
    }
  //  this.candidateList =this.data.listData;
  this.getPanelReportDetails(this.data,1,10);
  console.log('ar', this.data)
  }

  getPanelReportDetails(data:any,page:number,pagesize:number) {
    
    let queryString = `RecruiterEmpID=${data.RecruiterEmpId}&Flag=${data.flag}&startdate=${data.startDate}&Page=${page}&pagesize=${pagesize}&Status=${data.statusNum}&Profile= ${data.profileIds}&enddate=${data.endDate}`;
    this._reportServe.getRecWiseReportDetails(queryString).subscribe(
      res => {
        this.candidateList = res['data'];
        this.paginationData = res['Paging'][0];
        console.log("alldata", res['data'])
      }
    )
  }


  /**
 * pagination method
 * @param pageEvent 
 */
   getPagingData(pageEvent: any) {
    this.getPanelReportDetails(this.data,pageEvent.pageIndex + 1, pageEvent.pageSize,);
   // this.getProfileCandList(pageEvent.pageIndex + 1, pageEvent.pageSize, this.searchInput ? this.searchInput : null,this.sortParam,this.sortTable);
  }
  

  /***
     * search
     */
   getSearchValueKey(e:any){
    this.searchInput = e;
  }

 

  /***
 * close
 */
   onNoClick(){
    this.dialogRef.close(true);
  }

}
