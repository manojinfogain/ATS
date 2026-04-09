import { Component, OnInit } from '@angular/core';
import { InterviewCommonService } from 'projects/ats-global-system/src/app/core/services/interview-common.service';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { InterviewFeedbackStatusComponent } from '../interview-feedback/modals/interview-feedback-status/interview-feedback-status.component';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { FeedbackRoundDetailsComponent } from '../interview-feedback/modals/feedback-round-details/feedback-round-details.component';
import { GlobalCommonMethodService } from 'projects/ats-global-system/src/app/core/common/global-common-method.service';
import { Router } from '@angular/router';
import { AssignCandidateTalentidComponent } from 'projects/ats-global-system/src/app/dashboard-module/modal/assign-candidate-talentid/assign-candidate-talentid.component';
import { JdPanelConfirmationModalComponent } from '../modals/jd-panel-confirmation-modal/jd-panel-confirmation-modal.component';
import { ScreenRejectModalComponent } from 'projects/ats-global-system/src/app/dashboard-module/modal/screen-reject-modal/screen-reject-modal.component';
import { AtsCommonPrefix, COMMON_CONST, labelResumeRating } from 'projects/ats-global-system/src/app/core/constant/common.const';
import { ScreenRejectModalGlobalComponent } from 'projects/ats-global-system/src/app/common-sharing/modals/screen-reject-modal-global/screen-reject-modal-global.component';
import { ScheduleInterviewComponent } from 'projects/ats-global-system/src/app/dashboard-module/modal/schedule-interview/schedule-interview.component';
import { CandidateCommonApiService } from 'projects/ats-global-system/src/app/core/services/candidate-common-api.service';
import { ShareService } from '../../core/services/share.service';
import { HttpClient } from '@angular/common/http';
import { saveAs } from "file-saver";
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { CandidateDetailsModalComponent } from '../interview-feedback/modals/candidate-details-modal/candidate-details-modal.component';
import { ViewResumeAiRatingDetailsComponent } from '../../common-sharing/modals/view-resume-ai-rating-details/view-resume-ai-rating-details.component';
@Component({
  selector: 'app-candidate-search-int',
  templateUrl: './candidate-search-int.component.html',
  styleUrls: ['./candidate-search-int.component.scss']
})
export class CandidateSearchIntComponent implements OnInit {
  displayedColumns = ['talentId', 'cid', 'ProfileSource', 'SourceName', 'CandidateName', 'EmailID', 'SkillName', 'accountName', 'projectName', 'totalExp', 'mobNumber', 'intDate','dormantStatus', 'CandidateStatus', 'rejectReason', 'dropReason', 'primatRec', 'secReq', 'hiringManager', 'requisitionType', 'np',
  'TrLocation','InterviewTypeName','CvSubmissionDate', 'organization','Rating', 'action'];
  public statusList: any = [];
  public candidateList: any = [];
  public paginationData: any;
  public jumpFirstPage: boolean = false;
  public filteredData: any = {};
  public pageSize: number = 20;
  public pageSizeOption: any = [20, 30, 50, 100];
  public userData: any = {};
  public cidColName: string = AtsCommonPrefix.CidColName;
  public cidPrefix: string = AtsCommonPrefix.CidPrefix;
  public labelResumeRating:any = labelResumeRating;
  constructor(
    private _intCommonServe: InterviewCommonService,
    private _storage: GetSetStorageService,
    public dialog: MatDialog,
    private _globalMethodServe: GlobalCommonMethodService,
    private router: Router,
    private _candidateCommon: CandidateCommonApiService,
    private http: HttpClient,
    private _share: ShareService,
    // private _excelService: ExcelService,
  ) { }

  ngOnInit(): void {
    //this.GetInterviewStatus();
    this.userData = this._storage.getSetUserData();
    this.filteredData['pageNo'] = 1;
    this.filteredData['pageSize'] = this.pageSize;
    //this.getCandidateListByOption(this.filteredData);
   // this.openCandidateRatingDetailsModal()
  }

  ngAfterViewInit() {

  }


