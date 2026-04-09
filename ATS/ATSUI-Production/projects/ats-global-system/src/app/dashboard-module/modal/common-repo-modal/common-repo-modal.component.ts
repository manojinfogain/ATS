import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { ExcelService } from 'projects/ats-global-system/src/app/core/common/excel.service';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { TransferCandidateFormComponent } from 'projects/ats-global-system/src/app/interview-module/transfer-candidates/modal/transfer-candidate-form/transfer-candidate-form.component';

import { environment } from 'projects/ats-global-system/src/environments/environment';
import { DashboardService } from '../../dashboard.service';
import { AssignCandidateTalentidComponent } from '../assign-candidate-talentid/assign-candidate-talentid.component';
import { saveAs } from "file-saver";
import { COMMON_CONST } from '../../../core/constant/common.const';
import { GlobalCommonMethodService } from '../../../core/common/global-common-method.service';
@Component({
  selector: 'app-common-repo-modal',
  templateUrl: './common-repo-modal.component.html',
  styleUrls: ['./common-repo-modal.component.scss'],
  providers: [DatePipe]
})
export class CommonRepoModalComponent implements OnInit, AfterViewInit {
  displayedColumns = ['profileSource', 'Candidate_Name', 'email', 'talentID', 'phoneNo', 'Skill','TotalExperience', 'primaryRec', 'secondaryRec', 'InterviewDate', 'InterviewStatus', 'Panel', 'Action'];
  blob: any;
  url: any;
  public candidateList: any = [];
  public searchInput: string;
  public isloader: boolean = false;
  public resumeBaseUrl: string = COMMON_CONST.cskillBaseUrl;
  public paginationData: any;
  public pazeOption: any = [10, 25, 50, 100];
  public pazeSize: any = 10;
  public thId: string = '';
  public jumpFirstPage: boolean = false;
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
    public _dashServe: DashboardService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CommonRepoModalComponent>,
    public dialog: MatDialog,
    private _excelService: ExcelService,
    public datepipe: DatePipe,
    private _storage: GetSetStorageService,
    private _fb: UntypedFormBuilder,
    private http: HttpClient,
    private _share: ShareService,
    private _globalCommonMethod: GlobalCommonMethodService
  ) { }

  ngOnInit() {
    this.userData = this._storage.getSetUserData();

    this.filterFormInit();

  }
  ngAfterViewInit() {
    /**
         * get List Profile
         */
    // this.sortParam = `&recruiterId=${this.userData?.EmpNewId}`;
    this.sortTable = `&sortColumn=applyDate&sortDir=desc`;
    this.getProfileCandList(1, this.pazeSize, null, null, this.sortTable);
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
      recruiterId: ['all']
    })
  }

  getProfileCandList(page: number, pageSize: number, search: string, sortParam: string, sortTable: string) {
    let queryString = `page=${page}&pageSize=${pageSize}${search ? '&search=' + search : ''}${this.thId ? 'thid' + this.thId : ''}${sortParam ? sortParam : ''}${sortTable ? sortTable : ''}`;
    this._dashServe.getCommonRepoProfileList(queryString).subscribe(
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
    //  this.sortParam = '';
    this.searchInput = e;
    this.jumpFirstPage = false;
    this.jumpFirstPage = true;
    this.getProfileCandList(1, this.pazeSize, e, this.sortParam, this.sortTable);
  }


  onNoClick() {
    this.dialogRef.close(true);
  }

  transferScheduledCandidate(element: any) {
    this.jumpFirstPage = false;
    element['title'] = "Transfer to Talent ID";
    const dialogRef = this.dialog.open(TransferCandidateFormComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'update-interview-feedback', 'talent-transfers', 'talent-transfers-mod'],
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
  /**
   * transfer to other talent Id Method
   */
  assignToTalenId(element: any): void {
    element['transferType'] = "all";
    element['title'] = "Transfer to Talent ID";
    const dialogRef = this.dialog.open(AssignCandidateTalentidComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'update-interview-feedback', 'talent-transfers', 'talent-transfers-mod'],
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
  dwnloadFileSingle(data:any) {
    if (data?.ProfileId == 3) {
      this._globalCommonMethod.downloadFileCskill(data?.resume_path, data?.c_resume);
    }
    else {
      data.cid? this._globalCommonMethod.downloadResume(data.cid,""):this._globalCommonMethod.downloadResume("",data.id);
    }

  }

  /***
   * export excel
   */
  exportAsXLSX(): void {
    let queryString = `page=1&pageSize=${this.paginationData?.Total}${this.searchInput ? '&search=' + this.searchInput : ''}${this.sortParam ? this.sortParam : ''}${this.sortTable ? this.sortTable : ''}`;
    //  let queryString = `page=1&pageSize=${this.paginationData?.Total}`;
    this._dashServe.getCommonRepoProfileList(queryString).subscribe(
      res => {
        let candidateList = res['data'];
        let filterDataExcel = [];
        for (var key in candidateList) {
          let selectedData = {
            'Talent ID': candidateList[key].TalentID,
            'Profile Source': candidateList[key].SourceName,
            'Candidate Email': candidateList[key].Email,
            'Candidate Name': candidateList[key].Name,
            ' Phone No.': candidateList[key].mobileNumber,
            'Skill': candidateList[key].SkillName,
             'Total Experience': candidateList[key].TotalExpYear + ' Year ' + candidateList[key].TotalExpMonth + ' Month',
            'primary Recruiter': candidateList[key].primaryrecruiter,
            'Secondary Recruiter': candidateList[key].secondaryrecruiter
          };
          filterDataExcel.push(selectedData);
        }

        this._excelService.exportAsExcelFile(filterDataExcel, 'unused-common-repository');
      }
    )

  }

}
