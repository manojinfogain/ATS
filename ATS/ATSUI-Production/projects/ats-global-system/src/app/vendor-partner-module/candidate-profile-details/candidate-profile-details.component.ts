import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CONSTANTS } from 'projects/ats-global-system/src/app/core/constant/constants';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { PartnerService } from '../partner.service';
import { ConfirmationDialogComponent } from 'projects/ats-global-system/src/app/shared/shared-app/components/confirmation-dialog/confirmation-dialog.component';
import { UserActiveDeactiveComponent } from '../modals/user-active-deactive/user-active-deactive.component';
import { ActivatedRoute, Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatSort, Sort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { GlobalCommonMethodService } from 'projects/ats-global-system/src/app/core/common/global-common-method.service';
import { ViewCandidateDetailsPartnerComponent } from '../modals/view-candidate-details-partner/view-candidate-details-partner.component';
import { UpdateCandidateDetailsPartnerComponent } from '../modals/update-candidate-details-partner/update-candidate-details-partner.component';
import { LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator';
import { TransferCandidateComponent } from '../modals/transfer-candidate/transfer-candidate.component';
import { PartnerCandidateTransferRequestComponent } from './modal/partner-candidate-transfer-request/partner-candidate-transfer-request.component';
import { CandidateCommonApiService } from 'projects/ats-global-system/src/app/core/services/candidate-common-api.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { GetLocationInfo } from '../../core/common/getLocationInfo';

@Component({
  selector: 'app-candidate-profile-details',
  templateUrl: './candidate-profile-details.component.html',
  styleUrls: ['./candidate-profile-details.component.scss']
})
export class CandidateProfileDetailsComponent implements OnInit, AfterViewInit {

  displayedColumns = ['candidateName', 'candidateEmail', 'talent_id', 'contractName', 'totalExp', 'relExp', 'primaryskill', 'location', 'interviewRound', 'interviewStatus', 'status', 'action'];
  public userData: any = {};
  public searchInput: string = '';
  public paginationData: any;
  public candidateList: any = [];
  public jumpFirstPage: boolean = false;
  public isResetSearch: boolean = false;
  public isResetFilter: boolean = false;
  public sortParam: string = '';
  public sortFormFilter: UntypedFormGroup = new UntypedFormGroup({});
  @ViewChild(MatSort) sort: MatSort;
  public sortTable: string = '';
  /** Paginator Reference */
  @ViewChild('paginatorRef', { static: true }) paginatorCompRef;
  public statusData: any = CONSTANTS.statusCan;
  public defaultSortTable: string = '&sortColumn=modifiedOn&sortDir=desc'
  public searchedValue: string = '';
  constructor(
    public dialog: MatDialog,
    private _storage: GetSetStorageService,
    private _partnerserve: PartnerService,
    private _router: Router,
    private _fb: UntypedFormBuilder,
    private _globalMethodServe: GlobalCommonMethodService,
    private _candidateCommon: CandidateCommonApiService,
    private _share: ShareService,
    private getLocInfo: GetLocationInfo,
    private route:ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.filterFormInit();
    this.showHideLocWise();
    this.searchedValue = this.route.snapshot.queryParams['thid'];
    if(this.searchedValue != null || this.searchedValue != ''){
      setTimeout(() => {
        this.getSearchValueKey(this.searchedValue);
      }, 1000);
    }
  }
   // location wise check
   public isLocationUS: boolean = false;
   public isLocationIndia: boolean = true;
   showHideLocWise() {
    if (this.getLocInfo.isUserLocationIndia()) {
      this.isLocationIndia = true;
      this.isLocationUS = false;
    } else if (this.getLocInfo.isUserLocationUS()) {
      this.isLocationIndia = false;
      this.isLocationUS = true;
      this.displayedColumns = ['candidateName', 'candidateEmail', 'talent_id', 'contractName', 'totalExp', 'relExp', 'primaryskill', 'locationUS', 'interviewRound', 'interviewStatus', 'status', 'action'];
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

  updateDetails(elm: any) {
    const dialogRef = this.dialog.open(UpdateCandidateDetailsPartnerComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'update-interview-feedback', 'partner-update-modal', 'ats-model-lg'],
      data: elm,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getCandidateList(1, CONSTANTS.PAGE_SIZE, this.searchInput, this.sortParam, this.sortTable);
      }
    });
  }

  ngAfterViewInit() {
    /**
         * get List
         */
    // this.sortTable = this.defaultSortTable;
    this.getCandidateList(1, CONSTANTS.PAGE_SIZE, null, null, this.defaultSortTable);
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

  /***
 * filter form Init
 */
  filterFormInit() {
    this.sortFormFilter = this._fb.group({
      PartnerID: ['all'],
      statusAssignId: ['all'],
      dateFrom: [null],
      dateTo: [{ value: null, disabled: true }]
    })
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
    this.getCandidateList(1, CONSTANTS.PAGE_SIZE, this.searchInput, data, this.sortTable);
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
    this.isResetFilter = true;
    this.isResetSearch = false;
    this.sortParam = '';
    this.searchInput = e;
    this.jumpFirstPage = false;
    this.jumpFirstPage = true;
    this.getCandidateList(1, CONSTANTS.PAGE_SIZE, e, this.sortParam, this.sortTable);
  }

  getCandidateList(page: number, pageSize: number, search: any, sortParam: any, sortTable: string) {
    let queryString = `EmpID=${this._storage.getUserEmpId()}&page=${page}&pageSize=${pageSize}&search=${search ? search.trim() : ''}${sortParam ? sortParam : ''}${sortTable ? sortTable : ''}`;
    this._partnerserve.getCandidateListByPartner(queryString).subscribe(
      res => {
        this.candidateList = new MatTableDataSource(res['data']);
        this.paginationData = res['pagination'][0];
        this.candidateList.sort = this.sort;
      }
    )
  }



  /***
   * active/deactive  conform modal
   */

  confirmAlertActiveDeactive(event: any, data: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      panelClass: 'ats-confirm',
      data: {
        headerText: 'Alert',
        message: ` Are you sure you want to ${data.isWithdrawn == 1 ? 'Active ' : 'withdraw '}  <span class='u-name'>${data?.candidateName}</span> ?
        `,
        buttonText: {
          ok: "Yes",
          cancel: "No"
        },
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.changeStatus(data, event)
      }
      else {
        event.source.checked = data?.isWithdrawn === 0;
      }
    });
  }
  /***
   * open modal for status remark
   */
  changeStatus(elm: any, event: any) {
    elm['title'] = event.source.checked === true ? 'Active ' + elm?.candidateName : 'withdraw ' + elm?.candidateName;
    elm['statusForUpdate'] = event.source.checked === true ? 0 : 1;
    elm['type'] = 4;
    console.log(elm)
    if(this.isLocationUS){
      elm['location'] = 'US';
    }else if(this.isLocationIndia){
      elm['location'] = 'IN';
    }else{

    }
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
        event.source.checked = elm?.isWithdrawn === 0;
      }
    });
  }

  //request to transfer candidate
  requestTransferCandidate(element: any,type:number) {
    let candidateData: any = [];
    if (element?.cid != null) {
      //to get offer status of candidate
      this._candidateCommon.getCandidateDetailsProfile(element?.cid, null, null).subscribe(
        res => {
          candidateData = res['data'][0];
          let transferType: number = 2
          this.openModalConditionWise(element, candidateData, type, transferType);
        });
    } else {
      this.openModalForTransferRequestWithoutCondition(element,type);
    }
  }

   // open pop up modal with condition for direct and requested transfer (tranType= 1-Direct & 2 for requested)
   openModalConditionWise(element: any, candidateData: any, type:any, tranType: number) {
    if (candidateData?.offerStatusId == 20 ||
      candidateData?.offerStatusId == 30 ||
      candidateData?.offerStatusId == 40 ||
      candidateData?.offerStatusId == 50 ||
      candidateData?.offerStatusId == 60 ||
      candidateData?.offerStatusId == 70 ||
      candidateData?.offerStatusId == 80 ||
      candidateData?.offerStatusId == 90 ) {
      this._share.showAlertErrorMessage.next('You can not transfer candidate during Offer Process.');
    } else if (candidateData?.offerStatusId == 200) {
      this._share.showAlertErrorMessage.next('You can not transfer candidate after Candidate Joined.');
    }
    else {
      if (tranType == 1) {
        this.openModalForDirectTransfer(element, type);
      } else {
        this.openModalForTransferRequestWithoutCondition(element, type);
      }
    }
  }

  // open pop up modal without condition for requested transfer
  openModalForTransferRequestWithoutCondition(element: any, type:any) {
    this.jumpFirstPage = false;
    element['title'] = "Request for Transfer Candidate";
    element['type'] = type;
    const dialogRef = this.dialog.open(PartnerCandidateTransferRequestComponent, {
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
   openModalForDirectTransfer(element: any, type:any) {
    this.jumpFirstPage = false;
    element['title'] = "Transfer Candidate";
    element['type']= type;
    const dialogRef = this.dialog.open(TransferCandidateComponent, {
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

  //transfer candidate
  transferCandidateToTalent(element: any,type:number) {
    let candidateData: any = [];
    if (element?.cid != null) {
      //to get offer status of candidate
      this._candidateCommon.getCandidateDetailsProfile(element?.cid, null, null).subscribe(
        res => {
          candidateData = res['data'][0];
          let transferType: number = 2
          this.openModalConditionWise(element, candidateData, type, transferType);
        });
    } else {
      this.openModalForDirectTransfer(element,type);
    }
  }


  /***
   * send request button show/hide
   */
   approvalSentShowActionBtn(elm: any) {
    if ((elm?.cid != null &&
       elm?.dateDiffInDaysPostScreen > 5 &&
        elm?.transferStatus != 'P' &&
        elm?.IsPrimSecRecActivePostScreen != 0  &&
        elm?.interviewStatus != 5 &&
       elm?.isScreenRejected === 0 &&
        elm?.interviewStatus != null) &&
        ((elm?.isWithdrawn != 1 && this.isLocationIndia) || this.isLocationUS)
    ) {
      return true
    }
    else {
      return false
    }
  }

   /***
   * send request button show/hide Unattended
   */
    approvalSentShowActionBtnUnattended(elm: any) {
      if ((elm?.cid == null &&
          elm?.dateDiffInDaysBeforeScreen <= 3 &&
          elm?.transferStatus != 'P' &&
          elm?.IsPrimSecRecActiveBeforeScreen != 0  &&
          elm?.isScreenRejected === 0 &&
          elm?.interviewStatus == null) &&
          ((elm?.isWithdrawn != 1 && this.isLocationIndia) || this.isLocationUS)
      ) {
        return true
      }
      else {
        return false
      }
    }

  /***
   * transfer candidate button show/hide
   */
   inativeRecTranfer(elm: any) {
    if ((elm?.cid != null &&
        elm?.transferStatus != 'P' &&
        elm?.interviewStatus != null &&
        elm?.isScreenRejected === 0 &&
        (elm?.IsPrimSecRecActivePostScreen == 0 ||
          elm?.interviewStatus === 5 ||
          elm?.talentIdStatusPs  == 0 )) &&
          ((elm?.isWithdrawn != 1 && this.isLocationIndia) || this.isLocationUS)
    ) {
      return true
    }
    else {
      return false
    }
  }


  /***
   * send request button show/hide
   */
    idUnattendedProfile (elm: any) {
    if ((elm?.cid === null &&
        elm?.transferStatus != 'P' &&
        elm?.candidateStatus === 11 &&
        elm?.isScreenRejected === 0 &&
        (elm?.dateDiffInDaysBeforeScreen >3 ||
          elm?.IsPrimSecRecActiveBeforeScreen === 0 ||
          elm?.talentIdStatusBs  == 0  )) &&
          ((elm?.isWithdrawn != 1 && this.isLocationIndia) || this.isLocationUS)
    ) {
      return true
    }
    else {
      return false
    }
  }
  /***
   * download file
   */
  dwnloadFileSingle(data) {
    if(data.cid){
      this._globalMethodServe.downloadResume(data.cid,"")
    }
    else{
      this._globalMethodServe.downloadResume("",data.id);
    }
  }

  gotoUser(): void {
    this._router.navigate(['add-candidate-profile'])
  }

}
