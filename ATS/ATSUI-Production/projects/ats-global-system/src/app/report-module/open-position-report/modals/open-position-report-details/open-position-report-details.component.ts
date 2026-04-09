import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { ReportService } from 'projects/ats-global-system/src/app/report-module/report.service';
import { AtsCommonPrefix } from 'projects/ats-global-system/src/app/core/constant/common.const';
@Component({
  selector: 'app-open-position-report-details',
  templateUrl: './open-position-report-details.component.html',
  styleUrls: ['./open-position-report-details.component.scss'],
  providers: [DatePipe]
})
export class OpenPositionReportDetailsComponent implements OnInit {
  displayedColumns = ['Cid', 'CandidateName', 'email', 'phone', 'InterViewDate', 'InterViewMode', 'InterViewType', 'InterViewer', 'Status', 'TotalExperience'];
  public candidateList: any = [];
  public paginationData: any;
  public pazeOption: any = [9, 25, 50, 100];
  public pazeSize: any = 9;
  public jumpFirstPage: boolean = false;
  public searchInput: string;
  public userData: any = {};
  public sortFormFilter: UntypedFormGroup = new UntypedFormGroup({});
  public isResetSearch: boolean = false;
  public isResetFilter: boolean = false;
  public sortParam: string = '';
  public cidColName:string = AtsCommonPrefix.CidColName;
  public cidPrefix:string = AtsCommonPrefix.CidPrefix;
  @ViewChild(MatSort) sort: MatSort;
  public sortTable: string = '';
  /** Paginator Reference */
  @ViewChild('paginatorRef', { static: true }) paginatorCompRef;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<OpenPositionReportDetailsComponent>,
    public dialog: MatDialog,
    private _fb: UntypedFormBuilder,
    public datepipe: DatePipe,
    private _reportServe: ReportService
  ) { }

  ngOnInit(): void {
    //this.filterFormInit();
    /**
     * get List Profile
     */

  }

  ngAfterViewInit() {
    /**
         * get List Profile
         */
    this.getProfileCandList(1, this.pazeSize, null, this.sortParam, this.sortTable);
  }

  /***
  * reset paging
  */
  resetPagination() {
    this.paginatorCompRef.paginator.pageIndex = 0;
  }

  /***
   * table sort by column
   */
  sortData(sort: Sort) {
    this.resetPagination();
    if (sort.direction == '') {
      this.sortTable = '';
    }
    else {
      // this.sortTable = `&sortColumn=${sort.active}&sortDir=${sort.direction}`;
    }
    this.getProfileCandList(1, this.pazeSize, this.searchInput, this.sortParam, this.sortTable);
  }

  /**
 * reset filter and search
 */
  resetSortFilter() {
    this.isResetSearch = true;
    this.isResetFilter = true;
    this.searchInput = '';
    this.sortParam = '';
    //this.sortTable = '';
  }

  /**
* get filter value
* @param data
*/
  getSortData(data: string) {
    this.isResetSearch = true;
    this.isResetFilter = false;
    this.searchInput = '';
    this.sortParam = data;
    this.resetPagination();
    this.getProfileCandList(1, this.pazeSize, this.searchInput, data, this.sortTable);
  }

  /***
 * filter form Init
 */
  filterFormInit() {
    this.sortFormFilter = this._fb.group({
      dateFrom: [null],
      dateTo: [{ value: null, disabled: true }],
      checkBoxCtrl: [false]
    })
  }

  /**
  * Method for get profile list
  * @param page 
  * @param pageSize 
  * @param search 
  */
  getProfileCandList(page: number, pageSize: number, search: string, sortParam: string, sortTable: string) {
    let queryString = `Thid=${this.data.ThId}&Flag=${this.data.flag}&Round=${this.data.Round}&page=${page}&pageSize=${pageSize}&search=${search ? search : ''}${sortParam ? sortParam : ''}${sortTable ? sortTable : ''}`;
    this._reportServe.getOpenPositionReportDetails(queryString).subscribe(
      res => {
        this.candidateList = new MatTableDataSource(res['data']);
        this.paginationData = res['Paging'][0];
        this.candidateList.sort = this.sort;
      }
    )
  }

  /**
 * pagination method
 * @param pageEvent 
 */
  getPagingData(pageEvent: any) {
    this.getProfileCandList(pageEvent.pageIndex + 1, pageEvent.pageSize, this.searchInput ? this.searchInput : null, this.sortParam, this.sortTable);
  }

  /***
     * search
     */
  getSearchValueKey(e: any) {
    this.isResetFilter = true;
    this.isResetSearch = false;
    this.sortParam = '';
    this.searchInput = e;
    this.jumpFirstPage = false;
    this.jumpFirstPage = true;
    this.getProfileCandList(1, this.pazeSize, e, this.sortParam, this.sortTable);
  }


  /***
 * close
 */
  onNoClick() {
    this.dialogRef.close(true);
  }


}
