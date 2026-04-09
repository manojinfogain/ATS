import { Component, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { InterviewStatusService } from 'projects/ats-global-system/src/app/core/services/interview-status.service';
import { CONSTANTS } from 'projects/ats-global-system/src/app/core/constant/constants';
import { UpdateCandidateFormComponent } from './modal/update-candidate-form/update-candidate-form.component';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { UntypedFormControl } from '@angular/forms';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { AtsCommonPrefix } from 'projects/ats-global-system/src/app/core/constant/common.const';
import { UpdateProfileSourceModalComponent } from './modal/update-profile-source-modal/update-profile-source-modal.component';
@Component({
  selector: 'app-view-edit-candidate-info',
  templateUrl: './view-edit-candidate-info.component.html',
  styleUrls: ['./view-edit-candidate-info.component.scss'],
  providers: [DatePipe]
})
export class ViewEditCandidateInfoComponent implements OnInit {
  displayedColumns = ['Cid', 'CandidateName', 'EmailID', 'PhoneNo', 'UniqueIDType', 'UniqueIDNum', 'InterviewDate', 'interviewer', 'dormantStatus', 'CandidateStatus', 'Action'];
  private thId: any;
  public userData: any = {};
  public searchInput: string;
  public paginationData: any;
  public candidateList: any = [];
  public jumpFirstPage: boolean = false;
  public isResetSearch: boolean = false;
  public isResetFilter: boolean = false;
  public sortParam: string = '';
  public cidColName: string = AtsCommonPrefix.CidColName;
  public cidPrefix: string = AtsCommonPrefix.CidPrefix;
  private refreshSubscription: Subscription;
  public talentIdControl: UntypedFormControl = new UntypedFormControl();
  constructor(
    private _interviewStatus: InterviewStatusService,
    public dialog: MatDialog,
    private _storage: GetSetStorageService,
    public datepipe: DatePipe,
    private _share: ShareService
  ) {
  }

  ngOnInit() {
    this.userData = this._storage.getSetUserData();
    this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, null, null);

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
  /**
   *open candidate update popup
   * @param data 
   */
  openCandidateForm(data: any): void {
    this.jumpFirstPage = false;
    const dialogRef = this.dialog.open(UpdateCandidateFormComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'update-interview-feedback', 'resh-interview-feedback'],
      data: data,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.jumpFirstPage = true;
        this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, this.searchInput, this.sortParam);
      }
    });
  }

  getCandidateListByTalentId(page: number, pageSize: number, search: any, sortParam: any) {
    let queryString = `page=${page}&pageSize=${pageSize}&search=${search ? search.trim() : ''}${sortParam ? sortParam : ''}`;
    this._interviewStatus.getAllCandidateProfileListEdit(this.thId, queryString).subscribe(
      res => {
        this.candidateList = res['data'];
        this.paginationData = res['pagination'][0];
      }
    )
  }

  // updateInterviwer
  updateInterviewer(element: any) {
    element['title'] = "Transfer to Talent ID";
    const dialogRef = this.dialog.open(UpdateCandidateFormComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'update-interview-feedback', 'upd-int-modal'],
      data: element,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.jumpFirstPage = true;
        this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, this.searchInput, this.sortParam);
      }
    });
  }
/***
 update profile source */
  updateProfileSourceModal(elm: any, type: string) {
    elm['type'] = type
    const dialogRef = this.dialog.open(UpdateProfileSourceModalComponent, {
      maxWidth: '47vw',
      minHeight: '150px',
      panelClass: ['ats-model-wrap', 'add-contract-partner-popup'],
      data: elm,
    });
    dialogRef.afterClosed().subscribe(
      res => {
     //   this.selection.clear();
        if (res) {
           this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, this.searchInput, this.sortParam);
        }
      }
    );
  }
    /***
   * stop edit/update candidate record
   */

  // disableBtnStatusWise(elm: any) {
  //   if (elm?.OfferStatusID == 20 ||
  //     elm?.OfferStatusID == 25 ||
  //     elm?.OfferStatusID == 40 ||
  //     elm?.OfferStatusID == 45 ||
  //     elm?.OfferStatusID == 60 ||
  //     elm?.OfferStatusID == 80 ||
  //     elm?.OfferStatusID == 100 ||
  //     elm?.OfferStatusID == 110 ||
  //     elm?.OfferStatusID == 120 ||
  //     elm?.OfferStatusID == 125 ||
  //     elm?.OfferStatusID == 130 ||
  //     elm?.OfferStatusID == 140 ||
  //     elm?.OfferStatusID == 150 ||
  //     elm?.OfferStatusID == 160 ||
  //     elm?.OfferStatusID == 180 ||
  //     elm?.OfferStatusID == 200 ||
  //     elm?.OfferStatusID == 220 ||
  //     elm?.OfferStatusID == 270) {
  //     return true
  //   }
  //   else {
  //     return false
  //   }
  // }

  disableBtnStatusWise(elm: any) {
    if (this.userData?.otherRoles?.IsCandidateDetailsEdit === 'Y') {
      return false;   // role edit rights"Y" always false
    }
    if (
      elm?.OfferStatusID == 20 ||
      elm?.OfferStatusID == 25 ||
      elm?.OfferStatusID == 40 ||
      elm?.OfferStatusID == 45 ||
      elm?.OfferStatusID == 60 ||
      elm?.OfferStatusID == 80 ||
      elm?.OfferStatusID == 100 ||
      elm?.OfferStatusID == 110 ||
      elm?.OfferStatusID == 120 ||
      elm?.OfferStatusID == 125 ||
      elm?.OfferStatusID == 130 ||
      elm?.OfferStatusID == 140 ||
      elm?.OfferStatusID == 150 ||
      elm?.OfferStatusID == 160 ||
      elm?.OfferStatusID == 180 ||
      elm?.OfferStatusID == 200 ||
      elm?.OfferStatusID == 220 ||
      elm?.OfferStatusID == 270
    ) {
      return true;   // role "N" + status match → true
    }

    return false;     // false


  }

  isdobSourceUpdate(elm: any) {
    if (this.userData?.otherRoles?.IsCandidateDetailsEdit === 'Y'
        && elm?.OfferStatusID !=200
        && elm?.isTidDormant != 'D'
    ) {
      return true;   // role edit rights"Y" always true
    }
    return false;
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }
}
