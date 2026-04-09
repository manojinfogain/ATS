import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { ExcelService } from '../../../../core/common/excel.service';
import { ShareService } from '../../../../core/services/share.service';
import { TalentService } from '../../../talent.service';
import { CONSTANTS } from '../../../../core/constant/constants';
import { ViewTalentFullDetailsModalComponent } from '../../../job-requisition-list/modals/view-talent-full-details-modal/view-talent-full-details-modal.component';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonPdfViewerInternalComponent } from '../../../../common-sharing/modals/common-pdf-viewer-internal/common-pdf-viewer-internal.component';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { IjpApplyJustificationModalComponent } from '../../modals/ijp-apply-justification-modal/ijp-apply-justification-modal.component';
import { MyApplicationDetailsModalComponent } from '../../modals/my-application-details-modal/my-application-details-modal.component';
import { GetLocationInfo } from 'projects/ats-global-system/src/app/core/common/getLocationInfo';

@Component({
  selector: 'app-browse-opportunities',
  templateUrl: './browse-opportunities.component.html',
  styleUrls: ['./browse-opportunities.component.scss']
})
export class BrowseOpportunitiesComponent implements OnInit {
  public ijpJobViewList: any = [];
  public ijpJobViewListEligibl: any = [];
  displayedColumns = ['RequisitionId', 'GradeName', 'PrimarySkill', 'subSkillName', 'accountName', 'ijpDesignation', 'Location',
    'exp', 'projName', 'profielMatchPerchant', 'status', 'action'
  ];
  public isResetSearch: boolean = false;
  public isResetFilter: boolean = false;
  public userData: any = {};
  public searchInput: string = '';
  public sortParam: string = '';
  public paginationData: any;
  public sortFormFilter: UntypedFormGroup = new UntypedFormGroup({});
  public bodyParam: any = {};
  public IJPDetails: any = '';
  public title: string = '';

  @ViewChild('paginatorRef', { static: true }) paginatorCompRef;
  @Output() applicationApplied = new EventEmitter<void>();

  constructor(
    public dialog: MatDialog,
    private _talentServ: TalentService,
    private _share: ShareService,
    private _excelService: ExcelService,
    private _fb: UntypedFormBuilder,
    public _http: HttpClient,
    private route: ActivatedRoute,
    private getLocInfo: GetLocationInfo
  ) {
  }

  ngOnInit() {
    this.filterFormInit();
  }

  ngAfterViewInit() {
    this.route.queryParams.subscribe(params => {
      let thid = params['thid'];
      if (thid) {
        thid = decodeURIComponent(thid);
        if (this.isValidBase64(thid)) {
          const decodedThid = atob(thid);
          this.GetIJPViewJobList(1, CONSTANTS.PAGE_SIZE, decodedThid, null);
        } else {
          this._share.showAlertErrorMessage.next('Invalid URL');
        }
      } else {
        this.GetIJPViewJobList(1, CONSTANTS.PAGE_SIZE, null, null);
      }
    });
  }

  isValidBase64(str: string): boolean {
    if (!str || str.length % 4 !== 0) return false;
    const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
    return base64Regex.test(str);
  }

  /**
   * Filter form Init
   */
  filterFormInit() {
    this.sortFormFilter = this._fb.group({
      accountType: [[]],
      location: [[]],
      primarySkill: [[]],
      grade: [[]],
      appliedEmp: [null],
      ijpStatus: [null],
      practiceId: [[]],
      numberRange: [null]
    })
  }

  /**
   * Search
   */
  getSearchValueKey(e: any) {
    this.isResetFilter = true;
    this.isResetSearch = false;
    this.sortParam = '';
    this.searchInput = e;
    this.paginatorCompRef.paginator.pageIndex = 0;
    let pageSizeSelected: number = this.paginatorCompRef?.paginator?.pageSize;
    this.GetIJPViewJobList(1, pageSizeSelected, e, this.sortParam);
  }

  getSortData(data: string) {
    this.isResetSearch = true;
    this.isResetFilter = false;
    this.searchInput = '';
    this.sortParam = data;
    this.paginatorCompRef.paginator.pageIndex = 0;
    let pageSizeSelected: number = this.paginatorCompRef?.paginator?.pageSize;
    this.GetIJPViewJobList(1, pageSizeSelected, this.searchInput, data);
  }