  /***
   * get Int Status
   */
  /***
    * get Int Status
    */
  GetInterviewStatus(): void {
    this._intCommonServe.getIntStatusList().subscribe(
      res => {
        this.statusList = res;
      }
    );
  }
  /***
   * get Candidate Lsit Method
   */
  getCandidateListByOption(data: any) {
    this._intCommonServe.getAllcandidateSearchByOption(data).subscribe(
      res => {
        this.candidateList = res['data']
        this.paginationData = res['Paging'][0];
      }
    )
  }


  /***
   * get Sort Data
   */
  getSortData(data: any) {
    this.filteredData = data;
    this.filteredData['pageNo'] = 1;
    this.filteredData['pageSize'] = this.pageSize;
    this.getCandidateListByOption(this.filteredData);
  }

  /**
* pagination method
* @param pageEvent 
*/
  getPagingData(pageEvent: any) {
    this.filteredData['pageNo'] = pageEvent.pageIndex + 1;
    this.filteredData['pageSize'] = pageEvent.pageSize;
    this.getCandidateListByOption(this.filteredData);

  }

  /***
* download  excel
*/
  downloadAsExel() {
    let bodyData = {
      ...this.filteredData,
      page: 1,
      pageSize: this.paginationData?.Total,
    }
    let _apiUrl: string = 'Interview/ExportToExcelSearchCandidate';
    this.http.post(`${environment.apiMainUrlNet}${_apiUrl}`, bodyData, { responseType: 'blob' }).subscribe(
      res => {
        saveAs(res, 'Candidate_Records.xls');
      },
      (error) => {
        this._share.showAlertErrorMessage.next('Something went wrong');
      }
    )
  }

  /***
   * interview Shcedule method
   */
  openModalForUpdateFeedback(data: any): void {
    this._intCommonServe.getJDPanelAvailableDetails(data?.thid).subscribe(
      res => {
        let dataJd = res['data'][0];
        if (dataJd.JDAvailable == 'Y' && dataJd.PanelAvailable == 'Y') {
          this.intSchfeedbackfunc(data);
        }
        else {
          //redirecting to jd and panel confirmation page
          data['th_id'] = data.TalentID;
          this.openConfirmationModal(data, 1)
        }
      }
    )
  }

