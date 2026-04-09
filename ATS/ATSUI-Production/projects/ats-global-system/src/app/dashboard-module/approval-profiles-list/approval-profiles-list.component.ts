import { Component, OnDestroy, OnInit } from '@angular/core';
import { CONSTANTS } from 'projects/ats-global-system/src/app/core/constant/constants';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { saveAs } from "file-saver";
import { HttpClient } from '@angular/common/http';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { DashboardService } from '../dashboard.service';
import { ApproveProdileModalComponent } from './approve-prodile-modal/approve-prodile-modal.component';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { ViewProfileDetailsAprovalModalComponent } from './view-profile-details-aproval-modal/view-profile-details-aproval-modal.component';
import { ScheduleInterviewComponent } from '../modal/schedule-interview/schedule-interview.component';
import { CandidateCommonApiService } from '../../core/services/candidate-common-api.service';
import { InterviewCommonService } from '../../core/services/interview-common.service';
import { JdPanelConfirmationModalComponent } from '../../interview-module/modals/jd-panel-confirmation-modal/jd-panel-confirmation-modal.component';

@Component({
  selector: 'app-approval-profiles-list',
  templateUrl: './approval-profiles-list.component.html',
  styleUrls: ['./approval-profiles-list.component.scss'],
  providers: [DatePipe]
})
export class ApprovalProfilesListComponent implements OnInit {
  displayedColumns = ['talentId', 'Profile', 'CandidateName', 'primarySkill', 'EmailID', 'PhoneNo', 'approver','primaryRec','SecRec',  'Status', 'UpdateCurrentStatus'];
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
  private refreshSubscription: Subscription;
  public talentIdControl: UntypedFormControl = new UntypedFormControl();
  constructor(
    public dialog: MatDialog,
    private _storage: GetSetStorageService,
    private http: HttpClient,
    private _share: ShareService,
    private _fb: UntypedFormBuilder,
    private _dasboardServe: DashboardService,
    private _candidateCommon: CandidateCommonApiService,
    private _interCommon: InterviewCommonService
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
      statusId: ['all'],
      InterviewTypeId: ['all'],
      primarySkill: ['all'],
      dateFrom: [null],
      dateTo: [{ value: null, disabled: true }]
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
  getCandidateListByTalentId(page: number, pageSize: number, search: any, sortParam: any) {
    let queryString = `page=${page}&pageSize=${pageSize}&search=${search ? search.trim() : ''}${sortParam ? sortParam : ''}`;
    this._dasboardServe.GetApprovalCandidateListForRenuTeam(this.thId, queryString).subscribe(
      res => {
        this.candidateList = res['data'];
        this.paginationData = res['pagination'][0];
      }
    )
  }


  approveCandidateHandler(data: any) {
    data['title'] = "Approve Request";
    const dialogRef = this.dialog.open(ApproveProdileModalComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'ats-model-full-screenss', 'request-transfers-candidate',],
      data: data,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
       this.getCandidateListByTalentId(1, this.itemPerPage, null, null);
      }
    });
  }



  // method for js panel check and interview page open
  scheduleIntHandler(elm: any) {
    this._interCommon.getJDPanelAvailableDetails( elm?.th_id).subscribe(
      res => {
        let data = res['data'][0];
        if (data.JDAvailable == 'Y' && data.PanelAvailable == 'Y') {
          this.openScheduleInterview(elm)
        }
        else {
          elm['th_id'] = elm?.th_id;
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
      this.openScheduleInterview(element)
    }
  });
}
   /***
* schedule inteview modal linkedin, employe refferal, Naukri, Social media sources
*/
openScheduleInterview(elm: any) {
  /**get candidate personal details specific api */
  let candidateData: any = [];
  this._candidateCommon.getCandidateDetailsProfile(null, elm?.ID, elm?.ProfileId).subscribe(
    res => {
      candidateData = res['data'][0];
      // elm['dob'] = candidateData?.dob
      // this.openScheduleModalcodeMethod(elm);
      let data = {
        title: 'Schedule Interview',
        profileId: elm?.ProfileId,
        IsRenuTeam:elm?.IsRenuTeam,
        candidate: {
          talentId: elm.talent_id,
          thId: elm?.th_id,
          addExist: true,
          name: elm.Name,
          mobile: elm.phone,
          email: elm.email,
          totalExp: elm.ExpinYear ? elm.ExpinYear: null,
          totalExpMonth: elm.ExpinMonth ? elm.ExpinMonth: null,
          releventExp: elm.ReleventExpinYear? elm.ReleventExpinYear:  null,
          releventExpMonth: elm.ReleventExpinMonth?elm.ReleventExpinMonth:null,
          primarySkill: candidateData.Skillid ? candidateData.Skillid : null,
          profileid: elm?.ProfileId,
          c_profileUniqId: elm.ID,
          // country:elm.CountryID
          dob: candidateData.dob ? candidateData.dob : null,
          candidateType: candidateData.contractID ? candidateData.contractID : null,
          genderId: candidateData?.GenderId ? candidateData?.GenderId : null,
          education: candidateData.eduQualificationId ? candidateData.eduQualificationId : null,
          currCompany: candidateData.currentCompanyId ? candidateData.currentCompanyId : null,
          currencyType: candidateData.currency_type ? candidateData.currency_type : null,
          // tentativeJoinDate: elm.tentativeJoinDate,
          country: candidateData.CountryID ? candidateData.CountryID : null,
          cityId: candidateData.CityID ? candidateData.CityID : null,
          currentCtc: candidateData.current_ctc ? candidateData.current_ctc : null,
          expCtc: candidateData.expected_ctc ? candidateData.expected_ctc : null,
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
        this.getCandidateListByTalentId(1, this.itemPerPage, this.searchInput ? this.searchInput : null, this.sortParam);
        }
      });
    })
  /**ends */
}



  /***
   * download file
   */
  dwnloadFileSingle(data) {
    if(data.cid){
      this.http.get(`${environment.apiMainUrlNet}Dashboard/downloadResume?cid=${data.cid}`, { responseType: 'blob' }).subscribe(
        res => {
          saveAs(res, data.resume);
        }
      )
    }
    else{
      this.http.get(`${environment.apiMainUrlNet}Dashboard/downloadResume?id=${data.ID}`, { responseType: 'blob' }).subscribe(
        res => {
          saveAs(res, data.resume);
        }
      )
    }

  }

  viewDetails(elm: any) {
    const dialogRef = this.dialog.open(ViewProfileDetailsAprovalModalComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'view-cand-part-dt', 'ats-model-lg'],
      data: elm,
      disableClose: true
    });
  }
}
