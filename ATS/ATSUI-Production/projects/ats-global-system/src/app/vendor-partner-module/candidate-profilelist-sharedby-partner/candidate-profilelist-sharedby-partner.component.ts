import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { ExcelService } from 'projects/ats-global-system/src/app/core/common/excel.service';
import { GlobalCommonMethodService } from 'projects/ats-global-system/src/app/core/common/global-common-method.service';
import { CONSTANTS } from 'projects/ats-global-system/src/app/core/constant/constants';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { UserActiveDeactiveComponent } from '../modals/user-active-deactive/user-active-deactive.component';
import { ViewCandidateDetailsPartnerComponent } from '../modals/view-candidate-details-partner/view-candidate-details-partner.component';
import { PartnerService } from '../partner.service';
import { saveAs } from "file-saver";
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { ApproveRequestPartnerProfilesTransferComponent } from './modal/approve-request-partner-profiles-transfer/approve-request-partner-profiles-transfer.component';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { ScreenRejectModalComponent } from 'projects/ats-global-system/src/app/dashboard-module/modal/screen-reject-modal/screen-reject-modal.component';
import { AtsCommonPrefix } from 'projects/ats-global-system/src/app/core/constant/common.const';
import { ScreenRejectModalGlobalComponent } from 'projects/ats-global-system/src/app/common-sharing/modals/screen-reject-modal-global/screen-reject-modal-global.component';
// import { TransferCandidateModalComponent } from './modal/transfer-candidate-modal/transfer-candidate-modal.component';
import { Subscription } from 'rxjs';
import { GetLocationInfo } from '../../core/common/getLocationInfo';
import { TransferProfileSourceModalComponent } from './modal/transfer-profile-source-modal/transfer-profile-source-modal.component';
import { CandidateCommonApiService } from '../../core/services/candidate-common-api.service';
import { PartnerProfilesDirectTransferModalComponent } from './modal/partner-profiles-direct-transfer-modal/partner-profiles-direct-transfer-modal.component';
import { ApproveTransferRequestByRecruiterModalComponent } from './modal/approve-transfer-request-by-recruiter-modal/approve-transfer-request-by-recruiter-modal.component';
import { PartnerProfilesReqTransferModalComponent } from './modal/partner-profiles-req-transfer-modal/partner-profiles-req-transfer-modal.component';
import { TransferCandidateModalComponent } from './modal/transfer-candidate-modal/transfer-candidate-modal.component';
@Component({
  selector: 'app-candidate-profilelist-sharedby-partner',
  templateUrl: './candidate-profilelist-sharedby-partner.component.html',
  styleUrls: ['./candidate-profilelist-sharedby-partner.component.scss'],
  providers: [DatePipe]
})
export class CandidateProfilelistSharedbyPartnerComponent implements OnInit {


  displayedColumns = ['talent_id', 'Cid', 'candidateName', 'candidateEmail', 'contractName', 'partnerName','primaryRecruiter','secondaryRecruiter', 'totalExp', 'primaryskill',
  'account', 'Practice', 'eduQualifi', 'location', 'status','dormantStatus','isActive', 'screenRejReason', 'InterviewType','actionbyPartner', 'action'];
  public userData: any = {};
  public searchInput: string = '';
  public paginationData: any;
  public candidateList: any = [];
  public jumpFirstPage: boolean = false;
  public isResetSearch: boolean = false;
  public isResetFilter: boolean = false;
  public sortParam: string = '';
  public ardata = '';
  //public valuesLocl = JSON.parse(localStorage.getItem("userTokenEmp"));
  public sortFormFilter: UntypedFormGroup = new UntypedFormGroup({});
  @ViewChild(MatSort) sort: MatSort;
  public sortTable: string = '';
  /** Paginator Reference */
  @ViewChild('paginatorRef', { static: true }) paginatorCompRef;
  public statusData: any = CONSTANTS.statusCan;
  public defaultSortTable: string = '&sortColumn=modifiedOn&sortDir=desc'
  public contractIdProfiles: any = [1, 3, 8];
  public cidColName: string = AtsCommonPrefix.CidColName;
  public cidPrefix: string = AtsCommonPrefix.CidPrefix;
  private refreshSubscription: Subscription = new Subscription();
  constructor(
    public dialog: MatDialog,
    private _storage: GetSetStorageService,
    private _partnerserve: PartnerService,
    private _fb: UntypedFormBuilder,
    private _excelService: ExcelService,
    public datepipe: DatePipe,
    private http: HttpClient,
    private _share: ShareService,
    private getLocInfo: GetLocationInfo,
    private _candidateCommon: CandidateCommonApiService,

  ) { }

