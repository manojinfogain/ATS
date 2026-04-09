import { Component, ViewChild, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { DatePipe } from '@angular/common';
import { CONSTANTS } from '../../core/constant/constants';
import { PanelSelfNominationService } from '../panel-self-nomination.service';
import { PublishJobsModalComponent } from '../Modal-Screen/publish-jobs-modal/publish-jobs-modal.component';
import { ViewTalentFullDetailsModalComponent } from '../../talent-module/job-requisition-list/modals/view-talent-full-details-modal/view-talent-full-details-modal.component';
import { GetSetStorageService } from '../../core/services/get-set-storage.service';
import { SlotNominationModalComponent } from '../Modal-Screen/slot-nomination-modal/slot-nomination-modal.component';
import { PanelSlotListThidComponent } from '../Modal-Screen/panel-slot-list-thid/panel-slot-list-thid.component';
import { ViewInvitedRecruitersListModalComponent } from '../Modal-Screen/view-invited-recruiters-list-modal/view-invited-recruiters-list-modal.component';


@Component({
  selector: 'app-published-job-listings',
  templateUrl: './published-job-listings.component.html',
  styleUrls: ['./published-job-listings.component.scss'],
  providers: [DatePipe]
})
export class PublishedJobListingsComponent implements OnInit {

  public displayedColumns = ['thid', 'Account', 'Skill', 'startDate', 'endDate', 'candiateCount', 'prRec', 'srRec', 'AddedOn', 'AddedBy', 'action'];
  public searchInput: string;
  public paginationData: any;
  public sortParam: string = '';
  public pazeOption: any = [10, 20, 50, 100];
  public pazeSize: any = 10;
  public jumpFirstPage: boolean = false;
  public isResetSearch: boolean = false;
  public FilterCtrl: UntypedFormControl = new UntypedFormControl();
  public companyList: any = [];
  @ViewChild(MatSort) sort: MatSort;
  public sortTable: string = '';
  public userData: any = {};
  public sortFormFilter: UntypedFormGroup = new UntypedFormGroup({});
  @ViewChild('paginatorRef', { static: true }) paginatorCompRef;
  constructor(
    public dialog: MatDialog,
    private _PanelServe: PanelSelfNominationService,
    public datepipe: DatePipe,
    private _fb: UntypedFormBuilder,
    private _storage: GetSetStorageService
  ) { }

  ngOnInit() {
    this.userData = this._storage.getSetUserData();
    this.filterFormInit();
    this.getPublishedJobList(1, CONSTANTS.PAGE_SIZE, null, null);
  }

  filterFormInit() {
    this.sortFormFilter = this._fb.group({
      primarySkill: [[]],
      accountType: [[]],
    })
  }

  /**
    * open modal
    * @param data 
    * @param columnType 
    */
  openSlotListModal(data: any): void {
    debugger;
    let css = ['ats-model-wrap', 'view-slot-modal-five1'];
    if (this.userData?.RoleId == 0 && this?.userData?.otherRoles?.IsPanelAccess == 'Y') {
      data['type'] = 'P';
    }
    else {
      data['type'] = 'S';
    }
    data['title'] = "Panel Slot Details" + ' - ' + data?.talentId;
    data['PanelEmpId'] = this.userData?.EmpNewId;
    data['user'] = 'Panel';
    css = ['ats-model-wrap', 'view-slot-modal-six'];

    const dialogRef = this.dialog.open(PanelSlotListThidComponent, {
      width: '650px',
      panelClass: css,
      data: data,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }

  /***
   * reset paging
   */
  resetPagination() {
    this.paginatorCompRef.paginator.pageIndex = 0;
  }

  public bodyParam: any = {};
  public panelList: any = [];
  getPublishedJobList(page: number, pageSize: number, search: any, sortParam: any) {
    this.bodyParam = {};
    let body = {
      page: page,
      pageSize: pageSize,
    }
    if (search) {
      body['search'] = search;
    }
    if (sortParam?.primarySkill && sortParam?.primarySkill?.length !== 0) {
      let Ids = sortParam?.primarySkill?.filter(n => n);
      body['PrimarySkill'] = Ids.toString();
    }
    if (sortParam?.accountType && sortParam?.accountType?.length !== 0) {
      let Ids = sortParam?.accountType?.filter(n => n);
      body['AccountID'] = Ids.toString();
    }
    this.bodyParam = body;
    this._PanelServe.getPublishedJobList(body).subscribe(
      res => {
        this.panelList = res['data'];
        this.paginationData = res['pagination'][0];
      }
    )
  }


  public isResetFilter: boolean = false;
  getSortData(data: string) {
    this.isResetSearch = true;
    this.isResetFilter = false;
    this.searchInput = '';
    this.sortParam = data;
    this.jumpFirstPage = false;
    this.jumpFirstPage = true;
    this.getPublishedJobList(1, CONSTANTS.PAGE_SIZE, this.searchInput, data);
  }

  /**
  * pagination method
  * @param pageEvent 
  */
  getPagingData(pageEvent: any) {
    this.getPublishedJobList(pageEvent.pageIndex + 1, pageEvent.pageSize, this.searchInput ? this.searchInput : null, this.sortParam);
  }

  /***
     * search
     */
  getSearchValueKey(e: any) {
    this.isResetSearch = false;
    this.searchInput = e;
    this.jumpFirstPage = false;
    this.jumpFirstPage = true;
    this.getPublishedJobList(1, CONSTANTS.PAGE_SIZE, e, this.sortParam);
  }



  /***
   *Update Publish Job
   */
  updatePublishJob(element: any) {
    element['action'] = 'U';
    element['title'] = 'Update Publish Job - ' + element.talentId;
    element['thidM'] = element.thid;
    const dialogRef = this.dialog.open(PublishJobsModalComponent, {
      panelClass: ['ats-model-wrap', 'publish-job-modal'],
      data: element,
    });
    dialogRef.afterClosed().subscribe(
      res => {
        if (res) {
          this.paginatorCompRef.paginator.pageIndex = 0;
          this.getPublishedJobList(1, CONSTANTS.PAGE_SIZE, null, null);
        }
      }
    );

  }


  /**view candidate full details modal open */
  viweTalentFullDetailsModal(elm: any) {
    elm['isIJPView'] = true;
    elm['title'] = 'View Talent ID Details';
    elm['TH_ID'] = elm?.thid;
    const dialogRef = this.dialog.open(ViewTalentFullDetailsModalComponent, {
      panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
      data: elm,
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%'
    });
    dialogRef.afterClosed().subscribe(
      res => {
        if (res) {
        }
      }
    );
  }

  /***
   * open slot nomination modal
   */
  openSlotNominationModal(element: any) {
    element['title'] = 'Slot Nomination';
    const dialogRef = this.dialog.open(SlotNominationModalComponent, {
      //  panelClass: ['ats-model-wrap', 'slot-nomination-modal'],
      panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
      data: element,
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%'
    });

    dialogRef.afterClosed().subscribe(
      res => {
        if (res) {
          this.paginatorCompRef.paginator.pageIndex = 0;
          this.getPublishedJobList(1, CONSTANTS.PAGE_SIZE, null, null);
        }
      }
    );
  }
  /**open Notification Employee List Modal*/
  openNotificationEmployeeListModal(elm: any) {
    elm['title'] = ""
    const dialogRef = this.dialog.open(ViewInvitedRecruitersListModalComponent, {
      width: '650px',
      // max-height: '250px',
      panelClass: ['ats-model-wrap', 'view-offered-candidate-popup',],
      data: elm,
    });
    dialogRef.afterClosed().subscribe(
      res => {
        if (res) {
        }
      }
    );
  }

}