  /**
   * Pagination method
   */
  getPagingData(pageEvent: any) {
    this.GetIJPViewJobList(pageEvent.pageIndex + 1, pageEvent.pageSize, this.searchInput ? this.searchInput : null, this.sortParam);
  }

  /**
   * Get details of IJP
   */
  GetIJPViewJobList(page: number, pageSize: number, search: any, sortParam: any) {
    this.bodyParam = {};
    let body = {
      page: page,
      pageSize: pageSize,
    }
    if (search) {
      body['search'] = search;
    }
    if (sortParam?.appliedEmp == true) {
      body['IsApplied'] = 1;
    }

    if (sortParam?.accountType && sortParam?.accountType.length !== 0) {
      let Ids = sortParam?.accountType.filter(n => n);
      body['AccountIDs'] = Ids.toString();
    }

    if (sortParam?.location && sortParam?.location.length !== 0) {
      let Ids = sortParam?.location.filter(n => n);
      body['LocationIDs'] = Ids.toString();
    }
    if (sortParam?.primarySkill && sortParam?.primarySkill?.length !== 0) {
      let Ids = sortParam?.primarySkill?.filter(n => n);
      body['SkillIDs'] = Ids.toString();
    }
    if (sortParam?.grade && sortParam?.grade?.length !== 0) {
      let Ids = sortParam?.grade?.filter(n => n);
      body['GradeIDs'] = Ids.toString();
    }
    if (sortParam?.ijpStatus && sortParam?.ijpStatus?.length !== 0) {
      let Ids = sortParam?.ijpStatus?.filter(n => n);
      body['ijpStatusId'] = Ids.toString();
    }
    if (sortParam?.practiceId && sortParam?.practiceId.length !== 0) {
      let Ids = sortParam?.practiceId.filter(n => n);
      body['practiceId'] = Ids.toString();
    }
    if (sortParam?.numberRange && sortParam?.numberRange?.length !== 0) {
      body['FitmentScoreMin'] = sortParam?.numberRange[0];
      body['FitmentScoreMax'] = sortParam?.numberRange[1];
    }
    this.bodyParam = body;
    this._talentServ.GetIJPViewJobList(body).subscribe(
      res => {
        this.ijpJobViewList = res['data'];
        this.ijpJobViewListEligibl = this.ijpJobViewList[0];
        this.paginationData = res['pagination'][0];
      }
    )
  }