  ngOnInit() {
    this.filterFormInit();
  }


  // location wise check
  public isLocationUS: boolean = false;
  public isLocationIndia: boolean = false;
  showHideLocWise() {
   if (this.getLocInfo.isLocationIndia()) {
     this.isLocationIndia = true;
     this.isLocationUS = false;
   } else if (this.getLocInfo.isLocationUS()) {
     this.isLocationIndia = false;
     this.isLocationUS = true;
   }
    this.sortTable = '';
    this.sortParam = '&startDate=' + this.getPastdate();
   this.getCandidateList(1, CONSTANTS.PAGE_SIZE, null, { startDate: null }, this.sortTable);

 }

  ngAfterViewInit() {
    //this.getCandidateList(1, CONSTANTS.PAGE_SIZE, null, null, this.defaultSortTable);

    this.showHideLocWise();
    this.userData = this._storage.getSetUserData();
    this.refreshSubscription = this._share.detectSwitchLoc.subscribe(
      get => {
        this.showHideLocWise();
      }
    )

  }

  getPastdate() {
    let currentDate = new Date();
    // let pastDate = new Date(currentDate);
    /**
     * 8 days before
     */
    // pastDate.setDate(pastDate.getDate() - 7);
    let firstDayMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    let dateParse = GlobalMethod.formatDate(firstDayMonth);
    return dateParse;
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
    this.getCandidateList(1, CONSTANTS.PAGE_SIZE, this.searchInput, this.sortParam, this.sortTable);
  }

  /***
  * reset paging
  */
  resetPagination() {
    this.paginatorCompRef.paginator.pageIndex = 0;
  }


  /**
   * reset filter and search
   */
  resetSortFilter() {
    this.isResetSearch = true;
    this.isResetFilter = true;
    this.searchInput = '';
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
    this.getCandidateList(1, CONSTANTS.PAGE_SIZE, this.searchInput, data, '');

  }


  /**
 * pagination method
 * @param pageEvent
 */
  getPagingData(pageEvent: PageEvent) {
    this.getCandidateList(pageEvent.pageIndex + 1, pageEvent.pageSize, this.searchInput ? this.searchInput : null, this.sortParam, this.sortTable);
  }

  /***
   * search
   */
  getSearchValueKey(e: any) {
    // this.isResetFilter = true;
    this.isResetSearch = false;
    // this.sortParam = '';
    this.searchInput = e;
    this.jumpFirstPage = false;
    this.jumpFirstPage = true;
    this.getCandidateList(1, CONSTANTS.PAGE_SIZE, e, this.sortParam, this.sortTable);
  }

