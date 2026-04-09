import { Component, ViewChild, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { AddNewCompanyModalComponent } from './modals/add-new-company-modal/add-new-company-modal.component';
import { AdminServiceService } from '../admin-service.service';
import { DatePipe } from '@angular/common';
import { ExcelService } from '../../core/common/excel.service';

@Component({
  selector: 'app-company-master',
  templateUrl: './company-master.component.html',
  styleUrls: ['./company-master.component.scss'],
  providers: [DatePipe]
})
export class CompanyMasterComponent implements OnInit {

  displayedColumns = ['srNo', 'companyName', 'tierType', 'AddedBy', 'Addedon','status'];
   public searchInput: string;
   public paginationData: any;
   public pazeOption: any = [10, 20, 50, 100];
   public pazeSize: any = 10;
   public jumpFirstPage: boolean = false;
  public isResetSearch: boolean = false;
  public FilterCtrl: UntypedFormControl = new UntypedFormControl();
  public companyList: any = []; 
  @ViewChild(MatSort) sort: MatSort;
  public sortTable: string = '';
  @ViewChild('paginatorRef', { static: true }) paginatorCompRef;
  constructor(
    public dialog: MatDialog,
    private _adminService:AdminServiceService,
    public datepipe: DatePipe,
    private _excelService: ExcelService
  ) { }

  ngOnInit() {
    this.getAllCompanyList(1, this.pazeSize, '');
  }
  ngAfterViewInit() {
 
  }

  /***
   * reset paging
   */
  resetPagination() {
    this.paginatorCompRef.paginator.pageIndex = 0;
  }

  getAllCompanyList(page:number, pageSize:number, name: string, ): void {
    this._adminService.getCompanyListForCompanyMaster(page, pageSize, name).subscribe(
      res => {
        this.companyList = res['data'];
        this.paginationData = res['Table1'][0];
      }
    );
  }
 
  /**
  * pagination method
  * @param pageEvent 
  */
  getPagingData(pageEvent: any) {
    this.getAllCompanyList(pageEvent.pageIndex + 1, pageEvent.pageSize,  this.searchInput);
  }

  /***
     * search
     */
  getSearchValueKey(e: any) {
    // this.isResetSearch = false;
     this.searchInput = e;
     this.jumpFirstPage = false;
     this.jumpFirstPage = true;
   this.getAllCompanyList(1, this.pazeSize, e);
  }

/**open modal to add new company */
  addNewCompanyModal(element: any) {
    element['title'] = "Add New Company";
    const dialogRef = this.dialog.open(AddNewCompanyModalComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'update-interview-feedback', 'talent-transfers', 'talent-transfers-mod'],
      data: element,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.paginatorCompRef.paginator.pageIndex = 0;
        this.getAllCompanyList(1, this.pazeSize, '');
      }
    });

  }

  /***
   * export excel
   */
  exportAsXLSX(): void {
   // let queryString = `${'thId=' + this.thId}&page=1&pageSize=${this.paginationData?.Total}${this.searchInput ? '&search=' + this.searchInput : ''}${this.sortParam ? this.sortParam : ''}${this.sortTable ? this.sortTable : ''}`;
     //let queryString = `page=1&pageSize=${this.paginationData?.Total}${this.searchInput ? '&search=' + this.searchInput : ''}`;
    this._adminService.getCompanyListForCompanyMaster(1,this.paginationData?.Total, this.searchInput ? this.searchInput : '' ).subscribe(
      res => {
        let candidateList = res['data'];
        let filterDataExcel = [];
        for (var key in candidateList) {
          let selectedData = {
            'Company Name	': candidateList[key].name,
            'Tier Type': candidateList[key].Tier,
            'Added By': candidateList[key].addedby,
           // 'Added On': candidateList[key].addedOn,
            'Added On': this.datepipe.transform(candidateList[key].addedOn, 'yyyy/MM/dd'),
            'Status': candidateList[key].status ==1? 'Active':'Inactive',
          };
          filterDataExcel.push(selectedData);
        }

        this._excelService.exportAsExcelFile(filterDataExcel, 'Company List');
      }
    )

  }

}
