import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { InterviewStatusService } from 'projects/ats-global-system/src/app/core/services/interview-status.service';
import { CancelInterviewModalComponent } from './modals/cancel-interview-modal/cancel-interview-modal.component';
import { RescheduleInterviewModalComponent } from './modals/reschedule-interview-modal/reschedule-interview-modal.component';
import { CONSTANTS } from 'projects/ats-global-system/src/app/core/constant/constants';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { InterviewCommonService } from 'projects/ats-global-system/src/app/core/services/interview-common.service';
import { JdPanelConfirmationModalComponent } from '../modals/jd-panel-confirmation-modal/jd-panel-confirmation-modal.component';
import { Subscription } from 'rxjs';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { AtsCommonPrefix } from 'projects/ats-global-system/src/app/core/constant/common.const';
import { GlobalMethod } from '../../core/common/global-method';
@Component({
  selector: 'app-reschedule-cancel-interview',
  templateUrl: './reschedule-cancel-interview.component.html',
  styleUrls: ['./reschedule-cancel-interview.component.scss']
})
export class RescheduleCancelInterviewComponent implements OnInit, OnDestroy {

  displayedColumns = ['talentId', 'Cid', 'CandidateName', 'primarySkill', 'EmailID', 'PhoneNo', 'InterviewDate', 'primaryInterviewer', 'additionalInterviewers', 'InterviewType', 'CandidateStatus','dormantStatus', 'Action'];
  public thId: any;
  public searchInput: string;
  public hideSection: boolean = true;
  public paginationData: any;
  public candidateList: any = [];
  public jumpFirstPage: boolean = false;
  public sortParam: string = '';
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
    private _fb: UntypedFormBuilder,
    private _interCommon: InterviewCommonService,
    private _share: ShareService
  ) {
  }

  ngOnInit(): void {
    this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, null, null);
    this.filterFormInit();

    this.refreshSubscription = this._share.detectSwitchLoc.subscribe(
      get => {
        this.resetSortFilter();
        this.talentIdControl.patchValue('all');
        this.thId = null;
        this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, null, null);
      }
    )
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
    this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, this.searchInput, data);
  }

  /***
 * filter form Init
 */
  filterFormInit() {
    this.sortFormFilter = this._fb.group({
      candidateStatusNew: [[]],
      interviewTypeIdNew: [[]],
      primarySkill: [[]],
      dateFrom: [null],
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
    this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, null, null)
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
    this.jumpFirstPage = false;
    this.jumpFirstPage = true;
    this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, e, this.sortParam);
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
    this._interviewStatus.viewCandidateListByIdNew(body).subscribe(
      res => {
        this.candidateList = res['data'];
        this.paginationData = res['pagination'][0];
      }
    )
  }

  /**
   * interview Reschedule
   * @param data 
   */
  //method for reshedule inteview and jd panel confirmation
  reschedudInterHandler(elm) {
    this._interCommon.getJDPanelAvailableDetails(elm.th_id).subscribe(
      res => {
        let data = res['data'][0];
        if (data.JDAvailable == 'Y' && data.PanelAvailable == 'Y') {
          this.interviewReschedule(elm);
        }
        else {
          elm['th_id'] = elm.th_id;
          // elm['th_id']=this.data?.thIds;
          this.openConfirmationModal(elm);
        }
      }
    )
  }

  interviewReschedule(data: any) {
    this.jumpFirstPage = false;
    const dialogRef = this.dialog.open(RescheduleInterviewModalComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'update-interview-feedback', 'resh-interview-feedback'],
      data: data,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        //  this.jumpFirstPage = false;
        this.jumpFirstPage = true;
        this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, this.searchInput, this.sortParam);
      }
    });
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
        this.interviewReschedule(element);
      }
    });
  }
  /**
   * interview cancel
   * @param data 
   */
  interviewCancel(data: any) {
    this.jumpFirstPage = false;
    const dialogRef = this.dialog.open(CancelInterviewModalComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'update-interview-feedback', 'resh-interview-feedback', 'resh-interview-cencel'],
      data: data,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        //  this.jumpFirstPage = false;
        this.jumpFirstPage = true;
        this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, this.searchInput, this.sortParam);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

}