  openConfirmationModal(element: any, type?: number) {
    const dialogRef = this.dialog.open(JdPanelConfirmationModalComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'ats-model-full-screenss', 'request-transfers-candidate',],
      data: element,
      disableClose: true,

    });
    //after popup close, selected page will open
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (type === 1) {
          this.intSchfeedbackfunc(element);
        }
        else {
          this.openScheduleIntScreen(element);
        }
      }
    });
  }
  /***
    * interview Shcedule method
    */
  intSchfeedbackfunc(data: any) {
    const dialogRef = this.dialog.open(InterviewFeedbackStatusComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'update-interview-feedback'],
      data: data,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.jumpFirstPage = false;
        // this.jumpFirstPage = true;
        this.getCandidateListByOption(this.filteredData);
      }
    });
  }

  /**
  * show interview round details
  * @param data 
  */
  openfeedbackInfoModal(data: any) {
    const dialogRef = this.dialog.open(FeedbackRoundDetailsComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'update-interview-feedback'],
      data: data,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }


  scheduleInterview(data: any) {
    this._intCommonServe.getJDPanelAvailableDetails(data?.thid).subscribe(
      res => {
        let dataJd = res['data'][0];
        if (dataJd.JDAvailable == 'Y' && dataJd.PanelAvailable == 'Y') {
          this.openScheduleIntScreen(data);
        }
        else {
          //redirecting to jd and panel confirmation page
          data['th_id'] = data.thid;
          this.openConfirmationModal(data, 2)
        }
      }
    )

  }
  /**code for interview all method */
  // openScheduleModalcodeMethod(elm:any){ 
  // }

  //interview schedule 
  openScheduleIntScreen(elm: any) {
    /**get candidate personal details specific api */
    let candidateData: any = [];
    this._candidateCommon.getCandidateDetailsProfile(null, elm?.id, elm?.SourceID).subscribe(
      res => {
        candidateData = res['data'][0];
        // elm['dob'] = candidateData?.dob
        // this.openScheduleModalcodeMethod(elm);     
        let data = {
          candidate: {
            appliedid: elm?.appliedID,
            profileid: elm?.SourceID,
            talentId: elm?.TalentID,
            thId: elm?.thid,
            addExist: true,
            name: elm.Name,
            firstName: candidateData.FirstName,
            middleName:  candidateData.MiddleName,
            lastName: candidateData.LastName,
            mobile: elm.mobileNumber,
            email: elm.Email,
            totalExp: elm?.TotalExpYear ? elm?.TotalExpYear : (candidateData?.totalExp ? candidateData?.totalExp : null),
            totalExpMonth: elm?.TotalExpMonth ? elm?.TotalExpMonth : (candidateData?.totalExpMonth ? candidateData?.totalExpMonth : null),
            releventExp: elm.relExp ? elm.relExp : (candidateData?.releventExp ? candidateData?.releventExp : null),
            releventExpMonth: elm?.releventExpInMonth ? elm?.releventExpInMonth : (candidateData?.releventExpMonth ? candidateData?.releventExpMonth : null),
            c_profileUniqId: elm.id,
            dob: candidateData?.dob ? candidateData?.dob : null,
            //
            country: candidateData.CountryID ? candidateData.CountryID : null,
            cityId: candidateData.CityID ? candidateData.CityID : null,
            primarySkill: candidateData.Skillid ? candidateData.Skillid : null,
            candidateType: candidateData.contractID ? candidateData.contractID : null,
            genderId: candidateData?.GenderId ? candidateData?.GenderId : null,
            education: candidateData.eduQualificationId ? candidateData.eduQualificationId : null,
            currCompany: candidateData.currentCompanyId ? candidateData.currentCompanyId : null,
            currencyType: candidateData.currency_type ? candidateData.currency_type : null,
            currentCtc: candidateData.current_ctc ? candidateData.current_ctc : (candidateData.currentSalary ? candidateData.currentSalary : null),
            expCtc: candidateData.expected_ctc ? candidateData.expected_ctc : null,
            SalaryType: candidateData.SalaryType ? candidateData.SalaryType : null,
            ApplicantUid: elm?.ApplicantUid ? elm?.ApplicantUid : null,
            IsFromNaukriAPI: elm?.IsFromNaukriAPI ? elm?.IsFromNaukriAPI : 'N',
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
            this.getCandidateListByOption(this.filteredData);
          }
        });
      })
    /**ends */
  }

  assignToTalenId(element) {
    element['transferType'] = "unmap";
    element['title'] = "Map to Talent ID";
    element['profileid'] = element?.SourceID;
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
        this.getCandidateListByOption(this.filteredData);
      }
    });
  }

  //new screen reject modal
  screenRejectMethod(elm: any) {
    if (elm?.isScreenRejected === 1) {
      elm['title'] = ` Are you sure you want to Activate ${elm?.Name}?`;
      elm['profileId'] = elm?.SourceID;
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
          this.getCandidateListByOption(this.filteredData);
        }
        else {
        }
      });
    }
    else {
      elm['title'] = `Screen Reject - ${elm?.Name}`;
      elm['profileId'] = elm?.SourceID;
      elm['pId'] = elm?.id;
      elm['name'] = elm?.Name;
      elm['email'] = elm?.Email;
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
          this.getCandidateListByOption(this.filteredData);
        }
        else {
        }
      });
    }
  }

  /***
  * download resume 
  */
  dwnloadFileSingle(data) {
    if (data?.SourceID == 3) {
      this._globalMethodServe.downloadFileCskill(data?.resume_path, data?.resume);
    }
    else {
      this._globalMethodServe.downloadFileCommon(data?.resume_path, data?.resume);
    }
   
  }
 /***
  * view ai rating details
  */
   openCandidateRatingDetailsModal(elm: any ={}) {
      elm['title'] = labelResumeRating?.modalViewResumeRatingTitle + ' - ' + elm?.Name;
      elm['isProfileInterview'] = elm?.cid?1:0;
      elm['id'] = elm?.cid ? elm?.cid : (elm?.appliedID ? elm?.appliedID : elm?.id);
      elm['isDBFrom'] = true;
        elm['profileTypeId'] = elm?.SourceID;
      const dialogRef = this.dialog.open(ViewResumeAiRatingDetailsComponent, {
        panelClass: ['ats-model-wrap', 'ats-rating-dtp-modal'],
        data: elm,
        width: '500px'
      });
    }

}
