import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {
  MatLegacyDialog as MatDialog,
  MatLegacyDialogRef as MatDialogRef,
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
} from '@angular/material/legacy-dialog';
import { Router } from '@angular/router';
import { DashboardService } from '../../dashboard.service';
import { CONSTANTS } from '../../../core/constant/constants';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ScreenRejectModalGlobalComponent } from '../../../common-sharing/modals/screen-reject-modal-global/screen-reject-modal-global.component';
import { ScreenRejectModalComponent } from '../screen-reject-modal/screen-reject-modal.component';
import { GlobalCommonMethodService } from '../../../core/common/global-common-method.service';
import { InterviewCommonService } from '../../../core/services/interview-common.service';
import { ScheduleInterviewComponent } from '../schedule-interview/schedule-interview.component';
import { CandidateCommonApiService } from '../../../core/services/candidate-common-api.service';
import { JdPanelConfirmationModalComponent } from '../../../interview-module/modals/jd-panel-confirmation-modal/jd-panel-confirmation-modal.component';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { labelResumeRating } from '../../../core/constant/common.const';
import { ViewResumeAiRatingDetailsComponent } from '../../../common-sharing/modals/view-resume-ai-rating-details/view-resume-ai-rating-details.component';
import { ResumeAssesmentModalComponent } from '../resume-assesment-modal/resume-assesment-modal.component';
import { UpdatescreenstatusmodalComponent } from '../../../common-sharing/modals/updatescreenstatusmodal/updatescreenstatusmodal.component';
import { PageCount } from '../../../talent-module/job-requisition-list/job-requisition-list.component';
import { DatePipe } from '@angular/common';
import { ExcelService } from '../../../core/common/excel.service';
import { GlobalMethod } from '../../../core/common/global-method';
import { ViewApplicantDetailsModalComponent } from '../view-applicant-details-modal/view-applicant-details-modal.component';
import { ViewCandidateDetailsPartnerComponent } from '../../../vendor-partner-module/modals/view-candidate-details-partner/view-candidate-details-partner.component';

@Component({
  selector: 'app-view-all-profiles-modal',
  templateUrl: './view-all-profiles-modal.component.html',
  styleUrls: ['./view-all-profiles-modal.component.scss'],
  providers: [DatePipe],
})
export class ViewAllProfilesModalComponent implements OnInit {
  @ViewChild('paginatorRef', { static: true }) paginatorCompRef;
  public candidateList: any[] = [];
  public labelResumeRating: any = labelResumeRating;
  // displayedColumns = ['CandidateName', 'EmailID', 'PhoneNo', 'action'];
  // Fix the syntax error and add all columns
  displayedColumns = [
    'TalentID',
    'CVSubmissionDate',
    'ProfileSource',
    'SourceName',
    'CID',
    'CandidateName',
    'EmailID',
    'PhoneNo',
    'Skill',
    'TotalExperience',
    'CompanyName',
    'CandidateLocation',
    'NoticePeriod',
    'Account',
    'InterviewDate',
    'InterviewType',
    'CandidateStatus',
    'PrimaryRecruiter',
    'SecondaryRecruiter',
    'TIDDormantStatus',
    'ProfileMatchPercentage',
    'LastModifiedOn',
    'LastModifiedBy',
    //  'PreScreenStatus',
    'action',
  ];
  public todayDate: Date = new Date();
  constructor(
    public _dashServe: DashboardService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ViewAllProfilesModalComponent>,
    public dialog: MatDialog,
    private router: Router,
    private _fb: UntypedFormBuilder,
    private _globalMethodServe: GlobalCommonMethodService,
    private _interCommon: InterviewCommonService,
    private _candidateCommon: CandidateCommonApiService,
    private http: HttpClient,
    private _excelService: ExcelService,
    public datepipe: DatePipe
  ) { }

  ngOnInit(): void {
    // Initialize the filter form
    this.filterFormInit();
    // Fetch the candidate list with initial parameters
    this.getProfileCandList(1, CONSTANTS.PAGE_SIZE, null, null);
  }

