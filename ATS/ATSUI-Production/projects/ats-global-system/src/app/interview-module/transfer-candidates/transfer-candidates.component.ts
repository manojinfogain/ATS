import { Component, OnDestroy, OnInit } from '@angular/core';
import { CONSTANTS } from 'projects/ats-global-system/src/app/core/constant/constants';
import { InterviewStatusService } from 'projects/ats-global-system/src/app/core/services/interview-status.service';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { saveAs } from "file-saver";
import { HttpClient } from '@angular/common/http';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { TransferCandidateFormComponent } from './modal/transfer-candidate-form/transfer-candidate-form.component';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { FeedbackRoundDetailsComponent } from '../interview-feedback/modals/feedback-round-details/feedback-round-details.component';
import { ApproveTransferedCandidateComponent } from './modal/approve-transfered-candidate/approve-transfered-candidate.component';
import { RequestTransferCandidateComponent } from './modal/request-transfer-candidate/request-transfer-candidate.component';
import { Subscription } from 'rxjs';
import { AtsCommonPrefix } from 'projects/ats-global-system/src/app/core/constant/common.const';
import { CandidateCommonApiService } from 'projects/ats-global-system/src/app/core/services/candidate-common-api.service';
import { GetLocationInfo } from '../../core/common/getLocationInfo';
import { GlobalCommonMethodService } from '../../core/common/global-common-method.service';

@Component({
  selector: 'app-transfer-candidates',
  templateUrl: './transfer-candidates.component.html',
  styleUrls: ['./transfer-candidates.component.scss']
})
export class TransferCandidatesComponent implements OnInit, OnDestroy {
  displayedColumns = ['talentId', 'Cid', 'Profile', 'CandidateName', 'primarySkill', 'EmailID', 'PhoneNo', 'intDate', 'recruiter1', 'recruiter2', 'primaryInterviewer', 'InterviewType', 'RequisitionType','dormantStatus', 'CandidateStatus', 'UpdateCurrentStatus'];
  private thId: string;
  public userData: any = {};
  public searchInput: string = '';
  public sortParam: string = '';
  public paginationData: any;
  public candidateList: any = [];
  public jumpFirstPage: boolean = false;
  public sortFormFilter: UntypedFormGroup = new UntypedFormGroup({});
  public isResetSearch: boolean = false;
  public isResetFilter: boolean = false;
  public cidColName: string = AtsCommonPrefix.CidColName;
  public cidPrefix: string = AtsCommonPrefix.CidPrefix;
  private refreshSubscription: Subscription;
  public talentIdControl: UntypedFormControl = new UntypedFormControl();
  constructor(
    private _interviewStatus: InterviewStatusService,
    public dialog: MatDialog,
    private _storage: GetSetStorageService,
    private http: HttpClient,
    private _share: ShareService,
    private _fb: UntypedFormBuilder,
    private _candidateCommon: CandidateCommonApiService,
    private _globalCommonMethod: GlobalCommonMethodService
  ) {
  }