  /***
* filter form Init
*/
  filterFormInit() {
    this.sortFormFilter = this._fb.group({
      PartnerID: [[]],
      primarySkill: [[]],
      ContractType: [[]],
      practiceId: [[]],
      accountType: [[]],
      recruiterId: [[]],
      dateFrom: [null],
      dateTo: [{ value: null, disabled: true }]
    })
  }
  public bodyParam: any = {};
  getCandidateList(page: number, pageSize: number, search: any, sortParam: any, sortTable: string) {
    //  let queryString = `page=${page}&pageSize=${pageSize}&search=${search ? search.trim() : ''}${sortParam ? sortParam : ''}${sortTable ? sortTable : ''}`;
    this.bodyParam = {};
    let body = {
      page: page,
      pageSize: pageSize,
      // startDate: sortParam.startDate
    }

    if (sortParam?.dateFrom) {
      body['startDate'] = GlobalMethod.formatDate(sortParam?.dateFrom);
    }
    // if (sortParam?.dateFrom == null) {
    //   body['startDate'] = this.getPastdate();
    // }
    if (sortParam?.dateTo) {
      body['endDate'] = GlobalMethod.formatDate(sortParam?.dateTo);
    }
    if (search) {
      body['search'] = search;
    }
    if (sortParam.primarySkill && sortParam.primarySkill.length !== 0) {
      let Ids = sortParam.primarySkill.filter(n => n);
      body['primarySkill'] = Ids.toString();
    }

    if (sortParam.ContractType && sortParam.ContractType.length !== 0) {
      let Ids = sortParam.ContractType.filter(n => n);
      body['ContractType'] = Ids.toString();
    }
    if (sortParam.PartnerID && sortParam.PartnerID.length !== 0) {
      let Ids = sortParam.PartnerID.filter(n => n);
      body['PartnerID'] = Ids.toString();
    }

    if (sortParam.practiceId && sortParam.practiceId.length !== 0) {
      let Ids = sortParam.practiceId.filter(n => n);
      body['practiceId'] = Ids.toString();
    }

     if (sortParam.recruiterId && sortParam.recruiterId.length !== 0) {
      let recIds = sortParam.recruiterId.filter(n => n);
      body['recruiterId'] = recIds.toString();
    }

    if (sortParam.accountType && sortParam.accountType.length !== 0) {
      let Ids = sortParam.accountType.filter(n => n);
      body['accountId'] = Ids.toString();
    }

    this.bodyParam = body;

    this._partnerserve.getCandidateProfilelistSharedByPartner(body).subscribe(
      res => {
        this.candidateList = new MatTableDataSource(res['data']);
        this.paginationData = res['pagination'][0];
        this.candidateList.sort = this.sort;

      }
    )
  }

  /***
  * approved button show method
  */
  approveShowActionBtn(elm: any) {
    if (elm?.transferStatus == 'P' &&
      elm?.Requestedby == 'V' &&
      (
        elm?.primaryrecruiter == this.userData?.EmpNewId ||
        elm?.secondaryrecruiter == this.userData?.EmpNewId ||
        this.userData?.RoleId == 5 ||
        this.userData?.otherRoles?.IsAdminProfileTransfer == 'Y'
      )) {
      return true
    }
    else {
      return false
    }
  }

  /***
 *  show recruiter transfer button
 */
  showTransferActionBtnForRecruit(elm: any) {
    if (elm?.cid == null &&
      (
        elm?.primaryrecruiter == this.userData?.EmpNewId ||
        elm?.secondaryrecruiter == this.userData?.EmpNewId
        // this.userData?.RoleId == 2
      )
    ) {
      return true
    }
    else {
      return false
    }
  }

  showTransferProfileSource(ele: any){ 
    if(this.getLocInfo.isLocationIndia() && ele?.CandidateCureentStatusId != 200){
      return ele.profileAge > 90 || ele?.isWithdrawn == 1 ? true : false;
    }
  }

  /***
  * Screen reject button show method
  */
  screenRejectShowActionBtn(elm: any) {
    if (
      elm?.primaryrecruiter == this.userData?.EmpNewId ||
      elm?.secondaryrecruiter == this.userData?.EmpNewId
    ) {
      return true
    }
    else {
      return false
    }
  }