  public paginationData: any;
  public bodyParam: any = {};
  getProfileCandList(
    page: number,
    pageSize: number,
    search: any,
    sortParam: any
  ) {
    this.bodyParam = {};
    let body = {
      page: page,
      pageSize: pageSize,
    };
    // body['thid'] = 116147;
    body['thid'] = this.data?.th_id; // Use the thid from the data passed to the component
    if (search) {
      body['search'] = search;
    }
    if (
      sortParam?.candidateStatusNew &&
      sortParam?.candidateStatusNew.length !== 0
    ) {
      let Ids = sortParam?.candidateStatusNew.filter((n) => n);
      body['StatusID'] = Ids.toString();
    }
    if (sortParam?.primarySkill && sortParam?.primarySkill.length !== 0) {
      let Ids = sortParam?.primarySkill.filter((n) => n);
      body['skillId'] = Ids.toString();
    }
    if (sortParam?.source && sortParam?.source.length !== 0) {
      let Ids = sortParam?.source.filter((n) => n);
      body['SourceID'] = Ids.toString();
    }
    if (sortParam?.dateFrom) {
      body['startDate'] = GlobalMethod.formatDate(sortParam?.dateFrom);
    }

    if (sortParam?.dateTo) {
      body['endDate'] = GlobalMethod.formatDate(sortParam?.dateTo);
    }
    if (sortParam?.noticePeriod) {
      body['NoticePeriod'] = sortParam?.noticePeriod;
    }
    if (sortParam?.RangeSlider && sortParam?.RangeSlider?.length !== 0) {
      body['RatingMin'] = sortParam?.RangeSlider[0];
      body['RatingMax'] = sortParam?.RangeSlider[1];
    }
    if (sortParam?.RangeSliderNP && sortParam?.RangeSliderNP?.length !== 0) {
      body['NPMin'] = sortParam?.RangeSliderNP[0];
      body['NPMax'] = sortParam?.RangeSliderNP[1];
    }
    if (sortParam?.experienceRange && sortParam?.experienceRange?.length !== 0) {
      body['MinExp'] = sortParam?.experienceRange[0];
      body['MaxExp'] = sortParam?.experienceRange[1];

    }
    this.bodyParam = body;
    this._dashServe.getAllProfilesListByThid(body).subscribe((res) => {
      this.candidateList = res['data'];
      this.paginationData = res['Paging'][0];
    });
  }

  public sortFormFilter: UntypedFormGroup = new UntypedFormGroup({});
  /***
   * filter form Init
   */
  filterFormInit() {
    this.sortFormFilter = this._fb.group({
      primarySkill: [[]],
      dateFrom: [null],
      dateTo: [{ value: null, disabled: true }],
      RangeSlider: [[0, 100]],
      RangeSliderNP: [[0, 50]],
      source: [[]],
      candidateStatusNew: [[]],
      experienceRange: [[0, 50]]
    });
  }

  /***
   * search
   */
  public isResetSearch: boolean = false;
  public isResetFilter: boolean = false;
  public sortParam: any = '';
  public searchInput: string = '';
  getSearchValueKey(e: any) {
    this.isResetFilter = true;
    this.isResetSearch = false;
    this.sortParam = '';
    this.searchInput = e;
    this.paginatorCompRef.paginator.pageIndex = 0;
    let pageSizeSelected: number = this.paginatorCompRef?.paginator?.pageSize;
    this.getProfileCandList(1, pageSizeSelected, e, this.sortParam);
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
    this.paginatorCompRef.paginator.pageIndex = 0;
    let pageSizeSelected: number = this.paginatorCompRef?.paginator?.pageSize;
    this.getProfileCandList(1, pageSizeSelected, this.searchInput, data);
  }

  /**
   * pagination method
   * @param pageEvent
   */
  getPagingData(pageEvent: any) {
    this.getProfileCandList(
      pageEvent.pageIndex + 1,
      pageEvent.pageSize,
      this.searchInput ? this.searchInput : null,
      this.sortParam
    );
  }

  getPageCount(pageCount: PageCount) {
    let pageCountData: PageCount = {};
    pageCountData.pageSize = this.paginatorCompRef?.paginator?.pageSize;
    pageCountData.Page = this.paginatorCompRef?.paginator?.pageIndex + 1;
    return pageCountData;
  }

