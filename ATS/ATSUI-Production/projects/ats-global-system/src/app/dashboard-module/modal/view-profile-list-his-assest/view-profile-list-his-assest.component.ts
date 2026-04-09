import { Component, Inject, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { Router } from '@angular/router';
import { DashboardService } from '../../dashboard.service';
import { AddProfileFormComponent } from '../add-profile-form/add-profile-form.component';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { saveAs } from "file-saver";
import { HttpClient } from '@angular/common/http';
import { GlobalCommonMethodService } from 'projects/ats-global-system/src/app/core/common/global-common-method.service';
import { ScheduleInterviewComponent } from '../schedule-interview/schedule-interview.component';
import { InterviewCommonService } from 'projects/ats-global-system/src/app/core/services/interview-common.service';
import { JdPanelConfirmationModalComponent } from 'projects/ats-global-system/src/app/interview-module/modals/jd-panel-confirmation-modal/jd-panel-confirmation-modal.component';
import { ScreenRejectModalComponent } from '../screen-reject-modal/screen-reject-modal.component';
import { ScreenRejectModalGlobalComponent } from 'projects/ats-global-system/src/app/common-sharing/modals/screen-reject-modal-global/screen-reject-modal-global.component';
import { GetLocationInfo } from 'projects/ats-global-system/src/app/core/common/getLocationInfo';
import { CandidateCommonApiService } from '../../../core/services/candidate-common-api.service';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ViewResumeAiRatingDetailsComponent } from '../../../common-sharing/modals/view-resume-ai-rating-details/view-resume-ai-rating-details.component';
import { labelResumeRating } from '../../../core/constant/common.const';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-view-profile-list-his-assest',
  templateUrl: './view-profile-list-his-assest.component.html',
  styleUrls: ['./view-profile-list-his-assest.component.scss']
})
export class ViewProfileListHisAssestComponent implements OnInit {
displayedColumns =  ['select','Candidate Name', 'Email ID', 'Phone No.', 'primarySkill', 'secondarySkill', 'totalExperience', 'releventExperience','Rating', 'action'];
  public candidateList: any = [];
  public searchInput: string;
  public isloader: boolean = false;
  public paginationData: any;
  public pazeOption: any = [9, 25, 50, 100];
  public pazeSize: any = 9;
  public jumpFirstPage: boolean = false;
  public actionRightUser: boolean = false;
  public labelResumeRating:any =labelResumeRating;
   dataSource = new MatTableDataSource();
   selection = new SelectionModel<any>(true, []);
  constructor(
    public _dashServe: DashboardService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ViewProfileListHisAssestComponent>,
    public dialog: MatDialog,
    private router: Router,
    private http: HttpClient,
    private _globalMethodServe: GlobalCommonMethodService,
    private _interCommon: InterviewCommonService,
    private getLocInfo: GetLocationInfo,
    private _candidateCommon: CandidateCommonApiService,
     private _fb: UntypedFormBuilder
  ) { }
     public locationData: any = {};
    public sortFormFilter: UntypedFormGroup = new UntypedFormGroup({});
    public isResetFilter: boolean = false;
    public sortParam: any = '';
    public isResetSearch: boolean = false;
  ngOnInit() {
    this.filterFormInit();
    this.locationData = this.getLocInfo;
    
    /**
     * get List Profile
     */
    this.getProfileCandList(1, this.pazeSize, null);
    this.actionRightUser = this._globalMethodServe.requistionActionControlRight(this.data?.list?.data);

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
  this.getProfileCandList(1, this.pazeSize, this.searchInput, data);
}

/***
* filter form Init
*/
filterFormInit() {
  this.sortFormFilter = this._fb.group({
    RangeSlider: [[0, 5]]
  })
}

  /**
   * Method for get profile list
   * @param page 
   * @param pageSize 
   * @param search 
   */
  getProfileCandList(page:number, pageSize:number, search:string, sortParam?: any) {
    debugger
    let minRange = 0;
    let maxRange = 0;
    let RangeSliderVal = sortParam?.RangeSlider;
    if(RangeSliderVal && RangeSliderVal.length !== 0){
       minRange = RangeSliderVal[0];
       maxRange = RangeSliderVal[1];
    }
   
    let queryString = `page=${page}&pageSize=${pageSize}&search=${search ? search : ''}${minRange? '&RatingMin=' + minRange : ''}${maxRange ? '&RatingMax=' + maxRange : ''}`;
    this._dashServe.getAssestProfileWiseCandidateList(this.data.list.id, this.data.thIds.th_id, queryString).subscribe(
      res => {
         this.candidateList = res['data'];
         this.dataSource.data = res['data'] || [];
         this.selection.clear(); 
      }
    )
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle(): void {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  toggleSelection(row: any): void {
    this.selection.toggle(row);
  }


  /**
   * pagination method
   * @param pageEvent 
   */
  getPagingData(pageEvent: any) {
    this.getProfileCandList(pageEvent.pageIndex + 1, pageEvent.pageSize, this.searchInput ? this.searchInput : null);
  }

  /***
     * search
     */
  getSearchValueKey(e: any) {
    this.searchInput = e;
    this.getProfileCandList(1, this.pazeSize, e);
  }

 
  /***
   * close
   */
  onNoClick() {
    this.dialogRef.close();
  }


  /***
   * download file 
   */ 
  dwnloadFileSingle(data) {
    let resumeName = this._globalMethodServe.removeLastExtension(data?.resume);
    this.http.get(`${environment.apiMainUrlNet}Dashboard/downloadFile?filelocation=${encodeURIComponent(data.resumePath)}`, { responseType: 'blob' }).subscribe(
      res => {
        saveAs(res, resumeName);
      }
    )
  }

  
 
}
