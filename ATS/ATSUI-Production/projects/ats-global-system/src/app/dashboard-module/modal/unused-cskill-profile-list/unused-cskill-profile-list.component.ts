import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { ScreenRejectModalGlobalComponent } from 'projects/ats-global-system/src/app/common-sharing/modals/screen-reject-modal-global/screen-reject-modal-global.component';
import { ExcelService } from 'projects/ats-global-system/src/app/core/common/excel.service';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { InterviewCommonService } from 'projects/ats-global-system/src/app/core/services/interview-common.service';
import { JdPanelConfirmationModalComponent } from 'projects/ats-global-system/src/app/interview-module/modals/jd-panel-confirmation-modal/jd-panel-confirmation-modal.component';
import { ConfirmationDialogComponent } from 'projects/ats-global-system/src/app/shared/shared-app/components/confirmation-dialog/confirmation-dialog.component';
import { DashboardService } from '../../dashboard.service';
import { AssignCandidateTalentidComponent } from '../assign-candidate-talentid/assign-candidate-talentid.component';
import { ScheduleInterviewComponent } from '../schedule-interview/schedule-interview.component';
import { ScreenRejectModalComponent } from '../screen-reject-modal/screen-reject-modal.component';
import { GlobalMethod } from '../../../core/common/global-method';
import { Options } from '@angular-slider/ngx-slider';
import { GlobalCommonMethodService } from '../../../core/common/global-common-method.service';
import { labelResumeRating } from '../../../core/constant/common.const';
import { ViewResumeAiRatingDetailsComponent } from '../../../common-sharing/modals/view-resume-ai-rating-details/view-resume-ai-rating-details.component';
@Component({
  selector: 'app-unused-cskill-profile-list',
  templateUrl: './unused-cskill-profile-list.component.html',
  styleUrls: ['./unused-cskill-profile-list.component.scss'],
  providers: [DatePipe]
})
export class UnusedCskillProfileListComponent implements OnInit, AfterViewInit {
  displayedColumns = ['Candidate_Name', 'email', 'talentID','dormantStatus', 'applyDate', 'phoneNo', 'location', 'talentlocation', 'PrimarySkill', 'subSkill', 'secondarySkill', 'primarySkillExp', 'totalExp', 'noticePeriod', 'primaryRec', 'secondaryRec','orgName', 'ScreenStatus', 'ScreenRejectReason','Rating', 'Document'];
  blob: any;
  url: any;
  public candidateList: any = [];
  public searchInput: string;
  public isloader: boolean = false;
  public resumeBaseUrl: string = "https://infogain.com/rest/resume/";
  public paginationData: any;
  public pazeOption: any = [10, 25, 50, 100];
  public pazeSize: any = 10;
  public thId: string = '';
  public jumpFirstPage: boolean = false;
  public userData: any = {};
  public sortFormFilter: UntypedFormGroup = new UntypedFormGroup({});
  public isResetSearch: boolean = false;
  public isResetFilter: boolean = false;
  public sortParam: any = '';
  @ViewChild(MatSort) sort: MatSort;
  // public sortTable: string = '';
  public sortTable: any = [];
  /** Paginator Reference */
  @ViewChild('paginatorRef', { static: true }) paginatorCompRef;
  public labelResumeRating:any = labelResumeRating
  constructor(
    public _dashServe: DashboardService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<UnusedCskillProfileListComponent>,
    public dialog: MatDialog,
    private _excelService: ExcelService,
    public datepipe: DatePipe,
    private _storage: GetSetStorageService,
    private _fb: UntypedFormBuilder,
    private _interCommon: InterviewCommonService,
    private _globalCommon:GlobalCommonMethodService
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


  downloadResume(data: any) {
    debugger
   //data.cid ? this._globalCommon.downloadResume(data.cid, ""): this._globalCommon.downloadResume("",data.id);
    this._globalCommon.DownLoadResumeAll(data?.id,3,0,data?.resumePath,data?.resume_name);
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
      this.sortTable = sort;
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
      recruiterId: [[]],
      checkBoxCtrl: [false],
      noticePeriod: ['all'],
      primarySkill: [[]],
      accountType: [[]],
      location: [[]],
      countryCskilld: [[]],
      experienceRange: [[0, 50]],
      textBoxCtrl:[null],
      RangeSlider: [[0, 5]]
    })
  }


  public bodyParam: any = {};
  getProfileCandList(page: number, pageSize: number, search: string, sortParam: any, sortTable: any) {
    this.bodyParam = {};
    let body = {
      page: page,
      pageSize: pageSize,
      // startDate: sortParam.startDate
    }

    if (sortParam?.dateFrom) {
      body['startDate'] = GlobalMethod.formatDate(sortParam?.dateFrom);
    }
    if (sortParam?.dateTo) {
      body['endDate'] = GlobalMethod.formatDate(sortParam?.dateTo);
    }
    if (search) {
      body['search'] = search;
    }
    if (sortParam?.checkBoxCtrl) {
      body['screenReject'] = 1;
    }
    if (sortParam?.noticePeriod) {
      body['NPMax'] = sortParam?.noticePeriod;
    }

    if (sortTable?.direction) {
      body['sortDir'] = sortTable?.direction;
    }

    if (sortTable?.active) {
      body['sortColumn'] = sortTable?.active;
    }

    if (sortParam?.location && sortParam?.location?.length !== 0) {
      let locationIds = sortParam?.location?.filter(n => n);
      body['location'] = locationIds?.toString();
    }

    if (sortParam?.primarySkill && sortParam?.primarySkill?.length !== 0) {
      let Ids = sortParam?.primarySkill?.filter(n => n);
      body['skillId'] = Ids.toString();
    }

    if (sortParam?.countryCskilld && sortParam?.countryCskilld?.length !== 0) {
      let Ids = sortParam?.countryCskilld?.filter(n => n);
      body['country'] = Ids.toString();
    }

    if (sortParam?.recruiterId && sortParam?.recruiterId?.length !== 0) {
      let Ids = sortParam?.recruiterId?.filter(n => n);
      body['recruiterId'] = Ids.toString();
    }
    if (sortParam?.accountType && sortParam?.accountType?.length !== 0) {
      let Ids = sortParam?.accountType?.filter(n => n);
      body['accountId'] = Ids.toString();
    }
    if (sortParam?.experienceRange && sortParam?.experienceRange?.length !== 0) {
      body['MinExp'] = sortParam?.experienceRange[0];
      body['MaxExp'] = sortParam?.experienceRange[1];

    }
    if (sortParam?.textBoxCtrl) {
      body['orgName'] = sortParam?.textBoxCtrl;

    }
    if (sortParam?.RangeSlider && sortParam?.RangeSlider?.length !== 0) {
      body['RatingMin'] = sortParam?.RangeSlider[0];
      body['RatingMax'] = sortParam?.RangeSlider[1];

    }
    
    this.bodyParam = body;
    this._dashServe.getUnusedCkillProfileList(body).subscribe(
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
  /**
   * transfer to other talent Id Method
   */
  assignToTalenId(element: any): void {
    element['transferType'] = "unused";
    element['title'] = "Transfer to Talent ID";
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

  screenReject(data: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      panelClass: 'ats-confirm',
      data: {
        headerText: 'Alert',
        message: ` Are you sure you want to Reject <span class='u-name'>${data?.name}</span> ?`,
        buttonText: {
          ok: "Yes",
          cancel: "No"
        },
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.openFormForReamrk(data);
      }
      else {
      }
    });
  }



  //screen reject  new method
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
   * export excel
   */
  exportAsXLSX(): void {
  //  let queryString = `page=1&pageSize=${this.paginationData?.Total}${this.searchInput ? '&search=' + this.searchInput : ''}${this.sortParam ? this.sortParam : ''}${this.sortTable ? this.sortTable : ''}`;
    //  let queryString = `page=1&pageSize=${this.paginationData?.Total}`;
    let bodyData = {
      ...this.bodyParam,
      page: 1,
      pageSize: this.paginationData?.Total,
    }
    this._dashServe.getUnusedCkillProfileList(bodyData).subscribe(
      res => {
        let candidateList = res['data'];
        let filterDataExcel = [];
        for (var key in candidateList) {
          let selectedData = {
            'Talent ID': candidateList[key].talent_id,
            'Candidate Email': candidateList[key].email,
            'Candidate Name': candidateList[key].name,
            'Applied Date': this.datepipe.transform(candidateList[key].updated_on, 'yyyy/MM/dd'),
            ' Phone No.': candidateList[key].contact_no,
            'Candidate Location': candidateList[key].locations,
            'Talent ID Location': candidateList[key].TrLocation,
            'Primary Skill': candidateList[key].skills,
            'Secondary Skill': candidateList[key].add_Skill,
            'Primary Skill Experience (Month)': candidateList[key].exp_primary_skill,
            'Total Experience ': candidateList[key].total_experience + ' Year ' + candidateList[key].total_months + ' Month',
            'primary Recruiter': candidateList[key].primaryrecruiterName,
            'Secondary Recruiter': candidateList[key].secondaryrecruiterName,
            'Company Name': candidateList[key].orgName,
            'Screen Status': candidateList[key].isScreenRejected ? 'Screen Rejected' : '-',
            'Reject Reason': candidateList[key].isScreenRejected === 1 ? candidateList[key].ScreenRejectReason : '-'
          };
          filterDataExcel.push(selectedData);
        }

        this._excelService.exportAsExcelFile(filterDataExcel, 'CSkillRecords');
      }
    )

  }

  /**old mathod for schedule - redicrecting */
  // scheduleInterview(elm){
  //   let param = {
  //     appliedid:elm.id,
  //     profileid:elm.profileid,
  //     talentId:elm.talent_id,
  //     thId:elm.th_id,
  //     addExist:true,
  //     name:elm.name,
  //     mobile:elm.contact_no,
  //     email:elm.email,
  //     totalExp:elm.total_experience,
  //     totalExpMonth:elm.total_months,
  //     releventExp:null,
  //     primarySkill:null
  //   }
  //   // let queryParam = btoa(JSON.stringify(param));
  //   let queryParam =this._globalMethodServe.encryptData(param);
  //   this.router.navigate(['/interview-schedule'],{ queryParams:{query:queryParam} });
  //   this.dialogRef.close();
  //   this.dialog.closeAll();

  // }
  /***
* schedule inteview modal new
*/
  scheduleInterviewModal(elm: any) {
    let data = {
      title: 'Schedule Interview',
      profileId: elm?.profileid,
      candidate: {
        talentId: elm.talent_id,
        thId: elm.th_id,
        addExist: true,
        name: elm.name,
        mobile: elm.contact_no,
        email: elm.email,
        totalExp: elm.total_experience,
        totalExpMonth: elm.total_months,
        //  releventExp: elm.releventExpInYear,
        //  releventExpMonth: elm.total_months,
        profileid: elm.profileid,
        //c_profileUniqId: elm.id,
        // releventExp: null,
        primarySkill: elm.primarySkillsId,
        // country:elm.CountryID
        //
        dob: elm.dob,
        country: elm.CountryId,
        // genderId:elm?.genderId,
        // education: elm.eduQualificationId,
        //  currCompany: elm.currentCompanyId,
        //  currencyType: elm.currency_type,
        // tentativeJoinDate: elm.tentativeJoinDate,

        //cityId: elm.CityID,
        //currentCtc: elm.current_ctc,
        //expCtc: elm.expected_ctc,
        //candidateType: elm.contractID,

      }
    }

    const dialogRef = this.dialog.open(ScheduleInterviewComponent, {
      width: '80vh',
      panelClass: ['ats-model-wrap', 'schedule-interview', 'schedule-interview-modal'],
      data: data,
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

  // method for js panel check and interview page open
  scheduleIntHandler(elm: any) {
    this._interCommon.getJDPanelAvailableDetails(elm.th_id).subscribe(
      res => {
        let data = res['data'][0];
        if (data.JDAvailable == 'Y' && data.PanelAvailable == 'Y') {
          this.scheduleInterviewModal(elm)
        }
        else {
          elm['th_id'] = elm.th_id;
          this.openConfirmationModal(elm)
        }
      }

    )

  }

  //open confirmation popup
  openConfirmationModal(element: any) {
    // element['title'] = "Confirmation for JD available and panel available";
    const dialogRef = this.dialog.open(JdPanelConfirmationModalComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'ats-model-full-screenss', 'request-transfers-candidate',],
      data: element,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.scheduleInterviewModal(element)
      }
    });
  }

  /***
    * view ai rating details
    */
     openCandidateRatingDetailsModal(elm: any ={}) {
        elm['title'] = labelResumeRating?.modalViewResumeRatingTitle;
        elm['isProfileInterview'] = 0;
        elm['id'] = elm.id;
        const dialogRef = this.dialog.open(ViewResumeAiRatingDetailsComponent, {
          panelClass: ['ats-model-wrap', 'ats-rating-dtp-modal'],
          data: elm,
          width: '500px'
        });
      }


  /**new schedule moal open method */
  // scheduleInterviewModal(elm){

  // }


}
