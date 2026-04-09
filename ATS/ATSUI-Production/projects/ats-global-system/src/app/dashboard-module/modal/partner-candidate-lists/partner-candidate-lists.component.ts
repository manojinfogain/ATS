import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { Router } from '@angular/router';
import { ScreenRejectModalGlobalComponent } from 'projects/ats-global-system/src/app/common-sharing/modals/screen-reject-modal-global/screen-reject-modal-global.component';
import { ExcelService } from 'projects/ats-global-system/src/app/core/common/excel.service';
import { GetLocationInfo } from 'projects/ats-global-system/src/app/core/common/getLocationInfo';
import { GlobalCommonMethodService } from 'projects/ats-global-system/src/app/core/common/global-common-method.service';
import { CONSTANTS } from 'projects/ats-global-system/src/app/core/constant/constants';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { InterviewCommonService } from 'projects/ats-global-system/src/app/core/services/interview-common.service';
import { JdPanelConfirmationModalComponent } from 'projects/ats-global-system/src/app/interview-module/modals/jd-panel-confirmation-modal/jd-panel-confirmation-modal.component';
import { ViewCandidateDetailsPartnerComponent } from 'projects/ats-global-system/src/app/vendor-partner-module/modals/view-candidate-details-partner/view-candidate-details-partner.component';
import { DashboardService } from '../../dashboard.service';
import { AddProfileFormComponent } from '../add-profile-form/add-profile-form.component';
import { ScheduleInterviewComponent } from '../schedule-interview/schedule-interview.component';
import { ScreenRejectModalComponent } from '../screen-reject-modal/screen-reject-modal.component';
import { HttpClient } from '@angular/common/http';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { saveAs } from "file-saver";
import { CommonPdfViewerInternalComponent } from '../../../common-sharing/modals/common-pdf-viewer-internal/common-pdf-viewer-internal.component';
import { COMMON_CONST, labelResumeRating } from '../../../core/constant/common.const';
import { ViewResumeAiRatingDetailsComponent } from '../../../common-sharing/modals/view-resume-ai-rating-details/view-resume-ai-rating-details.component';
@Component({
  selector: 'app-partner-candidate-lists',
  templateUrl: './partner-candidate-lists.component.html',
  styleUrls: ['./partner-candidate-lists.component.scss'],
  providers: [DatePipe]
})
export class PartnerCandidateListsComponent implements OnInit, AfterViewInit {
  displayedColumns = ['candidateName', 'candidateEmail', 'phone', 'PartnerName', 'contractName', 'totalExp', 'relExp', 'primaryskill', 'notice', 'location', 'interviewRound', 'interviewStatus', 'CanStatus', 'ScreenStatus', 'ScreenRejectReason', 'action'];
  
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
  public statusData: any = CONSTANTS.statusCan;
  /** Paginator Reference */
  @ViewChild('paginatorRef', { static: true }) paginatorCompRef;
  public defaultSortTable: string = '&sortColumn=modifiedOn&sortDir=desc';
  public actionRightUser: boolean = false;
    public labelResumeRating:any =labelResumeRating
  constructor(
    public _dashServe: DashboardService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PartnerCandidateListsComponent>,
    public dialog: MatDialog,
    private _excelService: ExcelService,
    public datepipe: DatePipe,
    private router: Router,
    private _globalMethodServe: GlobalCommonMethodService,
    private _storage: GetSetStorageService,
    private _fb: UntypedFormBuilder,
    private _interCommon: InterviewCommonService,
    private getLocInfo: GetLocationInfo,
    private http: HttpClient
  ) { }
  public locationData: any = {};
  ngOnInit() {
    /**dob column for India location */
    if (this.getLocInfo.isLocationIndia()){
      this.displayedColumns.splice(7, 0, 'dob')
    }
      if(this.data?.isAIVisible == 1){
         this.displayedColumns.splice(this.displayedColumns.length - 1, 0,'Rating');
    }
    this.locationData = this.getLocInfo;
    this.userData = this._storage.getSetUserData();
    this.thId = this.data.thIds.th_id;
    this.filterFormInit();
    this.actionRightUser = this._globalMethodServe.requistionActionControlRight(this.data?.list?.data);
 this.data.candidate;
  }
  ngAfterViewInit() {
    /**
         * get List Profile
         */
    // this.sortParam = `&recruiterId=${this.userData?.EmpNewId}`;
    this.getProfileCandList(1, this.pazeSize, null, null, this.defaultSortTable);
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
      dateTo: [null],
      statusAssignId: ['all'],
      statusId: ['all'],
      checkBoxCtrl: [false],
      RangeSlider: [[0, 5]]
    })
  }

  getProfileCandList(page: number, pageSize: number, search: string, sortParam: string, sortTable: string) {
    let queryString = `${'thId=' + this.thId}&page=${page}&pageSize=${pageSize}${search ? '&search=' + search : ''}${sortParam ? sortParam : ''}${sortTable ? sortTable : ''}`;
    this._dashServe.getPartnerCandidateListByTalentId(queryString).subscribe(
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
    // this.isResetFilter = true;
    this.isResetSearch = false;
    //this.sortParam = '';
    this.searchInput = e;
    this.jumpFirstPage = false;
    this.jumpFirstPage = true;
    this.getProfileCandList(1, this.pazeSize, e, this.sortParam, this.sortTable);
  }


  onNoClick() {
    this.dialogRef.close(true);
  }
  /***
    * download file
    */
  dwnloadFileSingle(data:any) {
    let fileName = this._globalMethodServe.removeLastExtension(data.resume);
    if(data?.cid){
      this.http.get(`${environment.apiMainUrlNet}Dashboard/downloadResume?cid=${data.cid}`, { responseType: 'blob' }).subscribe(
        res => {
          let elm = {};
          elm['title'] = 'Preview';
          elm['documentName'] = fileName;
          elm['fileName'] = fileName;
          if (res?.type == 'application/pdf') {
            elm['pdfPreviewData'] = res;
            const dialogRef = this.dialog.open(CommonPdfViewerInternalComponent, {
              panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
              data: elm,
              maxWidth: '100vw',
              maxHeight: '100vh',
              height: '100%',
              width: '100%'
            });
          }
          else{
            saveAs(res,fileName);
          }

        }
      )
    }
    else if(data?.id){
      this.http.get(`${environment.apiMainUrlNet}Dashboard/downloadResume?id=${data.id}`, { responseType: 'blob' }).subscribe(
        res => {
          let elm = {};
          elm['title'] = 'Preview';
          elm['documentName'] = fileName;
          elm['fileName'] = fileName;
          if (res?.type == 'application/pdf') {
            elm['pdfPreviewData'] = res;
            const dialogRef = this.dialog.open(CommonPdfViewerInternalComponent, {
              panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
              data: elm,
              maxWidth: '100vw',
              maxHeight: '100vh',
              height: '100%',
              width: '100%'
            });
          }
          else{
            saveAs(res,fileName);
          }

        }
      )
    }
  //  this.http.get(`${environment.apiMainUrlNet}Dashboard/downloadFile?filelocation=${encodeURIComponent(data?.resumePath)}`, { responseType: 'blob' }).subscribe(

   // this._globalMethodServe.downloadFile(data, 'Dashboard/downloadFile?filelocation');
  }

  /***
   * open upload profile modal
   */
  openUpdateProfileModal(list: any) {
    list['CountryID'] = list['CountryCode'];
    let data = {
      title: 'Update Profile',
      list: list,
      thIds: this.data,
      type: 2
    }
    if(this.data?.thIds?.isTidDormant != 'D'){
      const dialogRef = this.dialog.open(AddProfileFormComponent, {
        width: '500px',
        panelClass: ['ats-model-wrap', 'add-profile-popup'],
        data: data,
        disableClose: true
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.jumpFirstPage = false;
          this.jumpFirstPage = true;
          this.getProfileCandList(1, this.pazeSize, this.searchInput, this.sortParam, this.sortTable);
        }
      });
    }else{
      let msg = 'Profile Cannot be updated';
      this.dormantTidMsgDisplay(msg);
    }
  }

  viewDetails(elm: any) {
    const dialogRef = this.dialog.open(ViewCandidateDetailsPartnerComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'view-cand-part-dt', 'ats-model-lg', 'animate__animated', 'animate__swing'],
      data: elm,
      disableClose: true
    });
  }

  /**
  * navigate to schedule screen
  * @param elm
  */

  scheduleInterview(elm) {
    let param = {
      title: 'Schedule Interview',
      profileId: this.data.list?.id,
      candidate: {
        talentId: this.data.thIds.talent_id,
        thId: this.data.thIds.th_id,
        addExist: true,
       // name: elm.name,
       firstName: elm.FirstName,
       middleName: elm.MiddleName,
       lastName: elm.LastName,
        mobile: elm.mobile_number,
        email: elm.email,
        totalExp: elm.totalExpInYear,
        totalExpMonth: elm.totalExpInMonth,
        releventExp: elm.releventExpInYear,
        releventExpMonth: elm.releventExpInMonth,
        primarySkill: parseInt(elm.pSkillID),
        profileid: elm.profile_id,
        c_profileUniqId: elm.id,
        currCompany: elm.currentCompanyId,
        currencyType: elm.currency_type,
        currentCtc: elm.current_ctc,
        expCtc: elm.expected_ctc,
        country: elm.CountryID,
        cityId: elm.CityID,
        stateId:elm?.stateId,
        education: elm.educationqualicationId,
        tentativeJoinDate: new Date().setDate(new Date().getDate() + parseInt(elm?.noticePeriod)),
        dob: elm.dob,
        candidateType: elm.contractID,
        genderId:elm?.genderId,
        SalaryType:elm?.SalaryType,
      }

    }
    // let queryParam = this._globalMethodServe.encryptData(param);
    // this.router.navigate(['/interview-schedule'], { queryParams: { query: queryParam } });
    // this.dialogRef.close();
    // this.dialog.closeAll();

    const dialogRef = this.dialog.open(ScheduleInterviewComponent, {
      width: '80vh',
      panelClass: ['ats-model-wrap', 'schedule-interview', 'schedule-interview-modal'],
      data: param,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.jumpFirstPage = false;
        this.jumpFirstPage = true;
        this.getProfileCandList(1, this.pazeSize, this.searchInput, this.sortParam, this.sortTable);
      }
      else {
      }
    });

  }

  // method for js panel check and interview page open
  scheduleIntHandler(elm: any) {
    if(this.data?.thIds?.isTidDormant != 'D'){
      this._interCommon.getJDPanelAvailableDetails(this.data?.thIds?.th_id).subscribe(
        res => {
          let data = res['data'][0];
          if (data.JDAvailable == 'Y' && data.PanelAvailable == 'Y') {
            this.scheduleInterview(elm)
          }
          else {
            elm['th_id'] = this.data?.thIds;
            this.openConfirmationModal(elm)
          }
        }

      )
    }else{
      let msg = 'Interview Cannot be scheduled';
      this.dormantTidMsgDisplay(msg);
    }
  }

  dormantTidMsgDisplay(msg:string){
    this._globalMethodServe.showMessagedisplay({
      title: 'Alert',
      autoHide: false,
      msg: `
     <p>${msg} as Talent Id is Dormant.</p>`
    });
  }

  //open modal jd panel confirmation
  //open confirmation popup
  openConfirmationModal(element: any) {
    // element['title'] = "Confirmation for JD available and panel available";
    const dialogRef = this.dialog.open(JdPanelConfirmationModalComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'ats-model-full-screenss', 'request-transfers-candidate',],
      data: this.data.thIds,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.scheduleInterview(element)
      }
    });
  }
  /***
   * screen Reject
   */
  // screenRejectForm(elm: any) {
  //   elm['title'] = ` Are you sure you want to Reject ${elm?.name}?`;
  //   elm['type'] = 2;
  //   const dialogRef = this.dialog.open(ScreenRejectModalComponent, {
  //     width: '500px',
  //     panelClass: ['ats-model-wrap', 'talent-transfers-mod', 'active-inc-modal'],
  //     data: elm,
  //     disableClose: true
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       this.jumpFirstPage = false;
  //       this.jumpFirstPage = true;
  //       this.getProfileCandList(1, this.pazeSize, this.searchInput, this.sortParam, this.sortTable);
  //     }
  //     else {
  //     }
  //   });
  // }

  //screen  new reject
  screenRejectMethod(elm: any) {
    if (elm?.isScreenRejected === 1) {
      elm['title'] = ` Are you sure you want to Activate ${elm?.name}?`;
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
          this.getProfileCandList(1, this.pazeSize, this.searchInput, this.sortParam, this.sortTable);
        }
        else {
        }
      });
    }
    else {
      elm['title'] = `Screen Reject - ${elm?.name}`;
      elm['profileId'] = elm?.profile_id;
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
          this.getProfileCandList(1, this.pazeSize, this.searchInput, this.sortParam, this.sortTable);
        }
        else {
        }
      });
    }
  }

  /***
   * export excel
   */
  exportAsXLSX(): void {
    let queryString = `${'thId=' + this.thId}&page=1&pageSize=${this.paginationData?.Total}${this.searchInput ? '&search=' + this.searchInput : ''}${this.sortParam ? this.sortParam : ''}${this.sortTable ? this.sortTable : ''}`;
    //  let queryString = `page=1&pageSize=${this.paginationData?.Total}`;
    this._dashServe.getPartnerCandidateListByTalentId(queryString).subscribe(
      res => {
        let candidateList = res['data'];
        let filterDataExcel = [];
        for (var key in candidateList) {
          let selectedData = {
            'Candidate Email': candidateList[key].email,
            'Candidate Name': candidateList[key].name,
            'Partner Name': candidateList[key].PartnerName,
            'Phone No.': candidateList[key].mobile_number,
            'Skill': candidateList[key].pSkillName,
            'Additional Skill': candidateList[key].sSkillName,
            'Total Experience ': candidateList[key].totalExpInYear + ' Year ' + candidateList[key].totalExpInMonth + ' Month',
            'Interview Status': candidateList[key].interviewStatus === null ? candidateList[key]?.statusName : candidateList[key]?.interviewStatusName,
            'Screen Status': candidateList[key].isScreenRejected === 1 ? 'Screen Rejected' : '-',
            'Reject Reason': candidateList[key].isScreenRejected === 1 ? candidateList[key].ScreenRejectReason : '-'
          };
          filterDataExcel.push(selectedData);
        }

        this._excelService.exportAsExcelFile(filterDataExcel, 'partner_candidates_' + this.data?.thIds?.talent_id);
      }
    )
    

  }


 /***
      * view ai rating details
      */
       openCandidateRatingDetailsModal(elm: any ={}) {
          elm['title'] = labelResumeRating?.modalViewResumeRatingTitle + ' - ' + elm?.name;
          elm['isProfileInterview'] = 0;
          elm['id'] = elm.id;
          elm['isDBFrom'] = true;
          const dialogRef = this.dialog.open(ViewResumeAiRatingDetailsComponent, {
            panelClass: ['ats-model-wrap', 'ats-rating-dtp-modal'],
            data: elm,
            width: '500px'
          });
        }



}