  /**
   * When applicant will apply for the position
   */
  confirmApply(elm: any) {
    this._talentServ.getIJPApplyValidation(elm.thId).subscribe(
      res => {
        let data = res['data'][0];
        /** temp code to bypass applied exceed condition */
        //  1 for yes, 0 for no
        // data['talentProposalLimitExceeded'] = 0;  // 
        // data['EmployeeProposalLimitExceeded'] = 0;  // 
        // data['ijpAlreadyRejected'] = 0; // temp code to bypass applicant status rejected condition
        // data['isVisaApplicable'] = 1;
        // data['isValidVisa'] = 1;
        // data['isVisaNotExceedOnbBillDate'] = 0;
        /** end temp code to bypass applied exceed condition */
        /** if TID is blocked or position is filled */
        debugger
        if (data?.IsTidBlocked === 1 || data?.IsTidBlocked === '1') {
          this._share.showAlertErrorMessage.next('You are not allowed to apply for this position as it is already blocked or filled.');
        } else {
          if (data?.IsIJPApplied == 1) {
            let MsgBody = {
              'durationInSeconds': 12,
              'message': 'You have already applied for this position.'
            }
            this._share.showAlertErrorParamMessage.next(MsgBody);
          } else {
            if (data?.IsCorporatePool == 1) {
              if (data?.IsGradeWiseEligible == 0) {
                let MsgBody = {
                  'durationInSeconds': 12,
                  'message': "Applicant's grade must be either equal to or just one level above / below the specified grade of the position."
                }
                this._share.showAlertErrorParamMessage.next(MsgBody);
              }

              else if (data?.IsDuplicate == 0) {
                let MsgBody = {
                  'durationInSeconds': 12,
                  'message': "You have already applied for a similar position in the same account."
                }
                this._share.showAlertErrorParamMessage.next(MsgBody);
              }
              /** Only four active IJP applications should be permitted */
              else if (data?.EmployeeProposalLimitExceeded == 0) {
                let MsgBody = {
                  'durationInSeconds': 12,
                  'message': "You already have four active applications hence cannot apply further. Please reach out to the WMG team for feedback."
                }
                this._share.showAlertErrorParamMessage.next(MsgBody);
              }
              /**If a Talent ID (for which employee is trying to apply IJP) already has 8 active proposals (be it via WMG(max 4) or IJP (max 4))  */
              else if (data?.talentProposalLimitExceeded == 0) {
                let MsgBody = {
                  'durationInSeconds': 12,
                  'message': "You cannot apply as there are already enough proposals against this IJP."
                }
                this._share.showAlertErrorParamMessage.next(MsgBody);
              }
              /**If an employee is rejected for an IJP, he/she should not be able to reapply for the same position. */
              else if (data?.ijpAlreadyRejected == 0) {
                let MsgBody = {
                  'durationInSeconds': 12,
                  'message': "You have already been rejected for this position. Please apply for other suitable opportunities."
                }
                this._share.showAlertErrorParamMessage.next(MsgBody);
              }
               /** if us /poland isVisaApplicable */
              else if (data?.isVisaApplicable == 1) {
                debugger
                // Case 1: Visa not valid / not available
                if (data?.isValidVisa == 0) {
                  let MsgBody = {
                    durationInSeconds: 12,
                    message: "You do not have a valid visa to apply for this position."
                  }
                  this._share.showAlertErrorParamMessage.next(MsgBody);
                }
                // Case 2: Visa expired
                else if (data?.isValidVisa == 1 && data?.isVisaNotExceedOnbBillDate == 0) {
                  let MsgBody = {
                    durationInSeconds: 12,
                    message: "You are not eligible to apply for this IJP as your Visa expiry date is less than the onboarding or billing date."
                  }
                  this._share.showAlertErrorParamMessage.next(MsgBody);
                }
                else {
                  this.ijpJustificationModal(elm);
                }

              }
              else if (data?.IsGradeWiseEligible == 1) {
                this.ijpJustificationModal(elm);
              }
            } else {
              if (data?.IsSpentOnAccount == 0) {
                if (data?.IJPEligibilityRelConfirm == 1) {
                  this.ijpJustificationModal(elm);
                } else {
                  let MsgBody = {
                    'durationInSeconds': 12,
                    'message': 'You cannot apply for this position. You must spend a minimum of 18 months in account.'
                  }
                  this._share.showAlertErrorParamMessage.next(MsgBody);
                }
              } else if (data?.IsGradeWiseEligible == 0) {
                let MsgBody = {
                  'durationInSeconds': 12,
                  'message': "Applicant's grade must be either equal to or just one level above / below the specified grade of the position."
                }
                this._share.showAlertErrorParamMessage.next(MsgBody);
              } else if (data?.IsDuplicate == 0) {
                let MsgBody = {
                  'durationInSeconds': 12,
                  'message': "You have already applied for a similar position in the same account."
                }
                this._share.showAlertErrorParamMessage.next(MsgBody);
              }
              /**New Observation Point */
              /** Only four active IJP applications should be permitted */
              else if (data?.EmployeeProposalLimitExceeded == 0) {
                let MsgBody = {
                  'durationInSeconds': 12,
                  'message': "You already have four active applications hence cannot apply further. Please reach out to the WMG team for feedback."
                }
                this._share.showAlertErrorParamMessage.next(MsgBody);
              }
              /**If a Talent ID (for which employee is trying to apply IJP) already has 8 active proposals (be it via WMG(max 4) or IJP (max 4))  */
              else if (data?.talentProposalLimitExceeded == 0) {
                let MsgBody = {
                  'durationInSeconds': 12,
                  'message': "You cannot apply as there are already enough proposals against this IJP."
                }
                this._share.showAlertErrorParamMessage.next(MsgBody);
              }
              /**If an employee is rejected for an IJP, he/she should not be able to reapply for the same position. */
              else if (data?.ijpAlreadyRejected == 0) {
                let MsgBody = {
                  'durationInSeconds': 12,
                  'message': "You have already been rejected for this position. Please apply for other suitable opportunities."
                }
                this._share.showAlertErrorParamMessage.next(MsgBody);
              }
              /** if us /poland  isVisaApplicable*/
              else if (data?.isVisaApplicable == 1) {
                debugger
                // Case 1: Visa not valid / not available
                if (data?.isValidVisa == 0) {
                  let MsgBody = {
                    durationInSeconds: 12,
                    message: "You do not have a valid visa to apply for this position."
                  }
                  this._share.showAlertErrorParamMessage.next(MsgBody);
                }
                // Case 2: Visa expired
                else if (data?.isValidVisa == 1 && data?.isVisaNotExceedOnbBillDate == 0) {
                  let MsgBody = {
                    durationInSeconds: 12,
                    message: "You are not eligible to apply for this IJP as your Visa expiry date is less than the onboarding or billing date."
                  }
                  this._share.showAlertErrorParamMessage.next(MsgBody);
                }
                else {
                  this.ijpJustificationModal(elm);
                }

              }
              else {
                this.ijpJustificationModal(elm);
              }
            }
          }
        }
      }
    )
  }