  /**open Transfer Unattended Candidate Modal */
  openTransferUnattendedCandidateModal(element: any) {
    this.jumpFirstPage = false;
    element['title'] = "Transfer Candidate";
    // element['type']= type;
    const dialogRef = this.dialog.open(TransferCandidateModalComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'update-interview-feedback', 'talent-transfers', 'talent-transfers-mod'],
      data: element,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getCandidateList(this.paginatorCompRef.paginator.pageIndex + 1, this.paginatorCompRef.paginator.pageSize, this.searchInput, this.sortParam, this.sortTable);
      }
    });
  }

   /**open Transfer profile source Modal */
   openTransferProfileSourceModal(element: any) {
    this.jumpFirstPage = false;
    element['title'] = "Transfer Profile Source";
     //unttended profile
     if (element?.cid == null) {
      element['type'] = 1;
    }

    //in progress profile
    else {
      element['type'] = 2;
    }

    const dialogRef = this.dialog.open(TransferProfileSourceModalComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'ats-model-full-screenss', 'request-transfers-candidate',],
      data: element,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getCandidateList(this.paginatorCompRef.paginator.pageIndex + 1, this.paginatorCompRef.paginator.pageSize, this.searchInput, this.sortParam, this.sortTable);
      }
    });
  }

  //view details
  viewDetails(elm: any) {
    const dialogRef = this.dialog.open(ViewCandidateDetailsPartnerComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'view-cand-part-dt', 'ats-model-lg', 'animate__animated', 'animate__swing'],
      data: elm,
      disableClose: true
    });
  }

  /***
   * open modal for status remark
   */
  changeStatus(elm: any, event: any) {
    elm['title'] = event.source.checked === true ? 'Active ' + elm?.candidateName : 'withdraw ' + elm?.candidateName;
    elm['statusForUpdate'] = event.source.checked === true ? 0 : 1;
    elm['type'] = 4;
    const dialogRef = this.dialog.open(UserActiveDeactiveComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'talent-transfers-mod', 'active-inc-modal'],
      data: elm,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getCandidateList(this.paginatorCompRef.paginator.pageIndex + 1, this.paginatorCompRef.paginator.pageSize, this.searchInput, this.sortParam, this.sortTable);
      }
      else {
        event.source.checked = elm?.status === 1;
      }
    });
  }




  //download resume
  dwnloadFileSingle(data) {
    if(data.cid){
      this.http.get(`${environment.apiMainUrlNet}Dashboard/downloadResume?cid=${data.cid}`, { responseType: 'blob' }).subscribe(
        res => {
          saveAs(res, data.resume);
        },
        (error) => {
          this._share.showAlertErrorMessage.next('Something went wrong');
        }
      )
    }
    else{
      this.http.get(`${environment.apiMainUrlNet}Dashboard/downloadResume?id=${data.id}`, { responseType: 'blob' }).subscribe(
        res => {
          saveAs(res, data.resume);
        },
        (error) => {
          this._share.showAlertErrorMessage.next('Something went wrong');
        }
      )
    }


  }

  //approve partner profile modal
  approveRequiestPartnerProfile(element: any) {
    this.jumpFirstPage = false;
    element['title'] = "Approve Request for Partner Profiles";
    //unttended profile
    if (element?.cid == null) {
      element['type'] = 2;
    }

    //in progress profile
    else {
      element['type'] = 1;
    }

    const dialogRef = this.dialog.open(ApproveRequestPartnerProfilesTransferComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'ats-model-full-screenss', 'request-transfers-candidate',],
      data: element,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getCandidateList(this.paginatorCompRef.paginator.pageIndex + 1, this.paginatorCompRef.paginator.pageSize, this.searchInput, this.sortParam, this.sortTable);
      }
    });
  }


  /***
* download report
*/
  exportExcelServerSide() {
    let bodyData = {
      ...this.bodyParam,
      page: 1,
      pageSize: this.paginationData?.Total,
    }
    this.http.post(`${environment.apiMainUrlNet}Partner/ExportToExcelProfilesSharedByPartner`, bodyData, { responseType: 'blob' }).subscribe(
      res => {
        saveAs(res, 'Partner_Profiles_Report.xls');
      },
      (error) => {
        this._share.showAlertErrorMessage.next('Something went wrong');
      }
    )
  }

  //new screen reject modal
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
          // this.getCandidateListByOption(this.filteredData);
          this.getCandidateList(this.paginatorCompRef.paginator.pageIndex + 1, this.paginatorCompRef.paginator.pageSize, this.searchInput, this.sortParam, this.sortTable);
        }
        else {
        }
      });
    }
    else {
      elm['title'] = `Screen Reject - ${elm?.Name}`;
      elm['profileId'] = 5;
      elm['pId'] = elm?.id;
      elm['name'] = elm?.candidateName;
      elm['email'] = elm?.candidateEmail;
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
          // this.getCandidateListByOption(this.filteredData);
          this.getCandidateList(this.paginatorCompRef.paginator.pageIndex + 1, this.paginatorCompRef.paginator.pageSize, this.searchInput, this.sortParam, this.sortTable);
        }
        else {
        }
      });
    }
  }

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

  // open pop up modal with condition for with TC or withoiut tc transfer (tranType= 1-w/o TC & 2 for with TC)
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
      // if (tranType == 1) {
      //   this.openModalForWithoutTCTransfer(element);
      // }
      // else {
      //   this.openModalForWithTCTransfer(element);
      // }
      if (tranType == 1) {
        this.openModalForDirectTransfer(element);
      } else {
        this.openModalForTransferRequest(element);
      }
    }
  }

  // open pop up modal without condition for Direct transfer
  // openModalForWithoutTCTransfer(element: any) {
  //   this.jumpFirstPage = false;
  //   element['title'] = "Transfer to Talent ID";
  //   //if unattended profile
  //   if (element['cid'] == null) {
  //     element['type'] = 1;
  //   }
  //   const dialogRef = this.dialog.open(TransferCandidateFormComponent, {
  //   // const dialogRef = this.dialog.open(PartnerProfilesTransferOrRequestTransferModalComponent, {
  //     //   width: '500px',
  //     //'talent-transfers-mod'
  //     panelClass: ['ats-model-wrap', 'update-interview-feedback', 'talent-transfers',],
  //     data: element,
  //     disableClose: true
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       this.jumpFirstPage = true;
  //       // this.getCandidateListByTalentId(1, this.itemPerPage, this.searchInput, this.sortParam);
  //     }
  //   });
  // }

  // open pop up modal without condition for requested transfer
  // openModalForWithTCTransfer(element: any) {
  //   this.jumpFirstPage = false;
  //   element['title'] = "Request for Transfer Candidate";

  //   //if unattended profile
  //   if (element['cid'] == null) {
  //     element['type'] = 1;
  //   }

  //   const dialogRef = this.dialog.open(PartnerProfilesTransferOrRequestTransferModalComponent, {
  //     width: '500px',
  //     panelClass: ['ats-model-wrap', 'ats-model-full-screenss', 'request-transfers-candidate',],
  //     data: element,
  //     disableClose: true
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       this.jumpFirstPage = true;
  //       // this.getCandidateListByTalentId(1, this.itemPerPage, this.searchInput, this.sortParam);
  //     }
  //   });
  // }

  /***
   * sent request button show/hide for unttended profile
   */
  reqSendBtnUnattended(elm: any) {
    if (elm?.cid == null
      && this.getLocInfo.isLocationIndia() &&
      elm?.transferStatus != 'P' &&  this.userData?.otherRoles?.IsAdminProfileTransfer != 'Y' && elm?.isWithdrawn == 0 &&
      // elm?.IsPrimSecRecActive != 0 &&
      (elm?.primaryrecruiter != null || elm?.secondaryrecruiter != null) &&
      elm?.primaryrecruiter != this.userData?.EmpNewId &&
      // // elm?.ProfileSourceId != 5 &&
      elm?.secondaryrecruiter != this.userData?.EmpNewId
    ) {
      return true
    }
    else {
      return false
    }
  }

  /***
   * sent request button show/hide attended
   */
  approvalSentShowActionBtn(elm: any) {
    if (elm?.cid != null
      && this.getLocInfo.isLocationIndia() &&
      // elm?.dateDiffInDays > 5 &&
      // elm?.statusid != 5 &&
      elm?.transferStatus != 'P' &&  this.userData?.otherRoles?.IsAdminProfileTransfer != 'Y' && elm?.isWithdrawn == 0 &&
      // elm?.IsPrimSecRecActive != 0 &&
      (elm?.primaryrecruiter != null || elm?.secondaryrecruiter != null) &&
      elm?.primaryrecruiter != this.userData?.EmpNewId &&
      // // elm?.ProfileSourceId != 5 &&
      elm?.secondaryrecruiter != this.userData?.EmpNewId
    ) {
      return true
    }
    else {
      return false
    }
  }

  transferButtonEnable(element: any) {
    if (
      element?.transferStatus != 'P' && this.getLocInfo.isLocationIndia() && element?.isWithdrawn != 1 &&
      (
        (element?.primaryrecruiter == null && element?.secondaryrecruiter == null) ||
        element?.primaryrecruiter == this.userData?.EmpNewId ||
        element?.secondaryrecruiter == this.userData?.EmpNewId ||
        this.userData?.otherRoles?.IsAdminProfileTransfer == 'Y'

      )
    ) {
      return true
    }
    else {
      return false
    }
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
    }
    else {
      // this.openModalForWithoutTCTransfer(element);
      this.openModalForTransferRequest(element);
    }
  }

  //===================
  // open pop up modal without condition for requested transfer
  openModalForTransferRequest(element: any) {
    this.jumpFirstPage = false;
    element['title'] = "Request for Transfer Candidate";
    element['TransferDirectOrRequest'] = 'R';
    //if unattended profile
    if (element['cid'] == null) {
      element['type'] = 1;
    }

    const dialogRef = this.dialog.open(PartnerProfilesReqTransferModalComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'ats-model-full-screenss', 'request-transfers-candidate',],
      data: element,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.jumpFirstPage = true;
        this.getCandidateList(this.paginatorCompRef.paginator.pageIndex + 1, this.paginatorCompRef.paginator.pageSize, this.searchInput, this.sortParam, this.sortTable);
      }
    });
  }

  // open pop up modal without condition for Direct transfer
  openModalForDirectTransfer(element: any) {
    this.jumpFirstPage = false;
    element['title'] = "Transfer to Talent ID";
    element['TransferDirectOrRequest'] = 'D';
    //if unattended profile
    if (element['cid'] == null) {
      element['type'] = 1;
    }
    const dialogRef = this.dialog.open(PartnerProfilesDirectTransferModalComponent, {
      //   width: '500px',
      //'talent-transfers-mod'
      panelClass: ['ats-model-wrap', 'update-interview-feedback', 'talent-transfers',],
      data: element,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.jumpFirstPage = true;
        this.getCandidateList(this.paginatorCompRef.paginator.pageIndex + 1, this.paginatorCompRef.paginator.pageSize, this.searchInput, this.sortParam, this.sortTable);
      }
    });
  }

   /***
   * approved button show method
   */
   approveShowActionBtnRecruiter(elm: any) {

    if (elm?.transferStatus == 'P' && this.getLocInfo.isLocationIndia() &&
      elm?.Requestedby == 'R' &&
      (
        elm?.primaryrecruiter == this.userData?.EmpNewId ||
        elm?.secondaryrecruiter == this.userData?.EmpNewId ||
        this.userData?.RoleId == 5 || this.userData?.RoleId == 10 ||
        this.userData?.otherRoles?.IsAdminProfileTransfer == 'Y'
      )) {
      return true

    }

    else {
      return false
    }

  }

  //request to transfer candidate
  approveTransferedCandidateRecruiter(element: any) {
    this.jumpFirstPage = false;
    element['title'] = "Approve Transfer Candidate Request";
    //if unattended profile
    if (element['cid'] == null) {
      element['type'] = 1;
    }
    const dialogRef = this.dialog.open(ApproveTransferRequestByRecruiterModalComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'ats-model-full-screenss', 'request-transfers-candidate',],
      data: element,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.jumpFirstPage = true;
        this.getCandidateList(this.paginatorCompRef.paginator.pageIndex + 1, this.paginatorCompRef.paginator.pageSize, this.searchInput, this.sortParam, this.sortTable);
        // this.getCandidateListByTalentId(1, this.itemPerPage, this.searchInput, this.sortParam);
      }
    });
  }

}
