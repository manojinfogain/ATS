import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { GlobalMethod } from '../../core/common/global-method';
import { AtsCommonPrefix, SPECIALACCESSUSER } from '../../core/constant/common.const';
import { CONSTANTS } from '../../core/constant/constants';
import { GetSetStorageService } from '../../core/services/get-set-storage.service';
import { CandidateIdentityVerificationModalHrComponent } from '../modals/candidate-identity-verification-modal-hr/candidate-identity-verification-modal-hr.component';
import { OnboardService } from '../onboard.service';
import { AddIssPendingVerificationRemarksModalComponent } from '../modals/add-iss-pending-verification-remarks-modal/add-iss-pending-verification-remarks-modal.component';
import { ExcelService } from '../../core/common/excel.service';
import { DatePipe } from '@angular/common';
import { CidPrefixPipe } from '../../shared/pipes-directives/pipes/cid-prefix.pipe';

@Component({
  selector: 'app-candidate-onboard-verification-list',
  templateUrl: './candidate-onboard-verification-list.component.html',
  styleUrls: ['./candidate-onboard-verification-list.component.scss'],
  providers: [DatePipe, CidPrefixPipe]
})
export class CandidateOnboardVerificationListComponent implements OnInit {
  displayedColumns = ['talentId', 'Cid', 'CandidateName', 'EmailID', 'PhoneNo', 'primarySkill', 'priRecruiter',
    'secondRecruiter', 'offerDate', 'joiningDate', 'location', 'issReason', 'issVerificationStatus',
    'dormantStatus', 'approveStatus', 'action'];
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
  /** Paginator Reference */
  @ViewChild('paginatorRef', { static: true }) paginatorCompRef;
  constructor(
    public dialog: MatDialog,
    private _fb: UntypedFormBuilder,
    private _onboard: OnboardService,
    private _storage: GetSetStorageService,
    public _excelService: ExcelService,
    public datepipe: DatePipe,
    private _cidPrefix: CidPrefixPipe
  ) {
  }

  ngOnInit() {
    this.filterFormInit();
    this.userData = this._storage.getSetUserData();
  }

  ngAfterViewInit() {
    this.getOnboardingCandidateList(1, CONSTANTS.PAGE_SIZE, null, { startDate: null });
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
    this.getOnboardingCandidateList(1, CONSTANTS.PAGE_SIZE, this.searchInput, data);
  }


  /**
   * get selected talent Id
   * @param data 
   */
  getDataTalent(data) {
    this.resetSortFilter();
    this.thId = data.TH_ID;
    this.paginatorCompRef.paginator.pageIndex = 0;
    this.getOnboardingCandidateList(1, CONSTANTS.PAGE_SIZE, this.searchInput, this.sortParam)
  }