  ngOnInit() {
    this.userData = this._storage.getSetUserData();
    if (this.userData) {
      if (this.userData.RoleId === 4) {
        //  this.displayedColumns.pop();
      }
    }
    this.getCandidateListByTalentId(1, this.itemPerPage, null, null);
    this.filterFormInit();

    this.refreshSubscription = this._share.detectSwitchLoc.subscribe(
      get => {
        this.resetSortFilter();
        this.talentIdControl.patchValue('all');
        this.thId = null;
        this.getCandidateListByTalentId(1, this.itemPerPage, null, null);
      }
    )
  }


  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }
  /**
   * reset filter and search
   */
  resetSortFilter() {
    this.isResetSearch = true;
    this.isResetFilter = true;
    this.searchInput = '';
    this.sortParam = '';
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
    this.jumpFirstPage = false;
    this.jumpFirstPage = true;
    this.getCandidateListByTalentId(1, this.itemPerPage, this.searchInput, data);
  }

  /***
 * filter form Init
 */
  filterFormInit() {
    this.sortFormFilter = this._fb.group({
      candidateStatusNew: [[]],
      primarySkill: [[]],
      dateFrom: [null],
      interviewTypeIdNew: [[]],
      dateTo: [{ value: null, disabled: true }],
     practiceId: [[]],
    })
  }

  /**
   * get selected talent Id
   * @param data 
   */
  getDataTalent(data) {
    this.resetSortFilter();
    this.thId = data.TH_ID;
    this.jumpFirstPage = false;
    this.jumpFirstPage = true;
    this.getCandidateListByTalentId(1, this.itemPerPage, null, null)
  }

  /**
 * pagination method
 * @param pageEvent 
 */
  public itemPerPage: number = CONSTANTS.PAGE_SIZE;
  getPagingData(pageEvent: any) {
    if (pageEvent?.pageSize) {
      this.itemPerPage = pageEvent.pageSize;
    }
    this.getCandidateListByTalentId(pageEvent.pageIndex + 1, pageEvent.pageSize, this.searchInput ? this.searchInput : null, this.sortParam);
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
    this.getCandidateListByTalentId(1, this.itemPerPage, e, this.sortParam);
  }
  /**
   * get candidate list
   * @param page 
   * @param pageSize 
   * @param search 
   */

  public bodyParam: any = {};
  getCandidateListByTalentId(page: number, pageSize: number, search: any, sortParam: any) {
    this.bodyParam = {};
    let body = {
      page: page,
      pageSize: pageSize
    }

    if (sortParam?.dateFrom) {
      body['startDate'] = GlobalMethod.formatDate(sortParam?.dateFrom);
    }

    if (sortParam?.dateTo) {
      body['endDate'] = GlobalMethod.formatDate(sortParam?.dateTo);
    }

    if (this.thId) {
      body['thid'] = this.thId
    }
    if (search) {
      body['search'] = search;
    }
    if (sortParam?.candidateStatusNew && sortParam?.candidateStatusNew?.length !== 0) {
      let Ids = sortParam?.candidateStatusNew?.filter(n => n);
      body['intStatus'] = Ids.toString();
    }

    if (sortParam?.interviewTypeIdNew && sortParam?.interviewTypeIdNew?.length !== 0) {
      let Ids = sortParam?.interviewTypeIdNew?.filter(n => n);
      body['IntType'] = Ids.toString();
    }
    if (sortParam?.primarySkill && sortParam?.primarySkill?.length !== 0) {
      let Ids = sortParam?.primarySkill?.filter(n => n);
      body['primarySkill'] = Ids.toString();
    }
    
    if (sortParam?.practiceId && sortParam?.practiceId.length !== 0) {
      let Ids = sortParam?.practiceId.filter(n => n);
      body['practiceId'] = Ids.toString();
    }
    this.bodyParam = body;
    this._interviewStatus.transferCandidateListNew(body).subscribe(
      res => {
        this.candidateList = res['data'];
        this.paginationData = res['pagination'][0];
      }
    )
  }

  /**
   * transfer talent Id Method
   * @param element 
   */


  transferCandidateToTalent(element: any) {
    let candidateData: any = [];
    if (element?.cid) {
      //to get offer status of candidate
      this._candidateCommon.getCandidateDetailsProfile(element?.cid, null, null).subscribe(
        res => {
          candidateData = res['data'][0];
          let transferType: number = 1
          this.openModalForAttendedProfile(element, candidateData, transferType);
        });
    } else {
      this.openModalForDirectTransfer(element);
    }
  }

  // open pop up modal without condition for Direct transfer
  openModalForDirectTransfer(element: any) {
    this.jumpFirstPage = false;
    element['title'] = "Transfer to Talent ID";
    //if unattended profile
    if (element['cid'] == null) {
      element['type'] = 1;
    }
    const dialogRef = this.dialog.open(TransferCandidateFormComponent, {
      panelClass: ['ats-model-wrap', 'update-interview-feedback', 'talent-transfers',],
      data: element,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.jumpFirstPage = true;
        this.getCandidateListByTalentId(1, this.itemPerPage, this.searchInput, this.sortParam);
      }
    });
  }

  // open pop up modal with condition for direct and requested transfer (tranType= 1-Direct & 2 for requested)
  openModalForAttendedProfile(element: any, candidateData: any, tranType: number) {
    if (candidateData?.offerStatusId == 20 ||
      candidateData?.offerStatusId == 30 ||
      candidateData?.offerStatusId == 40 ||
      candidateData?.offerStatusId == 50 ||
      candidateData?.offerStatusId == 60 ||
      candidateData?.offerStatusId == 70 ||
      candidateData?.offerStatusId == 80 ||
      candidateData?.offerStatusId == 90) {
      this._share.showAlertErrorMessage.next('You can not transfer candidate during Offer Process.');
    } else if (candidateData?.offerStatusId == 200) {
      this._share.showAlertErrorMessage.next('You can not transfer candidate after Candidate Joined.');
    }
    else {
      if (tranType == 1) {
        this.openModalForDirectTransfer(element);
      } else {
        this.openModalForTransferRequest(element);
      }
    }
  }

  // open pop up modal without condition for requested transfer
  openModalForTransferRequest(element: any) {
    this.jumpFirstPage = false;
    element['title'] = "Request for Transfer Candidate";

    //if unattended profile
    if (element['cid'] == null) {
      element['type'] = 1;
    }

    const dialogRef = this.dialog.open(RequestTransferCandidateComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'ats-model-full-screenss', 'request-transfers-candidate',],
      data: element,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.jumpFirstPage = true;
        this.getCandidateListByTalentId(1, this.itemPerPage, this.searchInput, this.sortParam);
      }
    });
  }

  //request to transfer candidate
  requestTransferCandidate(element: any) {
    let candidateData: any = [];
    if (element?.cid != null) {
      //to get offer status of candidate
      this._candidateCommon.getCandidateDetailsProfile(element?.cid, null, null).subscribe(
        res => {
          candidateData = res['data'][0];
          let transferType: number = 2
          this.openModalForAttendedProfile(element, candidateData, transferType);
        });
    } else {
      this.openModalForTransferRequest(element);
    }
  }

  //request to transfer candidate
  approveTransferedCandidate(element: any) {
    this.jumpFirstPage = false;
    element['title'] = "Approve Transfer Candidate Request";
    //if unattended profile
    if (element['cid'] == null) {
      element['type'] = 1;
    }
    const dialogRef = this.dialog.open(ApproveTransferedCandidateComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'ats-model-full-screenss', 'request-transfers-candidate',],
      data: element,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.jumpFirstPage = true;
        this.getCandidateListByTalentId(1, this.itemPerPage, this.searchInput, this.sortParam);
      }
    });
  }



  downloadPDF(elm: any) {
    let today = new Date();
    let todayDate = GlobalMethod.formatDate(today);
    this.http.get(`${environment.apiMainUrlNet}Interview/InterviewFeedbackpdf?cid=${elm.cid}`, { responseType: 'blob' }).subscribe(
      res => {
        saveAs(res, 'interview feedback (' + elm?.Name + ') ' + elm?.talent_id + '.pdf');
        this._share.showAlertSuccessMessage.next('Interview Feedback downloaded successfully.')
      }
    )
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

  /***
   * approved button show method
   */
  approveShowActionBtn(elm: any) {

    if (elm?.transferStatus == 'P' &&
      elm?.ProfileSourceId != 5 &&
      (
        elm?.primaryrecruiter == this.userData?.EmpNewId ||
        elm?.secondaryrecruiter == this.userData?.EmpNewId ||
        this.userData?.RoleId == 5 || this.userData?.RoleId == 10
      )) {
      return true

    }

    else {
      return false
    }

  }

  transferButtonEnable(element: any) {
    if (
      element?.transferStatus != 'P' &&
      element?.ProfileSourceId != 5 &&
      (element?.IsPrimSecRecActive === 0 ||
        element?.statusid === 5 ||
        element?.primaryrecruiter == this.userData?.EmpNewId ||
        element?.secondaryrecruiter == this.userData?.EmpNewId
      )
    ) {
      return true
    }
    else {
      return false
    }
  }

  /***
   * sent request button show/hide
   */
  approvalSentShowActionBtn(elm: any) {
    if (elm?.cid != null &&
      elm?.dateDiffInDays > 5 &&
      elm?.statusid != 5 &&
      elm?.transferStatus != 'P' &&
      elm?.IsPrimSecRecActive != 0 &&
      elm?.primaryrecruiter != this.userData?.EmpNewId &&
      elm?.ProfileSourceId != 5 &&
      elm?.secondaryrecruiter != this.userData?.EmpNewId
    ) {
      return true
    }
    else {
      return false
    }
  }


  /***
   * sent request button show/hide for unttended profile
   */
  reqSendBtnUnattended(elm: any) {
    if (elm?.cid == null &&
      elm?.transferStatus != 'P' &&
      elm?.IsPrimSecRecActive != 0 &&
      elm?.primaryrecruiter != this.userData?.EmpNewId &&
      elm?.ProfileSourceId != 5 &&
      elm?.secondaryrecruiter != this.userData?.EmpNewId
    ) {
      return true
    }
    else {
      return false
    }
  }

  /***
  * download resume 
  */
  dwnloadFileSingle(data) {
    if (data?.ProfileId == 3) {
      this._globalCommonMethod.downloadFileCskill(data?.resume_path, data?.c_resume);
    }
    else {
      this._globalCommonMethod.downloadFileCommon(data?.resume_path, data?.c_resume);
    }
    
  }

}