  /***
   * Screen Reject Method
   */
  openScreenStatusUpdateModal(elm: any) {
    let scrrenSS =
      elm?.CandidateStatusId == 20 ? 'Pre Screen Select' : 'Screen Reject';
    elm['title'] = `${scrrenSS}- ${elm?.CandidateName}`;
    elm['profileId'] = elm?.ProfileSourceId;
    elm['pId'] = elm?.id;
    elm['name'] = elm?.CandidateName;
    elm['email'] = elm?.EmailID;
    elm['statusId'] = elm?.CandidateStatusId;
    const dialogRef = this.dialog.open(UpdatescreenstatusmodalComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'screen-status-update-modal'],
      data: elm,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        let pageCount: PageCount = this.getPageCount({});
        this.getProfileCandList(
          pageCount?.Page,
          pageCount?.pageSize,
          this.searchInput,
          this.bodyParam
        );
      } else {
      }
    });
  }
  screenRejectMethod(elm: any) {
    if (elm?.isScreenRejected === 1) {
      elm['title'] = ` Are you sure you want to Activate ${elm?.name}?`;
      elm['profileId'] = elm?.profile_id;
      elm['pId'] = elm?.id;
      const dialogRef = this.dialog.open(ScreenRejectModalComponent, {
        width: '500px',
        panelClass: [
          'ats-model-wrap',
          'talent-transfers-mod',
          'active-inc-modal',
        ],
        data: elm,
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          // this.jumpFirstPage = false;
          // this.jumpFirstPage = true;
          // this.getProfileCandList(1, this.pazeSize, this.searchInput ? this.searchInput : null);
        } else {
        }
      });
    } else {
      elm['title'] = `Screen Reject - ${elm?.name}`;
      elm['profileId'] = elm?.profile_id;
      elm['pId'] = elm?.id;
      const dialogRef = this.dialog.open(ScreenRejectModalGlobalComponent, {
        width: '500px',
        panelClass: [
          'ats-model-wrap',
          'ats-model-full-screenss',
          'request-transfers-candidate',
        ],
        data: elm,
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          //  this.getProfileCandList(1, this.pazeSize, this.searchInput ? this.searchInput : null);
        } else {
        }
      });
    }
  }

  isRenuIntSchedule(element: any) {
    if (
      this.data?.assign === true &&
      element?.IsRenuTeam == 'Y' &&
      element?.StatusApr == 'A'
    ) {
      return true;
    } else if (this.data?.assign === true && element?.IsRenuTeam != 'Y') {
      return true;
    } else {
      return false;
    }
  }

  /**
   * navigate to schedule screen
   * @param elm
   */

  // method for js panel check and interview page open
  scheduleIntHandler(elm: any) {
    if (this.data?.isTidDormant != 'D') {
      this._interCommon
        .getJDPanelAvailableDetails(this.data?.th_id)
        .subscribe((res) => {
          let data = res['data'][0];
          if (data.JDAvailable == 'Y' && data.PanelAvailable == 'Y') {
            this.openScheduleInterview(elm);
          } else {
            elm['th_id'] = this.data?.th_id;
            this.openConfirmationModal(elm);
          }
        });
    } else {
      let msg = 'Interview Cannot be scheduled';
      this.dormantTidMsgDisplay(msg);
    }
  }

  dormantTidMsgDisplay(msg: string) {
    this._globalMethodServe.showMessagedisplay({
      title: 'Alert',
      autoHide: false,
      msg: `
     <p>${msg} as Talent Id is Dormant.</p>`,
    });
  }

  //open modal jd panel confirmation
  //open confirmation popup
  openConfirmationModal(element: any) {
    element['th_id'] = this.data?.th_id;
    // element['title'] = "Confirmation for JD available and panel available";
    const dialogRef = this.dialog.open(JdPanelConfirmationModalComponent, {
      width: '500px',
      panelClass: [
        'ats-model-wrap',
        'ats-model-full-screenssss',
        'request-transfers-candidate',
      ],
      data: element,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.openScheduleInterview(element);
      }
    });
  }

  /***
   * schedule inteview modal linkedin, employe refferal, Naukri, Social media sources
   */
  openScheduleInterview(elm: any) {
    /**get candidate personal details specific api */
    let candidateData: any = [];
    this._candidateCommon
      .getCandidateDetailsProfile(null, elm?.id, elm?.ProfileSourceId)
      .subscribe((res) => {
        candidateData = res['data'][0];
        // elm['dob'] = candidateData?.dob
        // this.openScheduleModalcodeMethod(elm);
        let data = {
          title: 'Schedule Interview',
          profileId: elm?.ProfileSourceId,
          IsRenuTeam: elm?.IsRenuTeam,
          candidate: {
            talentId: this.data?.talent_id,
            thId: this.data?.th_id,
            addExist: true,
            name: elm?.CandidateName,
            firstName: elm?.FirstName,
            middleName: elm?.MiddleName,
            lastName: elm?.LastName,
            countryCode: candidateData?.countryCode,
            mobile: elm.PhoneNo,
            email: elm?.EmailID,
            totalExp: elm.TotalExpYear ? elm.TotalExpYear : null,
            totalExpMonth: elm.TotalExpMonth ? elm.TotalExpMonth : null,
            releventExp: elm?.releventExpInYear ? elm.releventExpInYear : null,
            releventExpMonth: elm?.releventExpInMonth,
            primarySkill: candidateData.SkillId ? candidateData.SkillId : null,
            profileid: elm?.ProfileSourceId,
            c_profileUniqId: elm.id,
            // country:elm.CountryID
            dob: candidateData.dob ? candidateData.dob : null,
            candidateType: candidateData.contractID
              ? candidateData.contractID
              : null,
            genderId: candidateData?.GenderId ? candidateData?.GenderId : null,
            education: candidateData.eduQualificationId
              ? candidateData.eduQualificationId
              : null,
            currCompany: candidateData.currentCompanyId
              ? candidateData.currentCompanyId
              : null,
            currencyType: candidateData.currency_type
              ? candidateData.currency_type
              : null,
            // tentativeJoinDate: elm.tentativeJoinDate,
            country: candidateData.CountryID ? candidateData.CountryID : null,
            cityId: candidateData.CityID ? candidateData.CityID : null,
            currentCtc: candidateData.current_ctc
              ? candidateData.current_ctc
              : null,
            expCtc: candidateData.expected_ctc
              ? candidateData.expected_ctc
              : null,
            SalaryType: candidateData.SalaryType
              ? candidateData.SalaryType
              : null,
            tentativeJoinDate: candidateData.TentativeJoiningDate
              ? new Date(candidateData.TentativeJoiningDate)
              : null,
          },
        };
       
        const dialogRef = this.dialog.open(ScheduleInterviewComponent, {
          width: '80vh',
          panelClass: [
            'ats-model-wrap',
            'schedule-interview',
            'schedule-interview-modal',
          ],
          data: data,
          disableClose: true,
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            //  this.getProfileCandList(1, this.pazeSize, this.searchInput ? this.searchInput : null);
          }
        });
      });
    /**ends */
  }

 
  dwnloadFileSingle(data) {
    debugger
    if (data.cid) {
      this._globalMethodServe.downloadResume(data.cid, "")
    }
    else {
      this._globalMethodServe.DownLoadResumeAll(data?.id,data?.ProfileSourceId,0,data?.ResumePath,data?.ResumeName);
    }
  }

  /***
   * view ai rating details
   */
  openCandidateRatingDetailsModal(elm: any = {}) {
    elm['title'] =
      labelResumeRating?.modalViewResumeRatingTitle +
      ` - ${elm?.CandidateName}`;
    elm['isProfileInterview'] = 0;
    elm['id'] = elm.id;
    elm['name'] = elm?.CandidateName;
    elm['isDBFrom'] = true;
    elm['profileTypeId'] = elm?.ProfileSourceId;
    elm['profileSource'] = elm?.IsProfilesAI == 1 ? 'T' : 'O';
    const dialogRef = this.dialog.open(ViewResumeAiRatingDetailsComponent, {
      panelClass: ['ats-model-wrap', 'ats-rating-dtp-modal'],
      data: elm,
      width: '500px',
    });
  }

  screenprofilesUn(data: any) {
    this._candidateCommon
      .getResumeAssesmentById(data?.id, 'T')
      .subscribe((response) => {
        const resumeData = response?.Resumes || [];

        // Map parsed response with original files by filename
        // const mappedResumes = resumeData.map((res: any) => ({
        //   ...res,
        //   file: this.uploadedFilesMap[res.filename] || null
        // }));
        // debugger

        const ResumeData: any = {
          parsedResumes: resumeData,
          filenames: response?.Recommendation,
          profileData: {
            profileId: data?.ProfileSourceId,
            cid: data?.id,
            thid: data?.TalentID,
            talent_id: data?.TalentID,
          },
          data: this.data,
          title: '' + data?.ProfileSource + ' - ' + data?.CandidateName,
          isProfileExist: true,
        };
        this.openResumeAssesmentModal(ResumeData);
      });
  }

  openResumeAssesmentModal(data: any = {}): void {
    const dialogRef = this.dialog.open(ResumeAssesmentModalComponent, {
      //  width: '650px',
      panelClass: [
        'ats-model-wrap',
        'resume-assesment-popup',
        'ats-model-full-screen',
      ],
      data: data,
      //disableClose: true,
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        //   this.getProfileList(this.data.th_id);
      }
    });
  }

  exportCandidateListAsXLSX(): void {
    this.bodyParam['Page'] = 1;
    this.bodyParam['PageSize'] = this.paginationData?.Total;
    this._dashServe
      .getAllProfilesListByThid(this.bodyParam)
      .subscribe((res) => {
        let candidateListEXP = res['data'];
        let filterDataExcel = [];
        for (const element of candidateListEXP) {
          const selectedData = {
            'Talent ID': element?.TalentID || '-',
            'CV Submission Date': element?.CVSubmissionDate
              ? this.datepipe.transform(element.CVSubmissionDate, 'yyyy/MM/dd')
              : '-',
            'Profile Source': element?.ProfileSource || '-',
            'Source Name': element?.SourceName || '-',
            CID: element?.CID || '-',
            'Candidate Name': element?.CandidateName || '-',
            'Email ID': element?.EmailID || '-',
            'Phone No.': element?.PhoneNo || '-',
            Skill: element?.Skill || '-',
            'Total Experience': element?.TotalExp || '-',
            'Company Name': element?.CompanyName || '-',
            'Candidate Location': element?.CandidateLocation || '-',
            'Notice Period': element?.NoticePeriod || '-',
            Account: element?.Account || '-',
            'Interview Date': element?.InterviewDate
              ? this.datepipe.transform(element.InterviewDate, 'yyyy/MM/dd')
              : '-',
            'Interview Type': element?.InterviewType || '-',
            'Candidate Status': element?.CandidateStatus || '-',
            'Primary Recruiter': element?.PrimaryRecruiter || '-',
            'Secondary Recruiter': element?.SecondaryRecruiter || '-',
            'TID Dormant Status':
              element?.isTidDormant === 'D'
                ? 'DORMANT'
                : element?.isTidDormant === 'R'
                  ? 'RE-ACTIVATED'
                  : 'ACTIVE',
            'Profile Match (%)':
              element?.ProfileMatchPercent != null
                ? element.ProfileMatchPercent + '%'
                : '-',
            'Pre Screen Status': element?.PreScreenStatus || '-',
          };

          filterDataExcel.push(selectedData);
        }

        this._excelService.exportAsExcelFile(
          filterDataExcel,
          'Candidate-Profiles'
        );
      });
  }

  viewDetails(elm: any) {
    if (elm?.ProfileSourceId == 15) {
         this.openApplicantDetailsModal(elm);
    }
    else{
      this.viewDetailsPartner(elm);
    }
  }

   viewDetailsPartner(elm: any) {
      const dialogRef = this.dialog.open(ViewCandidateDetailsPartnerComponent, {
        width: '500px',
        panelClass: ['ats-model-wrap', 'view-cand-part-dt', 'ats-model-lg', 'animate__animated', 'animate__swing'],
        data: elm,
        disableClose: true
      });
    }
  openApplicantDetailsModal(element: any) {
      const dialogRef = this.dialog.open(ViewApplicantDetailsModalComponent, {
        width: '500px',
        panelClass: ['ats-model-wrap', 'view-cand-part-dt', 'ats-model-lg', 'animate__animated', 'animate__swing'],
        data: element,
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // this.openScheduleInterview(element)
        }
      });
    }

  /***
   * close
   */
  onNoClick() {
    this.dialogRef.close();
  }
}