  /**
 * pagination method
 * @param pageEvent 
 */
  getPagingData(pageEvent: any) {
    this.getOnboardingCandidateList(pageEvent.pageIndex + 1, pageEvent.pageSize, this.searchInput ? this.searchInput : null, this.sortParam);
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
    this.getOnboardingCandidateList(1, CONSTANTS.PAGE_SIZE, e, this.sortParam);
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
      dateStart: [null],
      dateEnd: [{ value: null, disabled: true }],
      location: [[]]
    })
  }


  public bodyParam: any = {};
  getOnboardingCandidateList(page: number, pageSize: number, search: any, sortParam: any) {
    this.bodyParam = {};
    let body = {
      page: page,
      pageSize: pageSize
    }
    if (sortParam?.dateStart) {
      body['startDate'] = GlobalMethod.formatDate(sortParam?.dateStart);
    }
    if (sortParam?.dateEnd) {
      body['endDate'] = GlobalMethod.formatDate(sortParam?.dateEnd);
    }
    if (sortParam.location && sortParam.location.length !== 0) {
      let locationIds = sortParam.location.filter(n => n);
      body['location'] = locationIds.toString();
    }

    if (this.thId) {
      body['thid'] = this.thId
    }
    if (search) {
      body['search'] = search;
    }
    if (sortParam.offerstatus && sortParam.offerstatus.length !== 0) {
      let offerstatusIds = sortParam.offerstatus.filter(n => n);
      body['offerStatus'] = offerstatusIds.toString();
    }


    this.bodyParam = body;
    this._onboard.getAllCandidatesForHRValidation(body).subscribe(
      res => {
        this.candidateList = res['data'];
        this.paginationData = res['pagination'][0];
      }
    )
  }

  /***
   * open verifcation form 
   */
  viewAllDetailsOnboardPic(elm: any) {
    elm['title'] = 'Candidate Verification Details';
    const dialogRef = this.dialog.open(CandidateIdentityVerificationModalHrComponent, {
      panelClass: ['ats-model-wrap', 'ats-model-full-screen', 'ats-header-text-cap'],
      data: elm,
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%'
    });
    dialogRef.afterClosed().subscribe(
      res => {
        if (res) {
          this.getOnboardingCandidateList(1, CONSTANTS.PAGE_SIZE, null, this.sortParam);
        }
      }
    );
  }


  /***
  * open verifcation form 
  */
  empVerificationOnboardPic(elm: any, type: string) {
    if (type === 'C') {
      elm['title'] = 'Candidate Verification (HR)';
    }
    if (type === 'E') {
      elm['title'] = 'Employee Verification (Post 7 Days)';
    }
    if (type === 'IS') {
      elm['title'] = 'Employee Verification (ISS)';
    }
    if (type === 'RM') {
      elm['title'] = 'Employee Verification (RM Connect)';
    }
    elm['type'] = type;
    // elm['isLeadership'] = elm?.IsLeadership == 1 ? 'Y' : 'N'

    elm['candidateTypeLead'] = elm?.IsLeadership == 1 ? 'LS' : '';
    elm['CandidateId'] = elm?.CandidateId;
    const dialogRef = this.dialog.open(CandidateIdentityVerificationModalHrComponent, {
      panelClass: ['ats-model-wrap', 'ats-model-full-screen', 'ats-header-text-cap'],
      data: elm,
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%'
    });
    dialogRef.afterClosed().subscribe(
      res => {
        if (res) {
          this.getOnboardingCandidateList(1, CONSTANTS.PAGE_SIZE, null, this.sortParam);
        }
      }
    );
  }
  /*add iss pending remarks
    */
  addIssRemarks(elm: any) {
    elm['title'] = !elm?.ISSIsConsent ? 'Add Pending Verification Remarks (ISS)' : 'View Pending Verification Remarks (ISS)';
    const dialogRef = this.dialog.open(AddIssPendingVerificationRemarksModalComponent, {
      panelClass: ['ats-model-wrap', 'candidate-connect-view-modal'],
      data: elm,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getOnboardingCandidateList(1, CONSTANTS.PAGE_SIZE, null, this.sortParam);
      }
    });
  }
  //export ijp report excel
  exportAsXLSX(): void {
    let bodyData = {
      ...this.bodyParam,
      page: 1,
      pageSize: this.paginationData?.Total,
    }
    this._onboard.getAllCandidatesForHRValidation(bodyData).subscribe(
      res => {
        let candidateList = res['data'];
        debugger
        let filterDataExcel = [];
        for (var key in candidateList) {
          let selectedData = {
            'Talent ID': candidateList[key].talentID,
            'CID': this._cidPrefix.transform(candidateList[key].cid, candidateList[key].ProfileId),
            'Candidate Name': candidateList[key].Name,
            'Email ID': candidateList[key].email,
            'Phone No': candidateList[key].phone,
            'Skill': candidateList[key].skillName,
            'Primary Recruiter': candidateList[key].primaryrecruiterName ? candidateList[key].primaryrecruiterName : '-' + candidateList[key].primaryrecruiter,
            'Secondary Recruiter': candidateList[key].secondaryrecruiterName ? candidateList[key].secondaryrecruiterName : '-' + candidateList[key].secondaryrecruiter,
            'Date Of Offer': this.datepipe.transform(candidateList[key].DateOfOffer, 'dd-MMM-yy'),
            'Date Of Joining': this.datepipe.transform(candidateList[key].DateOfJoining, 'dd-MMM-yy'),
            'Joining Location': candidateList[key].JoiningLocationName,
            'Delay Reason': candidateList[key].DelayIssReason,
           // 'Candidate  Status': candidateList[key].onboardStatusName,
            'Dormant Status': candidateList[key].DormantStatus == 'R' ? 'Re-activated' : candidateList[key].DormantStatus == 'D' ? 'Dormant' : 'Active',
            'Offer Status': candidateList[key].StatusName
            //  'Applied On': this.datepipe.transform(candidateList[key].IJPAppliedOn, 'dd-MMM-yy'),

          };
          filterDataExcel.push(selectedData);
        }

        this._excelService.exportAsExcelFile(filterDataExcel, 'Candidate Verification List');
      }
    )

  }

}
