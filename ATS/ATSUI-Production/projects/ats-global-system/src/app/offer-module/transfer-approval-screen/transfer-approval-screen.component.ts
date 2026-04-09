import { Component, OnInit, ViewChild } from '@angular/core';
import { CONSTANTS } from 'projects/ats-global-system/src/app/core/constant/constants';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { FeedbackRoundDetailsComponent } from 'projects/ats-global-system/src/app/interview-module/interview-feedback/modals/feedback-round-details/feedback-round-details.component';
import { OfferService } from '../offer.service';
import { ApprovalActionModalComponent } from '../modals/approval-action-modal/approval-action-modal.component';
import { ViewOfferApprovalDetailsComponent } from '../modals/view-offer-approval-details/view-offer-approval-details.component';
import { AtsCommonPrefix, SPECIALACCESSUSER } from 'projects/ats-global-system/src/app/core/constant/common.const';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { saveAs } from "file-saver";
import { GlobalCommonMethodService } from '../../core/common/global-common-method.service';
import { Subscription } from 'rxjs';
import { GetLocationInfo } from '../../core/common/getLocationInfo';

@Component({
  selector: 'app-transfer-approval-screen',
  templateUrl: './transfer-approval-screen.component.html',
  styleUrls: ['./transfer-approval-screen.component.scss']
})
export class TransferApprovalScreenComponent implements OnInit {
  displayedColumns = ['talentId', 'Cid', 'CandidateName', 'primarySkill', 'EmailID', 'PhoneNo', 'recruiter',
    'approveStatus', 'action'];
  private thId: string;
  public userData: any = {};
  public searchInput: string = '';
  public sortParam: string = '';
  public paginationData: any;
  public candidateList: any = [];
  public sortFormFilter: UntypedFormGroup = new UntypedFormGroup({});
  public isResetSearch: boolean = false;
  public isResetFilter: boolean = false;
  public cidColName: string = AtsCommonPrefix.CidColName;
  public cidPrefix: string = AtsCommonPrefix.CidPrefix;
  public isVisibleForIndia: boolean = false;
  public isVisibleForUS: boolean = false;
  public isTransEnableForIndia: boolean = false;
  public isTransEnableForUS: boolean = false;
  private refreshSubscription: Subscription;
  /** Paginator Reference */
  @ViewChild('paginatorRef', { static: true }) paginatorCompRef;
  constructor(
    public dialog: MatDialog,
    private _storage: GetSetStorageService,
    private _fb: UntypedFormBuilder,
    private _offerServe: OfferService,
    private _share: ShareService,
    private _http: HttpClient,
    private _globalCommonMethod: GlobalCommonMethodService,
    private getLocInfo: GetLocationInfo
  ) {
  }
  public specialLogin: boolean = false;
  public talentIdControl: UntypedFormControl = new UntypedFormControl();
  ngOnInit() {
    this.showHideLocWise();
    this.userData = this._storage.getSetUserData();
    let empId = this._storage.getUserEmpId();
    let isUserValid = SPECIALACCESSUSER.offerAccesRight.filter(r => r.empId === parseInt(empId));
    if (isUserValid.length !== 0) {
      this.specialLogin = true;
    }
    else {
      this.specialLogin = false;
    }

    if (this.userData) {
      if (this.userData.RoleId === 0 && this.userData?.otherRoles?.IsApprover === 'Y' || this.userData.RoleId === 4 && this.userData?.otherRoles?.IsApprover === 'Y') {
        this.displayedColumns = ['talentId', 'Cid', 'CandidateName', 'accountName', 'projectName', 'recruiter', 'primarySkill',
          'offerDate', 'joiningDate',
          'isTidReopened', 'approveStatus', 'dropReason', 'action'];
      }
      else {
        this.displayedColumns = ['talentId', 'Cid', 'CandidateName', 'EmailID', 'PhoneNo', 'recruiter', 'prmRecruiter', 'primarySkill',
          'offerDate', 'joiningDate',
          'isTidReopened', 'approveStatus', 'dropReason', 'action'];
      }
    }
    this.sortParam = '&intStatus=4'
    this.filterFormInit();
    this.refreshSubscription = this._share.detectSwitchLoc.subscribe(
      get => {
        this.resetSortFilter();
        this.talentIdControl.patchValue('all');
        this.thId = null;
        this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, null, null);
        this.showHideLocWise();
      }
    )


  }

  showHideLocWise() {
    if (this.getLocInfo.isLocationIndia()) {
      this.isTransEnableForIndia = true;
      this.isTransEnableForUS = false;
      this.isVisibleForIndia = true;
    } else if (this.getLocInfo.isLocationUS()) {
      this.isVisibleForIndia = false;
      this.isTransEnableForIndia = false;
      this.isTransEnableForUS = false;
    }
    else {
      this.isVisibleForIndia = false;
      this.isTransEnableForIndia = false;
      this.isTransEnableForUS = false;
    }
  }

  ngAfterViewInit() {
    this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, null, { startDate: null });
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
    this.paginatorCompRef.paginator.pageIndex = 0;
    this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, this.searchInput, data);
  }


  /**
   * get selected talent Id
   * @param data 
   */
  getDataTalent(data) {
    this.resetSortFilter();
    this.thId = data.TH_ID;
    this.paginatorCompRef.paginator.pageIndex = 0;
    this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, this.searchInput, this.sortParam)
  }

  /**
 * pagination method
 * @param pageEvent 
 */
  getPagingData(pageEvent: any) {
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
    this.paginatorCompRef.paginator.pageIndex = 0;
    this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, e, this.sortParam);
  }
  /**
   * get candidate list
   * @param page 
   * @param pageSize 
   * @param search 
   */

  /***
 * filter form Init
 */
  filterFormInit() {
    this.sortFormFilter = this._fb.group({
      offerstatus: [[]],
      primarySkill: [[]],
      pendingWithMe: [null],
      dateFrom: [null],
      dateTo: [{ value: null, disabled: true }],
      dateStart: [null],
      dateEnd: [{ value: null, disabled: true }],
      recruiterId: [[]],
      subListType: [[]],
      practiceId: [[]],
    })
  }


  public bodyParam: any = {};
  getCandidateListByTalentId(page: number, pageSize: number, search: any, sortParam: any) {
    // let queryString = `${this.thId?'thid='+this.thId+'&':''}page=${page}&pageSize=${pageSize}&search=${search ? search.trim():''}${sortParam?sortParam:''}`;
    this.bodyParam = {};
    let body = {
      page: page,
      pageSize: pageSize
    }
    if (sortParam?.dateFrom) {
      body['startDate'] = GlobalMethod.formatDate(sortParam?.dateFrom);
    }
    if (sortParam?.pendingWithMe == true) {
      body['pendingWithMe'] = '1';
    }
    if (sortParam?.dateTo) {
      body['endDate'] = GlobalMethod.formatDate(sortParam?.dateTo);
    }

    //
    if (sortParam?.dateStart) {
      body['startDate2'] = GlobalMethod.formatDate(sortParam?.dateStart);
    }

    if (sortParam?.dateEnd) {
      body['endDate2'] = GlobalMethod.formatDate(sortParam?.dateEnd);
    }
    if (this.thId) {
      body['thid'] = this.thId
    }
    if (search) {
      body['search'] = search;
    }
    if (sortParam?.offerstatus && sortParam?.offerstatus.length !== 0) {
      let offerstatusIds = sortParam.offerstatus.filter(n => n);
      body['offerStatus'] = offerstatusIds.toString();
    }
    if (sortParam?.recruiterId && sortParam?.recruiterId.length !== 0) {
      let recIds = sortParam.recruiterId.filter(n => n);
      body['recruiterId'] = recIds.toString();
    }

    if (sortParam?.primarySkill && sortParam?.primarySkill.length !== 0) {
      let Ids = sortParam.primarySkill.filter(n => n);
      body['primarySkill'] = Ids.toString();
    }

    //sub status
    if (sortParam?.subListType && sortParam?.subListType.length !== 0) {
      let offerstatusIds = sortParam.subListType.filter(n => n);
      body['dropResonId'] = offerstatusIds.toString();
    }
    if (sortParam?.practiceId && sortParam?.practiceId.length !== 0) {
      let Ids = sortParam?.practiceId.filter(n => n);
      body['practiceId'] = Ids.toString();
    }
    this.bodyParam = body;
    const locId = this._globalCommonMethod.getSetLocation().locId;
    
    if (this.getLocInfo?.isLocationUS()) {
      this._offerServe.getSelectedCandidateListForUS(body).subscribe(
        res => {
          this.candidateList = res['data'];
          this.paginationData = res['pagination'][0];
        }
      );
    }
    else {
      this._offerServe.getReopenedCandidateList(body).subscribe(
        res => {
          this.candidateList = res['data'];
          this.paginationData = res['pagination'][0];
        }
      );
    }
  }
  /***
   * action by approver
   */
  approvalAction(elm: any) {
    elm['title'] = 'Transfer Request Approval';
    const dialogRef = this.dialog.open(ApprovalActionModalComponent, {
      panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
      data: elm,
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%'
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.paginatorCompRef.paginator.pageIndex = 0;
          this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, null, this.sortParam);
        }
      }
    )
  }
  /***
   * view offer/approval Details
   */

  openofferApprovalDetailsModal(elm: any) {
    elm['title'] = 'View Offer / Approver Details';
    const dialogRef = this.dialog.open(ViewOfferApprovalDetailsComponent, {
      panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
      data: elm,
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%'
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

  //export offer generation report in  excel
  exportAsXLSX() {
    let bodyData = {
      ...this.bodyParam,
      page: 1,
      pageSize: this.paginationData?.Total,
    }
    this._http.post(`${environment.apiMainUrlNet}Offer/ExportToExcelSelectedCandidatesList`, bodyData, { responseType: 'blob' }).subscribe(
      res => {
        saveAs(res, 'Candidate_Records.xls');
      },
      (error) => {
        this._share.showAlertErrorMessage.next('Something went wrong');
      }
    )
  }

  /***
   * Credentials SendTo Candidate
   */
  public candiData: any = {};

}