  /**
   * IJP Justification Modal
   */
  ijpJustificationModal(element: any) {
    const dialogRef = this.dialog.open(IjpApplyJustificationModalComponent, {
      maxWidth: '47vw',
      minHeight: '150px',
      panelClass: ['ats-model-wrap', 'add-contract-partner-popup'],
      data: element,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let pageSizeSelected: number = this.paginatorCompRef?.paginator?.pageSize;
        this.GetIJPViewJobList(1, pageSizeSelected, null, null);
        // Emit event to parent to update application count
        this.applicationApplied.emit();
      }
    });
  }

  /**
   * Download JOB OPPORTUNITY OPENINGS list
   */
  exportAsXLSX(): void {
    this._talentServ.GetIJPViewJobList(this.bodyParam).subscribe(
      res => {
        let candidateList = res['data'];
        let filterDataExcel = [];
        for (var key in candidateList) {
          let selectedData = {
            'Location': candidateList[key].locationName,
            'Talent Id': candidateList[key].TalentId,
            'IJP Name': candidateList[key].ijpName,
            'IJP Designation': candidateList[key].IJPdesignation,
            'Primary Skill': candidateList[key].skillName,
            'Experience': candidateList[key].expRange,
            'Visa': candidateList[key].visa == 1 ? 'Yes' : 'No',
            'Created By': candidateList[key].creator,
            'Project Name': candidateList[key].projName,
            'Profile Match %': candidateList[key].profileMatch,
            'Account Name': candidateList[key].accountName,
            'Job Description': candidateList[key].jobDesc,
            'Status': candidateList[key].AppliedStatusName,
            'Reject Reason': candidateList[key].RejectReason,
            'Rejection Remarks': candidateList[key].RejectionRemarks,
          };
          filterDataExcel.push(selectedData);
        }
        this._excelService.exportAsExcelFile(filterDataExcel, 'Internal Job Opportunity Openings');
      }
    )
  }

  /**
   * View Policy
   */
  viewPolicy(element: any = {}) {
    element['title'] = "Internal Job Posting Policy";
    element['docName'] = "Internal Job Posting Policy";
    this._http.get(`${environment.apiMainUrlNet}Talent/DownloadIJPPolicy`, { responseType: 'blob' }).subscribe(
      res => {
        let elm = {};
        elm['title'] = `Preview ${element['docName']}`;
        elm['documentName'] = element['docName'];
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
      });
  }

  /**
   * View candidate full details modal
   */
  viweTalentFullDetailsModal(elm: any) {
    elm['isIJPView'] = true;
    elm['title'] = 'View Talent ID Details'
    const dialogRef = this.dialog.open(ViewTalentFullDetailsModalComponent, {
      panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
      data: elm,
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%'
    });
  }

  /**
   * View applied full details modal
   */
  myAppliedDetailsModal(elm: any) {
    const dialogRef = this.dialog.open(MyApplicationDetailsModalComponent, {
      panelClass: ['ats-model-wrap', 'ats-ijp-model-my-application'],
      data: elm,
      maxWidth: '100vw',
      maxHeight: '100vh',
      width: '500px',
    });
  }

  /**
   * Open popup
   */
  openPop(data: any, title: string): void {
    if (data) {
      this.title = title;
      this.IJPDetails = data;
    }
  }
}
