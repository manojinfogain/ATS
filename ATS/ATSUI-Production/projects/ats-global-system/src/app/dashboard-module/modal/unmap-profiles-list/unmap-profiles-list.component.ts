import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { DashboardService } from '../../dashboard.service';
import { AssignCandidateTalentidComponent } from '../assign-candidate-talentid/assign-candidate-talentid.component';
import { ViewProfileListComponent } from '../view-profile-list/view-profile-list.component';
import { HttpClient } from '@angular/common/http';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { MatSort, Sort } from '@angular/material/sort';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ExcelService } from 'projects/ats-global-system/src/app/core/common/excel.service';
import { DatePipe } from '@angular/common';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { ScreenRejectModalComponent } from '../screen-reject-modal/screen-reject-modal.component';
import { ScreenRejectModalGlobalComponent } from 'projects/ats-global-system/src/app/common-sharing/modals/screen-reject-modal-global/screen-reject-modal-global.component';
import { GlobalCommonMethodService } from '../../../core/common/global-common-method.service';
@Component({
  selector: 'app-unmap-profiles-list',
  templateUrl: './unmap-profiles-list.component.html',
  styleUrls: ['./unmap-profiles-list.component.scss'],
  providers: [DatePipe]
})
export class UnmapProfilesListComponent implements OnInit, AfterViewInit {
  displayedColumns = ['Candidate_Name', 'email', 'phone', 'primarySkill', 'secondarySkill', 'totalExperience',
    'releventExperience', 'referedOn', 'referedBy', 'ScreenStatus', 'ScreenRejectReason','modifiedOn','modifiedBy','action'];
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
  @ViewChild(MatSort) sort: MatSort;
  public sortTable: string = '';
  /** Paginator Reference */
  @ViewChild('paginatorRef', { static: true }) paginatorCompRef;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ViewProfileListComponent>,
    public dialog: MatDialog,
    public _dashServe: DashboardService,
    private _fb: UntypedFormBuilder,
    private _excelService: ExcelService,
    public datepipe: DatePipe,
    private _GlobCommon: GlobalCommonMethodService
  ) { }

  ngOnInit(): void {
    this.filterFormInit();
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
      this.sortTable = `&sortColumn=${sort.active}&sortDir=${sort.direction}`;
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
    let queryString = `page=${page}&pageSize=${pageSize}&search=${search ? search : ''}${sortParam ? sortParam : ''}${sortTable ? sortTable : ''}`;
    this._dashServe.getProfileWiseUnmapCandidateList(this.data.id, queryString).subscribe(
      res => {
        this.candidateList = new MatTableDataSource(res['data']);
        this.paginationData = res['pagination'][0];
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
    //this.isResetFilter = true;
    this.isResetSearch = false;
    // this.sortParam = '';
    this.searchInput = e;
    this.jumpFirstPage = false;
    this.jumpFirstPage = true;
    this.getProfileCandList(1, this.pazeSize, e, this.sortParam, this.sortTable);
  }

  assignToTalenId(element) {
    element['transferType'] = "unmap";
    element['title'] = "Map to Talent ID";
    const dialogRef = this.dialog.open(AssignCandidateTalentidComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'update-interview-feedback', 'talent-transfers'],
      data: element,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.jumpFirstPage = false;
        this.jumpFirstPage = true;
        this.getProfileCandList(1, this.pazeSize, null, this.sortParam, this.sortTable);
      }
    });
  }

  /***
   * download file
   */
  dwnloadFileSingle(data) {
   data.cid? this._GlobCommon.downloadResume(data.cid,""):this._GlobCommon.downloadResume("",data.id);
    // this.http.get(`${environment.apiMainUrlNet}Dashboard/downloadFile?filelocation=${encodeURIComponent(data.resumePath)}`, { responseType: 'blob' }).subscribe(
    //   res => {
    //     saveAs(res, data.resume);
    //   },
    //   (error) => {
    //     this._share.showAlertErrorMessage.next('Something went wrong');
    //   }
    // )
  }

  //screen reject  new method
  screenRejectMethod(elm: any) {
    if (elm?.isScreenRejected === 1) {
      elm['title'] = ` Are you sure you want to Activate ${elm?.name}?`;
      elm['profileId'] = elm?.profileid;
      elm['pId'] = elm?.id;
      const dialogRef = this.dialog.open(ScreenRejectModalComponent, {
        width: '500px',
        panelClass: ['ats-model-wrap', 'talent-transfers-mod', 'active-inc-modal'],
        data: elm,
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.jumpFirstPage = false;
          this.jumpFirstPage = true;
          this.getProfileCandList(1, this.pazeSize, null, this.sortParam, this.sortTable);
        }
        else {
        }
      });
    }
    else {
      elm['title'] = `Screen Reject - ${elm?.name}`;
      elm['profileId'] = elm?.profileid;
      elm['pId'] = elm?.id;
      const dialogRef = this.dialog.open(ScreenRejectModalGlobalComponent, {
        width: '500px',
        panelClass: ['ats-model-wrap', 'ats-model-full-screenss', 'request-transfers-candidate'],
        data: elm,
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.jumpFirstPage = false;
          this.jumpFirstPage = true;
          this.getProfileCandList(1, this.pazeSize, null, this.sortParam, this.sortTable);
        }
        else {
        }
      });
    }
  }

  /***
 * close
 */
  onNoClick() {
    this.dialogRef.close(true);
  }

  /***
   * export excel
   */
  exportAsXLSX(): void {
    let queryString = `page=1&pageSize=${this.paginationData?.Total}${this.searchInput ? '&search=' + this.searchInput : ''}${this.sortParam ? this.sortParam : ''}${this.sortTable ? this.sortTable : ''}`;
    this._dashServe.getProfileWiseUnmapCandidateList(this.data.id, queryString).subscribe(
      res => {
        let candidateList = res['data'];
        let filterDataExcel = [];
        let dateFormat = 'dd-MMM-yy'
        for (var key in candidateList) {
          let selectedData = {
            'Candidate Name': candidateList[key].name,
            'Candidate Email': candidateList[key].email,
            'Phone No.': candidateList[key].mobile_number,
            'Skill': candidateList[key].skillName,
            'Sub Skill': candidateList[key].secSkillName,
            'Total Experience ': candidateList[key].total_experience + ' Year ' + candidateList[key].total_experience_month + ' Month',
            'Relevent Experience ': candidateList[key].rel_exp + ' Year ' + candidateList[key].rel_exp_month + ' Month',
            'Referred On': this.datepipe.transform(candidateList[key].referredOn, dateFormat),
            'Referred By': candidateList[key].referredBy,
            // 'Referred On': candidateList[key].referredOn,
            'Screen Status': candidateList[key].isScreenRejected ? 'Screen Rejected' : '-',
            'Reject Reason': candidateList[key].isScreenRejected === 1 ? candidateList[key].ScreenRejectReason : '-',
            'Modified On':candidateList[key].ModifiedOn,
            'Modified By':candidateList[key].ModifiedBy
          };
          filterDataExcel.push(selectedData);
        }

        this._excelService.exportAsExcelFile(filterDataExcel, 'Employee-Referrals');
      }
    )

  }

}
