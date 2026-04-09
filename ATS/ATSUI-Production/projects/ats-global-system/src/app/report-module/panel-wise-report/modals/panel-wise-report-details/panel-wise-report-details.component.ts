import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
@Component({
  selector: 'app-panel-wise-report-details',
  templateUrl: './panel-wise-report-details.component.html',
  styleUrls: ['./panel-wise-report-details.component.scss']
})
export class PanelWiseReportDetailsComponent implements OnInit,AfterViewInit {
  displayedColumns = ['SNum','CandidateName','CandidateEmail','interviewDate','DU','Account','Skill','Status'];
  public candidateList:any = [];
  public searchInput:string;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
     public dialogRef: MatDialogRef<PanelWiseReportDetailsComponent>,
     public dialog: MatDialog,
     private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
  }
  ngAfterViewInit(){
    this.candidateList =  new MatTableDataSource(this.data.listData);
    this.candidateList.sort = this.sort;
    
   /***
    * default sort
    */
    const sortState: Sort = {active: 'Status', direction: 'desc'};
      this.sort.active = sortState.active;
      this.sort.direction = sortState.direction;
      this.sort.sortChange.emit(sortState);
    this.cdr.detectChanges();
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
